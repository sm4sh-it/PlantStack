export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const plants = await prisma.plant.findMany({
      where: { isArchived: true },
      orderBy: { createdAt: "desc" },
      include: { location: true }
    });

    return NextResponse.json(plants);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch archived plants" }, { status: 500 });
  }
}
