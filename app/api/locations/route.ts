import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  let locations = await prisma.location.findMany({ orderBy: { name: 'asc' } });
  
  if (locations.length === 0) {
    try {
      const config = await prisma.appConfig.findUnique({ where: { id: 1 } });
      const defaultName = config?.language === "de" ? "Wohnzimmer" : "Living Room";
      const created = await prisma.location.create({ data: { name: defaultName } });
      locations = [created];
    } catch (e) {
      // Handle potential race condition if multiple requests hit concurrently
      locations = await prisma.location.findMany({ orderBy: { name: 'asc' } });
    }
  }

  return NextResponse.json(locations);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const loc = await prisma.location.create({ data: { name: data.name } });
  return NextResponse.json(loc);
}
