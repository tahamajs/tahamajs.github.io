// src/App.jsx
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useToast, useTehranClock, useGpuMetrics, useBeep } from './hooks/index.js';
import { useTheme } from './context/ThemeContext.jsx';

import NeuralBackground from './components/layout/NeuralBackground.jsx';
import ValueStrip from './components/layout/ValueStrip.jsx';
import Navigation from './components/layout/Navigation.jsx';
import PageRouterBar from './components/layout/PageRouterBar.jsx';
import Footer from './components/layout/Footer.jsx';
import FloatingContactBar from './components/ui/FloatingContactBar.jsx';
import GameHUDHeader from './components/ui/GameHUDHeader.jsx';

import HeroSection from './components/sections/HeroSection.jsx';
import AchievementsSection from './components/sections/AchievementsSection.jsx';
import ConstellationSection from './components/sections/ConstellationSection.jsx';
import TimelineSection from './components/sections/TimelineSection.jsx';
import ContributionGraph from './components/sections/ContributionGraph.jsx';
import SkillsSection from './components/sections/SkillsSection.jsx';
import CodeSandboxSection from './components/sections/CodeSandboxSection.jsx';
import ProjectsSection from './components/sections/ProjectsSection.jsx';
import PublicationsSection from './components/sections/PublicationsSection.jsx';
import SubstackSection from './components/sections/SubstackSection.jsx';
import ReadmeSection from './components/sections/ReadmeSection.jsx';
import NewsletterSection from './components/sections/NewsletterSection.jsx';
import PhotosSection from './components/sections/PhotosSection.jsx';
import ContactSection from './components/sections/ContactSection.jsx';
import SocialFeedSection from './components/sections/SocialFeedSection.jsx';
import GpuTelemetrySection from './components/sections/GpuTelemetrySection.jsx';
import BenchmarkSection from './components/sections/BenchmarkSection.jsx';
import TeachingSection from './components/sections/TeachingSection.jsx';
import TalksSection from './components/sections/TalksSection.jsx';

import AIChatModal from './components/modals/AIChatModal.jsx';
import HireModal from './components/modals/HireModal.jsx';
import CommandPalette from './components/modals/CommandPalette.jsx';
import TerminalModal from './components/modals/TerminalModal.jsx';
import ArticleCreatorModal from './components/modals/ArticleCreatorModal.jsx';
import NNPlaygroundModal from './components/modals/NNPlaygroundModal.jsx';
import PaperReaderModal from './components/modals/PaperReaderModal.jsx';
import CyberpunkGameModal from './components/modals/CyberpunkGameModal.jsx';
import KeyboardShortcutsModal from './components/modals/KeyboardShortcutsModal.jsx';
import AlgorithmGameModal from './components/modals/AlgorithmGameModal.jsx';
import TelegramBotModal from './components/modals/TelegramBotModal.jsx';
import BookingModal from './components/modals/BookingModal.jsx';
import AuthModal from './components/modals/AuthModal.jsx';
import Modal from './components/ui/Modal.jsx';
import Toast from './components/ui/Toast.jsx';

import { toggleWeatherAudio } from './utils/weatherAudio.js';

const SPONSOR_URL = 'https://github.com/sponsors/tahamajs';
const EMAIL = 'tahamajlesi@ut.ac.ir';

// دسته‌بندی‌های واقعی داده در data.json: course, ai, systems, web
const CATEGORIES = ['course', 'ai', 'systems', 'web'];

