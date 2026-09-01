// src/components/layout/PageRouterBar.jsx

const PAGES = [
  { id: 'all',      label: '🌐 View All (Full Dashboard)', icon: 'fas fa-globe' },
  { id: 'home',     label: '👤 Overview & Bio',            icon: 'fas fa-user-circle' },
  { id: 'lab',      label: '🧪 Interactive AI Lab',        icon: 'fas fa-flask' },
  { id: 'projects', label: '🚀 Projects & HF Models',      icon: 'fas fa-cubes' },
  { id: 'photos',   label: '📸 Moments & Photos',          icon: 'fas fa-camera-retro' },
  { id: 'papers',   label: '📄 Papers & Substack',          icon: 'fas fa-file-alt' },
  { id: 'contact',  label: '📬 Contact & Recruit',         icon: 'fas fa-paper-plane' },
];

export default function PageRouterBar({ pageView, setPageView, beep }) {
  return (
    <div className="page-router-bar">
      <div className="page-router-inner">
        <span className="page-router-label"><i className="fas fa-layer-group" style={{ color: 'var(--accent)' }} /> Multi-Page Mode:</span>
        <div className="page-router-tabs">
          {PAGES.map(p => (
            <button
              key={p.id}
              className={`page-router-tab ${pageView === p.id ? 'active' : ''}`}
              onClick={() => { setPageView(p.id); beep?.(700); window.scrollTo(0, 0); }}>
              <i className={p.icon} /> {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
