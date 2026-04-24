export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getPlantDetails } from "@/lib/openplantbook";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pid = searchParams.get("pid");

  if (!pid) return NextResponse.json({ error: "Missing pid" }, { status: 400 });

  try {
    const data = await getPlantDetails(pid);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch details from Open Plantbook" }, { status: 500 });
  }
}
