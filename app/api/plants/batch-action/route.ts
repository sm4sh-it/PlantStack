import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { plantIds, action } = await req.json();

    if (!Array.isArray(plantIds) || plantIds.length === 0) {
      return NextResponse.json({ error: "plantIds array required" }, { status: 400 });
    }

    const now = new Date();

    if (action === "water") {
      await prisma.plant.updateMany({
        where: { id: { in: plantIds } },
        data: {
          lastWatered: now,
          wateredCount: { increment: 1 },
        },
      });

      const eventsData = plantIds.map((id: string) => ({
        plantId: id,
        type: "WATER",
        createdAt: now,
      }));

      await prisma.plantEvent.createMany({
        data: eventsData,
      });

      return NextResponse.json({ success: true, count: plantIds.length });
    }

    return NextResponse.json({ error: "Unsupported batch action" }, { status: 400 });
  } catch (error) {
    console.error("Batch action failed", error);
    return NextResponse.json({ error: "Batch action failed" }, { status: 500 });
  }
}
