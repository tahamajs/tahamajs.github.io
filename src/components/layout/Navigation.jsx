// src/components/layout/Navigation.jsx
import { useEffect } from 'react';

export default function Navigation({ mobileNav, setMobileNav, onHire, onCmd }) {
  useEffect(() => {
    const fn = () => setMobileNav(false);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, [setMobileNav]);

  return (
    <nav className="glass-nav">
      <div className="nav-container">
        {/* Brand Logo */}
        <a href="#about" className="logo" onClick={() => setMobileNav(false)}>
          Taha Majlesi <span className="logo-badge">Hoosha AI</span>
        </a>

        {/* Navigation Links */}
        <div className={`nav-links ${mobileNav ? 'open' : ''}`}>
          <a href="#about" onClick={() => setMobileNav(false)}>About</a>
          <a href="#sandbox" onClick={() => setMobileNav(false)}>AI Lab</a>
          <a href="#projects" onClick={() => setMobileNav(false)}>Projects</a>
          <a href="#photos" onClick={() => setMobileNav(false)}>Photos</a>
          <a href="#publications" onClick={() => setMobileNav(false)}>Papers</a>
          <a href="#substack" onClick={() => setMobileNav(false)}>Substack</a>
          <a href="#contact" onClick={() => setMobileNav(false)}>Contact</a>

          {/* Drawer / Mobile Only Extended Links */}
          <div className="nav-drawer-extra">
            <a href="#telemetry" onClick={() => setMobileNav(false)}>Telemetry</a>
            <a href="#constellation" onClick={() => setMobileNav(false)}>Research Graph</a>
            <a href="#social-feed" onClick={() => setMobileNav(false)}>X Feed</a>
            <a href="#experience" onClick={() => setMobileNav(false)}>Milestones</a>
          </div>

          <button className="nav-hire-btn" onClick={() => { setMobileNav(false); onHire(); }}>
            <i className="fas fa-briefcase" /> Recruit / Hire Taha
          </button>

          <a href="https://github.com/sponsors/tahamajs" target="_blank" rel="noreferrer" className="nav-sponsor-btn">
            <i className="fas fa-heart" /> Sponsor
          </a>
        </div>

        {/* Header Tools */}
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
