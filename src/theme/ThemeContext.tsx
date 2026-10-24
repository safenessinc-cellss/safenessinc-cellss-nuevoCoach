import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { ThemeId, ThemePreset, ThemeTokens, THEME_PRESETS, DEFAULT_THEME, applyTheme } from './themes';
import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface ThemeContextType {
  themeId: ThemeId;
  tokens: ThemeTokens;
  preset: ThemePreset;
  presets: Record<ThemeId, ThemePreset>;
  setTheme: (id: ThemeId, persist?: boolean) => Promise<void>;
  setTokens: (tokens: Partial<ThemeTokens>, persist?: boolean) => Promise<void>;
  resetTheme: () => Promise<void>;
  saving: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const LS_KEY = 'coachiso_theme_v1';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(DEFAULT_THEME);
  const [tokens, setTokensState] = useState<ThemeTokens>(THEME_PRESETS[DEFAULT_THEME].tokens);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { themeId: ThemeId; tokens: ThemeTokens };
        if (parsed.themeId && THEME_PRESETS[parsed.themeId]) setThemeId(parsed.themeId);
        if (parsed.tokens) setTokensState(parsed.tokens);
      }
    } catch {}
    ;(async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'theme'));
        if (snap.exists()) {
          const d = snap.data() as any;
          if (d.themeId && THEME_PRESETS[d.themeId]) setThemeId(d.themeId);
          if (d.tokens) setTokensState(d.tokens);
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    const preset = THEME_PRESETS[themeId] || THEME_PRESETS[DEFAULT_THEME];
    applyTheme({ ...preset, tokens });
    try { localStorage.setItem(LS_KEY, JSON.stringify({ themeId, tokens })); } catch {}
  }, [themeId, tokens]);

  const persist = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'theme'), {
        themeId, tokens, updatedAt: serverTimestamp(),
      });
    } catch (e) { console.warn('No se pudo persistir tema (¿permisos?)', e); }
    finally { setSaving(false); }
  };

  const setTheme = async (id: ThemeId, persistRemote = true) => {
    setThemeId(id);
    setTokensState(THEME_PRESETS[id].tokens);
    if (persistRemote) await persist();
  };

  const setTokens = async (partial: Partial<ThemeTokens>, persistRemote = true) => {
    setTokensState(prev => ({ ...prev, ...partial }));
    if (persistRemote) await persist();
  };

  const resetTheme = async () => {
    setThemeId(DEFAULT_THEME);
    setTokensState(THEME_PRESETS[DEFAULT_THEME].tokens);
    await persist();
  };

  const value = useMemo(() => ({
    themeId, tokens, preset: THEME_PRESETS[themeId] || THEME_PRESETS[DEFAULT_THEME],
    presets: THEME_PRESETS, setTheme, setTokens, resetTheme, saving,
  }), [themeId, tokens, saving]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
