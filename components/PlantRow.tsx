"use client";

import { Plant, Location } from "@prisma/client";
import {
  Droplet,
  BugOff,
  FlaskConical,
  SprayCan,
  MoreVertical,
  Edit2,
  Trash2,
  Sun,
  Snowflake,
  Clock,
  MapPin,
  Check,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { t } from "@/lib/i18n";
import { getDaysLeft, getUrgency } from "@/lib/plantCare";

type PlantRowProps = {
  plant: Plant & {
    location?: Location;
    frostWarning?: boolean;
    locationType?: string;
    pruningInfo?: string | null;
  };
  lang: string;
  onAction: (plantId: string, action: "water" | "fertilize" | "bug" | "fungus" | "snooze") => void;
  onEdit: (plant: Plant) => void;
  onDelete: (plantId: string) => void;
  onShowDetails: (plant: Plant & { location?: Location }) => void;
};

export default function PlantRow({
  plant,
  lang,
  onAction,
  onEdit,
  onDelete,
  onShowDetails,
}: PlantRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [justActioned, setJustActioned] = useState<string | null>(null);

  useEffect(() => {
    if (!justActioned) return;
    const timer = setTimeout(() => setJustActioned(null), 3000);
    return () => clearTimeout(timer);
  }, [justActioned]);

  const handleQuickAction = (action: "water" | "fertilize" | "bug" | "fungus") => {
    setJustActioned(action);
    onAction(plant.id, action);
  };

  const rawWaterDays = getDaysLeft(plant.lastWatered, plant.waterInterval);
  const rawFertDays = getDaysLeft(plant.lastFertilized, plant.fertilizerInterval);
  const rawBugDays = getDaysLeft(plant.lastBug, plant.bugInterval);
  const rawFungDays = getDaysLeft(plant.lastFungus, plant.fungusInterval);

  const waterDays = justActioned === "water" ? plant.waterInterval : rawWaterDays;
  const fertDays = justActioned === "fertilize" ? plant.fertilizerInterval : rawFertDays;
  const bugDays = justActioned === "bug" ? plant.bugInterval : rawBugDays;
  const fungDays = justActioned === "fungus" ? plant.fungusInterval : rawFungDays;

  const waterUrgency = justActioned === "water" ? "ok" : getUrgency(waterDays);
  const fertUrgency = justActioned === "fertilize" ? "ok" : getUrgency(fertDays);
  const bugUrgency = justActioned === "bug" ? "ok" : getUrgency(bugDays);
  const fungUrgency = justActioned === "fungus" ? "ok" : getUrgency(fungDays);

  const fertDue = fertUrgency === "overdue" || fertUrgency === "today";
  const bugDue = bugUrgency === "overdue" || bugUrgency === "today";
  const fungDue = fungUrgency === "overdue" || fungUrgency === "today";

  return (
    <div
      onClick={() => onShowDetails(plant)}
      className="flex items-center justify-between gap-3 px-3 sm:px-4 py-2.5 hover:bg-surface-subtle/60 transition-colors cursor-pointer group first:rounded-t-xl last:rounded-b-xl"
    >
      {/* Left: Thumbnail + Identity */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-surface-subtle shrink-0 flex items-center justify-center">
          {plant.apiId === "crop_easteregg_bohni" ? (
            <Image src="/Bohni.png" alt="Bohni" fill sizes="40px" className="object-cover" />
          ) : plant.imagePath ? (
            <Image
              src={`/api/images/${plant.imagePath}`}
              alt={plant.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <div className="w-6 h-6 relative opacity-40">
              <Image src="/logo-green.svg" alt="PlantStack" fill className="object-contain" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="font-bold text-sm text-text-primary truncate group-hover:text-brand transition-colors">
              {plant.name}
            </h3>
            {plant.frostWarning && (
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-care-frost text-white shrink-0 animate-pulse"
                title="Frost"
              >
                <Snowflake size={10} />
                <span className="hidden sm:inline">Frost</span>
              </span>
            )}
            {plant.locationType === "OUTDOOR" && (
              <Sun size={12} className="text-amber-500 shrink-0" aria-label="Outdoor" />
            )}
            {(plant as any).winterDormancy && (
              <span
                title={`${lang === "de" ? "Winterruhe" : "Dormancy"}${(plant as any).seasonalFactor ? ` (+${(plant as any).seasonalFactor} %)` : ""}`}
                className="inline-flex items-center shrink-0"
              >
                <Snowflake size={12} className="text-sky-500 shrink-0" aria-label={lang === "de" ? "Winterruhe" : "Dormancy"} />
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted truncate">
            <span className="italic truncate">
              {plant.scientificName || (lang === "de" ? "Zimmerpflanze" : "Houseplant")}
            </span>
            {plant.location?.name && (
              <span className="md:hidden inline-flex items-center gap-0.5 text-[11px] text-text-secondary shrink-0">
                • {plant.location.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Middle: Location (Desktop) */}
      <div className="hidden md:flex items-center gap-1.5 text-xs text-text-secondary w-36 lg:w-44 shrink-0">
        {plant.location?.name ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-subtle truncate max-w-full">
            <MapPin size={11} className="text-brand shrink-0" />
            <span className="truncate">{plant.location.name}</span>
          </span>
        ) : (
          <span className="text-text-muted italic">-</span>
        )}
      </div>

      {/* Right: Dynamic Care Pills + Primary Water Button + Menu */}
      <div
        className="flex items-center gap-1.5 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dynamic Secondary Routines (shown only when due/overdue or just actioned) */}
        {(fertDue || justActioned === "fertilize") && (
          <button
            onClick={() => handleQuickAction("fertilize")}
            className={`h-8 px-2.5 rounded-lg text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${
              justActioned === "fertilize"
                ? "bg-emerald-600 text-white font-bold shadow-xs"
                : fertUrgency === "overdue"
                  ? "bg-care-fertilizer text-white font-bold shadow-xs ring-2 ring-status-danger"
                  : "bg-care-fertilizer text-white font-bold shadow-xs"
            }`}
            title={lang === "de" ? "Klicken zum Düngen" : "Click to fertilize"}
          >
            {justActioned === "fertilize" ? <Check size={13} /> : <FlaskConical size={13} />}
            <span className="hidden sm:inline tabular">
              {justActioned === "fertilize"
                ? lang === "de" ? "Fertig" : "Done"
                : lang === "de" ? "Düngen" : "Fertilize"}
            </span>
          </button>
        )}

        {(bugDue || justActioned === "bug") && (
          <button
            onClick={() => handleQuickAction("bug")}
            className={`h-8 px-2.5 rounded-lg text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${
              justActioned === "bug"
                ? "bg-emerald-600 text-white font-bold shadow-xs"
                : "bg-care-bug text-white font-bold shadow-xs"
            }`}
            title={lang === "de" ? "Schädlingsschutz dokumentieren" : "Pest control"}
          >
            {justActioned === "bug" ? <Check size={13} /> : <BugOff size={13} />}
            <span className="hidden lg:inline">
              {justActioned === "bug"
                ? lang === "de" ? "Fertig" : "Done"
                : lang === "de" ? "Schutz" : "Pest"}
            </span>
          </button>
        )}

        {(fungDue || justActioned === "fungus") && (
          <button
            onClick={() => handleQuickAction("fungus")}
            className={`h-8 px-2.5 rounded-lg text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${
              justActioned === "fungus"
                ? "bg-emerald-600 text-white font-bold shadow-xs"
                : "bg-care-fungus text-white font-bold shadow-xs"
            }`}
            title={lang === "de" ? "Pilzbehandlung dokumentieren" : "Fungus treatment"}
          >
            {justActioned === "fungus" ? <Check size={13} /> : <SprayCan size={13} />}
            <span className="hidden lg:inline">
              {justActioned === "fungus"
                ? lang === "de" ? "Fertig" : "Done"
                : lang === "de" ? "Pilz" : "Fungus"}
            </span>
          </button>
        )}

        {/* Primary Water Button (always shown) */}
        <button
          onClick={() => handleQuickAction("water")}
          className={`h-8 min-w-[76px] sm:min-w-[88px] px-2.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
            justActioned === "water"
              ? "bg-emerald-600 text-white font-bold shadow-xs"
              : waterUrgency === "overdue"
                ? "bg-care-water text-white font-bold shadow-xs ring-2 ring-status-danger hover:opacity-95"
                : waterUrgency === "today"
                  ? "bg-care-water text-white font-bold shadow-xs hover:opacity-95"
                  : "bg-care-water-bg text-care-water hover:bg-care-water hover:text-white font-semibold"
          }`}
          title={lang === "de" ? "Klicken zum Gießen" : "Click to water"}
        >
          {justActioned === "water" ? (
            <Check size={13} className="shrink-0" />
          ) : (
            <Droplet size={13} className="shrink-0" />
          )}
          <span className="tabular truncate">
            {justActioned === "water"
              ? lang === "de"
                ? "Fertig"
                : "Done"
              : waterUrgency === "today"
                ? lang === "de"
                  ? "Gießen"
                  : "Water"
                : waterUrgency === "overdue"
                  ? `${Math.abs(waterDays || 1)} T.!`
                  : waterDays !== null
                    ? `${waterDays} T.`
                    : "-"}
          </span>
        </button>

        {/* 3-Dots Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 rounded-lg hover:bg-surface-subtle text-text-muted hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
            aria-label={lang === "de" ? "Menü öffnen" : "Open menu"}
          >
            <MoreVertical size={15} />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 mt-1 w-44 bg-surface border border-border-hairline rounded-xl shadow-xl z-30 overflow-hidden flex flex-col py-1 animate-in fade-in zoom-in duration-150">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(plant);
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold hover:bg-surface-subtle text-foreground text-left transition-colors cursor-pointer"
                >
                  <Edit2 size={14} className="text-brand" /> {t("edit", lang)}
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onAction(plant.id, "snooze");
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold hover:bg-surface-subtle text-foreground text-left transition-colors cursor-pointer"
                >
                  <Clock size={14} className="text-care-fertilizer" /> {t("snooze", lang)}
                </button>
                <div className="h-[1px] bg-border-hairline mx-2 my-1" />
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(plant.id);
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold hover:bg-status-danger/10 text-status-danger text-left transition-colors cursor-pointer"
                >
                  <Trash2 size={14} /> {t("delete", lang)}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
