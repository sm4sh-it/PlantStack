"use client";

import { useEffect, useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Droplet, Trophy, Apple, Ghost, Monitor, BarChart2 } from "lucide-react";
import { t } from "@/lib/i18n";

type StatisticsClientProps = {
  plants: any[];
  badges: {
    rainmaker: boolean;
    botanyNerd: boolean;
    harvestTime: boolean;
    petSematary: boolean;
    itSupport: boolean;
  };
  stats: {
    totalWatered: number;
    activeCount: number;
    archivedCount: number;
    oldestPlantDate: Date | null;
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

  const litersWatered = (stats.totalWatered * 0.5).toFixed(1);
  const oldestDateString = stats.oldestPlantDate ? new Date(stats.oldestPlantDate).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US') : '-';

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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          
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
            title={lang === 'de' ? 'Friedhof der Kuscheltiere' : 'Pet Sematary'}
            desc={lang === 'de' ? 'Eine Pflanze verloren' : 'Lost a plant'}
            unlocked={badges.petSematary}
            color="text-gray-400"
          />
          
          {/* Secret Badge - IT Support */}
          {badges.itSupport && (
            <BadgeCard 
              icon={<Monitor size={32} />}
              title="IT-Support"
              desc={lang === 'de' ? 'Easter Egg gefunden!' : 'Found an Easter Egg!'}
              unlocked={true}
              color="text-purple-500"
              pulse
            />
          )}

        </div>
      </section>

      {/* Fun Facts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-3xl border border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-black text-brand mb-2">{litersWatered} L</span>
          <span className="text-sm text-surface-foreground/70">{lang === 'de' ? 'Wasser gegossen (geschätzt)' : 'Water poured (estimated)'}</span>
        </div>
        <div className="bg-surface p-6 rounded-3xl border border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-black text-brand mb-2">{stats.activeCount}</span>
          <span className="text-sm text-surface-foreground/70">{lang === 'de' ? 'Aktive Pflanzen im Dschungel' : 'Active plants in jungle'}</span>
        </div>
        <div className="bg-surface p-6 rounded-3xl border border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold text-brand mb-2">{oldestDateString}</span>
          <span className="text-sm text-surface-foreground/70">{lang === 'de' ? 'Älteste Pflanze seit' : 'Oldest plant since'}</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface p-6 rounded-3xl border border-black/5 dark:border-white/5 h-96 flex flex-col">
          <h3 className="text-lg font-bold mb-4">{lang === 'de' ? 'Die Durstigen (Top 5)' : 'The Thirsty Ones (Top 5)'}</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={thirstyData} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} className="text-xs" width={100} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="watered" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-black/5 dark:border-white/5 h-96 flex flex-col">
          <h3 className="text-lg font-bold mb-4">{lang === 'de' ? 'Dschungel-Verhältnis' : 'Jungle Ratio'}</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}

function BadgeCard({ icon, title, desc, unlocked, color, pulse = false }: any) {
  return (
    <div className={`p-4 rounded-2xl flex flex-col items-center text-center transition-all duration-300 ${unlocked ? 'bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10' : 'opacity-40 grayscale'}`}>
      <div className={`mb-3 ${unlocked ? color : 'text-surface-foreground'} ${pulse && unlocked ? 'animate-pulse' : ''}`}>
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
