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
      <div className="bg-background rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-brand text-white p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4">
            <Leaf size={100} />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <Leaf size={32} />
            </div>
            <h2 className="text-3xl font-bold mb-2">Welcome to PlantStack</h2>
            <p className="text-white/80">Manage your indoor jungle.</p>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Getting Started:</h3>
            <div className="flex gap-3 items-start">
              <div className="bg-brand/10 text-brand p-2 rounded-full mt-1"><Check size={16} /></div>
              <div>
                <p className="font-semibold">1. Create Locations</p>
                <p className="text-sm text-surface-foreground/70">Go to Settings and add your rooms (e.g. Living Room, Bedroom) to organize your plants properly.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="bg-brand/10 text-brand p-2 rounded-full mt-1"><Check size={16} /></div>
              <div>
                <p className="font-semibold">2. Setup Plant Database (Optional)</p>
                <p className="text-sm text-surface-foreground/70">Add your Perenual API key in the Settings to get care instructions automatically when adding a plant.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="bg-brand/10 text-brand p-2 rounded-full mt-1"><Check size={16} /></div>
              <div>
                <p className="font-semibold">3. Add Plants</p>
                <p className="text-sm text-surface-foreground/70">Click &quot;Add Plant&quot; on the Dashboard and assign them to your new rooms!</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-black/5 dark:border-white/5 flex flex-col gap-2">
            <Link 
              href="/settings" 
              onClick={handleDismiss}
              className="bg-brand text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors w-full"
            >
               Go to Settings <ArrowRight size={18} />
            </Link>
            <button 
              onClick={handleDismiss} 
              className="py-3 font-medium text-surface-foreground/60 hover:text-foreground transition-colors w-full"
            >
              Don&apos;t show this again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
