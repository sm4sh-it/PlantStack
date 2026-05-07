import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const plants = await prisma.plant.findMany({
      include: { location: true }
    });
    const now = new Date();
    
    // Sort logic to match Dashboard: Overdue first
    const getDaysLeft = (last: Date, interval: number | null) => {
      if (!interval || !last) return 9999;
      const r = new Date(last);
      r.setDate(r.getDate() + interval);
      return Math.ceil((r.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    };

    const overduePlants = plants.filter(p => {
      return getDaysLeft(p.lastWatered, p.waterInterval) <= 0 ||
             getDaysLeft(p.lastFertilized || new Date(0), p.fertilizerInterval) <= 0 ||
             getDaysLeft(p.lastBug || new Date(0), p.bugInterval) <= 0 ||
             getDaysLeft(p.lastFungus || new Date(0), p.fungusInterval) <= 0;
    }).map(p => ({
       id: p.id,
       name: p.name,
       location: p.location?.name || "Unassigned",
       waterDueDays: getDaysLeft(p.lastWatered, p.waterInterval),
       // We can export more fields if external API wants
    }));
    
    return NextResponse.json({ status: "success", count: overduePlants.length, overdue: overduePlants });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
