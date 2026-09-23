"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  ScatterChart,
  Scatter,
  ZAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ReferenceLine,
} from "recharts";
import {
  Droplet,
  FlaskConical,
  Trophy,
  Apple,
  Ghost,
  Monitor,
  TrendingUp,
  Globe,
  Pizza,
  Utensils,
  CloudRain,
  Sun,
  TreePine,
  GlassWater,
  Crown,
  Skull,
  MoonStar,
  Activity,
  Castle,
  Home,
  Sprout,
  Lock,
  Sparkles,
  Check,
  BugOff,
  SprayCan,
  Leaf,
  Scissors,
  Hourglass,
  Layers,
  X,
  ZoomIn,
} from "lucide-react";
import { t } from "@/lib/i18n";
import { TieredBadgeResult } from "@/lib/badges";

type StatisticsClientProps = {
  plants: any[];
  badges: {
    rainmaker: boolean;
    botanyNerd: boolean;
    harvestTime: boolean;
    petSematary: boolean;
    itSupport: boolean;
    pizzaMargherita: boolean;
    wedges: boolean;
    jungle: boolean;
    rainforest: boolean;
    desert: boolean;
    worldTour: boolean;
    ginTonic: boolean;
    dramaQueen: boolean;
    serialKiller: boolean;
    gothicGarden: boolean;
    castle: boolean;
    hauntedCastle: boolean;
    diversityBronze: boolean;
    diversitySilver: boolean;
    diversityGold: boolean;
    mediterraneanMix: boolean;
    [key: string]: boolean;
  };
  tieredBadges?: TieredBadgeResult[];
  stats: {
    totalWatered: number;
    activeCount: number;
    archivedCount: number;
    survivalRate: string;
    oldestPlantDate: Date | null;
    eventSummary: any;
    topOrigins: any[];
    matrixData: any[];
    radarData: any[];
  };
};

export type BadgeModalData = {
  title: string;
  subtitle?: string;
  desc: string;
  imageSrc: string | null;
  unlocked: boolean;
  isMystery?: boolean;
  isTiered?: boolean;
  tierLevel?: number;
  maxTier?: number;
  nextTier?: {
    level: number;
    threshold: number;
    title: string;
    subtitle: string;
    desc: string;
  } | null;
  progress?: {
    current: number;
    max: number;
    percent: number;
  };
};

