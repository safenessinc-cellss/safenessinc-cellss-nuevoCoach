import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, CheckCircle2, FileImage, Loader2, Save, Sparkles, Upload, X } from 'lucide-react';
import { analyzeCertificateImage, type ExtractedCertificate } from '../ai/geminiClient';
import { useCertificates } from '../data/useCertificates';


async function compressCertificateImage(dataUrl: string): Promise<string> {
  const image = new Image();
  const imageLoaded = new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('No se pudo procesar la imagen del certificado.'));
  });
  image.src = dataUrl;
  await imageLoaded;

  const maxDimension = 1200;
  const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('El navegador no pudo preparar la miniatura del certificado.');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  let quality = 0.78;
  let compressed = canvas.toDataURL('image/jpeg', quality);
  const byteLength = (value: string) => Math.ceil((value.split(',')[1]?.length || 0) * 3 / 4);
  while (byteLength(compressed) > 260_000 && quality > 0.38) {
    quality -= 0.1;
    compressed = canvas.toDataURL('image/jpeg', quality);
  }
  if (byteLength(compressed) > 300_000) {
    throw new Error('La imagen no se pudo reducir lo suficiente. Prueba con una foto más pequeña.');
  }
  return compressed;
}


async function createCertificateThumbnail(dataUrl: string): Promise<string> {
  const image = new Image();
  const imageLoaded = new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('No se pudo preparar la miniatura del certificado.'));
  });
  image.src = dataUrl;
  await imageLoaded;

  const maxDimension = 360;
  const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('El navegador no pudo crear la miniatura del certificado.');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  let quality = 0.58;
  let thumbnail = canvas.toDataURL('image/jpeg', quality);
  const byteLength = (value: string) => Math.ceil((value.split(',')[1]?.length || 0) * 3 / 4);
  while (byteLength(thumbnail) > 40_000 && quality > 0.28) {
    quality -= 0.08;
    thumbnail = canvas.toDataURL('image/jpeg', quality);
  }
  if (byteLength(thumbnail) > 45_000) {
    throw new Error('No se pudo reducir la miniatura del certificado. Prueba con una foto más pequeña.');
  }
  return thumbnail;
}

export default function CertificateAIImporter() {
  const { t } = useTranslation();
  const { addCertificate } = useCertificates();
  const [fileName, setFileName] = useState('');
  const [certificatePreview, setCertificatePreview] = useState<string>('');
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
    setCertificatePreview('');
    setNotice(null);
    setFileName(file.name);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('No se pudo leer la imagen.'));
        reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
        reader.readAsDataURL(file);
      });
      // Compress before sending to the API (avoids the request-body limit) and keep a small preview for the PDF.
      const compressedDataUrl = await compressCertificateImage(dataUrl);
      const result = await analyzeCertificateImage(compressedDataUrl, 'image/jpeg');
      // Keep only a tiny preview in Firestore; the full-resolution photo is not persisted.
      const thumbnailDataUrl = await createCertificateThumbnail(compressedDataUrl);
      setCertificatePreview(thumbnailDataUrl);
      setDraft({ ...result, publicProfileUrl: result.publicProfileUrl || 'https://www.coach-iso.eu/' });
      setNotice({ type: 'success', text: 'Extracción terminada. Revisa y corrige los datos antes de guardar.' });
    } catch (error) {
      setNotice({ type: 'error', text: error instanceof Error ? error.message : 'No se pudo analizar el certificado.' });
    } finally {
      setBusy(false);
    }
  };

  type EditableField = 'title' | 'issuer' | 'code' | 'issuedDate' | 'verificationUrl' | 'publicProfileUrl' | 'description';
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
      await addCertificate({ ...draft, title: draft.title.trim(), issuer: draft.issuer.trim(), publicProfileUrl: draft.publicProfileUrl?.trim() || 'https://www.coach-iso.eu/', imageDataUrl: certificatePreview, verified: false });
      setNotice({ type: 'success', text: 'Credencial guardada. Queda marcada como no verificada hasta comprobarla en el emisor.' });
      setDraft(null);
      setFileName('');
      setCertificatePreview('');
    } catch (error) {
      setNotice({ type: 'error', text: error instanceof Error ? error.message : 'No se pudo guardar la credencial.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <header>
        <h2 className="flex items-center gap-2 text-xl font-extrabold text-white"><Sparkles className="h-5 w-5 text-amber-400" /> {t('adminModules.certificate.title')}</h2>
        <p className="mt-2 text-sm text-gray-400">{t('adminModules.certificate.description')}</p>
      </header>

      <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 bg-white/[0.02] p-8 text-center transition hover:border-amber-400/50">
        {busy ? <Loader2 className="h-8 w-8 animate-spin text-amber-400" /> : <FileImage className="h-8 w-8 text-amber-400" />}
        <span className="text-sm font-semibold text-white">{busy ? 'Analizando certificado…' : 'Selecciona una imagen de certificado'}</span>
        <span className="text-xs text-gray-500">{t('adminModules.certificate.fileTypes')}</span>
        <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" disabled={busy || saving} onChange={handleFile} />
      </label>

      {fileName && <div className="flex items-center gap-3 text-xs text-gray-500"><span>Archivo: {fileName}</span>{certificatePreview && <img src={certificatePreview} alt="Vista previa comprimida del certificado" className="h-16 w-24 rounded-lg border border-white/10 object-contain bg-white" />}</div>}

      {draft && (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-white">{t('adminModules.certificate.review')}</h3>
            <button type="button" onClick={() => { setDraft(null); setFileName(''); setCertificatePreview(''); }} className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white" aria-label={t('adminModules.certificate.discard')}><X className="h-4 w-4" /></button>
          </div>
          {([
            ['title', 'Título'],
            ['issuer', 'Emisor'],
            ['code', 'Código'],
            ['issuedDate', 'Fecha de emisión'],
            ['verificationUrl', 'URL oficial de verificación'],
            ['publicProfileUrl', 'Página pública del perfil (por defecto coach-iso.eu)'],
          ] as const).map(([field, label]) => (
            <label key={field} className="block space-y-1">
              <span className="text-xs font-medium text-gray-400">{label}</span>
              <input value={String(draft[field] || '')} onChange={event => edit(field, event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-amber-400" />
            </label>
          ))}
          <label className="block space-y-1">
            <span className="text-xs font-medium text-gray-400">{t('adminModules.certificate.descriptionLabel')}</span>
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
      <p className="text-xs text-gray-500">{t('adminModules.certificate.saveNote')}</p>
    </section>
  );
}
