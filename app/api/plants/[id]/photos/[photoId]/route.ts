import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { getUploadsDir } from "@/lib/storage";

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string; photoId: string }> }
) {
  try {
    const params = await props.params;
    const photo = await prisma.plantPhoto.findUnique({
      where: { id: params.photoId },
    });

    if (!photo || photo.plantId !== params.id) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    // Delete database record
    await prisma.plantPhoto.delete({
      where: { id: params.photoId },
    });

    // Clean up file if present
    try {
      const uploadsDir = getUploadsDir();
      const filePath = join(uploadsDir, photo.imagePath);
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    } catch (e) {
      console.warn("Could not delete physical photo file:", e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete photo error:", error);
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
  }
}
