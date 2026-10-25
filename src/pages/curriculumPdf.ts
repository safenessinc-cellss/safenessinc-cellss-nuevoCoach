import { ACADEMIC_EDUCATION, ALL_LEARNING_ACTIVITIES, CANDIDATE_INFO, INDUSTRIAL_COURSES, OFFICIAL_CERTIFICATES } from '../data/robertTeranCurriculumData';
import type { CurriculumTranslationInput, CurriculumTranslationOutput } from '../ai/geminiClient';

function esc(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c] || c));
}
function area(title: string): string {
  const s=title.toLowerCase();
  if (/cyber|security|seguridad|ciber|privacy|iso 27001|network/.test(s)) return 'Cybersecurity and networks';
  if (/artificial intelligence|machine learning|data science|watson|quantum|\bia\b|datos/.test(s)) return 'AI, data and advanced computing';
  if (/cloud|aws|azure|google cloud|ibm cloud|computing/.test(s)) return 'Cloud and computing';
  if (/web development|html|css|javascript|react|android|ios|programming|software|developer/.test(s)) return 'Web, software and apps';
  if (/project|agile|scrum|kanban/.test(s)) return 'Project and agile methods';
  if (/marketing|sales|customer|retail|business|entrepreneur|negocio/.test(s)) return 'Business, marketing and customers';
  if (/leadership|communication|team|psych|mental health|wellbeing|coaching/.test(s)) return 'Leadership and people';
  if (/iso|quality|calidad|audit|lean|six sigma|manufactur|process|supply|inventory|risk/.test(s)) return 'Quality, processes and operations';
  return 'Professional and general learning';
}

