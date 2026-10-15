import React from 'react';
import { Sun, Moon, Sparkles, HelpCircle, Palette } from 'lucide-react';

interface HeaderProps {
  activeTab: 'generator' | 'gradient' | 'contrast' | 'inspiration' | 'collections' | 'export';
  setActiveTab: (tab: 'generator' | 'gradient' | 'contrast' | 'inspiration' | 'collections' | 'export') => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onQuickGenerate: () => void;
  onOpenShortcuts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  onQuickGenerate,
  onOpenShortcuts,
}) => {
  const navItems = [
    { id: 'generator', label: 'Generator' },
    { id: 'gradient', label: 'Gradient Studio' },
    { id: 'contrast', label: 'Contrast Checker' },
    { id: 'inspiration', label: 'Inspiration' },
    { id: 'collections', label: 'Collections' },
    { id: 'export', label: 'CSS Exporter' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActiveTab('generator')}
          className="flex items-center gap-2.5 text-left text-neutral-900 dark:text-white group shrink-0 focus-visible:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-pink-500 to-amber-400 p-[2px] shadow-sm flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-white dark:bg-neutral-950 rounded-[6px] flex items-center justify-center">
              <Palette className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
              ColorCraft
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenShortcuts}
            title="Keyboard shortcuts"
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            aria-label="Keyboard shortcuts"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
          </button>

          <button
            onClick={onQuickGenerate}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="flex md:hidden border-t border-neutral-200 dark:border-neutral-800/80 px-2 py-1.5 overflow-x-auto no-scrollbar gap-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
