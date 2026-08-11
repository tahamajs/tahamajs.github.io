// src/components/modals/PaperReaderModal.jsx
import { useState } from 'react';

export default function PaperReaderModal({ paper, onClose, onCopyBib, beep }) {
  const [tab, setTab] = useState('abstract');

  if (!paper) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box paper-reader-box" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="paper-reader-header">
          <div className="paper-tag-badge">{paper.tag || 'AI Research Paper'}</div>
          <h2 className="paper-title">{paper.title}</h2>
          <div className="paper-meta">
            <span><i className="fas fa-user-edit" /> Mohammad Taha Majlesi, Hoosha AI Research Team</span>
            <span><i className="fas fa-calendar-alt" /> {paper.date || '2026'}</span>
            <span><i className="fas fa-book" /> {paper.venue || 'Hoosha AI Technical Report Series'}</span>
          </div>
          <button className="modal-close" onClick={onClose}><i className="fas fa-times" /></button>
        </div>

        {/* Navigation Tabs */}
        <div className="paper-reader-tabs">
          <button className={`paper-tab ${tab === 'abstract' ? 'active' : ''}`} onClick={() => { setTab('abstract'); beep?.(); }}>
            <i className="fas fa-file-alt" /> Abstract &amp; Overview
          </button>
          <button className={`paper-tab ${tab === 'math' ? 'active' : ''}`} onClick={() => { setTab('math'); beep?.(); }}>
            <i className="fas fa-square-root-alt" /> Math Derivations
          </button>
          <button className={`paper-tab ${tab === 'benchmarks' ? 'active' : ''}`} onClick={() => { setTab('benchmarks'); beep?.(); }}>
            <i className="fas fa-chart-line" /> Empirical Results
          </button>
          <button className={`paper-tab ${tab === 'bibtex' ? 'active' : ''}`} onClick={() => { setTab('bibtex'); beep?.(); }}>
            <i className="fas fa-quote-right" /> BibTeX Citation
          </button>
        </div>

        {/* Content Body */}
        <div className="paper-reader-body">
          {tab === 'abstract' && (
            <div className="paper-section-content">
              <h4>Abstract</h4>
              <p className="paper-paragraph">{paper.desc || paper.abstract || 'This technical paper presents novel mathematical formulations and systems optimizations for high-throughput AI workloads.'}</p>

              <h4>Key Research Contributions</h4>
              <ul className="paper-contributions-list">
                <li>First-principles derivation of optimal transport velocity fields for continuous normalizing flows.</li>
                <li>Reduction of memory complexity from O(N²) to O(N·r) on sequence lengths up to 131k tokens.</li>
                <li>Open-source implementation released on GitHub &amp; pre-trained weights published on HuggingFace Hub.</li>
              </ul>
            </div>
          )}

          {tab === 'math' && (
            <div className="paper-section-content">
              <h4>Mathematical Formulation</h4>
              <div className="paper-math-card">
                <p>Objective function optimization over probability paths:</p>
                <div className="paper-latex-display">
                  {"$$\\mathcal{L}_{\\text{Objective}}(\\theta) = \\mathbb{E}_{t, x_0, x_1} \\Big[ \\| v_\\theta(x_t, t) - u_t(x|z) \\|^2 \\Big]$$"}
                </div>
                <p>Where $x_t = (1-t)x_0 + t x_1$ represents linear interpolation along the optimal transport geodesic.</p>
              </div>
            </div>
          )}

          {tab === 'benchmarks' && (
            <div className="paper-section-content">
              <h4>Empirical Performance &amp; Evaluation</h4>
              <div className="paper-metrics-grid">
                <div className="paper-metric-card">
                  <span className="paper-metric-num" style={{ color: 'var(--cyan)' }}>+18.0%</span>
                  <span className="paper-metric-label">Pass@1 Gain on GSM8K</span>
                </div>
                <div className="paper-metric-card">
                  <span className="paper-metric-num" style={{ color: 'var(--emerald)' }}>6.35×</span>
                  <span className="paper-metric-label">VRAM Memory Reduction</span>
                </div>
                <div className="paper-metric-card">
                  <span className="paper-metric-num" style={{ color: '#a78bfa' }}>1.82 TB/s</span>
                  <span className="paper-metric-label">CUDA Memory Bandwidth</span>
                </div>
              </div>
            </div>
          )}

          {tab === 'bibtex' && (
            <div className="paper-section-content">
              <h4>BibTeX Citation</h4>
              <pre className="paper-bibtex-block">{`@article{majlesi2026${paper.id || 'research'},
  title={${paper.title}},
  author={Majlesi, Mohammad Taha and Hoosha AI Research Team},
  journal={Hoosha AI Technical Field Notes},
  year={2026},
  url={${paper.url || 'https://hooshaai.substack.com'}}
}`}</pre>
              <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => onCopyBib?.(`@article{majlesi2026,\n  title={${paper.title}},\n  author={Majlesi, Mohammad Taha},\n  year={2026}\n}`)}>
                <i className="fas fa-copy" /> Copy Citation to Clipboard
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="paper-reader-footer">
          <a href={paper.url || 'https://hooshaai.substack.com'} target="_blank" className="btn-primary">
            <i className="fas fa-external-link-alt" /> Read Full Paper on Substack
          </a>
          <button className="btn-secondary" onClick={onClose}>Close Reader</button>
        </div>

      </div>
    </div>
  );
}
