// src/components/sections/ProjectsSection.jsx
import { useMemo } from 'react';
import SectionHead from '../ui/SectionHead.jsx';

export default function ProjectsSection({ repos, search, setSearch, filter, setFilter, hfAssets, hfFilter, setHfFilter, counts, articles, subSearch, setSubSearch, beep }) {
  return (
    <section id="projects" className="section fade-up">
      <SectionHead
        tag="Engineering Hub"
        title="Open-Source Infrastructure &amp; AI Models"
        sub="A curated selection of 143 total repositories and 162 HuggingFace assets (1000+ downloads), spanning CUDA systems, Flow Matching, and Persian LLMs."
      />

      {/* GitHub Projects */}
      <div className="search-wrap" style={{ marginTop: '2.5rem' }}>
        <i className="fas fa-search search-icon" />
        <input
          type="text"
          placeholder="Search repositories (e.g., 'Kaleido', 'CUDA', 'Flow Matching')..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-tabs">
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => { setFilter('all'); beep?.(600); }}>All Projects ({counts.all})</button>
        <button className={`filter-btn ${filter === 'course' ? 'active' : ''}`} onClick={() => { setFilter('course'); beep?.(600); }}>University AI Labs ({counts.course})</button>
        <button className={`filter-btn ${filter === 'ai' ? 'active' : ''}`} onClick={() => { setFilter('ai'); beep?.(600); }}>ML &amp; Generative AI ({counts.ai || counts.ml || 42})</button>
        <button className={`filter-btn ${filter === 'systems' ? 'active' : ''}`} onClick={() => { setFilter('systems'); beep?.(600); }}>Systems &amp; CUDA ({counts.systems})</button>
      </div>

      <div className="bento">
        {repos.map((r, i) => (
          <a key={i} href={r.url} target="_blank" className={`bento-card ${r.star ? 'bento-wide' : ''}`}>
            {r.star && <div style={{ position: 'absolute', top: '.8rem', right: '.8rem', color: 'var(--emerald)' }}><i className="fas fa-star" /> Featured</div>}
            <div className="bento-tag">
              <i className={r.cat === 'ai' ? 'fas fa-brain' : r.cat === 'systems' ? 'fas fa-microchip' : 'fas fa-book'} />
              {r.tag}
            </div>
            <h3 className="bento-title">{r.name}</h3>
            <p className="bento-desc">{r.desc}</p>
            <div className="bento-footer">
              <span className="bento-pill" style={{ color: '#00f0ff', borderColor: '#00f0ff' }}>{r.lang}</span>
              {r.lib?.split(',').map(l => <span key={l} className="bento-pill">{l.trim()}</span>)}
            </div>
          </a>
        ))}
        {repos.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
            <i className="fas fa-search" style={{ fontSize: '2rem', marginBottom: '1rem', opacity: .5 }} /><br />
            No repositories found matching "{search}"
          </div>
        )}
      </div>

      {/* HuggingFace Assets */}
      <h3 style={{ marginTop: '5rem', marginBottom: '1.5rem', color: '#fff', fontSize: '1.5rem' }}>
        <i className="fas fa-robot" style={{ color: 'var(--accent)' }} /> Hugging Face Assets (162 total)
      </h3>
      <div className="filter-tabs">
        <button className={`filter-btn ${hfFilter === 'all' ? 'active' : ''}`} onClick={() => { setHfFilter('all'); beep?.(); }}>All Assets (162)</button>
        <button className={`filter-btn ${hfFilter === 'model' || hfFilter === 'Model' ? 'active' : ''}`} onClick={() => { setHfFilter('model'); beep?.(); }}>Models (92)</button>
        <button className={`filter-btn ${hfFilter === 'dataset' || hfFilter === 'Dataset' ? 'active' : ''}`} onClick={() => { setHfFilter('dataset'); beep?.(); }}>Datasets (70)</button>
      </div>
      <div className="hf-grid">
        {hfAssets.map((h, i) => (
          <a key={i} href={h.url} target="_blank" className="hf-card">
            <div className="hf-type" style={{
              color: h.type === 'Model' ? '#60a5fa' : '#a78bfa',
              background: h.type === 'Model' ? 'rgba(96,165,250,0.08)' : 'rgba(167,139,250,0.08)',
              borderColor: h.type === 'Model' ? 'rgba(96,165,250,0.15)' : 'rgba(167,139,250,0.15)'
            }}>
              <i className={h.type === 'Model' ? 'fas fa-cube' : 'fas fa-database'} />
              {h.type}
            </div>
            <div className="hf-id">{h.id}</div>
            <div className="hf-meta">
              <span><i className="fas fa-download" /> {h.dls}</span>
              <span><i className="fas fa-heart" /> {h.likes}</span>
              <span><i className="fas fa-clock" /> {h.upd}</span>
            </div>
            {h.code && <div className="hf-code">{h.code}</div>}
          </a>
        ))}
      </div>
    </section>
  );
}
