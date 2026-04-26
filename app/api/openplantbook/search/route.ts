export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { searchPlants } from "@/lib/openplantbook";
import { cropsData } from "@/lib/crops";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) return NextResponse.json({ error: "Missing query" }, { status: 400 });

  try {
    const qLower = q.toLowerCase();
    const localMatches = cropsData.filter(c => 
      c.name.de.toLowerCase().includes(qLower) || 
      c.name.en.toLowerCase().includes(qLower)
    );

    if (localMatches.length > 0) {
      const results = localMatches.map(c => ({
        pid: c.id,
        display_pid: c.name.en,
        alias: c.name.de,
      }));
      return NextResponse.json({ results });
    }

    const data = await searchPlants(q);
    return NextResponse.json({ results: data.results || [] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch from Open Plantbook" }, { status: 500 });
  }
}
