import { auth } from '../firebase';
import type { CurriculumPresentationAnalysis } from '../data/useCurriculumSettings';

export type CertificateCategory =
  | 'cybersecurity' | 'ai_data' | 'design_thinking' | 'cloud'
  | 'project_agile' | 'marketing' | 'professional_skills' | 'web_dev';

export interface ExtractedCertificate {
  code: string;
  title: string;
  issuer: string;
  issuedDate: string;
  category: CertificateCategory;
  categoryLabel: string;
  description: string;
  badgeType: string;
  verificationUrl: string;
  /** Public Coach ISO profile URL; not an issuer verification URL. */
  publicProfileUrl?: string;
  /** Small, compressed certificate preview kept below Firestore's document size limit. */
  imageDataUrl?: string;
  confidence: number;
  verified?: boolean;
}

export interface CurriculumRewriteInput {
  summary: string;
  impactMetrics: Array<{ value: string; label: string; detail: string }>;
  careerRoles: Array<{
    period: string; title: string; company: string; location: string;
    responsibilities: string[]; achievements?: string[];
  }>;
  educationItems: Array<{ period: string; title: string; institution: string; description?: string }>;
  certificateTitles: string[];
}

export interface CurriculumRewriteOutput {
  summary: string;
  impactMetrics: CurriculumRewriteInput['impactMetrics'];
  careerRoles: CurriculumRewriteInput['careerRoles'];
  suggestions: string[];
}

async function apiRequest<T>(path: string, body: unknown, requireAuth = true): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (requireAuth) {
    const user = auth.currentUser;
    if (!user) throw new Error('Inicia sesión con una cuenta autorizada para usar esta función.');
    headers.Authorization = `Bearer ${await user.getIdToken()}`;
  }
  const response = await fetch(`/api/${path}`, {
    method: 'POST', headers, body: JSON.stringify(body),
  });
  const result = await response.json().catch(() => ({})) as { error?: string } & T;
  if (!response.ok) throw new Error(result.error || `Error de API (${response.status}).`);
  return result;
}

export async function analyzeCertificateImage(
  base64DataUrl: string,
  mimeType = 'image/jpeg',
): Promise<ExtractedCertificate> {
  return apiRequest<ExtractedCertificate>('analyze-certificate', { image: base64DataUrl, mimeType });
}

export async function rewriteCurriculum(
  input: CurriculumRewriteInput,
  userInstructions = '',
): Promise<CurriculumRewriteOutput> {
  return apiRequest<CurriculumRewriteOutput>('rewrite-curriculum', { input, instructions: userInstructions });
}

export interface CurriculumMergePreview {
  curriculum: import('../data/useCurriculumSettings').CurriculumSettings;
  notes: string[];
  conflicts: string[];
}

export async function mergeCurriculumDocument(
  fileDataUrl: string,
  mimeType: string,
  fileName: string,
  currentCurriculum: import('../data/useCurriculumSettings').CurriculumSettings,
): Promise<CurriculumMergePreview> {
  return apiRequest<CurriculumMergePreview>('merge-curriculum', {
    fileDataUrl,
    mimeType,
    fileName,
    currentCurriculum,
  });
}

export async function analyzeCurriculumPresentation(
  currentCurriculum: unknown,
  officialCertificates: Array<{ title: string; issuer: string; category: string; categoryLabel: string; description: string; issuedDate: string }>,
): Promise<CurriculumPresentationAnalysis> {
  return apiRequest<CurriculumPresentationAnalysis>('analyze-curriculum', { currentCurriculum, officialCertificates });
}
