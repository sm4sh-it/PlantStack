import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import AdmZip from "adm-zip";
import { getUploadsDir } from "@/lib/storage";
import { existsSync, lstatSync, readFileSync } from "fs";
import { resolveSafeUploadPath, sanitizeStoredImageFilename } from "@/lib/security";

export async function GET() {
  try {
    const [locations, plants, config] = await Promise.all([
      prisma.location.findMany(),
      prisma.plant.findMany({
        include: {
          events: true,
          photos: true,
        },
      }),
      prisma.appConfig.findFirst(),
    ]);

    const backupData = {
      version: "3.0.0",
      exportedAt: new Date().toISOString(),
      locations,
      plants,
      config,
    };

    const zip = new AdmZip();
    zip.addFile("data.json", Buffer.from(JSON.stringify(backupData, null, 2), "utf-8"));

    // Only archive regular image files actively referenced by plants or growth photos
    const referencedFiles = new Set<string>();
    for (const plant of plants) {
      const cover = sanitizeStoredImageFilename(plant.imagePath);
      if (cover) referencedFiles.add(cover);
      for (const photo of plant.photos) {
        const growth = sanitizeStoredImageFilename(photo.imagePath);
        if (growth) referencedFiles.add(growth);
      }
    }

    const uploadsDir = getUploadsDir();
    if (existsSync(uploadsDir)) {
      for (const file of Array.from(referencedFiles)) {
        const filePath = resolveSafeUploadPath(uploadsDir, file);
        if (!filePath || !existsSync(filePath)) continue;
        try {
          if (lstatSync(filePath).isFile()) {
            const fileData = readFileSync(filePath);
            zip.addFile(`uploads/${file}`, fileData);
          }
        } catch (e) {
          console.error(`Failed to add ${file} to backup:`, e);
        }
      }
    }

    const zipBuffer = zip.toBuffer();
    const dateStr = new Date().toISOString().slice(0, 10);

    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="plantstack-backup-${dateStr}.zip"`,
        "Content-Length": zipBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Backup export error:", error);
    return NextResponse.json({ error: "Failed to generate backup" }, { status: 500 });
  }
}
