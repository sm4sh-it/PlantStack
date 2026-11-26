export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeStoredImageFilename } from "@/lib/security";
import {
  applySeasonalAndWeatherAdjustments,
  resolveSeasonalConfig,
} from "@/lib/seasonal";

export async function GET() {
  try {
    let plants = await prisma.plant.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: "desc" },
      include: { location: true }
    });

    const config = await prisma.appConfig.findUnique({ where: { id: 1 } });
    
    // Initialize with cached weather values from AppConfig
    let rainTier = config?.weatherRainTier ?? 0;
    let heatTier = config?.weatherHeatTier ?? 0; // 0: normal, 1: heatTier1 (>25°C), 2: heatTier2 (>30°C)
    let frostWarning = config?.weatherFrostWarning ?? false;
    let isNewDay = false;

    if (config?.latitude && config?.longitude) {
      const now = new Date();
      isNewDay = !config.lastWeatherSync || new Date(config.lastWeatherSync).getDate() !== now.getDate();
      
      // Sync weather if > 4 hours ago
      if (!config.lastWeatherSync || (now.getTime() - new Date(config.lastWeatherSync).getTime() > 4 * 60 * 60 * 1000)) {
        try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${config.latitude}&longitude=${config.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&past_days=1&forecast_days=3`, { next: { revalidate: 3600 } });
          if (res.ok) {
            const data = await res.json();
            const daily = data.daily;
            if (daily && daily.time) {
              const pastRain = daily.precipitation_sum[0] || 0;
              if (pastRain > 10) rainTier = 3;
              else if (pastRain >= 5) rainTier = 2;
              else rainTier = 1;

              let maxTemp = -999;
              let minTemp = 999;
              for (let i = 1; i <= 3; i++) {
                if (daily.temperature_2m_max[i] > maxTemp) maxTemp = daily.temperature_2m_max[i];
                if (daily.temperature_2m_min[i] < minTemp) minTemp = daily.temperature_2m_min[i];
              }

              if (maxTemp > 30) heatTier = 2;
              else if (maxTemp > 25) heatTier = 1;
              else heatTier = 0;
              
              frostWarning = minTemp < 2;

              if (isNewDay && rainTier === 3) {
                // Tier 3: Full Reset for Draußen (save to DB)
                await prisma.plant.updateMany({
                  where: { placement: "Draußen" },
                  data: { lastWatered: now }
                });
                // Re-fetch plants to get updated lastWatered
                plants = await prisma.plant.findMany({
                  where: { isArchived: false },
                  orderBy: { createdAt: "desc" },
                  include: { location: true }
                });
              }

              await prisma.appConfig.update({
                where: { id: 1 },
                data: { 
                  lastWeatherSync: now,
                  weatherRainTier: rainTier,
                  weatherHeatTier: heatTier,
                  weatherFrostWarning: frostWarning
                }
              });
            }
          }
        } catch (e) {
          console.error("Weather sync failed", e);
        }
      }
    }

    const seasonal = resolveSeasonalConfig(config);
    const mappedPlants = plants.map((p) =>
      applySeasonalAndWeatherAdjustments(p, {
        rainTier,
        heatTier,
        frostWarning,
        seasonal,
      })
    );

    return NextResponse.json(mappedPlants);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plants" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    let safeImagePath: string | null = null;
    if (typeof data.imagePath === "string" && data.imagePath.trim() !== "") {
      safeImagePath = sanitizeStoredImageFilename(data.imagePath);
      if (!safeImagePath) {
        return NextResponse.json({ error: "Invalid imagePath" }, { status: 400 });
      }
    }

    const plant = await prisma.plant.create({
      data: {
        name: data.name,
        locationId: data.locationId,
        waterInterval: parseInt(data.waterInterval),
        fertilizerInterval: data.fertilizerInterval ? parseInt(data.fertilizerInterval) : null,
        bugInterval: data.bugInterval ? parseInt(data.bugInterval) : null,
        fungusInterval: data.fungusInterval ? parseInt(data.fungusInterval) : null,
        imagePath: safeImagePath,
        notes: data.notes || null,
        scientificName: data.scientificName || null,
        alias: data.alias || null,
        wateringInfo: data.wateringInfo || null,
        sunlightInfo: data.sunlightInfo || null,
        locationType: data.locationType || "INDOOR",
        plantType: data.plantType || "Zierpflanze",
        placement: data.placement || "Drinnen",
        pruningInfo: data.pruningInfo || null,
        apiId: data.apiId || null,
        origin: data.origin || null,
        lastFertilized: data.fertilizerInterval ? new Date() : null,
      },
    });

    await prisma.plantEvent.create({
      data: {
        plantId: plant.id,
        type: "CREATE"
      }
    });

    return NextResponse.json(plant);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create plant" }, { status: 500 });
  }
}
