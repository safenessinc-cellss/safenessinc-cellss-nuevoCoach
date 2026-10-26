import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowDownToLine, ArrowLeft, BadgeCheck, BriefcaseBusiness, CheckCircle2, ExternalLink, Globe2, GraduationCap, Languages, LoaderCircle, Mail, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { CANDIDATE_PHOTO } from '../data/candidatePhoto';
import { useProfileSettings } from '../data/useProfileSettings';
import {
  ACADEMIC_EDUCATION, ALL_LEARNING_ACTIVITIES, CANDIDATE_INFO, CAREER_EXPERIENCE,
  IMPACT_METRICS, INDUSTRIAL_COURSES, LANGUAGES_LIST, OFFICIAL_CERTIFICATES,
} from '../data/robertTeranCurriculumData';
import type { CurriculumTranslationInput, CurriculumTranslationOutput } from '../ai/geminiClient';
import { buildCurriculumPdfHtml, type CurriculumLength } from './curriculumPdf';
import { translateCompleteCurriculum } from './curriculumTranslation';

type UiLanguage = 'es' | 'en' | 'pt' | 'it';
const UI: Record<UiLanguage, Record<string, string>> = {
  es: { back:'Volver al portal completo',eyebrow:'Perfil profesional ejecutivo',title:'Experiencia que conecta calidad, negocio y tecnología.',intro:'Trayectoria profesional, formación, credenciales y resultados en un solo currículo.',download:'Exportar currículo PDF',exporting:'Traduciendo y preparando PDF…',summary:'Perfil ejecutivo',results:'Resultados destacados',experience:'Experiencia profesional',education:'Estudios y formación',credentials:'Credenciales y certificaciones',courses:'Formación continua por áreas',skills:'Áreas de especialidad',services:'Consultoría y soluciones para empresas',languages:'Idiomas',contact:'Contacto profesional',quality:'SGQ y sistemas integrados',business:'Gestión empresarial',digital:'Desarrollo digital',people:'Personas y organización',qualityText:'Diagnóstico, implementación y mejora de sistemas de gestión; auditorías internas, análisis de riesgos, no conformidades, acciones correctivas y preparación para auditorías de certificación.',businessText:'Estructura organizativa, procesos, indicadores KPI, análisis de costes, proveedores, cadena de suministro y mejora continua orientada a resultados.',digitalText:'Diseño y desarrollo de sitios web, aplicaciones y sistemas internos; automatización de flujos, integración de servicios y paneles de gestión.',peopleText:'Desarrollo de liderazgo, formación de equipos, comunicación y comportamiento organizacional con enfoque profesional y no clínico.',allCoursesNote:'Los cursos se agrupan por afinidad temática. Los nombres de proveedores y credenciales se conservan cuando corresponde.',issuer:'Emisor',period:'Periodo',verified:'Verificación externa disponible',unverified:'Registro documental; confirmar con el emisor',pdfLanguage:'Idioma del PDF',otherLanguage:'Otro idioma (código, por ejemplo fr, de, ja, zh-CN)',translateNotice:'El PDF se traduce con IA y se valida antes de descargarse.',noResults:'Faltan campos traducidos. No se generó un PDF incompleto.',translationError:'La traducción no está disponible temporalmente. El currículo original sigue intacto.',coursesCount:'actividades formativas registradas',credentialsCount:'credenciales listadas',years:'años de experiencia declarada',careerNote:'Los resultados reflejan los datos del currículo de origen y deben contrastarse con documentación de respaldo.',credentialLink:'Perfil público de credenciales',professional:'Consultoría de sistemas de gestión, mejora empresarial y soluciones digitales.',selectAll:'Incluye experiencia, estudios, credenciales y formación agrupada.',achievement:'Resultados y contribuciones',cvLength:'Versión del currículo',fullVersion:'Completo',shortVersion:'Ejecutivo breve' },
  en: { back:'Back to full portal',eyebrow:'Executive professional profile',title:'Experience connecting quality, business and technology.',intro:'Professional history, education, credentials and outcomes in one structured curriculum.',download:'Export curriculum PDF',exporting:'Translating and preparing PDF…',summary:'Executive profile',results:'Selected outcomes',experience:'Professional experience',education:'Education and training',credentials:'Credentials and certifications',courses:'Continuing learning by area',skills:'Areas of expertise',services:'Consulting and business solutions',languages:'Languages',contact:'Professional contact',quality:'QMS and integrated systems',business:'Business management',digital:'Digital development',people:'People and organization',qualityText:'Assessment, implementation and improvement of management systems; internal audits, risk analysis, nonconformities, corrective actions and certification-audit readiness.',businessText:'Organizational structure, processes, KPIs, cost analysis, suppliers, supply chain and outcome-oriented continuous improvement.',digitalText:'Design and development of websites, applications and internal systems; workflow automation, service integration and management dashboards.',peopleText:'Leadership development, team training, communication and organizational behavior with a professional, non-clinical approach.',allCoursesNote:'Courses are grouped by topic to improve readability; provider and credential names are preserved where appropriate.',issuer:'Issuer',period:'Period',verified:'External verification available',unverified:'Listed record; confirm with issuer',pdfLanguage:'PDF language',otherLanguage:'Other language (code, e.g. fr, de, ja, zh-CN)',translateNotice:'The PDF is AI-translated and validated before download.',noResults:'Some translated fields are missing. An incomplete PDF was not generated.',translationError:'Translation is temporarily unavailable. Your original curriculum remains unchanged.',coursesCount:'learning activities listed',credentialsCount:'credentials listed',years:'years of stated experience',careerNote:'Results reflect the source curriculum and should be checked against supporting documentation.',credentialLink:'Public credential profile',professional:'Management systems consulting, business improvement and digital solutions.',selectAll:'Includes experience, education, credentials and grouped learning history.',achievement:'Results and contributions',cvLength:'Curriculum version',fullVersion:'Full',shortVersion:'Executive summary' },
  pt: { back:'Voltar ao portal completo',eyebrow:'Perfil profissional executivo',title:'Experiência que conecta qualidade, negócios e tecnologia.',intro:'Trajetória profissional, formação, credenciais e resultados em um currículo estruturado.',download:'Exportar currículo PDF',exporting:'Traduzindo e preparando PDF…',summary:'Perfil executivo',results:'Resultados em destaque',experience:'Experiência profissional',education:'Estudos e formação',credentials:'Credenciais e certificações',courses:'Formação contínua por áreas',skills:'Áreas de especialidade',services:'Consultoria e soluções para empresas',languages:'Idiomas',contact:'Contato profissional',quality:'SGQ e sistemas integrados',business:'Gestão empresarial',digital:'Desenvolvimento digital',people:'Pessoas e organização',qualityText:'Diagnóstico, implementação e melhoria de sistemas de gestão; auditorias internas, análise de riscos, não conformidades, ações corretivas e preparação para auditorias de certificação.',businessText:'Estrutura organizacional, processos, indicadores KPI, análise de custos, fornecedores, cadeia de suprimentos e melhoria contínua orientada a resultados.',digitalText:'Design e desenvolvimento de sites, aplicativos e sistemas internos; automação de fluxos, integração de serviços e painéis de gestão.',peopleText:'Desenvolvimento de liderança, formação de equipes, comunicação e comportamento organizacional com abordagem profissional e não clínica.',allCoursesNote:'Os cursos são agrupados por afinidade temática. Nomes de provedores e credenciais são preservados quando aplicável.',issuer:'Emissor',period:'Período',verified:'Verificação externa disponível',unverified:'Registro documental; confirmar com o emissor',pdfLanguage:'Idioma do PDF',otherLanguage:'Outro idioma (código, por exemplo fr, de, ja, zh-CN)',translateNotice:'O PDF é traduzido por IA e validado antes do download.',noResults:'Há campos de tradução ausentes. Um PDF incompleto não foi gerado.',translationError:'A tradução está temporariamente indisponível. O currículo original permanece intacto.',coursesCount:'atividades formativas registradas',credentialsCount:'credenciais listadas',years:'anos de experiência declarada',careerNote:'Os resultados refletem o currículo de origem e devem ser conferidos com documentação de apoio.',credentialLink:'Perfil público de credenciais',professional:'Consultoria em sistemas de gestão, melhoria empresarial e soluções digitais.',selectAll:'Inclui experiência, estudos, credenciais e formação agrupada.',achievement:'Resultados e contribuições',cvLength:'Versão do currículo',fullVersion:'Completo',shortVersion:'Executivo resumido' },
  it: { back:'Torna al portale completo',eyebrow:'Profilo professionale executive',title:'Esperienza che unisce qualità, impresa e tecnologia.',intro:'Percorso professionale, formazione, credenziali e risultati in un curriculum strutturato.',download:'Esporta curriculum PDF',exporting:'Traduzione e preparazione del PDF…',summary:'Profilo executive',results:'Risultati principali',experience:'Esperienza professionale',education:'Studi e formazione',credentials:'Credenziali e certificazioni',courses:'Formazione continua per area',skills:'Aree di competenza',services:'Consulenza e soluzioni aziendali',languages:'Lingue',contact:'Contatto professionale',quality:'SGQ e sistemi integrati',business:'Gestione aziendale',digital:'Sviluppo digitale',people:'Persone e organizzazione',qualityText:'Diagnosi, implementazione e miglioramento dei sistemi di gestione; audit interni, analisi dei rischi, non conformità, azioni correttive e preparazione agli audit di certificazione.',businessText:'Struttura organizzativa, processi, KPI, analisi dei costi, fornitori, catena di approvvigionamento e miglioramento continuo orientato ai risultati.',digitalText:'Progettazione e sviluppo di siti web, applicazioni e sistemi interni; automazione dei flussi, integrazione dei servizi e dashboard gestionali.',peopleText:'Sviluppo della leadership, formazione dei team, comunicazione e comportamento organizzativo con approccio professionale e non clinico.',allCoursesNote:'I corsi sono raggruppati per tema. I nomi degli enti e delle credenziali sono conservati quando opportuno.',issuer:'Ente',period:'Periodo',verified:'Verifica esterna disponibile',unverified:'Voce registrata; confermare con l’ente',pdfLanguage:'Lingua del PDF',otherLanguage:'Altra lingua (codice, ad esempio fr, de, ja, zh-CN)',translateNotice:'Il PDF viene tradotto con IA e convalidato prima del download.',noResults:'Mancano alcuni campi tradotti. Non è stato generato un PDF incompleto.',translationError:'La traduzione è temporaneamente non disponibile. Il curriculum originale resta invariato.',coursesCount:'attività formative registrate',credentialsCount:'credenziali elencate',years:'anni di esperienza dichiarata',careerNote:'I risultati riflettono il curriculum originale e devono essere verificati con la documentazione di supporto.',credentialLink:'Profilo pubblico delle credenziali',professional:'Consulenza sui sistemi di gestione, miglioramento aziendale e soluzioni digitali.',selectAll:'Include esperienza, studi, credenziali e formazione raggruppata.',achievement:'Risultati e contributi',cvLength:'Versione del curriculum',fullVersion:'Completo',shortVersion:'Sintesi executive' },
};
const PDF_LANGUAGES = [['es','Español'],['en','English'],['pt','Português'],['it','Italiano'],['fr','Français'],['de','Deutsch'],['nl','Nederlands'],['ja','日本語'],['zh-CN','中文（简体）'],['ar','العربية'],['ru','Русский'],['hi','हिन्दी'],['ko','한국어'],['pl','Polski'],['tr','Türkçe'],['he','עברית']];
const ISSUER_LOGOS: Array<[RegExp, string]> = [
  [/ibm/i, 'https://cdn.simpleicons.org/ibm/052FAD'],
  [/the open university|open university/i, 'https://cdn.simpleicons.org/theopenuniversity/CC0000'],
  [/microsoft/i, 'https://cdn.simpleicons.org/microsoft/5E5E5E'],
  [/google/i, 'https://cdn.simpleicons.org/google/4285F4'],
  [/fortinet/i, 'https://cdn.simpleicons.org/fortinet/EE3124'],
  [/cisco/i, 'https://cdn.simpleicons.org/cisco/1BA0D7'],
  [/coursera/i, 'https://cdn.simpleicons.org/coursera/0056D2'],
  [/credly/i, 'https://cdn.simpleicons.org/credly/FF6B00'],
  [/openclassrooms/i, 'https://cdn.simpleicons.org/openclassrooms/7451EB'],
  [/linkedin/i, 'https://cdn.simpleicons.org/linkedin/0A66C2'],
];
function getIssuerLogoUrl(issuer?: string): string | undefined {
  return ISSUER_LOGOS.find(([pattern]) => pattern.test(issuer || ''))?.[1];
}

