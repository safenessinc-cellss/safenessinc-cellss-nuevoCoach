import { ACADEMIC_EDUCATION, ALL_LEARNING_ACTIVITIES, CANDIDATE_INFO, INDUSTRIAL_COURSES, LANGUAGES_LIST, OFFICIAL_CERTIFICATES } from '../data/robertTeranCurriculumData';
import type { CurriculumTranslationOutput } from '../ai/geminiClient';
import { CANDIDATE_PHOTO } from '../data/candidatePhoto';

export type CurriculumLength = 'full' | 'short';

function esc(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c] || c));
}
function area(title: string): string {
  const s = title.toLowerCase();
  if (/cyber|security|seguridad|ciber|privacy|iso 27001|network|redes/.test(s)) return 'Ciberseguridad y redes';
  if (/artificial intelligence|machine learning|data science|watson|quantum|\\bia\\b|datos/.test(s)) return 'IA, datos y computación avanzada';
  if (/cloud|aws|azure|google cloud|ibm cloud|computing/.test(s)) return 'Cloud y computación';
  if (/web development|html|css|javascript|react|android|ios|programming|software|developer/.test(s)) return 'Desarrollo web, software y apps';
  if (/project|agile|scrum|kanban/.test(s)) return 'Gestión de proyectos y metodologías ágiles';
  if (/marketing|sales|customer|retail|business|entrepreneur|negocio/.test(s)) return 'Negocios, marketing y clientes';
  if (/leadership|communication|team|psych|mental health|wellbeing|coaching/.test(s)) return 'Liderazgo, habilidades humanas y organización';
  if (/iso|quality|calidad|audit|lean|six sigma|manufactur|process|supply|inventory|risk/.test(s)) return 'Calidad, procesos y operaciones';
  return 'Competencias profesionales y formación general';
}
export function buildCurriculumPdfHtml(data: CurriculumTranslationOutput, language: string, labels: Record<string,string>, length: CurriculumLength = 'full', profilePhotoUrl?: string): string {
  const short = length === 'short';
  const photoUrl = profilePhotoUrl || CANDIDATE_PHOTO;
  const e = ACADEMIC_EDUCATION.length, c = OFFICIAL_CERTIFICATES.length;
  const education = data.educationItems.slice(0, e);
  const credentials = data.educationItems.slice(e, e + c);
  const courseTitles = [...ALL_LEARNING_ACTIVITIES.map(x => x.title), ...INDUSTRIAL_COURSES];
  const grouped = new Map<string, typeof data.educationItems>();
  data.educationItems.slice(e + c).forEach((item, i) => {
    const key = area(courseTitles[i] || item.title);
    const list = grouped.get(key) || [];
    list.push(item); grouped.set(key, list);
  });
  const x = data.additionalTexts;
  const title = (idx: number, fallback: string) => x[idx] || fallback;
  const section = (name: string, body: string) => '<section class="section"><h2>' + esc(name) + '</h2>' + body + '</section>';
  const metricItems = (short ? data.impactMetrics.slice(0, 3) : data.impactMetrics).map(m =>
    '<div class="metric"><b>' + esc(m.value) + '</b><strong>' + esc(m.label) + '</strong><p>' + esc(m.detail) + '</p></div>').join('');
  const roleItems = (short ? data.careerRoles.slice(0, 3) : data.careerRoles).map((role, i) => {
    const responsibilities = short ? role.responsibilities.slice(0, 3) : role.responsibilities;
    const achievements = short ? (role.achievements || []).slice(0, 1) : (role.achievements || []);
    return '<article class="job"><div class="job-head"><div><h3>' + esc(role.title) + '</h3><b class="company">' + esc(role.company) + ' · ' + esc(role.location) + '</b></div><span>' + esc(role.period) + '</span></div><ul>' +
      responsibilities.map(v => '<li>' + esc(v) + '</li>').join('') + achievements.map(v => '<li class="achievement">' + esc(v) + '</li>').join('') + '</ul></article>';
  }).join('');
  const eduItems = (short ? education.slice(0, 3) : education).map(item =>
    '<article class="education-item"><b>' + esc(item.title) + '</b><p>' + esc(item.institution) + (item.period ? ' · ' + esc(item.period) : '') + '</p>' + (short ? '' : '<p>' + esc(item.description) + '</p>') + '</article>').join('');
  const issuerLogo = (issuer: string) => {
    const normalized = issuer.toLowerCase();
    if (/ibm/.test(normalized)) return 'https://cdn.simpleicons.org/ibm/052FAD';
    if (/the open university|open university/.test(normalized)) return 'https://cdn.simpleicons.org/theopenuniversity/CC0000';
    if (/microsoft/.test(normalized)) return 'https://cdn.simpleicons.org/microsoft/5E5E5E';
    if (/google/.test(normalized)) return 'https://cdn.simpleicons.org/google/4285F4';
    if (/fortinet/.test(normalized)) return 'https://cdn.simpleicons.org/fortinet/EE3124';
    if (/cisco/.test(normalized)) return 'https://cdn.simpleicons.org/cisco/1BA0D7';
    if (/coursera/.test(normalized)) return 'https://cdn.simpleicons.org/coursera/0056D2';
    if (/credly/.test(normalized)) return 'https://cdn.simpleicons.org/credly/FF6B00';
    if (/openclassrooms/.test(normalized)) return 'https://cdn.simpleicons.org/openclassrooms/7451EB';
    return '';
  };
  const credItems = (short ? credentials.slice(0, 5) : credentials).map(item => {
    const logo = issuerLogo(item.institution);
    return '<article class="credential">' + (logo ? '<img src="' + esc(logo) + '" alt="' + esc(item.institution) + ' logo" class="issuer-logo">' : '') + '<b>✓ ' + esc(item.title) + '</b><span>' + esc(item.institution) + (item.period ? ' · ' + esc(item.period) : '') + '</span>' + (!short && item.description ? '<p>' + esc(item.description) + '</p>' : '') + '</article>';
  }).join('');
  const groupLabels: Record<string, string> = {
    'Calidad, procesos y operaciones': x[20] || 'Calidad, procesos y operaciones',
    'Ciberseguridad y redes': x[21] || 'Ciberseguridad y redes',
    'IA, datos y computación avanzada': x[22] || 'IA, datos y computación avanzada',
    'Cloud y computación': x[23] || 'Cloud y computación',
    'Desarrollo web, software y apps': x[24] || 'Desarrollo web, software y apps',
    'Gestión de proyectos y metodologías ágiles': x[25] || 'Gestión de proyectos y metodologías ágiles',
    'Negocios, marketing y clientes': x[26] || 'Negocios, marketing y clientes',
    'Liderazgo, habilidades humanas y organización': x[27] || 'Liderazgo, habilidades humanas y organización',
    'Competencias profesionales y formación general': x[28] || 'Competencias profesionales y formación general',
  };
  const groupItems = [...grouped.entries()].sort((a, b) => b[1].length - a[1].length).map(([name, items]) =>
    '<div class="course-group"><b>' + esc(groupLabels[name] || name) + '</b><span>' + items.length + '</span>' +
    (short ? '' : '<ul>' + items.map(item => '<li>' + esc(item.title) + (item.institution ? ' <small>— ' + esc(item.institution) + '</small>' : '') + '</li>').join('') + '</ul>') + '</div>').join('');
  const languageItems = LANGUAGES_LIST.map((item, i) => {
    const translated = x[29 + i] || (item.name + ' — ' + item.level);
    return '<li>' + esc(translated) + '</li>';
  }).join('');
  const profile = short
    ? (data.summary.split(/\n\n/)[0] || data.summary).slice(0, 620)
    : data.summary;
  return '<article class="cv ' + (short ? 'short' : 'full') + '" lang="' + esc(language) + '"><style>' +
    '.cv{font-family:Arial,Helvetica,sans-serif;width:770px;min-height:1040px;background:#fff;color:#293244;display:grid;grid-template-columns:238px 1fr;font-size:10px;line-height:1.38;box-sizing:border-box}.cv *{box-sizing:border-box}.sidebar{background:#191b1d;color:#f8fafc;padding:24px 18px;position:relative}.sidebar:before{content:"";position:absolute;top:0;left:0;border-top:76px solid #f59e0b;border-right:76px solid transparent}.profile-photo{margin:7px auto 18px;width:92px;height:112px;display:block;object-fit:cover;object-position:center 35%;border:3px solid #f59e0b;border-radius:14px;position:relative}.sidebar h2{font-size:10px;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid #8b5e12;padding-bottom:7px;margin:17px 0 8px;color:#fff}.sidebar p,.sidebar li{font-size:9px;line-height:1.45;color:#d1d5db;overflow-wrap:anywhere}.sidebar ul{padding-left:14px;margin:5px 0}.sidebar .contact{color:#fbbf24}.main{padding:28px 24px 24px;min-width:0}.hero{border-left:6px solid #f59e0b;background:#f1f3f5;border-radius:0 18px 18px 0;padding:18px 20px;margin:0 0 18px}.hero h1{font-size:24px;line-height:1.04;margin:0 0 8px;text-transform:uppercase;color:#171d2b;letter-spacing:-.6px}.hero h1 span{display:block;color:#f59e0b}.hero .subtitle{font-size:9px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;color:#475569}.hero p{font-size:9px;margin:7px 0 0;color:#475569}.section{margin:15px 0 0;break-inside:auto}.section h2{font-size:11px;line-height:1.25;text-transform:uppercase;letter-spacing:.35px;color:#172033;margin:0 0 8px;padding:0 0 5px;border-bottom:2px solid #f59e0b}.section p{margin:4px 0}.metric-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.metric{border:1px solid #f5d78c;border-radius:11px;padding:8px 7px;background:#fffdf5;break-inside:avoid}.metric b{display:block;color:#d97706;font-size:18px}.metric strong{display:block;color:#1f2937;font-size:8px;line-height:1.2;margin:3px 0}.metric p{font-size:7.5px;color:#64748b;margin:3px 0 0}.job{margin:9px 0 11px;padding-left:10px;border-left:2px solid #f59e0b;break-inside:avoid}.job-head{display:flex;justify-content:space-between;gap:7px;align-items:flex-start}.job h3{font-size:10px;margin:0 0 3px;color:#172033}.job .company{font-size:8px;color:#d97706;font-style:italic}.job-head span{font-size:7.5px;color:#92400e;background:#fff8e6;border:1px solid #f8d778;padding:3px 5px;border-radius:4px;white-space:nowrap}.job ul{padding-left:14px;margin:5px 0}.job li{font-size:8.4px;margin:2px 0;line-height:1.32}.job .achievement{list-style:none;margin-left:-14px;padding:5px;background:#f8fafc;border-radius:4px;color:#b45309}.education-item{margin:7px 0;break-inside:avoid}.education-item b{font-size:8.8px;color:#172033}.education-item p{font-size:8px;color:#64748b}.credential{margin:5px 0;padding:6px 8px;border:1px solid #e5e7eb;background:#f3f4f6;border-radius:6px;break-inside:avoid}.issuer-logo{width:26px;height:26px;object-fit:contain;float:right;margin:0 0 4px 7px;background:#fff;border-radius:4px;padding:3px}.credential b{font-size:8px}.credential span,.credential p{display:block;font-size:7.5px;color:#64748b;margin-top:3px}.course-group{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:5px 0;padding:6px 8px;background:#f3f4f6;border-radius:5px;font-size:8px}.course-group span{color:#b45309;font-weight:800}.course-group ul{display:block;flex-basis:100%;margin:5px 0 0;padding-left:15px}.course-group li{font-size:7.8px;margin:2px 0}.foot{font-size:7px;color:#64748b;border-top:1px solid #e5e7eb;padding-top:8px;margin-top:14px;overflow-wrap:anywhere}.short .sidebar{padding:19px 15px}.short .main{padding:20px 19px 18px}.short .hero{padding:14px 16px;margin-bottom:12px}.short .hero h1{font-size:22px}.short .section{margin-top:10px}.short .section h2{margin-bottom:5px}.short .job{margin:6px 0 7px}.short .job li{font-size:7.6px}.short .metric{padding:6px}.short .metric b{font-size:16px}.short .sidebar h2{margin-top:12px}.short .credential{margin:4px 0;padding:5px 7px}.short .education-item{margin:5px 0}.full .sidebar{min-height:100%}.full .main{padding-bottom:35px}' +
    '</style><aside class="sidebar"><img class="profile-photo" src="' + esc(photoUrl) + '" alt="Fotografía profesional de Deuwy Robert Terán Medina" width="92" height="112" style="display:block;max-width:92px;min-width:92px;min-height:112px;object-fit:cover"><h2>' + esc(title(8, labels.contact)) + '</h2><p>TELEFONE / WHATSAPP<br><b class="contact">' + esc(CANDIDATE_INFO.phone || '') + '</b></p><p>EMAIL / CREDLY<br><b class="contact">' + esc(CANDIDATE_INFO.email) + '</b><br>' + esc(CANDIDATE_INFO.credlyProfile.replace(/^https:\/\//, '')) + '</p><p>LOCALIZAÇÃO<br>' + esc(CANDIDATE_INFO.location) + '</p><h2>' + esc(title(7, labels.languages)) + '</h2><ul>' + languageItems + '</ul><h2>' + esc(title(2, labels.education)) + '</h2>' + eduItems + '<h2>' + esc(title(5, labels.skills)) + '</h2><p><b>' + esc(title(9, labels.quality)) + '</b><br>' + esc(title(13, labels.qualityText)) + '</p><p><b>' + esc(title(10, labels.business)) + '</b><br>' + esc(title(14, labels.businessText)) + '</p><p><b>' + esc(title(11, labels.digital)) + '</b><br>' + esc(title(15, labels.digitalText)) + '</p></aside><div class="main"><header class="hero"><h1>DEUWY ROBERT<span>TERÁN MEDINA</span></h1><div class="subtitle">' + esc(title(19, labels.eyebrow)) + ' · ENGENHEIRO ECONOMISTA</div><p>' + esc(CANDIDATE_INFO.location) + ' · ' + esc(CANDIDATE_INFO.email) + '</p></header>' +
    section(title(18, labels.summary), '<p>' + esc(profile).replace(/\n/g, '<br>') + '</p>') +
    section(title(0, labels.results), '<div class="metric-grid">' + metricItems + '</div>') +
    section(title(1, labels.experience), roleItems) +
    section(title(3, labels.credentials), credItems) +
    section(title(4, labels.courses), (short ? '<p>' + esc(labels.allCoursesNote || '') + '</p>' : '') + groupItems) +
    '<footer class="foot">' + esc(CANDIDATE_INFO.name) + ' · ' + esc(CANDIDATE_INFO.credlyProfile) + ' · ' + esc(language) + '</footer></div></article>';
}
