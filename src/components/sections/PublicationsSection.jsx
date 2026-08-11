// src/components/sections/PublicationsSection.jsx
import { PUBLICATIONS } from '../../data/publications.js';
import SectionHead from '../ui/SectionHead.jsx';

export default function PublicationsSection({ onCopyBib, beep }) {
  return (
    <section id="publications" className="section fade-up">
      <SectionHead
        tag="Research Output"
        title="Papers &amp; Technical Reports"
        sub="Deep-dives on generative models, mathematical alignment, and GPU engineering published on Hoosha AI."
      />
      <div className="pub-list">
        {PUBLICATIONS.map((p, i) => (
          <div key={i} className="pub-card">
            <div className="pub-badge">{p.badge} · {p.year}</div>
            <h3 className="pub-title"><a href={p.link} target="_blank">{p.title}</a></h3>
            <div className="pub-meta"><i className="fas fa-users" /> {p.authors} &nbsp;&nbsp;|&nbsp;&nbsp; <i className="fas fa-university" /> {p.venue}</div>
            <p className="pub-abstract">{p.abstract}</p>
            <div className="pub-links">
              <a href={p.link} target="_blank" className="pub-btn" onClick={() => beep?.()}>
                <i className="fas fa-file-pdf" /> Read Paper
              </a>
              {p.code && (
                <a href={p.code} target="_blank" className="pub-btn" onClick={() => beep?.()}>
                  <i className="fab fa-github" /> View Code
                </a>
              )}
              <button className="pub-btn" onClick={() => { onCopyBib(p.bib); beep?.(); }}>
                <i className="fas fa-quote-right" /> Cite (BibTeX)
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
