// src/components/sections/HeroSection.jsx
import { TAGS, STATS } from '../../data/constants.js';

export default function HeroSection({ time, onHire, onAI, onSponsor, setSearch, scrollTo, beep }) {
  return (
    <>
      <section id="about" className="hero">
        <div className="hero-inner fade-up">
          {/* Avatar */}
          <div className="avatar-wrap">
            <div className="avatar-ring" /><div className="avatar-ring2" />
            <img src="1786635321419.png" onError={e=>{if(!e.target.dataset.triedAssets){e.target.dataset.triedAssets='true';e.target.src='assets/1786635321419.png';}else if(!e.target.dataset.triedAvatar){e.target.dataset.triedAvatar='true';e.target.src='assets/avatar.jpg';}else{e.target.src='https://github.com/tahamajs.png';}}}
              alt="Mohammad Taha Majlesi" className="avatar-img" />
          </div>

          <div className="hero-badge">
            <span className="dot" />
            Co-Founder &amp; AI Architect @ Hoosha AI 🧠 · University of Tehran
          </div>

          <div className="hero-clock">
            Tehran: <b>{time}</b> (UTC +3:30) &nbsp;·&nbsp;
            <span className="status-green">⬤ Open to Roles &amp; Collaboration</span>
          </div>

          <h1 className="hero-title">
            Mohammad Taha Majlesi
            <br />
            <span className="gradient-text">AI Systems Engineer &amp; Researcher</span>
          </h1>

          <p className="hero-subtitle">
            Building scalable AI systems and distributed GPU infrastructure.
            Co-Founder of <b>Hoosha AI 🧠</b> · <b>17.1k+ LinkedIn community</b> ·
            CE student at <b>University of Tehran</b> · TA for Compiler Construction at <b>Sharif University</b>.
          </p>

          {/* Research tag cloud */}
          <div className="tag-cloud">
            {TAGS.map(tag => (
              <button key={tag} className="tag-pill"
                onClick={() => { setSearch(tag); scrollTo('projects'); beep?.(700); }}>
                <i className="fas fa-tag" style={{fontSize:'.6rem'}} /> {tag}
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
            <a href="assets/resume.pdf" target="_blank" className="btn-secondary">
              <i className="fas fa-file-pdf" /> Resume PDF
            </a>
          </div>

          {/* Social links */}
          <div className="social-row">
            {[
              ['fab fa-github','https://github.com/tahamajs','GitHub'],
              ['fas fa-robot','https://huggingface.co/tahamajs','HuggingFace'],
              ['fab fa-linkedin-in','https://linkedin.com/in/tahamajlesi','LinkedIn 17.1k'],
              ['fab fa-instagram','https://instagram.com/hooshaaii','Instagram @hooshaaii'],
              ['fab fa-telegram','https://telegram.me/tahamajlesii','Telegram'],
              ['fas fa-newspaper','https://hooshaai.substack.com','Substack'],
              ['fas fa-heart','https://github.com/sponsors/tahamajs','Sponsor'],
              ['fas fa-envelope','mailto:tahamajlesi@ut.ac.ir','Email'],
            ].map(([ic,href,lbl]) => (
              <a key={lbl} href={href}
                target={href.startsWith('mailto')?'_self':'_blank'}
                className={`social-btn${lbl==='Sponsor'?' social-sponsor':''}`}
                aria-label={lbl} title={lbl}>
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
