import { translateCurriculumForExport, type CurriculumTranslationInput, type CurriculumTranslationOutput } from '../ai/geminiClient';

export async function translateCompleteCurriculum(
  source: CurriculumTranslationInput,
  language: string,
  onProgress?: (message: string) => void,
): Promise<CurriculumTranslationOutput> {
  if (language.toLowerCase() === 'es') {
    return {
      summary: source.summary,
      impactMetrics: source.impactMetrics,
      careerRoles: source.careerRoles,
      educationItems: source.educationItems,
      additionalTexts: source.additionalTexts,
    };
  }

  onProgress?.('Translating executive profile…');
  const base = await translateCurriculumForExport(source, language, 'base');
  const education: CurriculumTranslationOutput['educationItems'] = [];
  const extras: string[] = [];
  const batches = Math.max(
    Math.ceil(source.educationItems.length / 20),
    Math.ceil(source.additionalTexts.length / 20),
  );

  // Two concurrent bounded requests reduce latency without flooding the model.
  for (let start = 0; start < batches; start += 2) {
    const indices = [start, start + 1].filter(index => index < batches);
    const results = await Promise.all(indices.map(async index => {
      const input: CurriculumTranslationInput = {
        ...source,
        summary: '',
        impactMetrics: [],
        careerRoles: [],
        educationItems: source.educationItems.slice(index * 20, (index + 1) * 20),
        additionalTexts: source.additionalTexts.slice(index * 20, (index + 1) * 20),
      };
      onProgress?.(`Translating learning history: ${Math.min((index + 1) * 20, source.educationItems.length)} / ${source.educationItems.length}`);
      return { index, data: await translateCurriculumForExport(input, language, 'batch') };
    }));
    results.sort((a, b) => a.index - b.index).forEach(({ data }) => {
      education.push(...data.educationItems);
      extras.push(...data.additionalTexts);
    });
  }

  const result: CurriculumTranslationOutput = {
    summary: base.summary,
    impactMetrics: base.impactMetrics,
    careerRoles: base.careerRoles,
    educationItems: education,
    additionalTexts: extras,
  };
  if (!result.summary?.trim() ||
      result.impactMetrics.length !== source.impactMetrics.length ||
      result.careerRoles.length !== source.careerRoles.length ||
      result.educationItems.length !== source.educationItems.length ||
      result.additionalTexts.length !== source.additionalTexts.length ||
      result.educationItems.some((item, index) =>
        !item.title?.trim() ||
        (Boolean(source.educationItems[index].description?.trim()) && !item.description?.trim()))) {
    throw new Error('Incomplete translation');
  }
  return result;
}
