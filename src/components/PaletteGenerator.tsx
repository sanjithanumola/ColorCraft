import React, { useState, useEffect, useCallback } from 'react';
import {
  Lock,
  Unlock,
  Copy,
  Check,
  Sparkles,
  SlidersHorizontal,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Bookmark,
  Code,
  RotateCcw,
  RotateCw,
  Pipette,
  CheckCheck,
} from 'lucide-react';
import { ColorItem, HarmonyMode, ColorFormat } from '../types.ts';
import {
  generateHarmoniousPalette,
  getNearestColorName,
  getContrastingTextColor,
  formatColorValue,
  isValidHex,
  normalizeHex,
  generateRandomHex,
} from '../utils/colorUtils.ts';
import { ColorInspectorModal } from './ColorInspectorModal.tsx';
import { SavePaletteModal } from './SavePaletteModal.tsx';

interface PaletteGeneratorProps {
  onCopyFeedback: (text: string, color?: string) => void;
  onSavePalette: (name: string, colors: string[], tags: string[]) => void;
  initialColors?: string[];
  defaultFormat: ColorFormat;
  onNavigateToExport: () => void;
}

export const PaletteGenerator: React.FC<PaletteGeneratorProps> = ({
  onCopyFeedback,
  onSavePalette,
  initialColors,
  defaultFormat,
  onNavigateToExport,
}) => {
  const [colorCount, setColorCount] = useState<number>(5);
  const [harmonyMode, setHarmonyMode] = useState<HarmonyMode>('random');
  const [baseColor, setBaseColor] = useState<string>('#6366F1');
  const [colors, setColors] = useState<ColorItem[]>([]);
  const [history, setHistory] = useState<ColorItem[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inspectingIndex, setInspectingIndex] = useState<number | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [activeFormat, setActiveFormat] = useState<ColorFormat>(defaultFormat);

  // Initialize or re-initialize with provided colors
  const createPaletteFromHexes = useCallback(
    (hexList: string[]) => {
      const items: ColorItem[] = hexList.map((hex, i) => ({
        id: `color-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
        hex: normalizeHex(hex),
        locked: false,
        name: getNearestColorName(hex),
      }));
      setColors(items);
      setColorCount(items.length);
      setHistory([items]);
      setHistoryIndex(0);
    },
    []
  );

  useEffect(() => {
    if (initialColors && initialColors.length >= 3) {
      createPaletteFromHexes(initialColors);
    } else {
      const initial = generateHarmoniousPalette('#6366F1', 5, 'random');
      createPaletteFromHexes(initial);
    }
  }, [initialColors, createPaletteFromHexes]);

  // Generate / Shuffle palette respecting locked colors
  const handleGenerate = useCallback(() => {
    const newHexes = generateHarmoniousPalette(baseColor, colorCount, harmonyMode);
    setColors((prev) => {
      const updated = prev.map((item, index) => {
        if (item.locked) return item;
        const freshHex = newHexes[index] || generateRandomHex();
        return {
          ...item,
          hex: normalizeHex(freshHex),
          name: getNearestColorName(freshHex),
        };
      });

      // Push to history
      setHistory((oldHist) => {
        const sliced = oldHist.slice(0, historyIndex + 1);
        return [...sliced, updated];
      });
      setHistoryIndex((idx) => idx + 1);

      return updated;
    });
  }, [baseColor, colorCount, harmonyMode, historyIndex]);

  // Spacebar hotkey listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input, textarea or modal
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || inspectingIndex !== null || isSaveModalOpen) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleGenerate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGenerate, inspectingIndex, isSaveModalOpen]);

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      setColors(history[nextIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setColors(history[nextIdx]);
    }
  };

  // Toggle Lock
  const toggleLock = (index: number) => {
    setColors((prev) =>
      prev.map((item, i) => (i === index ? { ...item, locked: !item.locked } : item))
    );
  };

  // Update Color manually from input or native picker
  const updateColorHex = (index: number, newHex: string) => {
    if (!isValidHex(newHex)) return;
    const norm = normalizeHex(newHex);
    setColors((prev) => {
      const updated = prev.map((item, i) =>
        i === index
          ? {
              ...item,
              hex: norm,
              name: getNearestColorName(norm),
            }
          : item
      );
      setHistory((h) => [...h.slice(0, historyIndex + 1), updated]);
      setHistoryIndex((idx) => idx + 1);
      return updated;
    });
  };

  // Move color left or right
  const moveColor = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= colors.length) return;

    setColors((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      setHistory((h) => [...h.slice(0, historyIndex + 1), copy]);
      setHistoryIndex((idx) => idx + 1);
      return copy;
    });
  };

  // Add / Remove color swatch
  const handleAddColor = () => {
    if (colors.length >= 8) return;
    const newHex = generateRandomHex();
    const newItem: ColorItem = {
      id: `color-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      hex: newHex,
      locked: false,
      name: getNearestColorName(newHex),
    };
    const nextList = [...colors, newItem];
    setColors(nextList);
    setColorCount(nextList.length);
    setHistory((h) => [...h.slice(0, historyIndex + 1), nextList]);
    setHistoryIndex((idx) => idx + 1);
  };

  const handleRemoveColor = (index: number) => {
    if (colors.length <= 3) return;
    const nextList = colors.filter((_, i) => i !== index);
    setColors(nextList);
    setColorCount(nextList.length);
    setHistory((h) => [...h.slice(0, historyIndex + 1), nextList]);
    setHistoryIndex((idx) => idx + 1);
  };

  // Handle color count change from segmented selector
  const handleCountChange = (count: number) => {
    setColorCount(count);
    if (count > colors.length) {
      const diff = count - colors.length;
      const additions: ColorItem[] = Array.from({ length: diff }).map((_, i) => {
        const hex = generateRandomHex();
        return {
          id: `color-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
          hex,
          locked: false,
          name: getNearestColorName(hex),
        };
      });
      const updated = [...colors, ...additions];
      setColors(updated);
      setHistory((h) => [...h.slice(0, historyIndex + 1), updated]);
      setHistoryIndex((idx) => idx + 1);
    } else if (count < colors.length) {
      const updated = colors.slice(0, count);
      setColors(updated);
      setHistory((h) => [...h.slice(0, historyIndex + 1), updated]);
      setHistoryIndex((idx) => idx + 1);
    }
  };

  // Copy individual color
  const copyColor = (item: ColorItem) => {
    const formatted = formatColorValue(item.hex, activeFormat);
    navigator.clipboard.writeText(formatted);
    setCopiedId(item.id);
    onCopyFeedback(`Copied ${formatted} to clipboard`, item.hex);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Copy entire palette as CSS variables
  const copyPaletteCss = () => {
    const cssVars = colors
      .map((item, idx) => `  --color-${idx + 1}: ${item.hex}; /* ${item.name} */`)
      .join('\n');
    const fullCss = `:root {\n${cssVars}\n}`;
    navigator.clipboard.writeText(fullCss);
    onCopyFeedback('Copied complete CSS variables!');
  };

  return (
    <div className="w-full flex flex-col flex-1 pb-12">
      {/* Top Controls Toolbar */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Left: Size, Theory Mode, Base Color */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Color Count Selector */}
            <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
              <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider px-2">
                Colors
              </span>
              {[3, 4, 5, 6, 7, 8].map((num) => (
                <button
                  key={num}
                  onClick={() => handleCountChange(num)}
                  className={`w-7 h-7 text-xs font-semibold rounded-md transition-colors ${
                    colorCount === num
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Harmony Mode Dropdown */}
            <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
              <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider px-2 hidden sm:inline">
                Harmony
              </span>
              <select
                value={harmonyMode}
                onChange={(e) => {
                  setHarmonyMode(e.target.value as HarmonyMode);
                }}
                className="bg-transparent text-xs font-semibold text-neutral-800 dark:text-neutral-200 py-1 px-2.5 rounded-md focus:outline-none cursor-pointer"
              >
                <option value="random">Harmonious</option>
                <option value="complementary">Complementary</option>
                <option value="analogous">Analogous</option>
                <option value="triadic">Triadic</option>
                <option value="split-complementary">Split-Complementary</option>
                <option value="monochromatic">Monochromatic</option>
                <option value="pastel">Pastel Dreams</option>
                <option value="vibrant">Vibrant & Bold</option>
                <option value="dark">Dark UI System</option>
              </select>
            </div>

            {/* Base Color Picker */}
            <label
              className="flex items-center gap-2 px-2.5 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200/70 dark:hover:bg-neutral-700 rounded-lg cursor-pointer transition-colors"
              title="Select base anchor color"
            >
              <div
                className="w-4 h-4 rounded-full border border-black/10 dark:border-white/20 shadow-xs"
                style={{ backgroundColor: baseColor }}
              />
              <span className="text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300">
                {baseColor}
              </span>
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value.toUpperCase())}
                className="sr-only"
              />
            </label>

            {/* Format toggle: HEX / RGB / HSL */}
            <div className="hidden lg:flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
              {(['hex', 'rgb', 'hsl'] as ColorFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setActiveFormat(fmt)}
                  className={`px-2.5 py-1 text-[11px] font-mono font-semibold uppercase rounded-md transition-colors ${
                    activeFormat === fmt
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Actions (Undo/Redo, Save, Export, Generate) */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg p-0.5">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                title="Undo (Ctrl+Z)"
                className="p-1.5 rounded-md text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                title="Redo"
                className="p-1.5 rounded-md text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => setIsSaveModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save</span>
            </button>

            <button
              onClick={copyPaletteCss}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              title="Copy complete CSS variables"
            >
              <Code className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copy CSS</span>
            </button>

            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-lg shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate</span>
              <span className="hidden md:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-normal uppercase bg-indigo-700/60 rounded">
                Space
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Swatches Stage */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="min-h-[520px] h-[65vh] w-full rounded-2xl overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row transition-all">
          {colors.map((item, index) => {
            const textColor = getContrastingTextColor(item.hex);
            const isWhiteText = textColor === '#FFFFFF';
            const formattedVal = formatColorValue(item.hex, activeFormat);
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="relative flex-1 group flex flex-col justify-between p-4 sm:p-6 transition-all duration-300 min-h-[100px] md:min-h-0"
                style={{ backgroundColor: item.hex }}
              >
                {/* Top swatch controls (Lock, Move, Remove) */}
                <div className="flex items-center justify-between opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleLock(index)}
                      className={`p-2 rounded-lg backdrop-blur-md transition-all ${
                        item.locked
                          ? isWhiteText
                            ? 'bg-white/30 text-white shadow-xs'
                            : 'bg-black/20 text-neutral-900 shadow-xs'
                          : isWhiteText
                          ? 'hover:bg-white/20 text-white/80 hover:text-white'
                          : 'hover:bg-black/10 text-neutral-800 hover:text-black'
                      }`}
                      title={item.locked ? 'Unlock color' : 'Lock color'}
                      aria-label={item.locked ? 'Unlock color' : 'Lock color'}
                    >
                      {item.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => setInspectingIndex(index)}
                      className={`p-2 rounded-lg backdrop-blur-md transition-all ${
                        isWhiteText
                          ? 'hover:bg-white/20 text-white/80 hover:text-white'
                          : 'hover:bg-black/10 text-neutral-800 hover:text-black'
                      }`}
                      title="Inspect & Edit color metrics"
                      aria-label="Inspect color"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Move Left */}
                    {index > 0 && (
                      <button
                        onClick={() => moveColor(index, 'left')}
                        className={`hidden md:block p-1.5 rounded-lg backdrop-blur-md ${
                          isWhiteText ? 'hover:bg-white/20 text-white' : 'hover:bg-black/10 text-black'
                        }`}
                        title="Move left"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {/* Move Right */}
                    {index < colors.length - 1 && (
                      <button
                        onClick={() => moveColor(index, 'right')}
                        className={`hidden md:block p-1.5 rounded-lg backdrop-blur-md ${
                          isWhiteText ? 'hover:bg-white/20 text-white' : 'hover:bg-black/10 text-black'
                        }`}
                        title="Move right"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {/* Remove */}
                    {colors.length > 3 && (
                      <button
                        onClick={() => handleRemoveColor(index)}
                        className={`p-1.5 rounded-lg backdrop-blur-md ${
                          isWhiteText
                            ? 'hover:bg-red-500/30 text-white/80 hover:text-red-200'
                            : 'hover:bg-red-500/20 text-black/80 hover:text-red-700'
                        }`}
                        title="Remove color"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Center / Quick Native Color Picker Trigger */}
                <div className="my-auto text-center opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex flex-col items-center justify-center">
                  <label
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md cursor-pointer transition-all hover:scale-105 shadow-sm inline-flex items-center gap-1.5 ${
                      isWhiteText
                        ? 'bg-white/25 hover:bg-white/35 text-white'
                        : 'bg-black/15 hover:bg-black/25 text-neutral-900'
                    }`}
                  >
                    <Pipette className="w-3.5 h-3.5" />
                    <span>Pick</span>
                    <input
                      type="color"
                      value={item.hex}
                      onChange={(e) => updateColorHex(index, e.target.value)}
                      className="sr-only"
                    />
                  </label>
                </div>

                {/* Bottom Color Info (Name, Value, Copy) */}
                <div className="flex flex-col gap-1.5">
                  <span
                    className="text-xs font-medium tracking-wide uppercase opacity-80 truncate"
                    style={{ color: textColor }}
                  >
                    {item.name}
                  </span>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => copyColor(item)}
                      className="flex items-center gap-1.5 group/code text-left"
                      title="Click to copy color value"
                    >
                      <span
                        className="text-lg md:text-xl font-mono font-bold tracking-tight select-all truncate"
                        style={{ color: textColor }}
                      >
                        {formattedVal}
                      </span>
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Copy
                          className="w-4 h-4 opacity-0 group-hover/code:opacity-100 transition-opacity shrink-0"
                          style={{ color: textColor }}
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Helpful Guide & Quick Access Banner */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500 dark:text-neutral-400 px-1">
          <div className="flex items-center gap-4">
            <span>
              Tip: Press <kbd className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded text-neutral-800 dark:text-neutral-200 font-mono">Space</kbd> to shuffle
            </span>
            <span aria-hidden="true">·</span>
            <span>Click any color value to copy</span>
            <span aria-hidden="true">·</span>
            <span>Lock individual swatches to build around favorites</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToExport}
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Export full CSS & Tailwind tokens →
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {inspectingIndex !== null && colors[inspectingIndex] && (
        <ColorInspectorModal
          initialHex={colors[inspectingIndex].hex}
          isOpen={true}
          onClose={() => setInspectingIndex(null)}
          onApplyColor={(newHex) => updateColorHex(inspectingIndex, newHex)}
          onCopyFeedback={onCopyFeedback}
        />
      )}

      <SavePaletteModal
        isOpen={isSaveModalOpen}
        colors={colors.map((c) => c.hex)}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={(name, tags) => {
          onSavePalette(name, colors.map((c) => c.hex), tags);
          onCopyFeedback(`Saved "${name}" to collections!`);
        }}
      />
    </div>
  );
};
