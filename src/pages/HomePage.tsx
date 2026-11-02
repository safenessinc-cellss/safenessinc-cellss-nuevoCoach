import { useEffect, useState, type CSSProperties } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, Globe2, Mail, Menu, ShieldCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { useProfileSettings } from '../data/useProfileSettings';
import { useCurriculumSettings } from '../data/useCurriculumSettings';
import { useTheme } from '../theme/ThemeContext';
import { SITE_LANGUAGES, SiteLanguage } from '../site/siteContent';
import { usePublicSiteSettings } from '../site/usePublicSiteSettings';
import './home-page.css';

interface PublishedBook {
  id: string;
  title: string;
  author?: string;
  year?: number;
  coverUrl?: string;
  pdfUrl?: string;
}

function safeWebUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function safeEmail(value: string | undefined): string | undefined {
  return value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : undefined;
}

export default function HomePage() {
  const { i18n } = useTranslation();
  const { profile } = useProfileSettings();
  const { curriculumData } = useCurriculumSettings();
  const { tokens } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [books, setBooks] = useState<PublishedBook[]>([]);
  const currentLanguage = (i18n.resolvedLanguage || i18n.language || 'es').slice(0, 2);
  const language: SiteLanguage = SITE_LANGUAGES.some((item) => item.code === currentLanguage) ? currentLanguage as SiteLanguage : 'es';
  const { copy, links } = usePublicSiteSettings(language);
  const email = safeEmail(links.email);
  const linkedin = safeWebUrl(links.linkedin);
  const whatsapp = safeWebUrl(links.whatsapp);
  const logoUrl = '/coach-iso-globe.png';

  useEffect(() => {
    document.title = `${profile.name || 'Robert Terán'} | Coach ISO · Consultoría`;
    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!description) {
      description = document.createElement('meta');
      description.name = 'description';
      document.head.appendChild(description);
    }
    description.content = copy.hero.description;
  }, [copy.hero.description, profile.name]);

  useEffect(() => onSnapshot(collection(db, 'books'), (snapshot) => {
    const available = snapshot.docs
      .map((item) => ({ id: item.id, ...item.data() } as PublishedBook))
      .filter((book) => Boolean(book.title && safeWebUrl(book.pdfUrl)) && !/qualityraterguidelines|static\.googleusercontent\.com/i.test(book.pdfUrl || ''));
    setBooks(available);
  }, () => setBooks([])), []);

  const changeLanguage = async (next: string) => {
    if (SITE_LANGUAGES.some((item) => item.code === next)) await i18n.changeLanguage(next);
    setMenuOpen(false);
  };
  const roles = curriculumData.careerRoles.slice(0, 4);
  const metrics = curriculumData.impactMetrics.slice(0, 3);

  return (
    <div className="new-site" style={{ '--site-accent': tokens.accent, '--site-accent-soft': `${tokens.accent}12`, '--site-warm': tokens.accent2 } as CSSProperties}>
      <header className="site-header">
        <Link className="site-brand" to="/" aria-label="Coach ISO inicio">
          <span className="site-brand-mark"><img className="brand-globe-spin" src={logoUrl} alt="" /></span>
          <span><strong>{copy.brand.name}</strong><small>{copy.brand.descriptor}</small></span>
        </Link>
        <nav className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navegación principal">
          <a href="#expertise" onClick={() => setMenuOpen(false)}>{copy.nav.expertise}</a>
          <a href="#iso-systems" onClick={() => setMenuOpen(false)}>{copy.nav.iso}</a>
          <a href="#biotypes" onClick={() => setMenuOpen(false)}>{copy.nav.biotypes}</a>
          <a href="#development" onClick={() => setMenuOpen(false)}>{copy.nav.digital}</a>
          <a href="#experience" onClick={() => setMenuOpen(false)}>{copy.nav.experience}</a>
          <a href="#publications" onClick={() => setMenuOpen(false)}>{copy.nav.publication}</a>
          <a className="site-nav-contact" href="#contact" onClick={() => setMenuOpen(false)}>{copy.nav.contact}<ArrowUpRight size={15} /></a>
          <label className="site-language" aria-label="Idioma">
            <Globe2 size={15} />
            <select value={language} onChange={(event) => void changeLanguage(event.target.value)} aria-label="Seleccionar idioma">
              {SITE_LANGUAGES.map((item) => <option value={item.code} key={item.code}>{item.code.toUpperCase()}</option>)}
            </select>
            <ChevronDown size={13} />
          </label>
        </nav>
        <button type="button" className="site-menu-toggle" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <main>
        <section className="site-hero" id="top">
          <div className="site-hero-copy">
            <p className="site-eyebrow"><span />{copy.hero.eyebrow}</p>
            <h1>{copy.hero.title} <em>{copy.hero.highlight}</em></h1>
            <p className="site-lead">{copy.hero.description}</p>
            <div className="site-hero-actions">
              <a className="site-button site-button-primary" href="#expertise">{copy.hero.primaryAction}<ArrowRight size={17} /></a>
              <Link className="site-button site-button-secondary" to="/curriculo">{copy.hero.secondaryAction}<ArrowUpRight size={16} /></Link>
            </div>
            <div className="site-hero-proof"><ShieldCheck size={16} /><span>{copy.hero.specialty}</span></div>
          </div>
          <div className="site-hero-visual" aria-label={profile.name}>
            <div className="site-visual-grid" aria-hidden="true" />
            <div className="site-visual-orbit orbit-one" aria-hidden="true" />
            <div className="site-visual-orbit orbit-two" aria-hidden="true" />
            <div className="site-portrait-frame">
              <img src={profile.photoUrl || undefined} alt={profile.name || 'Consultor'} referrerPolicy="no-referrer" />
            </div>
            <div className="site-visual-caption"><span className="site-caption-dot" />{profile.name || 'Robert Terán'}<small>{copy.hero.specialty}</small></div>
            <div className="site-visual-note"><span>{copy.experience.yearsValue}</span><small>{copy.experience.yearsLabel}</small></div>
          </div>
          <a className="site-scroll-cue" href="#expertise" aria-label={copy.nav.expertise}><ArrowDown size={16} /></a>
        </section>

        <section className="site-section site-iso-section" id="iso-systems">
          <div className="site-section-heading">
            <div><p className="site-eyebrow">{copy.iso.eyebrow}</p><h2>{copy.iso.title}</h2></div>
            <p>{copy.iso.description}</p>
          </div>
          <div className="site-service-grid">
            {copy.iso.cards.map((card, index) => <article className="site-service-card" key={`${card.title}-${index}`}>
              <span className="site-card-index">0{index + 1}</span><span className="site-card-rule" />
              <h3>{card.title}</h3><p>{card.description}</p>
            </article>)}
          </div>
          <div className="site-section-note"><ShieldCheck size={17} /><p>{copy.iso.transitionNote}</p><a href="#contact">{copy.iso.action}<ArrowUpRight size={15} /></a></div>
        </section>

        <section className="site-section site-biotypes-section" id="biotypes">
          <div className="site-section-heading">
            <div><p className="site-eyebrow">{copy.biotypes.eyebrow}</p><h2>{copy.biotypes.title}</h2></div>
            <p>{copy.biotypes.description}</p>
          </div>
          <div className="site-service-grid">
            {copy.biotypes.cards.map((card, index) => <article className="site-service-card site-biotype-card" key={`${card.title}-${index}`}>
              <span className="site-card-index">0{index + 1}</span><span className="site-card-rule" />
              <h3>{card.title}</h3><p>{card.description}</p>
            </article>)}
          </div>
          <div className="site-section-note site-biotype-note"><p>{copy.biotypes.note}</p><a href="#contact">{copy.biotypes.action}<ArrowUpRight size={15} /></a></div>
        </section>

        <section className="site-section site-expertise" id="expertise">
          <div className="site-section-heading">
            <div><p className="site-eyebrow">{copy.expertise.eyebrow}</p><h2>{copy.expertise.title}</h2></div>
            <p>{copy.expertise.description}</p>
          </div>
          <div className="site-service-grid">
            {copy.expertise.cards.map((card, index) => (
              <article className="site-service-card" key={`${card.title}-${index}`}>
                <span className="site-card-index">0{index + 1}</span>
                <span className="site-card-rule" />
                <h3>{card.title}</h3><p>{card.description}</p>
                <ArrowUpRight className="site-card-arrow" size={19} />
              </article>
            ))}
          </div>
        </section>

        <section className="site-experience-band" id="experience">
          <div className="site-section-heading">
            <div><p className="site-eyebrow">{copy.experience.eyebrow}</p><h2>{copy.experience.title}</h2></div>
            <div className="site-experience-intro"><p>{copy.experience.description}</p><Link to="/curriculo">{copy.experience.openCv}<ArrowRight size={16} /></Link></div>
          </div>
          <div className="site-career-list">
            {roles.map((role, index) => (
              <article className="site-career-row" key={`${role.company}-${role.period}-${index}`}>
                <span className="site-career-number">0{index + 1}</span>
                <div><h3>{role.title}</h3><p>{role.company} <span>·</span> {role.location}</p></div>
                <time>{role.period}</time>
              </article>
            ))}
          </div>
          {metrics.length > 0 && <div className="site-results-strip">
            <div className="site-results-label"><Check size={15} />{copy.experience.resultsLabel}</div>
            {metrics.map((metric) => <div className="site-result" key={`${metric.value}-${metric.label}`}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
            <small>{copy.experience.resultsDisclaimer}</small>
          </div>}
        </section>

        <section className="site-digital-feature" id="development">
          <div className="site-digital-visual" aria-hidden="true"><div className="site-flow-node node-a" /><div className="site-flow-node node-b" /><div className="site-flow-node node-c" /><div className="site-flow-line line-a" /><div className="site-flow-line line-b" /><span>SAFENESS.INC</span></div>
          <div className="site-digital-copy"><p className="site-eyebrow">{copy.digital.eyebrow}</p><h2>{copy.digital.title}</h2><p>{copy.digital.description}</p><Link to="/curriculo">{copy.digital.linkLabel}<ArrowRight size={17} /></Link></div>
          <div className="site-development-process"><h3>{copy.digital.stepsLabel}</h3><ol>{copy.digital.steps.map((step, index) => <li key={`${step.title}-${index}`}><span className="site-process-number">0{index + 1}</span><div><strong>{step.title}</strong><p>{step.description}</p></div></li>)}</ol></div>
        </section>

        {books.length > 0 && <section className="site-section site-publications" id="publications">
          <div className="site-section-heading"><div><p className="site-eyebrow">{copy.publication.eyebrow}</p><h2>{copy.publication.title}</h2></div><p>{copy.publication.description}</p></div>
          <div className="site-book-grid">
            {books.map((book) => <article className="site-book-card" key={book.id}>
              <div className="site-book-cover">{safeWebUrl(book.coverUrl) ? <img src={safeWebUrl(book.coverUrl)} alt={book.title} loading="lazy" referrerPolicy="no-referrer" /> : <BookOpen size={38} />}</div>
              <div className="site-book-info"><p className="site-book-meta">{book.year || 'PUBLICACIÓN'} · {book.author || 'Robert Terán'}</p><h3>{book.title}</h3>{safeWebUrl(book.pdfUrl) && <a href={safeWebUrl(book.pdfUrl)} target="_blank" rel="noopener noreferrer">{copy.publication.openBook}<ArrowUpRight size={16} /></a>}</div>
            </article>)}
          </div>
        </section>}

        <section className="site-contact" id="contact">
          <div><p className="site-eyebrow">{copy.contact.eyebrow}</p><h2>{copy.contact.title}</h2><p>{copy.contact.description}</p></div>
          <div className="site-contact-actions">
            {email && <a href={`mailto:${email}`}><Mail size={17} />{copy.contact.emailLabel}<ArrowUpRight size={15} /></a>}
            {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer">{copy.contact.linkedinLabel}<ArrowUpRight size={15} /></a>}
            {whatsapp && <a href={whatsapp} target="_blank" rel="noopener noreferrer">{copy.contact.whatsappLabel}<ArrowUpRight size={15} /></a>}
          </div>
        </section>
      </main>

      <footer className="site-footer"><Link className="site-brand" to="/" aria-label="Coach ISO inicio"><span className="site-brand-mark"><img className="brand-globe-spin" src={logoUrl} alt="" /></span><span><strong>{copy.brand.name}</strong><small>{copy.brand.descriptor}</small></span></Link><p>{copy.footer.tagline}<small>{copy.footer.privacy}</small></p><Link to="/curriculo" className="site-footer-cv">CV <ArrowUpRight size={14} /></Link></footer>
    </div>
  );
}
