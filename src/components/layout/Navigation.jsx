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
        <div className="logo">Taha <span style={{ color: 'var(--accent)' }}>/</span> Hoosha AI</div>
        
        <div className={`nav-links ${mobileNav ? 'open' : ''}`}>
          <a href="#about" onClick={() => setMobileNav(false)}>About</a>
          <a href="#sandbox" onClick={() => setMobileNav(false)}>AI Lab</a>
          <a href="#projects" onClick={() => setMobileNav(false)}>Systems &amp; Models</a>
          <a href="#publications" onClick={() => setMobileNav(false)}>Publications</a>
          <a href="#substack" onClick={() => setMobileNav(false)}>Essays</a>
          <a href="#experience" onClick={() => setMobileNav(false)}>Timeline</a>
          
          <button className="nav-hire-btn" onClick={() => { setMobileNav(false); onHire(); }}>
            <i className="fas fa-briefcase" /> Recruit / Hire Taha
          </button>
          
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
