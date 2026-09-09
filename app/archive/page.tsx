"use client";

import { useEffect, useState } from "react";
import { Plant, Location } from "@prisma/client";
import { Ghost, RefreshCw, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";

import ConfirmModal from "@/components/ConfirmModal";

type PlantWithLocation = Plant & { location?: Location };

export default function ArchivePage() {
  const [plants, setPlants] = useState<PlantWithLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("en");
  const [deletePlantId, setDeletePlantId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [plantsRes, configRes] = await Promise.all([
        fetch("/api/plants/archive"),
        fetch("/api/settings")
      ]);
      const pData = await plantsRes.json();
      const cData = await configRes.json();
      
      setPlants(pData);
      if (cData && cData.language) {
        setLang(cData.language);
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

  const handleRestore = async (plantId: string) => {
    try {
      await fetch(`/api/plants/${plantId}/restore`, { method: "POST" });
      fetchData();
    } catch (e) {
      console.error("Restore failed", e);
    }
  };

  const handlePermanentDelete = async () => {
    if (!deletePlantId) return;
    try {
      await fetch(`/api/plants/${deletePlantId}?force=true`, { method: "DELETE" });
      setDeletePlantId(null);
      fetchData();
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  return (
    <div className="pb-24 animate-in fade-in duration-500">
      <div className="mb-8 border-b border-border-hairline pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight mb-1 flex items-center gap-3 text-foreground">
          <Ghost className="text-brand" size={32} />
          {lang === 'de' ? 'Die Verlorenen' : 'The lost ones'}
        </h1>
        <p className="text-sm text-text-muted">
          {lang === 'de' ? 'Hier ruhen deine verlorenen Pflanzen. Du kannst sie wiederbeleben oder endgültig kompostieren.' : 'Here rest your lost plants. You can revive them or compost them permanently.'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand" size={32} /></div>
      ) : plants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plants.map(plant => (
            <div key={plant.id} className="bg-surface rounded-2xl border border-border-hairline card-elevation overflow-hidden flex flex-col grayscale opacity-85 hover:grayscale-0 hover:opacity-100 transition-all duration-300 hover-lift">
              <div className="h-48 relative bg-surface-subtle flex items-center justify-center overflow-hidden">
                {plant.imagePath ? (
                  <Image src={`/api/images/${plant.imagePath}`} alt={plant.name} fill className="object-cover" />
                ) : (
                  <Ghost className="w-16 h-16 text-text-muted/30" />
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-foreground mb-0.5">{plant.name}</h3>
                  <p className="text-xs text-text-muted mb-4 truncate">{plant.scientificName || plant.alias || "Pflanze"}</p>
                </div>
                
                <div className="pt-3 border-t border-border-hairline grid grid-cols-2 gap-2 mt-auto">
                  <button 
                    onClick={() => handleRestore(plant.id)}
                    className="flex items-center justify-center gap-1.5 h-10 px-3 bg-brand-subtle text-brand rounded-lg hover:bg-brand hover:text-white transition-all text-xs font-bold active:scale-95 cursor-pointer shadow-xs"
                  >
                    <RefreshCw size={14} />
                    {lang === 'de' ? 'Wiederbeleben' : 'Revive'}
                  </button>
                  <button 
                    onClick={() => setDeletePlantId(plant.id)}
                    className="flex items-center justify-center gap-1.5 h-10 px-3 bg-urgency-overdue/10 text-urgency-overdue rounded-lg hover:bg-urgency-overdue hover:text-white transition-all text-xs font-bold active:scale-95 cursor-pointer shadow-xs"
                  >
                    <Trash2 size={14} />
                    {lang === 'de' ? 'Kompostieren' : 'Compost'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface rounded-2xl border border-dashed border-border-strong card-elevation">
          <div className="w-16 h-16 bg-brand-subtle text-brand rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
            <Ghost size={32} />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-1">{lang === 'de' ? 'Keine Verluste' : 'No casualties'}</h3>
          <p className="text-sm text-text-muted">{lang === 'de' ? 'Du hast noch keine Pflanzen verloren!' : 'You haven\'t lost any plants yet!'}</p>
        </div>
      )}

      <ConfirmModal
        isOpen={deletePlantId !== null}
        title={lang === "de" ? "Pflanze endgültig kompostieren?" : "Permanently delete plant?"}
        description={
          lang === "de"
            ? "Möchtest du diese Pflanze wirklich unwiderruflich aus dem Archiv löschen? Diese Aktion kann nicht rückgängig gemacht werden."
            : "Are you sure you want to permanently delete this plant from the archive? This cannot be undone."
        }
        confirmText={lang === "de" ? "Unwiderruflich löschen" : "Delete permanently"}
        cancelText={lang === "de" ? "Abbrechen" : "Cancel"}
        isDestructive={true}
        onConfirm={handlePermanentDelete}
        onCancel={() => setDeletePlantId(null)}
      />
    </div>
  );
}
