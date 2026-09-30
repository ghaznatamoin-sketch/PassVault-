import React, { useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  confirmVariant?: "primary" | "danger";
  onConfirm?: () => void;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel = "Confirm",
  confirmVariant = "primary",
  onConfirm,
  isLoading = false,
  children,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-charcoal-900 border border-charcoal-700 p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {confirmVariant === "danger" && (
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-charcoal-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {children && <div className="text-sm text-slate-300">{children}</div>}

        <div className="flex items-center justify-end space-x-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          {onConfirm && (
            <Button variant={confirmVariant} onClick={onConfirm} isLoading={isLoading}>
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
