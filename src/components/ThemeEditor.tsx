import React from 'react';
import { useTheme } from '../theme/ThemeContext';
import { ThemeId } from '../theme/themes';
import { Palette, RotateCcw, Check, Save } from 'lucide-react';

const TOKEN_LABELS: Array<{ key: keyof ReturnType<typeof useTheme>['tokens']; label: string }> = [
  { key: 'bgBase', label: 'Fondo base' },
  { key: 'bgSurface', label: 'Superficie' },
  { key: 'bgPanel', label: 'Panel / tarjeta' },
  { key: 'bgSection', label: 'Sección alterna' },
  { key: 'accent', label: 'Acento principal' },
  { key: 'accent2', label: 'Acento secundario' },
  { key: 'accent3', label: 'Acento terciario' },
  { key: 'text', label: 'Texto principal' },
  { key: 'textMuted', label: 'Texto secundario' },
  { key: 'border', label: 'Bordes' },
];

export default function ThemeEditor() {
  const { themeId, tokens, presets, setTheme, setTokens, resetTheme, saving } = useTheme();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#00F0FF]" /> Apariencia y colores
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Los cambios se aplican en vivo y se guardan en Firestore (<code>/settings/theme</code>).
          </p>
        </div>
        <button
          onClick={resetTheme}
          className="text-xs px-3 py-2 rounded-xl border border-white/10 hover:border-white/30 text-gray-300 flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Restaurar
        </button>
      </header>

      <section>
        <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-3">Presets</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.keys(presets) as ThemeId[]).map(id => {
            const p = presets[id];
            const active = id === themeId;
            return (
              <button
                key={id}
                onClick={() => setTheme(id)}
                className={`text-left p-3 rounded-2xl border transition ${active ? 'border-[#00F0FF] ring-2 ring-[#00F0FF]/30' : 'border-white/10 hover:border-white/30'}`}
              >
                <div className="flex gap-1 mb-2">
                  {[p.tokens.bgBase, p.tokens.accent, p.tokens.accent2, p.tokens.accent3].map(c => (
                    <span key={c} className="w-5 h-5 rounded-full border border-white/10" style={{ background: c }} />
                  ))}
                </div>
                <p className="text-xs font-bold text-white flex items-center gap-1">
                  {p.name} {active && <Check className="w-3 h-3 text-[#00F0FF]" />}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">{p.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-3">Ajuste fino</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TOKEN_LABELS.map(({ key, label }) => (
            <label key={key} className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-black/20">
              <span className="text-xs text-gray-300">{label}</span>
              <span className="flex items-center gap-2">
                <input
                  type="color"
                  value={tokens[key]}
                  onChange={(e) => setTokens({ [key]: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                />
                <code className="text-[10px] text-gray-400 font-mono">{tokens[key]}</code>
              </span>
            </label>
          ))}
        </div>
      </section>

      <p className="text-[11px] text-gray-500 flex items-center gap-2">
        <Save className="w-3.5 h-3.5" />
        {saving ? 'Guardando…' : 'Guardado automático activo.'}
      </p>
    </div>
  );
}
