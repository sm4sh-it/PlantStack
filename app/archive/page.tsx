"use client";

import { useEffect, useState } from "react";
import { Plant, Location } from "@prisma/client";
import { Ghost, RefreshCw, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { t } from "@/lib/i18n";

type PlantWithLocation = Plant & { location?: Location };

export default function ArchivePage() {
  const [plants, setPlants] = useState<PlantWithLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("en");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [plantsRes, configRes] = await Promise.all([
        fetch("/api/plants/archive"), // Need to create this endpoint
        fetch("/api/settings")
      ]);
      const pData = await plantsRes.json();
      const cData = await configRes.json();
      
      setPlants(pData);
      if (cData && cData.language) setLang(cData.language);
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

  const handlePermanentDelete = async (plantId: string) => {
    if (!confirm(lang === 'de' ? "Wirklich unwiderruflich löschen?" : "Really delete permanently?")) return;
    try {
      await fetch(`/api/plants/${plantId}?force=true`, { method: "DELETE" });
      fetchData();
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  return (
    <div className="pb-24 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Ghost className="text-brand" size={32} />
          {lang === 'de' ? 'Friedhof der Kuscheltiere' : 'Pet Sematary'}
        </h1>
        <p className="text-surface-foreground/70">
          {lang === 'de' ? 'Hier ruhen deine verlorenen Pflanzen. Du kannst sie wiederbeleben oder endgültig kompostieren.' : 'Here rest your lost plants. You can revive them or compost them permanently.'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand" size={32} /></div>
      ) : plants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plants.map(plant => (
            <div key={plant.id} className="bg-surface rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden flex flex-col grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <div className="h-48 relative bg-black/5 dark:bg-white/5 flex items-center justify-center">
                {plant.imagePath ? (
                  <Image src={`/api/images/${plant.imagePath}`} alt={plant.name} fill className="object-cover" />
                ) : (
                  <Ghost className="w-16 h-16 text-black/20 dark:text-white/20" />
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-lg">{plant.name}</h3>
                <p className="text-sm text-surface-foreground/60 mb-4">{plant.scientificName || plant.alias}</p>
                
                <div className="mt-auto grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleRestore(plant.id)}
                    className="flex items-center justify-center gap-2 py-2 bg-brand/10 text-brand rounded-xl hover:bg-brand hover:text-white transition-colors text-sm font-medium"
                  >
                    <RefreshCw size={16} />
                    {lang === 'de' ? 'Wiederbeleben' : 'Revive'}
                  </button>
                  <button 
                    onClick={() => handlePermanentDelete(plant.id)}
                    className="flex items-center justify-center gap-2 py-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors text-sm font-medium"
                  >
                    <Trash2 size={16} />
                    {lang === 'de' ? 'Kompostieren' : 'Compost'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface rounded-3xl border border-dashed border-black/10 dark:border-white/10">
          <div className="w-20 h-20 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-4">
            <Ghost size={40} />
          </div>
          <h3 className="text-xl font-bold mb-2">{lang === 'de' ? 'Keine Verluste' : 'No casualties'}</h3>
          <p className="text-surface-foreground/70">{lang === 'de' ? 'Du hast noch keine Pflanzen verloren!' : 'You haven\'t lost any plants yet!'}</p>
        </div>
      )}
    </div>
  );
}