export default function StatisticsClient({ plants, badges, tieredBadges, stats }: StatisticsClientProps) {
  const [lang, setLang] = useState("en");
  const [inspectBadge, setInspectBadge] = useState<BadgeModalData | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.language) setLang(data.language);
      })
      .catch(console.error);
  }, []);

  // Keyboard accessibility & scroll lock: Escape key closes badge inspection modal
  useEffect(() => {
    if (!inspectBadge) return;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInspectBadge(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [inspectBadge]);

  const thirstyData = useMemo(() => {
    return [...plants]
      .sort((a, b) => b.wateredCount - a.wateredCount)
      .slice(0, 5)
      .map((p) => ({
        name: p.name,
        watered: p.wateredCount,
      }));
  }, [plants]);

  const uniqueOriginsCount = useMemo(() => {
    return new Set(
      plants
        .filter((p) => !p.isArchived && p.origin && p.origin !== "Unbekannt" && p.origin !== "Unknown")
        .map((p) => p.origin)
    ).size;
  }, [plants]);

  const harvestCount = useMemo(() => {
    if (badges.harvestTime) return 1;
    const foodKeywords = ["tomat", "chili", "paprika", "basil", "minze", "mint", "erdbeer", "strawberr", "salat", "lettuc", "gurke", "cucumb", "zitrone", "lemon", "rosmarin", "rosemary", "thymi", "thyme", "oregano", "kartoffel", "potato"];
    const hasFood = plants.some((p) => {
      if (p.isArchived) return false;
      if (["Nutzpflanze", "Gemüsepflanze", "Kräuter"].includes(p.plantType)) return true;
      const n = (p.name || "").toLowerCase();
      const s = (p.scientificName || "").toLowerCase();
      const a = (p.alias || "").toLowerCase();
      return foodKeywords.some((k) => n.includes(k) || s.includes(k) || a.includes(k));
    });
    return hasFood ? 1 : 0;
  }, [plants, badges.harvestTime]);

  const litersWatered = (stats.totalWatered * 0.15).toFixed(1);
  const oldestDateString = stats.oldestPlantDate
    ? new Date(stats.oldestPlantDate).toLocaleDateString(lang === "de" ? "de-DE" : "en-US")
    : "-";

  // Counts for tiered progression & secret achievements
  const unlockedTieredCount = useMemo(() => {
    return tieredBadges?.filter((b) => b.unlocked).length ?? 0;
  }, [tieredBadges]);

  const totalTierStars = useMemo(() => {
    return tieredBadges?.reduce((acc, b) => acc + b.currentTier, 0) ?? 0;
  }, [tieredBadges]);

  const secretBadgeKeys = useMemo(() => [
    "harvestTime", "pizzaMargherita", "wedges", "ginTonic", "mediterraneanMix",
    "jungle", "rainforest", "desert", "dramaQueen", "gothicGarden",
    "itSupport", "petSematary", "serialKiller", "hauntedCastle"
  ], []);

  const unlockedSecretCount = useMemo(() => {
    return secretBadgeKeys.filter(k => badges[k as keyof typeof badges]).length;
  }, [secretBadgeKeys, badges]);

  const totalBadgesSlots = (tieredBadges?.length || 8) + secretBadgeKeys.length;
  const totalBadgesUnlocked = unlockedTieredCount + unlockedSecretCount;

  // Recharts Custom Tooltip (Floating, borderless, zero thick wireframe)
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border-hairline px-3 py-2 rounded-xl shadow-xl text-xs">
          <p className="font-bold text-foreground">{payload[0].payload.name || label}</p>
          <p className="text-brand font-semibold mt-0.5">
            {payload[0].value} {lang === "de" ? "mal gegossen" : "times watered"}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomOriginTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border-hairline px-3 py-2 rounded-xl shadow-xl text-xs">
          <p className="font-bold text-foreground">{payload[0].payload.name}</p>
          <p className="text-brand font-semibold mt-0.5">
            {payload[0].value} {lang === "de" ? "Pflanzen" : "plants"}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      let lightLoc = data.originalSunlight || (lang === "de" ? "Unbekannt" : "Unknown");
      const s = lightLoc.toLowerCase();
      if (s.includes("full_sun")) lightLoc = lang === "de" ? "Viel Sonne" : "Full Sun";
      else if (s.includes("partial_shade")) lightLoc = lang === "de" ? "Halbschatten" : "Partial Shade";
      else if (s.includes("shade")) lightLoc = lang === "de" ? "Schatten" : "Shade";

      return (
        <div className="bg-surface border border-border-hairline p-3 rounded-xl shadow-xl text-xs">
          <p className="font-bold text-foreground mb-0.5">{data.name}</p>
          <p className="text-text-muted">
            {lang === "de" ? "Intervall:" : "Interval:"} {data.originalInterval} {lang === "de" ? "Tage" : "days"}
          </p>
          <p className="text-text-muted">
            {lang === "de" ? "Licht:" : "Light:"} {lightLoc}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pb-24 space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1 flex items-center gap-3 text-foreground">
            <TrendingUp className="text-brand" size={32} />
            {t("statistics", lang)}
          </h1>
          <p className="text-sm text-text-muted">
            {lang === "de"
              ? "Deine Gamification, Abzeichen und botanischen Einblicke."
              : "Your gamification, achievements and botanical insights."}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-surface border border-border-hairline px-4 py-2 rounded-xl card-elevation text-xs font-semibold text-text-primary self-start sm:self-auto">
          <div className="flex items-center gap-1.5">
            <Trophy size={16} className="text-amber-500 shrink-0" />
            <span>
              {totalBadgesUnlocked} / {totalBadgesSlots}{" "}
              {lang === "de" ? "Freigeschaltet" : "Unlocked"}
            </span>
          </div>
          {totalTierStars > 0 && (
            <div className="hidden sm:flex items-center gap-1 pl-3 border-l border-border-hairline text-amber-600 dark:text-amber-400 font-bold">
              <Sparkles size={13} />
              <span>
                {totalTierStars} {lang === "de" ? "Stufen" : "Tiers"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 1. Vier KPI-Metrik-Kacheln (100% ohne Card-in-Card Konturen) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-surface p-5 sm:p-6 rounded-xl md:rounded-2xl border border-border-hairline card-elevation flex flex-col items-center justify-center text-center">
          <span className="text-3xl sm:text-4xl font-extrabold text-brand mb-1 tabular">
            {stats.activeCount}
          </span>
          <span className="text-xs text-text-secondary font-semibold">
            {lang === "de" ? "Aktive Pflanzen" : "Active plants"}
          </span>
        </div>

        <div className="bg-surface p-5 sm:p-6 rounded-xl md:rounded-2xl border border-border-hairline card-elevation flex flex-col items-center justify-center text-center">
          <span className="text-3xl sm:text-4xl font-extrabold text-care-water mb-1 tabular">
            {litersWatered} L
          </span>
          <span className="text-xs text-text-secondary font-semibold">
            {lang === "de" ? "Wasser (ca.)" : "Water (est.)"}
          </span>
        </div>

        <div className="bg-surface p-5 sm:p-6 rounded-xl md:rounded-2xl border border-border-hairline card-elevation flex flex-col items-center justify-center text-center">
          <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-1 tabular">
            {stats.survivalRate}
          </span>
          <span className="text-xs text-text-secondary font-semibold">
            {lang === "de" ? "Überlebensrate" : "Survival Rate"}
          </span>
        </div>

        <div className="bg-surface p-5 sm:p-6 rounded-xl md:rounded-2xl border border-border-hairline card-elevation flex flex-col items-center justify-center text-center">
          <span className="text-2xl sm:text-3xl font-bold text-text-primary mb-1 tabular">
            {oldestDateString}
          </span>
          <span className="text-xs text-text-secondary font-semibold">
            {t("oldestPlant", lang)}
          </span>
        </div>
      </div>

      {/* 2. Badge & Gamification Sektion */}
      <section className="bg-surface rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 border border-border-hairline card-elevation space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-text-primary">
              <Trophy className="text-amber-500" size={20} />
              {lang === "de" ? "Abzeichen & Meilensteine" : "Badges & Milestones"}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {lang === "de"
                ? "Schalte Stufen-Abzeichen frei und entdecke geheime botanische Kombinationen!"
                : "Unlock tiered badges and discover secret botanical combinations!"}
            </p>
          </div>
        </div>

        {/* 2A: Stufen-Abzeichen (Level-Up Progression) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <TrendingUp size={14} className="text-brand" />
              {lang === "de" ? "Stufen-Abzeichen (Wachsen mit deiner Pflege)" : "Tiered Badges (Level up with your care)"}
            </h3>
            <span className="text-[11px] text-text-muted font-semibold">
              {unlockedTieredCount} / {tieredBadges?.length || 8} {lang === "de" ? "aktiviert" : "active"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
            {tieredBadges && tieredBadges.length > 0 ? (
              tieredBadges.map((item) => (
                <TieredBadgeCard
                  key={item.id}
                  item={item}
                  lang={lang}
                  onInspect={setInspectBadge}
                />
              ))
            ) : null}
          </div>
        </div>

        {/* 2B: Geheime Entdeckungen & Rezepte (Secret Combinations) */}
        <div className="space-y-3 pt-4 border-t border-border-hairline">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" />
              {lang === "de" ? "Botanische Geheimnisse & Rezepte" : "Botanical Secrets & Recipes"}
            </h3>
            <span className="text-[11px] text-text-muted font-semibold">
              {unlockedSecretCount} / {secretBadgeKeys.length} {lang === "de" ? "entdeckt" : "discovered"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            <BadgeCard
              badgeKey="harvestTime"
              icon={<Apple size={24} />}
              title={lang === "de" ? "Erntezeit" : "Harvest Time"}
              desc={lang === "de" ? "Obst, Gemüse & Kräuter" : "Fruit, veg & herbs"}
              unlocked={badges.harvestTime}
              color="text-rose-500"
              lang={lang}
              onInspect={setInspectBadge}
            />
            <BadgeCard
              badgeKey="pizzaMargherita"
              icon={<Pizza size={24} />}
              title="Pizza Margherita"
              desc={lang === "de" ? "Tomate & Basilikum" : "Tomato & Basil"}
              unlocked={badges.pizzaMargherita}
              color="text-orange-500"
              lang={lang}
              onInspect={setInspectBadge}
            />
            <BadgeCard
              badgeKey="wedges"
              icon={<Utensils size={24} />}
              title="Wedges"
              desc={lang === "de" ? "Kartoffel & Rosmarin" : "Potato & Rosemary"}
              unlocked={badges.wedges}
              color="text-amber-600"
              lang={lang}
              onInspect={setInspectBadge}
            />
            <BadgeCard
              badgeKey="ginTonic"
              icon={<GlassWater size={24} />}
              title="Gin-Tonic"
              desc={lang === "de" ? "Zitrone & Gurke" : "Lemon & Cucumber"}
              unlocked={badges.ginTonic}
              color="text-emerald-400"
              lang={lang}
              onInspect={setInspectBadge}
            />
            <BadgeCard
              badgeKey="mediterraneanMix"
              icon={<Utensils size={24} />}
              title={lang === "de" ? "Mittelmeer Mix" : "Mediterranean Mix"}
              desc={lang === "de" ? "3+ mediterrane Kräuter" : "3+ Mediterranean herbs"}
              unlocked={badges.mediterraneanMix}
              color="text-emerald-500"
              lang={lang}
              onInspect={setInspectBadge}
            />
            <BadgeCard
              badgeKey="jungle"
              icon={<TreePine size={24} />}
              title="Jungle"
              desc={lang === "de" ? "4x Monstera" : "4x Monstera"}
              unlocked={badges.jungle}
              color="text-emerald-600"
              lang={lang}
              onInspect={setInspectBadge}
            />
            <BadgeCard
              badgeKey="rainforest"
              icon={<CloudRain size={24} />}
              title="Rainforest"
              desc={lang === "de" ? "Monstera & Strelitzie" : "Monstera & Strelitzia"}
              unlocked={badges.rainforest}
              color="text-care-fungus"
              lang={lang}
              onInspect={setInspectBadge}
            />
            <BadgeCard
              badgeKey="desert"
              icon={<Sun size={24} />}
              title="Desert"
              desc={lang === "de" ? "3x Kakteen/Sukkulenten" : "3x Cacti/Succulents"}
              unlocked={badges.desert}
              color="text-amber-500"
              lang={lang}
              onInspect={setInspectBadge}
            />
            <BadgeCard
              badgeKey="dramaQueen"
              icon={<Crown size={24} />}
              title="Drama Queen"
              desc={lang === "de" ? "Spathiphyllum/Fittonia" : "Peace Lily/Fittonia"}
              unlocked={badges.dramaQueen}
              color="text-pink-500"
              lang={lang}
              onInspect={setInspectBadge}
            />
            <BadgeCard
              badgeKey="gothicGarden"
              icon={<MoonStar size={24} />}
              title="Gothic Garden"
              desc={lang === "de" ? "3x Schatten/Dark" : "3x Shade/Dark"}
              unlocked={badges.gothicGarden}
              color="text-indigo-400"
              lang={lang}
              onInspect={setInspectBadge}
            />
            <BadgeCard
              badgeKey="itSupport"
              icon={<Monitor size={24} />}
              title="IT-Support"
              desc={lang === "de" ? "Easter Egg gefunden!" : "Found an Easter Egg!"}
              unlocked={badges.itSupport}
              color="text-purple-500"
              pulse
              lang={lang}
              onInspect={setInspectBadge}
            />
            <BadgeCard
              badgeKey="petSematary"
              icon={<Ghost size={24} />}
              title={lang === "de" ? "Die Verlorenen" : "The Lost Ones"}
              desc={lang === "de" ? "Eine Pflanze verloren" : "Lost a plant"}
              unlocked={badges.petSematary}
              color="text-neutral-400"
              lang={lang}
              onInspect={setInspectBadge}
            />
            <BadgeCard
              badgeKey="serialKiller"
              icon={<Skull size={24} />}
              title="Serial Killer"
              desc={lang === "de" ? "3 archiviert in 2 Mon." : "3 archived in 2 mo"}
              unlocked={badges.serialKiller}
              color="text-red-500"
              lang={lang}
              onInspect={setInspectBadge}
            />
            <BadgeCard
              badgeKey="hauntedCastle"
              icon={<Ghost size={24} />}
              title={lang === "de" ? "Geisterschloss" : "Haunted Castle"}
              desc={lang === "de" ? "10+ archiviert" : "10+ archived"}
              unlocked={badges.hauntedCastle}
              color="text-neutral-400"
              lang={lang}
              onInspect={setInspectBadge}
            />

            {/* Mystery Teaser Slots */}
            <BadgeCard
              isMystery
              desc={lang === "de" ? "Finde die Kombination!" : "Find the secret combo!"}
              lang={lang}
              onInspect={setInspectBadge}
            />
            <BadgeCard
              isMystery
              desc={lang === "de" ? "Geheime Pflanzenerfolge" : "Secret botanical combos"}
              lang={lang}
              onInspect={setInspectBadge}
            />
          </div>
        </div>
      </section>

      {/* 3. Recharts-Diagramme: Horizontale Balken mit abgerundeten Enden & schwebenden Tooltips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 [&_.recharts-wrapper]:outline-none [&_.recharts-surface]:outline-none [&_*]:focus:outline-none">
        {/* Most Thirsty Plants Bar Chart */}
        <div className="bg-surface p-5 sm:p-6 rounded-2xl md:rounded-3xl border border-border-hairline card-elevation h-96 flex flex-col">
          <h3 className="text-sm sm:text-base font-bold text-text-primary mb-4">
            {t("theThirstyOnes", lang)}
          </h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={thirstyData}
                layout="vertical"
                margin={{ top: 0, right: 15, left: 40, bottom: 0 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "currentColor" }}
                  className="text-xs text-text-secondary font-medium"
                  width={110}
                />
                <Tooltip cursor={{ fill: "var(--border-hairline)" }} content={<CustomBarTooltip />} />
                <Bar dataKey="watered" fill="var(--care-water)" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Origins Bar Chart */}
        <div className="bg-surface p-5 sm:p-6 rounded-2xl md:rounded-3xl border border-border-hairline card-elevation h-96 flex flex-col">
          <h3 className="text-sm sm:text-base font-bold text-text-primary mb-4">
            {t("topOrigins", lang)}
          </h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.topOrigins}
                layout="vertical"
                margin={{ top: 0, right: 15, left: 70, bottom: 0 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "currentColor" }}
                  className="text-xs text-text-secondary font-medium"
                  width={90}
                />
                <Tooltip cursor={{ fill: "var(--border-hairline)" }} content={<CustomOriginTooltip />} />
                <Bar dataKey="value" fill="var(--brand)" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Garden Vibe & Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 [&_.recharts-wrapper]:outline-none [&_.recharts-surface]:outline-none [&_*]:focus:outline-none">
        {/* Scatter Matrix */}
        <section className="bg-surface rounded-2xl md:rounded-3xl p-5 sm:p-6 border border-border-hairline card-elevation aspect-square flex flex-col relative overflow-hidden">
          <h2 className="text-sm sm:text-base font-bold text-text-primary mb-4 z-10 relative">
            {t("survivalCoordinates", lang)}
          </h2>
          <div className="flex-1 w-full min-h-0 relative z-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis type="number" dataKey="x" domain={[0, 4]} hide />
                <YAxis type="number" dataKey="y" domain={[0, 30]} hide />
                <ZAxis range={[60, 60]} />
                <ReferenceLine x={2} stroke="currentColor" strokeDasharray="3 3" className="opacity-15" />
                <ReferenceLine y={15} stroke="currentColor" strokeDasharray="3 3" className="opacity-15" />
                <Tooltip content={<CustomScatterTooltip />} cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="Plants" data={stats.matrixData} fill="var(--brand)" />
              </ScatterChart>
            </ResponsiveContainer>

            {/* Edge Labels */}
            <div className="absolute top-2 w-full text-center text-[10px] text-text-muted font-bold uppercase tracking-wider pointer-events-none leading-tight">
              {t("waterJunkie", lang)}
            </div>
            <div className="absolute bottom-2 w-full text-center text-[10px] text-text-muted font-bold uppercase tracking-wider pointer-events-none leading-tight">
              {t("cactusVibes", lang)}
            </div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-text-muted font-bold uppercase tracking-wider whitespace-nowrap origin-center pointer-events-none">
              {t("shadeDweller", lang)}
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-[10px] text-text-muted font-bold uppercase tracking-wider whitespace-nowrap origin-center pointer-events-none">
              {t("sunWorshipper", lang)}
            </div>
          </div>
        </section>

        {/* Radar Chart */}
        <section className="bg-surface rounded-2xl md:rounded-3xl p-5 sm:p-6 border border-border-hairline card-elevation aspect-square flex flex-col relative overflow-hidden">
          <h2 className="text-sm sm:text-base font-bold text-text-primary mb-4">
            {t("theGardenVibe", lang)}
          </h2>
          <div className="flex-1 w-full min-h-0 relative z-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                outerRadius="65%"
                data={stats.radarData.map((d: any) => ({
                  ...d,
                  subject: t(
                    d.subject === "Durst"
                      ? "thirst"
                      : d.subject === "Lichthunger"
                      ? "lightNeed"
                      : d.subject === "Pflegeleichtigkeit"
                      ? "easeOfCare"
                      : d.subject === "Artenvielfalt"
                      ? "diversity"
                      : d.subject === "Nutzgarten-Anteil"
                      ? "edibleRatio"
                      : d.subject === "Freiluft-Faktor"
                      ? "outdoorFactor"
                      : (d.subject as any),
                    lang
                  ),
                }))}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <PolarGrid stroke="currentColor" className="opacity-10" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "currentColor", fontSize: 11 }}
                  className="text-text-secondary font-semibold tracking-wide"
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Vibe" dataKey="A" stroke="var(--brand)" strokeWidth={2} fill="var(--brand)" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* 5. Activities & Monatsübersicht (Strikte Pflege-Farbkontinuität & Soft-Fills) */}
      <section className="bg-surface rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 border border-border-hairline card-elevation space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 text-text-primary">
              <Activity className="text-brand" size={20} />
              {t("activities", lang)}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {lang === "de"
                ? "Pflegeaktivitäten im Monats- und Jahresverlauf"
                : "Care actions over the current month and year"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-semibold bg-surface-subtle px-3.5 py-2 rounded-xl border border-border-hairline tabular">
            <span className="text-text-muted">{t("yearlyTotal", lang)}</span>
            <span className="text-care-water font-bold">{stats.eventSummary.yearWater} 💧</span>
            <span className="text-care-fertilizer font-bold">{stats.eventSummary.yearFertilize} 🧪</span>
            <span className="text-care-bug font-bold">{stats.eventSummary.yearBug || 0} 🌿</span>
            <span className="text-care-fungus font-bold">{stats.eventSummary.yearFungus || 0} ✨</span>
            <span className="text-brand font-bold">{stats.eventSummary.yearCreate} 🌱</span>
            <span className="text-text-muted">{stats.eventSummary.yearArchive} 💀</span>
          </div>
        </div>

        {/* Monatskacheln mit 100% borderless Soft-Fills */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Wasser */}
          <div className="p-4 bg-care-water-bg rounded-xl">
            <p className="text-xs text-care-water font-semibold mb-1 flex items-center gap-1">
              <Droplet size={13} /> {t("wateredMonth", lang)}
            </p>
            <p className="text-2xl font-extrabold tabular text-care-water">
              {stats.eventSummary.monthWater}
            </p>
          </div>

          {/* Dünger */}
          <div className="p-4 bg-care-fertilizer-bg rounded-xl">
            <p className="text-xs text-care-fertilizer font-semibold mb-1 flex items-center gap-1">
              <FlaskConical size={13} /> {t("fertilizedMonth", lang)}
            </p>
            <p className="text-2xl font-extrabold tabular text-care-fertilizer">
              {stats.eventSummary.monthFertilize}
            </p>
          </div>

          {/* Bekämpfen */}
          <div className="p-4 bg-care-bug-bg rounded-xl">
            <p className="text-xs text-care-bug font-semibold mb-1 flex items-center gap-1">
              <BugOff size={13} /> {lang === "de" ? "Bekämpft (Monat)" : "Pest (Month)"}
            </p>
            <p className="text-2xl font-extrabold tabular text-care-bug">
              {stats.eventSummary.monthBug || 0}
            </p>
          </div>

          {/* Pilzschutz */}
          <div className="p-4 bg-care-fungus-bg rounded-xl">
            <p className="text-xs text-care-fungus font-semibold mb-1 flex items-center gap-1">
              <SprayCan size={13} /> {lang === "de" ? "Pilzschutz (Monat)" : "Fungus (Month)"}
            </p>
            <p className="text-2xl font-extrabold tabular text-care-fungus">
              {stats.eventSummary.monthFungus || 0}
            </p>
          </div>

          {/* Neu eingepflanzt */}
          <div className="p-4 bg-brand-subtle rounded-xl">
            <p className="text-xs text-brand font-semibold mb-1 flex items-center gap-1">
              <Leaf size={13} /> {t("newPlantedMonth", lang)}
            </p>
            <p className="text-2xl font-extrabold tabular text-brand">
              {stats.eventSummary.monthCreate}
            </p>
          </div>

          {/* Archiviert */}
          <div className="p-4 bg-surface-subtle rounded-xl">
            <p className="text-xs text-text-muted font-semibold mb-1 flex items-center gap-1">
              <Ghost size={13} /> {t("archivedMonth", lang)}
            </p>
            <p className="text-2xl font-extrabold tabular text-text-secondary">
              {stats.eventSummary.monthArchive}
            </p>
          </div>
        </div>
      </section>

      {/* Badge Inspection Lightbox Modal */}
      {inspectBadge && (
        <BadgeInspectionModal
          badge={inspectBadge}
          lang={lang}
          onClose={() => setInspectBadge(null)}
        />
      )}
    </div>
  );
}

const BADGE_IMAGES: Record<string, string> = {
  botanyNerd_t1: "/images/badges/botanyNerd_t1.webp",
  botanyNerd_t2: "/images/badges/botanyNerd_t2.webp",
  botanyNerd_t3: "/images/badges/botanyNerd_t3.webp",
  botanyNerd_t4: "/images/badges/botanyNerd_t4.webp",
  desert: "/images/badges/desert.webp",
  diversity_t1: "/images/badges/diversity_t1.webp",
  diversity_t2: "/images/badges/diversity_t2.webp",
  diversity_t3: "/images/badges/diversity_t3.webp",
  diversity_t4: "/images/badges/diversity_t4.webp",
  dramaQueen: "/images/badges/dramaQueen.webp",
  ginTonic: "/images/badges/ginTonic.webp",
  gothicGarden: "/images/badges/gothicGarden.webp",
  harvestTime: "/images/badges/harvestTime.webp",
  hauntedCastle: "/images/badges/hauntedCastle.webp",
  itSupport: "/images/badges/itSupport.webp",
  jungle: "/images/badges/jungle.webp",
  mediterraneanMix: "/images/badges/mediterraneanMix.webp",
  methusalem_t1: "/images/badges/methusalem_t1.webp",
  methusalem_t2: "/images/badges/methusalem_t2.webp",
  methusalem_t3: "/images/badges/methusalem_t3.webp",
  methusalem_t4: "/images/badges/methusalem_t4.webp",
  mystery: "/images/badges/mystery.webp",
  petSematary: "/images/badges/petSematary.webp",
  pizzaMargherita: "/images/badges/pizzaMargherita.webp",
  pruneMaster_t1: "/images/badges/pruneMaster_t1.webp",
  pruneMaster_t2: "/images/badges/pruneMaster_t2.webp",
  pruneMaster_t3: "/images/badges/pruneMaster_t3.webp",
  rainforest: "/images/badges/rainforest.webp",
  rainmaker_t1: "/images/badges/rainmaker_t1.webp",
  rainmaker_t2: "/images/badges/rainmaker_t2.webp",
  rainmaker_t3: "/images/badges/rainmaker_t3.webp",
  rainmaker_t4: "/images/badges/rainmaker_t4.webp",
  rainmaker_t5: "/images/badges/rainmaker_t5.webp",
  repotMaster_t1: "/images/badges/repotMaster_t1.webp",
  repotMaster_t2: "/images/badges/repotMaster_t2.webp",
  repotMaster_t3: "/images/badges/repotMaster_t3.webp",
  rooms_t1: "/images/badges/rooms_t1.webp",
  rooms_t2: "/images/badges/rooms_t2.webp",
  rooms_t3: "/images/badges/rooms_t3.webp",
  serialKiller: "/images/badges/serialKiller.webp",
  wedges: "/images/badges/wedges.webp",
  worldTour_t1: "/images/badges/worldTour_t1.webp",
  worldTour_t2: "/images/badges/worldTour_t2.webp",
  worldTour_t3: "/images/badges/worldTour_t3.webp",
};

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI"];

function getTierStyle(level: number, isMax: boolean = false) {
  if (isMax) {
    return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
  }
  switch (level) {
    case 1:
      return "bg-amber-900/10 text-amber-700 dark:text-amber-500 border-amber-700/20";
    case 2:
      return "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-400/25";
    case 3:
      return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
    case 4:
      return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
    case 5:
      return "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30";
    default:
      return "bg-brand-subtle text-brand border-brand/20";
  }
}

function getTierIcon(iconName: string, size = 24) {
  switch (iconName) {
    case "Droplet":
      return <Droplet size={size} />;
    case "Leaf":
      return <Leaf size={size} />;
    case "Globe":
      return <Globe size={size} />;
    case "Home":
      return <Home size={size} />;
    case "Castle":
      return <Castle size={size} />;
    case "Layers":
      return <Layers size={size} />;
    case "Scissors":
      return <Scissors size={size} />;
    case "Hourglass":
      return <Hourglass size={size} />;
    case "Sprout":
      return <Sprout size={size} />;
    default:
      return <Trophy size={size} />;
  }
}

function BadgeInspectionModal({
  badge,
  lang,
  onClose,
}: {
  badge: BadgeModalData;
  lang: string;
  onClose: () => void;
}) {
  const roman = badge.tierLevel ? ROMAN_NUMERALS[badge.tierLevel - 1] || `${badge.tierLevel}` : "";
  const isMaxLevel = Boolean(badge.isTiered && badge.unlocked && !badge.nextTier);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={badge.title}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-surface border border-border-hairline rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-2xl card-elevation flex flex-col items-center text-center animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative ambient glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand/5 dark:bg-brand/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label={lang === "de" ? "Schließen" : "Close"}
          className="absolute top-4 right-4 p-2 rounded-full text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors z-10 cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Badge Status / Tier Pill */}
        <div className="mb-2">
          {badge.isTiered ? (
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border shadow-2xs inline-flex items-center gap-1.5 ${
                !badge.unlocked
                  ? "bg-surface text-text-muted border-border-hairline"
                  : getTierStyle(badge.tierLevel || 1, isMaxLevel)
              }`}
            >
              {isMaxLevel ? (
                <>
                  <Sparkles size={12} className="text-amber-500" />
                  <span>{lang === "de" ? "Meisterstufe (Max)" : "Mastery (Max Tier)"}</span>
                </>
              ) : badge.unlocked ? (
                <span>
                  {lang === "de" ? `Stufe ${roman}` : `Tier ${roman}`}
                  {badge.maxTier ? ` / ${badge.maxTier}` : ""}
                </span>
              ) : (
                <span>{lang === "de" ? "Ziel: Stufe I" : "Goal: Tier I"}</span>
              )}
            </span>
          ) : badge.isMystery ? (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-surface-subtle text-text-muted border border-border-hairline inline-flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber-500" />
              <span>{lang === "de" ? "Geheime Kombination" : "Secret Combo"}</span>
            </span>
          ) : badge.unlocked ? (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-subtle text-brand border border-brand/20 inline-flex items-center gap-1.5">
              <Check size={12} />
              <span>{lang === "de" ? "Entdeckt & Freigeschaltet" : "Discovered & Unlocked"}</span>
            </span>
          ) : (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-surface-subtle text-text-muted border border-border-hairline inline-flex items-center gap-1.5">
              <Lock size={12} />
              <span>{lang === "de" ? "Noch nicht freigeschaltet" : "Locked"}</span>
            </span>
          )}
        </div>

        {/* Big Enamel Pin Showcase (512x512 master resolution, displayed at w-56 sm:w-64) */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 my-4 flex items-center justify-center">
          {badge.imageSrc ? (
            <Image
              src={badge.imageSrc}
              alt={badge.title}
              width={512}
              height={512}
              priority
              className={`w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_16px_32px_rgba(0,0,0,0.6)] select-none transition-all ${
                !badge.unlocked && !badge.isMystery ? "filter grayscale contrast-125 opacity-40" : ""
              }`}
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-surface-subtle border border-border-hairline flex items-center justify-center text-text-muted">
              <Trophy size={48} />
            </div>
          )}

          {!badge.unlocked && !badge.isMystery && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-surface shadow-md border border-border-hairline flex items-center justify-center">
                <Lock size={22} className="text-text-muted" />
              </div>
            </div>
          )}
        </div>

        {/* Badge Titles & Descriptions */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-text-primary mb-1">
          {badge.title}
        </h3>
        {badge.subtitle && (
          <p className="text-sm font-semibold text-brand mb-1">
            {badge.subtitle}
          </p>
        )}
        <p className="text-xs sm:text-sm text-text-secondary max-w-sm mt-1 mb-4 leading-relaxed">
          {badge.desc}
        </p>

        {/* Progress details for Tiered Badges */}
        {badge.nextTier && badge.progress && (
          <div className="w-full bg-surface-subtle border border-border-hairline rounded-2xl p-3.5 mb-4 text-left">
            <div className="flex items-center justify-between text-xs font-semibold text-text-primary mb-1.5">
              <span className="truncate pr-2">
                {lang === "de"
                  ? `Nächste Stufe: ${badge.nextTier.title}`
                  : `Next Tier: ${badge.nextTier.title}`}
              </span>
              <span className="font-mono tabular text-brand font-bold shrink-0">
                {badge.progress.current} / {badge.progress.max}
              </span>
            </div>
            <p className="text-[11px] text-text-muted mb-2">
              {badge.nextTier.desc}
            </p>
            <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-border-hairline/40">
              <div
                className="bg-brand h-full rounded-full transition-all duration-500"
                style={{ width: `${badge.progress.percent}%` }}
              />
            </div>
          </div>
        )}

        {isMaxLevel && (
          <div className="w-full bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 mb-4 flex items-center justify-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
            <Sparkles size={14} className="text-amber-500" />
            <span>
              {lang === "de"
                ? "Maximale Meisterstufe in dieser Kategorie erreicht!"
                : "Maximum mastery achieved in this category!"}
            </span>
          </div>
        )}

        {/* Close action button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-surface-subtle hover:bg-surface-hover text-text-primary transition-colors border border-border-hairline cursor-pointer"
        >
          {lang === "de" ? "Schließen" : "Close"}
        </button>
      </div>
    </div>
  );
}

function TieredBadgeCard({
  item,
  lang = "de",
  onInspect,
}: {
  item: TieredBadgeResult;
  lang: string;
  onInspect?: (data: BadgeModalData) => void;
}) {
  const { unlocked, currentTier, activeTier, nextTier, progress, color, iconName, baseBadgeKey } = item;

  const isMaxLevel = unlocked && !nextTier;
  const imageKey = activeTier.badgeKey || `${baseBadgeKey}_t${activeTier.level}`;
  const imageSrc = BADGE_IMAGES[imageKey]
    || BADGE_IMAGES[`${baseBadgeKey}_t${activeTier.level}`]
    || BADGE_IMAGES[baseBadgeKey]
    || (baseBadgeKey === "rooms" ? BADGE_IMAGES.castle : null)
    || null;

  const title = lang === "de" ? activeTier.titleDe : activeTier.titleEn;
  const subtitle = lang === "de" ? activeTier.subtitleDe : activeTier.subtitleEn;
  const desc = lang === "de" ? activeTier.descDe : activeTier.descEn;

  const modalData: BadgeModalData = {
    title,
    subtitle,
    desc,
    imageSrc,
    unlocked,
    isTiered: true,
    tierLevel: currentTier,
    maxTier: item.maxTier,
    nextTier: nextTier
      ? {
          level: nextTier.level,
          threshold: nextTier.threshold,
          title: lang === "de" ? nextTier.titleDe : nextTier.titleEn,
          subtitle: lang === "de" ? nextTier.subtitleDe : nextTier.subtitleEn,
          desc: lang === "de" ? nextTier.descDe : nextTier.descEn,
        }
      : !unlocked
      ? {
          level: activeTier.level,
          threshold: activeTier.threshold,
          title,
          subtitle,
          desc,
        }
      : null,
    progress: {
      current: progress.current,
      max: progress.max,
      percent: progress.percent,
    },
  };

  if (!unlocked) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onInspect?.(modalData)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onInspect?.(modalData);
          }
        }}
        className="p-4 rounded-xl flex flex-col items-center text-center relative bg-surface-subtle transition-all hover-lift group border border-border-hairline cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-md z-10 bg-surface text-text-muted border border-border-hairline shadow-2xs">
          {lang === "de" ? "Stufe I Ziel" : "Tier I Goal"}
        </span>

        {imageSrc ? (
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 mb-2 flex items-center justify-center">
            <Image
              src={imageSrc}
              alt={title}
              width={64}
              height={64}
              className="w-full h-full object-contain filter grayscale contrast-125 opacity-35 transition-all duration-300 group-hover:opacity-55"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-6 h-6 rounded-full bg-surface flex items-center justify-center shadow-xs border border-border-hairline">
                <Lock size={12} className="text-text-muted" />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-surface text-text-muted flex items-center justify-center mb-2 shadow-xs">
            {getTierIcon(iconName, 22)}
          </div>
        )}

        <h4 className="font-bold text-xs text-text-primary mb-0.5 leading-tight">{title}</h4>
        <p className="text-[10px] text-text-secondary font-medium leading-tight">{subtitle}</p>
        <p className="text-[10px] text-text-muted leading-tight mt-0.5">{desc}</p>

        {/* Progress Bar to unlock Stufe I */}
        <div className="w-full mt-2.5 pt-2 border-t border-border-hairline/60">
          <div className="flex items-center justify-between text-[9px] text-text-muted font-medium mb-1">
            <span>{lang === "de" ? "Fortschritt" : "Progress"}</span>
            <span className="font-mono tabular font-bold text-brand">
              {progress.current}/{progress.max}
            </span>
          </div>
          <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden border border-border-hairline/30">
            <div
              className="bg-brand h-full rounded-full transition-all duration-500"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>

        {/* Inspection Hint */}
        <div className="absolute bottom-1.5 right-1.5 text-text-muted/40 group-hover:text-brand transition-all opacity-0 group-hover:opacity-100 pointer-events-none">
          <ZoomIn size={12} />
        </div>
      </div>
    );
  }

  const roman = ROMAN_NUMERALS[currentTier - 1] || `${currentTier}`;
  const tierStyle = getTierStyle(currentTier, isMaxLevel);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onInspect?.(modalData)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onInspect?.(modalData);
        }
      }}
      className="p-4 rounded-xl flex flex-col items-center text-center relative bg-surface-subtle transition-all hover-lift group border border-border-hairline cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      {/* Tier Badge Pill */}
      <span
        className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-md z-10 border shadow-2xs ${tierStyle} flex items-center gap-0.5`}
      >
        {isMaxLevel ? (
          <>
            <Sparkles size={9} />
            <span>{lang === "de" ? "Max Level" : "Max Level"}</span>
          </>
        ) : (
          <span>{lang === "de" ? `Stufe ${roman}` : `Tier ${roman}`}</span>
        )}
      </span>

      {imageSrc ? (
        <div className="w-14 h-14 sm:w-16 sm:h-16 mb-2 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:-rotate-3 duration-300">
          <Image
            src={imageSrc}
            alt={title}
            width={64}
            height={64}
            className="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
          />
        </div>
      ) : (
        <div className={`w-10 h-10 rounded-lg bg-surface flex items-center justify-center mb-2 shadow-xs ${color}`}>
          {getTierIcon(iconName, 22)}
        </div>
      )}

      <h4 className="font-bold text-xs text-text-primary mb-0.5 leading-tight">{title}</h4>
      <p className="text-[10px] text-brand font-semibold leading-tight">{subtitle}</p>
      <p className="text-[10px] text-text-muted leading-tight mt-0.5">{desc}</p>

      {/* Level-Up Progress to Next Tier or Mastery Celebration */}
      {nextTier ? (
        <div className="w-full mt-2.5 pt-2 border-t border-border-hairline/60">
          <div className="flex items-center justify-between text-[9px] text-text-muted font-medium mb-1">
            <span className="truncate pr-1">
              {lang === "de"
                ? `Ziel: Stufe ${ROMAN_NUMERALS[nextTier.level - 1] || nextTier.level}`
                : `Next: Tier ${ROMAN_NUMERALS[nextTier.level - 1] || nextTier.level}`}
            </span>
            <span className="font-mono tabular font-bold text-text-primary shrink-0">
              {progress.current}/{progress.max}
            </span>
          </div>
          <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden border border-border-hairline/30">
            <div
              className="bg-brand h-full rounded-full transition-all duration-500"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="w-full mt-2.5 pt-2 border-t border-border-hairline/60 flex items-center justify-center">
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md bg-amber-500/10 flex items-center gap-1">
            <Sparkles size={11} className="text-amber-500" />
            {lang === "de" ? "Meisterstufe erreicht" : "Mastery Reached"}
          </span>
        </div>
      )}

      {/* Inspection Hint */}
      <div className="absolute bottom-1.5 right-1.5 text-text-muted/40 group-hover:text-brand transition-all opacity-0 group-hover:opacity-100 pointer-events-none">
        <ZoomIn size={12} />
      </div>
    </div>
  );
}

function BadgeCard({
  icon,
  badgeKey,
  title,
  desc,
  unlocked,
  color,
  pulse = false,
  isTeaser = false,
  isAspirational = false,
  isMystery = false,
  progress,
  lang = "de",
  onInspect,
}: any) {
  if (!unlocked && !isTeaser && !isMystery) return null;

  const imageSrc = badgeKey ? BADGE_IMAGES[badgeKey] : (isMystery ? BADGE_IMAGES.mystery : null);

  if (isMystery) {
    const mysteryData: BadgeModalData = {
      title: title || (lang === "de" ? "Geheimes Abzeichen" : "Secret Badge"),
      subtitle: lang === "de" ? "Botanisches Rätsel" : "Botanical Mystery",
      desc: desc || (lang === "de" ? "Entdecke diese seltene Pflanzenkombination in deiner Sammlung, um dieses Abzeichen freizuschalten!" : "Discover this rare plant combination in your collection to unlock this badge!"),
      imageSrc: imageSrc,
      unlocked: false,
      isMystery: true,
    };

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onInspect?.(mysteryData)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onInspect?.(mysteryData);
          }
        }}
        className="p-4 rounded-xl flex flex-col items-center text-center bg-surface-subtle/60 opacity-80 hover:opacity-100 transition-all duration-300 group hover-lift relative cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand border border-border-hairline/40"
      >
        {imageSrc ? (
          <div className="w-14 h-14 sm:w-16 sm:h-16 mb-2 flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
            <Image
              src={imageSrc}
              alt="Secret"
              width={64}
              height={64}
              className="w-full h-full object-contain drop-shadow-sm opacity-85"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-surface text-text-muted flex items-center justify-center mb-2 shadow-xs">
            <Lock size={18} />
          </div>
        )}
        <h4 className="font-bold text-xs text-text-secondary mb-0.5 leading-tight">
          {title || (lang === "de" ? "Geheim" : "Secret")}
        </h4>
        <p className="text-[10px] text-text-muted leading-tight">
          {desc || (lang === "de" ? "Überraschung!" : "Surprise!")}
        </p>
        <span className="mt-2 text-[10px] font-semibold text-text-muted px-2 py-0.5 rounded-md bg-surface shadow-2xs">
          ???
        </span>

        {/* Inspection Hint */}
        <div className="absolute bottom-1.5 right-1.5 text-text-muted/40 group-hover:text-text-primary transition-all opacity-0 group-hover:opacity-100 pointer-events-none">
          <ZoomIn size={12} />
        </div>
      </div>
    );
  }

  if (isTeaser && !unlocked) {
    const percent = progress && progress.max > 0 ? Math.min(100, Math.round((progress.current / progress.max) * 100)) : 0;
    const teaserData: BadgeModalData = {
      title: title || "",
      subtitle: isAspirational ? (lang === "de" ? "Aspiratives Ziel" : "Aspirational Goal") : (lang === "de" ? "Besonderes Ziel" : "Special Goal"),
      desc: desc || "",
      imageSrc: imageSrc,
      unlocked: false,
      progress: progress ? {
        current: progress.current,
        max: progress.max,
        percent,
      } : undefined,
    };

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onInspect?.(teaserData)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onInspect?.(teaserData);
          }
        }}
        className="p-4 rounded-xl flex flex-col items-center text-center relative bg-surface-subtle transition-all hover-lift group cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand border border-border-hairline"
      >
        <span
          className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.2 rounded z-10 ${
            isAspirational
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              : "bg-brand-subtle text-brand"
          }`}
        >
          {isAspirational ? (lang === "de" ? "Aspirativ ★" : "Aspirational ★") : "Teaser"}
        </span>
        {imageSrc ? (
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 mb-2 flex items-center justify-center">
            <Image
              src={imageSrc}
              alt={title}
              width={64}
              height={64}
              className="w-full h-full object-contain filter grayscale contrast-125 opacity-35 transition-all duration-300 group-hover:opacity-55"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-6 h-6 rounded-full bg-surface flex items-center justify-center shadow-xs border border-border-hairline">
                <Lock size={12} className="text-text-muted" />
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`w-10 h-10 rounded-lg bg-surface ${
              isAspirational ? "text-amber-500" : "text-text-muted"
            } flex items-center justify-center mb-2 shadow-xs`}
          >
            {icon}
          </div>
        )}
        <h4 className="font-bold text-xs text-text-primary mb-0.5 leading-tight">{title}</h4>
        <p className="text-[10px] text-text-muted leading-tight">{desc}</p>
        {progress ? (
          <>
            <div className="w-full bg-surface h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`${isAspirational ? "bg-amber-500" : "bg-brand"} h-full rounded-full transition-all duration-500`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <span
              className={`text-[10px] font-mono font-bold mt-1 tabular ${
                isAspirational ? "text-amber-600 dark:text-amber-400" : "text-brand"
              }`}
            >
              {progress.current} / {progress.max}
            </span>
          </>
        ) : (
          <span
            className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-md ${
              isAspirational
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "bg-brand-subtle text-brand"
            }`}
          >
            {isAspirational ? (lang === "de" ? "Aspirativ" : "Aspirational") : (lang === "de" ? "Ziel" : "Goal")}
          </span>
        )}

        {/* Inspection Hint */}
        <div className="absolute bottom-1.5 right-1.5 text-text-muted/40 group-hover:text-brand transition-all opacity-0 group-hover:opacity-100 pointer-events-none">
          <ZoomIn size={12} />
        </div>
      </div>
    );
  }

  const unlockedData: BadgeModalData = {
    title: title || "",
    subtitle: lang === "de" ? "Geheime Entdeckung" : "Secret Discovery",
    desc: desc || "",
    imageSrc: imageSrc,
    unlocked: true,
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onInspect?.(unlockedData)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onInspect?.(unlockedData);
        }
      }}
      className="p-4 rounded-xl flex flex-col items-center text-center transition-all bg-surface-subtle hover-lift group cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand relative border border-border-hairline"
    >
      {imageSrc ? (
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 mb-2 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:-rotate-3 duration-300 ${
            pulse ? "animate-pulse" : ""
          }`}
        >
          <Image
            src={imageSrc}
            alt={title}
            width={64}
            height={64}
            className="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
          />
        </div>
      ) : (
        <div
          className={`w-10 h-10 rounded-lg bg-surface flex items-center justify-center mb-2 shadow-xs ${color} ${
            pulse ? "animate-pulse" : ""
          }`}
        >
          {icon}
        </div>
      )}
      <h4 className="font-bold text-xs text-text-primary mb-0.5 leading-tight">{title}</h4>
      <p className="text-[10px] text-text-muted leading-tight">{desc}</p>
      <span className="mt-2 text-[10px] font-bold text-brand px-2 py-0.5 rounded-md bg-brand-subtle flex items-center gap-1">
        <Check size={10} /> {lang === "de" ? "Erreicht ✓" : "Unlocked ✓"}
      </span>

      {/* Inspection Hint */}
      <div className="absolute bottom-1.5 right-1.5 text-text-muted/40 group-hover:text-brand transition-all opacity-0 group-hover:opacity-100 pointer-events-none">
        <ZoomIn size={12} />
      </div>
    </div>
  );
}
