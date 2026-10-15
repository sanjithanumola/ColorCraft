import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Sliders, RefreshCw, Eye } from 'lucide-react';
import {
  hexToRgb,
  rgbToHsl,
  rgbToHsv,
  rgbToCmyk,
  hslToHex,
  isValidHex,
  normalizeHex,
  getContrastRatio,
  getContrastingTextColor,
  getNearestColorName,
  generateTintsAndShades,
} from '../utils/colorUtils.ts';

interface ColorInspectorModalProps {
  initialHex: string;
  isOpen: boolean;
  onClose: () => void;
  onApplyColor: (newHex: string) => void;
  onCopyFeedback: (text: string) => void;
}

export const ColorInspectorModal: React.FC<ColorInspectorModalProps> = ({
  initialHex,
  isOpen,
  onClose,
  onApplyColor,
  onCopyFeedback,
}) => {
  const [currentHex, setCurrentHex] = useState(initialHex);
  const [hexInput, setHexInput] = useState(initialHex);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  useEffect(() => {
    if (initialHex) {
      setCurrentHex(initialHex);
      setHexInput(initialHex);
    }
  }, [initialHex, isOpen]);

  if (!isOpen) return null;

  const valid = isValidHex(currentHex);
  const normHex = valid ? normalizeHex(currentHex) : '#6366F1';
  const rgb = hexToRgb(normHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  const colorName = getNearestColorName(normHex);
  const contrastWithWhite = getContrastRatio('#FFFFFF', normHex).toFixed(2);
  const contrastWithBlack = getContrastRatio('#0F172A', normHex).toFixed(2);
  const textColor = getContrastingTextColor(normHex);
  const { tints, shades } = generateTintsAndShades(normHex);

  const handleCopy = (formatName: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedFormat(formatName);
    onCopyFeedback(val);
    setTimeout(() => setCopiedFormat(null), 1500);
  };

  const handleHslChange = (param: 'h' | 's' | 'l', value: number) => {
    const newH = param === 'h' ? value : hsl.h;
    const newS = param === 's' ? value : hsl.s;
    const newL = param === 'l' ? value : hsl.l;
    const nextHex = hslToHex(newH, newS, newL);
    setCurrentHex(nextHex);
    setHexInput(nextHex);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (isValidHex(val)) {
      setCurrentHex(normalizeHex(val));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Color Inspector
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Deep dive color metrics, conversions, and harmonic scales
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Visual Display */}
          <div
            className="w-full h-32 rounded-xl flex items-end justify-between p-5 shadow-inner transition-colors duration-200"
            style={{ backgroundColor: normHex }}
          >
            <div>
              <span
                className="text-xs uppercase tracking-wider font-semibold opacity-80"
                style={{ color: textColor }}
              >
                {colorName}
              </span>
              <h2
                className="text-2xl font-mono font-bold tracking-tight"
                style={{ color: textColor }}
              >
                {normHex}
              </h2>
            </div>
            <div className="flex gap-2">
              <label
                className="px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md cursor-pointer transition-transform hover:scale-105"
                style={{
                  backgroundColor: textColor === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                  color: textColor,
                }}
              >
                Pick Native
                <input
                  type="color"
                  value={normHex}
                  onChange={(e) => {
                    setCurrentHex(e.target.value.toUpperCase());
                    setHexInput(e.target.value.toUpperCase());
                  }}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          {/* Color Values & Conversions Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { label: 'HEX', value: normHex },
              { label: 'RGB', value: `${rgb.r}, ${rgb.g}, ${rgb.b}` },
              { label: 'HSL', value: `${hsl.h}°, ${hsl.s}%, ${hsl.l}%` },
              { label: 'HSV', value: `${hsv.h}°, ${hsv.s}%, ${hsv.v}%` },
            ].map((f) => (
              <button
                key={f.label}
                onClick={() => handleCopy(f.label, f.value)}
                className="flex flex-col text-left p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500/50 bg-neutral-50 dark:bg-neutral-800/40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all group"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    {f.label}
                  </span>
                  {copiedFormat === f.label ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-neutral-400 group-hover:text-indigo-500 transition-colors" />
                  )}
                </div>
                <span className="text-xs font-mono font-medium text-neutral-900 dark:text-neutral-100 truncate">
                  {f.value}
                </span>
              </button>
            ))}
          </div>

          {/* Sliders: Hue, Saturation, Lightness */}
          <div className="space-y-3.5 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/20">
            <div>
              <div className="flex justify-between text-xs font-medium text-neutral-600 dark:text-neutral-300 mb-1.5">
                <span>Hue</span>
                <span className="font-mono">{hsl.h}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={hsl.h}
                onChange={(e) => handleHslChange('h', Number(e.target.value))}
                className="w-full h-2 rounded-lg cursor-pointer appearance-none"
                style={{
                  background:
                    'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
                }}
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-neutral-600 dark:text-neutral-300 mb-1.5">
                <span>Saturation</span>
                <span className="font-mono">{hsl.s}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={hsl.s}
                onChange={(e) => handleHslChange('s', Number(e.target.value))}
                className="w-full h-2 rounded-lg cursor-pointer bg-neutral-200 dark:bg-neutral-700"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-neutral-600 dark:text-neutral-300 mb-1.5">
                <span>Lightness</span>
                <span className="font-mono">{hsl.l}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={hsl.l}
                onChange={(e) => handleHslChange('l', Number(e.target.value))}
                className="w-full h-2 rounded-lg cursor-pointer bg-neutral-200 dark:bg-neutral-700"
              />
            </div>
          </div>

          {/* Contrast Indicators */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <span className="text-neutral-500">Contrast on White:</span>
              <span className="font-mono font-bold text-neutral-900 dark:text-white">
                {contrastWithWhite}:1
              </span>
            </div>
            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <span className="text-neutral-500">Contrast on Dark:</span>
              <span className="font-mono font-bold text-neutral-900 dark:text-white">
                {contrastWithBlack}:1
              </span>
            </div>
          </div>

          {/* Tints & Shades Strips */}
          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1.5">
                Tints (Lightened)
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {tints.map((tHex, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentHex(tHex);
                      setHexInput(tHex);
                    }}
                    className="h-9 rounded-lg border border-black/10 dark:border-white/10 transition-transform hover:scale-105 active:scale-95"
                    style={{ backgroundColor: tHex }}
                    title={`Tint ${idx + 1}: ${tHex}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1.5">
                Shades (Darkened)
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {shades.map((sHex, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentHex(sHex);
                      setHexInput(sHex);
                    }}
                    className="h-9 rounded-lg border border-black/10 dark:border-white/10 transition-transform hover:scale-105 active:scale-95"
                    style={{ backgroundColor: sHex }}
                    title={`Shade ${idx + 1}: ${sHex}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
          <button
            onClick={() => {
              const rand = hslToHex(
                Math.floor(Math.random() * 360),
                65 + Math.floor(Math.random() * 30),
                45 + Math.floor(Math.random() * 25)
              );
              setCurrentHex(rand);
              setHexInput(rand);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Randomize
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onApplyColor(normHex);
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors"
            >
              Apply to Swatch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
