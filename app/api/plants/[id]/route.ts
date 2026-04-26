import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const plant = await prisma.plant.update({
      where: { id: params.id },
      data: {
        name: data.name,
        locationId: data.locationId !== undefined ? data.locationId : undefined,
        waterInterval: parseInt(data.waterInterval),
        fertilizerInterval: data.fertilizerInterval ? parseInt(data.fertilizerInterval) : null,
        bugInterval: data.bugInterval ? parseInt(data.bugInterval) : null,
        fungusInterval: data.fungusInterval ? parseInt(data.fungusInterval) : null,
        imagePath: data.imagePath !== undefined ? data.imagePath : undefined,
        notes: data.notes !== undefined ? data.notes : undefined,
        scientificName: data.scientificName !== undefined ? data.scientificName : undefined,
        alias: data.alias !== undefined ? data.alias : undefined,
        wateringInfo: data.wateringInfo !== undefined ? data.wateringInfo : undefined,
        sunlightInfo: data.sunlightInfo !== undefined ? data.sunlightInfo : undefined,
        locationType: data.locationType !== undefined ? data.locationType : undefined,
        pruningInfo: data.pruningInfo !== undefined ? data.pruningInfo : undefined,
      },
    });
    return NextResponse.json(plant);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update plant" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.plant.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete plant" }, { status: 500 });
  }
}
