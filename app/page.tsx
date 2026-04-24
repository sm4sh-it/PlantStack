"use client";

import { useEffect, useState, useMemo } from "react";
import PlantCard from "@/components/PlantCard";
import PlantForm from "@/components/PlantForm";
import PlantDetailsModal from "@/components/PlantDetailsModal";
import { Plus } from "lucide-react";
import { Plant, Location } from "@prisma/client";
import { t } from "@/lib/i18n";

type PlantWithLocation = Plant & { location?: Location };

function getRandomPlantQuote(plantCount: number, lang: string): string {
  // Keeping it English/German generic depending on lang
  const quotesDe = {
    empty: ["Hier ist es noch ganz schön kahl. Zeit für etwas Grün!", "Warte auf den ersten Sprössling..."],
    one: ["Juhu, du hast deine erste Pflanze hinzugefügt!", "Aller Anfang ist grün."],
    two: ["Ein Pflanzenpaar, wie schön!", "Zwei Pflanzen sind besser als eine."],
    few: ["Der Dschungel wächst und gedeiht!", "So langsam brauchst du eine Machete."],
    many: ["Wow, so viel Grün!", "Du hast den 'Urban Jungle' Modus freigeschaltet."],
    pro: ["Willkommen im privaten Botanischen Garten!", "Haben deine Pflanzen noch Platz für dich?"],
    botanist: ["Vielleicht kündigen und Vollzeit-Botaniker werden?", "Amazonas-Feeling pur."]
  };
  const quotesEn = {
    empty: ["It's a bit bare here. Time for some green!", "Waiting for the first sprout..."],
    one: ["Yay, you added your first plant!", "Every jungle starts with a single leaf."],
    two: ["A plant pair, how lovely!", "Two plants are better than one."],
    few: ["The jungle is growing and thriving!", "You're going to need a machete soon."],
    many: ["Wow, so much green!", "You unlocked 'Urban Jungle' mode."],
    pro: ["Welcome to your private botanical garden!", "Do your plants still leave room for you?"],
    botanist: ["Maybe quit your job and become a full-time botanist?", "Pure Amazon feeling."]
  };
  
  const q = lang === 'de' ? quotesDe : quotesEn;
  const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  if (plantCount === 0) return getRandom(q.empty);
  if (plantCount === 1) return getRandom(q.one);
  if (plantCount === 2) return getRandom(q.two);
  if (plantCount <= 10) return getRandom(q.few);
  if (plantCount <= 20) return getRandom(q.many);
  if (plantCount <= 49) return getRandom(q.pro);
  return getRandom(q.botanist);
}

