import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // 1. Reset all wateredCount to 0
    await prisma.plant.updateMany({
      data: { wateredCount: 0 }
    });
    
    // 2. Delete all PlantEvent entries
    await prisma.plantEvent.deleteMany();

    return NextResponse.json({ success: true, message: "Statistics and history reset successfully." });
  } catch (error) {
    console.error("Failed to reset statistics:", error);
    return NextResponse.json({ error: "Failed to reset statistics" }, { status: 500 });
  }
}
