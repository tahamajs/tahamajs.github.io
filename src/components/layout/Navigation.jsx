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
        <div className="logo">
          Taha Majlesi <span className="logo-badge">Hoosha AI</span>
        </div>
        
        <div className={`nav-links ${mobileNav ? 'open' : ''}`}>
          <a href="#about" onClick={() => setMobileNav(false)}>About</a>
          <a href="#telemetry" onClick={() => setMobileNav(false)}>Telemetry</a>
          <a href="#sandbox" onClick={() => setMobileNav(false)}>AI Lab</a>
          <a href="#constellation" onClick={() => setMobileNav(false)}>Graph</a>
          <a href="#projects" onClick={() => setMobileNav(false)}>Projects</a>
          <a href="#photos" onClick={() => setMobileNav(false)}>Photos</a>
          <a href="#publications" onClick={() => setMobileNav(false)}>Papers</a>
          <a href="#social-feed" onClick={() => setMobileNav(false)}>X Feed</a>
          <a href="#substack" onClick={() => setMobileNav(false)}>Substack</a>
          <a href="#experience" onClick={() => setMobileNav(false)}>Timeline</a>
          <a href="#contact" onClick={() => setMobileNav(false)}>Contact</a>
          
          <button className="nav-hire-btn" onClick={() => { setMobileNav(false); onHire(); }}>
            <i className="fas fa-briefcase" /> Recruit / Hire Taha
          </button>
          
          <a href="https://github.com/tahamajs" target="_blank" className="nav-hire-btn" style={{ background: '#24292e', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
            <i className="fab fa-github" /> Follow
          </a>
          
          <a href="https://github.com/sponsors/tahamajs" target="_blank" className="nav-hire-btn" style={{ background: '#ea4aaa', color: '#fff' }}>
            <i className="fas fa-heart" /> Sponsor
          </a>
        </div>

        <button className="cmd-k-btn" onClick={onCmd}>
          <i className="fas fa-search" /> <span className="cmd-k-key">⌘K</span>
        </button>
        
        <button className="mobile-nav-toggle" onClick={() => setMobileNav(!mobileNav)}>
          <i className={`fas ${mobileNav ? 'fa-times' : 'fa-bars'}`} />
        </button>
      </div>
    </nav>
  );
}