export default function App() {
  // ── Global States ─────────────────────────────────────────
  const [data, setData] = useState({ repos: [], articles: [], hf: [], readmeHtml: '' });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [hfFilter, setHfFilter] = useState('all');
  const [subSearch, setSubSearch] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  // ── UI & Weather States ───────────────────────────────────
  const [pageView, setPageView] = useState('all');
  const [weatherMode, setWeatherMode] = useState('rain');
  const [weatherAudioOn, setWeatherAudioOn] = useState(false);
  const { accent, setAccent } = useTheme();
  const [mobileNav, setMobileNav] = useState(false);
  const [codeTab, setCodeTab] = useState('flow');
  const [codeOut, setCodeOut] = useState('');
  const [soundOn, setSoundOn] = useState(false);

  // ── Modal States ──────────────────────────────────────────
  const [aiOpen, setAiOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [hireOpen, setHireOpen] = useState(false);
  const [cliOpen, setCliOpen] = useState(false);
  const [nnOpen, setNnOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [algoGameOpen, setAlgoGameOpen] = useState(false);
  const [telegramOpen, setTelegramOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [bibtexPub, setBibtexPub] = useState(null);

  // ── Custom Hooks ──────────────────────────────────────────
  const [toast, showToast] = useToast();
  const time = useTehranClock();
  const gpuM = useGpuMetrics();
  const beep = useBeep(soundOn);

  // ── Weather Audio Toggle ──────────────────────────────────
  const handleToggleWeatherAudio = useCallback(() => {
    const active = toggleWeatherAudio(weatherMode, 0.15);
    setWeatherAudioOn(active);
    showToast(active ? `🌧️ ${weatherMode.toUpperCase()} Ambient Sound ON` : '🔇 Weather Audio OFF');
    beep(700);
  }, [weatherMode, showToast, beep]);

  // ── Data Fetching ─────────────────────────────────────────
  useEffect(() => {
    fetch('data.json')
      .then(r => r.json())
      .then(d => setData({ repos: [], articles: [], hf: [], readmeHtml: '', ...d }))
      .catch(() => {});
  }, []);

  // ── Keyboard Shortcuts ────────────────────────────────────
  useEffect(() => {
    const fn = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (['input', 'textarea', 'select'].includes(tag)) return;

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(p => !p); return; }
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') { e.preventDefault(); setCliOpen(p => !p); return; }
      if (e.key === '?' || (e.shiftKey && e.key === '/')) { e.preventDefault(); setShortcutsOpen(p => !p); return; }

      if (e.key === '1') setPageView('home');
      if (e.key === '2') setPageView('lab');
      if (e.key === '3') setPageView('projects');
      if (e.key === '4') setPageView('papers');
      if (e.key === '5') setPageView('contact');
      if (e.key === '6') setPageView('photos');
      if (e.key === 'm' || e.key === 'M') handleToggleWeatherAudio();

      if (e.key === 'Escape') {
        setCmdOpen(false); setAiOpen(false); setHireOpen(false);
        setCliOpen(false); setBibtexPub(null); setMobileNav(false);
        setNnOpen(false); setGameOpen(false); setShortcutsOpen(false);
        setSelectedPaper(null); setAlgoGameOpen(false);
        setTelegramOpen(false); setBookingOpen(false); setAuthOpen(false);
        setArticleModalOpen(false);
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [handleToggleWeatherAudio]);

  // ── Derived Data ──────────────────────────────────────────
  const repos = useMemo(() => (data.repos || []).filter(r => {
    const ok = filter === 'all' || r.cat === filter;
    if (!ok) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const haystack = [r.name, r.title, r.desc, r.lang, r.tag, r.uni]
      .filter(Boolean).join(' ').toLowerCase();
    return haystack.includes(q);
  }), [data.repos, filter, search]);

  const articles = useMemo(() => {
    const q = subSearch.trim().toLowerCase();
    if (!q) return data.articles || [];
    return (data.articles || []).filter(a => {
      const haystack = [a.title, a.desc].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [data.articles, subSearch]);

  const hfAssets = useMemo(
    () => (data.hf || []).filter(h =>
      hfFilter === 'all' || (h.type || '').toLowerCase() === hfFilter.toLowerCase()
    ),
    [data.hf, hfFilter]
  );

  // شمارنده‌ها روی کل داده، نه روی لیست فیلترشده
  const counts = useMemo(() => {
    const all = data.repos || [];
    const hf = data.hf || [];
    const byCat = (c) => all.filter(r => r.cat === c).length;
    return {
      all: all.length,
      course:  byCat('course'),
      ai:      byCat('ai'),
      systems: byCat('systems'),
      web:     byCat('web'),
      hfModels:   hf.filter(a => a.type === 'model').length,
      hfDatasets: hf.filter(a => a.type === 'dataset').length,
    };
  }, [data.repos, data.hf]);

  // ── Actions ───────────────────────────────────────────────
  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const setAccentColor = useCallback((c) => {
    setAccent(c);
    beep(800);
    showToast(`Theme: ${c} ✨`);
  }, [setAccent, beep, showToast]);

  const copyBib = useCallback((bib) => {
    if (!bib) return;
    navigator.clipboard.writeText(bib);
    beep(700, 'square');
    showToast('📄 BibTeX copied!');
    setBibtexPub(null);
  }, [beep, showToast]);

  const handleCopyEmail = useCallback(() => {
    navigator.clipboard.writeText(EMAIL);
    showToast(`📋 Email (${EMAIL}) copied to clipboard!`);
  }, [showToast]);

  const handleCmd = useCallback((id) => {
    setCmdOpen(false);
    const map = {
      cli: () => setCliOpen(true),
      nn: () => setNnOpen(true),
      ai: () => setAiOpen(true),
      hire: () => setHireOpen(true),
      sponsor: () => window.open(SPONSOR_URL, '_blank'),
      linkedin: () => window.open('https://linkedin.com/in/tahamajlesi', '_blank'),
      instagram: () => window.open('https://instagram.com/hooshaaii', '_blank'),
      hf: () => window.open('https://huggingface.co/tahamajs', '_blank'),
      substack: () => window.open('https://hooshaai.substack.com', '_blank'),
      email: () => { window.location.href = `mailto:${EMAIL}`; },
      resume: () => window.open('assets/resume.pdf', '_blank'),
      telemetry: () => { setPageView('lab'); scrollTo('telemetry'); },
      sandbox: () => { setPageView('lab'); scrollTo('sandbox'); },
      constellation: () => { setPageView('projects'); scrollTo('constellation'); },
      projects: () => { setPageView('projects'); scrollTo('projects'); },
      publications: () => { setPageView('papers'); scrollTo('publications'); },
      feed: () => { setPageView('papers'); scrollTo('social-feed'); },
      experience: () => { setPageView('home'); scrollTo('experience'); },
      contact: () => { setPageView('contact'); scrollTo('contact'); },
    };
    (map[id] || (() => {}))();
  }, [scrollTo]);

  const handleAddArticle = useCallback((newArticle) => {
    setData(prev => ({
      ...prev,
      articles: [newArticle, ...(prev.articles || [])],
    }));
  }, []);

  const handleNavigate = useCallback((sectionId) => {
    setPageView('all');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }, []);

  // ── Render ────────────────────────────────────────────────
  return (
    <>
      <NeuralBackground mode={weatherMode} />
      <ValueStrip />
      <Navigation
        mobileNav={mobileNav}
        setMobileNav={setMobileNav}
        onHire={() => setHireOpen(true)}
        onCmd={() => setCmdOpen(true)}
        onNavigate={handleNavigate}
      />
      <GameHUDHeader beep={beep} />
      <FloatingContactBar
        onHire={() => setHireOpen(true)}
        onCopyEmail={handleCopyEmail}
        onTelegramBot={() => setTelegramOpen(true)}
        onBookCall={() => setBookingOpen(true)}
        onAuth={() => setAuthOpen(true)}
        userProfile={userProfile}
        beep={beep}
        showToast={showToast}
      />

      <main style={{ paddingTop: '95px' }}>
        <PageRouterBar pageView={pageView} setPageView={setPageView} beep={beep} />

        {(pageView === 'all' || pageView === 'home') && (
          <>
            <HeroSection
              time={time}
              onHire={() => setHireOpen(true)}
              onAI={() => setAiOpen(true)}
              onSponsor={() => window.open(SPONSOR_URL, '_blank')}
              setSearch={setSearch}
              scrollTo={scrollTo}
              beep={beep}
            />
            <AchievementsSection />
            <TimelineSection />
            <TeachingSection beep={beep} />
            <SkillsSection />
          </>
        )}

        {(pageView === 'all' || pageView === 'lab') && (
          <>
            <GpuTelemetrySection />
            <CodeSandboxSection
              activeTab={codeTab}
              setActiveTab={setCodeTab}
              runOutput={codeOut}
              setRunOutput={setCodeOut}
              onOpenAlgoGame={() => setAlgoGameOpen(true)}
              beep={beep}
            />
            <BenchmarkSection />
          </>
        )}

        {(pageView === 'all' || pageView === 'projects') && (
          <>
            <ConstellationSection beep={beep} />
            <ContributionGraph />
            <ProjectsSection
              repos={repos}
              search={search}
              setSearch={setSearch}
              filter={filter}
              setFilter={setFilter}
              categories={CATEGORIES}
              hfAssets={hfAssets}
              hfFilter={hfFilter}
              setHfFilter={setHfFilter}
              counts={counts}
              articles={articles}
              subSearch={subSearch}
              setSubSearch={setSubSearch}
              beep={beep}
            />
          </>
        )}

        {(pageView === 'all' || pageView === 'photos') && (
          <PhotosSection beep={beep} />
        )}

        {(pageView === 'all' || pageView === 'papers') && (
          <>
            <PublicationsSection
              onCopyBib={setBibtexPub}
              onSelectPaper={setSelectedPaper}
              beep={beep}
            />
            <TalksSection beep={beep} />
            <SocialFeedSection beep={beep} />
            <SubstackSection
              articles={articles}
              subSearch={subSearch}
              setSubSearch={setSubSearch}
              onOpenArticleModal={() => setArticleModalOpen(true)}
              onSelectPaper={setSelectedPaper}
              beep={beep}
            />
          </>
        )}

        {(pageView === 'all' || pageView === 'contact') && (
          <>
            <NewsletterSection beep={beep} />
            <ContactSection onHire={() => setHireOpen(true)} beep={beep} />
          </>
        )}

        {data.readmeHtml && <ReadmeSection readmeHtml={data.readmeHtml} />}
      </main>

      <Footer gpuM={gpuM} />

      {/* ── Floating Controls ───────────────────────────────── */}
      <div className="theme-switcher">
        <div className="theme-switcher-panel">
          <button
            className={`ctrl-btn ${soundOn ? 'active' : ''}`}
            onClick={() => {
              setSoundOn(!soundOn);
              showToast(soundOn ? 'Sound Off 🔇' : 'UI Beeps On 🔊');
              beep(600);
            }}
            title="Toggle UI Sound Beeps"
          >
            <i className={`fas ${soundOn ? 'fa-volume-up' : 'fa-volume-mute'}`} />
          </button>

          <button
            className={`ctrl-btn ${weatherAudioOn ? 'active' : ''}`}
            onClick={handleToggleWeatherAudio}
            title="Toggle Ambient Weather Rain Soundscape"
          >
            <i
              className={`fas ${weatherAudioOn ? 'fa-cloud-showers-heavy' : 'fa-cloud-sun'}`}
              style={{ color: weatherAudioOn ? 'var(--cyan)' : '' }}
            />
          </button>

          <div className="ctrl-divider" />

          {[
            ['rain', 'fa-cloud-rain', 'Cyber Rain'],
            ['snow', 'fa-snowflake', 'Cyber Snow'],
            ['matrix', 'fa-terminal', 'Matrix Rain'],
            ['stars', 'fa-star', 'Constellation Stars'],
          ].map(([m, ic, title]) => (
            <button
              key={m}
              className={`ctrl-btn ${weatherMode === m ? 'active' : ''}`}
              onClick={() => { setWeatherMode(m); showToast(`Weather: ${title} ✨`); beep(700); }}
              title={title}
            >
              <i className={`fas ${ic}`} />
            </button>
          ))}

          <button
            className={`ctrl-btn ${gameOpen ? 'active' : ''}`}
            onClick={() => { setGameOpen(true); beep(880); }}
            title="Play Cyberpunk AI Arcade Game (Neural Defender)"
          >
            <i className="fas fa-gamepad" style={{ color: 'var(--accent)' }} />
          </button>

          <div className="ctrl-divider" />

          {['cyan', 'purple', 'emerald', 'rose'].map(c => (
            <div
              key={c}
              className={`accent-dot ${accent === c ? 'active' : ''}`}
              style={{ background: `var(--${c})` }}
              onClick={() => setAccentColor(c)}
              title={c}
            />
          ))}
        </div>
      </div>

      <button
        className="back-top-btn"
        onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); beep?.(); }}
        aria-label="Back to top"
      >
        <i className="fas fa-chevron-up" />
      </button>

      <button className="ai-fab" onClick={() => { setAiOpen(true); beep?.(); }}>
        <i className="fas fa-robot" /> <span>Ask AI</span>
      </button>

      {/* ── Modals & Toasts ─────────────────────────────────── */}
      <Toast msg={toast} />
      <AIChatModal open={aiOpen} onClose={() => setAiOpen(false)} beep={beep} speak={null} />
      <HireModal open={hireOpen} onClose={() => setHireOpen(false)} showToast={showToast} beep={beep} />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onCmd={handleCmd} />
      <TerminalModal open={cliOpen} onClose={() => setCliOpen(false)} beep={beep} />
      <ArticleCreatorModal
        open={articleModalOpen}
        onClose={() => setArticleModalOpen(false)}
        onAddArticle={handleAddArticle}
        beep={beep}
        showToast={showToast}
      />
      <NNPlaygroundModal open={nnOpen} onClose={() => setNnOpen(false)} beep={beep} showToast={showToast} />
      <PaperReaderModal
        paper={selectedPaper}
        onClose={() => setSelectedPaper(null)}
        onCopyBib={copyBib}
        beep={beep}
      />
      <CyberpunkGameModal open={gameOpen} onClose={() => setGameOpen(false)} showToast={showToast} beep={beep} />
      <KeyboardShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <AlgorithmGameModal open={algoGameOpen} onClose={() => setAlgoGameOpen(false)} showToast={showToast} beep={beep} />
      <TelegramBotModal open={telegramOpen} onClose={() => setTelegramOpen(false)} showToast={showToast} beep={beep} />
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} showToast={showToast} beep={beep} />
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onLogin={setUserProfile}
        showToast={showToast}
        beep={beep}
      />

      {/* BibTeX Modal */}
      <Modal open={!!bibtexPub} onClose={() => setBibtexPub(null)}>
        <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Cite Document</h3>
        <div className="bib-box">{bibtexPub}</div>
        <button
          className="btn-primary"
          style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
          onClick={() => copyBib(bibtexPub)}
        >
          <i className="fas fa-copy" /> Copy to Clipboard
        </button>
      </Modal>
    </>
  );
}
