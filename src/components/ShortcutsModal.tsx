import React from 'react';
import { X, Command, Sparkles } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Generate new palette (keeps locked colors)' },
    { key: 'Click Swatch', desc: 'Copy color HEX/RGB/HSL value' },
    { key: 'Lock Icon', desc: 'Lock color swatch from regenerating' },
    { key: 'Inspect Icon', desc: 'Open Color Inspector (tints, shades, CMYK)' },
    { key: 'Undo / Redo', desc: 'Navigate previous palette generations' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Command className="w-4 h-4 text-indigo-500" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Studio Guide & Shortcuts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs py-1.5">
              <span className="text-neutral-600 dark:text-neutral-300 font-medium">{s.desc}</span>
              <kbd className="px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-mono font-semibold">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 leading-relaxed">
          <span className="font-semibold text-neutral-900 dark:text-white block mb-1">
            About ColorCraft
          </span>
          All palettes, gradients, and contrast calculations run 100% locally in your browser. Collections are securely preserved using local storage.
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
