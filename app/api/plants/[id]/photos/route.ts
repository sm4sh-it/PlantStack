import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { unlink, writeFile } from "fs/promises";
import { getUploadsDir } from "@/lib/storage";
import {
  MAX_IMAGE_FILE_SIZE,
  validateUploadedImage,
  sanitizeAndEncodeImage,
  generateSafeImageFilename,
  resolveSafeUploadPath,
} from "@/lib/security";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const photos = await prisma.plantPhoto.findMany({
      where: { plantId: params.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(photos);
  } catch (error) {
    console.error("Fetch photos error:", error);
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const plant = await prisma.plant.findUnique({
      where: { id: params.id },
      select: { id: true },
    });
    if (!plant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const note = formData.get("note");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image file size exceeds the 10 MB limit" },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const validation = validateUploadedImage(file, buffer);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || "Invalid image file" },
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

    const uploadsDir = getUploadsDir();
    const originalName = (file as { name?: string }).name;
    const uniqueName = generateSafeImageFilename(
      originalName,
      `growth-${params.id.slice(0, 8)}`,
      sanitized.ext
    );
    const filePath = resolveSafeUploadPath(uploadsDir, uniqueName);
    if (!filePath) {
      return NextResponse.json({ error: "Invalid destination path" }, { status: 400 });
    }

    await writeFile(filePath, sanitized.buffer);

    try {
      const photo = await prisma.plantPhoto.create({
        data: {
          plantId: params.id,
          imagePath: uniqueName,
          note: typeof note === "string" && note.trim() ? note.trim() : null,
        },
      });
      return NextResponse.json(photo, { status: 201 });
    } catch (dbError) {
      await unlink(filePath).catch(() => {});
      throw dbError;
    }
  } catch (error) {
    console.error("Add photo error:", error);
    return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 });
  }
}
