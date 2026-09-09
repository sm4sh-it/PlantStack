"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Leaf, ArrowRight, Check } from "lucide-react";

export default function OnboardingModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Fetch settings on load
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data && data.onboardingSeen === false) {
          setShow(true);
        }
      })
      .catch(console.error);
  }, []);

  const handleDismiss = async () => {
    setShow(false);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onboardingSeen: true })
      });
    } catch (e) {
      console.error("Failed to dismiss onboarding", e);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl md:rounded-3xl max-w-md w-full shadow-2xl border border-border-hairline card-elevation overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-brand text-white p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-15 transform translate-x-4 -translate-y-4 pointer-events-none">
            <Leaf size={100} />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-xs rounded-xl flex items-center justify-center mb-3 shadow-xs">
              <Leaf size={28} />
            </div>
            <h2 className="text-2xl font-extrabold mb-1">Welcome to PlantStack</h2>
            <p className="text-white/80 text-sm">Manage your indoor jungle with ease.</p>
          </div>
        </div>
        
        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-base text-foreground">Getting Started:</h3>
            <div className="flex gap-3 items-start">
              <div className="bg-brand-subtle text-brand p-1.5 rounded-lg mt-0.5 shrink-0">
                <Check size={14} />
              </div>
              <div>
                <p className="font-semibold text-xs text-foreground">1. Create Locations</p>
                <p className="text-xs text-text-muted leading-relaxed mt-0.5">Go to Settings and add your rooms (e.g. Living Room, Bedroom) to organize your plants properly.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="bg-brand-subtle text-brand p-1.5 rounded-lg mt-0.5 shrink-0">
                <Check size={14} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-xs text-foreground">2. Open Plantbook Integration</h4>
                <p className="text-xs text-text-muted leading-relaxed mt-0.5">Add your Open Plantbook API credentials in the .env file to get care instructions automatically when adding a plant.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="bg-brand-subtle text-brand p-1.5 rounded-lg mt-0.5 shrink-0">
                <Check size={14} />
              </div>
              <div>
                <p className="font-semibold text-xs text-foreground">3. Add Plants</p>
                <p className="text-xs text-text-muted leading-relaxed mt-0.5">Click &quot;Add Plant&quot; on the Dashboard and assign them to your new rooms!</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border-hairline flex flex-col gap-2">
            <Link 
              href="/settings" 
              onClick={handleDismiss}
              className="bg-brand hover:bg-brand-hover text-white font-bold h-11 rounded-lg flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all w-full text-xs"
            >
               Go to Settings <ArrowRight size={16} />
            </Link>
            <button 
              onClick={handleDismiss} 
              className="py-2 font-medium text-xs text-text-muted hover:text-foreground transition-colors w-full cursor-pointer"
            >
              Don&apos;t show this again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
