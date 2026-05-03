import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { action } = await req.json();
    const now = new Date();

    let updateData: any = {};
    if (action === "water") {
      updateData.lastWatered = now;
      updateData.wateredCount = { increment: 1 };
    }
    if (action === "fertilize") updateData.lastFertilized = now;
    if (action === "bug") updateData.lastBug = now;
    if (action === "fungus") updateData.lastFungus = now;

    const plant = await prisma.plant.update({
      where: { id: params.id },
      data: updateData,
    });
    return NextResponse.json(plant);
  } catch (error) {
    return NextResponse.json({ error: "Failed to perform action" }, { status: 500 });
  }
}
