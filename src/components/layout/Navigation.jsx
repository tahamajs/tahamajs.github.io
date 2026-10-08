// src/components/layout/Navigation.jsx
import { useEffect } from 'react';

const MAIN_LINKS = [
  { id: 'about',        label: 'About' },
  { id: 'sandbox',      label: 'AI Lab' },
  { id: 'projects',     label: 'Projects' },
  { id: 'photos',       label: 'Photos' },
  { id: 'publications', label: 'Papers' },
  { id: 'substack',     label: 'Substack' },
  { id: 'contact',      label: 'Contact' },
];

const DRAWER_LINKS = [
  { id: 'telemetry',     label: 'Telemetry' },
  { id: 'constellation', label: 'Research Graph' },
  { id: 'social-feed',   label: 'X Feed' },
  { id: 'experience',    label: 'Milestones' },
];

export default function Navigation({
  mobileNav,
  setMobileNav,
  onHire,
  onCmd,
  onNavigate,
}) {
  useEffect(() => {
    const close = () => setMobileNav(false);
    window.addEventListener('scroll', close, { passive: true });
    return () => window.removeEventListener('scroll', close);
  }, [setMobileNav]);

  const go = (id) => (e) => {
    e.preventDefault();
    setMobileNav(false);
    if (typeof onNavigate === 'function') {
      onNavigate(id);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="glass-nav">
      <div className="nav-container">
        <a href="#about" className="logo" onClick={go('about')}>
          Taha Majlesi <span className="logo-badge">Hoosha AI</span>
        </a>

        <div className={`nav-links ${mobileNav ? 'open' : ''}`}>
          {MAIN_LINKS.map(l => (
            <a key={l.id} href={`#${l.id}`} onClick={go(l.id)}>{l.label}</a>
          ))}

          <div className="nav-drawer-extra">
            {DRAWER_LINKS.map(l => (
              <a key={l.id} href={`#${l.id}`} onClick={go(l.id)}>{l.label}</a>
            ))}
          </div>

          <button className="nav-hire-btn" onClick={() => { setMobileNav(false); onHire(); }}>
            <i className="fas fa-briefcase" /> Recruit / Hire Taha
          </button>

          <a href="https://github.com/sponsors/tahamajs" target="_blank" rel="noreferrer" className="nav-sponsor-btn">
            <i className="fas fa-heart" /> Sponsor
          </a>
        </div>

        <div className="nav-tools">
          <button className="cmd-k-btn" onClick={onCmd} title="Search (⌘K)">
            <i className="fas fa-search" /> <span className="cmd-k-key">⌘K</span>
          </button>
          <button className="mobile-nav-toggle" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle Menu">
            <i className={`fas ${mobileNav ? 'fa-times' : 'fa-bars'}`} />
          </button>
        </div>
      </div>
    </nav>
  );
}
