import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { getUploadsDir } from "@/lib/storage";
import {
  validateUploadedImage,
  generateSafeImageFilename,
} from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
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

    // Resolve uploads directory
    const dataDir = getUploadsDir();

    // Standardize and sanitize filename
    const originalName = (file as any).name as string | undefined;
    const uniqueName = generateSafeImageFilename(
      originalName,
      "plant",
      validation.ext || "jpg"
    );
    const filePath = join(dataDir, uniqueName);

    await writeFile(filePath, buffer);

    return NextResponse.json({ filename: uniqueName });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
