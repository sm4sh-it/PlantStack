export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let plants = await prisma.plant.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: "desc" },
      include: { location: true }
    });

    const config = await prisma.appConfig.findUnique({ where: { id: 1 } });
    
    let frostWarning = false;
    let heatTier1 = false;
    let heatTier2 = false;
    let rainTier = 0; // 1: <5mm, 2: 5-10mm, 3: >10mm
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

              if (maxTemp > 30) heatTier2 = true;
              else if (maxTemp > 25) heatTier1 = true;
              
              if (minTemp < 2) frostWarning = true;

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
                data: { lastWeatherSync: now }
              });
            }
          }
        } catch (e) {
          console.error("Weather sync failed", e);
        }
      }
    }

    const mappedPlants = plants.map(p => {
      let mappedInterval = p.waterInterval;
      
      // Fallback for legacy plants that still have INDOOR/OUTDOOR
      const effectivePlacement = p.placement === "Drinnen" && p.locationType === "OUTDOOR" ? "Draußen" : p.placement;

      if (effectivePlacement === "Draußen") {
        if (rainTier === 2) {
           mappedInterval += 2; // Add 2 days to remaining interval
        }
        if (heatTier2) {
           mappedInterval = Math.max(1, Math.floor(p.waterInterval * 0.3)); // Reduce by 70%
        } else if (heatTier1) {
           mappedInterval = Math.max(1, Math.floor(p.waterInterval * 0.6)); // Reduce by 40%
        }
        return { ...p, frostWarning, waterInterval: mappedInterval };
      } 
      else if (effectivePlacement === "Balkon") {
        // Ignore rain completely
        if (heatTier2) {
           mappedInterval = Math.max(1, Math.floor(p.waterInterval * 0.3)); // Reduce by 70%
        } else if (heatTier1) {
           mappedInterval = Math.max(1, Math.floor(p.waterInterval * 0.6)); // Reduce by 40%
        }
        return { ...p, frostWarning, waterInterval: mappedInterval };
      }

      return p; // Drinnen unaffected
    });

    return NextResponse.json(mappedPlants);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plants" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const plant = await prisma.plant.create({
      data: {
        name: data.name,
        locationId: data.locationId,
        waterInterval: parseInt(data.waterInterval),
        fertilizerInterval: data.fertilizerInterval ? parseInt(data.fertilizerInterval) : null,
        bugInterval: data.bugInterval ? parseInt(data.bugInterval) : null,
        fungusInterval: data.fungusInterval ? parseInt(data.fungusInterval) : null,
        imagePath: data.imagePath || null,
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
