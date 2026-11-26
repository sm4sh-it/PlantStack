import { NextResponse } from "next/server";
import { existsSync } from "fs";
import { lstat, readdir, readFile, unlink, writeFile } from "fs/promises";
import { join } from "path";
import sharp from "sharp";
import prisma from "@/lib/prisma";
import { getUploadsDir, removeCachedThumb } from "@/lib/storage";
import {
  MAX_IMAGE_DIMENSION,
  MAX_IMAGE_INPUT_PIXELS,
  resolveSafeUploadPath,
  sanitizeAndEncodeImage,
  sanitizeStoredImageFilename,
} from "@/lib/security";

const RECOMPRESS_THRESHOLD_BYTES = 250 * 1024;

async function listUploadImageStats() {
  const uploadsDir = getUploadsDir();
  if (!existsSync(uploadsDir)) {
    return { fileCount: 0, totalBytes: 0, entries: [] as Array<{ name: string; path: string; size: number }> };
  }

  const rawEntries = await readdir(uploadsDir);
  const entries: Array<{ name: string; path: string; size: number }> = [];
  let totalBytes = 0;

  for (const entry of rawEntries) {
    const safeName = sanitizeStoredImageFilename(entry);
    if (!safeName) continue;
    const filePath = resolveSafeUploadPath(uploadsDir, safeName);
    if (!filePath) continue;
    try {
      const st = await lstat(filePath);
      if (!st.isFile()) continue;
      entries.push({ name: safeName, path: filePath, size: st.size });
      totalBytes += st.size;
    } catch {
      continue;
    }
  }

  return { fileCount: entries.length, totalBytes, entries };
}

export async function GET() {
  try {
    const stats = await listUploadImageStats();
    return NextResponse.json({
      fileCount: stats.fileCount,
      totalBytes: stats.totalBytes,
    });
  } catch (error) {
    console.error("Failed to scan upload stats:", error);
    return NextResponse.json({ error: "Failed to scan media directory" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const uploadsDir = getUploadsDir();
    const { entries } = await listUploadImageStats();

    let scanned = 0;
    let optimized = 0;
    let skipped = 0;
    let bytesBefore = 0;
    let bytesAfter = 0;

    for (const file of entries) {
      scanned += 1;
      bytesBefore += file.size;

      try {
        const ext = file.name.split(".").pop()?.toLowerCase();
        const meta = await sharp(file.path, { limitInputPixels: MAX_IMAGE_INPUT_PIXELS }).metadata();
        const oversized =
          (meta.width ?? 0) > MAX_IMAGE_DIMENSION ||
          (meta.height ?? 0) > MAX_IMAGE_DIMENSION;
        const needsCheck = oversized || ext !== "webp" || file.size > RECOMPRESS_THRESHOLD_BYTES;

        if (!needsCheck) {
          skipped += 1;
          bytesAfter += file.size;
          continue;
        }

        const inputBuffer = await readFile(file.path);
        const encoded = await sanitizeAndEncodeImage(inputBuffer);

        if (ext === "webp") {
          const meaningfullySmaller = encoded.buffer.length < file.size * 0.95;
          if (!oversized && !meaningfullySmaller) {
            skipped += 1;
            bytesAfter += file.size;
            continue;
          }

          await writeFile(file.path, encoded.buffer);
          await removeCachedThumb(file.name);
          optimized += 1;
          bytesAfter += encoded.buffer.length;
        } else {
          // Legacy JPEG/PNG: write matching .webp file so Content-Type stays accurate
          const stem = file.name.replace(/\.[^.]+$/, "");
          let targetName = `${stem}.webp`;
          let targetPath = join(uploadsDir, targetName);
          if (existsSync(targetPath)) {
            targetName = `${stem}-opt-${Date.now()}.webp`;
            targetPath = join(uploadsDir, targetName);
          }

          await writeFile(targetPath, encoded.buffer);
          await prisma.$transaction([
            prisma.plant.updateMany({
              where: { imagePath: file.name },
              data: { imagePath: targetName },
            }),
            prisma.plantPhoto.updateMany({
              where: { imagePath: file.name },
              data: { imagePath: targetName },
            }),
          ]);

          await unlink(file.path).catch(() => {});
          await removeCachedThumb(file.name);
          optimized += 1;
          bytesAfter += encoded.buffer.length;
        }
      } catch (err) {
        console.error(`Failed to optimize ${file.name}:`, err);
        skipped += 1;
        bytesAfter += file.size;
      }
    }

    const updatedStats = await listUploadImageStats();

    return NextResponse.json({
      scanned,
      optimized,
      skipped,
      bytesBefore,
      bytesAfter,
      savedBytes: Math.max(0, bytesBefore - bytesAfter),
      fileCount: updatedStats.fileCount,
      totalBytes: updatedStats.totalBytes,
    });
  } catch (error) {
    console.error("Image optimization error:", error);
    return NextResponse.json({ error: "Failed to optimize images" }, { status: 500 });
  }
}
