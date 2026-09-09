import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";
import { getUploadsDir } from "@/lib/storage";
import {
  validateUploadedImage,
  generateSafeImageFilename,
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
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;
    const note = (formData.get("note") as string) || null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
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

    const uploadsDir = getUploadsDir();
    const originalName = (file as any).name as string | undefined;
    const uniqueName = generateSafeImageFilename(
      originalName,
      `growth-${params.id.slice(0, 8)}`,
      validation.ext || "jpg"
    );
    const filePath = join(uploadsDir, uniqueName);

    await writeFile(filePath, buffer);

    const photo = await prisma.plantPhoto.create({
      data: {
        plantId: params.id,
        imagePath: uniqueName,
        note: note ? note.trim() : null,
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error("Add photo error:", error);
    return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 });
  }
}
