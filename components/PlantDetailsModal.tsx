"use client";

import { Plant, Location } from "@prisma/client";
import {
  X,
  Droplet,
  Sun,
  FlaskConical,
  BugOff,
  SprayCan,
  Leaf,
  Smile,
  Frown,
  Globe,
  Camera,
  Plus,
  Trash2,
  History,
  Clock,
  Loader2,
  MapPin,
  Thermometer,
  CloudRain,
  Scissors,
  StickyNote,
  ChevronDown,
  Edit2,
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { t, Locale } from "@/lib/i18n";
import { cropsData } from "@/lib/crops";

type PlantDetailsModalProps = {
  plant: Plant & { location?: Location };
  lang: string;
  onClose: () => void;
  onAction?: (plantId: string, action: "water" | "fertilize" | "bug" | "fungus" | "snooze") => void;
  onEdit?: (plant: Plant) => void;
};

export default function PlantDetailsModal({
  plant,
  lang,
  onClose,
  onAction,
  onEdit,
}: PlantDetailsModalProps) {
  const [extraInfo, setExtraInfo] = useState<any>(null);
  const [plantData, setPlantData] = useState<any>(plant);
  const [photos, setPhotos] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoNote, setPhotoNote] = useState("");
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [mobileTab, setMobileTab] = useState<"care" | "diary">("care");
  const [careLogOpen, setCareLogOpen] = useState(false);

  useEffect(() => {
    async function loadDetails() {
      try {
        const res = await fetch(`/api/plants/${plant.id}`);
        if (res.ok) {
          const data = await res.json();
          setPlantData(data);
          if (data.photos) setPhotos(data.photos);
          if (data.events) setEvents(data.events);
        }
      } catch (err) {
        console.error("Failed to load plant events/photos", err);
      }
    }
    loadDetails();
  }, [plant.id]);

  const handleCareAction = async (action: "water" | "fertilize" | "bug" | "fungus") => {
    if (onAction) {
      onAction(plant.id, action);
    } else {
      try {
        await fetch(`/api/plants/${plant.id}/action`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        });
      } catch (e) {
        console.error("Action failed", e);
      }
    }

    // Refresh modal details after slight delay
    setTimeout(async () => {
      try {
        const res = await fetch(`/api/plants/${plant.id}`);
        if (res.ok) {
          const data = await res.json();
          setPlantData(data);
          if (data.photos) setPhotos(data.photos);
          if (data.events) setEvents(data.events);
        }
      } catch (err) {
        console.error("Failed to reload data", err);
      }
    }, 250);
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    if (photoNote.trim()) {
      formData.append("note", photoNote.trim());
    }

    setUploadingPhoto(true);
    try {
      const res = await fetch(`/api/plants/${plant.id}/photos`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const newPhoto = await res.json();
        setPhotos((prev) => [newPhoto, ...prev]);
        setPhotoNote("");
        setShowPhotoInput(false);
      }
    } catch (err) {
      console.error("Photo upload failed", err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      await fetch(`/api/plants/${plant.id}/photos/${photoId}`, { method: "DELETE" });
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      if (selectedPhoto?.id === photoId) setSelectedPhoto(null);
    } catch (err) {
      console.error("Photo delete failed", err);
    }
  };

  const formatRelativeTime = (dateStr: string | Date) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffDays === 0) {
      if (diffHours <= 1) return lang === "de" ? "Gerade eben" : "Just now";
      return lang === "de" ? `vor ${diffHours} Std.` : `${diffHours}h ago`;
    }
    if (diffDays === 1) return lang === "de" ? "Gestern" : "Yesterday";
    return lang === "de" ? `vor ${diffDays} Tagen` : `${diffDays} days ago`;
  };

  const getEventBadge = (type: string) => {
    switch (type) {
      case "WATER":
        return {
          icon: <Droplet size={13} />,
          label: t("eventWater", lang),
          color: "bg-care-water-bg text-care-water",
        };
      case "FERTILIZE":
        return {
          icon: <FlaskConical size={13} />,
          label: t("eventFertilize", lang),
          color: "bg-care-fertilizer-bg text-care-fertilizer",
        };
      case "BUG":
        return {
          icon: <BugOff size={13} />,
          label: lang === "de" ? "Schädlingsschutz" : t("eventBug", lang),
          color: "bg-care-bug-bg text-care-bug",
        };
      case "FUNGUS":
        return {
          icon: <SprayCan size={13} />,
          label: t("eventFungus", lang),
          color: "bg-care-fungus-bg text-care-fungus",
        };
      case "ARCHIVE":
        return {
          icon: <X size={13} />,
          label: t("eventArchive", lang),
          color: "bg-status-danger-bg text-status-danger",
        };
      case "CREATE":
      default:
        return {
          icon: <Leaf size={13} />,
          label: t("eventCreate", lang),
          color: "bg-brand-subtle text-brand",
        };
    }
  };

  const addDays = (date: Date, days: number) => {
    const r = new Date(date);
    r.setDate(r.getDate() + days);
    return r;
  };

  const getDaysLeft = (last: Date | null, interval: number | null): number | null => {
    if (!interval || !last) return null;
    const due = addDays(new Date(last), interval);
    const now = new Date();
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    return Math.round((dueDate.getTime() - nowDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const waterDays = getDaysLeft(plantData.lastWatered, plantData.waterInterval);
  const fertDays = getDaysLeft(plantData.lastFertilized, plantData.fertilizerInterval);
  const bugDays = getDaysLeft(plantData.lastBug, plantData.bugInterval);
  const fungDays = getDaysLeft(plantData.lastFungus, plantData.fungusInterval);

  useEffect(() => {
    async function fetchExtra() {
      if (plant.apiId) {
        try {
          const res = await fetch(
            `/api/openplantbook/detail?pid=${encodeURIComponent(plant.apiId)}&lang=${lang}`
          );
          if (res.ok) {
            const data = await res.json();
            if (data && !data.error) {
              setExtraInfo(data);
              return;
            }
          }
        } catch (e) {
          console.error("Failed to fetch extra info by apiId", e);
        }
      }

      const searchTerm = plant.alias || plant.name;
      if (!searchTerm) return;
      try {
        const res1 = await fetch(
          `/api/openplantbook/search?q=${encodeURIComponent(searchTerm)}`
        );
        const data1 = await res1.json();
        if (data1.results && data1.results[0]) {
          const res2 = await fetch(
            `/api/openplantbook/detail?pid=${encodeURIComponent(data1.results[0].pid)}&lang=${lang}`
          );
          const data2 = await res2.json();
          setExtraInfo(data2);
        }
      } catch (e) {
        console.error("Failed to fetch extra info", e);
      }
    }
    fetchExtra();
  }, [plant.apiId, plant.alias, plant.name, lang]);

  // ================= SUB-RENDERERS (Shared between Mobile & Desktop) =================

  // 1. Photo Hero (Clean, 100% WCAG AAA: No text over photo except dark-scrim room badge)
  const renderPhoto = (isMobile = false) => (
    <div>
      <div
        className={`relative ${isMobile ? "h-48 sm:h-56" : "h-60 sm:h-72"} rounded-xl sm:rounded-2xl overflow-hidden shadow-xs group cursor-pointer`}
        onClick={() => {
          if (plant.imagePath) {
            setSelectedPhoto({ imagePath: plant.imagePath, createdAt: plant.createdAt, note: plant.name });
          }
        }}
      >
        {plant.apiId === "crop_easteregg_bohni" ? (
          <Image src="/Bohni.png" alt="Bohni" fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
        ) : plant.imagePath ? (
          <Image
            src={`/api/images/${plant.imagePath}`}
            alt={plant.name}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-subtle/40">
            <Leaf className="w-20 h-20 text-brand/30" />
          </div>
        )}

        {/* Photo Badges (Dark-Scrim, 100% borderless!) */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-neutral-900/80 text-white backdrop-blur-xs shadow-xs">
            <MapPin size={11} className="text-emerald-400 shrink-0" />
            {plant.location?.name || (lang === "de" ? "Kein Standort" : "Unassigned")}
          </span>
          {(plant as any).potSize && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-neutral-900/80 text-white backdrop-blur-xs shadow-xs">
              Topf: Ø {(plant as any).potSize} cm
            </span>
          )}
        </div>

        {/* Mobile Close Button on Top Right of Photo */}
        {isMobile && (
          <button
            onClick={onClose}
            className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-xs text-white flex items-center justify-center transition-colors shadow-sm"
            aria-label={t("close", lang)}
          >
            <X size={16} />
          </button>
        )}
      </div>
      <p className="text-[11px] text-text-muted italic text-center mt-2">
        {lang === "de" ? "Hauptfoto der Pflanze" : "Main plant photo"}
      </p>
    </div>
  );

  // 2. Plant Identity (Clean on Neutral Surface below Photo: 100% WCAG AAA Readability!)
  const renderPlantIdentity = (isMobile = false) => (
    <div className={isMobile ? "px-4 py-3 bg-surface border-b border-border-hairline" : ""}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
          {lang === "de" ? "Pflanzen-Profil" : "Plant Profile"}
        </span>
        <div className="flex items-center gap-1.5">
          {onEdit && (
            <button
              onClick={() => onEdit(plant)}
              className="p-1.5 rounded-lg text-text-muted hover:text-foreground hover:bg-surface-subtle transition-colors"
              title={t("edit", lang)}
            >
              <Edit2 size={16} />
            </button>
          )}
          {!isMobile && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-muted hover:text-foreground hover:bg-surface-subtle transition-colors"
              aria-label={t("close", lang)}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <h2 className={`${isMobile ? "text-xl" : "text-2xl sm:text-3xl"} font-extrabold text-text-primary tracking-tight mt-1`}>
        {plant.name}
      </h2>
      {plant.scientificName && (
        <p className="text-xs sm:text-sm text-brand font-semibold italic mt-0.5">
          {plant.scientificName}
        </p>
      )}
      <div className="flex items-center gap-1.5 text-xs text-text-muted mt-1.5">
        <Globe size={13} className="text-brand shrink-0" />
        <span>{(plant as any).origin || (lang === "de" ? "Tropisch / Zimmerpflanze" : "Houseplant")}</span>
      </div>
    </div>
  );

  // 3. 1-Click Care Routines (100% Konturfrei, Farbkontinuität, Bekämpfen statt Prüfen, 2x2 Grid)
  const renderCareRoutines = () => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
          {lang === "de" ? "Pflegeroutinen" : "Care Routines"}
        </span>
        <span className="text-[10px] text-brand font-medium">
          {lang === "de" ? "Tippen = Erfassen" : "Tap = Log"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {/* Water */}
        <button
          onClick={() => handleCareAction("water")}
          className="p-3 rounded-xl bg-care-water-bg text-left hover-lift active:scale-95 transition-all group/btn cursor-pointer"
          title={lang === "de" ? "Klicken zum Gießen" : "Click to water"}
        >
          <div className="flex items-center justify-between text-care-water font-bold text-xs">
            <span className="flex items-center gap-1.5">
              <Droplet size={14} /> {t("water", lang)}
            </span>
            <span className="text-[10px] font-mono opacity-75">
              {plantData.waterInterval} T.
            </span>
          </div>
          <div className="mt-1.5 text-xs font-bold text-care-water tabular flex items-center justify-between">
            <span>
              {waterDays !== null && waterDays <= 0
                ? lang === "de" ? "Heute fällig" : "Due today"
                : waterDays !== null ? `in ${waterDays} T.` : "-"}
            </span>
            {waterDays !== null && waterDays <= 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-care-water animate-pulse"></span>
            )}
          </div>
          <div className="mt-1 text-[10px] text-care-water font-semibold">
            <span>{lang === "de" ? "Jetzt gießen" : "Water now"}</span>
          </div>
        </button>

        {/* Fertilize */}
        <button
          onClick={() => handleCareAction("fertilize")}
          className="p-3 rounded-xl bg-care-fertilizer-bg text-left hover-lift active:scale-95 transition-all group/btn cursor-pointer"
          title={lang === "de" ? "Klicken zum Düngen" : "Click to fertilize"}
        >
          <div className="flex items-center justify-between text-care-fertilizer font-bold text-xs">
            <span className="flex items-center gap-1.5">
              <FlaskConical size={14} /> {t("fertilize", lang)}
            </span>
            <span className="text-[10px] font-mono opacity-75">
              {plantData.fertilizerInterval ? `${plantData.fertilizerInterval} T.` : "-"}
            </span>
          </div>
          <div className="mt-1.5 text-xs font-bold text-text-primary tabular">
            {fertDays !== null
              ? fertDays <= 0 ? (lang === "de" ? "Heute fällig" : "Due today") : `in ${fertDays} T.`
              : "-"}
          </div>
          <div className="mt-1 text-[10px] text-care-fertilizer font-semibold">
            <span>{lang === "de" ? "Düngen" : "Fertilize"}</span>
          </div>
        </button>

        {/* Bug / Pest: Bekämpfen */}
        <button
          onClick={() => handleCareAction("bug")}
          className="p-3 rounded-xl bg-care-bug-bg text-left hover-lift active:scale-95 transition-all group/btn cursor-pointer"
          title={lang === "de" ? "Schädlingsbehandlung dokumentieren" : "Log pest control"}
        >
          <div className="flex items-center justify-between text-care-bug font-bold text-xs">
            <span className="flex items-center gap-1.5">
              <BugOff size={14} /> {lang === "de" ? "Bekämpfen" : "Pest"}
            </span>
            <span className="text-[10px] font-mono opacity-75">
              {plantData.bugInterval ? `${plantData.bugInterval} T.` : "monatl."}
            </span>
          </div>
          <div className="mt-1.5 text-xs font-bold text-text-primary tabular">
            {bugDays !== null
              ? bugDays <= 0 ? (lang === "de" ? "Behandlung fällig" : "Due") : `in ${bugDays} T.`
              : (lang === "de" ? "Kein Befall" : "No pests")}
          </div>
          <div className="mt-1 text-[10px] text-care-bug font-semibold">
            <span>{lang === "de" ? "Behandeln" : "Treat"}</span>
          </div>
        </button>

        {/* Fungus */}
        <button
          onClick={() => handleCareAction("fungus")}
          className="p-3 rounded-xl bg-care-fungus-bg text-left hover-lift active:scale-95 transition-all group/btn cursor-pointer"
          title={lang === "de" ? "Pilzbehandlung dokumentieren" : "Log fungus treatment"}
        >
          <div className="flex items-center justify-between text-care-fungus font-bold text-xs">
            <span className="flex items-center gap-1.5">
              <SprayCan size={14} /> {lang === "de" ? "Pilzschutz" : "Fungus"}
            </span>
            <span className="text-[10px] font-mono opacity-75">
              {plantData.fungusInterval ? `${plantData.fungusInterval} T.` : "Bedarf"}
            </span>
          </div>
          <div className="mt-1.5 text-xs font-bold text-text-primary tabular">
            {fungDays !== null
              ? fungDays <= 0 ? (lang === "de" ? "Behandlung fällig" : "Due") : `in ${fungDays} T.`
              : (lang === "de" ? "Inaktiv" : "Inactive")}
          </div>
          <div className="mt-1 text-[10px] text-care-fungus font-semibold">
            <span>{lang === "de" ? "Behandeln" : "Treat"}</span>
          </div>
        </button>
      </div>
    </div>
  );

  // 4. Environment & Location (Cleane Überschrift ohne Klammern & 100% ohne weiße Rahmen)
  const renderEnvironment = () => (
    <div>
      <div className="mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
          {lang === "de" ? "Standort & Umwelt" : "Environment & Location"}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-3 rounded-xl bg-surface-subtle text-center">
          <Sun className="w-4 h-4 text-care-sun mx-auto mb-1" />
          <span className="text-[10px] font-bold uppercase text-text-muted">
            {t("sunlight", lang)}
          </span>
          <p className="text-xs font-bold text-text-primary mt-0.5 truncate">
            {['full_sun', 'partial_shade', 'shade'].includes(plant.sunlightInfo || "")
              ? t(plant.sunlightInfo as any, lang as Locale)
              : plant.sunlightInfo || (lang === "de" ? "Hell, indirekt" : "Bright, indirect")}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-surface-subtle text-center">
          <Thermometer className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
          <span className="text-[10px] font-bold uppercase text-text-muted">
            {t("temperature", lang)}
          </span>
          <p className="text-xs font-bold text-text-primary mt-0.5">
            {extraInfo?.min_temp && extraInfo?.max_temp
              ? `${extraInfo.min_temp}–${extraInfo.max_temp} °C`
              : "18–24 °C"}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-surface-subtle text-center">
          <CloudRain className="w-4 h-4 text-care-water mx-auto mb-1" />
          <span className="text-[10px] font-bold uppercase text-text-muted">
            {t("humidity", lang)}
          </span>
          <p className="text-xs font-bold text-text-primary mt-0.5">
            {extraInfo?.min_env_humid ? `> ${extraInfo.min_env_humid} %` : "> 50 %"}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-surface-subtle text-center">
          <Scissors className="w-4 h-4 text-brand mx-auto mb-1" />
          <span className="text-[10px] font-bold uppercase text-text-muted">
            {t("pruning", lang)}
          </span>
          <p className="text-xs font-bold text-text-primary mt-0.5 truncate">
            {plant.pruningInfo || (lang === "de" ? "Nach Bedarf" : "As needed")}
          </p>
        </div>
      </div>
    </div>
  );

  // 5. Notes (Schlanke typografische Zitatleiste)
  const renderNotes = () => {
    if (!plant.notes) return null;
    return (
      <div className="space-y-1.5 pt-2 border-t border-border-hairline">
        <div className="flex items-center gap-1.5 text-text-primary font-bold text-xs">
          <StickyNote size={14} className="text-brand" />
          <span>{t("notes", lang)}</span>
        </div>
        <div className="border-l-2 border-brand/50 pl-3 py-1 text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">
          {plant.notes}
        </div>
      </div>
    );
  };

  // 6. Botanical Insights (Ausführliche Wissens-Karten ohne Duplikate zur 4er-Kompaktleiste)
  const renderBotanical = () => {
    const hasBotanicalInfo = Boolean(
      plant.wateringInfo ||
      extraInfo?.sowing_outdoors_month ||
      (extraInfo?.good_neighbors && extraInfo.good_neighbors.length > 0) ||
      (extraInfo?.bad_neighbors && extraInfo.bad_neighbors.length > 0) ||
      (extraInfo?.min_light_lux && extraInfo?.max_light_lux) ||
      (extraInfo?.min_soil_moist && extraInfo?.max_soil_moist && !plant.wateringInfo?.includes(String(extraInfo.min_soil_moist))) ||
      (plant.pruningInfo && plant.pruningInfo.length > 15)
    );

    if (!hasBotanicalInfo) return null;

    return (
      <div className="space-y-2.5 pt-2 border-t border-border-hairline">
        <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
          <Leaf size={14} className="text-brand" />
          <span>{lang === "de" ? "Botanische Hinweise" : "Botanical Insights"}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {plant.wateringInfo && (
            <div className="flex gap-2">
              <Droplet size={14} className="text-care-water shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-text-primary">{t("conditions", lang as Locale)}:</span>
                <p className="text-[11px] text-text-secondary leading-tight mt-0.5">{plant.wateringInfo}</p>
              </div>
            </div>
          )}

          {extraInfo?.min_light_lux && extraInfo?.max_light_lux && (
            <div className="flex gap-2">
              <Sun size={14} className="text-care-sun shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-text-primary">
                  {lang === "de" ? "Lichtstärke (Lux):" : "Light level (Lux):"}
                </span>
                <p className="text-[11px] text-text-secondary leading-tight mt-0.5">
                  {extraInfo.min_light_lux.toLocaleString()} – {extraInfo.max_light_lux.toLocaleString()} Lux
                </p>
              </div>
            </div>
          )}

          {extraInfo?.min_soil_moist && extraInfo?.max_soil_moist && !plant.wateringInfo?.includes(String(extraInfo.min_soil_moist)) && (
            <div className="flex gap-2">
              <Droplet size={14} className="text-care-water shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-text-primary">
                  {lang === "de" ? "Bodenfeuchte:" : "Soil Moisture:"}
                </span>
                <p className="text-[11px] text-text-secondary leading-tight mt-0.5">
                  {extraInfo.min_soil_moist} – {extraInfo.max_soil_moist} %
                </p>
              </div>
            </div>
          )}

          {plant.pruningInfo && plant.pruningInfo.length > 15 && (
            <div className="flex gap-2">
              <Scissors size={14} className="text-brand shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-text-primary">
                  {lang === "de" ? "Beschnitt & Schnitt:" : "Pruning details:"}
                </span>
                <p className="text-[11px] text-text-secondary leading-tight mt-0.5">{plant.pruningInfo}</p>
              </div>
            </div>
          )}

          {extraInfo?.sowing_outdoors_month && (
            <div className="flex gap-2">
              <Sun size={14} className="text-care-sun shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-text-primary">{t("sowingOutdoors", lang)}:</span>
                <p className="text-[11px] text-text-secondary leading-tight mt-0.5">{extraInfo.sowing_outdoors_month}</p>
              </div>
            </div>
          )}

          {extraInfo?.good_neighbors && extraInfo.good_neighbors.length > 0 && (
            <div className="flex gap-2">
              <Smile size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-text-primary">{t("goodNeighbors", lang)}:</span>
                <p className="text-[11px] text-text-secondary leading-tight mt-0.5">
                  {extraInfo.good_neighbors.join(", ")}
                </p>
              </div>
            </div>
          )}

          {extraInfo?.bad_neighbors && extraInfo.bad_neighbors.length > 0 && (
            <div className="flex gap-2">
              <Frown size={14} className="text-status-danger shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-text-primary">{t("badNeighbors", lang)}:</span>
                <p className="text-[11px] text-text-secondary leading-tight mt-0.5">
                  {extraInfo.bad_neighbors.join(", ")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 7. Photo Growth Diary (Timeline & Upload)
  const renderPhotoDiary = () => (
    <div className="bg-surface p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-border-hairline card-elevation space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
          <Camera size={15} className="text-brand" />
          <span>{t("photoDiary", lang)}</span>
          {photos.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-subtle text-brand font-semibold">
              {photos.length}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowPhotoInput(!showPhotoInput)}
          className="flex items-center gap-1 text-[11px] font-semibold text-brand hover:text-brand-hover bg-brand-subtle px-2.5 py-1 rounded-lg transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={13} />
          <span>{t("addPhoto", lang)}</span>
        </button>
      </div>

      {/* Add Photo Expandable Form */}
      {showPhotoInput && (
        <div className="p-3 bg-surface-subtle rounded-xl space-y-2.5 animate-in fade-in">
          <input
            type="text"
            placeholder={t("photoNotePlaceholder", lang)}
            value={photoNote}
            onChange={(e) => setPhotoNote(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-surface border border-border-hairline rounded-lg text-foreground placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brand"
          />
          <div className="flex items-center justify-between">
            <label className="cursor-pointer text-xs font-semibold bg-brand hover:bg-brand-hover text-white px-3 py-1.5 rounded-lg shadow-xs transition-all inline-flex items-center gap-1.5">
              {uploadingPhoto ? <Loader2 size={13} className="animate-spin" /> : <Camera size={13} />}
              <span>{uploadingPhoto ? "Lädt..." : "Foto wählen"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadPhoto}
                disabled={uploadingPhoto}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setShowPhotoInput(false);
                setPhotoNote("");
              }}
              className="text-xs text-text-muted hover:text-foreground px-2 py-1 cursor-pointer"
            >
              {t("close", lang)}
            </button>
          </div>
        </div>
      )}

      {/* Horizontal Photo Timeline Strip */}
      {photos.length > 0 ? (
        <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative group shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-surface-subtle cursor-pointer shadow-xs hover:shadow-sm transition-all"
              onClick={() => setSelectedPhoto(photo)}
            >
              <Image
                src={`/api/images/${photo.imagePath}`}
                alt={photo.note || "Plant photo"}
                fill
                sizes="96px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              <div className="absolute bottom-1 left-1 right-1 text-white">
                <p className="text-[9px] font-bold truncate">
                  {new Date(photo.createdAt).toLocaleDateString(
                    lang === "de" ? "de-DE" : "en-US",
                    { month: "short", day: "numeric" }
                  )}
                </p>
                {photo.note && (
                  <p className="text-[8px] text-white/80 truncate">{photo.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-text-muted italic py-1">
          {lang === "de"
            ? "Noch keine Wachstumsfotos hinzugefügt."
            : "No growth photos added yet."}
        </p>
      )}
    </div>
  );

  // 8. Care Log / History (Collapsible Accordion, default collapsed)
  const renderCareLog = () => (
    <div className="pt-2 border-t border-border-hairline">
      <button
        type="button"
        onClick={() => setCareLogOpen(!careLogOpen)}
        className="w-full flex items-center justify-between text-xs py-2.5 px-3 rounded-xl bg-surface-subtle hover:bg-surface-subtle/80 text-text-primary font-bold transition-all cursor-pointer select-none"
      >
        <span className="flex items-center gap-2">
          <History size={15} className="text-brand" />
          <span>{t("careLog", lang)}</span>
          {events.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-brand-subtle text-brand font-semibold">
              {events.length} {lang === "de" ? (events.length === 1 ? "Eintrag" : "Einträge") : (events.length === 1 ? "entry" : "entries")}
            </span>
          )}
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-brand font-medium">
          <span>{careLogOpen ? (lang === "de" ? "Einklappen" : "Collapse") : (lang === "de" ? "Aufklappen" : "Expand")}</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${careLogOpen ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {careLogOpen && (
        <div className="mt-3 animate-in fade-in duration-200">
          {events.length > 0 ? (
            <div className="relative pl-4 space-y-2.5 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-hairline">
              {events.slice(0, 10).map((evt) => {
                const badge = getEventBadge(evt.type);
                return (
                  <div key={evt.id} className="relative flex items-center justify-between text-xs">
                    <span className="absolute -left-4 w-2 h-2 rounded-full bg-brand ring-4 ring-surface" />
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] flex items-center gap-1 ${badge.color}`}>
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>
                    </div>
                    <div className="text-[11px] text-text-muted text-right">
                      <span className="font-medium text-text-secondary mr-1.5">
                        {formatRelativeTime(evt.createdAt)}
                      </span>
                      <span className="hidden sm:inline opacity-70">
                        ({new Date(evt.createdAt).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-text-muted italic py-1 px-3">
              {t("noEvents", lang)}
            </p>
          )}
        </div>
      )}
    </div>
  );

  // 9. Footer (Clean, no redundant bulk button)
  const renderFooter = (isMobile = false) => (
    <div className="flex items-center justify-between pt-3 border-t border-border-hairline text-xs">
      <div className="flex items-center gap-2 text-text-muted">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>{lang === "de" ? "Pflanze aktiv" : "Plant active"}</span>
      </div>
      <button
        onClick={onClose}
        className="px-5 py-2 rounded-lg text-xs font-semibold bg-surface-subtle hover:bg-surface-elevated text-foreground transition-colors cursor-pointer"
      >
        {t("close", lang)}
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Outer Card Container */}
      <div className="bg-surface w-full max-w-5xl rounded-2xl md:rounded-3xl shadow-2xl border border-border-hairline overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* ================= MOBILE VIEW (Visible on screens < md) ================= */}
        <div className="block md:hidden max-h-[88vh] overflow-y-auto">
          {/* Sheet Handle Indicator */}
          <div className="pt-2.5 pb-1 flex justify-center bg-surface-subtle">
            <div className="w-10 h-1 bg-border-strong rounded-full" />
          </div>

          {/* Hero Picture */}
          <div className="p-3 bg-surface-subtle">
            {renderPhoto(true)}
          </div>

          {/* Plant Identity on clean surface ground */}
          {renderPlantIdentity(true)}

          {/* 2-Tab Navigation Bar */}
          <div className="flex border-b border-border-hairline bg-surface-subtle text-xs font-bold sticky top-0 z-20">
            <button
              type="button"
              onClick={() => setMobileTab("care")}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                mobileTab === "care"
                  ? "text-brand border-b-2 border-brand bg-surface"
                  : "text-text-muted hover:text-foreground"
              }`}
            >
              {lang === "de" ? "Pflege & Details" : "Care & Details"}
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("diary")}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                mobileTab === "diary"
                  ? "text-brand border-b-2 border-brand bg-surface"
                  : "text-text-muted hover:text-foreground"
              }`}
            >
              {lang === "de" ? "Tagebuch & Historie" : "Diary & History"}
              {(photos.length > 0 || events.length > 0) && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-brand-subtle text-brand">
                  {photos.length + events.length}
                </span>
              )}
            </button>
          </div>

          {/* Tab Panes */}
          <div className="p-4 space-y-4 text-xs">
            {mobileTab === "care" ? (
              <>
                {renderCareRoutines()}
                {renderEnvironment()}
                {renderNotes()}
                {renderBotanical()}
              </>
            ) : (
              <>
                {renderPhotoDiary()}
                {renderCareLog()}
              </>
            )}
            {renderFooter(true)}
          </div>
        </div>

        {/* ================= DESKTOP 2-COLUMN BOTANICAL STUDIO (Visible on md+) ================= */}
        <div className="hidden md:flex flex-row max-h-[88vh] overflow-hidden">
          {/* LEFT COLUMN: Visuals & Growth Diary (42% Width) */}
          <div className="w-5/12 bg-surface-subtle border-r border-border-hairline p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
            <div className="space-y-4">
              {renderPhoto(false)}
              {renderPhotoDiary()}
            </div>
          </div>

          {/* RIGHT COLUMN: Profile, Routines, Environment, Notes & Care Log (58% Width) */}
          <div className="w-7/12 p-6 md:p-8 flex flex-col justify-between space-y-5 overflow-y-auto">
            <div className="space-y-5">
              {renderPlantIdentity(false)}
              {renderCareRoutines()}
              {renderEnvironment()}
              {renderNotes()}
              {renderBotanical()}
              {renderCareLog()}
            </div>
            {renderFooter(false)}
          </div>
        </div>

      </div>

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-surface max-w-md w-full rounded-2xl overflow-hidden shadow-2xl border border-border-hairline flex flex-col animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-80 w-full bg-black/20">
              <Image
                src={
                  selectedPhoto.imagePath.startsWith("/api")
                    ? selectedPhoto.imagePath
                    : `/api/images/${selectedPhoto.imagePath}`
                }
                alt={selectedPhoto.note || "Enlarged photo"}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-contain"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between gap-3 bg-surface">
              <div>
                <p className="text-xs font-bold text-foreground">
                  {new Date(selectedPhoto.createdAt).toLocaleDateString(
                    lang === "de" ? "de-DE" : "en-US",
                    {
                      weekday: "short",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
                {selectedPhoto.note && (
                  <p className="text-xs text-text-muted mt-0.5">{selectedPhoto.note}</p>
                )}
              </div>
              {selectedPhoto.id && (
                <button
                  onClick={() => handleDeletePhoto(selectedPhoto.id)}
                  className="p-2 text-status-danger hover:bg-status-danger/10 rounded-lg transition-colors cursor-pointer"
                  title={lang === "de" ? "Foto löschen" : "Delete photo"}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
