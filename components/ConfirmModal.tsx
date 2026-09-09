"use client";

import { AlertTriangle, HelpCircle, X } from "lucide-react";

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string | null;
  isDestructive?: boolean;
  variant?: "destructive" | "warning" | "info" | "success";
  onConfirm: () => void;
  onCancel?: () => void;
};

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = "Bestätigen",
  cancelText = "Abbrechen",
  isDestructive = false,
  variant,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const actualVariant = variant || (isDestructive ? "destructive" : "info");

  const getIcon = () => {
    switch (actualVariant) {
      case "destructive":
        return <AlertTriangle size={20} />;
      case "warning":
        return <AlertTriangle size={20} />;
      case "success":
        return <HelpCircle size={20} />;
      case "info":
      default:
        return <HelpCircle size={20} />;
    }
  };

  const getIconClasses = () => {
    switch (actualVariant) {
      case "destructive":
        return "bg-urgency-overdue/10 text-urgency-overdue border border-urgency-overdue/20";
      case "warning":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
      case "success":
        return "bg-brand-subtle text-brand border border-brand-border/40";
      case "info":
      default:
        return "bg-brand-subtle text-brand border border-brand-border/40";
    }
  };

  const getConfirmBtnClasses = () => {
    switch (actualVariant) {
      case "destructive":
        return "bg-urgency-overdue hover:bg-red-600";
      case "warning":
        return "bg-amber-600 hover:bg-amber-700";
      default:
        return "bg-brand hover:bg-brand-hover";
    }
  };

  const handleClose = onCancel || onConfirm;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-border-hairline card-elevation flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${getIconClasses()}`}
          >
            {getIcon()}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base text-foreground mb-1">{title}</h3>
            <p className="text-xs text-text-muted leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          {cancelText && (
            <button
              type="button"
              onClick={handleClose}
              className="h-10 px-4 rounded-lg text-xs font-semibold bg-surface-subtle hover:bg-surface-elevated text-text-secondary hover:text-foreground transition-colors cursor-pointer"
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            className={`h-10 px-4 rounded-lg text-xs font-bold text-white shadow-xs active:scale-95 transition-all cursor-pointer ${getConfirmBtnClasses()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
