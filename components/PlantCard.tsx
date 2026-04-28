import { Plant, Location } from "@prisma/client";
import { Droplet, BugOff, FlaskConical, SprayCan, Leaf, MoreVertical, Edit2, Trash2, Trees, Snowflake, Scissors } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { t } from "@/lib/i18n";

type PlantCardProps = {
  plant: Plant & { location?: Location; frostWarning?: boolean; locationType?: string; pruningInfo?: string | null };
  lang: string;
  onAction: (plantId: string, action: "water" | "fertilize" | "bug" | "fungus") => void;
  onEdit: (plant: Plant) => void;
  onDelete: (plantId: string) => void;
  onShowDetails: (plant: Plant & { location?: Location }) => void;
};

export default function PlantCard({ plant, lang, onAction, onEdit, onDelete, onShowDetails }: PlantCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const addDays = (date: Date, days: number) => {
    const r = new Date(date);
    r.setDate(r.getDate() + days);
    return r;
  };

  const isOverdue = (last: Date | null, interval: number | null) => {
    if (!interval || !last) return false;
    return addDays(new Date(last), interval) < new Date();
  };

  const getDaysLeft = (last: Date | null, interval: number | null) => {
    if (!interval || !last) return null;
    const due = addDays(new Date(last), interval);
    const diff = Math.ceil((due.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };
  
  const formatDays = (days: number | null) => {
    if (days === null) return t('notSet', lang);
    if (days < 0) return `${Math.abs(days)} ${t('daysLeft', lang)} late`;
    return `${days} ${t('daysLeft', lang)}`;
  };

  const waterDue = isOverdue(plant.lastWatered, plant.waterInterval);
  const fertDue = isOverdue(plant.lastFertilized, plant.fertilizerInterval);
  const bugDue = isOverdue(plant.lastBug, plant.bugInterval);
  const fungDue = isOverdue(plant.lastFungus, plant.fungusInterval);

  const anyDue = waterDue || fertDue || bugDue || fungDue;

  return (
    <div className={`relative surface-card overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-brand/5 dark:hover:bg-white/5 ${anyDue ? 'ring-2 ring-red-500' : 'hover:ring-1 hover:ring-brand/50'}`}>
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        {anyDue && (
          <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow cursor-default">
            {t('needsCare', lang)}
          </div>
        )}
        {plant.frostWarning && (
          <div className="bg-blue-500 text-white p-1 rounded-full shadow cursor-default flex items-center justify-center animate-pulse" title="Frost Warning!">
            <Snowflake size={16} />
          </div>
        )}
        {plant.locationType === 'OUTDOOR' && (
          <div className="bg-amber-500 text-white p-1 rounded-full shadow cursor-default flex items-center justify-center" title="Outdoor Plant">
            <Trees size={16} />
          </div>
        )}
        <div className="relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }} 
            className="p-1 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors shadow-md"
          >
            <MoreVertical size={16} />
          </button>
          
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
              <div className="absolute right-0 mt-2 w-32 bg-surface border border-black/10 dark:border-white/10 rounded-xl shadow-xl z-30 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-150">
                <button onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onEdit(plant); }} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-foreground/5 text-left"><Edit2 size={14}/> {t('edit', lang)}</button>
                <div className="h-[1px] bg-black/5 dark:bg-white/5" />
                <button onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(plant.id); }} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-500/10 text-red-500 text-left"><Trash2 size={14}/> {t('delete', lang)}</button>
              </div>
            </>
          )}
        </div>
      </div>

      <div 
        className="h-48 relative bg-black/5 dark:bg-white/5 flex items-center justify-center cursor-pointer group"
        onClick={() => onShowDetails(plant)}
      >
        {plant.imagePath ? (
          <Image src={`/api/images/${plant.imagePath}`} alt={plant.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <Leaf className="w-16 h-16 text-black/10 dark:text-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:text-brand/50" />
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-1 line-clamp-1 cursor-pointer hover:text-brand transition-colors" onClick={() => onShowDetails(plant)}>{plant.name}</h3>
        <div className="flex justify-between items-start mb-4">
          <p className="text-sm text-surface-foreground/70">{plant.location?.name || "No Location"}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-2 text-sm mt-auto">
          {/* Watering */}
          <div className="flex items-center gap-2">
            <button onClick={() => onAction(plant.id, "water")} 
                    className={`p-2 rounded-full transition-colors ${waterDue ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-surface-foreground/5 text-surface-foreground hover:bg-brand hover:text-white'}`} title={t('water', lang)}>
              <Droplet size={16} />
            </button>
            <span className={waterDue ? 'text-red-500 font-medium' : ''}>
              {formatDays(getDaysLeft(plant.lastWatered, plant.waterInterval))}
            </span>
          </div>

          {/* Fertilizing */}
          {plant.fertilizerInterval ? (
            <div className="flex items-center gap-2">
              <button onClick={() => onAction(plant.id, "fertilize")} 
                      className={`p-2 rounded-full transition-colors ${fertDue ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-surface-foreground/5 text-surface-foreground hover:bg-amber-500 hover:text-white'}`} title={t('fertilize', lang)}>
                <FlaskConical size={16} />
              </button>
              <span className={fertDue ? 'text-red-500 font-medium' : ''}>
                {formatDays(getDaysLeft(plant.lastFertilized, plant.fertilizerInterval))}
              </span>
            </div>
          ) : <div />}

          {/* Bug spray */}
          {plant.bugInterval ? (
            <div className="flex items-center gap-2">
              <button onClick={() => onAction(plant.id, "bug")} 
                      className={`p-2 rounded-full transition-colors ${bugDue ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-surface-foreground/5 text-surface-foreground hover:bg-purple-500 hover:text-white'}`} title={t('bugTreatment', lang)}>
                <BugOff size={16} />
              </button>
              <span className={bugDue ? 'text-red-500 font-medium' : ''}>
                {formatDays(getDaysLeft(plant.lastBug, plant.bugInterval))}
              </span>
            </div>
          ) : <div />}

          {/* Fungus */}
          {plant.fungusInterval ? (
            <div className="flex items-center gap-2">
              <button onClick={() => onAction(plant.id, "fungus")} 
                      className={`p-2 rounded-full transition-colors ${fungDue ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-surface-foreground/5 text-surface-foreground hover:bg-teal-500 hover:text-white'}`} title={t('fungusTreatment', lang)}>
                <SprayCan size={16} />
              </button>
              <span className={fungDue ? 'text-red-500 font-medium' : ''}>
                {formatDays(getDaysLeft(plant.lastFungus, plant.fungusInterval))}
              </span>
            </div>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
