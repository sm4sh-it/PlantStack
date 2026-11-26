export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  normalizeSeasonalScope,
  resolveSeasonalConfig,
  snapSeasonalFactor,
} from "@/lib/seasonal";

export async function GET() {
  let config = await prisma.appConfig.findUnique({ where: { id: 1 } });
  if (!config) {
    config = await prisma.appConfig.create({ data: { id: 1 } });
  }
  const resolved = resolveSeasonalConfig(config);
  return NextResponse.json({
    ...config,
    winterDormancyFactor: resolved.factor,
    winterDormancyScope: resolved.scope,
    winterDormancyPauseFertilizer: resolved.pauseFertilizer,
  });
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();

    // Sanitize and validate inputs
    const validLanguages = ["en", "de"];
    const language =
      data.language && validLanguages.includes(data.language)
        ? data.language
        : undefined;

    let latitude = undefined;
    if (data.latitude !== undefined) {
      if (data.latitude === null || data.latitude === "") {
        latitude = null;
      } else {
        const parsedLat = Number(data.latitude);
        if (!isNaN(parsedLat) && parsedLat >= -90 && parsedLat <= 90) {
          latitude = parsedLat;
        }
      }
    }

    let longitude = undefined;
    if (data.longitude !== undefined) {
      if (data.longitude === null || data.longitude === "") {
        longitude = null;
      } else {
        const parsedLon = Number(data.longitude);
        if (!isNaN(parsedLon) && parsedLon >= -180 && parsedLon <= 180) {
          longitude = parsedLon;
        }
      }
    }

    let gridColumns = undefined;
    if (data.gridColumns !== undefined) {
      const parsedCols = Number(data.gridColumns);
      if (!isNaN(parsedCols) && parsedCols >= 1 && parsedCols <= 12) {
        gridColumns = Math.round(parsedCols);
      }
    }

    const dashboardTitle =
      typeof data.dashboardTitle === "string"
        ? data.dashboardTitle.slice(0, 100).trim()
        : undefined;

    const locationName =
      typeof data.locationName === "string"
        ? data.locationName.slice(0, 100).trim()
        : data.locationName === null
        ? null
        : undefined;

    const onboardingSeen =
      data.onboardingSeen !== undefined
        ? Boolean(data.onboardingSeen)
        : undefined;

    const hasFactor = data.winterDormancyFactor !== undefined;
    const hasEnabled = data.winterDormancyEnabled !== undefined;

    const winterDormancyFactor = hasFactor
      ? snapSeasonalFactor(data.winterDormancyFactor)
      : hasEnabled
      ? snapSeasonalFactor(undefined, Boolean(data.winterDormancyEnabled))
      : undefined;

    const winterDormancyEnabled =
      winterDormancyFactor !== undefined
        ? winterDormancyFactor > 0
        : hasEnabled
        ? Boolean(data.winterDormancyEnabled)
        : undefined;

    const winterDormancyScope =
      data.winterDormancyScope !== undefined
        ? normalizeSeasonalScope(data.winterDormancyScope)
        : undefined;

    const winterDormancyPauseFertilizer =
      data.winterDormancyPauseFertilizer !== undefined
        ? Boolean(data.winterDormancyPauseFertilizer)
        : undefined;

    const config = await prisma.appConfig.upsert({
      where: { id: 1 },
      update: {
        onboardingSeen,
        language,
        gridColumns,
        dashboardTitle,
        latitude,
        longitude,
        locationName,
        winterDormancyEnabled,
        winterDormancyFactor,
        winterDormancyScope,
        winterDormancyPauseFertilizer,
      },
      create: {
        id: 1,
        onboardingSeen: onboardingSeen || false,
        language: language || "en",
        gridColumns: gridColumns || 4,
        dashboardTitle: dashboardTitle || "My Jungle",
        latitude: latitude || null,
        longitude: longitude || null,
        locationName: locationName || null,
        winterDormancyEnabled: winterDormancyEnabled || false,
        winterDormancyFactor: winterDormancyFactor ?? 0,
        winterDormancyScope: winterDormancyScope || "winter",
        winterDormancyPauseFertilizer: winterDormancyPauseFertilizer ?? true,
      },
    });

    return NextResponse.json(config);
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
