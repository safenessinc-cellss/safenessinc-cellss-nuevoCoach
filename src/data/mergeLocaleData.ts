/**
 * Combina traducciones que aún tienen esquemas distintos sin permitir que
 * una traducción incompleta rompa las secciones estructurales de la página.
 * La estructura de referencia es es.json; i18next aporta las traducciones de UI.
 */
type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function compatibleArray(base: unknown[], override: unknown[]): boolean {
  if (base.length === 0 || override.length === 0) return true;
  const firstBase = base[0];
  const firstOverride = override[0];
  if (isRecord(firstBase) && isRecord(firstOverride)) {
    return Object.keys(firstBase).every(key => key in firstOverride);
  }
  return typeof firstBase === typeof firstOverride;
}

export function mergeLocaleData<T>(base: T, override: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(override) && compatibleArray(base, override) ? override : base) as T;
  }

  if (isRecord(base)) {
    if (!isRecord(override)) return base as T;
    const merged: JsonRecord = { ...base };

    for (const [key, baseValue] of Object.entries(base)) {
      if (!(key in override)) continue;
      const overrideValue = override[key];
      if (isRecord(baseValue)) {
        merged[key] = isRecord(overrideValue) ? mergeLocaleData(baseValue, overrideValue) : baseValue;
      } else if (Array.isArray(baseValue)) {
        merged[key] = Array.isArray(overrideValue) && compatibleArray(baseValue, overrideValue)
          ? overrideValue
          : baseValue;
      } else {
        merged[key] = typeof overrideValue === typeof baseValue ? overrideValue : baseValue;
      }
    }

    for (const [key, value] of Object.entries(override)) {
      if (!(key in base)) merged[key] = value;
    }
    return merged as T;
  }

  return (typeof override === typeof base ? override : base) as T;
}
