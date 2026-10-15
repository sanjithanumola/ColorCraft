import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, Sliders } from 'lucide-react';
import { ColorItem, GradientConfig } from '../types.ts';
import { getNearestColorName } from '../utils/colorUtils.ts';

interface CssExporterProps {
  currentColors: string[];
  currentGradient?: GradientConfig;
  onCopyFeedback: (text: string) => void;
}

type ExportFormat = 'css-variables' | 'semantic-css' | 'tailwind' | 'scss' | 'tokens-json';

export const CssExporter: React.FC<CssExporterProps> = ({
  currentColors,
  currentGradient,
  onCopyFeedback,
}) => {
  const [format, setFormat] = useState<ExportFormat>('css-variables');
  const [variablePrefix, setVariablePrefix] = useState('color');
  const [copied, setCopied] = useState(false);

  // Compute Gradient CSS if provided
  const gradientCss = currentGradient
    ? currentGradient.type === 'linear'
      ? `linear-gradient(${currentGradient.angle}deg, ${[...currentGradient.stops]
          .sort((a, b) => a.position - b.position)
          .map((s) => `${s.color} ${s.position}%`)
          .join(', ')})`
      : `radial-gradient(${currentGradient.radialShape} at ${currentGradient.radialPosition}, ${[
          ...currentGradient.stops,
        ]
          .sort((a, b) => a.position - b.position)
          .map((s) => `${s.color} ${s.position}%`)
          .join(', ')})`
    : `linear-gradient(135deg, ${currentColors[0] || '#6366F1'}, ${
        currentColors[currentColors.length - 1] || '#EC4899'
      })`;

  const semanticRoles = [
    'primary',
    'secondary',
    'accent',
    'surface',
    'background',
    'text',
    'muted',
    'border',
  ];

  const generateCode = (): string => {
    switch (format) {
      case 'css-variables': {
        const lines = currentColors.map(
          (c, i) =>
            `  --${variablePrefix}-${i + 1}: ${c}; /* ${getNearestColorName(c)} */`
        );
        lines.push(`  --${variablePrefix}-gradient: ${gradientCss};`);
        return `:root {\n${lines.join('\n')}\n}`;
      }

      case 'semantic-css': {
        const lines = currentColors.map((c, i) => {
          const role = semanticRoles[i] || `extra-${i + 1}`;
          return `  --${role}: ${c}; /* ${getNearestColorName(c)} */`;
        });
        lines.push(`  --gradient-main: ${gradientCss};`);
        return `:root {\n${lines.join('\n')}\n}`;
      }

      case 'tailwind': {
        const entries = currentColors
          .map((c, i) => {
            const role = semanticRoles[i] || `shade-${i + 1}`;
            return `      ${role}: '${c}', // ${getNearestColorName(c)}`;
          })
          .join('\n');
        return `// tailwind.config.js / @theme\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${entries}\n      },\n      backgroundImage: {\n        'brand-gradient': "${gradientCss}",\n      },\n    },\n  },\n};`;
      }

      case 'scss': {
        const lines = currentColors.map((c, i) => {
          const role = semanticRoles[i] || `color-${i + 1}`;
          return `$${role}: ${c}; // ${getNearestColorName(c)}`;
        });
        lines.push(`$gradient-brand: ${gradientCss};`);
        return `// SCSS Variables\n${lines.join('\n')}`;
      }

      case 'tokens-json': {
        const tokens: Record<string, any> = {
          color: {},
          gradient: {
            brand: { value: gradientCss, type: 'gradient' },
          },
        };
        currentColors.forEach((c, i) => {
          const role = semanticRoles[i] || `color-${i + 1}`;
          tokens.color[role] = {
            value: c,
            type: 'color',
            description: getNearestColorName(c),
          };
        });
        return JSON.stringify(tokens, null, 2);
      }

      default:
        return '';
    }
  };

  const outputCode = generateCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    onCopyFeedback('Copied code to clipboard!');
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const ext = format === 'tokens-json' ? 'json' : format === 'scss' ? 'scss' : format === 'tailwind' ? 'js' : 'css';
    const blob = new Blob([outputCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `colorcraft-theme.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
    onCopyFeedback(`Downloaded colorcraft-theme.${ext}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            CSS & Token Exporter
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Export production-ready CSS variables, Tailwind configurations, SCSS, and design tokens
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download File
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            Copy Code
          </button>
        </div>
      </div>

      {/* Live Palette Visual Header Strip */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
          Current Active Palette
        </span>
        <div className="flex h-12 w-full rounded-xl overflow-hidden shadow-inner border border-black/10 dark:border-white/10">
          {currentColors.map((hex, i) => (
            <div
              key={i}
              className="flex-1 h-full flex items-center justify-center"
              style={{ backgroundColor: hex }}
            >
              <span className="text-[10px] font-mono font-bold bg-black/40 text-white px-1 rounded backdrop-blur-xs opacity-0 hover:opacity-100 transition-opacity">
                {hex}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration & Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Format Settings (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5">
              Export Format
            </label>
            <div className="space-y-1.5">
              {[
                { id: 'css-variables', label: 'CSS Variables (:root)', desc: 'Standard --color-1, --color-2' },
                { id: 'semantic-css', label: 'Semantic CSS (:root)', desc: '--primary, --secondary, --accent' },
                { id: 'tailwind', label: 'Tailwind Config (JS)', desc: 'theme.extend.colors schema' },
                { id: 'scss', label: 'SCSS Variables', desc: '$primary, $secondary tokens' },
                { id: 'tokens-json', label: 'Design Tokens (JSON)', desc: 'W3C design token standard' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFormat(item.id as ExportFormat)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    format === item.id
                      ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 text-neutral-900 dark:text-white'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <span className="text-xs font-bold block">{item.label}</span>
                  <span className="text-[11px] text-neutral-500 mt-0.5 block">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Variable Prefix Input (if css-variables) */}
          {format === 'css-variables' && (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Variable Prefix
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2 text-xs font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded-l-lg border-y border-l border-neutral-300 dark:border-neutral-700">
                  --
                </span>
                <input
                  type="text"
                  value={variablePrefix}
                  onChange={(e) => setVariablePrefix(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                  placeholder="color"
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-r-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Code Viewer (8 cols) */}
        <div className="lg:col-span-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 bg-neutral-950/60">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono font-medium text-neutral-300">
                {format === 'tokens-json'
                  ? 'tokens.json'
                  : format === 'tailwind'
                  ? 'tailwind.config.js'
                  : format === 'scss'
                  ? '_variables.scss'
                  : 'styles.css'}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-300 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {/* Code Body */}
          <div className="p-5 font-mono text-xs text-neutral-200 overflow-x-auto min-h-[380px] bg-neutral-950 leading-relaxed selection:bg-indigo-600 selection:text-white">
            <pre>
              <code>{outputCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
