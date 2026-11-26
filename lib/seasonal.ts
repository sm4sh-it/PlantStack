export const SEASONAL_FACTOR_STEPS = [0, 25, 50, 75, 100] as const;
export type SeasonalScope = "winter" | "extended" | "always";

export interface SeasonalConfigInput {
  winterDormancyEnabled?: boolean | null;
  winterDormancyFactor?: number | null;
  winterDormancyScope?: string | null;
  winterDormancyPauseFertilizer?: boolean | null;
}

export interface ResolvedSeasonalConfig {
  factor: number;
  scope: SeasonalScope;
  pauseFertilizer: boolean;
  isActive: boolean;
}

export function snapSeasonalFactor(raw: unknown, fallbackEnabled = false): number {
  if (raw === null || raw === undefined || raw === "") {
    return fallbackEnabled ? 50 : 0;
  }
  const num = Number(raw);
  if (!Number.isFinite(num)) {
    return fallbackEnabled ? 50 : 0;
  }
  const clamped = Math.max(0, Math.min(100, num));
  return Math.round(clamped / 25) * 25;
}

export function normalizeSeasonalScope(raw: unknown): SeasonalScope {
  if (raw === "extended" || raw === "always" || raw === "winter") {
    return raw;
  }
  return "winter";
}

export function isMonthInSeasonalScope(monthZeroBased: number, scope: SeasonalScope): boolean {
  if (scope === "always") return true;
  if (scope === "extended") {
    // Oct (9) through Mar (2)
    return monthZeroBased >= 9 || monthZeroBased <= 2;
  }
  // Nov (10) through Feb (1)
  return monthZeroBased >= 10 || monthZeroBased <= 1;
}

export function resolveSeasonalConfig(
  config: SeasonalConfigInput | null | undefined,
  now: Date = new Date()
): ResolvedSeasonalConfig {
  const factor = snapSeasonalFactor(
    config?.winterDormancyFactor,
    Boolean(config?.winterDormancyEnabled)
  );
  const scope = normalizeSeasonalScope(config?.winterDormancyScope);
  const pauseFertilizer = config?.winterDormancyPauseFertilizer ?? true;
  const isActive = factor > 0 && isMonthInSeasonalScope(now.getMonth(), scope);

  return {
    factor,
    scope,
    pauseFertilizer,
    isActive,
  };
}

export interface PlantAdjustmentSource {
  waterInterval: number;
  fertilizerInterval: number | null;
  placement: string;
  locationType: string;
}

export interface PlantAdjustmentContext {
  rainTier: number;
  heatTier: number;
  frostWarning: boolean;
  seasonal: ResolvedSeasonalConfig;
}

export function applySeasonalAndWeatherAdjustments<T extends PlantAdjustmentSource>(
  plant: T,
  ctx: PlantAdjustmentContext
) {
  let mappedInterval = plant.waterInterval;
  let mappedFertilizer = plant.fertilizerInterval;

  // Fallback for legacy plants that still store INDOOR/OUTDOOR only in locationType
  const effectivePlacement =
    plant.placement === "Drinnen" && plant.locationType === "OUTDOOR"
      ? "Draußen"
      : plant.placement;

  if (effectivePlacement === "Draußen") {
    if (ctx.rainTier === 2) {
      mappedInterval += 2;
    }
    if (ctx.heatTier === 2) {
      mappedInterval = Math.max(1, Math.floor(plant.waterInterval * 0.3));
    } else if (ctx.heatTier === 1) {
      mappedInterval = Math.max(1, Math.floor(plant.waterInterval * 0.6));
    }
  } else if (effectivePlacement === "Balkon") {
    if (ctx.heatTier === 2) {
      mappedInterval = Math.max(1, Math.floor(plant.waterInterval * 0.3));
    } else if (ctx.heatTier === 1) {
      mappedInterval = Math.max(1, Math.floor(plant.waterInterval * 0.6));
    }
  }

  let winterDormancy = false;
  if (ctx.seasonal.isActive) {
    winterDormancy = true;
    mappedInterval = Math.max(
      1,
      Math.round(mappedInterval * (1 + ctx.seasonal.factor / 100))
    );
    if (ctx.seasonal.pauseFertilizer) {
      mappedFertilizer = null;
    }
  }

  return {
    ...plant,
    frostWarning:
      effectivePlacement === "Draußen" || effectivePlacement === "Balkon"
        ? ctx.frostWarning
        : false,
    waterInterval: mappedInterval,
    fertilizerInterval: mappedFertilizer,
    originalFertilizerInterval: plant.fertilizerInterval,
    winterDormancy,
    seasonalFactor: winterDormancy ? ctx.seasonal.factor : 0,
  };
}
