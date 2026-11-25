import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unlinkUnusedImages } from "@/lib/storage";

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const plants = await prisma.plant.findMany({
    where: { locationId: params.id },
    select: {
      imagePath: true,
      photos: { select: { imagePath: true } },
    },
  });

  await prisma.location.delete({ where: { id: params.id } });

  const candidates = plants.flatMap((plant) => [
    plant.imagePath,
    ...plant.photos.map((photo) => photo.imagePath),
  ]);
  await unlinkUnusedImages(candidates);

  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const data = await req.json();
  const loc = await prisma.location.update({
    where: { id: params.id },
    data: { name: data.name },
  });
  return NextResponse.json(loc);
}
