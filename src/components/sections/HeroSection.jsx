// src/components/sections/HeroSection.jsx
import { useState, useEffect } from 'react';
import { TAGS, STATS } from '../../data/constants.js';

const FOCUS_PILLS = [
  { icon: 'fas fa-brain', label: 'Flow Matching & Continuous Normalizing Flows' },
  { icon: 'fas fa-microchip', label: 'First-Principles CUDA 12 & 4D Parallelism' },
  { icon: 'fas fa-chart-line', label: 'GRPO LLM Alignment & Math Reasoning' },
  { icon: 'fas fa-layer-group', label: 'SVD Rank-r Linear Attention (6× Less VRAM)' },
  { icon: 'fas fa-robot', label: '162 Open Hugging Face Models & Benchmarks' },
];

export default function HeroSection({ time, onHire, onAI, onSponsor, setSearch, scrollTo, beep }) {
  const [focusIdx, setFocusIdx] = useState(0);
  const [copiedCli, setCopiedCli] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFocusIdx(prev => (prev + 1) % FOCUS_PILLS.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCli = () => {
    navigator.clipboard.writeText('npx tahamajs');
    setCopiedCli(true);
    beep?.(880, 'triangle');
    setTimeout(() => setCopiedCli(false), 2400);
  };

  return (
    <>
      <section id="about" className="hero">
        <div className="hero-inner fade-up">
          {/* Avatar */}
          <div className="avatar-wrap">
            <div className="avatar-ring" /><div className="avatar-ring2" />
            <img
              src="1786635321419.png"
              onError={e => {
                if (!e.target.dataset.triedAssets) {
                  e.target.dataset.triedAssets = 'true';
                  e.target.src = 'assets/1786635321419.png';
                } else if (!e.target.dataset.triedAvatar) {
                  e.target.dataset.triedAvatar = 'true';
                  e.target.src = 'assets/avatar.jpg';
                } else {
                  e.target.src = 'https://github.com/tahamajs.png';
                }
              }}
              alt="Mohammad Taha Majlesi"
              className="avatar-img"
            />
          </div>

          <div className="hero-badge">
            <span className="dot" />
            Co-Founder &amp; AI Architect @ Hoosha AI 🧠 · University of Tehran
          </div>

          <div className="hero-clock">
            Tehran: <b>{time}</b> (UTC +3:30) &nbsp;·&nbsp;
            <span className="status-green">⬤ Open to Roles &amp; High-Impact AI Research</span>
          </div>

          <h1 className="hero-title">
            Mohammad Taha Majlesi
            <br />
            <span className="gradient-text">AI Systems Engineer &amp; Researcher</span>
          </h1>

          {/* Dynamic Interactive Research Focus Pill */}
          <div
            className="hero-focus-rotator"
            onClick={() => { setFocusIdx(p => (p + 1) % FOCUS_PILLS.length); beep?.(780); }}
            title="Click to cycle research domains"
          >
            <span className="focus-rotator-label">Active Research:</span>
            <span className="focus-rotator-val">
              <i className={FOCUS_PILLS[focusIdx].icon} /> {FOCUS_PILLS[focusIdx].label}
            </span>
          </div>

          <p className="hero-subtitle">
            Building scalable AI systems, distributed GPU infrastructure, and generative foundational models.
            Co-Founder of <b>Hoosha AI 🧠</b> · <b>17.1k+ LinkedIn community</b> ·
            CE student at <b>University of Tehran</b> · TA for Compiler Construction at <b>Sharif University</b>.
          </p>

          {/* Quick CLI snippet copy banner */}
          <div className="hero-cli-bar" onClick={handleCopyCli}>
            <span className="cli-bar-prompt">$</span>
            <span className="cli-bar-cmd">npx tahamajs</span>
            <button className="cli-bar-copy" aria-label="Copy CLI Command">
              <i className={`fas ${copiedCli ? 'fa-check' : 'fa-copy'}`} />
              <span>{copiedCli ? 'Copied to Clipboard!' : 'Run in Terminal'}</span>
            </button>
          </div>

          {/* Research tag cloud */}
          <div className="tag-cloud">
            {TAGS.map(tag => (
              <button
                key={tag}
                className="tag-pill"
                onClick={() => { setSearch(tag); scrollTo('projects'); beep?.(700); }}
              >
                <i className="fas fa-tag" style={{ fontSize: '.6rem' }} /> {tag}
              </button>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hero-actions">
            <a href="https://github.com/tahamajs" target="_blank" className="btn-github-follow" onClick={() => beep?.(700)}>
              <i className="fab fa-github" /> Follow @tahamajs <span className="follow-count">521</span>
            </a>
            <a href="https://github.com/sponsors/tahamajs" target="_blank" className="btn-sponsor" onClick={() => beep?.(880, 'triangle')}>
              <i className="fas fa-heart" /> Sponsor on GitHub
            </a>
            <button className="btn-primary" onClick={onHire}>
              <i className="fas fa-briefcase" /> Recruit / Hire Taha
            </button>
            <button className="btn-secondary" onClick={() => { scrollTo('photos'); beep?.(750); }}>
              <i className="fas fa-camera-retro" /> Moments &amp; Photos (7)
            </button>
            <a href="assets/resume.pdf" target="_blank" className="btn-secondary">
              <i className="fas fa-file-pdf" /> Resume PDF
            </a>
          </div>

          {/* Social links */}
          <div className="social-row">
            {[
              ['fab fa-github', 'https://github.com/tahamajs', 'GitHub'],
              ['fas fa-robot', 'https://huggingface.co/tahamajs', 'HuggingFace'],
              ['fab fa-linkedin-in', 'https://linkedin.com/in/tahamajlesi', 'LinkedIn 17.1k'],
              ['fab fa-instagram', 'https://instagram.com/hooshaaii', 'Instagram @hooshaaii'],
              ['fab fa-telegram', 'https://telegram.me/tahamajlesii', 'Telegram'],
              ['fas fa-newspaper', 'https://hooshaai.substack.com', 'Substack'],
              ['fas fa-heart', 'https://github.com/sponsors/tahamajs', 'Sponsor'],
              ['fas fa-envelope', 'mailto:tahamajlesi@ut.ac.ir', 'Email'],
            ].map(([ic, href, lbl]) => (
              <a
                key={lbl}
                href={href}
                target={href.startsWith('mailto') ? '_self' : '_blank'}
                className={`social-btn${lbl === 'Sponsor' ? ' social-sponsor' : ''}`}
                aria-label={lbl}
                title={lbl}
              >
                <i className={ic} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="stats-bar">
        {STATS.map(s => (
          <div key={s.label} className="stat-cell">
            <span className="stat-num">{s.num}</span>
            <span className="stat-lbl">{s.label}</span>
          </div>
        ))}
      </div>
    </>
  );
}
