"use client";

import { Plant, Location } from "@prisma/client";
import {
  Droplet,
  BugOff,
  FlaskConical,
  SprayCan,
  Leaf,
  MoreVertical,
  Edit2,
  Trash2,
  Sun,
  Snowflake,
  Clock,
  MapPin,
  AlertCircle,
  Check,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { t } from "@/lib/i18n";
import { getDaysLeft, getUrgency } from "@/lib/plantCare";

type PlantCardProps = {
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

export default function PlantCard({
  plant,
  lang,
  onAction,
  onEdit,
  onDelete,
  onShowDetails,
}: PlantCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [justActioned, setJustActioned] = useState<string | null>(null);

  // Clear optimistic status after 3 seconds
  useEffect(() => {
    if (!justActioned) return;
    const timer = setTimeout(() => setJustActioned(null), 3000);
    return () => clearTimeout(timer);
  }, [justActioned]);

  const handleQuickAction = (action: "water" | "fertilize" | "bug" | "fungus") => {
    setJustActioned(action);
    onAction(plant.id, action);
  };

  // Calculate remaining days taking optimistic updates into account
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

  const anyOverdue =
    waterUrgency === "overdue" ||
    fertUrgency === "overdue" ||
    bugUrgency === "overdue" ||
    fungUrgency === "overdue";

  return (
    <div className="bg-surface rounded-xl border border-border-hairline card-elevation overflow-hidden flex flex-col hover-lift group relative transition-all duration-300">
      {/* ================= HERO IMAGE & BADGES ================= */}
      <div
        className="h-52 sm:h-60 relative overflow-hidden bg-surface-subtle flex items-center justify-center cursor-pointer"
        onClick={() => onShowDetails(plant)}
      >
        {plant.apiId === "crop_easteregg_bohni" ? (
          <Image
            src="/Bohni.png"
            alt="Bohni"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : plant.imagePath ? (
          <Image
            src={`/api/images/${plant.imagePath}`}
            alt={plant.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-subtle/25 dark:bg-surface-subtle group-hover:bg-brand-subtle/40 transition-colors">
            <div className="w-16 h-16 relative opacity-35 dark:opacity-45 group-hover:opacity-60 transition-all duration-500 group-hover:scale-110">
              <Image
                src="/logo-green.svg"
                alt="PlantStack"
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}

        {/* Primary Alert Badge on Image (Strict 1-Badge Rule, solid scrim) */}
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
          {plant.frostWarning ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-care-frost text-white shadow-xs animate-pulse">
              <Snowflake size={11} className="shrink-0" />
              Frost
            </span>
          ) : anyOverdue ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-status-danger text-white shadow-xs">
              <AlertCircle size={11} className="shrink-0" />
              {lang === "de" ? "Überfällig" : "Overdue"}
            </span>
          ) : waterUrgency === "today" ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-care-water text-white shadow-xs">
              <Droplet size={11} className="shrink-0" />
              {lang === "de" ? "Heute gießen" : "Water today"}
            </span>
          ) : fertUrgency === "today" ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-care-fertilizer text-white shadow-xs">
              <FlaskConical size={11} className="shrink-0" />
              {lang === "de" ? "Heute düngen" : "Fertilize today"}
            </span>
          ) : null}
        </div>

        {/* 3-Dots Menu Button */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="w-7 h-7 md:w-8 md:h-8 bg-neutral-900/75 hover:bg-neutral-900/90 rounded-full text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            aria-label="Menü öffnen"
          >
            <MoreVertical size={15} />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                }}
              />
              <div className="absolute right-0 mt-2 w-44 bg-surface border border-border-hairline rounded-xl shadow-xl z-30 overflow-hidden flex flex-col py-1 animate-in fade-in zoom-in duration-150">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onEdit(plant);
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold hover:bg-surface-subtle text-foreground text-left transition-colors"
                >
                  <Edit2 size={14} className="text-brand" /> {t("edit", lang)}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onAction(plant.id, "snooze");
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold hover:bg-surface-subtle text-foreground text-left transition-colors"
                >
                  <Clock size={14} className="text-care-fertilizer" /> {t("snooze", lang)}
                </button>
                <div className="h-[1px] bg-border-hairline mx-2 my-1" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onDelete(plant.id);
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold hover:bg-status-danger/10 text-status-danger text-left transition-colors"
                >
                  <Trash2 size={14} /> {t("delete", lang)}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ================= CARD BODY ================= */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {(plant.location?.name || plant.locationType === "OUTDOOR" || (plant as any).winterDormancy) && (
            <div className="flex items-center flex-wrap gap-1.5 text-[11px] font-medium text-text-muted mb-1">
              {plant.location?.name && (
                <span className="inline-flex items-center gap-1 text-text-secondary">
                  <MapPin size={11} className="text-brand shrink-0" />
                  <span className="truncate max-w-[140px]">{plant.location.name}</span>
                </span>
              )}
              {plant.locationType === "OUTDOOR" && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-surface-subtle text-text-secondary">
                  <Sun size={10} className="text-amber-500 shrink-0" />
                  Outdoor
                </span>
              )}
              {(plant as any).winterDormancy && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-surface-subtle text-text-secondary">
                  <Snowflake size={10} className="text-sky-500 shrink-0" />
                  {lang === "de" ? "Winterruhe" : "Dormancy"}
                  {(plant as any).seasonalFactor ? ` +${(plant as any).seasonalFactor}%` : ""}
                </span>
              )}
            </div>
          )}
          <h3
            className="font-bold text-base text-text-primary truncate hover:text-brand transition-colors cursor-pointer"
            onClick={() => onShowDetails(plant)}
          >
            {plant.name}
          </h3>
          <p className="text-xs text-text-muted italic truncate">
            {plant.scientificName || (lang === "de" ? "Zimmerpflanze" : "Houseplant")}
          </p>
        </div>

        {/* ----------------- 1. DESKTOP VIEW: 1-Click Quick-Pills (hidden md:block) ----------------- */}
        <div className="hidden md:block pt-2 border-t border-border-hairline">
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>{lang === "de" ? "Pflegeroutinen (1-Klick)" : "Care Routines (1-Click)"}</span>
            <span className="text-[10px] text-brand font-medium">1-Klick</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {/* 1. Water Pill */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuickAction("water");
              }}
              className={`py-1.5 px-1 rounded-lg text-xs flex items-center justify-center gap-1 transition-all active:scale-95 truncate ${
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

            {/* 2. Fertilizer Pill */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuickAction("fertilize");
              }}
              className={`py-1.5 px-1 rounded-lg text-xs flex items-center justify-center gap-1 transition-all active:scale-95 truncate ${
                justActioned === "fertilize"
                  ? "bg-emerald-600 text-white font-bold shadow-xs"
                  : fertUrgency === "overdue"
                    ? "bg-care-fertilizer text-white font-bold shadow-xs ring-2 ring-status-danger hover:opacity-95"
                    : fertUrgency === "today"
                      ? "bg-care-fertilizer text-white font-bold shadow-xs hover:opacity-95"
                      : "bg-care-fertilizer-bg text-care-fertilizer hover:bg-care-fertilizer hover:text-white font-semibold"
              }`}
              title={lang === "de" ? "Klicken zum Düngen" : "Click to fertilize"}
            >
              {justActioned === "fertilize" ? (
                <Check size={13} className="shrink-0" />
              ) : (
                <FlaskConical size={13} className="shrink-0" />
              )}
              <span className="tabular truncate">
                {justActioned === "fertilize"
                  ? lang === "de"
                    ? "Fertig"
                    : "Done"
                  : fertUrgency === "today"
                    ? lang === "de"
                      ? "Düngen"
                      : "Fertilize"
                    : fertUrgency === "overdue"
                      ? `${Math.abs(fertDays || 1)} T.!`
                      : fertDays !== null
                        ? `${fertDays} T.`
                        : "-"}
              </span>
            </button>

            {/* 3. Bug / Bekämpfen Pill */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuickAction("bug");
              }}
              className={`py-1.5 px-1 rounded-lg text-xs flex items-center justify-center gap-1 transition-all active:scale-95 truncate ${
                justActioned === "bug"
                  ? "bg-emerald-600 text-white font-bold shadow-xs"
                  : bugUrgency === "overdue" || bugUrgency === "today"
                    ? "bg-care-bug text-white font-bold shadow-xs hover:opacity-95"
                    : "bg-care-bug-bg text-care-bug hover:bg-care-bug hover:text-white font-semibold"
              }`}
              title={lang === "de" ? "Schädlingsbehandlung dokumentieren" : "Pest control"}
            >
              {justActioned === "bug" ? (
                <Check size={13} className="shrink-0" />
              ) : (
                <BugOff size={13} className="shrink-0" />
              )}
              <span className="tabular truncate">
                {justActioned === "bug"
                  ? lang === "de"
                    ? "Fertig"
                    : "Done"
                  : bugUrgency === "today" || bugUrgency === "overdue"
                    ? lang === "de"
                      ? "Schutz"
                      : "Pest"
                    : bugDays !== null
                      ? `${bugDays} T.`
                      : "OK"}
              </span>
            </button>

            {/* 4. Fungus / Pilzschutz Pill */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuickAction("fungus");
              }}
              className={`py-1.5 px-1 rounded-lg text-xs flex items-center justify-center gap-1 transition-all active:scale-95 truncate ${
                justActioned === "fungus"
                  ? "bg-emerald-600 text-white font-bold shadow-xs"
                  : fungUrgency === "overdue" || fungUrgency === "today"
                    ? "bg-care-fungus text-white font-bold shadow-xs hover:opacity-95"
                    : "bg-care-fungus-bg text-care-fungus hover:bg-care-fungus hover:text-white font-semibold"
              }`}
              title={lang === "de" ? "Pilzbehandlung dokumentieren" : "Fungus treatment"}
            >
              {justActioned === "fungus" ? (
                <Check size={13} className="shrink-0" />
              ) : (
                <SprayCan size={13} className="shrink-0" />
              )}
              <span className="tabular truncate">
                {justActioned === "fungus"
                  ? lang === "de"
                    ? "Fertig"
                    : "Done"
                  : fungUrgency === "today" || fungUrgency === "overdue"
                    ? lang === "de"
                      ? "Pilz"
                      : "Fungus"
                    : fungDays !== null
                      ? `${fungDays} T.`
                      : "OK"}
              </span>
            </button>
          </div>
        </div>

        {/* ----------------- 2. MOBILE VIEW: Touch-Button & Micro-Details (block md:hidden) ----------------- */}
        <div className="block md:hidden space-y-2.5 pt-2 border-t border-border-hairline">
          {/* Primary Urgency Touch Button (44px target) */}
          {waterUrgency === "overdue" || waterUrgency === "today" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuickAction("water");
              }}
              className="w-full h-11 px-3 rounded-lg bg-care-water text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all"
            >
              {justActioned === "water" ? (
                <>
                  <Check size={16} />
                  <span>{lang === "de" ? "Gegossen ✓" : "Watered ✓"}</span>
                </>
              ) : (
                <>
                  <Droplet size={16} />
                  <span>
                    {lang === "de"
                      ? waterUrgency === "overdue"
                        ? `${Math.abs(waterDays || 1)} T. überfällig – Jetzt gießen`
                        : "Jetzt gießen (Heute fällig)"
                      : waterUrgency === "overdue"
                        ? `${Math.abs(waterDays || 1)} d overdue – Water now`
                        : "Water now (Due today)"}
                  </span>
                </>
              )}
            </button>
          ) : fertUrgency === "overdue" || fertUrgency === "today" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuickAction("fertilize");
              }}
              className="w-full h-11 px-3 rounded-lg bg-care-fertilizer text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all"
            >
              {justActioned === "fertilize" ? (
                <>
                  <Check size={16} />
                  <span>{lang === "de" ? "Gedüngt ✓" : "Fertilized ✓"}</span>
                </>
              ) : (
                <>
                  <FlaskConical size={16} />
                  <span>
                    {lang === "de"
                      ? "Jetzt düngen (Heute fällig)"
                      : "Fertilize now (Due today)"}
                  </span>
                </>
              )}
            </button>
          ) : bugUrgency === "overdue" || bugUrgency === "today" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuickAction("bug");
              }}
              className="w-full h-11 px-3 rounded-lg bg-care-bug text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all"
            >
              {justActioned === "bug" ? (
                <>
                  <Check size={16} />
                  <span>{lang === "de" ? "Behandelt ✓" : "Treated ✓"}</span>
                </>
              ) : (
                <>
                  <BugOff size={16} />
                  <span>{lang === "de" ? "Schädlingsschutz anwenden" : "Apply pest protection"}</span>
                </>
              )}
            </button>
          ) : fungUrgency === "overdue" || fungUrgency === "today" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuickAction("fungus");
              }}
              className="w-full h-11 px-3 rounded-lg bg-care-fungus text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all"
            >
              {justActioned === "fungus" ? (
                <>
                  <Check size={16} />
                  <span>{lang === "de" ? "Behandelt ✓" : "Treated ✓"}</span>
                </>
              ) : (
                <>
                  <SprayCan size={16} />
                  <span>{lang === "de" ? "Pilzschutz anwenden" : "Apply fungus treatment"}</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShowDetails(plant);
              }}
              className="w-full h-11 px-3 rounded-lg bg-surface-subtle text-text-secondary hover:text-text-primary font-medium text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Check size={15} className="text-emerald-500" />
              <span>
                {lang === "de"
                  ? `Alles versorgt • Gießen in ${waterDays ?? "?"} T.`
                  : `All set • Water in ${waterDays ?? "?"} d`}
              </span>
            </button>
          )}

          {/* Secondary Care Row */}
          <div className="flex items-center justify-between text-[11px] pt-1 text-text-muted">
            <span className="flex items-center gap-1">
              <FlaskConical size={12} className="text-care-fertilizer shrink-0" />
              <span className="tabular">
                {fertDays !== null
                  ? lang === "de"
                    ? `Düngen: in ${fertDays} T.`
                    : `Fertilize: ${fertDays} d`
                  : lang === "de"
                    ? "Düngen: -"
                    : "Fertilize: -"}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <BugOff size={12} className="text-care-bug shrink-0" />
              <span className="tabular">
                {bugDays !== null
                  ? lang === "de"
                    ? `Schutz: in ${bugDays} T.`
                    : `Pest: ${bugDays} d`
                  : "Schutz: OK"}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <SprayCan size={12} className="text-care-fungus shrink-0" />
              <span className="tabular">
                {fungDays !== null
                  ? lang === "de"
                    ? `Pilz: in ${fungDays} T.`
                    : `Fungus: ${fungDays} d`
                  : "Pilz: OK"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
