export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getPlantDetails } from "@/lib/openplantbook";
import { cropsData } from "@/lib/crops";
import { getHouseplantById } from "@/lib/houseplants";
import { getClientIp, checkRateLimit } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(`opb-detail:${clientIp}`, 60, 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests to plant details. Please wait a moment." },
      {
        status: 429,
        headers: {
          "Retry-After": rateLimit.resetSeconds.toString(),
        },
      }
    );
  }

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
    const targetId = id === "crop_bean" ? "crop_bush_bean" : id;
    const found = cropsData.find(c => c.id === targetId);
    return found ? found.name[l] : null;
  };

  try {
    if (pid.startsWith("houseplant_")) {
      const hp = getHouseplantById(pid);
      if (hp) {
        return NextResponse.json({
          pid: hp.id,
          display_pid: hp.scientificName,
          alias: hp.name[lang] || hp.name.de,
          category: hp.category,
          min_soil_moist: hp.min_soil_moist || (hp.watering_interval_days <= 5 ? 35 : (hp.watering_interval_days >= 14 ? 10 : 25)),
          max_soil_moist: hp.max_soil_moist || 60,
          min_light_lux: hp.min_light_lux,
          max_light_lux: hp.max_light_lux,
          min_temp: hp.min_temp,
          max_temp: hp.max_temp,
          min_env_humid: hp.min_env_humid,
          watering_interval_days: hp.watering_interval_days,
          fertilizer_interval_days: hp.fertilizer_interval_days || 14,
          sunlight_text: hp.sunlight_text[lang] || hp.sunlight_text.de,
          watering_text: hp.watering_text[lang] || hp.watering_text.de,
          pruning_month: hp.pruning ? [hp.pruning[lang] || hp.pruning.de] : [],
          pet_toxic: hp.pet_toxic,
          toxicity_notes: hp.toxicity_notes ? (hp.toxicity_notes[lang] || hp.toxicity_notes.de) : null,
          difficulty: hp.difficulty,
          propagation: hp.propagation ? (hp.propagation[lang] || hp.propagation.de) : null,
          origin: hp.origin || null
        });
      }
    }

    if (pid.startsWith("crop_")) {
      const targetPid = pid === "crop_bean" ? "crop_bush_bean" : pid;
      const crop = cropsData.find(c => c.id === targetPid);
      if (crop) {
        return NextResponse.json({
          pid: crop.id,
          display_pid: crop.name.en,
          alias: crop.name.de,
          category: crop.category,
          min_soil_moist: crop.watering_interval_days <= 2 ? 45 : (crop.watering_interval_days >= 7 ? 10 : 30),
          min_light_lux: crop.sunlight === "full_sun" ? 50000 : (crop.sunlight === "partial_shade" ? 10000 : 1000),
          min_temp: crop.frost_hardy ? -10 : 5,
          max_temp: 35,
          pruning_month: [crop.pruning[lang] || crop.pruning.en],
          watering_interval_days: crop.watering_interval_days,
          sunlight_text: crop.sunlight,
          good_neighbors: crop.good_neighbors.map(id => getCropName(id, lang)).filter(Boolean),
          bad_neighbors: crop.bad_neighbors.map(id => getCropName(id, lang)).filter(Boolean),
          sowing_indoors_month: crop.sowing_indoors_month ? getMonthName(crop.sowing_indoors_month, lang) : null,
          planting_month: crop.planting_month ? getMonthName(crop.planting_month, lang) : null,
          sowing_outdoors_month: crop.sowing_outdoors_month ? getMonthName(crop.sowing_outdoors_month, lang) : null,
          origin: crop.origin || null
        });
      }
    }

    const data = await getPlantDetails(pid);
    data.origin = data.origin || data.Origin || "";
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch details from Open Plantbook" }, { status: 500 });
  }
}
