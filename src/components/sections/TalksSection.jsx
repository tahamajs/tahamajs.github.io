// src/components/sections/TalksSection.jsx
import SectionHead from '../ui/SectionHead.jsx';

const TALKS = [
  {
    title: 'Flow Matching vs Diffusion: The Frontier of Continuous Normalizing Flows',
    event: 'Hoosha AI Annual Keynote 2026',
    location: 'Tehran, Iran / Virtual',
    date: 'Jan 2026',
    desc: 'Deep dive into straight optimal transport probability paths, simulation-free ODE velocity regression, and 5-step sampling.',
    slides: 'https://hooshaai.substack.com',
    video: 'https://youtube.com'
  },
  {
    title: 'Group Relative Policy Optimization (GRPO) for Reasoning LLMs',
    event: 'Sharif AI & Robotics Colloquium',
    location: 'Sharif University of Technology',
    date: 'Nov 2025',
    desc: 'Eliminating the Critic network in PPO. Mathematical formulation of group-normalized advantages and KL regularization.',
    slides: 'https://hooshaai.substack.com',
    video: null
  },
  {
    title: 'Writing Custom CUDA Kernels for High-Throughput LLM Inference',
    event: 'University of Tehran Systems Seminar',
    location: 'University of Tehran',
    date: 'Sep 2025',
    desc: 'Warp-level register shuffles, shared memory bank conflict elimination, and FP16/BF16 memory alignment.',
    slides: 'https://github.com/tahamajs/cuda-learning-lab',
    video: null
  }
];

export default function TalksSection({ beep }) {
  return (
    <section id="talks" className="section fade-up">
      <SectionHead
        tag="Academic Outreach"
        title="Invited Keynotes &amp; Seminars 🎤"
        sub="Technical presentations, guest lectures, and keynote addresses on generative AI and GPU computing."
      />
      <div className="talks-grid">
        {TALKS.map((t, i) => (
          <div key={i} className="talk-card">
            <div className="talk-date-badge"><i className="fas fa-calendar-alt" /> {t.date}</div>
            <h3 className="talk-title">{t.title}</h3>
            <div className="talk-event"><i className="fas fa-microphone" /> {t.event} · {t.location}</div>
            <p className="talk-desc">{t.desc}</p>
            <div className="talk-links">
              <a href={t.slides} target="_blank" className="pub-btn" onClick={() => beep?.()}>
                <i className="fas fa-file-powerpoint" /> View Slides
              </a>
              {t.video && (
                <a href={t.video} target="_blank" className="pub-btn" onClick={() => beep?.()}>
                  <i className="fas fa-video" /> Watch Recording
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
