/**
 * NumberCove theme — copy of OCEAN_FRESH preset (name kept as the preset slug,
 * only 2 accents overridden: highlight/next-target + success). Style = SOFT_UI.
 * NOTE: intentionally NOT declared `as const` — LinearGradient needs mutable
 * string[] color arrays (tsc TS2769 otherwise).
 */

export const theme = {
  name: 'OCEAN_FRESH',

  colors: {
    // light airy backgrounds (Menu / LevelMap / Settings)
    bg: {
      top: '#E8F4F8',
      mid: '#D1E7EE',
      bottom: '#B8DBE5',
      accent: '#9DCEDB',
    },
    // dark ocean (Loader) — visibly different from Menu (rule #14)
    dark: {
      top: '#00243B',
      mid: '#003A5C',
      bottom: '#00558B',
    },
    surface: '#FFFFFF',
    surfaceAlt: '#EAF6FA',
    ocean: {
      deep: '#00558B',
      wave: '#00A6CB',
      foam: '#7FE8C5',
    },
    highlight: '#FFB020', // next-target (override)
    success: '#2ED47A', // (override)
    error: '#FF5A5A',
    text: {
      primary: '#0A3D52',
      secondary: '#4A7A8C',
      muted: '#7FA9B8',
      onDark: '#EAF7FB',
      onDarkMuted: '#7FC6D9',
      inverse: '#FFFFFF',
    },
    border: '#B8DBE5',
    borderStrong: '#9DCEDB',
  },

  gradients: {
    // mutable string[] so <LinearGradient colors={...}> type-checks
    dark: ['#00243B', '#003A5C', '#00558B'] as string[],
    light: ['#E8F4F8', '#D1E7EE', '#B8DBE5'] as string[],
    lightSoft: ['#E8F4F8', '#C9E3EC'] as string[],
    cta: ['#00A6CB', '#00558B'] as string[],
    ctaDeep: ['#00558B', '#00A6CB'] as string[],
    progress: ['#00A6CB', '#7FE8C5'] as string[],
    win: ['#00A6CB', '#00558B'] as string[],
    lose: ['#4A7A8C', '#2E5464'] as string[],
  },

  radius: { sm: 8, md: 14, lg: 20, xl: 28, pill: 999 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },

  // SOFT_UI soft shadows
  shadow: {
    card: {
      shadowColor: '#00558B',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 3,
    },
    soft: {
      shadowColor: '#00558B',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    cta: {
      shadowColor: '#00558B',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 14,
      elevation: 8,
    },
  },
};

export type Theme = typeof theme;
