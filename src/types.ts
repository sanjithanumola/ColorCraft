export type ColorFormat = 'hex' | 'rgb' | 'hsl';

export interface ColorItem {
  id: string;
  hex: string;
  locked: boolean;
  name: string;
}

export type HarmonyMode =
  | 'random'
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'monochromatic'
  | 'pastel'
  | 'vibrant'
  | 'dark';

export interface GradientStop {
  id: string;
  color: string;
  position: number; // 0 to 100
}

export interface GradientConfig {
  type: 'linear' | 'radial';
  angle: number; // 0 to 360 for linear
  radialShape: 'circle' | 'ellipse';
  radialPosition: string; // e.g. 'center', 'top left'
  stops: GradientStop[];
}

export interface SavedPalette {
  id: string;
  name: string;
  colors: string[];
  createdAt: number;
  tags?: string[];
  favorite?: boolean;
}

export interface SavedGradient {
  id: string;
  name: string;
  config: GradientConfig;
  createdAt: number;
  favorite?: boolean;
}

export interface CuratedPalette {
  id: string;
  name: string;
  category: 'minimal' | 'tech' | 'nature' | 'luxury' | 'pastel' | 'vibrant' | 'dark' | 'warm' | 'cool';
  colors: string[];
  description?: string;
}
