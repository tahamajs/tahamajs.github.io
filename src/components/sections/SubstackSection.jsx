// src/components/sections/SubstackSection.jsx
import { useState } from 'react';
import SectionHead from '../ui/SectionHead.jsx';

export default function SubstackSection({ articles, subSearch, setSubSearch, onOpenArticleModal, onSelectPaper, beep }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Essays & Deep Dives' },
    { id: 'alignment', label: 'RLHF & GRPO Alignment' },
    { id: 'flow', label: 'Flow Matching & Diffusion' },
    { id: 'cuda', label: 'CUDA & High-Perf GPU' },
    { id: 'cognition', label: 'Cognitive Architecture' }
  ];

  const filteredArticles = articles.filter(a => {
    if (activeCategory === 'all') return true;
    const txt = (a.title + a.desc + (a.tags || []).join(' ')).toLowerCase();
    if (activeCategory === 'alignment') return txt.includes('grpo') || txt.includes('alignment') || txt.includes('rlhf');
    if (activeCategory === 'flow') return txt.includes('flow') || txt.includes('matching') || txt.includes('ode');
    if (activeCategory === 'cuda') return txt.includes('cuda') || txt.includes('gpu') || txt.includes('warp');
    if (activeCategory === 'cognition') return txt.includes('iit') || txt.includes('phi') || txt.includes('cognition');
    return true;
  });

  return (
    <section id="substack" className="section fade-up" style={{ background: 'rgba(0,240,255,0.01)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <SectionHead
        tag="Hoosha AI Substack &amp; Research Journal"
        title="Technical Deep Dives &amp; Essays"
        sub="In-depth explorations of generative models, LLM alignment math, CUDA kernels, and synthetic cognitive architectures — read by 17,000+ researchers globally."
      />

      {/* Category Filter Chips */}
      <div className="filter-chips" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
        {categories.map(c => (
          <button
            key={c.id}
            className={`chip ${activeCategory === c.id ? 'active' : ''}`}
            onClick={() => { setActiveCategory(c.id); beep?.(700); }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Search & Add New Article Bar */}
      <div style={{ display: 'flex', gap: '1rem', maxWidth: 800, margin: '0 auto 2.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="search-wrap" style={{ flex: 1, margin: 0 }}>
          <i className="fas fa-search search-icon" />
          <input
            type="text"
            placeholder={`Search ${articles.length} Substack papers & technical deep dives...`}
            value={subSearch}
            onChange={e => setSubSearch(e.target.value)}
          />
        </div>
        <button className="btn-primary" onClick={onOpenArticleModal} style={{ whiteSpace: 'nowrap', padding: '.75rem 1.4rem' }}>
          <i className="fas fa-plus" /> Add New Essay
        </button>
      </div>

      {/* Articles Grid */}
      <div className="articles-grid">
        {filteredArticles.map((a, i) => (
          <div key={i} className="article-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
              <span className="article-date">{a.date}</span>
              <span className="article-read-time" style={{ fontSize: '.75rem', color: 'var(--cyan)', fontFamily: 'monospace' }}>
                📖 8 min read
              </span>
            </div>
            
            <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '.5rem', lineHeight: '1.4' }}>{a.title}</h3>
            <p style={{ fontSize: '.88rem', color: '#cbd5e1', lineHeight: '1.6', flex: 1 }}>{a.desc}</p>
            
            <div className="article-actions" style={{ display: 'flex', gap: '.6rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <a href={a.url} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '.4rem .8rem', fontSize: '.78rem' }} onClick={() => beep?.()}>
                Read Article <i className="fas fa-external-link-alt" />
              </a>
              <button
                className="btn-primary"
                style={{ padding: '.4rem .8rem', fontSize: '.78rem' }}
                onClick={() => { onSelectPaper?.(a); beep?.(880); }}>
                🔬 Math Reader &amp; BibTeX
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
