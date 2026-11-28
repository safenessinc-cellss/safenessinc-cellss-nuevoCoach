import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Consent = { necessary: true; analytics: boolean; marketing: boolean; updatedAt: string };
const KEY = 'coachiso_cookie_consent_v1';
const readConsent = (): Consent | null => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) as Consent : null;
  } catch { return null; }
};

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent | null>(() => readConsent());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing (não ativo atualmente)] = useState(false);

  useEffect(() => {
    const open = () => setSettingsOpen(true);
    window.addEventListener('coachiso:cookie-settings', open);
    return () => window.removeEventListener('coachiso:cookie-settings', open);
  }, []);

  const save = (a: boolean, m: boolean) => {
    const value: Consent = { necessary: true, analytics: a, marketing: m, updatedAt: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(value));
    setConsent(value);
    setSettingsOpen(false);
  };

  if (consent && !settingsOpen) return null;
  return (
    <aside role="dialog" aria-modal="true" aria-labelledby="cookie-title" className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 text-slate-800 shadow-2xl sm:inset-x-6 sm:bottom-6">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Privacidade e transparência</p>
          <h2 id="cookie-title" className="mt-1 text-lg font-semibold">{settingsOpen ? 'Preferências de cookies' : 'Escolha como usamos cookies'}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Os recursos essenciais mantêm o site e o portal funcionando. No momento, o site não ativa ferramentas opcionais de análise ou publicidade. Se essas categorias forem introduzidas, dependerão de sua escolha prévia. Você pode rever sua preferência a qualquer momento.</p>
          <Link className="mt-2 inline-block text-sm font-medium text-blue-700 underline" to="/cookies">Ler a Política de Cookies</Link>
        </div>
        {settingsOpen && (
          <div className="grid gap-3 rounded-xl bg-slate-50 p-3 text-sm">
            <label className="flex items-start justify-between gap-4"><span><strong>Necessários</strong><span className="block text-xs text-slate-500">Segurança, navegação e preferências essenciais.</span></span><input type="checkbox" checked disabled aria-label="Cookies necessários sempre ativos" /></label>
            <label className="flex items-start justify-between gap-4"><span><strong>Análise (não ativa atualmente)</strong><span className="block text-xs text-slate-500">Medição de utilização para melhorar o site.</span></span><input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} /></label>
            <label className="flex items-start justify-between gap-4"><span><strong>Marketing</strong><span className="block text-xs text-slate-500">Personalização e medição de campanhas, se ativadas.</span></span><input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} /></label>
          </div>
        )}
        <div className="flex flex-wrap justify-end gap-2">
          {settingsOpen ? (
            <>
              <button onClick={() => save(false, false)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Rejeitar opcionais</button>
              <button onClick={() => save(analytics, marketing)} className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white">Salvar preferências</button>
            </>
          ) : (
            <>
              <button onClick={() => setSettingsOpen(true)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Personalizar</button>
              <button onClick={() => save(false, false)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Rejeitar opcionais</button>
              <button onClick={() => save(true, true)} className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white">Aceitar todos</button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
