// src/components/sections/SkillsSection.jsx
import { SKILLS } from '../../data/constants.js';
import SectionHead from '../ui/SectionHead.jsx';

export default function SkillsSection() {
  return (
    <section id="skills" className="section fade-up">
      <SectionHead
        tag="Capabilities"
        title="Technical Arsenal"
      />
      <div className="skills-grid">
        {SKILLS.map((s, i) => (
          <div key={i} className="skill-card">
            <div className="skill-cat">{s.cat}</div>
            <div className="skill-tags">
              {s.items.map(t => <span key={t} className="skill-tag">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
