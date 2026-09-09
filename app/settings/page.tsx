"use client";

import { useEffect, useState, useRef } from "react";
import { Save, Plus, Trash2, Loader2, Settings as SettingsIcon, Check, Edit2, X, CheckCircle2, Database, Download, Upload, Snowflake, LogOut, ShieldCheck } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import { t } from "@/lib/i18n";

type Location = { id: string; name: string };

export default function SettingsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [newLocName, setNewLocName] = useState("");
  
  const [lang, setLang] = useState("en");
  const [gridCols, setGridCols] = useState(4);
  const [customTitle, setCustomTitle] = useState("");
  const [winterDormancy, setWinterDormancy] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Backup & Restore state
  const [restoringBackup, setRestoringBackup] = useState(false);
  const backupFileInputRef = useRef<HTMLInputElement | null>(null);

  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [locName, setLocName] = useState("");
  const [weatherExpert, setWeatherExpert] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchingLoc, setSearchingLoc] = useState(false);

  const [loading, setLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);

  const [resettingStats, setResettingStats] = useState(false);
  const [resettingBadges, setResettingBadges] = useState(false);

  // Edit location state
  const [editLocId, setEditLocId] = useState<string | null>(null);
  const [editLocName, setEditLocName] = useState("");

  // UI feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string | null;
    isDestructive?: boolean;
    variant?: "destructive" | "warning" | "info" | "success";
    onConfirm: () => void;
  } | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [confRes, locRes, authRes] = await Promise.all([
        fetch("/api/settings"),
        fetch("/api/locations"),
        fetch("/api/auth/status").catch(() => null),
      ]);
      const conf = await confRes.json();
      const loc = await locRes.json();
      if (authRes && authRes.ok) {
        const authData = await authRes.json();
        setAuthRequired(Boolean(authData.authRequired));
      }
      
      if (conf) {
        if (conf.language) setLang(conf.language);
        if (conf.gridColumns) setGridCols(conf.gridColumns);
        if (conf.dashboardTitle) setCustomTitle(conf.dashboardTitle);
        if (conf.latitude !== null) setLat(conf.latitude.toString());
        if (conf.longitude !== null) setLon(conf.longitude.toString());
        if (conf.locationName) setLocName(conf.locationName);
        if (conf.winterDormancyEnabled !== undefined) setWinterDormancy(conf.winterDormancyEnabled);
      }
      setLocations(loc);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      setLoggingOut(false);
    }
  };

  const handleSaveConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingConfig(true);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          language: lang, 
          gridColumns: gridCols, 
          dashboardTitle: customTitle,
          latitude: lat ? parseFloat(lat) : null,
          longitude: lon ? parseFloat(lon) : null,
          locationName: locName || null,
          winterDormancyEnabled: winterDormancy,
        })
      });
      showNotification(lang === 'de' ? "Einstellungen gespeichert!" : "Settings saved!");
    } catch (e) {
      console.error(e);
    } finally {
      setSavingConfig(false);
    }
  };

  const handleRestoreBackupFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    setConfirmModal({
      isOpen: true,
      title: t('restoreConfirmTitle', lang),
      description: t('restoreConfirmDesc', lang),
      confirmText: t('restoreBackup', lang),
      cancelText: lang === 'de' ? "Abbrechen" : "Cancel",
      isDestructive: true,
      variant: "destructive",
      onConfirm: async () => {
        setConfirmModal(null);
        setRestoringBackup(true);
        try {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/backup/import", {
            method: "POST",
            body: formData,
          });
          const result = await res.json();
          if (res.ok && result.success) {
            showNotification(t('restoreSuccess', lang));
            fetchData();
          } else {
            showNotification(result.error || "Failed to restore backup");
          }
        } catch (err) {
          console.error("Restore error", err);
          showNotification("Error during restore");
        } finally {
          setRestoringBackup(false);
          if (backupFileInputRef.current) backupFileInputRef.current.value = "";
        }
      }
    });
  };

  const handleSearchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchingLoc(true);
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=1`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const best = data.results[0];
        setLat(best.latitude.toString());
        setLon(best.longitude.toString());
        setLocName(`${best.name}, ${best.country || ""}`);
        showNotification(lang === 'de' ? `Standort gefunden: ${best.name}` : `Location found: ${best.name}`);
      } else {
        setConfirmModal({
          isOpen: true,
          title: lang === 'de' ? "Ort nicht gefunden" : "Location not found",
          description: t('locationNotFound', lang),
          confirmText: "OK",
          cancelText: null,
          variant: "warning",
          onConfirm: () => setConfirmModal(null),
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearchingLoc(false);
    }
  };

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim()) return;
    try {
      await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newLocName.trim() })
      });
      setNewLocName("");
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveLocationEdit = async (id: string) => {
    if (!editLocName.trim()) return;
    try {
      await fetch(`/api/locations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editLocName.trim() })
      });
      setEditLocId(null);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteLocation = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: lang === 'de' ? "Standort löschen?" : "Delete location?",
      description: t('deleteLocationWarning', lang),
      confirmText: lang === 'de' ? "Löschen" : "Delete",
      cancelText: lang === 'de' ? "Abbrechen" : "Cancel",
      isDestructive: true,
      variant: "destructive",
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await fetch(`/api/locations/${id}`, { method: "DELETE" });
          fetchData();
        } catch (e) {
          console.error(e);
        }
      }
    });
  };

  const handleResetStats = () => {
    setConfirmModal({
      isOpen: true,
      title: lang === 'de' ? "Statistiken zurücksetzen?" : "Reset statistics?",
      description: t('resetStatsWarning', lang),
      confirmText: lang === 'de' ? "Zurücksetzen" : "Reset",
      cancelText: lang === 'de' ? "Abbrechen" : "Cancel",
      isDestructive: true,
      variant: "destructive",
      onConfirm: async () => {
        setConfirmModal(null);
        setResettingStats(true);
        try {
          await fetch("/api/statistics/reset-stats", { method: "POST" });
          showNotification(t('statsResetSuccess', lang));
          fetchData();
        } catch (e) {
          console.error(e);
        } finally {
          setResettingStats(false);
        }
      }
    });
  };

  const handleResetBadges = () => {
    setConfirmModal({
      isOpen: true,
      title: lang === 'de' ? "Erfolge zurücksetzen?" : "Reset badges?",
      description: t('resetBadgesWarning', lang),
      confirmText: lang === 'de' ? "Zurücksetzen" : "Reset",
      cancelText: lang === 'de' ? "Abbrechen" : "Cancel",
      isDestructive: true,
      variant: "destructive",
      onConfirm: async () => {
        setConfirmModal(null);
        setResettingBadges(true);
        try {
          await fetch("/api/statistics/reset-badges", { method: "POST" });
          showNotification(t('badgesResetSuccess', lang));
          fetchData();
        } catch (e) {
          console.error(e);
        } finally {
          setResettingBadges(false);
        }
      }
    });
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-brand" size={40} /></div>;

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <div className="mb-8 border-b border-border-subtle pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2.5 text-foreground">
          <SettingsIcon size={28} className="text-brand" />
          {t('settings', lang)}
        </h1>
        <p className="text-sm text-surfaceForeground/70 mt-1">{t('configureApp', lang)}</p>
      </div>

      <div className="space-y-8">
        
        {/* Appearance & General */}
        <section className="bg-surface p-6 md:p-8 rounded-2xl md:rounded-3xl card-elevation border border-border-hairline">
          <h2 className="text-xl font-bold text-foreground mb-4">{t('generalSettings', lang)}</h2>
          
          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">{t('language', lang)}</label>
                <select 
                  className="w-full h-11 bg-surface-subtle border border-border-hairline rounded-lg px-3.5 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all cursor-pointer"
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                </select>
                <p className="text-[11px] text-text-muted mt-1">{t('toAddMoreEdit', lang)} <code className="bg-surface-elevated px-1.5 py-0.5 rounded border border-border-hairline">lib/i18n.ts</code>.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">{t('gridColumns', lang)}</label>
                <select 
                  className="w-full h-11 bg-surface-subtle border border-border-hairline rounded-lg px-3.5 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all cursor-pointer"
                  value={gridCols}
                  onChange={(e) => setGridCols(parseInt(e.target.value))}
                >
                  <option value={4}>4 {t('columnsDefault', lang)}</option>
                  <option value={5}>5 {t('columns', lang)}</option>
                  <option value={6}>6 {t('columns', lang)}</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">{t('customTitle', lang)}</label>
              <input 
                type="text" 
                value={customTitle} 
                onChange={(e) => setCustomTitle(e.target.value)} 
                placeholder={t('myJungle', lang)}
                className="w-full h-11 bg-surface-subtle border border-border-hairline rounded-lg px-3.5 text-sm text-foreground placeholder:text-text-muted outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
              />
            </div>

            {/* Winter Dormancy Toggle */}
            <div className="pt-3 border-t border-border-hairline flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-0.5">
                  <Snowflake size={15} className="text-sky-600 dark:text-sky-400" />
                  <span>{t('winterDormancyTitle', lang)}</span>
                </div>
                <p className="text-[11px] text-text-muted max-w-md leading-relaxed">
                  {t('winterDormancyDesc', lang)}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={winterDormancy}
                  onChange={(e) => setWinterDormancy(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-elevated border border-border-strong peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
              </label>
            </div>

            <button 
              type="submit"
              disabled={savingConfig}
              className="bg-brand text-white px-6 py-2.5 rounded-lg font-bold text-xs hover:bg-brand-hover shadow-xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              {savingConfig ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {t('save', lang)}
            </button>
          </form>
        </section>

        {/* Weather Location */}
        <section className="bg-surface p-6 md:p-8 rounded-2xl md:rounded-3xl card-elevation border border-border-hairline">
          <h2 className="text-xl font-bold text-foreground mb-1">{t('weatherLocation', lang)}</h2>
          <p className="text-xs text-text-muted mb-6">{t('weatherDesc', lang)}</p>

          <div className="space-y-5">
            {!weatherExpert ? (
              <form onSubmit={handleSearchLocation} className="space-y-2">
                <label className="text-xs font-bold text-foreground">{t('cityZip', lang)}</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Berlin, 10115"
                    className="flex-1 h-11 bg-surface-subtle border border-border-hairline rounded-lg px-3.5 text-sm text-foreground placeholder:text-text-muted outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={searchingLoc}
                    className="bg-surface-elevated hover:bg-brand hover:text-white border border-border-hairline px-5 py-2.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-2 text-foreground cursor-pointer shadow-xs"
                  >
                    {searchingLoc ? <Loader2 size={16} className="animate-spin" /> : t('search', lang)}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">{t('latitude', lang)}</label>
                  <input
                    type="number"
                    step="any"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="w-full h-11 bg-surface-subtle border border-border-hairline rounded-lg px-3.5 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all tabular"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">{t('longitude', lang)}</label>
                  <input
                    type="number"
                    step="any"
                    value={lon}
                    onChange={(e) => setLon(e.target.value)}
                    className="w-full h-11 bg-surface-subtle border border-border-hairline rounded-lg px-3.5 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all tabular"
                  />
                </div>
              </div>
            )}

            {locName && (
              <div className="bg-brand-subtle text-brand p-3 rounded-xl flex items-center justify-between text-xs font-semibold border border-brand-border/40">
                <span>{locName} ({lat}, {lon})</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button onClick={() => setWeatherExpert(!weatherExpert)} className="text-xs text-text-muted hover:text-brand underline cursor-pointer">
                {weatherExpert ? t('useSimpleSearch', lang) : t('expertMode', lang)}
              </button>
              <button 
                onClick={handleSaveConfig}
                disabled={savingConfig}
                className="bg-brand text-white px-6 py-2.5 rounded-lg font-bold text-xs hover:bg-brand-hover shadow-xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                {savingConfig ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {t('save', lang)}
              </button>
            </div>
          </div>
        </section>

        {/* Locations */}
        <section className="bg-surface p-6 md:p-8 rounded-2xl md:rounded-3xl card-elevation border border-border-hairline">
          <h2 className="text-xl font-bold text-foreground mb-1">{t('locationsRooms', lang)}</h2>
          <p className="text-xs text-text-muted mb-6">{t('manageAreas', lang)}</p>
          
          <form onSubmit={handleAddLocation} className="flex gap-2 mb-6">
            <input 
              type="text" 
              value={newLocName} 
              onChange={e => setNewLocName(e.target.value)} 
              placeholder="e.g. Living Room, Office..."
              className="flex-1 h-11 bg-surface border border-border-strong rounded-lg px-3.5 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all placeholder:text-text-muted"
            />
            <button
              type="submit"
              className="h-11 px-5 rounded-lg bg-brand text-white hover:bg-brand-hover transition-colors font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus size={16} /> {t('add', lang)}
            </button>
          </form>

          <div className="space-y-2.5">
            {locations.length === 0 ? (
              <p className="text-xs text-text-muted italic py-6 text-center border border-dashed border-border-strong rounded-xl">{t('noLocations', lang)}</p>
            ) : (
              locations.map(loc => (
                <div key={loc.id} className="flex items-center justify-between bg-surface-subtle p-3 px-4 rounded-xl border border-border-hairline">
                  {editLocId === loc.id ? (
                    <div className="flex gap-2 flex-1 mr-4">
                      <input 
                        type="text" 
                        value={editLocName} 
                        onChange={(e) => setEditLocName(e.target.value)}
                        autoFocus
                        className="flex-1 bg-surface border border-border-strong rounded-lg px-2.5 py-1 text-xs outline-none focus:border-brand"
                      />
                      <button onClick={() => handleSaveLocationEdit(loc.id)} className="text-brand p-1 hover:bg-brand-subtle rounded cursor-pointer"><Check size={18}/></button>
                      <button onClick={() => setEditLocId(null)} className="text-text-muted p-1 hover:bg-surface-elevated rounded cursor-pointer"><X size={18}/></button>
                    </div>
                  ) : (
                    <span className="font-semibold text-sm text-foreground">{loc.name}</span>
                  )}
                  
                  {editLocId !== loc.id && (
                    <div className="flex gap-1">
                      <button onClick={() => { setEditLocId(loc.id); setEditLocName(loc.name); }} className="text-text-muted hover:text-brand p-2 rounded-lg hover:bg-brand-subtle transition-colors cursor-pointer">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => handleDeleteLocation(loc.id)} className="text-urgency-overdue hover:text-red-600 p-2 rounded-lg hover:bg-urgency-overdue/10 transition-colors cursor-pointer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Backup & Restore */}
        <section className="bg-surface p-6 md:p-8 rounded-2xl md:rounded-3xl card-elevation border border-border-hairline">
          <div className="flex items-center gap-2.5 mb-1 text-brand">
            <Database size={22} />
            <h2 className="text-xl font-bold text-foreground">{t('backupAndRestore', lang)}</h2>
          </div>
          <p className="text-xs text-text-muted mb-6">
            {t('backupDesc', lang)}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Download Backup */}
            <div className="p-5 bg-surface-subtle border border-border-hairline rounded-xl flex flex-col justify-between gap-4">
              <div>
                <h3 className="font-bold text-xs text-foreground mb-1 flex items-center gap-1.5">
                  <Download size={15} className="text-brand" />
                  <span>{t('downloadBackup', lang)}</span>
                </h3>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  {lang === 'de' ? 'Erstellt ein komprimiertes ZIP mit allen Pflanzen, Räumen, Historien und deinen hochgeladenen Fotos.' : 'Creates a compressed ZIP archive containing all plants, locations, history logs, and uploaded photos.'}
                </p>
              </div>
              <a
                href="/api/backup/export"
                download
                className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover text-white px-4 py-2.5 rounded-lg text-xs font-bold shadow-xs transition-all active:scale-95"
              >
                <Download size={15} />
                <span>{t('downloadBackup', lang)}</span>
              </a>
            </div>

            {/* Restore Backup */}
            <div className="p-5 bg-surface-subtle border border-border-hairline rounded-xl flex flex-col justify-between gap-4">
              <div>
                <h3 className="font-bold text-xs text-foreground mb-1 flex items-center gap-1.5">
                  <Upload size={15} className="text-amber-600 dark:text-amber-400" />
                  <span>{t('restoreBackup', lang)}</span>
                </h3>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  {lang === 'de' ? 'Stelle einen früheren Stand aus einer zuvor erstellten ZIP-Datei wieder her.' : 'Restore a previous state from a previously generated ZIP backup.'}
                </p>
              </div>
              <div>
                <label className={`inline-flex items-center justify-center gap-2 w-full bg-surface hover:bg-surface-elevated border border-border-hairline text-foreground px-4 py-2.5 rounded-lg text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer ${restoringBackup ? 'opacity-50 pointer-events-none' : ''}`}>
                  {restoringBackup ? <Loader2 size={15} className="animate-spin text-brand" /> : <Upload size={15} />}
                  <span>{restoringBackup ? t('restoring', lang) : t('selectBackupZip', lang)}</span>
                  <input
                    ref={backupFileInputRef}
                    type="file"
                    accept=".zip,application/zip"
                    disabled={restoringBackup}
                    onChange={handleRestoreBackupFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Session */}
        {authRequired && (
          <section className="bg-surface p-6 md:p-8 rounded-2xl md:rounded-3xl card-elevation border border-border-hairline">
            <div className="flex items-center gap-2.5 mb-1">
              <ShieldCheck className="text-brand" size={22} />
              <h2 className="text-xl font-bold text-foreground">
                {lang === "de" ? "Sicherheit & Sitzung" : "Security & Session"}
              </h2>
            </div>
            <p className="text-xs text-text-muted mb-6">
              {lang === "de"
                ? "PlantStack ist durch ein API-Secret geschützt. Sie sind aktuell authentifiziert."
                : "PlantStack is protected with an API secret. You are currently authenticated."}
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border-hairline bg-surface-subtle rounded-xl gap-4">
              <div>
                <h3 className="font-bold text-xs text-foreground mb-0.5">
                  {lang === "de" ? "Aktive Sitzung" : "Active Session"}
                </h3>
                <p className="text-[11px] text-text-muted max-w-md">
                  {lang === "de"
                    ? "Beendet Ihre Browser-Sitzung und leitet zum Sperrbildschirm weiter."
                    : "Terminates your browser session and redirects to the lock screen."}
                </p>
              </div>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="bg-surface-elevated hover:bg-surface border border-border-hairline text-foreground px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                {loggingOut ? <Loader2 size={14} className="animate-spin text-brand" /> : <LogOut size={14} />}
                <span>{lang === "de" ? "Abmelden" : "Log out"}</span>
              </button>
            </div>
          </section>
        )}

        {/* Privacy & Data */}
        <section className="bg-surface p-6 md:p-8 rounded-2xl md:rounded-3xl card-elevation border border-urgency-overdue/20">
          <h2 className="text-xl font-bold mb-1 text-urgency-overdue">{t('privacyData', lang)}</h2>
          <p className="text-xs text-text-muted mb-6">
            {t('warningCannotUndo', lang)}
          </p>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-urgency-overdue/20 bg-urgency-overdue/5 rounded-xl gap-4">
              <div>
                <h3 className="font-bold text-xs text-urgency-overdue mb-0.5">{t('resetStatsHistory', lang)}</h3>
                <p className="text-[11px] text-text-muted max-w-md">
                  {t('resetStatsHistoryDesc', lang)}
                </p>
              </div>
              <button 
                onClick={handleResetStats}
                disabled={resettingStats}
                className="bg-urgency-overdue hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                {resettingStats ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                {t('resetStatsBtn', lang)}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-urgency-overdue/20 bg-urgency-overdue/5 rounded-xl gap-4">
              <div>
                <h3 className="font-bold text-xs text-urgency-overdue mb-0.5">{t('resetAllBadges', lang)}</h3>
                <p className="text-[11px] text-text-muted max-w-md">
                  {t('resetAllBadgesDesc', lang)}
                </p>
              </div>
              <button 
                onClick={handleResetBadges}
                disabled={resettingBadges}
                className="bg-urgency-overdue hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                {resettingBadges ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                {t('resetBadgesBtn', lang)}
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-surface/95 border border-border-hairline text-foreground px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-brand shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-text-muted hover:text-foreground p-0.5 ml-1 cursor-pointer"
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
