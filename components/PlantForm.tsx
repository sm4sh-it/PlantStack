"use client";

import { useState, useEffect } from "react";
import { Plant, Location } from "@prisma/client";
import { X, Upload, Search, Loader2, Check } from "lucide-react";
import Image from "next/image";
import { t } from "@/lib/i18n";

type PlantFormProps = {
  initialData?: Plant & { location?: Location };
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
    notes: initialData?.notes || "",
    imagePath: initialData?.imagePath || "",
  });

  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imagePath ? `/api/images/${initialData.imagePath}` : null);
  
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/locations").then(res => res.json()).then(data => {
      setLocations(data);
      if (!formData.locationId && data.length > 0) {
        setFormData(prev => ({ ...prev, locationId: data[0].id }));
      }
    }).catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchOpenPlantbook = async () => {
    if (!formData.searchAlias) return;
    setSearching(true);
    setSearchResults([]);
    try {
      const res = await fetch(`/api/openplantbook/search?q=${encodeURIComponent(formData.searchAlias)}`);
      const { results } = await res.json();
      if (results && results.length > 0) {
        setSearchResults(results.slice(0, 5)); // show top 5
      } else {
        alert("No match found in Open Plantbook.");
      }
    } catch (e) {
      console.error(e);
      alert("Error searching Open Plantbook. Are the credentials configured in .env?");
    } finally {
      setSearching(false);
    }
  };

  const handleSelectResult = async (plantInfo: any) => {
    setSearching(true);
    setSearchResults([]);
    try {
      const res = await fetch(`/api/openplantbook/detail?pid=${encodeURIComponent(plantInfo.pid)}`);
      const details = await res.json();
      
      let waterDays = 7;
      if (details.min_soil_moist > 40) waterDays = 3;
      else if (details.min_soil_moist < 15) waterDays = 14;

      const sunlightText = `${details.min_light_lux || 0} - ${details.max_light_lux || 0} Lux | ${t('temperature', lang)}: ${details.min_temp || 0} - ${details.max_temp || 0} °C`;
      const wateringText = `${t('soilMoisture', lang)}: ${details.min_soil_moist || 0} - ${details.max_soil_moist || 0}% | ${t('humidity', lang)}: ${details.min_env_humid || 0} - ${details.max_env_humid || 0}%`;

      setFormData(prev => ({
        ...prev,
        searchAlias: details.alias || plantInfo.alias || prev.searchAlias,
        scientificName: details.display_pid || plantInfo.display_pid || prev.scientificName,
        wateringInfo: wateringText,
        sunlightInfo: sunlightText,
        waterInterval: prev.waterInterval === 7 ? waterDays : prev.waterInterval,
      }));
    } catch (e) {
      console.error(e);
      alert("Failed to fetch plant details");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.locationId) {
      alert("Please select a location first! Go to Settings if you haven't created any.");
      return;
    }
    
    setLoading(true);

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
      alias: formData.searchAlias, // save the search alias
      imagePath: uploadedImagePath 
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
      alert("Failed to save plant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-surface">
          <h2 className="text-xl font-bold">{initialData ? t('edit', lang) + " Plant" : t('addPlant', lang)}</h2>
          <button onClick={onCancel} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"><X size={20} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <form id="plant-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center justify-center mb-6">
              <label className="cursor-pointer group relative w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-brand hover:border-solid transition-all bg-surface flex items-center justify-center">
                {previewUrl ? (
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-brand/50 group-hover:text-brand">
                    <Upload size={24} />
                    <span className="text-xs font-medium mt-1">Upload</span>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Name *</label>
                <input required type="text" className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 outline-none focus:border-brand" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Monstera Deliciosa" />
              </div>
              
              <div className="space-y-1 relative">
                <label className="text-sm font-medium">{t('searchAlias', lang)}</label>
                <div className="flex gap-2">
                  <input type="text" className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 outline-none focus:border-brand" value={formData.searchAlias} onChange={e => setFormData({...formData, searchAlias: e.target.value})} placeholder="e.g. Monstera" />
                  <button type="button" onClick={handleSearchOpenPlantbook} disabled={searching} className="bg-surface-foreground/10 p-2 rounded-lg hover:bg-brand hover:text-white transition-colors shrink-0" title="Autofill from Database">
                    {searching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                  </button>
                </div>
                
                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-12 mt-1 bg-surface border border-black/10 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                    {searchResults.map((res: any) => (
                      <button 
                        key={res.pid} 
                        type="button"
                        onClick={() => handleSelectResult(res)}
                        className="w-full text-left px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 border-b border-black/5 dark:border-white/5 last:border-0 flex flex-col gap-1 transition-colors"
                      >
                        <span className="font-bold text-sm">{res.alias || res.display_pid}</span>
                        <span className="text-xs text-surface-foreground/60 italic">{res.display_pid}</span>
                      </button>
                    ))}
                    <button type="button" onClick={() => setSearchResults([])} className="w-full text-center p-2 text-xs text-surface-foreground/50 hover:bg-black/5 dark:hover:bg-white/5">Close</button>
                  </div>
                )}

                {formData.scientificName && (
                  <p className="text-xs text-brand italic mt-1 px-1 flex items-center gap-1"><Check size={12}/> {formData.scientificName}</p>
                )}
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium">Location *</label>
                <select 
                  required 
                  className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 outline-none focus:border-brand appearance-none" 
                  value={formData.locationId} 
                  onChange={e => setFormData({...formData, locationId: e.target.value})}
                >
                  <option value="" disabled>Select Location...</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 bg-surface p-4 rounded-xl border border-black/5 dark:border-white/5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-blue-600 dark:text-blue-400">Water (Days) *</label>
                <input required type="number" min="1" className="w-full bg-background border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 outline-none focus:border-brand" value={formData.waterInterval} onChange={e => setFormData({...formData, waterInterval: parseInt(e.target.value)})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-amber-600 dark:text-amber-400">Fertilize (Days)</label>
                <input type="number" min="1" className="w-full bg-background border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 outline-none focus:border-brand" value={formData.fertilizerInterval} onChange={e => setFormData({...formData, fertilizerInterval: e.target.value})} placeholder="Opt." />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-purple-600 dark:text-purple-400">Anti-Bug (Days)</label>
                <input type="number" min="1" className="w-full bg-background border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 outline-none focus:border-brand" value={formData.bugInterval} onChange={e => setFormData({...formData, bugInterval: e.target.value})} placeholder="Opt." />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-teal-600 dark:text-teal-400">Anti-Fungus</label>
                <input type="number" min="1" className="w-full bg-background border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 outline-none focus:border-brand" value={formData.fungusInterval} onChange={e => setFormData({...formData, fungusInterval: e.target.value})} placeholder="Opt." />
              </div>
            </div>

            <div className="space-y-1 mt-4">
              <label className="text-sm font-medium">{t('notes', lang)}</label>
              <textarea className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 outline-none focus:border-brand min-h-[80px]" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Likes bright indirect light..." />
            </div>

          </form>
        </div>
        
        <div className="p-4 border-t border-black/5 dark:border-white/5 bg-surface flex justify-end gap-3">
          <button onClick={onCancel} disabled={loading} className="px-5 py-2 rounded-lg font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors">{t('close', lang)}</button>
          <button form="plant-form" type="submit" disabled={loading} className="px-5 py-2 rounded-lg font-medium bg-brand text-white hover:bg-brand-dark transition-colors flex items-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : t('save', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
