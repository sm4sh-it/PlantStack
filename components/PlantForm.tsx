"use client";

import { useState, useEffect, useRef } from "react";
import { Plant, Location } from "@prisma/client";
import {
  X,
  Upload,
  Search,
  Loader2,
  Check,
  Info,
  Plus,
  AlertTriangle,
  Camera,
  Droplet,
  FlaskConical,
  BugOff,
  SprayCan,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { t } from "@/lib/i18n";

type PlantFormProps = {
  initialData?: Plant & { location?: Location; locationType?: string; pruningInfo?: string | null };
  lang: string;
  onSave: () => void;
  onCancel: () => void;
};

export default function PlantForm({ initialData, lang, onSave, onCancel }: PlantFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    searchAlias: (initialData as any)?.alias || "",
    scientificName: initialData?.scientificName || "",
    wateringInfo: initialData?.wateringInfo || "",
    sunlightInfo: initialData?.sunlightInfo || "",
    locationId: initialData?.locationId || "",
    waterInterval: initialData?.waterInterval || 7,
    fertilizerInterval: initialData?.fertilizerInterval || "",
    bugInterval: initialData?.bugInterval || "",
    fungusInterval: initialData?.fungusInterval || "",
    locationType: initialData?.locationType || "INDOOR",
    plantType: (initialData as any)?.plantType || "Zierpflanze",
    placement: (initialData as any)?.placement || "Drinnen",
    pruningInfo: initialData?.pruningInfo || "",
    apiId: (initialData as any)?.apiId || "",
    origin: (initialData as any)?.origin || "",
    notes: initialData?.notes || "",
    imagePath: initialData?.imagePath || "",
  });

  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.imagePath ? `/api/images/${initialData.imagePath}` : null
  );
  const [isDragging, setIsDragging] = useState(false);

  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [addingLocation, setAddingLocation] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [savingLocation, setSavingLocation] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateLocationInline = async () => {
    if (!newLocationName.trim()) return;
    setSavingLocation(true);
    try {
      const res = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newLocationName.trim() }),
      });
      const newLoc = await res.json();
      if (newLoc && newLoc.id) {
        setLocations((prev) => [...prev, newLoc]);
        setFormData((prev) => ({ ...prev, locationId: newLoc.id }));
        setNewLocationName("");
        setAddingLocation(false);
      }
    } catch (e) {
      console.error("Failed to add location", e);
    } finally {
      setSavingLocation(false);
    }
  };

  useEffect(() => {
    fetch("/api/locations")
      .then((res) => res.json())
      .then((data) => {
        setLocations(data);
        if (!formData.locationId && data.length > 0) {
          setFormData((prev) => ({ ...prev, locationId: data[0].id }));
        }
      })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchOpenPlantbook = async () => {
    if (!formData.searchAlias) return;
    setSearching(true);
    setSearchResults([]);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/openplantbook/search?q=${encodeURIComponent(formData.searchAlias)}`);
      const { results } = await res.json();
      if (results && results.length > 0) {
        setSearchResults(results.slice(0, 5)); // show top 5
      } else {
        setErrorMessage(
          lang === "de"
            ? "Kein Treffer in Open Plantbook gefunden."
            : "No match found in Open Plantbook."
        );
      }
    } catch (e) {
      console.error(e);
      setErrorMessage(
        lang === "de"
          ? "Fehler bei der Plantbook-Suche. Zugangsdaten in .env vorhanden?"
          : "Error searching Open Plantbook. Are credentials configured in .env?"
      );
    } finally {
      setSearching(false);
    }
  };

  const handleSelectResult = async (plantInfo: any) => {
    setSearching(true);
    setSearchResults([]);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/openplantbook/detail?pid=${encodeURIComponent(plantInfo.pid)}`);
      const details = await res.json();

      let waterDays = 7;
      if (details.watering_interval_days) {
        waterDays = details.watering_interval_days;
      } else {
        if (details.min_soil_moist > 40) waterDays = 3;
        else if (details.min_soil_moist < 15) waterDays = 14;
      }

      const sunlightText = details.sunlight_text
        ? details.sunlight_text
        : `${details.min_light_lux || 0} - ${details.max_light_lux || 0} Lux | ${t("temperature", lang)}: ${details.min_temp || 0} - ${details.max_temp || 0} °C`;
      const wateringText = details.watering_interval_days
        ? `${t("watering", lang)}: ~${details.watering_interval_days} ${t("days", lang)}`
        : `${t("soilMoisture", lang)}: ${details.min_soil_moist || 0} - ${details.max_soil_moist || 0}% | ${t("humidity", lang)}: ${details.min_env_humid || 0} - ${details.max_env_humid || 0}%`;

      setFormData((prev) => ({
        ...prev,
        searchAlias: details.alias || plantInfo.alias || prev.searchAlias,
        scientificName: details.display_pid || plantInfo.display_pid || prev.scientificName,
        wateringInfo: wateringText,
        sunlightInfo: sunlightText,
        apiId: plantInfo.pid || prev.apiId,
        origin: details.origin || details.Origin || prev.origin,
        plantType: plantInfo.pid && plantInfo.pid.startsWith("crop_") ? "Nutzpflanze" : "Zierpflanze",
        waterInterval: prev.waterInterval === 7 ? waterDays : prev.waterInterval,
        pruningInfo: details.pruning_month
          ? Array.isArray(details.pruning_month)
            ? details.pruning_month.join(", ")
            : details.pruning_month
          : prev.pruningInfo,
      }));
    } catch (e) {
      console.error(e);
      setErrorMessage(
        lang === "de" ? "Pflanzendetails konnten nicht geladen werden." : "Failed to fetch plant details"
      );
    } finally {
      setSearching(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setFormData((prev) => ({ ...prev, imagePath: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.locationId) {
      setErrorMessage(
        lang === "de" ? "Bitte wähle zuerst einen Raum/Standort aus!" : "Please select a location first!"
      );
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    let uploadedImagePath = formData.imagePath;
    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append("file", imageFile);
      try {
        const upRes = await fetch("/api/upload", { method: "POST", body: uploadData });
        const upData = await upRes.json();
        if (upData.filename) {
          uploadedImagePath = upData.filename;
        }
      } catch (err) {
        console.error("Upload failed", err);
      }
    }

    const payload = {
      ...formData,
      alias: formData.searchAlias,
      imagePath: uploadedImagePath,
    };

    try {
      const url = initialData ? `/api/plants/${initialData.id}` : "/api/plants";
      const method = initialData ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      onSave();
    } catch (error) {
      console.error(error);
      setErrorMessage(lang === "de" ? "Fehler beim Speichern der Pflanze." : "Failed to save plant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-surface w-full max-w-2xl rounded-2xl md:rounded-3xl shadow-2xl border border-border-hairline overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border-hairline flex justify-between items-center bg-surface">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              {initialData
                ? lang === "de"
                  ? "Pflanze bearbeiten"
                  : "Edit Plant"
                : t("addPlant", lang)}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {lang === "de"
                ? "Pflanzendaten, Standort und individuelle Pflegeregler"
                : "Plant parameters, location and custom care schedules"}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-9 h-9 rounded-lg hover:bg-surface-subtle text-text-muted hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
            aria-label={t("close", lang)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 sm:p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-urgency-overdue/10 border border-urgency-overdue/25 rounded-xl flex items-center justify-between text-xs text-urgency-overdue animate-in fade-in">
              <div className="flex items-center gap-2.5 font-semibold">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="p-1 hover:opacity-75 rounded-lg cursor-pointer"
                aria-label="Close error"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <form id="plant-form" onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Dropzone Upload Preview (Kapitel 3.3 Design Guide) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary">
                {lang === "de" ? "Pflanzenfoto (Dropzone)" : "Plant Photo (Dropzone)"}
              </label>

              {previewUrl ? (
                <div className="p-3 bg-surface-subtle rounded-xl border border-border-hairline flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface shrink-0 shadow-xs">
                      <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">
                        {imageFile ? imageFile.name : formData.name || "Foto gespeichert"}
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        {imageFile
                          ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB • Bereit zum Speichern`
                          : lang === "de"
                          ? "Aktuelles Hauptfoto aktiv"
                          : "Current primary photo active"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-elevated text-text-secondary hover:text-foreground text-xs font-semibold border border-border-hairline transition-colors cursor-pointer"
                    >
                      {lang === "de" ? "Ändern" : "Change"}
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1.5 rounded-lg hover:bg-status-danger/10 text-text-muted hover:text-status-danger transition-colors cursor-pointer"
                      title={lang === "de" ? "Foto entfernen" : "Remove photo"}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-5 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-colors group ${
                    isDragging
                      ? "border-brand bg-brand-subtle/40"
                      : "border-border-strong hover:border-brand bg-surface-subtle/50 hover:bg-surface-subtle"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-surface border border-border-hairline flex items-center justify-center mx-auto mb-2 text-text-muted group-hover:text-brand transition-colors">
                    <Camera size={20} />
                  </div>
                  <p className="text-xs font-bold text-text-primary">
                    {lang === "de" ? "Foto hier hineinziehen oder klicken" : "Drag photo here or click to upload"}
                  </p>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    {lang === "de"
                      ? "JPG, PNG, WebP bis 10 MB • Automatische WebP-Kompression"
                      : "JPG, PNG, WebP up to 10 MB • Automatic WebP compression"}
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* 2. Basisdaten (Pflanzenname & OpenPlantbook Autocomplete) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name Input (44px) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-primary">
                  {lang === "de" ? "Pflanzenname *" : "Plant Name *"}
                </label>
                <input
                  required
                  type="text"
                  className="w-full h-11 bg-surface border border-border-strong rounded-lg px-3.5 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all placeholder:text-text-muted"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Monstera Deliciosa"
                />
              </div>

              {/* Open Plantbook Search (44px, Floating Dropdown without CLS) */}
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-text-primary">
                  {t("searchAlias", lang)}
                </label>
                <div className="flex gap-2 relative">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      className="w-full h-11 bg-surface border border-border-strong rounded-lg pl-3.5 pr-8 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all placeholder:text-text-muted"
                      value={formData.searchAlias}
                      onChange={(e) => setFormData({ ...formData, searchAlias: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSearchOpenPlantbook();
                        }
                      }}
                      placeholder={lang === "de" ? "z. B. Monstera, Ficus..." : "e.g. Monstera, Ficus..."}
                    />
                    {formData.searchAlias && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, searchAlias: "" });
                          setSearchResults([]);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-foreground cursor-pointer p-1"
                        aria-label="Clear search"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleSearchOpenPlantbook}
                    disabled={searching || !formData.searchAlias.trim()}
                    className="h-11 px-3.5 rounded-lg bg-surface-subtle hover:bg-brand hover:text-white border border-border-strong text-text-secondary hover:border-brand transition-colors shrink-0 flex items-center justify-center cursor-pointer disabled:opacity-50"
                    title={lang === "de" ? "In Datenbank suchen" : "Search in Database"}
                  >
                    {searching ? <Loader2 size={17} className="animate-spin" /> : <Search size={17} />}
                  </button>
                </div>

                {/* Floating Suggestions Dropdown (ABSOLUTE POSITIONED - ZERO CLS!) */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-surface border border-border-strong rounded-xl shadow-2xl overflow-hidden divide-y divide-border-hairline animate-in fade-in slide-in-from-top-1">
                    {searchResults.map((res: any) => (
                      <div
                        key={res.pid}
                        onClick={() => handleSelectResult(res)}
                        className="p-3 hover:bg-surface-subtle cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div className="min-w-0 pr-3">
                          <div className="text-xs font-bold text-text-primary truncate">
                            {res.alias || res.display_pid}
                          </div>
                          <div className="text-[11px] text-text-muted italic truncate">
                            {res.display_pid}
                          </div>
                        </div>
                        <span className="text-[11px] text-brand font-semibold px-2 py-0.5 rounded-md bg-brand-subtle shrink-0 group-hover:bg-brand group-hover:text-white transition-colors">
                          {lang === "de" ? "Auswählen" : "Select"}
                        </span>
                      </div>
                    ))}
                    <div className="p-1.5 bg-surface-subtle text-right">
                      <button
                        type="button"
                        onClick={() => setSearchResults([])}
                        className="text-xs text-text-muted hover:text-foreground px-2 py-1 cursor-pointer"
                      >
                        {t("close", lang)}
                      </button>
                    </div>
                  </div>
                )}

                {/* Scientific Name Confirmation Badge */}
                {formData.scientificName && (
                  <p className="text-xs text-brand font-medium italic mt-1 px-1 flex items-center gap-1">
                    <Check size={13} className="text-emerald-500" /> {formData.scientificName}
                  </p>
                )}
              </div>
            </div>

            {/* 3. Standort & Umgebung Grid */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Umgebung (Placement) */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 group relative">
                    <label className="text-xs font-bold text-text-primary">
                      {t("environmentAndRoom", lang)} *
                    </label>
                    <div className="relative flex items-center cursor-help">
                      <Info size={14} className="text-text-muted hover:text-brand transition-colors" />
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-neutral-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-50 text-center shadow-lg border border-neutral-800">
                        {t("environmentTooltip", lang)}
                      </div>
                    </div>
                  </div>

                  <div className="flex bg-surface-subtle p-1 rounded-lg w-full h-11 border border-border-strong">
                    {[
                      { label: t("indoorPlacement", lang), value: "Drinnen" },
                      { label: t("outdoorOpen", lang), value: "Draußen" },
                      { label: t("outdoorCovered", lang), value: "Balkon" },
                    ].map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, placement: p.value })}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                          formData.placement === p.value
                            ? "bg-surface shadow-xs text-brand font-bold"
                            : "text-text-secondary hover:text-foreground"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: Raum (Location) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-primary">
                    {t("rooms", lang)} *
                  </label>
                  {addingLocation ? (
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={newLocationName}
                        onChange={(e) => setNewLocationName(e.target.value)}
                        placeholder={lang === "de" ? "Neuer Raum..." : "New Room..."}
                        className="flex-1 h-11 bg-surface border border-border-strong rounded-lg px-3.5 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all placeholder:text-text-muted"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleCreateLocationInline();
                          } else if (e.key === "Escape") {
                            setAddingLocation(false);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleCreateLocationInline}
                        disabled={savingLocation || !newLocationName.trim()}
                        className="h-11 px-3.5 rounded-lg bg-brand text-white hover:bg-brand-hover transition-colors shrink-0 flex items-center justify-center disabled:opacity-50 cursor-pointer shadow-xs"
                        title={t("add", lang)}
                      >
                        {savingLocation ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddingLocation(false)}
                        className="h-11 px-3 rounded-lg bg-surface-subtle border border-border-strong hover:bg-surface text-text-secondary transition-colors shrink-0 flex items-center justify-center cursor-pointer"
                        title={t("close", lang)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-1.5">
                      <select
                        required
                        className="flex-1 h-11 bg-surface border border-border-strong rounded-lg px-3.5 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all cursor-pointer"
                        value={formData.locationId}
                        onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                      >
                        <option value="" disabled>
                          {lang === "de" ? "Raum wählen..." : "Select Room..."}
                        </option>
                        {locations.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setAddingLocation(true)}
                        className="w-11 h-11 rounded-lg bg-surface-subtle border border-border-strong hover:border-brand hover:text-brand flex items-center justify-center text-text-secondary transition-all shrink-0 cursor-pointer"
                        title={lang === "de" ? "Neuen Raum anlegen" : "Add new room"}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Klassifizierung */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1 group relative">
                  <label className="text-xs font-bold text-text-primary">
                    {t("classification", lang)} *
                  </label>
                  <div className="relative flex items-center cursor-help">
                    <Info size={14} className="text-text-muted hover:text-brand transition-colors" />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 p-2 bg-neutral-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-50 text-center shadow-lg border border-neutral-800">
                      {t("classificationTooltip", lang)}
                    </div>
                  </div>
                </div>

                <div className="flex bg-surface-subtle p-1 rounded-lg w-full md:w-1/2 h-11 border border-border-strong">
                  {["Zierpflanze", "Nutzpflanze"].map((tVal) => (
                    <button
                      key={tVal}
                      type="button"
                      onClick={() => setFormData({ ...formData, plantType: tVal })}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        formData.plantType === tVal
                          ? "bg-surface shadow-xs text-brand font-bold"
                          : "text-text-secondary hover:text-foreground"
                      }`}
                    >
                      {tVal === "Zierpflanze" ? t("decorative", lang) : t("edibleHerbs", lang)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Care Intervals Box (Care Colors & Einheitliche Terminologie: Bekämpfen statt Prüfen) */}
            <div className="space-y-2 bg-surface-subtle/60 p-4 rounded-xl border border-border-hairline">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-primary">
                  {lang === "de" ? "Pflegeroutinen & Intervalle (in Tagen)" : "Care Routines & Intervals (in days)"}
                </span>
                <span className="text-[10px] text-text-muted">
                  {lang === "de" ? "Individuell anpassbar" : "Customizable"}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Water (Blue) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-care-water flex items-center gap-1">
                    <Droplet size={13} />
                    <span>{t("water", lang)} *</span>
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    className="w-full h-11 bg-surface border border-border-strong rounded-lg px-3 text-sm text-foreground outline-none focus:border-care-water focus:ring-2 focus:ring-care-water/20 tabular transition-all"
                    value={formData.waterInterval}
                    onChange={(e) => setFormData({ ...formData, waterInterval: parseInt(e.target.value) || 1 })}
                  />
                </div>

                {/* Fertilize (Amber) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-care-fertilizer flex items-center gap-1">
                    <FlaskConical size={13} />
                    <span>{t("fertilize", lang)}</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full h-11 bg-surface border border-border-strong rounded-lg px-3 text-sm text-foreground outline-none focus:border-care-fertilizer focus:ring-2 focus:ring-care-fertilizer/20 tabular transition-all placeholder:text-text-muted"
                    value={formData.fertilizerInterval}
                    onChange={(e) => setFormData({ ...formData, fertilizerInterval: e.target.value })}
                    placeholder={lang === "de" ? "z. B. 14" : "Opt."}
                  />
                </div>

                {/* Bug / Pest: Bekämpfen (Purple) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-care-bug flex items-center gap-1">
                    <BugOff size={13} />
                    <span>{lang === "de" ? "Bekämpfen" : "Pest"}</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full h-11 bg-surface border border-border-strong rounded-lg px-3 text-sm text-foreground outline-none focus:border-care-bug focus:ring-2 focus:ring-care-bug/20 tabular transition-all placeholder:text-text-muted"
                    value={formData.bugInterval}
                    onChange={(e) => setFormData({ ...formData, bugInterval: e.target.value })}
                    placeholder={lang === "de" ? "z. B. 30" : "Opt."}
                  />
                </div>

                {/* Fungus (Teal) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-care-fungus flex items-center gap-1">
                    <SprayCan size={13} />
                    <span>{lang === "de" ? "Pilzschutz" : "Fungus"}</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full h-11 bg-surface border border-border-strong rounded-lg px-3 text-sm text-foreground outline-none focus:border-care-fungus focus:ring-2 focus:ring-care-fungus/20 tabular transition-all placeholder:text-text-muted"
                    value={formData.fungusInterval}
                    onChange={(e) => setFormData({ ...formData, fungusInterval: e.target.value })}
                    placeholder={lang === "de" ? "z. B. 30" : "Opt."}
                  />
                </div>
              </div>
            </div>

            {/* 5. Persönliche Notizen & Schnitt */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-primary">
                {t("notes", lang)}
              </label>
              <textarea
                className="w-full bg-surface border border-border-strong rounded-lg px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all min-h-[90px] placeholder:text-text-muted"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder={
                  lang === "de"
                    ? "Mag helles indirektes Licht, im Frühjahr kappen..."
                    : "Likes bright indirect light, prune in spring..."
                }
              />
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border-hairline bg-surface flex justify-end items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="h-11 px-5 rounded-lg font-semibold text-xs text-text-secondary hover:text-foreground hover:bg-surface-subtle transition-colors cursor-pointer"
          >
            {t("close", lang)}
          </button>
          <button
            form="plant-form"
            type="submit"
            disabled={loading}
            className="h-11 px-6 rounded-lg font-bold text-xs bg-brand text-white hover:bg-brand-hover shadow-xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : t("save", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
