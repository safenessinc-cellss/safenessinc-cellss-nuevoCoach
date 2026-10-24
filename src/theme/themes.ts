export type ThemeId = 'corporate-dark' | 'corporate-light' | 'midnight' | 'ocean';

export interface ThemeTokens {
  bgBase: string;
  bgSurface: string;
  bgPanel: string;
  bgSection: string;
  accent: string;
  accent2: string;
  accent3: string;
  text: string;
  textMuted: string;
  border: string;
}

export interface ThemePreset {
  id: ThemeId;
  name: string;
  description: string;
  mode: 'dark' | 'light';
  tokens: ThemeTokens;
}

export const THEME_PRESETS: Record<ThemeId, ThemePreset> = {
  'corporate-dark': {
    id: 'corporate-dark',
    name: 'Corporate Dark',
    description: 'Navy profundo + teal + dorado. Sofisticado.',
    mode: 'dark',
    tokens: {
      bgBase: '#0A1628', bgSurface: '#0F1F35', bgPanel: '#152238', bgSection: '#0D1929',
      accent: '#0EA5A4', accent2: '#D4A574', accent3: '#6366F1',
      text: '#F1F5F9', textMuted: '#94A3B8', border: '#1E3A5F',
    },
  },
  'corporate-light': {
    id: 'corporate-light',
    name: 'Corporate Light',
    description: 'Blanco limpio + teal + dorado. Formal y legible.',
    mode: 'light',
    tokens: {
      bgBase: '#F7FAFC', bgSurface: '#FFFFFF', bgPanel: '#F1F5F9', bgSection: '#EEF4F8',
      accent: '#0EA5A4', accent2: '#B8860B', accent3: '#6366F1',
      text: '#0F172A', textMuted: '#64748B', border: '#E2E8F0',
    },
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Blue',
    description: 'Azul corporativo intenso con acento dorado.',
    mode: 'dark',
    tokens: {
      bgBase: '#0B1220', bgSurface: '#101A2E', bgPanel: '#16223A', bgSection: '#0D1526',
      accent: '#3B82F6', accent2: '#FBBF24', accent3: '#8B5CF6',
      text: '#E2E8F0', textMuted: '#94A3B8', border: '#1E2D4A',
    },
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    description: 'Verde azulado profundo con coral suave.',
    mode: 'dark',
    tokens: {
      bgBase: '#071A1E', bgSurface: '#0B262C', bgPanel: '#103138', bgSection: '#081F24',
      accent: '#14B8A6', accent2: '#FB7185', accent3: '#38BDF8',
      text: '#ECFEFF', textMuted: '#94A3B8', border: '#164E56',
    },
  },
};

export const DEFAULT_THEME: ThemeId = 'corporate-dark';

export function applyTheme(preset: ThemePreset) {
  const root = document.documentElement;
  const t = preset.tokens;
  root.style.setProperty('--theme-bg-base', t.bgBase);
  root.style.setProperty('--theme-bg-surface', t.bgSurface);
  root.style.setProperty('--theme-bg-panel', t.bgPanel);
  root.style.setProperty('--theme-bg-section', t.bgSection);
  root.style.setProperty('--theme-accent', t.accent);
  root.style.setProperty('--theme-accent-2', t.accent2);
  root.style.setProperty('--theme-accent-3', t.accent3);
  root.style.setProperty('--theme-text', t.text);
  root.style.setProperty('--theme-text-muted', t.textMuted);
  root.style.setProperty('--theme-border', t.border);
  root.setAttribute('data-theme-mode', preset.mode);
}
