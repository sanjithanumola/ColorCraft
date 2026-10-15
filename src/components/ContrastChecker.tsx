import React, { useState } from 'react';
import {
  ArrowLeftRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Info,
  Type,
  Layout,
  MousePointerClick,
  Copy,
  Check,
} from 'lucide-react';
import {
  isValidHex,
  normalizeHex,
  getContrastRatio,
  getRelativeLuminance,
  suggestImprovedContrastColor,
} from '../utils/colorUtils.ts';

interface ContrastCheckerProps {
  onCopyFeedback: (text: string) => void;
}

export const ContrastChecker: React.FC<ContrastCheckerProps> = ({ onCopyFeedback }) => {
  const [fgColor, setFgColor] = useState<string>('#1E1B4B');
  const [bgColor, setBgColor] = useState<string>('#F8FAFC');
  const [fgInput, setFgInput] = useState<string>('#1E1B4B');
  const [bgInput, setBgInput] = useState<string>('#F8FAFC');
  const [previewTab, setPreviewTab] = useState<'text' | 'components'>('text');

  const validFg = isValidHex(fgColor);
  const validBg = isValidHex(bgColor);
  const normFg = validFg ? normalizeHex(fgColor) : '#1E1B4B';
  const normBg = validBg ? normalizeHex(bgColor) : '#F8FAFC';

  const ratio = getContrastRatio(normFg, normBg);
  const formattedRatio = ratio.toFixed(2);
  const fgLum = getRelativeLuminance(normFg).toFixed(3);
  const bgLum = getRelativeLuminance(normBg).toFixed(3);

  // WCAG Compliance Criteria
  const normalAA = ratio >= 4.5;
  const normalAAA = ratio >= 7.0;
  const largeAA = ratio >= 3.0;
  const largeAAA = ratio >= 4.5;
  const uiAA = ratio >= 3.0;

  // Smart suggestions if failing
  const suggestionAA = suggestImprovedContrastColor(normFg, normBg, 4.5);
  const suggestionAAA = suggestImprovedContrastColor(normFg, normBg, 7.0);

  const handleSwap = () => {
    const tempFg = normFg;
    const tempBg = normBg;
    setFgColor(tempBg);
    setBgColor(tempFg);
    setFgInput(tempBg);
    setBgInput(tempFg);
  };

  const applyFgSuggestion = (newHex: string) => {
    setFgColor(newHex);
    setFgInput(newHex);
    onCopyFeedback(`Applied suggested color ${newHex}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          WCAG Contrast Checker
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
          Evaluate color legibility and accessibility according to Web Content Accessibility Guidelines (WCAG 2.1)
        </p>
      </div>

      {/* Main Grid: Inputs & Score vs Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Color Controls & WCAG Matrix (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Dual Color Selectors */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Color Configuration
              </span>
              <button
                onClick={handleSwap}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                title="Swap foreground and background"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                Swap Colors
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Foreground Input */}
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-3">
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Text / Foreground
                </span>
                <div className="flex items-center gap-3">
                  <label className="relative cursor-pointer shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl border border-black/15 shadow-sm"
                      style={{ backgroundColor: normFg }}
                    />
                    <input
                      type="color"
                      value={normFg}
                      onChange={(e) => {
                        setFgColor(e.target.value.toUpperCase());
                        setFgInput(e.target.value.toUpperCase());
                      }}
                      className="sr-only"
                    />
                  </label>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={fgInput}
                      onChange={(e) => {
                        setFgInput(e.target.value);
                        if (isValidHex(e.target.value)) setFgColor(normalizeHex(e.target.value));
                      }}
                      className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white uppercase"
                    />
                    <span className="text-[10px] text-neutral-400 font-mono mt-1 block">
                      Lum: {fgLum}
                    </span>
                  </div>
                </div>
              </div>

              {/* Background Input */}
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-3">
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Background Color
                </span>
                <div className="flex items-center gap-3">
                  <label className="relative cursor-pointer shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl border border-black/15 shadow-sm"
                      style={{ backgroundColor: normBg }}
                    />
                    <input
                      type="color"
                      value={normBg}
                      onChange={(e) => {
                        setBgColor(e.target.value.toUpperCase());
                        setBgInput(e.target.value.toUpperCase());
                      }}
                      className="sr-only"
                    />
                  </label>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={bgInput}
                      onChange={(e) => {
                        setBgInput(e.target.value);
                        if (isValidHex(e.target.value)) setBgColor(normalizeHex(e.target.value));
                      }}
                      className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white uppercase"
                    />
                    <span className="text-[10px] text-neutral-400 font-mono mt-1 block">
                      Lum: {bgLum}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculated Ratio Hero Display */}
            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-neutral-800/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                  Contrast Ratio
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-mono font-extrabold tracking-tight text-neutral-900 dark:text-white">
                    {formattedRatio}
                  </span>
                  <span className="text-sm font-semibold text-neutral-500">: 1</span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full ${
                    normalAAA
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                      : normalAA
                      ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-800'
                      : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                  }`}
                >
                  {normalAAA ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Enhanced AAA
                    </>
                  ) : normalAA ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Minimum AA
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" /> Fails WCAG
                    </>
                  )}
                </span>
                <span className="text-[11px] text-neutral-500 block mt-1.5">
                  {normalAAA
                    ? 'Superb contrast across all display types'
                    : normalAA
                    ? 'Meets standard requirements for normal text'
                    : 'Insufficient contrast for readable text'}
                </span>
              </div>
            </div>
          </div>

          {/* WCAG Compliance Matrix Table */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-4">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
              Compliance Breakdown
            </span>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
              {/* Normal Text */}
              <div className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-white block">
                    Normal Text (&lt; 18pt / 24px)
                  </span>
                  <span className="text-neutral-500 text-[11px]">
                    Requires 4.5:1 for AA · 7.0:1 for AAA
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                      normalAA
                        ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                        : 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    AA: {normalAA ? 'PASS' : 'FAIL'}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                      normalAAA
                        ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                        : 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    AAA: {normalAAA ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              </div>

              {/* Large Text */}
              <div className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-white block">
                    Large Text (&ge; 18pt or 14pt Bold)
                  </span>
                  <span className="text-neutral-500 text-[11px]">
                    Requires 3.0:1 for AA · 4.5:1 for AAA
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                      largeAA
                        ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                        : 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    AA: {largeAA ? 'PASS' : 'FAIL'}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                      largeAAA
                        ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                        : 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    AAA: {largeAAA ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              </div>

              {/* UI Components */}
              <div className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-white block">
                    UI Components & Graphical Objects
                  </span>
                  <span className="text-neutral-500 text-[11px]">Requires 3.0:1 for AA</span>
                </div>
                <div>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                      uiAA
                        ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                        : 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    AA: {uiAA ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Contrast Fixer / Recommendations */}
          {(!normalAA || !normalAAA) && (
            <div className="bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Auto-Fix Suggestions
              </div>
              <p className="text-xs text-indigo-900/80 dark:text-indigo-300">
                ColorCraft calculated the closest hues with adjusted lightness to guarantee compliance:
              </p>

              <div className="space-y-2 pt-1">
                {suggestionAA && !normalAA && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-indigo-100 dark:border-indigo-900">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-6 h-6 rounded-md shadow-xs border border-black/15"
                        style={{ backgroundColor: suggestionAA.hex }}
                      />
                      <div>
                        <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">
                          {suggestionAA.hex}
                        </span>
                        <span className="text-[10px] text-neutral-500 block">
                          Passes AA ({suggestionAA.ratio.toFixed(2)}:1)
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => applyFgSuggestion(suggestionAA.hex)}
                      className="px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-md transition-colors"
                    >
                      Apply AA
                    </button>
                  </div>
                )}

                {suggestionAAA && !normalAAA && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-indigo-100 dark:border-indigo-900">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-6 h-6 rounded-md shadow-xs border border-black/15"
                        style={{ backgroundColor: suggestionAAA.hex }}
                      />
                      <div>
                        <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">
                          {suggestionAAA.hex}
                        </span>
                        <span className="text-[10px] text-neutral-500 block">
                          Passes AAA ({suggestionAAA.ratio.toFixed(2)}:1)
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => applyFgSuggestion(suggestionAAA.hex)}
                      className="px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-md transition-colors"
                    >
                      Apply AAA
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Visual Testing Sandbox (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Real-World Preview Sandbox
            </span>
            <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setPreviewTab('text')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  previewTab === 'text'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Typography
              </button>
              <button
                onClick={() => setPreviewTab('components')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  previewTab === 'components'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                UI Elements
              </button>
            </div>
          </div>

          {/* Canvas Preview Box */}
          <div
            className="w-full rounded-2xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-xl transition-colors duration-200 min-h-[460px] flex flex-col justify-between"
            style={{ backgroundColor: normBg }}
          >
            {previewTab === 'text' ? (
              <div className="space-y-6">
                <div>
                  <span
                    className="text-xs font-bold uppercase tracking-wider opacity-75"
                    style={{ color: normFg }}
                  >
                    14pt Bold Headline · Large Text
                  </span>
                  <h2
                    className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 leading-snug"
                    style={{ color: normFg }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </h2>
                </div>

                <div>
                  <span
                    className="text-xs font-bold uppercase tracking-wider opacity-75"
                    style={{ color: normFg }}
                  >
                    16px Regular Body · Normal Text
                  </span>
                  <p
                    className="text-base leading-relaxed mt-1"
                    style={{ color: normFg }}
                  >
                    Good contrast makes content effortless for all users, including those with visual impairments, aging eyes, or individuals viewing screens in direct sunlight.
                  </p>
                </div>

                <div>
                  <span
                    className="text-xs font-bold uppercase tracking-wider opacity-75"
                    style={{ color: normFg }}
                  >
                    13px Metadata Prose
                  </span>
                  <p
                    className="text-xs opacity-90 leading-normal mt-1"
                    style={{ color: normFg }}
                  >
                    Published October 2026 · Accessible UI Design System · Level AAA Compliant
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <span
                    className="text-xs font-bold uppercase tracking-wider opacity-75"
                    style={{ color: normFg }}
                  >
                    Interactive Buttons
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      className="px-4 py-2 text-xs font-bold rounded-lg shadow-sm"
                      style={{
                        backgroundColor: normFg,
                        color: normBg,
                      }}
                    >
                      Primary Action
                    </button>
                    <button
                      className="px-4 py-2 text-xs font-bold rounded-lg border-2"
                      style={{
                        borderColor: normFg,
                        color: normFg,
                      }}
                    >
                      Outline Button
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span
                    className="text-xs font-bold uppercase tracking-wider opacity-75"
                    style={{ color: normFg }}
                  >
                    Form Input Field
                  </span>
                  <div className="space-y-1">
                    <label
                      className="block text-xs font-semibold"
                      style={{ color: normFg }}
                    >
                      Email address
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="designer@colorcraft.studio"
                      className="w-full px-3.5 py-2 text-xs rounded-lg border-2 bg-transparent"
                      style={{
                        borderColor: normFg,
                        color: normFg,
                      }}
                    />
                  </div>
                </div>

                <div
                  className="p-4 rounded-xl border-2"
                  style={{
                    borderColor: normFg,
                  }}
                >
                  <h4 className="text-sm font-bold" style={{ color: normFg }}>
                    System Notice Card
                  </h4>
                  <p className="text-xs mt-1 opacity-90" style={{ color: normFg }}>
                    Testing container boundaries, subtle hairlines, and card elevation against the background canvas.
                  </p>
                </div>
              </div>
            )}

            {/* Bottom status badge */}
            <div
              className="mt-6 pt-4 border-t flex items-center justify-between text-xs"
              style={{
                borderColor: `${normFg}25`,
                color: normFg,
              }}
            >
              <span className="font-mono opacity-80">
                Foreground: {normFg} · Background: {normBg}
              </span>
              <span className="font-bold">
                {ratio >= 4.5 ? '✓ Legible' : '⚠ Low Contrast'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
