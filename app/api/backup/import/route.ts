import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import AdmZip from "adm-zip";
import { getUploadsDir } from "@/lib/storage";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join, resolve, basename } from "path";
import { ALLOWED_IMAGE_EXTENSIONS, validateImageMagicBytes } from "@/lib/security";

const MAX_ARCHIVE_FILES = 300;
const MAX_TOTAL_UNCOMPRESSED_SIZE = 150 * 1024 * 1024; // 150 MB
const MAX_SINGLE_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No backup file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const zip = new AdmZip(Buffer.from(bytes));

    // 1. Look for and validate data.json entry
    const dataEntry = zip.getEntry("data.json");
    if (!dataEntry) {
      return NextResponse.json({ error: "Invalid backup: data.json not found in archive" }, { status: 400 });
    }

    let data: any;
    try {
      const jsonStr = dataEntry.getData().toString("utf-8");
      data = JSON.parse(jsonStr);
    } catch (e) {
      return NextResponse.json({ error: "Invalid backup: data.json is not valid JSON" }, { status: 400 });
    }

    if (!Array.isArray(data.locations) || !Array.isArray(data.plants)) {
      return NextResponse.json({ error: "Invalid backup format: missing locations or plants" }, { status: 400 });
    }

    // 2. Comprehensive Archive Validation (Anti-Zip-Bomb, Zip-Slip, Magic Bytes)
    const uploadsDir = getUploadsDir();
    const resolvedUploadsDir = resolve(uploadsDir);
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    const zipEntries = zip.getEntries();
    let totalUncompressedSize = 0;
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

      const entrySize = entry.header.size;
      if (entrySize > MAX_SINGLE_FILE_SIZE) {
        return NextResponse.json(
          { error: `Archive rejected: File "${entry.entryName}" exceeds single-file size limit (${MAX_SINGLE_FILE_SIZE / (1024 * 1024)} MB)` },
          { status: 400 }
        );
      }

      totalUncompressedSize += entrySize;
      if (totalUncompressedSize > MAX_TOTAL_UNCOMPRESSED_SIZE) {
        return NextResponse.json(
          { error: `Archive rejected: Exceeds total uncompressed size limit (${MAX_TOTAL_UNCOMPRESSED_SIZE / (1024 * 1024)} MB)` },
          { status: 400 }
        );
      }

      // Allow data.json
      if (entry.entryName === "data.json") {
        continue;
      }

      // Check upload entries
      if (entry.entryName.startsWith("uploads/")) {
        const rawFileName = entry.entryName.replace(/^uploads\//, "");
        const safeFileName = basename(rawFileName).replace(/[^a-zA-Z0-9.\-_]/g, "");

        if (!safeFileName) {
          continue;
        }

        const ext = safeFileName.split(".").pop()?.toLowerCase();
        if (!ext || !ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
          return NextResponse.json(
            { error: `Archive rejected: Disallowed file extension in uploads ("${safeFileName}"). Only images allowed.` },
            { status: 400 }
          );
        }

        const destPath = join(uploadsDir, safeFileName);
        const resolvedDest = resolve(destPath);

        // Enforce Zip-Slip containment
        if (!resolvedDest.startsWith(resolvedUploadsDir + "/") && !resolvedDest.startsWith(resolvedUploadsDir + "\\")) {
          return NextResponse.json(
            { error: `Archive rejected: Path traversal attempt detected in "${entry.entryName}"` },
            { status: 400 }
          );
        }

        const entryBuffer = entry.getData();
        const magicCheck = validateImageMagicBytes(entryBuffer);
        if (!magicCheck.valid) {
          return NextResponse.json(
            { error: `Archive rejected: Uploaded file "${safeFileName}" has invalid image signature` },
            { status: 400 }
          );
        }

        validatedUploads.push({ destPath: resolvedDest, data: entryBuffer });
      } else {
        // Disallow arbitrary extra files in archive root or subdirectories
        return NextResponse.json(
          { error: `Archive rejected: Unexpected entry "${entry.entryName}". Only "data.json" and "uploads/*" are permitted.` },
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

    // Restore database in transaction
    await prisma.$transaction(async (tx) => {
      // 1. Clean existing records
      await tx.plantEvent.deleteMany();
      await tx.plantPhoto.deleteMany();
      await tx.plant.deleteMany();
      await tx.location.deleteMany();

      // 2. Restore locations
      for (const loc of data.locations) {
        await tx.location.create({
          data: {
            id: loc.id,
            name: loc.name,
            createdAt: loc.createdAt ? new Date(loc.createdAt) : new Date(),
          },
        });
      }

      // 3. Restore plants
      for (const p of data.plants) {
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
            imagePath: p.imagePath || null,
            notes: p.notes || null,
            createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
            updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
            events: p.events && p.events.length > 0 ? {
              create: p.events.map((e: any) => ({
                id: e.id,
                type: e.type,
                createdAt: e.createdAt ? new Date(e.createdAt) : new Date(),
              })),
            } : undefined,
            photos: p.photos && p.photos.length > 0 ? {
              create: p.photos.map((ph: any) => ({
                id: ph.id,
                imagePath: ph.imagePath,
                note: ph.note || null,
                createdAt: ph.createdAt ? new Date(ph.createdAt) : new Date(),
              })),
            } : undefined,
          },
        });
      }

      // 4. Restore config if present
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