function courseArea(title: string): string {
  const s = title.toLowerCase();
  if (/cyber|security|seguridad|ciber|privacy|privacidad|iso 27001|network|redes/.test(s)) return 'Ciberseguridad y redes';
  if (/artificial intelligence|machine learning|data science|datos|watson|quantum|cuántic|\bia\b/.test(s)) return 'IA, datos y computación avanzada';
  if (/cloud|aws|azure|google cloud|ibm cloud|computing|computación/.test(s)) return 'Cloud y computación';
  if (/web development|html|css|javascript|react|app development|android|ios|programming|software|developer/.test(s)) return 'Desarrollo web, software y apps';
  if (/project|agile|scrum|kanban|gestión de proyectos/.test(s)) return 'Gestión de proyectos y metodologías ágiles';
  if (/marketing|sales|ventas|customer|cliente|retail|business|negocio|entrepreneur|emprend/.test(s)) return 'Negocios, marketing y clientes';
  if (/leadership|liderazgo|communication|comunicación|team|equipo|psych|mental health|wellbeing|coaching/.test(s)) return 'Liderazgo, habilidades humanas y organización';
  if (/iso|quality|calidad|audit|auditor|lean|six sigma|manufactur|process|proceso|supply|supplier|proveedor|inventory|risk|riesgo/.test(s)) return 'Calidad, procesos y operaciones';
  return 'Competencias profesionales y formación general';
}
function createInput(): CurriculumTranslationInput {
  return {
    summary: CANDIDATE_INFO.summary, impactMetrics: IMPACT_METRICS, careerRoles: CAREER_EXPERIENCE,
    educationItems: [
      ...ACADEMIC_EDUCATION.map(x => ({ ...x, kind: 'education' as const })),
      ...OFFICIAL_CERTIFICATES.map(x => ({ period: x.issuedDate || '', title: x.title, institution: x.issuer, description: x.description || '', kind: 'credential' as const })),
      ...ALL_LEARNING_ACTIVITIES.map(x => ({ period: x.completedDate || '', title: x.title, institution: x.issuer || 'Formación complementaria', description: 'Área: ' + courseArea(x.title), kind: 'course' as const })),
      ...INDUSTRIAL_COURSES.map(title => ({ period: '', title, institution: 'Formación industrial', description: 'Área: ' + courseArea(title), kind: 'course' as const })),
    ],
    additionalTexts: [
      'Resultados destacados','Experiencia profesional','Estudios y formación','Credenciales y certificaciones','Formación continua por áreas','Áreas de especialidad',
      'Consultoría y soluciones para empresas','Idiomas','Contacto profesional','SGQ y sistemas integrados','Gestión empresarial','Desarrollo digital','Personas y organización',
      'Diagnóstico e implementación de sistemas de gestión, auditorías, riesgos, acciones correctivas y preparación para certificación.',
      'Estructura organizativa, procesos, indicadores KPI, análisis de costes, proveedores, cadena de suministro y mejora continua.',
      'Diseño y desarrollo de sitios web, aplicaciones y sistemas internos, automatización e integración de servicios.',
      'Desarrollo de liderazgo, formación de equipos, comunicación y comportamiento organizacional con enfoque profesional no clínico.',
      'Experiencia internacional en industria, calidad, compras, producción, tecnología y mejora continua.',
      'Perfil ejecutivo','Perfil profesional ejecutivo',
      'Calidad, procesos y operaciones','Ciberseguridad y redes','IA, datos y computación avanzada','Cloud y computación','Desarrollo web, software y apps','Gestión de proyectos y metodologías ágiles','Negocios, marketing y clientes','Liderazgo, habilidades humanas y organización','Competencias profesionales y formación general',
      ...LANGUAGES_LIST.map(x => x.name + ' — ' + x.level),
      'Consultoría de sistemas de gestión, mejora empresarial y soluciones digitales.',
      ...Array.from(new Set(OFFICIAL_CERTIFICATES.map(x => x.categoryLabel))),
    ],
  };
}
function escapeHtml(v: unknown): string {
  return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] || c));
}
function pdfHtml(data: CurriculumTranslationOutput, lang: string, t: Record<string,string>): string {
  const nEdu = ACADEMIC_EDUCATION.length, nCred = OFFICIAL_CERTIFICATES.length;
  const education = data.educationItems.slice(0, nEdu);
  const credentials = data.educationItems.slice(nEdu, nEdu + nCred);
  const courseSources = [...ALL_LEARNING_ACTIVITIES.map(x => x.title), ...INDUSTRIAL_COURSES];
  const groups = new Map<string, typeof data.educationItems>();
  data.educationItems.slice(nEdu + nCred).forEach((item, i) => {
    const key = courseArea(courseSources[i] || item.title);
    const list = groups.get(key) || []; list.push(item); groups.set(key, list);
  });
  const section = (title: string, html: string) => `<section class="sec"><h2>${escapeHtml(title)}</h2>${html}</section>`;
  const metric = data.impactMetrics.map(x => `<article class="card"><strong class="number">${escapeHtml(x.value)}</strong><h3>${escapeHtml(x.label)}</h3><p>${escapeHtml(x.detail)}</p></article>`).join('');
  const roles = data.careerRoles.map(x => `<article class="role"><div class="rolehead"><div><h3>${escapeHtml(x.title)}</h3><b>${escapeHtml(x.company)}</b><p>${escapeHtml(x.location)}</p></div><span>${escapeHtml(x.period)}</span></div><ul>${x.responsibilities.map(v=>`<li>${escapeHtml(v)}</li>`).join('')}${(x.achievements||[]).map(v=>`<li><b>${escapeHtml(v)}</b></li>`).join('')}</ul></article>`).join('');
  const edu = education.map(x=>`<article class="card"><small>${escapeHtml(x.period)}</small><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.institution)}</p><p>${escapeHtml(x.description)}</p></article>`).join('');
  const creds = credentials.map(x=>`<article class="card"><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.institution)} · ${escapeHtml(x.period)}</p><p>${escapeHtml(x.description)}</p></article>`).join('');
  const courses = [...groups.entries()].map(([name,items])=>`<div class="group"><h3>${escapeHtml(name)}</h3><ul>${items.map(x=>`<li>${escapeHtml(x.title)} <small>— ${escapeHtml(x.institution)}</small></li>`).join('')}</ul></div>`).join('');
  const extras = data.additionalTexts;
  return `<article class="cv" lang="${escapeHtml(lang)}"><style>
    .cv{font:10pt/1.45 Arial,sans-serif;color:#172033;background:#fff;width:770px;padding:0 0 20px}.hero{background:#10213e;color:#fff;padding:26px 30px;border-radius:7px}.hero small{color:#bfdbfe;letter-spacing:1.5px;text-transform:uppercase}.hero h1{font-size:24pt;line-height:1.15;margin:10px 0}.hero p{color:#e2e8f0;margin:4px 0}.sec{margin-top:18px;page-break-inside:auto}.sec h2{font-size:15pt;color:#10213e;border-bottom:2px solid #2563eb;padding-bottom:5px;margin:0 0 10px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.card,.role{border:1px solid #dbe3ef;border-radius:5px;padding:9px 11px;margin-bottom:7px;break-inside:avoid}.card h3,.role h3,.group h3{font-size:10.5pt;margin:3px 0;color:#14294c}.card p,.role p{margin:3px 0;color:#475569}.number{display:block;font-size:17pt;color:#1d4ed8}.rolehead{display:flex;justify-content:space-between;gap:10px}.rolehead span{white-space:nowrap;color:#1d4ed8;font-size:8pt}.cv ul{padding-left:16px;margin:6px 0}.cv li{margin:2px 0}.group{margin:9px 0}.group h3{background:#eff6ff;padding:6px;border-radius:4px}.cv small{color:#64748b}.foot{margin-top:18px;border-top:1px solid #cbd5e1;padding-top:8px;color:#64748b;font-size:8pt}
  </style>
  <header class="hero"><small>${escapeHtml(t.eyebrow)}</small><h1>${escapeHtml(CANDIDATE_INFO.name)}</h1><p>${escapeHtml(CANDIDATE_INFO.location)} · ${escapeHtml(CANDIDATE_INFO.email)}</p><p>${escapeHtml(t.professional)}</p></header>
  ${section(t.summary,`<p>${escapeHtml(data.summary).replace(/\n/g,'<br>')}</p>`)}
  ${section(t.results,`<div class="grid">${metric}</div>`)}
  ${section(t.experience,roles)}
  ${section(t.education,`<div class="grid">${edu}</div>`)}
  ${section(t.credentials,creds)}
  ${section(t.courses,courses)}
  ${section(t.skills,`<div class="grid"><article class="card"><h3>${escapeHtml(extras[9]||t.quality)}</h3><p>${escapeHtml(extras[13]||t.qualityText)}</p></article><article class="card"><h3>${escapeHtml(extras[10]||t.business)}</h3><p>${escapeHtml(extras[14]||t.businessText)}</p></article><article class="card"><h3>${escapeHtml(extras[11]||t.digital)}</h3><p>${escapeHtml(extras[15]||t.digitalText)}</p></article><article class="card"><h3>${escapeHtml(extras[12]||t.people)}</h3><p>${escapeHtml(extras[16]||t.peopleText)}</p></article></div>`)}
  <footer class="foot">${escapeHtml(CANDIDATE_INFO.name)} · ${escapeHtml(CANDIDATE_INFO.credlyProfile)} · ${escapeHtml(lang)}</footer></article>`;
}

