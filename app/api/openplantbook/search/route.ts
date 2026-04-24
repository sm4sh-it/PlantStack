export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { searchPlants } from "@/lib/openplantbook";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) return NextResponse.json({ error: "Missing query" }, { status: 400 });

  try {
    const data = await searchPlants(q);
    return NextResponse.json({ results: data.results || [] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch from Open Plantbook" }, { status: 500 });
  }
}
