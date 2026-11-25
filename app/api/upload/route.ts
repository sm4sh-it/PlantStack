import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { getUploadsDir } from "@/lib/storage";
import {
  MAX_IMAGE_FILE_SIZE,
  validateUploadedImage,
  sanitizeAndEncodeImage,
  generateSafeImageFilename,
  resolveSafeUploadPath,
} from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds the 10 MB limit" },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const validation = validateUploadedImage(file, buffer);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || "Invalid file" },
        { status: 400 }
      );
    }

    let sanitized: { buffer: Buffer; ext: "webp" };
    try {
      sanitized = await sanitizeAndEncodeImage(buffer);
    } catch {
      return NextResponse.json(
        { error: "Invalid or corrupted image file" },
        { status: 400 }
      );
    }

    // Resolve uploads directory
    const dataDir = getUploadsDir();

    // Standardize and sanitize filename
    const originalName = (file as { name?: string }).name;
    const uniqueName = generateSafeImageFilename(
      originalName,
      "plant",
      sanitized.ext
    );
    const filePath = resolveSafeUploadPath(dataDir, uniqueName);
    if (!filePath) {
      return NextResponse.json({ error: "Invalid destination path" }, { status: 400 });
    }

    await writeFile(filePath, sanitized.buffer);

    return NextResponse.json({ filename: uniqueName });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
