import React, { useState } from 'react';
import {
  Copy,
  Check,
  RefreshCw,
  Plus,
  Trash2,
  ArrowLeftRight,
  Bookmark,
  Sparkles,
  Layers,
  Code,
  Layout,
  Maximize2,
} from 'lucide-react';
import { GradientConfig, GradientStop } from '../types.ts';
import { PRESET_GRADIENTS } from '../utils/presets.ts';
import { generateRandomHex, isValidHex, normalizeHex } from '../utils/colorUtils.ts';

interface GradientStudioProps {
  onCopyFeedback: (text: string) => void;
  onSaveGradient: (name: string, config: GradientConfig) => void;
  onNavigateToExport: () => void;
}

export const GradientStudio: React.FC<GradientStudioProps> = ({
  onCopyFeedback,
  onSaveGradient,
}) => {
  const [config, setConfig] = useState<GradientConfig>({
    type: 'linear',
    angle: 135,
    radialShape: 'ellipse',
    radialPosition: 'center',
    stops: [
      { id: '1', color: '#6366F1', position: 0 },
      { id: '2', color: '#EC4899', position: 50 },
      { id: '3', color: '#F59E0B', position: 100 },
    ],
  });

  const [previewMode, setPreviewMode] = useState<'canvas' | 'hero' | 'glass'>('hero');
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [gradientName, setGradientName] = useState('My Gradient');

  // Compute CSS declaration
  const generateGradientCss = (cfg: GradientConfig): string => {
    const sortedStops = [...cfg.stops].sort((a, b) => a.position - b.position);
    const stopsStr = sortedStops.map((s) => `${s.color} ${s.position}%`).join(', ');

    if (cfg.type === 'linear') {
      return `linear-gradient(${cfg.angle}deg, ${stopsStr})`;
    } else {
      return `radial-gradient(${cfg.radialShape} at ${cfg.radialPosition}, ${stopsStr})`;
    }
  };

  const gradientCssValue = generateGradientCss(config);
  const fullCssDeclaration = `background: ${gradientCssValue};`;

  const handleCopyCss = () => {
    navigator.clipboard.writeText(fullCssDeclaration);
    setCopied(true);
    onCopyFeedback('Copied gradient CSS to clipboard!');
    setTimeout(() => setCopied(false), 1500);
  };

  const handleAddStop = () => {
    if (config.stops.length >= 7) return;
    const newStop: GradientStop = {
      id: `stop-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      color: generateRandomHex(),
      position: Math.round(Math.min(100, Math.max(0, 100 / (config.stops.length + 1)))),
    };
    setConfig((prev) => ({
      ...prev,
      stops: [...prev.stops, newStop].sort((a, b) => a.position - b.position),
    }));
  };

  const handleRemoveStop = (id: string) => {
    if (config.stops.length <= 2) return;
    setConfig((prev) => ({
      ...prev,
      stops: prev.stops.filter((s) => s.id !== id),
    }));
  };

  const handleUpdateStopColor = (id: string, color: string) => {
    if (!isValidHex(color)) return;
    const norm = normalizeHex(color);
    setConfig((prev) => ({
      ...prev,
      stops: prev.stops.map((s) => (s.id === id ? { ...s, color: norm } : s)),
    }));
  };

  const handleUpdateStopPos = (id: string, pos: number) => {
    setConfig((prev) => ({
      ...prev,
      stops: prev.stops.map((s) => (s.id === id ? { ...s, position: pos } : s)),
    }));
  };

  const handleReverseDirection = () => {
    setConfig((prev) => {
      const reversed = [...prev.stops].reverse().map((stop, idx) => ({
        ...stop,
        position: 100 - stop.position,
      }));
      return {
        ...prev,
        angle: (prev.angle + 180) % 360,
        stops: reversed.sort((a, b) => a.position - b.position),
      };
    });
  };

  const handleRandomize = () => {
    const count = Math.random() > 0.5 ? 3 : 2;
    const randomAngle = [0, 45, 90, 135, 180, 225, 270][Math.floor(Math.random() * 7)];
    const newStops: GradientStop[] = Array.from({ length: count }).map((_, i) => ({
      id: `stop-${Date.now()}-${i}`,
      color: generateRandomHex(),
      position: Math.round((100 / (count - 1)) * i),
    }));

    setConfig({
      type: Math.random() > 0.8 ? 'radial' : 'linear',
      angle: randomAngle,
      radialShape: 'ellipse',
      radialPosition: 'center',
      stops: newStops,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradientName.trim()) return;
    onSaveGradient(gradientName.trim(), config);
    onCopyFeedback(`Saved "${gradientName}" to collections!`);
    setIsSaving(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Preset Carousel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Gradient Studio
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Craft multi-stop linear and radial gradients with live UI preview and ready CSS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRandomize}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Randomize
          </button>
          <button
            onClick={handleReverseDirection}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            title="Reverse gradient direction"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Reverse
          </button>
          <button
            onClick={() => setIsSaving(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" />
            Save
          </button>
          <button
            onClick={handleCopyCss}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-all active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            Copy CSS
          </button>
        </div>
      </div>

      {/* Preset Chips Bar */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          Curated Presets
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {PRESET_GRADIENTS.map((preset) => {
            const previewBg = generateGradientCss(preset.config);
            return (
              <button
                key={preset.name}
                onClick={() => setConfig(preset.config)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500 bg-white dark:bg-neutral-900 transition-all shrink-0 group text-left"
              >
                <div
                  className="w-5 h-5 rounded-md shadow-inner border border-black/10 shrink-0"
                  style={{ background: previewBg }}
                />
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 whitespace-nowrap">
                  {preset.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-Column Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Preview Area (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Preview Container */}
          <div className="relative w-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xl transition-all min-h-[460px] flex flex-col justify-between p-8"
            style={{ background: gradientCssValue }}
          >
            {/* Top Preview Bar */}
            <div className="flex items-center justify-between z-10">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/30 backdrop-blur-md text-white border border-white/10">
                {config.type === 'linear' ? `${config.angle}° Linear` : `${config.radialShape} Radial`}
              </span>

              {/* Preview Mode Switcher */}
              <div className="flex items-center bg-black/40 backdrop-blur-md rounded-lg p-1 border border-white/10">
                <button
                  onClick={() => setPreviewMode('hero')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    previewMode === 'hero' ? 'bg-white text-neutral-900 shadow-xs' : 'text-white/80 hover:text-white'
                  }`}
                >
                  Hero Card
                </button>
                <button
                  onClick={() => setPreviewMode('glass')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    previewMode === 'glass' ? 'bg-white text-neutral-900 shadow-xs' : 'text-white/80 hover:text-white'
                  }`}
                >
                  Glass UI
                </button>
                <button
                  onClick={() => setPreviewMode('canvas')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    previewMode === 'canvas' ? 'bg-white text-neutral-900 shadow-xs' : 'text-white/80 hover:text-white'
                  }`}
                >
                  Clean Canvas
                </button>
              </div>
            </div>

            {/* Preview Content based on mode */}
            {previewMode === 'hero' && (
              <div className="my-auto max-w-md bg-black/30 backdrop-blur-lg p-6 sm:p-8 rounded-2xl border border-white/15 text-white shadow-2xl space-y-4">
                <span className="text-[11px] uppercase tracking-wider font-bold text-white/70">
                  Modern Design System
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                  Craft radiant gradients for web & mobile
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  Precision-tuned color blending for modern hero sections, cards, and accent banners.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button className="px-4 py-2 text-xs font-bold bg-white text-neutral-950 rounded-lg shadow hover:bg-neutral-100 transition-colors">
                    Explore Studio
                  </button>
                  <button className="px-4 py-2 text-xs font-bold text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors">
                    Documentation
                  </button>
                </div>
              </div>
            )}

            {previewMode === 'glass' && (
              <div className="my-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/20 dark:bg-black/30 backdrop-blur-xl border border-white/25 rounded-xl p-5 text-white shadow-xl">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-3">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-bold text-sm">Glassmorphic Layer</h4>
                  <p className="text-xs text-white/80 mt-1">
                    See how your gradient shimmers behind frosted glass blur effects.
                  </p>
                </div>
                <div className="bg-white/20 dark:bg-black/30 backdrop-blur-xl border border-white/25 rounded-xl p-5 text-white shadow-xl">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-3">
                    <Layout className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-bold text-sm">Component Depth</h4>
                  <p className="text-xs text-white/80 mt-1">
                    Multi-stop depth testing across UI components and surfaces.
                  </p>
                </div>
              </div>
            )}

            {previewMode === 'canvas' && <div className="my-auto" />}

            {/* Bottom CSS Code Bar */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/50 backdrop-blur-md border border-white/15 text-white text-xs font-mono">
              <span className="truncate pr-4">{fullCssDeclaration}</span>
              <button
                onClick={handleCopyCss}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/20 hover:bg-white/30 text-white font-medium shrink-0 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Gradient Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-6">
          {/* Gradient Type Selector */}
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Gradient Type
            </label>
            <div className="grid grid-cols-2 gap-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
              <button
                onClick={() => setConfig((p) => ({ ...p, type: 'linear' }))}
                className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  config.type === 'linear'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                Linear Gradient
              </button>
              <button
                onClick={() => setConfig((p) => ({ ...p, type: 'radial' }))}
                className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  config.type === 'radial'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                Radial Gradient
              </button>
            </div>
          </div>

          {/* Linear Angle or Radial Shape Controls */}
          {config.type === 'linear' ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-medium text-neutral-700 dark:text-neutral-300">
                <span className="font-semibold text-neutral-500 uppercase tracking-wider text-[11px]">
                  Angle
                </span>
                <span className="font-mono">{config.angle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={config.angle}
                onChange={(e) => setConfig((p) => ({ ...p, angle: Number(e.target.value) }))}
                className="w-full h-2 rounded-lg cursor-pointer bg-neutral-200 dark:bg-neutral-700"
              />
              {/* Quick Angle Chips */}
              <div className="flex items-center gap-1.5 pt-1">
                {[0, 45, 90, 135, 180, 270].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => setConfig((p) => ({ ...p, angle: deg }))}
                    className={`px-2 py-1 text-[11px] font-mono rounded-md border transition-colors ${
                      config.angle === deg
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Shape
                </label>
                <select
                  value={config.radialShape}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, radialShape: e.target.value as 'circle' | 'ellipse' }))
                  }
                  className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                >
                  <option value="circle">Circle</option>
                  <option value="ellipse">Ellipse</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Position
                </label>
                <select
                  value={config.radialPosition}
                  onChange={(e) => setConfig((p) => ({ ...p, radialPosition: e.target.value }))}
                  className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                >
                  <option value="center">Center</option>
                  <option value="top left">Top Left</option>
                  <option value="top">Top</option>
                  <option value="top right">Top Right</option>
                  <option value="bottom">Bottom</option>
                  <option value="bottom right">Bottom Right</option>
                </select>
              </div>
            </div>
          )}

          {/* Color Stops Track & Stop List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Color Stops ({config.stops.length})
              </span>
              <button
                onClick={handleAddStop}
                disabled={config.stops.length >= 6}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Stop
              </button>
            </div>

            {/* Visual Stops Track */}
            <div
              className="h-3 w-full rounded-full border border-black/10 dark:border-white/10 shadow-inner"
              style={{
                background: `linear-gradient(to right, ${[...config.stops]
                  .sort((a, b) => a.position - b.position)
                  .map((s) => `${s.color} ${s.position}%`)
                  .join(', ')})`,
              }}
            />

            {/* List of stops */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {config.stops.map((stop, index) => (
                <div
                  key={stop.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40"
                >
                  {/* Color circle + Native picker */}
                  <label className="relative cursor-pointer shrink-0">
                    <div
                      className="w-7 h-7 rounded-lg border border-black/15 shadow-xs"
                      style={{ backgroundColor: stop.color }}
                    />
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) => handleUpdateStopColor(stop.id, e.target.value)}
                      className="sr-only"
                    />
                  </label>

                  {/* Hex Text */}
                  <input
                    type="text"
                    value={stop.color}
                    onChange={(e) => handleUpdateStopColor(stop.id, e.target.value)}
                    className="w-20 px-2 py-1 text-xs font-mono font-semibold uppercase rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />

                  {/* Position Slider */}
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={stop.position}
                      onChange={(e) => handleUpdateStopPos(stop.id, Number(e.target.value))}
                      className="w-full h-1.5 rounded-lg cursor-pointer bg-neutral-200 dark:bg-neutral-700"
                    />
                    <span className="text-[11px] font-mono text-neutral-500 w-8 text-right">
                      {stop.position}%
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveStop(stop.id)}
                    disabled={config.stops.length <= 2}
                    className="p-1 text-neutral-400 hover:text-red-500 disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors"
                    title="Remove stop"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Gradient Modal */}
      {isSaving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">Save Gradient</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Gradient Name
                </label>
                <input
                  type="text"
                  required
                  value={gradientName}
                  onChange={(e) => setGradientName(e.target.value)}
                  placeholder="e.g., Midnight Horizon"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSaving(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
