// src/components/sections/AchievementsSection.jsx
import { useState, useEffect, useRef } from 'react';
import { ACHIEVEMENTS } from '../../data/constants.js';
import SectionHead from '../ui/SectionHead.jsx';

function CountUp({ target, running }) {
  const [val, setVal] = useState(0);
  const isNum = !isNaN(parseInt(target));
  const numeric = parseInt(target);
  const suffix = isNum ? target.replace(numeric, '') : '';

  useEffect(() => {
    if (!running || !isNum) return;
    let start = 0;
    const step = Math.ceil(numeric / 60);
    const id = setInterval(() => {
      start += step;
      if (start >= numeric) { setVal(numeric); clearInterval(id); }
      else setVal(start);
    }, 16);
    return () => clearInterval(id);
  }, [running, numeric, isNum]);

  if (!isNum) return <span>{target}</span>;
  return <span>{val.toLocaleString()}{suffix}</span>;
}

export default function AchievementsSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section fade-up" ref={ref}>
      <SectionHead
        tag="Impact"
        title="By The Numbers"
        sub="Open-source velocity, research output, and community impact — measured."
      />
      <div className="achv-grid">
        {ACHIEVEMENTS.map((a, i) => (
          <div key={i} className="achv-card">
            <div className="achv-icon-wrap">
              <i className={`fas ${a.icon}`} />
            </div>
            <div className="achv-val">
              <CountUp target={a.val} running={visible} />
            </div>
            <div className="achv-title">{a.title}</div>
            <p className="achv-desc">{a.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
