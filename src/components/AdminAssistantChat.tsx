import React, { useState } from 'react';
import { Bot, Send, Loader2, UserRound, ShieldCheck, RotateCcw } from 'lucide-react';
import { auth } from '../firebase';

type Message = { role: 'user' | 'assistant'; text: string };
const welcome: Message = {
  role: 'assistant',
  text: 'Hola. Soy tu asistente de administración de Coach ISO. Puedes consultarme sobre tareas y problemas del panel, o pedirme que prepare un plan de trabajo. Por ahora esta ventana conversa y orienta; no modifica datos ni ejecuta comandos automáticamente.',
};

export default function AdminAssistantChat() {
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const send = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const message = input.trim();
    if (!message || busy) return;
    const history = messages.slice(-12).map(item => ({
      role: item.role === 'assistant' ? 'model' : 'user',
      text: item.text,
    }));
    setInput('');
    setError('');
    setMessages(prev => [...prev, { role: 'user', text: message }]);
    setBusy(true);
    try {
      if (!auth.currentUser) throw new Error('La sesión caducó. Inicia sesión de nuevo.');
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('/api/admin-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message, history }),
      });
      const payload = await response.json().catch(() => ({})) as { text?: string; error?: string };
      if (!response.ok) throw new Error(payload.error || 'No se pudo contactar con el asistente.');
      setMessages(prev => [...prev, { role: 'assistant', text: payload.text || 'No recibí respuesta. Inténtalo de nuevo.' }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Ocurrió un error inesperado.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[620px] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="flex items-center justify-between gap-4 border-b border-gray-200 bg-gray-50 px-5 py-4 md:px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><Bot className="h-6 w-6" /></div>
          <div><h3 className="font-semibold text-gray-900">Asistente del administrador</h3><p className="text-sm text-gray-600">Chat privado para personal autorizado</p></div>
        </div>
        <button type="button" onClick={() => { setMessages([welcome]); setError(''); }} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
          <RotateCcw className="h-4 w-4" /><span className="hidden sm:inline">Nueva conversación</span>
        </button>
      </header>
      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-6 md:px-7" aria-live="polite">
        {messages.map((item, index) => (
          <div key={`${item.role}-${index}`} className={`flex gap-3 ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {item.role === 'assistant' && <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700"><Bot className="h-5 w-5" /></div>}
            <div className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 md:max-w-[78%] ${item.role === 'user' ? 'rounded-tr-sm bg-blue-600 text-white' : 'rounded-tl-sm border border-gray-200 bg-gray-50 text-gray-800'}`}>{item.text}</div>
            {item.role === 'user' && <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700"><UserRound className="h-5 w-5" /></div>}
          </div>
        ))}
        {busy && <div className="flex items-center gap-3 text-sm text-gray-600"><Loader2 className="h-4 w-4 animate-spin text-blue-600" />Preparando respuesta…</div>}
        {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
      </div>
      <div className="border-t border-gray-200 bg-white p-4 md:p-6">
        <div className="mb-3 flex items-center gap-2 text-xs text-gray-500"><ShieldCheck className="h-4 w-4 text-green-700" />Acceso autenticado. Las acciones que cambien datos necesitarán permisos y confirmación.</div>
        <form onSubmit={send} className="flex items-end gap-2">
          <label htmlFor="admin-assistant-input" className="sr-only">Mensaje para el asistente</label>
          <textarea id="admin-assistant-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send(); } }} rows={2} maxLength={4000} placeholder="Pregunta por el panel o describe la tarea que necesitas…" className="min-h-[52px] flex-1 resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" disabled={busy} />
          <button type="submit" disabled={busy || !input.trim()} className="inline-flex h-[52px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-4 w-4" /><span className="hidden sm:inline">Enviar</span></button>
        </form>
        <p className="mt-2 text-xs text-gray-500">No envíes contraseñas, claves API ni datos sensibles de clientes.</p>
      </div>
    </section>
  );
}
