/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { PaletteGenerator } from './components/PaletteGenerator.tsx';
import { GradientStudio } from './components/GradientStudio.tsx';
import { ContrastChecker } from './components/ContrastChecker.tsx';
import { InspirationView } from './components/InspirationView.tsx';
import { CollectionsView } from './components/CollectionsView.tsx';
import { CssExporter } from './components/CssExporter.tsx';
import { Toast } from './components/Toast.tsx';
import { ShortcutsModal } from './components/ShortcutsModal.tsx';
import { SavedPalette, SavedGradient, GradientConfig, ColorFormat } from './types.ts';
import {
  getStoredPalettes,
  savePalettesToStorage,
  getStoredGradients,
  saveGradientsToStorage,
  getStoredPreferences,
  savePreferencesToStorage,
} from './utils/storage.ts';
import { generateRandomHex } from './utils/colorUtils.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'generator' | 'gradient' | 'contrast' | 'inspiration' | 'collections' | 'export'
  >('generator');

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [defaultFormat, setDefaultFormat] = useState<ColorFormat>('hex');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastColor, setToastColor] = useState<string | null>(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Active state to pass between generator, gradient, and exporter
  const [currentColors, setCurrentColors] = useState<string[]>([
    '#0F172A',
    '#312E81',
    '#4F46E5',
    '#60A5FA',
    '#38BDF8',
  ]);

  const [currentGradient, setCurrentGradient] = useState<GradientConfig>({
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

  // Local storage state
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  const [savedGradients, setSavedGradients] = useState<SavedGradient[]>([]);

  // Load preferences and storage on mount
  useEffect(() => {
    const prefs = getStoredPreferences();
    setTheme(prefs.theme || 'dark');
    setDefaultFormat(prefs.defaultFormat || 'hex');

    const palettes = getStoredPalettes();
    const gradients = getStoredGradients();

    // Seed default collection if user has none
    if (palettes.length === 0) {
      const seeded: SavedPalette[] = [
        {
          id: 'seed-1',
          name: 'Cyberpunk Horizon',
          colors: ['#0F172A', '#4338CA', '#06B6D4', '#10B981', '#F59E0B'],
          createdAt: Date.now() - 86400000,
          tags: ['neon', 'tech'],
          favorite: true,
        },
        {
          id: 'seed-2',
          name: 'Nordic Clay',
          colors: ['#292524', '#78716C', '#D6D3D1', '#E7E5E4', '#F5F5F4'],
          createdAt: Date.now() - 172800000,
          tags: ['editorial', 'minimal'],
        },
      ];
      setSavedPalettes(seeded);
      savePalettesToStorage(seeded);
    } else {
      setSavedPalettes(palettes);
    }

    if (gradients.length === 0) {
      const seededGradients: SavedGradient[] = [
        {
          id: 'grad-1',
          name: 'Hyper Sunrise',
          config: {
            type: 'linear',
            angle: 135,
            radialShape: 'ellipse',
            radialPosition: 'center',
            stops: [
              { id: '1', color: '#6366F1', position: 0 },
              { id: '2', color: '#EC4899', position: 50 },
              { id: '3', color: '#F59E0B', position: 100 },
            ],
          },
          createdAt: Date.now(),
        },
      ];
      setSavedGradients(seededGradients);
      saveGradientsToStorage(seededGradients);
    } else {
      setSavedGradients(gradients);
    }
  }, []);

  // Sync theme class with HTML document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    savePreferencesToStorage({
      theme: nextTheme,
      defaultFormat,
      cssPrefix: 'color',
    });
  };

  const showToast = (message: string, colorHex?: string) => {
    setToastMessage(message);
    setToastColor(colorHex || null);
    setTimeout(() => {
      setToastMessage(null);
      setToastColor(null);
    }, 2200);
  };

  // Palette Handlers
  const handleSavePalette = (name: string, colorsToSave: string[], tags: string[]) => {
    const newPalette: SavedPalette = {
      id: `palette-${Date.now()}`,
      name,
      colors: colorsToSave,
      createdAt: Date.now(),
      tags,
    };
    const updated = [newPalette, ...savedPalettes];
    setSavedPalettes(updated);
    savePalettesToStorage(updated);
  };

  const handleDeletePalette = (id: string) => {
    const updated = savedPalettes.filter((p) => p.id !== id);
    setSavedPalettes(updated);
    savePalettesToStorage(updated);
    showToast('Deleted palette');
  };

  const handleDuplicatePalette = (palette: SavedPalette) => {
    const copy: SavedPalette = {
      ...palette,
      id: `palette-${Date.now()}`,
      name: `${palette.name} (Copy)`,
      createdAt: Date.now(),
    };
    const updated = [copy, ...savedPalettes];
    setSavedPalettes(updated);
    savePalettesToStorage(updated);
    showToast(`Duplicated "${palette.name}"`);
  };

  const handleLoadPalette = (colorsToLoad: string[]) => {
    setCurrentColors(colorsToLoad);
    setActiveTab('generator');
    showToast('Loaded palette into Generator');
  };

  // Gradient Handlers
  const handleSaveGradient = (name: string, config: GradientConfig) => {
    const newGradient: SavedGradient = {
      id: `grad-${Date.now()}`,
      name,
      config,
      createdAt: Date.now(),
    };
    const updated = [newGradient, ...savedGradients];
    setSavedGradients(updated);
    saveGradientsToStorage(updated);
  };

  const handleDeleteGradient = (id: string) => {
    const updated = savedGradients.filter((g) => g.id !== id);
    setSavedGradients(updated);
    saveGradientsToStorage(updated);
    showToast('Deleted gradient');
  };

  const handleLoadGradient = (config: GradientConfig) => {
    setCurrentGradient(config);
    setActiveTab('gradient');
    showToast('Loaded gradient into Studio');
  };

  // Clear all
  const handleClearAllCollections = () => {
    setSavedPalettes([]);
    setSavedGradients([]);
    savePalettesToStorage([]);
    saveGradientsToStorage([]);
    showToast('Cleared all saved collections');
  };

  const handleImportCollections = (data: { palettes?: SavedPalette[]; gradients?: SavedGradient[] }) => {
    if (data.palettes && Array.isArray(data.palettes)) {
      setSavedPalettes(data.palettes);
      savePalettesToStorage(data.palettes);
    }
    if (data.gradients && Array.isArray(data.gradients)) {
      setSavedGradients(data.gradients);
      saveGradientsToStorage(data.gradients);
    }
  };

  // Quick Randomize from Top Bar
  const handleQuickShuffle = () => {
    if (activeTab === 'generator') {
      // Trigger a synthetic spacebar press to let the generator shuffle unlocked colors
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
    } else {
      const freshHexes = Array.from({ length: 5 }).map(() => generateRandomHex());
      setCurrentColors(freshHexes);
      setActiveTab('generator');
      showToast('Generated fresh palette');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors font-sans">
      {/* 3-Zone Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        onQuickGenerate={handleQuickShuffle}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'generator' && (
          <PaletteGenerator
            onCopyFeedback={showToast}
            onSavePalette={handleSavePalette}
            initialColors={currentColors}
            defaultFormat={defaultFormat}
            onNavigateToExport={() => setActiveTab('export')}
          />
        )}

        {activeTab === 'gradient' && (
          <GradientStudio
            onCopyFeedback={showToast}
            onSaveGradient={handleSaveGradient}
            onNavigateToExport={() => setActiveTab('export')}
          />
        )}

        {activeTab === 'contrast' && <ContrastChecker onCopyFeedback={showToast} />}

        {activeTab === 'inspiration' && (
          <InspirationView
            onLoadPalette={handleLoadPalette}
            onSavePalette={handleSavePalette}
            onCopyFeedback={showToast}
          />
        )}

        {activeTab === 'collections' && (
          <CollectionsView
            palettes={savedPalettes}
            gradients={savedGradients}
            onLoadPalette={handleLoadPalette}
            onLoadGradient={handleLoadGradient}
            onDeletePalette={handleDeletePalette}
            onDeleteGradient={handleDeleteGradient}
            onDuplicatePalette={handleDuplicatePalette}
            onClearAll={handleClearAllCollections}
            onImportData={handleImportCollections}
            onCopyFeedback={showToast}
            onNavigateToGenerator={() => setActiveTab('generator')}
          />
        )}

        {activeTab === 'export' && (
          <CssExporter
            currentColors={currentColors}
            currentGradient={currentGradient}
            onCopyFeedback={showToast}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 py-6 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">ColorCraft</span>
            <span aria-hidden="true">·</span>
            <span>Find your colors. Build your style.</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('generator')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Palette Generator
            </button>
            <button
              onClick={() => setActiveTab('gradient')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Gradient Studio
            </button>
            <button
              onClick={() => setActiveTab('contrast')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Contrast Checker
            </button>
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Shortcuts
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Feedback Toast */}
      <Toast message={toastMessage} colorPreview={toastColor} />

      {/* Shortcuts Modal */}
      <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
    </div>
  );
}
