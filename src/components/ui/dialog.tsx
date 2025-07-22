import React from "react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 min-w-[320px] max-w-full max-h-screen overflow-auto relative">
        <button
          className="absolute top-2 right-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          onClick={() => onOpenChange(false)}
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
