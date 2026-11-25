import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import AdmZip from "adm-zip";
import { getUploadsDir } from "@/lib/storage";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import {
  validateImageMagicBytes,
  sanitizeStoredImageFilename,
  resolveSafeUploadPath,
} from "@/lib/security";
import { preflightZipCentralDirectory } from "@/lib/zipPreflight";

const MAX_ARCHIVE_FILES = 300;
const MAX_BACKUP_UPLOAD_SIZE = 150 * 1024 * 1024; // 150 MB
const MAX_TOTAL_UNCOMPRESSED_SIZE = 150 * 1024 * 1024; // 150 MB
const MAX_SINGLE_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

export async function POST(req: NextRequest) {
  try {
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (/size|limit|large|length|body/i.test(msg)) {
        return NextResponse.json(
          { error: "Backup archive exceeds the 150 MB upload limit" },
          { status: 413 }
        );
      }
      return NextResponse.json({ error: "Invalid multipart backup upload" }, { status: 400 });
    }

    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No backup file uploaded" }, { status: 400 });
    }

    if (file.size > MAX_BACKUP_UPLOAD_SIZE) {
      return NextResponse.json(
        { error: "Backup archive exceeds the 150 MB upload limit" },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    if (buffer.length > MAX_BACKUP_UPLOAD_SIZE) {
      return NextResponse.json(
        { error: "Backup archive exceeds the 150 MB upload limit" },
        { status: 413 }
      );
    }

    // 0. Preflight raw ZIP Central Directory headers before instantiating AdmZip
    const preflight = preflightZipCentralDirectory(buffer, {
      maxFiles: MAX_ARCHIVE_FILES,
      maxSingleFileSize: MAX_SINGLE_FILE_SIZE,
      maxTotalUncompressedSize: MAX_TOTAL_UNCOMPRESSED_SIZE,
    });
    if (!preflight.ok) {
      return NextResponse.json(
        { error: preflight.error || "Invalid backup archive" },
        { status: 400 }
      );
    }

    const zip = new AdmZip(buffer);

    // 1. Look for and validate data.json entry before decompression and JSON parsing
    const dataEntry = zip.getEntry("data.json");
    if (!dataEntry || dataEntry.isDirectory) {
      return NextResponse.json(
        { error: "Invalid backup: data.json not found in archive" },
        { status: 400 }
      );
    }

    if (dataEntry.header.size > MAX_SINGLE_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `Archive rejected: data.json exceeds single-file size limit (${MAX_SINGLE_FILE_SIZE / (1024 * 1024)} MB)`,
        },
        { status: 400 }
      );
    }

    const dataBuffer = dataEntry.getData();
    if (dataBuffer.length > MAX_SINGLE_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `Archive rejected: Decompressed data.json exceeds single-file size limit (${MAX_SINGLE_FILE_SIZE / (1024 * 1024)} MB)`,
        },
        { status: 400 }
      );
    }

    let data: any;
    try {
      const jsonStr = dataBuffer.toString("utf-8");
      data = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json(
        { error: "Invalid backup: data.json is not valid JSON" },
        { status: 400 }
      );
    }

    if (!Array.isArray(data.locations) || !Array.isArray(data.plants)) {
      return NextResponse.json(
        { error: "Invalid backup format: missing locations or plants" },
        { status: 400 }
      );
    }

    // Validate imagePath fields in data.json before touching disk or DB
    for (const p of data.plants) {
      if (p?.imagePath !== undefined && p?.imagePath !== null && p?.imagePath !== "") {
        if (!sanitizeStoredImageFilename(p.imagePath)) {
          return NextResponse.json(
            { error: "Invalid backup: unsafe plant imagePath in data.json" },
            { status: 400 }
          );
        }
      }
      if (Array.isArray(p?.photos)) {
        for (const ph of p.photos) {
          if (!sanitizeStoredImageFilename(ph?.imagePath)) {
            return NextResponse.json(
              { error: "Invalid backup: unsafe growth photo imagePath in data.json" },
              { status: 400 }
            );
          }
        }
      }
    }

    // 2. Comprehensive Archive Validation (actual decompressed bounds, Zip-Slip, Magic Bytes)
    const uploadsDir = getUploadsDir();
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    const zipEntries = zip.getEntries();
    let actualTotalUncompressedSize = dataBuffer.length;
    let fileCount = 0;
    const validatedUploads: Array<{ destPath: string; data: Buffer }> = [];

    for (const entry of zipEntries) {
      if (entry.isDirectory) continue;
      fileCount++;

      if (fileCount > MAX_ARCHIVE_FILES) {
        return NextResponse.json(
          { error: `Archive rejected: Exceeds maximum allowed file count (${MAX_ARCHIVE_FILES})` },
          { status: 400 }
        );
      }

      if (entry.header.size > MAX_SINGLE_FILE_SIZE) {
        return NextResponse.json(
          {
            error: `Archive rejected: File "${entry.entryName}" exceeds single-file size limit (${MAX_SINGLE_FILE_SIZE / (1024 * 1024)} MB)`,
          },
          { status: 400 }
        );
      }

      if (entry.entryName === "data.json") {
        continue;
      }

      if (entry.entryName.startsWith("uploads/")) {
        const rawFileName = entry.entryName.slice("uploads/".length);
        if (!rawFileName) {
          continue;
        }
        if (
          rawFileName.includes("/") ||
          rawFileName.includes("\\") ||
          rawFileName.includes("..")
        ) {
          return NextResponse.json(
            { error: `Archive rejected: Path traversal attempt detected in "${entry.entryName}"` },
            { status: 400 }
          );
        }

        const safeFileName = sanitizeStoredImageFilename(rawFileName);
        if (!safeFileName) {
          return NextResponse.json(
            {
              error: `Archive rejected: Disallowed filename or extension in uploads ("${rawFileName}"). Only JPEG/PNG/WebP images allowed.`,
            },
            { status: 400 }
          );
        }

        const destPath = resolveSafeUploadPath(uploadsDir, safeFileName);
        if (!destPath) {
          return NextResponse.json(
            { error: `Archive rejected: Path traversal attempt detected in "${entry.entryName}"` },
            { status: 400 }
          );
        }

        const entryBuffer = entry.getData();
        if (entryBuffer.length > MAX_SINGLE_FILE_SIZE) {
          return NextResponse.json(
            {
              error: `Archive rejected: Decompressed file "${safeFileName}" exceeds single-file size limit (${MAX_SINGLE_FILE_SIZE / (1024 * 1024)} MB)`,
            },
            { status: 400 }
          );
        }

        actualTotalUncompressedSize += entryBuffer.length;
        if (actualTotalUncompressedSize > MAX_TOTAL_UNCOMPRESSED_SIZE) {
          return NextResponse.json(
            {
              error: `Archive rejected: Exceeds total uncompressed size limit (${MAX_TOTAL_UNCOMPRESSED_SIZE / (1024 * 1024)} MB)`,
            },
            { status: 400 }
          );
        }

        const magicCheck = validateImageMagicBytes(entryBuffer);
        if (!magicCheck.valid) {
          return NextResponse.json(
            { error: `Archive rejected: Uploaded file "${safeFileName}" has invalid image signature` },
            { status: 400 }
          );
        }

        validatedUploads.push({ destPath, data: entryBuffer });
      } else {
        return NextResponse.json(
          {
            error: `Archive rejected: Unexpected entry "${entry.entryName}". Only "data.json" and "uploads/*" are permitted.`,
          },
          { status: 400 }
        );
      }
    }

    // 3. Write validated image files to disk (only after all validation passes)
    for (const upload of validatedUploads) {
      try {
        writeFileSync(upload.destPath, upload.data);
      } catch (err) {
        console.error(`Failed to write uploaded image ${upload.destPath}:`, err);
      }
    }

    // 4. Restore database in transaction
    await prisma.$transaction(async (tx) => {
      await tx.plantEvent.deleteMany();
      await tx.plantPhoto.deleteMany();
      await tx.plant.deleteMany();
      await tx.location.deleteMany();

      for (const loc of data.locations) {
        await tx.location.create({
          data: {
            id: loc.id,
            name: loc.name,
            createdAt: loc.createdAt ? new Date(loc.createdAt) : new Date(),
          },
        });
      }

      for (const p of data.plants) {
        const safePlantImage = sanitizeStoredImageFilename(p.imagePath);
        await tx.plant.create({
          data: {
            id: p.id,
            name: p.name,
            alias: p.alias || null,
            scientificName: p.scientificName || null,
            locationId: p.locationId,
            locationType: p.locationType || "INDOOR",
            plantType: p.plantType || "Zierpflanze",
            placement: p.placement || "Drinnen",
            pruningInfo: p.pruningInfo || null,
            apiId: p.apiId || null,
            origin: p.origin || null,
            wateredCount: p.wateredCount || 0,
            isArchived: Boolean(p.isArchived),
            archivedAt: p.archivedAt ? new Date(p.archivedAt) : null,
            waterInterval: p.waterInterval,
            fertilizerInterval: p.fertilizerInterval || null,
            bugInterval: p.bugInterval || null,
            fungusInterval: p.fungusInterval || null,
            wateringInfo: p.wateringInfo || null,
            sunlightInfo: p.sunlightInfo || null,
            lastWatered: p.lastWatered ? new Date(p.lastWatered) : new Date(),
            lastFertilized: p.lastFertilized ? new Date(p.lastFertilized) : null,
            lastBug: p.lastBug ? new Date(p.lastBug) : null,
            lastFungus: p.lastFungus ? new Date(p.lastFungus) : null,
            lastPruned: p.lastPruned ? new Date(p.lastPruned) : null,
            lastRepotted: p.lastRepotted ? new Date(p.lastRepotted) : null,
            imagePath: safePlantImage,
            notes: p.notes || null,
            createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
            updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
            events:
              p.events && p.events.length > 0
                ? {
                    create: p.events.map((e: any) => ({
                      id: e.id,
                      type: e.type,
                      createdAt: e.createdAt ? new Date(e.createdAt) : new Date(),
                    })),
                  }
                : undefined,
            photos:
              p.photos && p.photos.length > 0
                ? {
                    create: p.photos.map((ph: any) => ({
                      id: ph.id,
                      imagePath: sanitizeStoredImageFilename(ph.imagePath)!,
                      note: ph.note || null,
                      createdAt: ph.createdAt ? new Date(ph.createdAt) : new Date(),
                    })),
                  }
                : undefined,
          },
        });
      }

      if (data.config) {
        await tx.appConfig.upsert({
          where: { id: 1 },
          update: {
            language: data.config.language || "en",
            gridColumns: data.config.gridColumns || 4,
            dashboardTitle: data.config.dashboardTitle || "My Jungle",
            latitude: data.config.latitude ?? null,
            longitude: data.config.longitude ?? null,
            locationName: data.config.locationName ?? null,
            winterDormancyEnabled: Boolean(data.config.winterDormancyEnabled),
          },
          create: {
            id: 1,
            language: data.config.language || "en",
            gridColumns: data.config.gridColumns || 4,
            dashboardTitle: data.config.dashboardTitle || "My Jungle",
            latitude: data.config.latitude ?? null,
            longitude: data.config.longitude ?? null,
            locationName: data.config.locationName ?? null,
            winterDormancyEnabled: Boolean(data.config.winterDormancyEnabled),
          },
        });
      }
    });

    return NextResponse.json({
      success: true,
      plantCount: data.plants.length,
      locationCount: data.locations.length,
    });
  } catch (error) {
    console.error("Backup restore error:", error);
    return NextResponse.json({ error: "Failed to restore backup" }, { status: 500 });
  }
}
