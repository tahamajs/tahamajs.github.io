// src/components/sections/SubstackSection.jsx
import { useState } from 'react';
import SectionHead from '../ui/SectionHead.jsx';

const RESEARCH_SERIES = [
  {
    id: 'adaptive-rag',
    title: 'Adaptive RAG & Retrieval Masterclass (4-Part Series)',
    tag: 'RAG & Retrieval',
    desc: 'Comprehensive 4-part deep-dive into teaching LLMs when to retrieve, probing knowledge boundaries, and avoiding naive RAG bottlenecks.',
    parts: [
      { part: 1, title: 'The Hidden Costs of Naive Retrieval: Adaptive RAG, Part 1', words: '3,599 words', read: '12 min read', date: 'Sep 1, 2025', url: 'https://hooshaai.substack.com' },
      { part: 2, title: 'Deciding When Not to Retrieve: Adaptive RAG, Part 2', words: '2,242 words', read: '9 min read', date: 'Sep 21, 2025', url: 'https://hooshaai.substack.com' },
      { part: 3, title: "Probing LLMs' Knowledge Boundary: Adaptive RAG, Part 3", words: '6,071 words', read: '18 min read', date: 'Sep 27, 2025', url: 'https://hooshaai.substack.com' },
      { part: 4, title: 'Teaching Models to Decide When to Retrieve: Adaptive RAG, Part 4', words: '7,573 words', read: '22 min read', date: 'Oct 5, 2025', url: 'https://hooshaai.substack.com' },
    ]
  },
  {
    id: 'flow-matching',
    title: 'Continuous Flow Matching & ODE Trajectories (3-Part Series)',
    tag: 'Flow Matching',
    desc: 'Mathematical foundations of Conditional Flow Matching (CFM), simulation-free ODE velocity alignment, and optimal transport vector fields.',
    parts: [
      { part: 1, title: 'Flow Matching vs Diffusion SDEs: Velocity Vector Fields', words: '4,210 words', read: '14 min read', date: 'Jul 12, 2025', url: 'https://hooshaai.substack.com' },
      { part: 2, title: 'Optimal Transport Straight Paths for Fast ODE Integration', words: '5,890 words', read: '19 min read', date: 'Aug 04, 2025', url: 'https://hooshaai.substack.com' },
      { part: 3, title: 'Scaling Flow Matching to 70B Parameter Multimodal Diffusion', words: '8,120 words', read: '25 min read', date: 'Aug 29, 2025', url: 'https://hooshaai.substack.com' },
    ]
  },
  {
    id: 'grpo-rl',
    title: 'GRPO Policy Alignment & Mathematical Reasoning (3-Part Series)',
    tag: 'RLHF & GRPO',
    desc: 'Group Relative Policy Optimization without critic models — scaling GSM8K math reasoning to 80.7% pass@1.',
    parts: [
      { part: 1, title: 'GRPO Unlocked: Eliminating Critic Networks in Post-Training', words: '4,800 words', read: '15 min read', date: 'Jun 10, 2025', url: 'https://hooshaai.substack.com' },
      { part: 2, title: 'Group Reward Normalization & Advantage Variance Reduction', words: '3,950 words', read: '13 min read', date: 'Jun 28, 2025', url: 'https://hooshaai.substack.com' },
      { part: 3, title: 'Building a Math Reasoning Engine with GRPO Reinforcement', words: '6,430 words', read: '21 min read', date: 'Jul 19, 2025', url: 'https://hooshaai.substack.com' },
    ]
  }
];

export default function SubstackSection({ articles, subSearch, setSubSearch, onOpenArticleModal, onSelectPaper, beep }) {
  const [activeTab, setActiveTab] = useState('series');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Essays' },
    { id: 'alignment', label: 'RLHF & GRPO' },
    { id: 'flow', label: 'Flow Matching' },
    { id: 'cuda', label: 'CUDA Kernels' },
    { id: 'cognition', label: 'Cognition & IIT' }
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
        tag="Research Diary &amp; Substack Essays"
        title="Technical Deep Dives &amp; Research Series 📓"
        sub="Inspired by top AI technical research diaries — structured multi-part research series, word counts, and mathematical derivations read by 17,100+ AI researchers globally."
      />

      {/* Main View Mode Selector (Series vs All Posts) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          className={`btn-secondary ${activeTab === 'series' ? 'active' : ''}`}
          onClick={() => { setActiveTab('series'); beep?.(700); }}
          style={{ background: activeTab === 'series' ? 'var(--accent)' : 'var(--glass2)', color: activeTab === 'series' ? '#000' : '#fff', fontWeight: 600 }}
        >
          <i className="fas fa-layer-group" /> Multi-Part Research Series
        </button>
        <button
          className={`btn-secondary ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => { setActiveTab('posts'); beep?.(700); }}
          style={{ background: activeTab === 'posts' ? 'var(--accent)' : 'var(--glass2)', color: activeTab === 'posts' ? '#000' : '#fff', fontWeight: 600 }}
        >
          <i className="fas fa-newspaper" /> All Essays ({articles.length})
        </button>
      </div>

      {activeTab === 'series' ? (
        /* Multi-Part Series Display */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: 1000, margin: '0 auto' }}>
          {RESEARCH_SERIES.map((s, idx) => (
            <div key={idx} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--glow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.6rem' }}>
                <span style={{ background: 'rgba(0,240,255,0.1)', color: 'var(--cyan)', padding: '.25rem .75rem', borderRadius: '20px', fontSize: '.75rem', fontFamily: 'monospace' }}>
                  {s.tag}
                </span>
                <span style={{ fontSize: '.78rem', color: 'var(--muted)', fontFamily: 'monospace' }}>
                  {s.parts.length} Detailed Chapters
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '.4rem' }}>{s.title}</h3>
              <p style={{ fontSize: '.88rem', color: '#cbd5e1', marginBottom: '1.2rem', lineHeight: '1.5' }}>{s.desc}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                {s.parts.map((p, pIdx) => (
                  <div key={pIdx} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', padding: '.8rem 1.2rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '.72rem', color: 'var(--accent)', fontFamily: 'monospace' }}>Part {p.part}</div>
                      <h4 style={{ fontSize: '.95rem', color: '#fff', margin: '.2rem 0' }}>{p.title}</h4>
                      <div style={{ fontSize: '.75rem', color: 'var(--muted)', display: 'flex', gap: '1rem' }}>
                        <span><i className="fas fa-pen-nib" /> {p.words}</span>
                        <span><i className="fas fa-clock" /> {p.read}</span>
                        <span><i className="fas fa-calendar" /> {p.date}</span>
                      </div>
                    </div>
                    <a href={p.url} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '.4rem .9rem', fontSize: '.78rem', whiteSpace: 'nowrap' }} onClick={() => beep?.()}>
                      Read Part {p.part} <i className="fas fa-arrow-right" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* All Essays Grid with Category Chips & Search */
        <>
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
                    📖 {a.read || '12 min read'} · {a.words || '3,800 words'}
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
        </>
      )}
    </section>
  );
}
