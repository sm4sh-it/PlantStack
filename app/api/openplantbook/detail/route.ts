export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getPlantDetails } from "@/lib/openplantbook";
import { cropsData } from "@/lib/crops";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pid = searchParams.get("pid");

  if (!pid) return NextResponse.json({ error: "Missing pid" }, { status: 400 });

  try {
    if (pid.startsWith("crop_")) {
      const crop = cropsData.find(c => c.id === pid);
      if (crop) {
        return NextResponse.json({
          pid: crop.id,
          display_pid: crop.name.en,
          alias: crop.name.de,
          min_soil_moist: crop.watering_interval_days <= 2 ? 45 : (crop.watering_interval_days >= 7 ? 10 : 30),
          min_light_lux: crop.sunlight === "full_sun" ? 50000 : (crop.sunlight === "partial_shade" ? 10000 : 1000),
          min_temp: crop.frost_hardy ? -10 : 5,
          max_temp: 35,
          pruning_month: [crop.pruning.de],
          watering_interval_days: crop.watering_interval_days,
          sunlight_text: crop.sunlight
        });
      }
    }

    const data = await getPlantDetails(pid);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch details from Open Plantbook" }, { status: 500 });
  }
}