export default function Dashboard() {
  const [plants, setPlants] = useState<PlantWithLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlant, setEditingPlant] = useState<PlantWithLocation | null>(null);
  const [detailsPlant, setDetailsPlant] = useState<PlantWithLocation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [sortMode, setSortMode] = useState<"interval" | "location" | "alphabetical">("interval");
  
  const [lang, setLang] = useState("en");
  const [gridCols, setGridCols] = useState(4);
  const [customTitle, setCustomTitle] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [plantsRes, configRes] = await Promise.all([
        fetch("/api/plants"),
        fetch("/api/settings")
      ]);
      const pData = await plantsRes.json();
      const cData = await configRes.json();
      
      setPlants(pData);
      if (cData) {
        if (cData.language) setLang(cData.language);
        if (cData.gridColumns) setGridCols(cData.gridColumns);
        if (cData.dashboardTitle) setCustomTitle(cData.dashboardTitle);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (plantId: string, action: string) => {
    try {
      await fetch(`/api/plants/${plantId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      fetchData();
    } catch (e) {
      console.error("Action failed", e);
    }
  };

  const handleDelete = async (plantId: string) => {
    if (!confirm("Are you sure you want to delete this plant?")) return;
    try {
      await fetch(`/api/plants/${plantId}`, { method: "DELETE" });
      fetchData();
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const sortedPlants = useMemo(() => {
    const getScore = (p: PlantWithLocation) => {
      const now = new Date();
      const addD = (d: Date, i: number) => { const r = new Date(d); r.setDate(r.getDate() + i); return r; };
      const wDue = addD(new Date(p.lastWatered), p.waterInterval).getTime() - now.getTime();
      const fDue = p.fertilizerInterval ? addD(new Date(p.lastFertilized || 0), p.fertilizerInterval).getTime() - now.getTime() : 999999999999;
      const bDue = p.bugInterval ? addD(new Date(p.lastBug || 0), p.bugInterval).getTime() - now.getTime() : 999999999999;
      const fuDue = p.fungusInterval ? addD(new Date(p.lastFungus || 0), p.fungusInterval).getTime() - now.getTime() : 999999999999;
      return Math.min(wDue, fDue, bDue, fuDue);
    };

    const sortedByInterval = [...plants].sort((a, b) => getScore(a) - getScore(b));

    if (sortMode === "interval") return sortedByInterval;
    if (sortMode === "alphabetical") return [...plants].sort((a, b) => a.name.localeCompare(b.name));
    
    return sortedByInterval;
  }, [plants, sortMode]);

  const locationGroups = useMemo(() => {
    if (sortMode !== "location") return null;
    const groups: Record<string, PlantWithLocation[]> = {};
    sortedPlants.forEach(p => {
      const locName = p.location?.name || "Unassigned";
      if (!groups[locName]) groups[locName] = [];
      groups[locName].push(p);
    });
    return Object.keys(groups).sort().map(key => ({ name: key, items: groups[key] }));
  }, [sortedPlants, sortMode]);

  const gridClassMap: Record<number, string> = {
    4: "lg:grid-cols-3 xl:grid-cols-4",
    5: "lg:grid-cols-4 xl:grid-cols-5",
    6: "lg:grid-cols-4 xl:grid-cols-6",
  };
  const gridClass = gridClassMap[gridCols] || gridClassMap[4];

  return (
    <div className="pb-24">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">{customTitle || t('myJungle', lang)}</h1>
          <p className="text-surface-foreground/70">{getRandomPlantQuote(plants.length, lang)}</p>
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <div className="flex bg-surface border border-black/5 dark:border-white/5 rounded-xl p-1 shadow-sm shrink-0">
            <button 
              onClick={() => setSortMode("alphabetical")}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${sortMode === "alphabetical" ? "bg-background shadow text-brand" : "text-surface-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"}`}
            >
              {t('az', lang)}
            </button>
            <button 
              onClick={() => setSortMode("location")}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${sortMode === "location" ? "bg-background shadow text-brand" : "text-surface-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"}`}
            >
              {t('rooms', lang)}
            </button>
            <button 
              onClick={() => setSortMode("interval")}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${sortMode === "interval" ? "bg-background shadow text-brand" : "text-surface-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"}`}
            >
              Timeline
            </button>
          </div>
          <button 
            onClick={() => { setEditingPlant(null); setShowForm(true); }}
            className="bg-brand hover:bg-brand-dark text-white p-3 md:px-5 md:py-2.5 rounded-full md:rounded-xl shadow-lg transition-transform flex items-center gap-2 shrink-0 overflow-hidden"
          >
            <Plus size={20} />
            <span className="hidden md:inline font-medium">{t('addPlant', lang)}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridClass} gap-6 animate-pulse`}>
          {[1,2,3,4].map(n => <div key={n} className="bg-surface h-[360px] rounded-2xl"></div>)}
        </div>
      ) : plants.length > 0 ? (
        sortMode === "location" && locationGroups ? (
          <div className="space-y-12">
            {locationGroups.map(group => (
              <div key={group.name} className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-surface-foreground border-b border-black/5 dark:border-white/5 pb-2">
                   {group.name}
                   <span className="text-sm font-normal text-surface-foreground/50 ml-2">({group.items.length})</span>
                </h2>
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridClass} gap-6`}>
                  {group.items.map(plant => (
                    <PlantCard key={plant.id} plant={plant} lang={lang} onAction={handleAction} onEdit={(p) => { setEditingPlant(p); setShowForm(true); }} onDelete={handleDelete} onShowDetails={setDetailsPlant} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridClass} gap-6`}>
            {sortedPlants.map(plant => (
              <PlantCard 
                key={plant.id} 
                plant={plant} 
                lang={lang}
                onAction={handleAction}
                onEdit={(p) => { setEditingPlant(p); setShowForm(true); }}
                onDelete={handleDelete}
                onShowDetails={setDetailsPlant}
              />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-20 bg-surface rounded-3xl border border-dashed border-black/10 dark:border-white/10">
          <div className="w-20 h-20 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={40} />
          </div>
          <h3 className="text-xl font-bold mb-2">{t('noPlantsYet', lang)}</h3>
          <p className="text-surface-foreground/70 mb-6 max-w-sm mx-auto">{t('startBuildingJungle', lang)}</p>
          <button 
            onClick={() => { setEditingPlant(null); setShowForm(true); }}
            className="bg-surface-foreground/10 hover:bg-brand hover:text-white font-medium px-6 py-2.5 rounded-xl transition-colors"
          >
            {t('addFirstPlant', lang)}
          </button>
        </div>
      )}

      {showForm && (
        <PlantForm 
          initialData={editingPlant || undefined} 
          lang={lang}
          onSave={() => { setShowForm(false); fetchData(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {detailsPlant && (
        <PlantDetailsModal 
          plant={detailsPlant} 
          lang={lang}
          onClose={() => setDetailsPlant(null)} 
        />
      )}
    </div>
  );
}
