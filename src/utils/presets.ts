import { CuratedPalette, GradientConfig } from '../types.ts';

export const CURATED_PALETTES: CuratedPalette[] = [
  // Minimal and Neutral
  {
    id: 'neutral-bauhaus',
    name: 'Nordic Architecture',
    category: 'minimal',
    colors: ['#0F172A', '#334155', '#94A3B8', '#E2E8F0', '#F8FAFC'],
    description: 'Clean architectural grays with crisp stark contrast.',
  },
  {
    id: 'neutral-sand',
    name: 'Sandstone & Clay',
    category: 'minimal',
    colors: ['#292524', '#78716C', '#D6D3D1', '#E7E5E4', '#F5F5F4'],
    description: 'Understated organic neutrals suited for editorial layouts.',
  },
  {
    id: 'neutral-slate-accent',
    name: 'Swiss Monochrome',
    category: 'minimal',
    colors: ['#18181B', '#3F3F46', '#71717A', '#A1A1AA', '#FAFAFA'],
    description: 'High-discipline editorial grays with stark typographic balance.',
  },

  // Modern Technology
  {
    id: 'tech-indigo',
    name: 'Silicon Horizon',
    category: 'tech',
    colors: ['#0F172A', '#312E81', '#4F46E5', '#60A5FA', '#38BDF8'],
    description: 'Signature SaaS deep indigo paired with luminous cyan.',
  },
  {
    id: 'tech-cyber',
    name: 'Quantum Core',
    category: 'tech',
    colors: ['#020617', '#0F172A', '#06B6D4', '#10B981', '#E2E8F0'],
    description: 'Developer console palette featuring teal and emerald accents.',
  },
  {
    id: 'tech-ai',
    name: 'Neural Gradient',
    category: 'tech',
    colors: ['#1E1B4B', '#4338CA', '#818CF8', '#C084FC', '#F472B6'],
    description: 'Modern AI platform scheme with violet and rose highlights.',
  },

  // Nature and Earth Tones
  {
    id: 'nature-forest',
    name: 'Alpine Timber',
    category: 'nature',
    colors: ['#14532D', '#166534', '#15803D', '#84CC16', '#FEF08A'],
    description: 'Rich pine greens transitioning into warm golden sunlight.',
  },
  {
    id: 'nature-savanna',
    name: 'Serengeti Dusk',
    category: 'nature',
    colors: ['#451A03', '#9A3412', '#C2410C', '#EA580C', '#FED7AA'],
    description: 'Earthy terracotta, warm clay, and acacia bark tones.',
  },
  {
    id: 'nature-coast',
    name: 'Pacific Shoreline',
    category: 'nature',
    colors: ['#082F49', '#0369A1', '#0284C7', '#38BDF8', '#E0F2FE'],
    description: 'Deep ocean currents meeting crisp ocean foam.',
  },

  // Luxury & Premium Branding
  {
    id: 'luxury-noir-gold',
    name: 'Haute Horlogerie',
    category: 'luxury',
    colors: ['#000000', '#1C1917', '#78350F', '#B45309', '#FDE68A'],
    description: 'Onyx black and burnished champagnes for prestige branding.',
  },
  {
    id: 'luxury-emerald-brass',
    name: 'Imperial Velour',
    category: 'luxury',
    colors: ['#022C22', '#064E3B', '#047857', '#D97706', '#FEF3C7'],
    description: 'Heritage racing green complemented by antique brass.',
  },
  {
    id: 'luxury-merlot',
    name: 'Reserve Bordeaux',
    category: 'luxury',
    colors: ['#4A0404', '#7F1D1D', '#991B1B', '#D97706', '#F5F5F4'],
    description: 'Deep aged vintage red paired with warm stone accents.',
  },

  // Pastel Designs
  {
    id: 'pastel-sorbet',
    name: 'Matcha Gelato',
    category: 'pastel',
    colors: ['#D1FAE5', '#FEF08A', '#FED7AA', '#FBCFE8', '#E0E7FF'],
    description: 'Gentle confectionary tones with airy lightness.',
  },
  {
    id: 'pastel-lavender',
    name: 'Lavender Dusk',
    category: 'pastel',
    colors: ['#EDE9FE', '#DDD6FE', '#C4B5FD', '#FCE7F3', '#FFF1F2'],
    description: 'Soft calming lilacs and muted blush tones.',
  },
  {
    id: 'pastel-oasis',
    name: 'Cloud Oasis',
    category: 'pastel',
    colors: ['#CFFAFE', '#BAE6FD', '#E0E7FF', '#F3E8FF', '#FAE8FF'],
    description: 'Airy blues and soft purples designed for approachable interfaces.',
  },

  // Vibrant and Energetic
  {
    id: 'vibrant-sunset',
    name: 'Neon Sunrise',
    category: 'vibrant',
    colors: ['#7C3AED', '#EC4899', '#F43F5E', '#F97316', '#FACC15'],
    description: 'High-energy gradient spectrum for music and creative brands.',
  },
  {
    id: 'vibrant-tokyo',
    name: 'Tokyo Arcade',
    category: 'vibrant',
    colors: ['#0F172A', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'],
    description: 'Bold primary electric accents over dark asphalt.',
  },
  {
    id: 'vibrant-tropical',
    name: 'Tropic Tropic',
    category: 'vibrant',
    colors: ['#047857', '#0D9488', '#0284C7', '#E11D48', '#FB7185'],
    description: 'Vivid botanical greens and punchy hibiscus pinks.',
  },

  // Dark Interfaces
  {
    id: 'dark-obsidian',
    name: 'Obsidian Pulse',
    category: 'dark',
    colors: ['#09090B', '#18181B', '#27272A', '#3F3F46', '#6366F1'],
    description: 'Multi-layer dark mode surfaces with high-visibility indigo focus.',
  },
  {
    id: 'dark-terminal',
    name: 'Matrix Cyber',
    category: 'dark',
    colors: ['#030712', '#111827', '#1F2937', '#10B981', '#34D399'],
    description: 'Deep terminal blacks with crisp emerald phosphor status.',
  },

  // Warm Palettes
  {
    id: 'warm-ember',
    name: 'Canyon Flame',
    category: 'warm',
    colors: ['#7C2D12', '#9A3412', '#EA580C', '#F97316', '#FDE047'],
    description: 'Warm glowing gradient from hearth ember to sunny warmth.',
  },
  {
    id: 'warm-terracotta',
    name: 'Tuscan Clay',
    category: 'warm',
    colors: ['#431407', '#7C2D12', '#B45309', '#D97706', '#FEF3C7'],
    description: 'Rustic sunbaked clay, cedar, and raw amber.',
  },

  // Cool Palettes
  {
    id: 'cool-glacier',
    name: 'Glacial Fjord',
    category: 'cool',
    colors: ['#082F49', '#0C4A6E', '#0284C7', '#38BDF8', '#BAE6FD'],
    description: 'Crisp freezing blues from abyss deep to glacial shimmer.',
  },
  {
    id: 'cool-mist',
    name: 'Nordic Morning',
    category: 'cool',
    colors: ['#1E293B', '#334155', '#475569', '#64748B', '#CBD5E1'],
    description: 'Calm overcast coastal tones with timeless restraint.',
  },
];

export const PRESET_GRADIENTS: { name: string; config: GradientConfig }[] = [
  {
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
  },
  {
    name: 'Cyberpunk Violet',
    config: {
      type: 'linear',
      angle: 90,
      radialShape: 'ellipse',
      radialPosition: 'center',
      stops: [
        { id: '1', color: '#0F172A', position: 0 },
        { id: '2', color: '#581C87', position: 50 },
        { id: '3', color: '#06B6D4', position: 100 },
      ],
    },
  },
  {
    name: 'Oceanic Abyss',
    config: {
      type: 'linear',
      angle: 180,
      radialShape: 'circle',
      radialPosition: 'center',
      stops: [
        { id: '1', color: '#0369A1', position: 0 },
        { id: '2', color: '#0F172A', position: 100 },
      ],
    },
  },
  {
    name: 'Neon Aurora',
    config: {
      type: 'linear',
      angle: 45,
      radialShape: 'ellipse',
      radialPosition: 'center',
      stops: [
        { id: '1', color: '#059669', position: 0 },
        { id: '2', color: '#10B981', position: 35 },
        { id: '3', color: '#06B6D4', position: 100 },
      ],
    },
  },
  {
    name: 'Velvet Plum',
    config: {
      type: 'radial',
      angle: 135,
      radialShape: 'circle',
      radialPosition: 'center',
      stops: [
        { id: '1', color: '#701A75', position: 0 },
        { id: '2', color: '#1E1B4B', position: 100 },
      ],
    },
  },
  {
    name: 'Peach Dream',
    config: {
      type: 'linear',
      angle: 120,
      radialShape: 'ellipse',
      radialPosition: 'center',
      stops: [
        { id: '1', color: '#F43F5E', position: 0 },
        { id: '2', color: '#FB923C', position: 60 },
        { id: '3', color: '#FDE047', position: 100 },
      ],
    },
  },
  {
    name: 'Cosmic Stardust',
    config: {
      type: 'linear',
      angle: 225,
      radialShape: 'ellipse',
      radialPosition: 'center',
      stops: [
        { id: '1', color: '#18181B', position: 0 },
        { id: '2', color: '#4338CA', position: 50 },
        { id: '3', color: '#C084FC', position: 100 },
      ],
    },
  },
  {
    name: 'Rose Gold Lustre',
    config: {
      type: 'linear',
      angle: 135,
      radialShape: 'ellipse',
      radialPosition: 'center',
      stops: [
        { id: '1', color: '#BE185D', position: 0 },
        { id: '2', color: '#F472B6', position: 50 },
        { id: '3', color: '#FED7AA', position: 100 },
      ],
    },
  },
  {
    name: 'Emerald Shine',
    config: {
      type: 'linear',
      angle: 90,
      radialShape: 'ellipse',
      radialPosition: 'center',
      stops: [
        { id: '1', color: '#064E3B', position: 0 },
        { id: '2', color: '#047857', position: 50 },
        { id: '3', color: '#34D399', position: 100 },
      ],
    },
  },
];
