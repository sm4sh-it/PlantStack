import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const plant = await prisma.plant.update({
      where: { id: params.id },
      data: { isArchived: false },
    });
    return NextResponse.json(plant);
  } catch (error) {
    return NextResponse.json({ error: "Failed to restore plant" }, { status: 500 });
  }
}
