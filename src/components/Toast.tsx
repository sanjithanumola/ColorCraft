import React from 'react';
import { Check, Copy } from 'lucide-react';

interface ToastProps {
  message: string | null;
  colorPreview?: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message, colorPreview }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700/80 text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      {colorPreview ? (
        <span
          className="w-4 h-4 rounded-full border border-white/20 shadow-inner shrink-0"
          style={{ backgroundColor: colorPreview }}
        />
      ) : (
        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
      )}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};
