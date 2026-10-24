import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, FileImage, Loader2, Save, Sparkles, Upload, X } from 'lucide-react';
import { analyzeCertificateImage, type ExtractedCertificate } from '../ai/geminiClient';
import { useCertificates } from '../data/useCertificates';

export default function CertificateAIImporter() {
  const { addCertificate } = useCertificates();
  const [fileName, setFileName] = useState('');
  const [draft, setDraft] = useState<ExtractedCertificate | null>(null);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setNotice({ type: 'error', text: 'Selecciona una imagen JPEG, PNG o WebP.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setNotice({ type: 'error', text: 'La imagen debe pesar como máximo 5 MB.' });
      return;
    }
    setBusy(true);
    setDraft(null);
    setNotice(null);
    setFileName(file.name);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('No se pudo leer la imagen.'));
        reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
        reader.readAsDataURL(file);
      });
      const result = await analyzeCertificateImage(dataUrl, file.type);
      setDraft(result);
      setNotice({ type: 'success', text: 'Extracción terminada. Revisa y corrige los datos antes de guardar.' });
    } catch (error) {
      setNotice({ type: 'error', text: error instanceof Error ? error.message : 'No se pudo analizar el certificado.' });
    } finally {
      setBusy(false);
    }
  };

  type EditableField = 'title' | 'issuer' | 'code' | 'issuedDate' | 'verificationUrl' | 'description';
  const edit = (field: EditableField, value: string) => {
    setDraft(previous => previous ? { ...previous, [field]: value } : previous);
  };

  const save = async () => {
    if (!draft || !draft.title.trim() || !draft.issuer.trim()) {
      setNotice({ type: 'error', text: 'Completa al menos el título y el emisor antes de guardar.' });
      return;
    }
    setSaving(true);
    setNotice(null);
    try {
      await addCertificate({ ...draft, title: draft.title.trim(), issuer: draft.issuer.trim(), verified: false });
      setNotice({ type: 'success', text: 'Credencial guardada. Queda marcada como no verificada hasta comprobarla en el emisor.' });
      setDraft(null);
      setFileName('');
    } catch (error) {
      setNotice({ type: 'error', text: error instanceof Error ? error.message : 'No se pudo guardar la credencial.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <header>
        <h2 className="flex items-center gap-2 text-xl font-extrabold text-white"><Sparkles className="h-5 w-5 text-amber-400" /> Importador de certificados con IA</h2>
        <p className="mt-2 text-sm text-gray-400">Carga una imagen legible, revisa los campos extraídos y confirma antes de guardarla. La IA no verifica la autenticidad del documento.</p>
      </header>

      <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 bg-white/[0.02] p-8 text-center transition hover:border-amber-400/50">
        {busy ? <Loader2 className="h-8 w-8 animate-spin text-amber-400" /> : <FileImage className="h-8 w-8 text-amber-400" />}
        <span className="text-sm font-semibold text-white">{busy ? 'Analizando certificado…' : 'Selecciona una imagen de certificado'}</span>
        <span className="text-xs text-gray-500">JPEG, PNG o WebP · máximo 5 MB</span>
        <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" disabled={busy || saving} onChange={handleFile} />
      </label>

      {fileName && <p className="text-xs text-gray-500">Archivo: {fileName}</p>}

      {draft && (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-white">Revisar datos extraídos</h3>
            <button type="button" onClick={() => { setDraft(null); setFileName(''); }} className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white" aria-label="Descartar borrador"><X className="h-4 w-4" /></button>
          </div>
          {([
            ['title', 'Título'],
            ['issuer', 'Emisor'],
            ['code', 'Código'],
            ['issuedDate', 'Fecha de emisión'],
            ['verificationUrl', 'URL de verificación'],
          ] as const).map(([field, label]) => (
            <label key={field} className="block space-y-1">
              <span className="text-xs font-medium text-gray-400">{label}</span>
              <input value={String(draft[field] || '')} onChange={event => edit(field, event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-amber-400" />
            </label>
          ))}
          <label className="block space-y-1">
            <span className="text-xs font-medium text-gray-400">Descripción</span>
            <textarea value={draft.description} onChange={event => edit('description', event.target.value)} rows={4} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-amber-400" />
          </label>
          <p className="text-xs text-amber-300">Confianza estimada de IA: {Math.round(draft.confidence * 100)}%. Este valor no equivale a una validación oficial.</p>
          <button type="button" disabled={saving || busy} onClick={save} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-black disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Guardando…' : 'Guardar credencial como no verificada'}
          </button>
        </div>
      )}

      {notice && <p role="status" className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${notice.type === 'success' ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300' : 'border-red-500/20 bg-red-500/5 text-red-300'}`}>
        {notice.type === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
        {notice.text}
      </p>}
      <p className="text-xs text-gray-500">Las credenciales importadas se guardan en Firestore y aparecen en la sección de certificados. Confirma la autenticidad con la organización emisora antes de presentarlas como oficiales.</p>
    </section>
  );
}