export default function PublicCurriculumPage() {
  const { i18n } = useTranslation();
  const { profile } = useProfileSettings();
  const [uiLang, setUiLang] = useState<UiLanguage>(() => {
    const lang = (i18n.language || navigator.language || 'es').split('-')[0] as UiLanguage;
    return UI[lang] ? lang : 'es';
  });
  const [pdfLang, setPdfLang] = useState('es');
  const [cvLength, setCvLength] = useState<CurriculumLength>('full');
  const [customLang, setCustomLang] = useState('');
  const [busy, setBusy] = useState(false);
  const [translatingView, setTranslatingView] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [viewData, setViewData] = useState<CurriculumTranslationOutput | null>(null);
  const [viewLanguage, setViewLanguage] = useState<UiLanguage>('es');
  const t = UI[uiLang];
  const source = useMemo(createInput, []);

  useEffect(() => {
    let cancelled = false;
    if (uiLang === 'es') {
      setViewData(null);
      setViewLanguage('es');
      setTranslatingView(false);
      setProgress('');
      return () => { cancelled = true; };
    }
    setViewData(null);
    setTranslatingView(true);
    setError('');
    void translateCompleteCurriculum(source, uiLang, setProgress).then(result => {
      if (!cancelled) {
        setViewData(result);
        setViewLanguage(uiLang);
      }
    }).catch(cause => {
      console.error('Curriculum interface translation failed', cause);
      if (!cancelled) {
        setError(UI[uiLang].translationError);
        setUiLang('es');
        void i18n.changeLanguage('es');
        document.documentElement.lang = 'es';
      }
    }).finally(() => {
      if (!cancelled) {
        setTranslatingView(false);
        setProgress('');
      }
    });
    return () => { cancelled = true; };
  }, [uiLang, source, i18n]);

  const translatedView = viewData && viewLanguage === uiLang ? viewData : null;
  const visibleMetrics = translatedView?.impactMetrics ?? IMPACT_METRICS;
  const visibleRoles = translatedView?.careerRoles ?? CAREER_EXPERIENCE;
  const visibleEducation = translatedView?.educationItems.slice(0, ACADEMIC_EDUCATION.length) ?? ACADEMIC_EDUCATION;
  const visibleLanguages = useMemo(() => LANGUAGES_LIST.map((item, index) => {
    const translated = translatedView?.additionalTexts[29 + index];
    if (!translated) return item;
    const parts = translated.split(' — ');
    return { ...item, name: parts[0] || item.name, level: parts[1] || item.level };
  }), [translatedView]);
  const visibleCredentials = useMemo(() => translatedView
    ? OFFICIAL_CERTIFICATES.map((item, index) => {
        const translated = translatedView.educationItems[ACADEMIC_EDUCATION.length + index];
        return translated ? { ...item, title: translated.title || item.title, issuer: translated.institution || item.issuer, issuedDate: translated.period || item.issuedDate, description: translated.description || item.description, categoryLabel: translatedView.additionalTexts[35 + [...new Set(OFFICIAL_CERTIFICATES.map(x => x.categoryLabel))].indexOf(item.categoryLabel)] || item.categoryLabel } : item;
      })
    : OFFICIAL_CERTIFICATES, [translatedView]);
  const credentialGroups = useMemo(() => {
    const groups = new Map<string, typeof visibleCredentials>();
    visibleCredentials.forEach(item => { const list = groups.get(item.categoryLabel) || []; list.push(item); groups.set(item.categoryLabel, list); });
    return [...groups.entries()];
  }, [visibleCredentials]);
  const learningGroups = useMemo(() => {
    const groups = new Map<string, Array<{ code: string; title: string }>>();
    const offset = ACADEMIC_EDUCATION.length + OFFICIAL_CERTIFICATES.length;
    ALL_LEARNING_ACTIVITIES.forEach((item, index) => {
      const title = translatedView?.educationItems[offset + index]?.title || item.title;
      const key = courseArea(item.title);
      const list = groups.get(key) || [];
      list.push({ code: item.code, title });
      groups.set(key, list);
    });
    INDUSTRIAL_COURSES.forEach((sourceTitle, index) => {
      const title = translatedView?.educationItems[offset + ALL_LEARNING_ACTIVITIES.length + index]?.title || sourceTitle;
      const key = courseArea(sourceTitle);
      const list = groups.get(key) || [];
      list.push({ code: 'IND-' + index, title });
      groups.set(key, list);
    });
    return [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [translatedView]);
  const extra = (index: number, fallback: string) => translatedView?.additionalTexts[index] || fallback;
  const translatedArea = (area: string) => {
    const areaIndex: Record<string, number> = {
      'Calidad, procesos y operaciones': 20, 'Ciberseguridad y redes': 21,
      'IA, datos y computación avanzada': 22, 'Cloud y computación': 23,
      'Desarrollo web, software y apps': 24, 'Gestión de proyectos y metodologías ágiles': 25,
      'Negocios, marketing y clientes': 26, 'Liderazgo, habilidades humanas y organización': 27,
      'Competencias profesionales y formación general': 28,
    };
    return areaIndex[area] === undefined ? area : extra(areaIndex[area], area);
  };
  const changeUi = (value: UiLanguage) => {
    setUiLang(value);
    void i18n.changeLanguage(value);
    document.documentElement.lang = value;
  };
  const exportPdf = async () => {
    if (busy || translatingView) return;
    const language = (pdfLang === 'other' ? customLang : pdfLang).trim();
    if (!/^[a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{2,8})*$/.test(language)) { setError(t.noResults); return; }
    setBusy(true); setError(''); setProgress(t.exporting);
    try {
      // Spanish is the source language; export it without calling Gemini.
      const result = language.toLowerCase() === 'es'
        ? source
        : translatedView && viewLanguage.toLowerCase() === language.toLowerCase()
          ? translatedView
          : await translateCompleteCurriculum(source, language, setProgress);
      if (!result.summary?.trim() ||
          result.impactMetrics.length !== source.impactMetrics.length ||
          result.careerRoles.length !== source.careerRoles.length ||
          result.educationItems.length !== source.educationItems.length ||
          result.additionalTexts.length !== source.additionalTexts.length ||
          result.educationItems.some((item, index) => !item.title?.trim() ||
            (Boolean(source.educationItems[index].description?.trim()) && !item.description?.trim()))) {
        throw new Error('Incomplete translation');
      }
      const wrapper = document.createElement('div');
      wrapper.innerHTML = buildCurriculumPdfHtml(result, language, t, cvLength, profile.photoUrl || CANDIDATE_PHOTO);
      wrapper.style.cssText = 'position:fixed;left:-12000px;top:0;width:794px;background:#fff;z-index:-1';
      document.body.appendChild(wrapper);
      try {
        const html2pdfModule = await import('html2pdf.js');
        const html2pdf = html2pdfModule.default;
        await html2pdf().set({
          margin: [12, 12, 14, 12],
          filename: `Deuwy-Robert-Teran-Medina-CV-${cvLength === 'short' ? 'ejecutivo-breve' : 'completo'}-${language}.pdf`,
          image: { type: 'jpeg', quality: 0.96 },
          html2canvas: { scale: 1.6, useCORS: true, backgroundColor: '#fff', logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        }).from(wrapper.firstElementChild as HTMLElement).save();
      } finally {
        wrapper.remove();
      }
    } catch (cause) {
      console.error('Curriculum PDF export failed', cause);
      setError(cause instanceof Error && cause.message === 'Incomplete translation' ? t.noResults : t.translationError);
    } finally {
      setBusy(false);
      setProgress('');
    }
  };
  const count = ALL_LEARNING_ACTIVITIES.length + INDUSTRIAL_COURSES.length;
  return <main className="min-h-screen bg-white text-slate-900">
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3 lg:px-8">
      <Link to="/portal" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"><ArrowLeft size={17}/>{t.back}</Link>
      <div className="flex flex-wrap items-center gap-3"><label className="sr-only" htmlFor="ui-language">Interface language</label><select id="ui-language" value={uiLang} onChange={e=>changeUi(e.target.value as UiLanguage)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"><option value="es">Español</option><option value="en">English</option><option value="pt">Português</option><option value="it">Italiano</option></select>
      <div role="group" aria-label={t.cvLength} className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
        <button type="button" aria-pressed={cvLength === 'full'} onClick={() => setCvLength('full')} className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${cvLength === 'full' ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>{t.fullVersion}</button>
        <button type="button" aria-pressed={cvLength === 'short'} onClick={() => setCvLength('short')} className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${cvLength === 'short' ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>{t.shortVersion}</button>
      </div>
      <label className="sr-only" htmlFor="pdf-language">{t.pdfLanguage}</label><select id="pdf-language" value={pdfLang} onChange={e=>setPdfLang(e.target.value)} className="max-w-52 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">{PDF_LANGUAGES.map(([code,name])=><option key={code} value={code}>{name}</option>)}<option value="other">{t.otherLanguage}</option></select>
      {pdfLang==='other'&&<input value={customLang} onChange={e=>setCustomLang(e.target.value)} placeholder="fr, de, ja, zh-CN…" aria-label={t.otherLanguage} className="w-36 rounded-lg border border-slate-300 px-3 py-2 text-sm"/>}
      <button type="button" onClick={exportPdf} disabled={busy || translatingView} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 disabled:opacity-60">{busy?<LoaderCircle size={17} className="animate-spin"/>:<ArrowDownToLine size={17}/>} {busy || translatingView ? t.exporting : t.download}</button></div></div></header>
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <section className="grid gap-8 border-b border-slate-200 pb-10 md:grid-cols-[1.35fr_.65fr] md:items-end"><div><p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-blue-700"><ShieldCheck size={16}/>{t.eyebrow}</p><h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-slate-950 md:text-6xl">{t.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{t.intro}</p><div className="mt-6 flex flex-wrap gap-2"><span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-800">{t.quality}</span><span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">{t.business}</span><span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">{t.digital}</span></div></div>
      <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-6"><img src={profile.photoUrl || CANDIDATE_PHOTO} alt="Fotografía profesional de Deuwy Robert Terán Medina" className="mb-5 h-44 w-36 rounded-xl border-4 border-amber-400 object-cover object-center shadow-sm" /><p className="text-xs font-bold uppercase tracking-widest text-slate-500">{t.contact}</p><h2 className="mt-2 text-2xl font-bold">{CANDIDATE_INFO.name}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{t.professional}</p><div className="mt-4 space-y-2 text-sm text-slate-700"><p className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-blue-700"/>{CANDIDATE_INFO.location}</p><a className="flex items-center gap-2 hover:text-blue-700" href={`mailto:${CANDIDATE_INFO.email}`}><Mail size={16}/>{CANDIDATE_INFO.email}</a><a className="flex items-center gap-2 hover:text-blue-700" href={CANDIDATE_INFO.credlyProfile} target="_blank" rel="noreferrer"><ExternalLink size={16}/>{t.credentialLink}</a></div></aside></section>
      <section className="grid gap-4 border-b border-slate-200 py-7 sm:grid-cols-3"><Metric value="30+" label={t.years}/><Metric value={String(OFFICIAL_CERTIFICATES.length)} label={t.credentialsCount}/><Metric value={count.toLocaleString(uiLang)} label={t.coursesCount}/></section>
      <section className="grid gap-8 border-b border-slate-200 py-10 md:grid-cols-[220px_1fr]"><Heading icon={<Sparkles size={18}/>} title={t.summary}/><div className="max-w-4xl whitespace-pre-line text-base leading-8 text-slate-700">{translatedView?.summary ?? CANDIDATE_INFO.summary}</div></section>
      <section className="grid gap-8 border-b border-slate-200 py-10 md:grid-cols-[220px_1fr]"><Heading icon={<CheckCircle2 size={18}/>} title={t.results}/><div className="grid gap-4 sm:grid-cols-2">{visibleMetrics.map(x=><article key={x.label} className="rounded-xl border border-slate-200 p-5"><p className="text-3xl font-bold tracking-tight text-blue-800">{x.value}</p><h3 className="mt-2 font-semibold">{x.label}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{x.detail}</p></article>)}<p className="text-xs leading-5 text-slate-500 sm:col-span-2">{t.careerNote}</p></div></section>
      <section className="grid gap-8 border-b border-slate-200 py-10 md:grid-cols-[220px_1fr]"><Heading icon={<BriefcaseBusiness size={18}/>} title={t.experience}/><div className="space-y-4">{visibleRoles.map(job=><article key={job.company+job.period} className="rounded-xl border border-slate-200 p-5 md:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-lg font-bold">{job.title}</h3><p className="mt-1 font-medium text-blue-800">{job.company}</p><p className="mt-1 text-sm text-slate-500">{job.location}</p></div><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">{job.period}</span></div><ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-700">{job.responsibilities.map((x,i)=><li key={i}>{x}</li>)}</ul>{!!job.achievements?.length&&<div className="mt-4 rounded-lg bg-blue-50 p-4"><p className="text-xs font-bold uppercase tracking-wider text-blue-800">{t.achievement}</p><ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-700">{job.achievements.map((x,i)=><li key={i}>{x}</li>)}</ul></div>}</article>)}</div></section>
      <section className="grid gap-8 border-b border-slate-200 py-10 md:grid-cols-[220px_1fr]"><Heading icon={<GraduationCap size={18}/>} title={t.education}/><div className="grid gap-4 sm:grid-cols-2">{visibleEducation.map(x=><article key={x.title} className="rounded-xl border border-slate-200 p-5"><p className="text-xs font-semibold uppercase tracking-wider text-blue-800">{x.period}</p><h3 className="mt-2 font-bold">{x.title}</h3><p className="mt-1 text-sm text-slate-600">{x.institution}</p>{x.description&&<p className="mt-3 text-sm leading-6 text-slate-600">{x.description}</p>}</article>)}</div></section>
      <section className="grid gap-8 border-b border-slate-200 py-10 md:grid-cols-[220px_1fr]"><Heading icon={<BadgeCheck size={18}/>} title={t.credentials}/><div className="space-y-6">{credentialGroups.map(([group,items])=><div key={group}><h3 className="mb-3 text-xs font-bold uppercase tracking-[.15em] text-slate-500">{group}</h3><div className="grid gap-3 sm:grid-cols-2">{items.map(x=><article key={x.code} className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-md"><div className="mb-3 flex items-center gap-3"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2">{getIssuerLogoUrl(x.issuer) ? <img src={getIssuerLogoUrl(x.issuer)} alt={x.issuer + ' logo'} className="max-h-full max-w-full object-contain" loading="lazy" onError={(event) => { (event.currentTarget as HTMLImageElement).style.display = 'none'; }} /> : <span className="text-[10px] font-bold uppercase text-slate-500">{(x.issuer || 'CERT').replace(/[^a-z0-9]/gi, '').slice(0, 4)}</span>}</div><div className="min-w-0 flex-1"><h4 className="font-semibold leading-6 text-slate-900">{x.title}</h4><p className="mt-1 text-sm text-slate-600">{x.issuer} · {x.issuedDate}</p></div>{x.verified?<BadgeCheck size={17} className="shrink-0 text-emerald-700"/>:<ShieldCheck size={17} className="shrink-0 text-slate-400"/>}</div><p className="text-xs leading-5 text-slate-500">{x.verified?t.verified:t.unverified}</p>{x.verificationUrl&&<a href={x.verificationUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-800 hover:underline"><ExternalLink size={13}/>{t.credentialLink}</a>}</article>)}</div></div>)}</div></section>
      <section className="grid gap-8 border-b border-slate-200 py-10 md:grid-cols-[220px_1fr]"><Heading icon={<Languages size={18}/>} title={t.skills}/><div className="grid gap-4 sm:grid-cols-2"><Service title={extra(9,t.quality)} text={extra(13,t.qualityText)}/><Service title={extra(10,t.business)} text={extra(14,t.businessText)}/><Service title={extra(11,t.digital)} text={extra(15,t.digitalText)}/><Service title={extra(12,t.people)} text={extra(16,t.peopleText)}/></div></section>
      <section className="grid gap-8 border-b border-slate-200 py-10 md:grid-cols-[220px_1fr]"><Heading icon={<Globe2 size={18}/>} title={t.languages}/><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{visibleLanguages.map(x=><div key={x.name} className="rounded-xl bg-slate-50 p-4"><div className="flex items-center justify-between gap-2"><span className="font-semibold">{x.name}</span><span className="text-sm text-slate-600">{x.percentage}%</span></div><p className="mt-1 text-sm text-slate-600">{x.level}</p><div className="mt-3 h-1.5 rounded-full bg-slate-200"><div className="h-1.5 rounded-full bg-blue-700" style={{width:`${Math.max(0,Math.min(100,x.percentage))}%`}}/></div></div>)}</div></section>
      <section className="grid gap-8 py-10 md:grid-cols-[220px_1fr]"><Heading icon={<GraduationCap size={18}/>} title={t.courses}/><div><p className="mb-5 text-sm leading-6 text-slate-600">{t.allCoursesNote}</p><div className="space-y-3">{learningGroups.map(([group,items])=><details key={group} className="group rounded-xl border border-slate-200 open:bg-slate-50"><summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-semibold"><span>{translatedArea(group)}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{items.length}</span></summary><ul className="grid gap-x-6 gap-y-2 border-t border-slate-200 px-5 py-4 text-sm leading-6 text-slate-700 md:grid-cols-2">{items.map(x=><li key={x.code} className="break-words">{x.title}</li>)}</ul></details>)}</div></div></section>
      <footer className="flex flex-col gap-4 border-t border-slate-200 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between"><p>{CANDIDATE_INFO.name} · {CANDIDATE_INFO.location}</p><div className="flex flex-wrap items-center gap-4"><a className="hover:text-slate-900" href={`mailto:${CANDIDATE_INFO.email}`}>{CANDIDATE_INFO.email}</a><a className="hover:text-slate-900" href={CANDIDATE_INFO.credlyProfile} target="_blank" rel="noreferrer">Credly</a><Link className="hover:text-slate-900" to="/login">Dashboard / Acceso</Link></div></footer>
      <p className="text-xs text-slate-400">{t.translateNotice} {t.selectAll}</p>
      {error&&<div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
      {(busy || translatingView)&&<div role="status" aria-live="polite" className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-xl bg-slate-950 px-4 py-3 text-sm text-white shadow-xl"><LoaderCircle className="shrink-0 animate-spin" size={18}/><span>{progress}</span></div>}
    </div>
  </main>;
}
function Heading({icon,title}:{icon:ReactNode;title:string}) { return <h2 className="flex items-start gap-2 text-sm font-bold uppercase tracking-[.14em] text-slate-800"><span className="text-blue-800">{icon}</span><span>{title}</span></h2>; }
function Metric({value,label}:{value:string;label:string}) { return <article className="rounded-xl bg-slate-50 p-5"><p className="text-3xl font-bold text-slate-950">{value}</p><p className="mt-1 text-sm leading-5 text-slate-600">{label}</p></article>; }
function Service({title,text}:{title:string;text:string}) { return <article className="rounded-xl border border-slate-200 p-5"><h3 className="font-bold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></article>; }
