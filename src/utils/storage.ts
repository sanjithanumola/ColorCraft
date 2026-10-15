import { SavedPalette, SavedGradient, ColorFormat } from '../types.ts';

const PALETTES_KEY = 'colorcraft_saved_palettes_v1';
const GRADIENTS_KEY = 'colorcraft_saved_gradients_v1';
const PREFS_KEY = 'colorcraft_user_prefs_v1';
const RECENT_COLORS_KEY = 'colorcraft_recent_colors_v1';

export interface UserPreferences {
  theme: 'dark' | 'light';
  defaultFormat: ColorFormat;
  cssPrefix: string;
}

const DEFAULT_PREFS: UserPreferences = {
  theme: 'dark',
  defaultFormat: 'hex',
  cssPrefix: 'color',
};

// Safe storage wrapper
export function getStoredPalettes(): SavedPalette[] {
  try {
    const raw = localStorage.getItem(PALETTES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Could not read saved palettes from localStorage', err);
    return [];
  }
}

export function savePalettesToStorage(palettes: SavedPalette[]): boolean {
  try {
    localStorage.setItem(PALETTES_KEY, JSON.stringify(palettes));
    return true;
  } catch (err) {
    console.warn('Could not save palettes to localStorage', err);
    return false;
  }
}

export function getStoredGradients(): SavedGradient[] {
  try {
    const raw = localStorage.getItem(GRADIENTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Could not read saved gradients from localStorage', err);
    return [];
  }
}

export function saveGradientsToStorage(gradients: SavedGradient[]): boolean {
  try {
    localStorage.setItem(GRADIENTS_KEY, JSON.stringify(gradients));
    return true;
  } catch (err) {
    console.warn('Could not save gradients to localStorage', err);
    return false;
  }
}

export function getStoredPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch (err) {
    return DEFAULT_PREFS;
  }
}

export function savePreferencesToStorage(prefs: UserPreferences): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch (err) {
    console.warn('Could not save preferences to localStorage', err);
  }
}

export function getStoredRecentColors(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_COLORS_KEY);
    if (!raw) return ['#6366F1', '#EC4899', '#06B6D4', '#10B981', '#F59E0B', '#0F172A'];
    return JSON.parse(raw);
  } catch (err) {
    return ['#6366F1', '#EC4899', '#06B6D4', '#10B981', '#F59E0B', '#0F172A'];
  }
}

export function addRecentColorToStorage(hex: string): string[] {
  try {
    const existing = getStoredRecentColors().filter((c) => c.toUpperCase() !== hex.toUpperCase());
    const updated = [hex.toUpperCase(), ...existing].slice(0, 16);
    localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    return [];
  }
}
