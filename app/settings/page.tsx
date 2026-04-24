"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Trash2, Loader2, Leaf, Settings as SettingsIcon, ExternalLink, Check, Edit2, X } from "lucide-react";
import { t } from "@/lib/i18n";

type Location = { id: string; name: string };

export default function SettingsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [newLocName, setNewLocName] = useState("");
  
  const [lang, setLang] = useState("en");
  const [gridCols, setGridCols] = useState(4);
  const [customTitle, setCustomTitle] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);

  // Edit location state
  const [editLocId, setEditLocId] = useState<string | null>(null);
  const [editLocName, setEditLocName] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [confRes, locRes] = await Promise.all([
        fetch("/api/settings"),
        fetch("/api/locations")
      ]);
      const conf = await confRes.json();
      const loc = await locRes.json();
      
      if (conf) {
        if (conf.language) setLang(conf.language);
        if (conf.gridColumns) setGridCols(conf.gridColumns);
        if (conf.dashboardTitle) setCustomTitle(conf.dashboardTitle);
      }
      setLocations(loc);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingConfig(true);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang, gridColumns: gridCols, dashboardTitle: customTitle })
      });
      alert(t('save', lang) + " OK!");
    } catch (e) {
      console.error(e);
    } finally {
      setSavingConfig(false);
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

  const handleDeleteLocation = async (id: string) => {
    if (!confirm("Are you sure? Plants in this location will be deleted due to constraints!")) return;
    try {
      await fetch(`/api/locations/${id}`, { method: "DELETE" });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-brand" size={40} /></div>;

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <div className="mb-8 border-b border-black/5 dark:border-white/5 pb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2"><SettingsIcon size={28} /> {t('settings', lang)}</h1>
        <p className="text-surface-foreground/70">{t('configureApp', lang)}</p>
      </div>

      <div className="space-y-8">
        
        {/* Appearance & General */}
        <section className="bg-surface p-6 rounded-3xl shadow-sm border border-black/5 dark:border-white/5">
          <h2 className="text-xl font-bold mb-4">General Settings</h2>
          
          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">{t('language', lang)}</label>
                <select 
                  className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 outline-none focus:border-brand"
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                </select>
                <p className="text-xs text-surface-foreground/50 mt-1">To add more, edit <code className="bg-black/5 px-1 rounded">lib/i18n.ts</code>.</p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">{t('gridColumns', lang)}</label>
                <select 
                  className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 outline-none focus:border-brand"
                  value={gridCols}
                  onChange={(e) => setGridCols(parseInt(e.target.value))}
                >
                  <option value={4}>4 Columns (Default)</option>
                  <option value={5}>5 Columns</option>
                  <option value={6}>6 Columns</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">{t('customTitle', lang)}</label>
              <input 
                type="text" 
                value={customTitle} 
                onChange={(e) => setCustomTitle(e.target.value)} 
                placeholder={t('myJungle', lang)}
                className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 outline-none focus:border-brand"
              />
            </div>

            <button 
              type="submit"
              disabled={savingConfig}
              className="bg-brand text-white px-6 py-2 rounded-xl font-medium hover:bg-brand-dark transition-colors flex items-center gap-2"
            >
              {savingConfig ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} {t('save', lang)}
            </button>
          </form>
        </section>

        {/* Locations */}
        <section className="bg-surface p-6 rounded-3xl shadow-sm border border-black/5 dark:border-white/5">
          <h2 className="text-xl font-bold mb-1">{t('locationsRooms', lang)}</h2>
          <p className="text-sm text-surface-foreground/70 mb-6">{t('manageAreas', lang)}</p>
          
          <form onSubmit={handleAddLocation} className="flex gap-2 mb-6">
            <input 
              type="text" 
              value={newLocName} 
              onChange={e => setNewLocName(e.target.value)} 
              placeholder="e.g. Living Room, Office..."
              className="flex-1 bg-background border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 outline-none focus:border-brand"
            />
            <button type="submit" className="bg-surface-foreground/10 hover:bg-brand hover:text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2">
              <Plus size={18} /> {t('add', lang)}
            </button>
          </form>

          <div className="space-y-2">
            {locations.length === 0 ? (
              <p className="text-sm text-surface-foreground/50 italic py-4 text-center border border-dashed border-black/10 dark:border-white/10 rounded-xl">{t('noLocations', lang)}</p>
            ) : (
              locations.map(loc => (
                <div key={loc.id} className="flex items-center justify-between bg-background p-3 px-4 rounded-xl border border-black/5 dark:border-white/5">
                  {editLocId === loc.id ? (
                    <div className="flex gap-2 flex-1 mr-4">
                      <input 
                        type="text" 
                        value={editLocName} 
                        onChange={(e) => setEditLocName(e.target.value)}
                        autoFocus
                        className="flex-1 bg-surface border border-black/10 rounded-lg px-2 py-1 text-sm outline-none focus:border-brand"
                      />
                      <button onClick={() => handleSaveLocationEdit(loc.id)} className="text-green-600 p-1 hover:bg-green-100 rounded"><Check size={18}/></button>
                      <button onClick={() => setEditLocId(null)} className="text-surface-foreground/50 p-1 hover:bg-surface-foreground/10 rounded"><X size={18}/></button>
                    </div>
                  ) : (
                    <span className="font-medium">{loc.name}</span>
                  )}
                  
                  {editLocId !== loc.id && (
                    <div className="flex gap-1">
                      <button onClick={() => { setEditLocId(loc.id); setEditLocName(loc.name); }} className="text-surface-foreground/50 hover:text-brand p-2 rounded-lg hover:bg-brand/10 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDeleteLocation(loc.id)} className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-500/10 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>


      </div>
    </div>
  );
}
