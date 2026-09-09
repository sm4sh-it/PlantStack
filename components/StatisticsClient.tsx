"use client";

import { useEffect, useState, useMemo } from "react";
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
  BarChart2,
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
  Sprout,
  Lock,
  Sparkles,
  Check,
  BugOff,
  SprayCan,
  Leaf,
} from "lucide-react";
import { t } from "@/lib/i18n";

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
  };
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

export default function StatisticsClient({ plants, badges, stats }: StatisticsClientProps) {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.language) setLang(data.language);
      })
      .catch(console.error);
  }, []);

  const thirstyData = useMemo(() => {
    return [...plants]
      .sort((a, b) => b.wateredCount - a.wateredCount)
      .slice(0, 5)
      .map((p) => ({
        name: p.name,
        watered: p.wateredCount,
      }));
  }, [plants]);

  const litersWatered = (stats.totalWatered * 0.15).toFixed(1);
  const oldestDateString = stats.oldestPlantDate
    ? new Date(stats.oldestPlantDate).toLocaleDateString(lang === "de" ? "de-DE" : "en-US")
    : "-";

  // Recharts Custom Tooltip (Floating, borderless, zero thick wireframe)
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface/95 backdrop-blur-md border border-border-hairline px-3 py-2 rounded-xl shadow-xl text-xs">
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
        <div className="bg-surface/95 backdrop-blur-md border border-border-hairline px-3 py-2 rounded-xl shadow-xl text-xs">
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
        <div className="bg-surface/95 backdrop-blur-md border border-border-hairline p-3 rounded-xl shadow-xl text-xs">
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

  const unlockedCount = Object.values(badges).filter(Boolean).length;

  return (
    <div className="pb-24 space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1 flex items-center gap-3 text-foreground">
            <BarChart2 className="text-brand" size={32} />
            {t("statistics", lang)}
          </h1>
          <p className="text-sm text-text-muted">
            {lang === "de"
              ? "Deine Gamification, Abzeichen und botanischen Einblicke."
              : "Your gamification, achievements and botanical insights."}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-surface border border-border-hairline px-4 py-2 rounded-xl card-elevation text-xs font-semibold text-text-primary self-start sm:self-auto">
          <Trophy size={16} className="text-amber-500 shrink-0" />
          <span>
            {unlockedCount} / {Object.keys(badges).length}{" "}
            {lang === "de" ? "Freigeschaltet" : "Unlocked"}
          </span>
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
              {lang === "de" ? "Abzeichen & Entdeckungen" : "Badges & Achievements"}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {lang === "de"
                ? "Erfülle Ziele oder entdecke geheime botanische Kombinationen!"
                : "Complete goals or discover secret botanical combinations!"}
            </p>
          </div>
        </div>

        {/* 6 Teaser/Mystery Slots & Unlocked Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Teaser 1: Regenmacher */}
          <BadgeCard
            icon={<Droplet size={24} />}
            title={lang === "de" ? "Regenmacher" : "Rainmaker"}
            desc={lang === "de" ? "100x gegossen" : "Watered 100x"}
            unlocked={badges.rainmaker}
            color="text-care-water"
            isTeaser
          />

          {/* Teaser 2: Botanik-Nerd */}
          <BadgeCard
            icon={<Leaf size={24} />}
            title={lang === "de" ? "Botanik-Nerd" : "Botany Nerd"}
            desc={lang === "de" ? "10 aktive Pflanzen" : "10 active plants"}
            unlocked={badges.botanyNerd}
            color="text-brand"
            isTeaser
          />

          {/* Teaser 3: Erntezeit */}
          <BadgeCard
            icon={<Apple size={24} />}
            title={lang === "de" ? "Erntezeit" : "Harvest Time"}
            desc={lang === "de" ? "Obst/Gemüse/Kräuter" : "Fruit/veg/herbs"}
            unlocked={badges.harvestTime}
            color="text-rose-500"
            isTeaser
          />

          {/* Teaser 4: Weltreise (Aspirativ) */}
          <BadgeCard
            icon={<Globe size={24} />}
            title={lang === "de" ? "Weltreise" : "World Tour"}
            desc={lang === "de" ? "Mind. 8 Herkünfte" : "8+ different origins"}
            unlocked={badges.worldTour}
            color="text-amber-500"
            isTeaser
            isAspirational
          />

          {/* Dynamische Unlocked Badges */}
          <BadgeCard
            icon={<Ghost size={24} />}
            title={lang === "de" ? "Die Verlorenen" : "The Lost Ones"}
            desc={lang === "de" ? "Eine Pflanze verloren" : "Lost a plant"}
            unlocked={badges.petSematary}
            color="text-neutral-400"
          />
          <BadgeCard
            icon={<Monitor size={24} />}
            title="IT-Support"
            desc={lang === "de" ? "Easter Egg gefunden!" : "Found an Easter Egg!"}
            unlocked={badges.itSupport}
            color="text-purple-500"
            pulse
          />
          <BadgeCard
            icon={<Pizza size={24} />}
            title="Pizza Margherita"
            desc={lang === "de" ? "Tomate & Basilikum" : "Tomato & Basil"}
            unlocked={badges.pizzaMargherita}
            color="text-orange-500"
          />
          <BadgeCard
            icon={<Utensils size={24} />}
            title="Wedges"
            desc={lang === "de" ? "Kartoffel & Rosmarin" : "Potato & Rosemary"}
            unlocked={badges.wedges}
            color="text-amber-600"
          />
          <BadgeCard
            icon={<TreePine size={24} />}
            title="Jungle"
            desc={lang === "de" ? "4x Monstera" : "4x Monstera"}
            unlocked={badges.jungle}
            color="text-emerald-600"
          />
          <BadgeCard
            icon={<CloudRain size={24} />}
            title="Rainforest"
            desc={lang === "de" ? "Monstera & Strelitzie" : "Monstera & Strelitzia"}
            unlocked={badges.rainforest}
            color="text-care-fungus"
          />
          <BadgeCard
            icon={<Sun size={24} />}
            title="Desert"
            desc={lang === "de" ? "3x Kakteen/Sukkulenten" : "3x Cacti/Succulents"}
            unlocked={badges.desert}
            color="text-amber-500"
          />
          <BadgeCard
            icon={<GlassWater size={24} />}
            title="Gin-Tonic"
            desc={lang === "de" ? "Zitrone & Gurke" : "Lemon & Cucumber"}
            unlocked={badges.ginTonic}
            color="text-emerald-400"
          />
          <BadgeCard
            icon={<Crown size={24} />}
            title="Drama Queen"
            desc={lang === "de" ? "Spathiphyllum/Fittonia" : "Peace Lily/Fittonia"}
            unlocked={badges.dramaQueen}
            color="text-pink-500"
          />
          <BadgeCard
            icon={<Skull size={24} />}
            title="Serial Killer"
            desc={lang === "de" ? "3 archiviert in 2 Mon." : "3 archived in 2 mo"}
            unlocked={badges.serialKiller}
            color="text-red-500"
          />
          <BadgeCard
            icon={<MoonStar size={24} />}
            title="Gothic Garden"
            desc={lang === "de" ? "3x Schatten/Dark" : "3x Shade/Dark"}
            unlocked={badges.gothicGarden}
            color="text-indigo-400"
          />
          <BadgeCard
            icon={<Castle size={24} />}
            title={lang === "de" ? "Schloss" : "Castle"}
            desc={lang === "de" ? ">6 Räume/Bereiche" : ">6 rooms/areas"}
            unlocked={badges.castle}
            color="text-amber-600"
          />
          <BadgeCard
            icon={<Ghost size={24} />}
            title={lang === "de" ? "Geisterschloss" : "Haunted Castle"}
            desc={lang === "de" ? "10+ archiviert" : "10+ archived"}
            unlocked={badges.hauntedCastle}
            color="text-neutral-400"
          />
          <BadgeCard
            icon={<Sprout size={24} />}
            title={lang === "de" ? "Diversität (Bronze)" : "Diversity (Bronze)"}
            desc={lang === "de" ? "5+ Arten" : "5+ species"}
            unlocked={badges.diversityBronze && !badges.diversitySilver && !badges.diversityGold}
            color="text-amber-700"
          />
          <BadgeCard
            icon={<Leaf size={24} />}
            title={lang === "de" ? "Diversität (Silber)" : "Diversity (Silver)"}
            desc={lang === "de" ? "10+ Arten" : "10+ species"}
            unlocked={badges.diversitySilver && !badges.diversityGold}
            color="text-neutral-400"
          />
          <BadgeCard
            icon={<TreePine size={24} />}
            title={lang === "de" ? "Diversität (Gold)" : "Diversity (Gold)"}
            desc={lang === "de" ? "20+ Arten" : "20+ species"}
            unlocked={badges.diversityGold}
            color="text-yellow-500"
          />
          <BadgeCard
            icon={<Utensils size={24} />}
            title={lang === "de" ? "Mittelmeer Mix" : "Mediterranean Mix"}
            desc={lang === "de" ? "3+ Kräuter" : "3+ herbs"}
            unlocked={badges.mediterraneanMix}
            color="text-emerald-500"
          />

          {/* Mystery Teaser Slots (5 & 6) */}
          <BadgeCard
            isMystery
            desc={lang === "de" ? "Finde die Kombination!" : "Find the secret combo!"}
          />
          <BadgeCard
            isMystery
            desc={lang === "de" ? "Geheime Pflanzenerfolge" : "Secret botanical combos"}
          />
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
    </div>
  );
}

