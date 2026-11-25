"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Leaf, ArrowRight, Check } from "lucide-react";
import { t } from "@/lib/i18n";

export default function OnboardingModal() {
  const [show, setShow] = useState(false);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data?.language) setLang(data.language);
        if (data && data.onboardingSeen === false) {
          setShow(true);
        }
      })
      .catch(console.error);
  }, []);

  const handleDismiss = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    if (!show) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show, handleDismiss]);

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      onClick={handleDismiss}
      className="fixed inset-0 z-[100] bg-black/65 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-2xl md:rounded-3xl max-w-md w-full shadow-2xl border border-border-hairline card-elevation overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="bg-brand text-white p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-15 transform translate-x-4 -translate-y-4 pointer-events-none">
            <Leaf size={100} />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-3 shadow-xs">
              <Leaf size={28} />
            </div>
            <h2 id="onboarding-title" className="text-2xl font-extrabold mb-1">{t("onboardingTitle", lang)}</h2>
            <p className="text-white/80 text-sm">{t("onboardingSubtitle", lang)}</p>
          </div>
        </div>
        
        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-base text-foreground">{t("onboardingGettingStarted", lang)}</h3>
            <div className="flex gap-3 items-start">
              <div className="bg-brand-subtle text-brand p-1.5 rounded-lg mt-0.5 shrink-0">
                <Check size={14} />
              </div>
              <div>
                <p className="font-semibold text-xs text-foreground">{t("onboardingStep1Title", lang)}</p>
                <p className="text-xs text-text-muted leading-relaxed mt-0.5">{t("onboardingStep1Desc", lang)}</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="bg-brand-subtle text-brand p-1.5 rounded-lg mt-0.5 shrink-0">
                <Check size={14} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-xs text-foreground">{t("onboardingStep2Title", lang)}</h4>
                <p className="text-xs text-text-muted leading-relaxed mt-0.5">{t("onboardingStep2Desc", lang)}</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="bg-brand-subtle text-brand p-1.5 rounded-lg mt-0.5 shrink-0">
                <Check size={14} />
              </div>
              <div>
                <p className="font-semibold text-xs text-foreground">{t("onboardingStep3Title", lang)}</p>
                <p className="text-xs text-text-muted leading-relaxed mt-0.5">{t("onboardingStep3Desc", lang)}</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border-hairline flex flex-col gap-2">
            <Link 
              href="/settings" 
              onClick={handleDismiss}
              className="bg-brand hover:bg-brand-hover text-white font-bold h-11 rounded-lg flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all w-full text-xs"
            >
               {t("onboardingGoToSettings", lang)} <ArrowRight size={16} />
            </Link>
            <button 
              onClick={handleDismiss} 
              className="py-2 font-medium text-xs text-text-muted hover:text-foreground transition-colors w-full cursor-pointer"
            >
              {t("onboardingDismiss", lang)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
