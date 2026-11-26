import assert from "node:assert/strict";
import {
  applySeasonalAndWeatherAdjustments,
  resolveSeasonalConfig,
  snapSeasonalFactor,
} from "../lib/seasonal.ts";

assert.equal(snapSeasonalFactor(undefined, false), 0);
assert.equal(snapSeasonalFactor(undefined, true), 50);
assert.equal(snapSeasonalFactor(37), 25);
assert.equal(snapSeasonalFactor(38), 50);
assert.equal(snapSeasonalFactor(140), 100);

const jan = new Date("2026-01-15T12:00:00Z");
const oct = new Date("2026-10-15T12:00:00Z");
const jul = new Date("2026-07-15T12:00:00Z");

assert.equal(resolveSeasonalConfig({ winterDormancyEnabled: true }, jan).factor, 50);
assert.equal(resolveSeasonalConfig({ winterDormancyEnabled: true }, jan).isActive, true);
assert.equal(resolveSeasonalConfig({ winterDormancyFactor: 25, winterDormancyScope: "winter" }, oct).isActive, false);
assert.equal(resolveSeasonalConfig({ winterDormancyFactor: 25, winterDormancyScope: "extended" }, oct).isActive, true);
assert.equal(resolveSeasonalConfig({ winterDormancyFactor: 75, winterDormancyScope: "always" }, jul).isActive, true);

const adjusted = applySeasonalAndWeatherAdjustments(
  { waterInterval: 7, fertilizerInterval: 14, placement: "Drinnen", locationType: "INDOOR" },
  {
    rainTier: 0,
    heatTier: 0,
    frostWarning: false,
    seasonal: resolveSeasonalConfig(
      { winterDormancyFactor: 25, winterDormancyScope: "always", winterDormancyPauseFertilizer: false },
      jul
    ),
  }
);
assert.equal(adjusted.waterInterval, 9);
assert.equal(adjusted.fertilizerInterval, 14);
assert.equal(adjusted.winterDormancy, true);
assert.equal(adjusted.seasonalFactor, 25);

console.log("seasonal self-check passed");
