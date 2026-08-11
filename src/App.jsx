// src/App.jsx
import { useState, useEffect, useMemo } from 'react';
import { useToast, useTehranClock, useGpuMetrics, useBeep, useNeuralCanvas } from './hooks/index.js';

import Navigation from './components/layout/Navigation.jsx';
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

import AIChatModal from './components/modals/AIChatModal.jsx';
import HireModal from './components/modals/HireModal.jsx';
import CommandPalette from './components/modals/CommandPalette.jsx';
import Modal from './components/ui/Modal.jsx';
import Toast from './components/ui/Toast.jsx';

export default function App() {
  // Global States
  const [data, setData] = useState({ repos: [], articles: [], hf: [], readmeHtml: '' });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [hfFilter, setHfFilter] = useState('all');
  const [subSearch, setSubSearch] = useState('');
  
  // UI States
  const [accent, setAccent] = useState('cyan');
  const [mobileNav, setMobileNav] = useState(false);
  const [codeTab, setCodeTab] = useState('flow');
  const [codeOut, setCodeOut] = useState('');
  const [soundOn, setSoundOn] = useState(false);
  
  // Modal States
  const [aiOpen, setAiOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [hireOpen, setHireOpen] = useState(false);
  const [bibtexPub, setBibtexPub] = useState(null);

  // Custom Hooks
  const [toast, showToast] = useToast();
  const time = useTehranClock();
  const gpuM = useGpuMetrics();
  const beep = useBeep(soundOn);
  useNeuralCanvas(); // Background effects

  // Data Fetching
  useEffect(() => {
    fetch('data.json').then(r => r.json()).then(d => setData(d)).catch(() => {});
  }, []);

  // Keyboard Shortcuts (⌘K)
  useEffect(() => {
    const fn = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(p => !p); }
      if (e.key === 'Escape') { setCmdOpen(false); setAiOpen(false); setHireOpen(false); setBibtexPub(null); setMobileNav(false); }
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

  const counts = useMemo(() => {
    const r = data.repos || [];
    return {
      all: r.length,
      course: r.filter(x => x.cat === 'course').length,
      ai: r.filter(x => x.cat === 'ai').length,
      systems: r.filter(x => x.cat === 'systems').length,
      web: r.filter(x => x.cat === 'web').length
    };
  }, [data.repos]);

  // Actions
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView();
  const setAccentColor = c => { setAccent(c); document.body.setAttribute('data-accent', c); beep(800); showToast(`Theme: ${c} ✨`); };
  const copyBib = bib => { navigator.clipboard.writeText(bib); beep(700, 'square'); showToast('📄 BibTeX copied!'); setBibtexPub(null); };

  const handleCmd = id => {
    setCmdOpen(false);
    const map = {
      ai: () => setAiOpen(true),
      hire: () => setHireOpen(true),
      sponsor: () => window.open('https://github.com/sponsors/tahamajs', '_blank'),
      linkedin: () => window.open('https://linkedin.com/in/tahamajlesi', '_blank'),
      hf: () => window.open('https://huggingface.co/tahamajs', '_blank'),
      substack: () => window.open('https://hooshaai.substack.com', '_blank'),
      email: () => window.location.href = 'mailto:tahamajlesi@ut.ac.ir',
      resume: () => window.open('assets/resume.pdf', '_blank'),
    };
    (map[id] || (() => {}))();
  };

  return (
    <>
      <Navigation mobileNav={mobileNav} setMobileNav={setMobileNav} onHire={() => setHireOpen(true)} onCmd={() => setCmdOpen(true)} />
      
      <main>
        <HeroSection time={time} onHire={() => setHireOpen(true)} onAI={() => setAiOpen(true)} onSponsor={() => {}} setSearch={setSearch} scrollTo={scrollTo} beep={beep} />
        <AchievementsSection />
        <CodeSandboxSection activeTab={codeTab} setActiveTab={setCodeTab} runOutput={codeOut} setRunOutput={setCodeOut} beep={beep} />
        <ConstellationSection beep={beep} />
        <ContributionGraph />
        <TimelineSection />
        <SkillsSection />
        <ProjectsSection repos={repos} search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} hfAssets={hfAssets} hfFilter={hfFilter} setHfFilter={setHfFilter} counts={counts} articles={articles} subSearch={subSearch} setSubSearch={setSubSearch} beep={beep} />
        <PublicationsSection onCopyBib={setBibtexPub} beep={beep} />
        <SocialFeedSection beep={beep} />
        <SubstackSection articles={articles} subSearch={subSearch} setSubSearch={setSubSearch} beep={beep} />
        <NewsletterSection beep={beep} />
        <ContactSection onHire={() => setHireOpen(true)} beep={beep} />
        {data.readmeHtml && <ReadmeSection readmeHtml={data.readmeHtml} />}
      </main>

      <Footer gpuM={gpuM} />

      {/* Floating Controls */}
      <div className="theme-switcher">
        <div className="theme-switcher-panel">
          <button className={`ctrl-btn ${soundOn ? 'active' : ''}`} onClick={() => { setSoundOn(!soundOn); showToast(soundOn ? 'Sound Off 🔇' : 'Sound On 🔊'); beep(600); }} aria-label="Toggle Sound">
            <i className={`fas ${soundOn ? 'fa-volume-up' : 'fa-volume-mute'}`} />
          </button>
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
      <HireModal open={hireOpen} onClose={() => setHireOpen(false)} />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onCmd={handleCmd} />

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
