// src/components/sections/TimelineSection.jsx
import { TIMELINE } from '../../data/constants.js';
import SectionHead from '../ui/SectionHead.jsx';

export default function TimelineSection() {
  return (
    <section id="experience" className="section fade-up">
      <SectionHead
        tag="Trajectory"
        title="Experience &amp; Milestones"
      />
      <div className="timeline">
        {TIMELINE.map((t, i) => (
          <div key={i} className="tl-item">
            <div className="tl-empty" />
            <div className="tl-dot" style={{ borderColor: t.color, color: t.color }}>
              <i className={`fas ${t.icon}`} />
            </div>
            <div className="tl-content">
              <div className="tl-year">{t.year}</div>
              <h4>{t.title}</h4>
              <p>{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
