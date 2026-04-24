"use client";

import { Plant, Location } from "@prisma/client";
import { X, Droplet, Sun, AlignLeft, FlaskConical, BugOff, SprayCan, Leaf } from "lucide-react";
import Image from "next/image";
import { t } from "@/lib/i18n";

type PlantDetailsModalProps = {
  plant: Plant & { location?: Location };
  lang: string;
  onClose: () => void;
};

export default function PlantDetailsModal({ plant, lang, onClose }: PlantDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        <div className="relative h-64 bg-black/5 dark:bg-white/5 flex items-center justify-center">
          {plant.imagePath ? (
            <Image src={`/api/images/${plant.imagePath}`} alt={plant.name} fill className="object-cover" />
          ) : (
            <Leaf className="w-24 h-24 text-black/10 dark:text-white/10" />
          )}
          <div className="absolute top-0 left-0 w-full p-4 flex justify-end bg-gradient-to-b from-black/50 to-transparent">
            <button onClick={onClose} className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors shadow-md">
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh]">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-1">{plant.name}</h2>
            {plant.scientificName && (
               <p className="text-brand font-medium italic">{plant.scientificName}</p>
            )}
            <p className="text-surface-foreground/60 text-sm mt-1">{plant.location?.name || "Unassigned"}</p>
          </div>

          <div className="space-y-6">
            
            {/* API Info Block */}
            {(plant.wateringInfo || plant.sunlightInfo) && (
              <div className="bg-background border border-black/5 dark:border-white/5 rounded-2xl p-5 space-y-4">
                {plant.wateringInfo && (
                  <div className="flex gap-3">
                    <Droplet className="text-blue-500 shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="text-sm font-bold text-surface-foreground/80 mb-1">Watering</p>
                      <p className="text-sm text-surface-foreground/70">{plant.wateringInfo}</p>
                    </div>
                  </div>
                )}
                {plant.sunlightInfo && (
                  <div className="flex gap-3">
                    <Sun className="text-amber-500 shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="text-sm font-bold text-surface-foreground/80 mb-1">{t('sunlight', lang)}</p>
                      <p className="text-sm text-surface-foreground/70">{plant.sunlightInfo}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Intervals */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium mb-1">
                     <Droplet size={18} /> {t('water', lang)}
                  </div>
                  <p className="text-2xl font-bold">{plant.waterInterval} <span className="text-sm font-normal opacity-70">{t('daysLeft', lang)}</span></p>
               </div>
               
               {plant.fertilizerInterval && (
                 <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium mb-1">
                       <FlaskConical size={18} /> {t('fertilize', lang)}
                    </div>
                    <p className="text-2xl font-bold">{plant.fertilizerInterval} <span className="text-sm font-normal opacity-70">{t('daysLeft', lang)}</span></p>
                 </div>
               )}
               
               {plant.bugInterval && (
                 <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium mb-1">
                       <BugOff size={18} /> {t('bugTreatment', lang)}
                    </div>
                    <p className="text-2xl font-bold">{plant.bugInterval} <span className="text-sm font-normal opacity-70">{t('daysLeft', lang)}</span></p>
                 </div>
               )}
               
               {plant.fungusInterval && (
                 <div className="bg-teal-500/10 border border-teal-500/20 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium mb-1">
                       <SprayCan size={18} /> {t('fungusTreatment', lang)}
                    </div>
                    <p className="text-2xl font-bold">{plant.fungusInterval} <span className="text-sm font-normal opacity-70">{t('daysLeft', lang)}</span></p>
                 </div>
               )}
            </div>

            {/* Notes */}
            {plant.notes && (
              <div className="pt-4 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center gap-2 text-surface-foreground/60 font-medium mb-2">
                   <AlignLeft size={18} /> {t('notes', lang)}
                </div>
                <p className="text-surface-foreground/80 whitespace-pre-wrap text-sm">{plant.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
