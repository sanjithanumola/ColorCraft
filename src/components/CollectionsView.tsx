import React, { useState } from 'react';
import {
  Bookmark,
  Trash2,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Download,
  Upload,
  AlertTriangle,
  Heart,
  Search,
  CopyPlus,
} from 'lucide-react';
import { SavedPalette, SavedGradient, GradientConfig } from '../types.ts';

interface CollectionsViewProps {
  palettes: SavedPalette[];
  gradients: SavedGradient[];
  onLoadPalette: (colors: string[]) => void;
  onLoadGradient: (config: GradientConfig) => void;
  onDeletePalette: (id: string) => void;
  onDeleteGradient: (id: string) => void;
  onDuplicatePalette: (palette: SavedPalette) => void;
  onClearAll: () => void;
  onImportData: (data: { palettes?: SavedPalette[]; gradients?: SavedGradient[] }) => void;
  onCopyFeedback: (text: string) => void;
  onNavigateToGenerator: () => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  palettes,
  gradients,
  onLoadPalette,
  onLoadGradient,
  onDeletePalette,
  onDeleteGradient,
  onDuplicatePalette,
  onClearAll,
  onImportData,
  onCopyFeedback,
  onNavigateToGenerator,
}) => {
  const [activeTab, setActiveTab] = useState<'palettes' | 'gradients'>('palettes');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);

  const filteredPalettes = palettes.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const filteredGradients = gradients.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyCss = (palette: SavedPalette) => {
    const vars = palette.colors
      .map((c, i) => `  --color-${i + 1}: ${c};`)
      .join('\n');
    const css = `/* ${palette.name} */\n:root {\n${vars}\n}`;
    navigator.clipboard.writeText(css);
    setCopiedId(palette.id);
    onCopyFeedback(`Copied CSS for "${palette.name}"`);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleExportBackup = () => {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      palettes,
      gradients,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `colorcraft-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onCopyFeedback('Downloaded collections backup file');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        onImportData(parsed);
        onCopyFeedback('Successfully imported collections');
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const computeGradientBackground = (cfg: GradientConfig) => {
    const sortedStops = [...cfg.stops].sort((a, b) => a.position - b.position);
    const stopsStr = sortedStops.map((s) => `${s.color} ${s.position}%`).join(', ');
    return cfg.type === 'linear'
      ? `linear-gradient(${cfg.angle}deg, ${stopsStr})`
      : `radial-gradient(${cfg.radialShape} at ${cfg.radialPosition}, ${stopsStr})`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Backup Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Saved Collections
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Your personal library of custom palettes, gradients, and design tokens stored locally
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="sr-only" />
          </label>

          <button
            onClick={handleExportBackup}
            disabled={palettes.length === 0 && gradients.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          {(palettes.length > 0 || gradients.length > 0) && (
            <button
              onClick={() => setIsConfirmClearOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('palettes')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'palettes'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Palettes ({palettes.length})
          </button>
          <button
            onClick={() => setActiveTab('gradients')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'gradients'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Gradients ({gradients.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search collections..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Palettes List */}
      {activeTab === 'palettes' && (
        <>
          {filteredPalettes.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl p-8 space-y-4">
              <Bookmark className="w-8 h-8 text-neutral-400 mx-auto" />
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  No palettes saved yet
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
                  Generate color palettes in the studio, press "Save", and they will appear here safely in your local library.
                </p>
              </div>
              <button
                onClick={onNavigateToGenerator}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm"
              >
                Go to Palette Generator
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPalettes.map((palette) => (
                <div
                  key={palette.id}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Swatches Bar */}
                  <div className="h-28 w-full flex">
                    {palette.colors.map((c, i) => (
                      <div
                        key={i}
                        className="flex-1 h-full"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white truncate">
                        {palette.name}
                      </h3>
                      <span className="text-[10px] text-neutral-400 shrink-0 font-mono">
                        {new Date(palette.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {palette.tags && palette.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {palette.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopyCss(palette)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          title="Copy CSS"
                        >
                          {copiedId === palette.id ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          onClick={() => onDuplicatePalette(palette)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          title="Duplicate palette"
                        >
                          <CopyPlus className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDeletePalette(palette.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                          title="Delete palette"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => onLoadPalette(palette.colors)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Open in Generator <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Gradients List */}
      {activeTab === 'gradients' && (
        <>
          {filteredGradients.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl p-8 space-y-4">
              <Sparkles className="w-8 h-8 text-neutral-400 mx-auto" />
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  No gradients saved yet
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
                  Design beautiful multi-stop gradients in the Gradient Studio and save them here.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGradients.map((gradient) => {
                const bgCss = computeGradientBackground(gradient.config);
                return (
                  <div
                    key={gradient.id}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="h-32 w-full" style={{ background: bgCss }} />
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-neutral-900 dark:text-white truncate">
                          {gradient.name}
                        </h3>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {gradient.config.type}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`background: ${bgCss};`);
                              setCopiedId(gradient.id);
                              onCopyFeedback(`Copied CSS for "${gradient.name}"`);
                              setTimeout(() => setCopiedId(null), 1500);
                            }}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            title="Copy CSS"
                          >
                            {copiedId === gradient.id ? (
                              <Check className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => onDeleteGradient(gradient.id)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                            title="Delete gradient"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => onLoadGradient(gradient.config)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Open in Studio <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Confirmation Modal for Clear All */}
      {isConfirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Clear all saved collections?
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                This action will delete all your locally saved palettes and gradients. You can download an Export JSON backup first.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsConfirmClearOpen(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearAll();
                  setIsConfirmClearOpen(false);
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-sm"
              >
                Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
