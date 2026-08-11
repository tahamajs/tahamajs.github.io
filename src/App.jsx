// src/App.jsx
import { useState, useEffect, useMemo } from 'react';
import { useToast, useTehranClock, useGpuMetrics, useBeep, useNeuralCanvas } from './hooks/index.js';

import Navigation from './components/layout/Navigation.jsx';
import PageRouterBar from './components/layout/PageRouterBar.jsx';
import Footer from './components/layout/Footer.jsx';

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
import Modal from './components/ui/Modal.jsx';
import Toast from './components/ui/Toast.jsx';

import { toggleWeatherAudio, stopWeatherAudio } from './utils/weatherAudio.js';

export default function App() {
  // Global States
  const [data, setData] = useState({ repos: [], articles: [], hf: [], readmeHtml: '' });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [hfFilter, setHfFilter] = useState('all');
  const [subSearch, setSubSearch] = useState('');
  
  // UI & Weather States
  const [pageView, setPageView] = useState('all'); // 'all', 'home', 'lab', 'projects', 'papers', 'contact'
  const [weatherMode, setWeatherMode] = useState('rain'); // 'rain', 'snow', 'matrix', 'stars'
  const [weatherAudioOn, setWeatherAudioOn] = useState(false);
  const [accent, setAccent] = useState('cyan');
  const [mobileNav, setMobileNav] = useState(false);
  const [codeTab, setCodeTab] = useState('flow');
  const [codeOut, setCodeOut] = useState('');
  const [soundOn, setSoundOn] = useState(false);
  
  // Modal States
  const [aiOpen, setAiOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [hireOpen, setHireOpen] = useState(false);
  const [cliOpen, setCliOpen] = useState(false);
  const [nnOpen, setNnOpen] = useState(false);
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [bibtexPub, setBibtexPub] = useState(null);

  // Custom Hooks
  const [toast, showToast] = useToast();
  const time = useTehranClock();
  const gpuM = useGpuMetrics();
  const beep = useBeep(soundOn);
  useNeuralCanvas(weatherMode); // Atmospheric Weather Background

  const handleToggleWeatherAudio = () => {
    const active = toggleWeatherAudio(weatherMode, 0.15);
    setWeatherAudioOn(active);
    showToast(active ? `🌧️ ${weatherMode.toUpperCase()} Ambient Sound ON` : '🔇 Weather Audio OFF');
    beep(700);
  };

  // Data Fetching
  useEffect(() => {
    fetch('data.json').then(r => r.json()).then(d => setData(d)).catch(() => {});
  }, []);

  // Keyboard Shortcuts (⌘K, ⌘J)
  useEffect(() => {
    const fn = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(p => !p); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') { e.preventDefault(); setCliOpen(p => !p); }
      if (e.key === 'Escape') { setCmdOpen(false); setAiOpen(false); setHireOpen(false); setCliOpen(false); setBibtexPub(null); setMobileNav(false); }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  // Derived Data (Filtering)
  const repos = useMemo(() => (data.repos || []).filter(r => {
    const ok = filter === 'all' || r.cat === filter;
    const q = search.trim().toLowerCase();
    return ok && (!q || (r.name + r.desc + r.lang + r.tag).toLowerCase().includes(q));
  }), [data.repos, filter, search]);

  const articles = useMemo(() => {
    const q = subSearch.trim().toLowerCase();
    return (data.articles || []).filter(a => !q || (a.title + a.desc).toLowerCase().includes(q));
  }, [data.articles, subSearch]);

  const hfAssets = useMemo(() => (data.hf || []).filter(h => hfFilter === 'all' || h.type === hfFilter), [data.hf, hfFilter]);

  // Actions
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView();
  const setAccentColor = c => { setAccent(c); document.body.setAttribute('data-accent', c); beep(800); showToast(`Theme: ${c} ✨`); };
  const copyBib = bib => { navigator.clipboard.writeText(bib); beep(700, 'square'); showToast('📄 BibTeX copied!'); setBibtexPub(null); };

  const handleCmd = id => {
    setCmdOpen(false);
    const map = {
      cli: () => setCliOpen(true),
      nn: () => setNnOpen(true),
      ai: () => setAiOpen(true),
      hire: () => setHireOpen(true),
      sponsor: () => window.open('https://github.com/sponsors/tahamajs', '_blank'),
      linkedin: () => window.open('https://linkedin.com/in/tahamajlesi', '_blank'),
      instagram: () => window.open('https://instagram.com/hooshaaii', '_blank'),
      hf: () => window.open('https://huggingface.co/tahamajs', '_blank'),
      substack: () => window.open('https://hooshaai.substack.com', '_blank'),
      email: () => window.location.href = 'mailto:tahamajlesi@ut.ac.ir',
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
  };

  const handleAddArticle = (newArticle) => {
    setData(prev => ({
      ...prev,
      articles: [newArticle, ...(prev.articles || [])]
    }));
  };

  const counts = useMemo(() => ({
    all: repos.length,
    course: repos.filter(r => r.category === 'course').length,
    ml: repos.filter(r => r.category === 'ml').length,
    systems: repos.filter(r => r.category === 'systems').length,
    hfModels: hfAssets.filter(a => a.type === 'model').length,
    hfDatasets: hfAssets.filter(a => a.type === 'dataset').length,
  }), [repos, hfAssets]);

  return (
    <>
      <Navigation mobileNav={mobileNav} setMobileNav={setMobileNav} onHire={() => setHireOpen(true)} onCmd={() => setCmdOpen(true)} />
      <PageRouterBar pageView={pageView} setPageView={setPageView} beep={beep} />
      
      <main style={{ paddingTop: '80px' }}>
        {(pageView === 'all' || pageView === 'home') && (
          <>
            <HeroSection time={time} onHire={() => setHireOpen(true)} onAI={() => setAiOpen(true)} onSponsor={() => {}} setSearch={setSearch} scrollTo={scrollTo} beep={beep} />
            <AchievementsSection />
            <TimelineSection />
            <TeachingSection beep={beep} />
            <SkillsSection />
          </>
        )}

        {(pageView === 'all' || pageView === 'lab') && (
          <>
            <GpuTelemetrySection />
            <CodeSandboxSection activeTab={codeTab} setActiveTab={setCodeTab} runOutput={codeOut} setRunOutput={setCodeOut} beep={beep} />
            <BenchmarkSection />
          </>
        )}

        {(pageView === 'all' || pageView === 'projects') && (
          <>
            <ConstellationSection beep={beep} />
            <ContributionGraph />
            <ProjectsSection repos={repos} search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} hfAssets={hfAssets} hfFilter={hfFilter} setHfFilter={setHfFilter} counts={counts} articles={articles} subSearch={subSearch} setSubSearch={setSubSearch} beep={beep} />
          </>
        )}

        {(pageView === 'all' || pageView === 'papers') && (
          <>
            <PublicationsSection onCopyBib={setBibtexPub} onSelectPaper={setSelectedPaper} beep={beep} />
            <TalksSection beep={beep} />
            <SocialFeedSection beep={beep} />
            <SubstackSection articles={articles} subSearch={subSearch} setSubSearch={setSubSearch} onOpenArticleModal={() => setArticleModalOpen(true)} beep={beep} />
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

      {/* Floating Controls */}
      <div className="theme-switcher">
        <div className="theme-switcher-panel">
          <button className={`ctrl-btn ${soundOn ? 'active' : ''}`} onClick={() => { setSoundOn(!soundOn); showToast(soundOn ? 'Sound Off 🔇' : 'UI Beeps On 🔊'); beep(600); }} title="Toggle UI Sound Beeps">
            <i className={`fas ${soundOn ? 'fa-volume-up' : 'fa-volume-mute'}`} />
          </button>
          <button className={`ctrl-btn ${weatherAudioOn ? 'active' : ''}`} onClick={handleToggleWeatherAudio} title="Toggle Ambient Weather Rain Soundscape">
            <i className={`fas ${weatherAudioOn ? 'fa-cloud-showers-heavy' : 'fa-cloud-sun'}`} style={{ color: weatherAudioOn ? 'var(--cyan)' : '' }} />
          </button>
          <div className="ctrl-divider" />
          {[
            ['rain', 'fa-cloud-rain', 'Cyber Rain'],
            ['snow', 'fa-snowflake', 'Cyber Snow'],
            ['matrix', 'fa-terminal', 'Matrix Rain'],
            ['stars', 'fa-star', 'Constellation Stars']
          ].map(([m, ic, title]) => (
            <button key={m} className={`ctrl-btn ${weatherMode === m ? 'active' : ''}`} onClick={() => { setWeatherMode(m); showToast(`Weather: ${title} ✨`); beep(700); }} title={title}>
              <i className={`fas ${ic}`} />
            </button>
          ))}
          <div className="ctrl-divider" />
          {['cyan', 'purple', 'emerald', 'rose'].map(c => (
            <div key={c} className={`accent-dot ${accent === c ? 'active' : ''}`} style={{ background: `var(--${c})` }} onClick={() => setAccentColor(c)} title={c} />
          ))}
        </div>
      </div>

      <button className="back-top-btn" onClick={() => { window.scrollTo(0,0); beep?.(); }} aria-label="Back to top">
        <i className="fas fa-chevron-up" />
      </button>

      <button className="ai-fab" onClick={() => { setAiOpen(true); beep?.(); }}>
        <i className="fas fa-robot" /> <span>Ask AI</span>
      </button>

      {/* Modals & Toasts */}
      <Toast msg={toast} />
      <AIChatModal open={aiOpen} onClose={() => setAiOpen(false)} beep={beep} speak={null} />
      <HireModal open={hireOpen} onClose={() => setHireOpen(false)} showToast={showToast} beep={beep} />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onCmd={handleCmd} />
      <TerminalModal open={cliOpen} onClose={() => setCliOpen(false)} beep={beep} />
      <ArticleCreatorModal open={articleModalOpen} onClose={() => setArticleModalOpen(false)} onAddArticle={handleAddArticle} beep={beep} showToast={showToast} />
      <NNPlaygroundModal open={nnOpen} onClose={() => setNnOpen(false)} beep={beep} showToast={showToast} />
      <PaperReaderModal paper={selectedPaper} onClose={() => setSelectedPaper(null)} onCopyBib={copyBib} beep={beep} />

      {/* BibTeX Modal */}
      <Modal open={!!bibtexPub} onClose={() => setBibtexPub(null)}>
        <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Cite Document</h3>
        <div className="bib-box">{bibtexPub}</div>
        <button className="btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }} onClick={() => copyBib(bibtexPub)}>
          <i className="fas fa-copy" /> Copy to Clipboard
        </button>
      </Modal>
    </>
  );
}
