import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Loader2, CheckCircle2, AlertCircle, UserRound, Image as ImageIcon } from 'lucide-react';
import { useProfileSettings, type ProfileSettings } from '../data/useProfileSettings';

export default function ProfileEditor() {
  const { t } = useTranslation();
  const { profile, updateProfile, loading } = useProfileSettings();
  const [formData, setFormData] = useState<ProfileSettings>(profile);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => setFormData(profile), [profile]);

  const change = (field: keyof ProfileSettings, value: string | number) => {
    setNotice(null);
    setFormData(previous => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      await updateProfile({
        ...formData,
        name: formData.name.trim(),
        experienceYears: Math.max(0, Number(formData.experienceYears) || 0),
      });
      setNotice({ type: 'success', text: t('adminModules.profile.saved') });
    } catch (error) {
      setNotice({
        type: 'error',
        text: error instanceof Error ? error.message : t('adminModules.profile.error'),
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading && !formData.name) {
    return <div className="flex items-center gap-2 p-8 text-sm text-gray-400"><Loader2 className="h-4 w-4 animate-spin" /> {t('adminModules.profile.loading')}</div>;
  }

  const textField = (field: keyof ProfileSettings, label: string, type = 'text') => (
    <label className="block space-y-1.5" key={field}>
      <span className="text-xs font-semibold text-gray-300">{label}</span>
      <input
        type={type}
        value={String(formData[field] ?? '')}
        onChange={event => change(field, type === 'number' ? Number(event.target.value) : event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500"
      />
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-white"><UserRound className="h-5 w-5 text-red-400" /> {t('adminModules.profile.title')}</h2>
          <p className="mt-1 text-xs text-gray-400">{t('adminModules.profile.description')}</p>
        </div>
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-500 disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? '{t('adminModules.profile.saving')}' : '{t('adminModules.profile.save')}'}
        </button>
      </header>

      <section className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:grid-cols-2">
        {textField('name', '{t('adminModules.profile.name')}')}
        {textField('title', '{t('adminModules.profile.jobTitle')}')}
        {textField('coachTitle', '{t('adminModules.profile.specialty')}')}
        {textField('experienceYears', '{t('adminModules.profile.years')}', 'number')}
        {textField('photoUrl', '{t('adminModules.profile.photo')}')}
        {textField('logoUrl', '{t('adminModules.profile.logo')}')}
        <div className="md:col-span-2">{textField('bio', '{t('adminModules.profile.bio')}')}</div>
        <div className="md:col-span-2">{textField('quote', '{t('adminModules.profile.quote')}')}</div>
      </section>

      <div className="flex items-start gap-2 text-xs text-gray-400">
        <ImageIcon className="mt-0.5 h-4 w-4 shrink-0" />
        Usa URLs HTTPS públicas para la foto y el logo. La vista previa de la página pública se actualiza cuando el perfil se sincroniza.
      </div>
      {notice && (
        <p role="status" className={`flex items-center gap-2 rounded-xl border p-3 text-sm ${notice.type === 'success' ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300' : 'border-red-500/20 bg-red-500/5 text-red-300'}`}>
          {notice.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {notice.text}
        </p>
      )}
    </form>
  );
}
