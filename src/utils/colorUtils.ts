// ColorCraft Utility Functions for Color Conversions, Harmonies, and WCAG Calculations

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number; // 0 - 360
  s: number; // 0 - 100
  l: number; // 0 - 100
}

export interface HSV {
  h: number; // 0 - 360
  s: number; // 0 - 100
  v: number; // 0 - 100
}

export interface CMYK {
  c: number; // 0 - 100
  m: number; // 0 - 100
  y: number; // 0 - 100
  k: number; // 0 - 100
}

// Validation & Normalization
export function isValidHex(hex: string): boolean {
  return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex.trim());
}

export function normalizeHex(hex: string): string {
  let clean = hex.trim().replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean.split('').map((char) => char + char).join('');
  }
  return `#${clean.toUpperCase()}`;
}

export function hexToRgb(hex: string): RGB {
  const norm = normalizeHex(hex).slice(1);
  const num = parseInt(norm, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  const toHex = (val: number) => clamp(val).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  const hNorm = ((h % 360) + 360) % 360 / 360;
  const sNorm = Math.max(0, Math.min(100, s)) / 100;
  const lNorm = Math.max(0, Math.min(100, l)) / 100;

  if (sNorm === 0) {
    const val = Math.round(lNorm * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tNorm = t;
    if (tNorm < 0) tNorm += 1;
    if (tNorm > 1) tNorm -= 1;
    if (tNorm < 1 / 6) return p + (q - p) * 6 * tNorm;
    if (tNorm < 1 / 2) return q;
    if (tNorm < 2 / 3) return p + (q - p) * (2 / 3 - tNorm) * 6;
    return p;
  };

  const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
  const p = 2 * lNorm - q;

  const r = hue2rgb(p, q, hNorm + 1 / 3);
  const g = hue2rgb(p, q, hNorm);
  const b = hue2rgb(p, q, hNorm - 1 / 3);

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function hexToHsl(hex: string): HSL {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

export function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

export function rgbToHsv(r: number, g: number, b: number): HSV {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

export function rgbToCmyk(r: number, g: number, b: number): CMYK {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }
  const c = (1 - rNorm - k) / (1 - k);
  const m = (1 - gNorm - k) / (1 - k);
  const y = (1 - bNorm - k) / (1 - k);
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

export function formatColorValue(hex: string, format: 'hex' | 'rgb' | 'hsl'): string {
  if (!isValidHex(hex)) return hex;
  const { r, g, b } = hexToRgb(hex);
  if (format === 'hex') return normalizeHex(hex);
  if (format === 'rgb') return `rgb(${r}, ${g}, ${b})`;
  if (format === 'hsl') {
    const { h, s, l } = rgbToHsl(r, g, b);
    return `hsl(${h}, ${s}%, ${l}%)`;
  }
  return normalizeHex(hex);
}

// WCAG Relative Luminance
// Formula: https://www.w3.org/TR/WCAG20/#relativeluminancedef
export function getRelativeLuminance(hex: string): number {
  if (!isValidHex(hex)) return 0;
  const { r, g, b } = hexToRgb(hex);
  const transform = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const rL = transform(r);
  const gL = transform(g);
  const bL = transform(b);
  return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
}

// WCAG Contrast Ratio
// Formula: (L1 + 0.05) / (L2 + 0.05)
export function getContrastRatio(foregroundHex: string, backgroundHex: string): number {
  if (!isValidHex(foregroundHex) || !isValidHex(backgroundHex)) return 1;
  const l1 = getRelativeLuminance(foregroundHex);
  const l2 = getRelativeLuminance(backgroundHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Return either pure white or deep slate for optimal text contrast on any swatch
export function getContrastingTextColor(backgroundHex: string): string {
  const ratioWithWhite = getContrastRatio('#FFFFFF', backgroundHex);
  const ratioWithBlack = getContrastRatio('#0F172A', backgroundHex);
  return ratioWithWhite >= ratioWithBlack ? '#FFFFFF' : '#0F172A';
}

// Suggest a color that hits target contrast ratio (e.g. 4.5 for AA or 7.0 for AAA)
export function suggestImprovedContrastColor(
  fgHex: string,
  bgHex: string,
  targetRatio: number
): { hex: string; ratio: number } | null {
  if (!isValidHex(fgHex) || !isValidHex(bgHex)) return null;

  const currentRatio = getContrastRatio(fgHex, bgHex);
  if (currentRatio >= targetRatio) {
    return { hex: fgHex, ratio: currentRatio };
  }

  const fgHsl = hexToHsl(fgHex);
  const bgLum = getRelativeLuminance(bgHex);
  
  // Decide whether to make FG lighter or darker
  // If BG is dark (lum < 0.5), light FG is usually best, else dark FG
  const shouldLighten = bgLum < 0.5;

  let bestHex = fgHex;
  let bestRatio = currentRatio;

  if (shouldLighten) {
    for (let l = fgHsl.l; l <= 100; l += 2) {
      const candidate = hslToHex(fgHsl.h, fgHsl.s, l);
      const ratio = getContrastRatio(candidate, bgHex);
      if (ratio >= targetRatio) {
        return { hex: candidate, ratio };
      }
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestHex = candidate;
      }
    }
  } else {
    for (let l = fgHsl.l; l >= 0; l -= 2) {
      const candidate = hslToHex(fgHsl.h, fgHsl.s, l);
      const ratio = getContrastRatio(candidate, bgHex);
      if (ratio >= targetRatio) {
        return { hex: candidate, ratio };
      }
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestHex = candidate;
      }
    }
  }

  return { hex: bestHex, ratio: bestRatio };
}

// Curated Color Name Dictionary for Named Swatches
const COLOR_DICTIONARY: { name: string; hex: string }[] = [
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Snow', hex: '#F8FAFC' },
  { name: 'Slate Gray', hex: '#64748B' },
  { name: 'Charcoal', hex: '#334155' },
  { name: 'Midnight', hex: '#0F172A' },
  { name: 'Pure Black', hex: '#000000' },
  { name: 'Crimson Flame', hex: '#EF4444' },
  { name: 'Ruby Wine', hex: '#991B1B' },
  { name: 'Coral Sunrise', hex: '#F87171' },
  { name: 'Blush Rose', hex: '#FB7185' },
  { name: 'Electric Sunset', hex: '#F97316' },
  { name: 'Tangerine', hex: '#EA580C' },
  { name: 'Peach Glow', hex: '#FDBA74' },
  { name: 'Amber Gold', hex: '#F59E0B' },
  { name: 'Warm Marigold', hex: '#D97706' },
  { name: 'Canary Yellow', hex: '#EAB308' },
  { name: 'Lime Zest', hex: '#84CC16' },
  { name: 'Emerald Forest', hex: '#10B981' },
  { name: 'Mint Meadow', hex: '#34D399' },
  { name: 'Deep Sage', hex: '#065F46' },
  { name: 'Teal Lagoon', hex: '#14B8A6' },
  { name: 'Aquamarine', hex: '#2DD4BF' },
  { name: 'Cyan Wave', hex: '#06B6D4' },
  { name: 'Sky Breeze', hex: '#0EA5E9' },
  { name: 'Azure Ocean', hex: '#38BDF8' },
  { name: 'Cobalt Royal', hex: '#2563EB' },
  { name: 'Indigo Dusk', hex: '#6366F1' },
  { name: 'Deep Iris', hex: '#4F46E5' },
  { name: 'Mystic Violet', hex: '#8B5CF6' },
  { name: 'Velvet Purple', hex: '#7C3AED' },
  { name: 'Electric Orchid', hex: '#A855F7' },
  { name: 'Neon Fuchsia', hex: '#D946EF' },
  { name: 'Hot Pink', hex: '#EC4899' },
  { name: 'Rose Petal', hex: '#F43F5E' },
  { name: 'Sand Drift', hex: '#D6D3D1' },
  { name: 'Warm Taupe', hex: '#A8A29E' },
  { name: 'Terracotta', hex: '#C2410C' },
  { name: 'Copper Rust', hex: '#B45309' },
  { name: 'Olive Grove', hex: '#4D7C0F' },
  { name: 'Nordic Sea', hex: '#0284C7' },
  { name: 'Cyber Mint', hex: '#6EE7B7' },
  { name: 'Lilac Cloud', hex: '#C084FC' },
  { name: 'Desert Dune', hex: '#E7E5E4' },
  { name: 'Espresso', hex: '#451A03' },
];

export function getNearestColorName(hex: string): string {
  if (!isValidHex(hex)) return 'Custom Color';
  const rgb = hexToRgb(hex);

  let minDistance = Infinity;
  let nearestName = 'Color';

  for (const item of COLOR_DICTIONARY) {
    const itemRgb = hexToRgb(item.hex);
    // Weighted Euclidean distance for human perception
    const rDiff = rgb.r - itemRgb.r;
    const gDiff = rgb.g - itemRgb.g;
    const bDiff = rgb.b - itemRgb.b;
    const distance = 0.3 * (rDiff * rDiff) + 0.59 * (gDiff * gDiff) + 0.11 * (bDiff * bDiff);
    if (distance < minDistance) {
      minDistance = distance;
      nearestName = item.name;
    }
  }

  return nearestName;
}

// Generate Random Harmonious Palette
export function generateRandomHex(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function generateHarmoniousPalette(
  baseHex: string,
  count: number,
  mode: string
): string[] {
  const cleanBase = isValidHex(baseHex) ? normalizeHex(baseHex) : '#6366F1';
  const { h, s, l } = hexToHsl(cleanBase);
  const colors: string[] = [];

  switch (mode) {
    case 'complementary': {
      // Base hue and opposite hue (180deg) with step variations in lightness and saturation
      for (let i = 0; i < count; i++) {
        const isComp = i >= Math.ceil(count / 2);
        const hue = isComp ? (h + 180) % 360 : h;
        const indexInGroup = isComp ? i - Math.ceil(count / 2) : i;
        const totalInGroup = isComp ? count - Math.ceil(count / 2) : Math.ceil(count / 2);
        const light = 25 + (50 * indexInGroup) / Math.max(1, totalInGroup - 1 || 1);
        const sat = Math.max(35, Math.min(95, s + (indexInGroup % 2 === 0 ? 5 : -10)));
        colors.push(hslToHex(hue, sat, Math.round(light)));
      }
      break;
    }
    case 'analogous': {
      // Adjacent hues within +- 40 degrees
      const step = 60 / Math.max(1, count - 1);
      for (let i = 0; i < count; i++) {
        const hue = (h - 30 + i * step + 360) % 360;
        const light = Math.max(25, Math.min(85, l + (i % 2 === 0 ? 8 : -8) * (i / count)));
        colors.push(hslToHex(hue, Math.max(40, s), Math.round(light)));
      }
      break;
    }
    case 'triadic': {
      // Three hues 120deg apart
      const triadHues = [h, (h + 120) % 360, (h + 240) % 360];
      for (let i = 0; i < count; i++) {
        const hue = triadHues[i % 3];
        const light = Math.max(25, Math.min(85, 30 + ((i * 55) % 60)));
        const sat = Math.max(45, Math.min(90, s + (i % 2 === 0 ? 0 : -15)));
        colors.push(hslToHex(hue, sat, Math.round(light)));
      }
      break;
    }
    case 'split-complementary': {
      // Base hue + (base + 150) + (base + 210)
      const splitHues = [h, (h + 150) % 360, (h + 210) % 360];
      for (let i = 0; i < count; i++) {
        const hue = splitHues[i % 3];
        const light = Math.max(25, Math.min(85, 35 + ((i * 45) % 55)));
        colors.push(hslToHex(hue, Math.max(45, s), Math.round(light)));
      }
      break;
    }
    case 'monochromatic': {
      // Same hue, varying lightness and saturation
      const minL = 18;
      const maxL = 88;
      const stepL = (maxL - minL) / Math.max(1, count - 1);
      for (let i = 0; i < count; i++) {
        const light = minL + i * stepL;
        const sat = Math.max(25, Math.min(95, s + (i % 2 === 0 ? 10 : -10)));
        colors.push(hslToHex(h, sat, Math.round(light)));
      }
      break;
    }
    case 'pastel': {
      // High lightness (75-90%), gentle saturation (40-65%)
      const baseHue = Math.floor(Math.random() * 360);
      const step = 360 / count;
      for (let i = 0; i < count; i++) {
        const hue = (baseHue + i * step) % 360;
        const light = 78 + (i % 3) * 4;
        const sat = 45 + (i % 2) * 15;
        colors.push(hslToHex(hue, sat, light));
      }
      break;
    }
    case 'vibrant': {
      // High saturation (80-100%), medium lightness (45-60%)
      const baseHue = Math.floor(Math.random() * 360);
      const goldenRatio = 0.618033988749895;
      for (let i = 0; i < count; i++) {
        const hue = Math.round((baseHue + i * goldenRatio * 360) % 360);
        const light = 48 + (i % 2) * 8;
        const sat = 85 + (i % 3) * 5;
        colors.push(hslToHex(hue, sat, light));
      }
      break;
    }
    case 'dark': {
      // Deep surfaces with 1 or 2 glowing accents
      for (let i = 0; i < count; i++) {
        if (i === 0) {
          colors.push(hslToHex(h, 25, 10)); // deep dark background
        } else if (i === 1) {
          colors.push(hslToHex(h, 20, 18)); // elevated surface
        } else if (i === 2) {
          colors.push(hslToHex(h, 15, 32)); // border/muted
        } else if (i === count - 1) {
          colors.push(hslToHex(h, 90, 60)); // primary neon accent
        } else {
          colors.push(hslToHex((h + 60 * i) % 360, 80, 65)); // secondary accents
        }
      }
      break;
    }
    case 'random':
    default: {
      // Harmonious random using golden ratio hue progression
      const startHue = Math.floor(Math.random() * 360);
      const goldenRatio = 0.618033988749895;
      for (let i = 0; i < count; i++) {
        const hue = Math.round((startHue + i * goldenRatio * 360) % 360);
        const sat = 55 + Math.floor(Math.random() * 35);
        const light = 35 + Math.floor(Math.random() * 45);
        colors.push(hslToHex(hue, sat, light));
      }
      break;
    }
  }

  // Ensure first color matches baseHex if user selected a base color
  if (colors.length > 0 && isValidHex(baseHex) && mode !== 'random' && mode !== 'pastel' && mode !== 'vibrant') {
    colors[0] = cleanBase;
  }

  return colors.slice(0, count);
}

// 10 Shades & Tints generator for a given color
export function generateTintsAndShades(hex: string): { tints: string[]; shades: string[] } {
  const norm = normalizeHex(hex);
  const rgb = hexToRgb(norm);
  const tints: string[] = [];
  const shades: string[] = [];

  for (let i = 1; i <= 5; i++) {
    const factor = i * 0.18;
    // Tint: mix with white (255, 255, 255)
    const tR = Math.round(rgb.r + (255 - rgb.r) * factor);
    const tG = Math.round(rgb.g + (255 - rgb.g) * factor);
    const tB = Math.round(rgb.b + (255 - rgb.b) * factor);
    tints.push(rgbToHex(tR, tG, tB));

    // Shade: mix with black (0, 0, 0)
    const sR = Math.round(rgb.r * (1 - factor));
    const sG = Math.round(rgb.g * (1 - factor));
    const sB = Math.round(rgb.b * (1 - factor));
    shades.push(rgbToHex(sR, sG, sB));
  }

  return { tints, shades };
}
