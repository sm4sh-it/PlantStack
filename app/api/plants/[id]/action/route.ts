import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const body = await req.json();
    const { action, previousData } = body;
    const now = new Date();

    let updateData: any = {};
    if (action === "water") {
      updateData.lastWatered = now;
      updateData.wateredCount = { increment: 1 };
    }
    if (action === "fertilize") updateData.lastFertilized = now;
    if (action === "bug") updateData.lastBug = now;
    if (action === "fungus") updateData.lastFungus = now;
    if (action === "prune") updateData.lastPruned = now;
    if (action === "repot") updateData.lastRepotted = now;

    if (action === "snooze") {
      const existing = await prisma.plant.findUnique({ where: { id: params.id } });
      if (existing) {
        const snoozeDays = 2;
        const targetDue = new Date(now.getTime() + snoozeDays * 24 * 60 * 60 * 1000);
        updateData.lastWatered = new Date(targetDue.getTime() - existing.waterInterval * 24 * 60 * 60 * 1000);
      }
    }

    if (action === "revert" && previousData) {
      if (previousData.lastWatered !== undefined) updateData.lastWatered = new Date(previousData.lastWatered);
      if (previousData.lastFertilized !== undefined) updateData.lastFertilized = previousData.lastFertilized ? new Date(previousData.lastFertilized) : null;
      if (previousData.lastBug !== undefined) updateData.lastBug = previousData.lastBug ? new Date(previousData.lastBug) : null;
      if (previousData.lastFungus !== undefined) updateData.lastFungus = previousData.lastFungus ? new Date(previousData.lastFungus) : null;
      if (previousData.lastPruned !== undefined) updateData.lastPruned = previousData.lastPruned ? new Date(previousData.lastPruned) : null;
      if (previousData.lastRepotted !== undefined) updateData.lastRepotted = previousData.lastRepotted ? new Date(previousData.lastRepotted) : null;
      if (previousData.wateredCount !== undefined) updateData.wateredCount = previousData.wateredCount;

      const latestEvent = await prisma.plantEvent.findFirst({
        where: { plantId: params.id },
        orderBy: { createdAt: "desc" }
      });
      if (latestEvent) {
        await prisma.plantEvent.delete({ where: { id: latestEvent.id } });
      }
    }

    const plant = await prisma.plant.update({
      where: { id: params.id },
      data: updateData,
    });

    const validActions = ["water", "fertilize", "bug", "fungus", "prune", "repot"];
    if (validActions.includes(action)) {
      await prisma.plantEvent.create({
        data: {
          plantId: params.id,
          type: action.toUpperCase()
        }
      });
    }

    return NextResponse.json(plant);
  } catch (error) {
    return NextResponse.json({ error: "Failed to perform action" }, { status: 500 });
  }
}
