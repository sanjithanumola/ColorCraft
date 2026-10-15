import React, { useState } from 'react';
import { Sparkles, Copy, Check, ArrowRight, Bookmark } from 'lucide-react';
import { CURATED_PALETTES } from '../utils/presets.ts';
import { CuratedPalette } from '../types.ts';

interface InspirationViewProps {
  onLoadPalette: (colors: string[]) => void;
  onSavePalette: (name: string, colors: string[], tags: string[]) => void;
  onCopyFeedback: (text: string) => void;
}

export const InspirationView: React.FC<InspirationViewProps> = ({
  onLoadPalette,
  onSavePalette,
  onCopyFeedback,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Curations' },
    { id: 'minimal', label: 'Minimal & Neutral' },
    { id: 'tech', label: 'Modern Tech' },
    { id: 'nature', label: 'Nature & Earth' },
    { id: 'luxury', label: 'Luxury & Premium' },
    { id: 'pastel', label: 'Pastel Dreams' },
    { id: 'vibrant', label: 'Vibrant & Bold' },
    { id: 'dark', label: 'Dark Interfaces' },
    { id: 'warm', label: 'Warm Tones' },
    { id: 'cool', label: 'Cool Tones' },
  ];

  const filtered =
    activeCategory === 'all'
      ? CURATED_PALETTES
      : CURATED_PALETTES.filter((p) => p.category === activeCategory);

  const handleCopyCss = (palette: CuratedPalette) => {
    const vars = palette.colors
      .map((c, i) => `  --color-${i + 1}: ${c};`)
      .join('\n');
    const css = `/* ${palette.name} */\n:root {\n${vars}\n}`;
    navigator.clipboard.writeText(css);
    setCopiedId(palette.id);
    onCopyFeedback(`Copied CSS for "${palette.name}"`);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Curated Inspiration
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
          Production-tested color schemes categorized by aesthetic direction and industry domain
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeCategory === cat.id
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Palettes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
          >
            {/* Color Strips */}
            <div className="h-32 w-full flex">
              {item.colors.map((c, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-full relative group/stripe transition-all hover:flex-[1.5]"
                  style={{ backgroundColor: c }}
                  title={c}
                >
                  <span className="opacity-0 group-hover/stripe:opacity-100 transition-opacity absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                    {c}
                  </span>
                </div>
              ))}
            </div>

            {/* Content & Actions */}
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.name}
                </h3>
                {item.description && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopyCss(item)}
                    className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="Copy CSS variables"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => onSavePalette(item.name, item.colors, [item.category])}
                    className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="Save to favorites"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => onLoadPalette(item.colors)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
                >
                  <span>Open in Generator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
