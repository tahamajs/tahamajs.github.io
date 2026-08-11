// src/components/sections/SkillsSection.jsx
import { useState, useEffect, useRef } from 'react';
import { SKILLS } from '../../data/constants.js';
import SectionHead from '../ui/SectionHead.jsx';

const PROFICIENCY = {
  'Python': 97, 'C++ 20': 88, 'CUDA/C': 85, 'Kotlin': 70, 'Java': 75,
  'JavaScript': 82, 'Verilog': 65, 'Bash': 80,
  'PyTorch 2.x': 95, 'JAX/Flax': 78, 'HuggingFace': 95, 'DeepSpeed': 82,
  'PEFT / QLoRA': 90, 'TRL / GRPO': 92,
  'CUDA 12.2': 85, 'cuBLAS': 78, 'NCCL': 80, 'MPI': 72, 'Triton': 68, 'Nsight Compute': 75,
  'Docker': 85, 'GitHub Actions': 90, 'FastAPI': 88, 'Django REST': 78, 'PostgreSQL': 75, 'Redis': 72,
  'Flow Matching': 95, 'Diffusion SDEs': 88, 'RLHF/GRPO': 92, 'Linear Attention': 85, 'VAE Unlearning': 78, 'IIT Φ': 80,
  'xv6 OS Kernel': 85, 'Pipelined ARM CPU': 78, 'Compilers (Flex/Bison)': 82, 'TCP/UDP Sockets': 88, 'Verilog RTL': 65,
};

function AnimatedBar({ pct, running, color }) {
  const [w, setW] = useState(0);
  useEffect(() => { if (running) setTimeout(() => setW(pct), 100); }, [running, pct]);
  return (
    <div className="skill-bar-bg">
      <div className="skill-bar-fill" style={{ width: `${w}%`, background: color, transition: 'width 0.8s cubic-bezier(.4,0,.2,1)' }} />
    </div>
  );
}

const CAT_COLORS = ['#00f0ff', '#8a2be2', '#10b981', '#f59e0b', '#f43f5e', '#60a5fa'];

export default function SkillsSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const skill = SKILLS[activeTab];

  return (
    <section id="skills" className="section fade-up" ref={ref}>
      <SectionHead tag="Capabilities" title="Technical Arsenal" />

      <div className="skills-tabs">
        {SKILLS.map((s, i) => (
          <button key={i}
            className={`skills-tab-btn ${activeTab === i ? 'active' : ''}`}
            style={activeTab === i ? { borderColor: CAT_COLORS[i], color: CAT_COLORS[i] } : {}}
            onClick={() => setActiveTab(i)}>
            {s.cat}
          </button>
        ))}
      </div>

      <div className="skills-bars-panel">
        {skill.items.map((item, i) => (
          <div key={item} className="skill-bar-row" style={{ animationDelay: `${i * 0.05}s` }}>
            <span className="skill-bar-label">{item}</span>
            <AnimatedBar pct={PROFICIENCY[item] || 80} running={visible} color={CAT_COLORS[activeTab]} />
            <span className="skill-bar-pct" style={{ color: CAT_COLORS[activeTab] }}>{PROFICIENCY[item] || 80}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}
