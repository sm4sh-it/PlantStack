export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const plants = await prisma.plant.findMany({
      orderBy: { createdAt: "desc" },
      include: { location: true }
    });
    return NextResponse.json(plants);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plants" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const plant = await prisma.plant.create({
      data: {
        name: data.name,
        locationId: data.locationId,
        waterInterval: parseInt(data.waterInterval),
        fertilizerInterval: data.fertilizerInterval ? parseInt(data.fertilizerInterval) : null,
        bugInterval: data.bugInterval ? parseInt(data.bugInterval) : null,
        fungusInterval: data.fungusInterval ? parseInt(data.fungusInterval) : null,
        imagePath: data.imagePath || null,
        notes: data.notes || null,
        scientificName: data.scientificName || null,
        alias: data.alias || null,
        wateringInfo: data.wateringInfo || null,
        sunlightInfo: data.sunlightInfo || null,
      },
    });
    return NextResponse.json(plant);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create plant" }, { status: 500 });
  }
}