export function buildCurriculumPdfHtml(data: CurriculumTranslationOutput, language: string, labels: Record<string,string>): string {
  const e=ACADEMIC_EDUCATION.length, c=OFFICIAL_CERTIFICATES.length;
  const education=data.educationItems.slice(0,e);
  const credentials=data.educationItems.slice(e,e+c);
  const courseTitles=[...ALL_LEARNING_ACTIVITIES.map(x=>x.title),...INDUSTRIAL_COURSES];
  const grouped=new Map<string,typeof data.educationItems>();
  data.educationItems.slice(e+c).forEach((item,i)=>{const key=area(courseTitles[i]||item.title);const list=grouped.get(key)||[];list.push(item);grouped.set(key,list);});
  const section=(title:string,body:string)=>'<section class="section"><h2>'+esc(title)+'</h2>'+body+'</section>';
  const metric=data.impactMetrics.map(x=>'<article class="card"><b class="number">'+esc(x.value)+'</b><h3>'+esc(x.label)+'</h3><p>'+esc(x.detail)+'</p></article>').join('');
  const roles=data.careerRoles.map(x=>'<article class="card"><div class="role"><div><h3>'+esc(x.title)+'</h3><b>'+esc(x.company)+'</b><p>'+esc(x.location)+'</p></div><span>'+esc(x.period)+'</span></div><ul>'+x.responsibilities.map(v=>'<li>'+esc(v)+'</li>').join('')+(x.achievements||[]).map(v=>'<li><b>'+esc(v)+'</b></li>').join('')+'</ul></article>').join('');
  const edu=education.map(x=>'<article class="card"><small>'+esc(x.period)+'</small><h3>'+esc(x.title)+'</h3><p>'+esc(x.institution)+'</p><p>'+esc(x.description)+'</p></article>').join('');
  const creds=credentials.map(x=>'<article class="card"><h3>'+esc(x.title)+'</h3><p>'+esc(x.institution)+' · '+esc(x.period)+'</p><p>'+esc(x.description)+'</p></article>').join('');
  const x=data.additionalTexts;
  const groupLabels: Record<string,string> = {'Quality, processes and operations':x[20]||'Quality, processes and operations','Cybersecurity and networks':x[21]||'Cybersecurity and networks','AI, data and advanced computing':x[22]||'AI, data and advanced computing','Cloud and computing':x[23]||'Cloud and computing','Web, software and apps':x[24]||'Web, software and apps','Project and agile methods':x[25]||'Project and agile methods','Business, marketing and customers':x[26]||'Business, marketing and customers','Leadership and people':x[27]||'Leadership and people','Professional and general learning':x[28]||'Professional and general learning'};
  const courses=[...grouped.entries()].map(([name,items])=>'<div class="group"><h3>'+esc(groupLabels[name]||name)+'</h3><ul>'+items.map(x=>'<li>'+esc(x.title)+' <small>— '+esc(x.institution)+'</small></li>').join('')+'</ul></div>').join('');
  return '<article class="cv" lang="'+esc(language)+'"><style>'+
  '.cv{font:10pt/1.45 Arial,sans-serif;color:#172033;background:#fff;width:770px;padding:0 0 20px}.hero{background:#10213e;color:#fff;padding:26px 30px;border-radius:7px}.hero small{color:#bfdbfe;letter-spacing:1.5px;text-transform:uppercase}.hero h1{font-size:24pt;line-height:1.15;margin:10px 0}.hero p{color:#e2e8f0;margin:4px 0}.section{margin-top:18px;page-break-inside:auto}.section h2{font-size:15pt;color:#10213e;border-bottom:2px solid #2563eb;padding-bottom:5px;margin:0 0 10px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.card{border:1px solid #dbe3ef;border-radius:5px;padding:9px 11px;margin-bottom:7px;break-inside:avoid}.card h3,.group h3{font-size:10.5pt;margin:3px 0;color:#14294c}.card p{margin:3px 0;color:#475569}.number{display:block;font-size:17pt;color:#1d4ed8}.role{display:flex;justify-content:space-between;gap:10px}.role span{white-space:nowrap;color:#1d4ed8;font-size:8pt}.cv ul{padding-left:16px;margin:6px 0}.cv li{margin:2px 0}.group{margin:9px 0}.group h3{background:#eff6ff;padding:6px;border-radius:4px}.cv small{color:#64748b}.foot{margin-top:18px;border-top:1px solid #cbd5e1;padding-top:8px;color:#64748b;font-size:8pt}'+
  '</style><header class="hero"><small>'+esc(x[19]||labels.eyebrow)+'</small><h1>'+esc(CANDIDATE_INFO.name)+'</h1><p>'+esc(CANDIDATE_INFO.location)+' · '+esc(CANDIDATE_INFO.email)+'</p><p>'+esc(x[34]||labels.professional)+'</p></header>'+
  section(x[18]||labels.summary,'<p>'+esc(data.summary).replace(/\n/g,'<br>')+'</p>')+
  section(x[0]||labels.results,'<div class="grid">'+metric+'</div>')+
  section(x[1]||labels.experience,roles)+section(x[2]||labels.education,'<div class="grid">'+edu+'</div>')+
  section(x[3]||labels.credentials,creds)+section(x[4]||labels.courses,courses)+
  section(x[5]||labels.skills,'<div class="grid"><article class="card"><h3>'+esc(x[9]||labels.quality)+'</h3><p>'+esc(x[13]||labels.qualityText)+'</p></article><article class="card"><h3>'+esc(x[10]||labels.business)+'</h3><p>'+esc(x[14]||labels.businessText)+'</p></article><article class="card"><h3>'+esc(x[11]||labels.digital)+'</h3><p>'+esc(x[15]||labels.digitalText)+'</p></article><article class="card"><h3>'+esc(x[12]||labels.people)+'</h3><p>'+esc(x[16]||labels.peopleText)+'</p></article></div>')+
  section(x[7]||labels.languages,'<div class="grid">'+x.slice(29,34).map(v=>'<article class="card">'+esc(v)+'</article>').join('')+'</div>')+
  '<footer class="foot">'+esc(CANDIDATE_INFO.name)+' · '+esc(CANDIDATE_INFO.credlyProfile)+' · '+esc(language)+'</footer></article>';
}
