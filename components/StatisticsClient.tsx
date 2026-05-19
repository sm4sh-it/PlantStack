"use client";

import { useEffect, useState, useMemo } from "react";
import { ScatterChart, Scatter, ZAxis, CartesianGrid, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ReferenceLine } from "recharts";
import { Droplet, Trophy, Apple, Ghost, Monitor, BarChart2, Globe, Pizza, Utensils, CloudRain, Sun, TreePine, GlassWater, Crown, Skull, MoonStar, Activity, Castle, Sprout } from "lucide-react";
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
    fetch("/api/settings").then(res => res.json()).then(data => {
      if (data && data.language) setLang(data.language);
    }).catch(console.error);
  }, []);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6b7280'];

  const thirstyData = useMemo(() => {
    return [...plants]
      .sort((a, b) => b.wateredCount - a.wateredCount)
      .slice(0, 5)
      .map(p => ({
        name: p.name,
        watered: p.wateredCount
      }));
  }, [plants]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    plants.filter(p => !p.isArchived).forEach(p => {
      counts[p.chartCategory] = (counts[p.chartCategory] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [plants]);

  const litersWatered = (stats.totalWatered * 0.15).toFixed(1);
  const oldestDateString = stats.oldestPlantDate ? new Date(stats.oldestPlantDate).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US') : '-';

  const tooltipStyle = {
    backgroundColor: 'var(--surface)',
    color: 'var(--foreground)',
    borderColor: 'var(--border)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  };

  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      let lightLoc = data.originalSunlight || (lang === 'de' ? 'Unbekannt' : 'Unknown');
      const s = lightLoc.toLowerCase();
      if (s.includes('full_sun')) lightLoc = lang === 'de' ? 'Viel Sonne' : 'Full Sun';
      else if (s.includes('partial_shade')) lightLoc = lang === 'de' ? 'Halbschatten' : 'Partial Shade';
      else if (s.includes('shade')) lightLoc = lang === 'de' ? 'Schatten' : 'Shade';

      return (
        <div className="bg-surface border border-black/10 dark:border-white/10 p-3 rounded-xl shadow-lg">
          <p className="font-bold text-sm mb-1">{data.name}</p>
          <p className="text-xs opacity-70">{lang === 'de' ? 'Intervall:' : 'Interval:'} {data.originalInterval} {lang === 'de' ? 'Tage' : 'days'}</p>
          <p className="text-xs opacity-70">{lang === 'de' ? 'Licht:' : 'Light:'} {lightLoc}</p>
        </div>
      );
    }
    return null;
  };



  return (
    <div className="pb-24 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <BarChart2 className="text-brand" size={32} />
          {t('statistics', lang)}
        </h1>
        <p className="text-surface-foreground/70">
          {lang === 'de' ? 'Deine Gamification und Einblicke.' : 'Your gamification and insights.'}
        </p>
      </div>

      {/* Badges Section */}
      <section className="bg-surface rounded-3xl p-6 border border-black/5 dark:border-white/5 shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Trophy className="text-yellow-500" /> 
          {lang === 'de' ? 'Abzeichen' : 'Badges'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          
          <BadgeCard 
            icon={<Droplet size={32} />}
            title={lang === 'de' ? 'Regenmacher' : 'Rainmaker'}
            desc={lang === 'de' ? '100x gegossen' : 'Watered 100x'}
            unlocked={badges.rainmaker}
            color="text-blue-500"
          />
          <BadgeCard 
            icon={<Leaf size={32} />}
            title={lang === 'de' ? 'Botanik-Nerd' : 'Botany Nerd'}
            desc={lang === 'de' ? '10 aktive Pflanzen' : '10 active plants'}
            unlocked={badges.botanyNerd}
            color="text-green-500"
          />
          <BadgeCard 
            icon={<Apple size={32} />}
            title={lang === 'de' ? 'Erntezeit' : 'Harvest Time'}
            desc={lang === 'de' ? 'Hat Obst/Gemüse' : 'Has fruit/veg'}
            unlocked={badges.harvestTime}
            color="text-red-500"
          />
          <BadgeCard 
            icon={<Ghost size={32} />}
            title={lang === 'de' ? 'Die Verlorenen' : 'The lost ones'}
            desc={lang === 'de' ? 'Eine Pflanze verloren' : 'Lost a plant'}
            unlocked={badges.petSematary}
            color="text-gray-400"
          />
          <BadgeCard 
            icon={<Monitor size={32} />}
            title="IT-Support"
            desc={lang === 'de' ? 'Easter Egg gefunden!' : 'Found an Easter Egg!'}
            unlocked={badges.itSupport}
            color="text-purple-500"
            pulse
          />

          <BadgeCard 
            icon={<Pizza size={32} />}
            title="Pizza Margherita"
            desc={lang === 'de' ? 'Tomate & Basilikum' : 'Tomato & Basil'}
            unlocked={badges.pizzaMargherita}
            color="text-orange-500"
          />
          <BadgeCard 
            icon={<Utensils size={32} />}
            title="Wedges"
            desc={lang === 'de' ? 'Kartoffel & Rosmarin' : 'Potato & Rosemary'}
            unlocked={badges.wedges}
            color="text-yellow-600"
          />
          <BadgeCard 
            icon={<TreePine size={32} />}
            title="Jungle"
            desc={lang === 'de' ? '4x Monstera' : '4x Monstera'}
            unlocked={badges.jungle}
            color="text-green-600"
          />
          <BadgeCard 
            icon={<CloudRain size={32} />}
            title="Rainforest"
            desc={lang === 'de' ? 'Monstera & Strelitzie' : 'Monstera & Strelitzie'}
            unlocked={badges.rainforest}
            color="text-teal-500"
          />
          <BadgeCard 
            icon={<Sun size={32} />}
            title="Desert"
            desc={lang === 'de' ? '3x Kakteen/Sukkulenten' : '3x Cacti/Succulents'}
            unlocked={badges.desert}
            color="text-amber-500"
          />
          <BadgeCard 
            icon={<Globe size={32} />}
            title={lang === 'de' ? 'Weltreise' : 'World Tour'}
            desc={lang === 'de' ? '3 verschiedene Herkünfte' : '3 different origins'}
            unlocked={badges.worldTour}
            color="text-blue-400"
          />

          <BadgeCard 
            icon={<GlassWater size={32} />}
            title="Gin-Tonic"
            desc={lang === 'de' ? 'Zitrone & Gurke' : 'Lemon & Cucumber'}
            unlocked={badges.ginTonic}
            color="text-emerald-400"
          />
          <BadgeCard 
            icon={<Crown size={32} />}
            title="Drama Queen"
            desc={lang === 'de' ? 'Spathiphyllum/Fittonia' : 'Peace Lily/Fittonia'}
            unlocked={badges.dramaQueen}
            color="text-pink-500"
          />
          <BadgeCard 
            icon={<Skull size={32} />}
            title="Serial Killer"
            desc={lang === 'de' ? '3 archiviert in 2 Mon.' : '3 archived in 2 mo'}
            unlocked={badges.serialKiller}
            color="text-red-600"
          />
          <BadgeCard 
            icon={<MoonStar size={32} />}
            title="Gothic Garden"
            desc={lang === 'de' ? '3x Schatten/Dark' : '3x Shade/Dark'}
            unlocked={badges.gothicGarden}
            color="text-indigo-500"
          />
          <BadgeCard 
            icon={<Castle size={32} />}
            title={lang === 'de' ? 'Schloss' : 'Castle'}
            desc={lang === 'de' ? '>6 Räume/Bereiche' : '>6 rooms/areas'}
            unlocked={badges.castle}
            color="text-yellow-600"
          />
          <BadgeCard 
            icon={<Ghost size={32} />}
            title={lang === 'de' ? 'Geisterschloss' : 'Haunted Castle'}
            desc={lang === 'de' ? '10+ archiviert' : '10+ archived'}
            unlocked={badges.hauntedCastle}
            color="text-gray-500"
          />
          <BadgeCard 
            icon={<Sprout size={32} />}
            title={lang === 'de' ? 'Diversität (Bronze)' : 'Diversity (Bronze)'}
            desc={lang === 'de' ? '5+ Arten' : '5+ species'}
            unlocked={badges.diversityBronze && !badges.diversitySilver && !badges.diversityGold}
            color="text-amber-700"
          />
          <BadgeCard 
            icon={<Leaf size={32} />}
            title={lang === 'de' ? 'Diversität (Silber)' : 'Diversity (Silver)'}
            desc={lang === 'de' ? '10+ Arten' : '10+ species'}
            unlocked={badges.diversitySilver && !badges.diversityGold}
            color="text-gray-400"
          />
          <BadgeCard 
            icon={<TreePine size={32} />}
            title={lang === 'de' ? 'Diversität (Gold)' : 'Diversity (Gold)'}
            desc={lang === 'de' ? '20+ Arten' : '20+ species'}
            unlocked={badges.diversityGold}
            color="text-yellow-500"
          />
          <BadgeCard 
            icon={<Utensils size={32} />}
            title={lang === 'de' ? 'Mittelmeer Mix' : 'Mediterranean Mix'}
            desc={lang === 'de' ? '3+ Kräuter' : '3+ herbs'}
            unlocked={badges.mediterraneanMix}
            color="text-emerald-500"
          />

        </div>
      </section>



      {/* Fun Facts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-surface p-6 rounded-3xl border border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-black text-brand mb-2">{stats.activeCount}</span>
          <span className="text-sm text-surface-foreground/70">{lang === 'de' ? 'Aktive Pflanzen' : 'Active plants'}</span>
        </div>
        <div className="bg-surface p-6 rounded-3xl border border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-black text-brand mb-2">{litersWatered} L</span>
          <span className="text-sm text-surface-foreground/70">{lang === 'de' ? 'Wasser (ca.)' : 'Water (est.)'}</span>
        </div>
        <div className="bg-surface p-6 rounded-3xl border border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-black text-brand mb-2">{stats.survivalRate}</span>
          <span className="text-sm text-surface-foreground/70">{lang === 'de' ? 'Überlebensrate' : 'Survival Rate'}</span>
        </div>
        <div className="bg-surface p-6 rounded-3xl border border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold text-brand mb-2">{oldestDateString}</span>
          <span className="text-sm text-surface-foreground/70">{t('oldestPlant', lang)}</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 [&_.recharts-wrapper]:outline-none [&_.recharts-surface]:outline-none [&_*]:focus:outline-none">
        <div className="bg-surface p-6 rounded-3xl border border-black/5 dark:border-white/5 h-96 flex flex-col">
          <h3 className="text-lg font-bold mb-4">{t('theThirstyOnes', lang)}</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={thirstyData} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'currentColor' }} className="text-xs text-surface-foreground dark:text-zinc-300 font-medium" width={100} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={tooltipStyle} itemStyle={{color: 'var(--foreground)'}} />
                <Bar dataKey="watered" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-black/5 dark:border-white/5 h-96 flex flex-col">
          <h3 className="text-lg font-bold mb-4">{t('topOrigins', lang)}</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topOrigins} layout="vertical" margin={{ top: 0, right: 0, left: 80, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'currentColor' }} className="text-xs text-surface-foreground dark:text-zinc-300 font-medium" width={80} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={tooltipStyle} itemStyle={{color: 'var(--foreground)'}} />
                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Garden Vibe & Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 [&_.recharts-wrapper]:outline-none [&_.recharts-surface]:outline-none [&_*]:focus:outline-none">
        
        {/* Fadenkreuz Scatter */}
        <section className="bg-surface rounded-3xl p-6 border border-black/5 dark:border-white/5 shadow-sm aspect-square flex flex-col relative overflow-hidden">
          <h2 className="text-xl font-bold mb-4 z-10 relative">{t('survivalCoordinates', lang)}</h2>
          <div className="flex-1 w-full min-h-0 relative z-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis type="number" dataKey="x" domain={[0, 4]} hide />
                <YAxis type="number" dataKey="y" domain={[0, 30]} hide />
                <ZAxis range={[60, 60]} />
                <ReferenceLine x={2} stroke="currentColor" strokeDasharray="3 3" className="opacity-20 dark:opacity-30" />
                <ReferenceLine y={15} stroke="currentColor" strokeDasharray="3 3" className="opacity-20 dark:opacity-30" />
                <Tooltip content={<CustomScatterTooltip />} cursor={{strokeDasharray: '3 3'}} />
                <Scatter name="Plants" data={stats.matrixData} fill="#10b981" />
              </ScatterChart>
            </ResponsiveContainer>
            
            {/* Edge Labels */}
            <div className="absolute top-2 w-full text-center text-xs text-surface-foreground/40 font-bold uppercase tracking-wider pointer-events-none leading-tight whitespace-pre-line">{t('waterJunkie', lang)}</div>
            <div className="absolute bottom-2 w-full text-center text-xs text-surface-foreground/40 font-bold uppercase tracking-wider pointer-events-none leading-tight whitespace-pre-line">{t('cactusVibes', lang)}</div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-surface-foreground/40 font-bold uppercase tracking-wider whitespace-nowrap origin-center pointer-events-none">{t('shadeDweller', lang)}</div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-xs text-surface-foreground/40 font-bold uppercase tracking-wider whitespace-nowrap origin-center pointer-events-none">{t('sunWorshipper', lang)}</div>
          </div>
        </section>

        {/* Radar Chart */}
        <section className="bg-surface rounded-3xl p-6 border border-black/5 dark:border-white/5 shadow-sm aspect-square flex flex-col relative overflow-hidden">
          <h2 className="text-xl font-bold mb-4">{t('theGardenVibe', lang)}</h2>
          <div className="flex-1 w-full min-h-0 relative z-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius="65%" data={stats.radarData.map((d: any) => ({
                ...d, 
                subject: t(
                  d.subject === 'Durst' ? 'thirst' :
                  d.subject === 'Lichthunger' ? 'lightNeed' :
                  d.subject === 'Pflegeleichtigkeit' ? 'easeOfCare' :
                  d.subject === 'Artenvielfalt' ? 'diversity' :
                  d.subject === 'Nutzgarten-Anteil' ? 'edibleRatio' :
                  d.subject === 'Freiluft-Faktor' ? 'outdoorFactor' : d.subject as any, 
                  lang
                )
              }))} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <PolarGrid stroke="currentColor" className="opacity-10 dark:opacity-20" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: 11 }} className="text-surface-foreground dark:text-zinc-300 font-bold tracking-wide" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Vibe" dataKey="A" stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>
        
      </div>

      {/* Action Logs Summary */}
      <section className="bg-surface rounded-3xl p-6 border border-black/5 dark:border-white/5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Activity className="text-brand" /> 
            {t('activities', lang)}
          </h2>
          <div className="flex gap-4 text-sm font-bold bg-black/5 dark:bg-white/5 px-4 py-2 rounded-xl">
            <span className="opacity-70">{t('yearlyTotal', lang)}</span>
            <span className="text-blue-500">{stats.eventSummary.yearWater} 💧</span>
            <span className="text-amber-500">{stats.eventSummary.yearFertilize} 🧪</span>
            <span className="text-green-500">{stats.eventSummary.yearCreate} 🌱</span>
            <span className="text-gray-500">{stats.eventSummary.yearArchive} 💀</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-500/10 rounded-2xl">
            <p className="text-sm opacity-70 mb-1">{t('wateredMonth', lang)}</p>
            <p className="text-2xl font-bold">{stats.eventSummary.monthWater}</p>
          </div>
          <div className="p-4 bg-amber-500/10 rounded-2xl">
            <p className="text-sm opacity-70 mb-1">{t('fertilizedMonth', lang)}</p>
            <p className="text-2xl font-bold">{stats.eventSummary.monthFertilize}</p>
          </div>
          <div className="p-4 bg-green-500/10 rounded-2xl">
            <p className="text-sm opacity-70 mb-1">{t('newPlantedMonth', lang)}</p>
            <p className="text-2xl font-bold">{stats.eventSummary.monthCreate}</p>
          </div>
          <div className="p-4 bg-gray-500/10 rounded-2xl">
            <p className="text-sm opacity-70 mb-1">{t('archivedMonth', lang)}</p>
            <p className="text-2xl font-bold">{stats.eventSummary.monthArchive}</p>
          </div>
        </div>
      </section>

    </div>
  );
}

function BadgeCard({ icon, title, desc, unlocked, color, pulse = false }: any) {
  if (!unlocked) return null;

  return (
    <div className={`p-4 rounded-2xl flex flex-col items-center text-center transition-all duration-300 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10`}>
      <div className={`mb-3 ${color} ${pulse ? 'animate-pulse' : ''}`}>
        {icon}
      </div>
      <h4 className="font-bold text-sm mb-1 leading-tight">{title}</h4>
      <p className="text-xs text-surface-foreground/60">{desc}</p>
    </div>
  );
}

// simple Leaf icon for fallback since it's not imported directly in the generic imports
function Leaf({size}: {size: number}) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>;
}