function BadgeCard({
  icon,
  title,
  desc,
  unlocked,
  color,
  pulse = false,
  isTeaser = false,
  isAspirational = false,
  isMystery = false,
}: any) {
  if (!unlocked && !isTeaser && !isMystery) return null;

  if (isMystery) {
    return (
      <div className="p-3.5 rounded-xl flex flex-col items-center text-center bg-surface-subtle/50 border border-border-hairline opacity-60 hover:opacity-90 transition-opacity">
        <div className="w-11 h-11 rounded-xl bg-surface-subtle text-text-muted/60 flex items-center justify-center mb-2">
          <Lock size={18} />
        </div>
        <h4 className="font-bold text-xs text-text-secondary mb-0.5 leading-tight">
          {title || "Geheimes Abzeichen"}
        </h4>
        <p className="text-[11px] text-text-muted leading-tight">
          {desc || "Freischalten durch Entdecken!"}
        </p>
        <span className="mt-2 text-[10px] font-bold text-text-muted px-2 py-0.5 rounded-full bg-surface-subtle">
          ???
        </span>
      </div>
    );
  }

  if (isTeaser && !unlocked) {
    return (
      <div
        className={`p-3.5 rounded-xl flex flex-col items-center text-center relative border-2 border-dashed ${
          isAspirational
            ? "border-amber-500/30 bg-amber-500/5"
            : "border-brand/30 bg-brand-subtle/20"
        } transition-all hover-lift`}
      >
        <span
          className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
            isAspirational
              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
              : "bg-brand-subtle text-brand"
          }`}
        >
          {isAspirational ? "Aspirativ ★" : "Teaser"}
        </span>
        <div
          className={`w-11 h-11 rounded-xl bg-surface ${
            isAspirational ? "text-amber-500/80" : "text-brand/80"
          } flex items-center justify-center mb-2 shadow-xs`}
        >
          {icon}
        </div>
        <h4 className="font-bold text-xs text-text-primary mb-0.5 leading-tight">{title}</h4>
        <p className="text-[11px] text-text-muted leading-tight">{desc}</p>
        <span
          className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isAspirational
              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
              : "bg-brand-subtle text-brand"
          }`}
        >
          Ziel
        </span>
      </div>
    );
  }

  return (
    <div className="p-3.5 rounded-xl flex flex-col items-center text-center transition-all bg-surface border border-border-hairline card-elevation hover-lift">
      <div
        className={`w-11 h-11 rounded-xl bg-surface-subtle flex items-center justify-center mb-2 shadow-xs ${color} ${
          pulse ? "animate-pulse" : ""
        }`}
      >
        {icon}
      </div>
      <h4 className="font-bold text-xs text-text-primary mb-0.5 leading-tight">{title}</h4>
      <p className="text-[11px] text-text-muted leading-tight">{desc}</p>
      <span className="mt-2 text-[10px] font-bold text-brand px-2 py-0.5 rounded-full bg-brand-subtle flex items-center gap-1">
        <Check size={10} /> Freigeschaltet
      </span>
    </div>
  );
}
