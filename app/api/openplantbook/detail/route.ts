export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getPlantDetails } from "@/lib/openplantbook";
import { cropsData } from "@/lib/crops";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pid = searchParams.get("pid");
  const lang = (searchParams.get("lang") as "en" | "de") || "en";

  if (!pid) return NextResponse.json({ error: "Missing pid" }, { status: 400 });

  const getMonthName = (m: number, l: "en" | "de") => {
    const d = new Date();
    d.setMonth(m - 1);
    return d.toLocaleString(l === "de" ? "de-DE" : "en-US", { month: "long" });
  };

  const getCropName = (id: string, l: "en" | "de"): string | null => {
    const found = cropsData.find(c => c.id === id);
    return found ? found.name[l] : null;
  };

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
          pruning_month: [crop.pruning[lang] || crop.pruning.en],
          watering_interval_days: crop.watering_interval_days,
          sunlight_text: crop.sunlight,
          good_neighbors: crop.good_neighbors.map(id => getCropName(id, lang)).filter(Boolean),
          bad_neighbors: crop.bad_neighbors.map(id => getCropName(id, lang)).filter(Boolean),
          sowing_outdoors_month: crop.sowing_outdoors_month ? getMonthName(crop.sowing_outdoors_month, lang) : null
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
