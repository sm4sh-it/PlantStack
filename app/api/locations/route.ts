import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const locations = await prisma.location.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(locations);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const loc = await prisma.location.create({ data: { name: data.name } });
  return NextResponse.json(loc);
}
