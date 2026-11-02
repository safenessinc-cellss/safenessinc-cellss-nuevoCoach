import { useEffect, useState } from 'react';
import { doc, onSnapshot, runTransaction, serverTimestamp } from 'firebase/firestore';
import { Check, Globe2, Plus, Save, Trash2 } from 'lucide-react';
import { db } from '../firebase';
import { DEFAULT_SITE_COPY, DEFAULT_SITE_LINKS, getSiteCopy, PublicSiteSettings, SITE_LANGUAGES, SiteLanguage, SitePageCopy } from '../site/siteContent';

interface SiteContentEditorProps {
  canEdit: boolean;
}

function TextField({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  const classes = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-3 focus:ring-teal-700/10';
  return <label className="block space-y-1.5"><span className="text-xs font-semibold text-slate-600">{label}</span>{multiline
    ? <textarea className={`${classes} min-h-24 resize-y leading-6`} value={value} onChange={(event) => onChange(event.target.value)} />
    : <input className={classes} value={value} onChange={(event) => onChange(event.target.value)} />}</label>;
}

export default function SiteContentEditor({ canEdit }: SiteContentEditorProps) {
  const [language, setLanguage] = useState<SiteLanguage>('es');
  const [settings, setSettings] = useState<PublicSiteSettings>({});
  const [copy, setCopy] = useState<SitePageCopy>(DEFAULT_SITE_COPY.es);
  const [links, setLinks] = useState({ ...DEFAULT_SITE_LINKS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => onSnapshot(doc(db, 'settings', 'publicSite'), (snapshot) => {
    const next = snapshot.exists() ? snapshot.data() as PublicSiteSettings : {};
    setSettings(next);
    setLinks({ ...DEFAULT_SITE_LINKS, ...(next.links || {}) });
    setCopy(getSiteCopy(language, next.locales?.[language]));
    setLoading(false);
  }, () => {
    setLoading(false);
    setMessage('No se pudo leer el contenido guardado. Se muestran los valores iniciales.');
  }), [language]);

  const updateSection = <K extends keyof SitePageCopy>(section: K, key: keyof SitePageCopy[K], value: string) => {
    setCopy((current) => ({
      ...current,
      [section]: { ...(current[section] as object), [key]: value },
    }));
  };
  const updateService = (index: number, key: 'title' | 'description', value: string) => {
    setCopy((current) => ({
      ...current,
      expertise: { ...current.expertise, cards: current.expertise.cards.map((card, i) => i === index ? { ...card, [key]: value } : card) },
    }));
  };
  const removeService = (index: number) => setCopy((current) => ({
    ...current,
    expertise: { ...current.expertise, cards: current.expertise.cards.filter((_, i) => i !== index) },
  }));
  const addService = () => setCopy((current) => ({
    ...current,
    expertise: { ...current.expertise, cards: [...current.expertise.cards, { title: '', description: '' }] },
  }));

  const save = async () => {
    if (!canEdit) return;
    if (copy.expertise.cards.some((card) => !card.title.trim() || !card.description.trim())) {
      setMessage('Completa el título y la descripción de cada servicio antes de guardar.');
      return;
    }
    setSaving(true);
    setMessage('');
    try {
      const ref = doc(db, 'settings', 'publicSite');
      await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(ref);
        const current = snapshot.exists() ? snapshot.data() as PublicSiteSettings : {};
        transaction.set(ref, {
          ...current,
          locales: { ...(current.locales || {}), [language]: copy },
          links: { ...(current.links || {}), ...links },
          updatedAt: serverTimestamp(),
        }, { merge: true });
      });
      setMessage('Cambios guardados. La web pública se actualiza automáticamente.');
    } catch {
      setMessage('No se pudieron guardar los cambios. Comprueba que tu cuenta tenga permisos de edición.');
    } finally {
      setSaving(false);
    }
  };

  if (!canEdit) return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">Tu perfil puede consultar el panel, pero no editar el contenido público.</div>;
  if (loading) return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Cargando contenido del sitio…</div>;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-teal-50 p-3 text-teal-800"><Globe2 size={20} /></div>
            <div><h3 className="text-lg font-bold text-slate-900">Contenido del sitio público</h3><p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">Edita los textos por idioma. La trayectoria se administra en Currículo; el perfil, en Perfil; los libros, en Publicaciones; y los colores, en Apariencia.</p></div>
          </div>
          <label className="space-y-1 text-xs font-semibold text-slate-600">Idioma
            <select value={language} onChange={(event) => setLanguage(event.target.value as SiteLanguage)} className="block rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800">
              {SITE_LANGUAGES.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
            </select>
          </label>
        </div>
      </section>

      <section className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-7">
        <div className="sm:col-span-2"><h3 className="font-bold text-slate-900">Marca</h3><p className="mt-1 text-xs text-slate-500">Nombre y descriptor que aparecen en la navegación y el pie de página.</p></div>
        <TextField label="Nombre de marca" value={copy.brand.name} onChange={(value) => updateSection('brand', 'name', value)} />
        <TextField label="Descriptor de marca" value={copy.brand.descriptor} onChange={(value) => updateSection('brand', 'descriptor', value)} />
      </section>

      <section className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-7">
        <div className="sm:col-span-2"><h3 className="font-bold text-slate-900">Portada</h3><p className="mt-1 text-xs text-slate-500">Mensaje principal que ve cada visitante.</p></div>
        <TextField label="Frase superior" value={copy.hero.eyebrow} onChange={(value) => updateSection('hero', 'eyebrow', value)} />
        <TextField label="Titular" value={copy.hero.title} onChange={(value) => updateSection('hero', 'title', value)} />
        <TextField label="Frase destacada" value={copy.hero.highlight} onChange={(value) => updateSection('hero', 'highlight', value)} />
        <TextField label="Áreas de especialidad" value={copy.hero.specialty} onChange={(value) => updateSection('hero', 'specialty', value)} />
        <TextField label="Texto descriptivo" value={copy.hero.description} onChange={(value) => updateSection('hero', 'description', value)} multiline />
        <TextField label="Botón principal" value={copy.hero.primaryAction} onChange={(value) => updateSection('hero', 'primaryAction', value)} />
        <TextField label="Botón del currículo" value={copy.hero.secondaryAction} onChange={(value) => updateSection('hero', 'secondaryAction', value)} />
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div><h3 className="font-bold text-slate-900">Servicios y áreas de trabajo</h3><p className="mt-1 text-xs text-slate-500">Puedes editar, añadir o quitar tarjetas de servicios.</p></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Etiqueta" value={copy.expertise.eyebrow} onChange={(value) => updateSection('expertise', 'eyebrow', value)} />
          <TextField label="Título de sección" value={copy.expertise.title} onChange={(value) => updateSection('expertise', 'title', value)} />
          <div className="sm:col-span-2"><TextField label="Introducción" value={copy.expertise.description} onChange={(value) => updateSection('expertise', 'description', value)} multiline /></div>
        </div>
        {copy.expertise.cards.map((card, index) => <div key={`service-${index}`} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <TextField label={`Servicio ${index + 1}`} value={card.title} onChange={(value) => updateService(index, 'title', value)} />
          <TextField label="Descripción" value={card.description} onChange={(value) => updateService(index, 'description', value)} multiline />
          <button type="button" onClick={() => removeService(index)} aria-label={`Quitar servicio ${index + 1}`} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-rose-200 px-3 text-xs font-semibold text-rose-700 hover:bg-rose-50"><Trash2 size={15} />Quitar</button>
        </div>)}
        <button type="button" onClick={addService} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"><Plus size={15} />Añadir servicio</button>
      </section>

      <section className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-7">
        <div className="sm:col-span-2"><h3 className="font-bold text-slate-900">Trayectoria y desarrollo digital</h3><p className="mt-1 text-xs text-slate-500">Los cargos, empresas, fechas y resultados se editan desde el currículo.</p></div>
        <TextField label="Etiqueta de trayectoria" value={copy.experience.eyebrow} onChange={(value) => updateSection('experience', 'eyebrow', value)} />
        <TextField label="Título de trayectoria" value={copy.experience.title} onChange={(value) => updateSection('experience', 'title', value)} />
        <TextField label="Texto de trayectoria" value={copy.experience.description} onChange={(value) => updateSection('experience', 'description', value)} multiline />
        <TextField label="Enlace al currículo" value={copy.experience.openCv} onChange={(value) => updateSection('experience', 'openCv', value)} />
        <TextField label="Cifra de experiencia" value={copy.experience.yearsValue} onChange={(value) => updateSection('experience', 'yearsValue', value)} />
        <TextField label="Etiqueta de experiencia" value={copy.experience.yearsLabel} onChange={(value) => updateSection('experience', 'yearsLabel', value)} />
        <TextField label="Etiqueta de resultados" value={copy.experience.resultsLabel} onChange={(value) => updateSection('experience', 'resultsLabel', value)} />
        <TextField label="Nota sobre resultados" value={copy.experience.resultsDisclaimer} onChange={(value) => updateSection('experience', 'resultsDisclaimer', value)} multiline />
        <TextField label="Etiqueta de desarrollo digital" value={copy.digital.eyebrow} onChange={(value) => updateSection('digital', 'eyebrow', value)} />
        <TextField label="Título de desarrollo digital" value={copy.digital.title} onChange={(value) => updateSection('digital', 'title', value)} />
        <TextField label="Texto de desarrollo digital" value={copy.digital.description} onChange={(value) => updateSection('digital', 'description', value)} multiline />
        <TextField label="Enlace de desarrollo digital" value={copy.digital.linkLabel} onChange={(value) => updateSection('digital', 'linkLabel', value)} />
      </section>

      <section className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-7">
        <div className="sm:col-span-2"><h3 className="font-bold text-slate-900">Publicaciones y contacto</h3><p className="mt-1 text-xs text-slate-500">Los libros y portadas se gestionan en Publicaciones.</p></div>
        <TextField label="Etiqueta de publicaciones" value={copy.publication.eyebrow} onChange={(value) => updateSection('publication', 'eyebrow', value)} />
        <TextField label="Título de publicaciones" value={copy.publication.title} onChange={(value) => updateSection('publication', 'title', value)} />
        <TextField label="Introducción a publicaciones" value={copy.publication.description} onChange={(value) => updateSection('publication', 'description', value)} multiline />
        <TextField label="Texto del enlace del libro" value={copy.publication.openBook} onChange={(value) => updateSection('publication', 'openBook', value)} />
        <TextField label="Etiqueta de contacto" value={copy.contact.eyebrow} onChange={(value) => updateSection('contact', 'eyebrow', value)} />
        <TextField label="Título de contacto" value={copy.contact.title} onChange={(value) => updateSection('contact', 'title', value)} />
        <TextField label="Texto de contacto" value={copy.contact.description} onChange={(value) => updateSection('contact', 'description', value)} multiline />
        <TextField label="Texto del enlace de correo" value={copy.contact.emailLabel} onChange={(value) => updateSection('contact', 'emailLabel', value)} />
        <TextField label="Texto del enlace de LinkedIn" value={copy.contact.linkedinLabel} onChange={(value) => updateSection('contact', 'linkedinLabel', value)} />
        <TextField label="Texto del enlace de WhatsApp" value={copy.contact.whatsappLabel} onChange={(value) => updateSection('contact', 'whatsappLabel', value)} />
        <TextField label="Correo público" value={links.email} onChange={(value) => setLinks((current) => ({ ...current, email: value }))} />
        <TextField label="URL de LinkedIn" value={links.linkedin} onChange={(value) => setLinks((current) => ({ ...current, linkedin: value }))} />
        <TextField label="URL de WhatsApp" value={links.whatsapp} onChange={(value) => setLinks((current) => ({ ...current, whatsapp: value }))} />
        <TextField label="Lema del pie" value={copy.footer.tagline} onChange={(value) => updateSection('footer', 'tagline', value)} />
        <TextField label="Descripción del pie" value={copy.footer.privacy} onChange={(value) => updateSection('footer', 'privacy', value)} />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p aria-live="polite" className="flex items-center gap-2 text-sm text-slate-600">{message && (message.startsWith('Cambios') ? <Check size={16} className="text-emerald-700" /> : null)}{message}</p>
        <button type="button" onClick={() => void save()} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-teal-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-60"><Save size={16} />{saving ? 'Guardando…' : 'Guardar cambios'}</button>
      </div>
      <p className="text-xs leading-5 text-slate-500">El documento guardado contiene únicamente textos y enlaces públicos. Firestore mantiene la edición restringida a cuentas con permiso de editor; los visitantes solo pueden leer este contenido.</p>
    </div>
  );
}
