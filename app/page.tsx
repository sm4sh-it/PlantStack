"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import PlantCard from "@/components/PlantCard";
import PlantForm from "@/components/PlantForm";
import PlantDetailsModal from "@/components/PlantDetailsModal";
import ConfirmModal from "@/components/ConfirmModal";
import { Plus, Search, X, Droplets } from "lucide-react";
import { Plant, Location } from "@prisma/client";
import { t } from "@/lib/i18n";

type PlantWithLocation = Plant & { location?: Location };

function getRandomPlantQuote(plantCount: number, lang: string): string {
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
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "due" | "indoor" | "outdoor">("all");
  const [batchWatering, setBatchWatering] = useState(false);

  // Confirm Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    variant?: "destructive" | "warning" | "info" | "success" | "water";
    onConfirm: () => void;
  } | null>(null);

  // Undo Toast state
  type ToastData = {
    message: string;
    plantId?: string;
    previousData?: any;
  };
  const [toast, setToast] = useState<ToastData | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
      setDetailsPlant((prev) => {
        if (!prev) return null;
        return pData.find((p: PlantWithLocation) => p.id === prev.id) || null;
      });
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

    // Mobile FAB & global event integration
    const handleOpenForm = () => {
      setEditingPlant(null);
      setShowForm(true);
    };
    window.addEventListener("open-plant-form", handleOpenForm);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("action") === "new") {
        setEditingPlant(null);
        setShowForm(true);
        window.history.replaceState({}, "", window.location.pathname);
      }
    }

    return () => {
      window.removeEventListener("open-plant-form", handleOpenForm);
    };
  }, []);

  const showToast = (message: string, plantId?: string, previousData?: any) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, plantId, previousData });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 6000);
  };

  const handleUndo = async () => {
    if (!toast?.plantId || !toast?.previousData) return;
    try {
      await fetch(`/api/plants/${toast.plantId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "revert",
          previousData: toast.previousData,
        }),
      });
      setToast({ message: t('undone', lang) });
      setTimeout(() => setToast(null), 2500);
      fetchData();
    } catch (e) {
      console.error("Undo failed", e);
    }
  };

  const handleAction = async (plantId: string, action: string) => {
    const targetPlant = plants.find(p => p.id === plantId);
    const prevData = targetPlant ? {
      lastWatered: targetPlant.lastWatered,
      lastFertilized: targetPlant.lastFertilized,
      lastBug: targetPlant.lastBug,
      lastFungus: targetPlant.lastFungus,
      lastPruned: targetPlant.lastPruned,
      lastRepotted: targetPlant.lastRepotted,
      wateredCount: targetPlant.wateredCount,
    } : undefined;

    try {
      await fetch(`/api/plants/${plantId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (action === "snooze") {
        showToast(t('snoozeSuccess', lang), plantId, prevData);
      } else if (action === "water") {
        showToast(`${targetPlant?.name || "Plant"} ${t('plantMarkedWatered', lang)}`, plantId, prevData);
      } else if (action === "prune") {
        showToast(`${targetPlant?.name || "Plant"} ${t('plantMarkedPruned', lang)}`, plantId, prevData);
      } else if (action === "repot") {
        showToast(`${targetPlant?.name || "Plant"} ${t('plantMarkedRepotted', lang)}`, plantId, prevData);
      } else {
        showToast(`${targetPlant?.name || "Plant"} updated`, plantId, prevData);
      }

      fetchData();
    } catch (e) {
      console.error("Action failed", e);
    }
  };

  const handleBatchWater = () => {
    const dueWaterPlants = plants.filter(p => {
      const now = new Date();
      const addD = (d: Date, i: number) => { const r = new Date(d); r.setDate(r.getDate() + i); return r; };
      return addD(new Date(p.lastWatered), p.waterInterval) <= now;
    });

    if (dueWaterPlants.length === 0) return;
    const confirmMsg = (t('waterAllDueConfirm', lang) || "Mark all {n} due plants as watered?")
      .replace('{n}', dueWaterPlants.length.toString());

    setConfirmModal({
      isOpen: true,
      title: lang === 'de' ? "Alle fälligen Pflanzen gießen?" : "Water all due plants?",
      description: confirmMsg,
      confirmText: lang === 'de' ? "Jetzt gießen" : "Water now",
      cancelText: lang === 'de' ? "Abbrechen" : "Cancel",
      variant: "water",
      onConfirm: async () => {
        setConfirmModal(null);
        setBatchWatering(true);
        try {
          await fetch("/api/plants/batch-action", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              plantIds: dueWaterPlants.map(p => p.id),
              action: "water",
            }),
          });
          showToast(`${dueWaterPlants.length} ${t('plantMarkedWatered', lang)}`);
          fetchData();
        } catch (e) {
          console.error("Batch water failed", e);
        } finally {
          setBatchWatering(false);
        }
      }
    });
  };

  const handleDelete = (plantId: string) => {
    const plant = plants.find(p => p.id === plantId);
    const plantName = plant ? plant.name : "";
    setConfirmModal({
      isOpen: true,
      title: lang === 'de' ? `„${plantName}“ ins Archiv verschieben?` : `Archive "${plantName}"?`,
      description: lang === 'de' 
        ? "Möchtest du diese Pflanze wirklich aus der Übersicht ins Archiv verschieben? Sie kann dort jederzeit wiederhergestellt werden."
        : "Are you sure you want to move this plant to the archive? It can be restored at any time.",
      confirmText: lang === 'de' ? "Archivieren" : "Archive",
      cancelText: lang === 'de' ? "Abbrechen" : "Cancel",
      isDestructive: true,
      variant: "destructive",
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await fetch(`/api/plants/${plantId}`, { method: "DELETE" });
          fetchData();
        } catch (e) {
          console.error("Delete failed", e);
        }
      }
    });
  };

  // Helper to check if any care is due
  const isPlantDue = (p: PlantWithLocation) => {
    const now = new Date();
    const addD = (d: Date, i: number) => { const r = new Date(d); r.setDate(r.getDate() + i); return r; };
    const wDue = addD(new Date(p.lastWatered), p.waterInterval) <= now;
    const fDue = p.fertilizerInterval ? addD(new Date(p.lastFertilized || 0), p.fertilizerInterval) <= now : false;
    const bDue = p.bugInterval ? addD(new Date(p.lastBug || 0), p.bugInterval) <= now : false;
    const fuDue = p.fungusInterval ? addD(new Date(p.lastFungus || 0), p.fungusInterval) <= now : false;
    return wDue || fDue || bDue || fuDue;
  };

  const dueCount = useMemo(() => plants.filter(isPlantDue).length, [plants]);
  const dueWaterCount = useMemo(() => {
    const now = new Date();
    const addD = (d: Date, i: number) => { const r = new Date(d); r.setDate(r.getDate() + i); return r; };
    return plants.filter(p => addD(new Date(p.lastWatered), p.waterInterval) <= now).length;
  }, [plants]);

  const filteredPlants = useMemo(() => {
    let list = plants;

    if (filterMode === "due") {
      list = list.filter(isPlantDue);
    } else if (filterMode === "indoor") {
      list = list.filter(p => p.placement === "Drinnen" && p.locationType !== "OUTDOOR");
    } else if (filterMode === "outdoor") {
      list = list.filter(p => p.placement === "Draußen" || p.placement === "Balkon" || p.locationType === "OUTDOOR");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.scientificName && p.scientificName.toLowerCase().includes(q)) ||
        (p.alias && p.alias.toLowerCase().includes(q)) ||
        (p.location?.name && p.location.name.toLowerCase().includes(q))
      );
    }

    return list;
  }, [plants, filterMode, searchQuery]);

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

    if (sortMode === "interval") return [...filteredPlants].sort((a, b) => getScore(a) - getScore(b));
    if (sortMode === "alphabetical") return [...filteredPlants].sort((a, b) => a.name.localeCompare(b.name));
    
    return [...filteredPlants].sort((a, b) => getScore(a) - getScore(b));
  }, [filteredPlants, sortMode]);

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
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1 text-foreground">{customTitle || t('myJungle', lang)}</h1>
          <p className="text-sm text-text-muted">{getRandomPlantQuote(plants.length, lang)}</p>
        </div>
        
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {/* Batch Water Button */}
          {dueWaterCount > 0 && (
            <button
              onClick={handleBatchWater}
              disabled={batchWatering}
              className="bg-care-water-bg hover:bg-care-water text-care-water hover:text-white px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 font-bold text-xs active:scale-95 disabled:opacity-50 cursor-pointer"
              title={t('waterAllDue', lang)}
            >
              <Droplets size={16} />
              <span>{t('waterAllDue', lang)} ({dueWaterCount})</span>
            </button>
          )}

          {/* Sort Segments */}
          <div className="flex bg-surface-subtle border border-border-hairline rounded-lg p-1 shrink-0">
            <button 
              onClick={() => setSortMode("alphabetical")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${sortMode === "alphabetical" ? "bg-surface shadow-xs text-brand font-bold" : "text-text-muted hover:text-foreground"}`}
            >
              {t('az', lang)}
            </button>
            <button 
              onClick={() => setSortMode("location")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${sortMode === "location" ? "bg-surface shadow-xs text-brand font-bold" : "text-text-muted hover:text-foreground"}`}
            >
              {t('rooms', lang)}
            </button>
            <button 
              onClick={() => setSortMode("interval")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${sortMode === "interval" ? "bg-surface shadow-xs text-brand font-bold" : "text-text-muted hover:text-foreground"}`}
            >
              Timeline
            </button>
          </div>

          {/* Add Plant Button */}
          <button 
            onClick={() => { setEditingPlant(null); setShowForm(true); }}
            className="bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg shadow-xs active:scale-95 transition-all flex items-center gap-1.5 shrink-0 font-bold text-xs cursor-pointer"
          >
            <Plus size={16} />
            <span className="hidden md:inline">{t('addPlant', lang)}</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      {plants.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between mb-6 bg-surface p-2.5 rounded-xl border border-border-hairline card-elevation">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder', lang)}
              className="w-full h-10 pl-8 pr-7 bg-surface-subtle border border-border-hairline rounded-lg text-xs text-foreground placeholder:text-text-muted outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-foreground p-0.5 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide shrink-0">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
                filterMode === "all"
                  ? "bg-brand text-white font-bold shadow-xs"
                  : "bg-surface-subtle text-text-muted hover:text-foreground"
              }`}
            >
              {t('filterAll', lang)} ({plants.length})
            </button>

            <button
              onClick={() => setFilterMode("due")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                filterMode === "due"
                  ? "bg-amber-500 text-white shadow-xs font-bold"
                  : dueCount > 0
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
                    : "bg-surface-subtle text-text-muted hover:text-foreground"
              }`}
            >
              <span>{t('filterDue', lang)}</span>
              {dueCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${filterMode === "due" ? "bg-white/20 text-white" : "bg-amber-500/20 text-amber-700 dark:text-amber-300"}`}>
                  {dueCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setFilterMode("indoor")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
                filterMode === "indoor"
                  ? "bg-brand-subtle text-brand font-bold"
                  : "bg-surface-subtle text-text-muted hover:text-foreground"
              }`}
            >
              {t('filterIndoor', lang)}
            </button>

            <button
              onClick={() => setFilterMode("outdoor")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
                filterMode === "outdoor"
                  ? "bg-brand-subtle text-brand font-bold"
                  : "bg-surface-subtle text-text-muted hover:text-foreground"
              }`}
            >
              {t('filterOutdoor', lang)}
            </button>
          </div>
        </div>
      )}

      {/* Plants Grid or Empty State */}
      {loading ? (
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridClass} gap-6 animate-pulse`}>
          {[1,2,3,4].map(n => <div key={n} className="bg-surface border border-border-hairline h-[360px] rounded-2xl card-elevation"></div>)}
        </div>
      ) : plants.length > 0 ? (
        filteredPlants.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-2xl border border-border-hairline card-elevation">
            <p className="text-sm font-semibold text-foreground mb-3">{t('noFilteredPlants', lang)}</p>
            <button
              onClick={() => { setFilterMode("all"); setSearchQuery(""); }}
              className="bg-brand-subtle text-brand px-4 py-2 rounded-lg text-xs font-bold hover:bg-brand hover:text-white transition-all cursor-pointer"
            >
              {t('clearFilters', lang)}
            </button>
          </div>
        ) : sortMode === "location" && locationGroups ? (
          <div className="space-y-12">
            {locationGroups.map(group => (
              <div key={group.name} className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground border-b border-border-hairline pb-2.5">
                   {group.name}
                   <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-subtle text-brand ml-2">
                     {group.items.length}
                   </span>
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
        <div className="text-center py-20 bg-surface rounded-2xl border border-border-hairline card-elevation">
          <div 
            onClick={() => { setEditingPlant(null); setShowForm(true); }}
            className="w-16 h-16 bg-brand-subtle text-brand rounded-2xl flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-105 transition-all shadow-xs"
          >
            <Plus size={32} />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-1.5">{t('noPlantsYet', lang)}</h3>
          <p className="text-sm text-text-muted mb-6 max-w-sm mx-auto">{t('startBuildingJungle', lang)}</p>
          <button 
            onClick={() => { setEditingPlant(null); setShowForm(true); }}
            className="bg-brand hover:bg-brand-hover text-white font-bold px-6 py-2.5 rounded-lg shadow-xs active:scale-95 transition-all text-sm cursor-pointer"
          >
            {t('addFirstPlant', lang)}
          </button>
        </div>
      )}

      {/* Plant Form Modal */}
      {showForm && (
        <PlantForm 
          initialData={editingPlant || undefined} 
          lang={lang}
          onSave={() => { setShowForm(false); fetchData(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Plant Details Modal */}
      {detailsPlant && (
        <PlantDetailsModal 
          plant={detailsPlant} 
          lang={lang}
          onClose={() => setDetailsPlant(null)} 
          onAction={handleAction}
          onEdit={(p) => {
            setDetailsPlant(null);
            setEditingPlant(p as PlantWithLocation);
            setShowForm(true);
          }}
        />
      )}

      {/* Undo Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-surface/95 border border-border-hairline text-foreground px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="text-xs font-semibold">{toast.message}</span>
          {toast.previousData && (
            <button
              onClick={handleUndo}
              className="bg-brand hover:bg-brand-hover text-white px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {t('undo', lang)}
            </button>
          )}
          <button
            onClick={() => setToast(null)}
            className="text-text-muted hover:text-foreground p-0.5 cursor-pointer"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Reusable Confirm Modal */}
      {confirmModal && (
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          description={confirmModal.description}
          confirmText={confirmModal.confirmText}
          cancelText={confirmModal.cancelText}
          isDestructive={confirmModal.isDestructive}
          variant={confirmModal.variant}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
}
