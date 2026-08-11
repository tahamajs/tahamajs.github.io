// src/components/sections/NewsletterSection.jsx
import SectionHead from '../ui/SectionHead.jsx';

export default function NewsletterSection({ beep }) {
  return (
    <section className="section fade-up">
      <div className="newsletter-card">
        <div className="newsletter-content">
          <SectionHead
            tag="Join 17,100+ Readers"
            title="Get Deep-Dive AI Engineering Essays"
            sub="Subscribe to Hoosha AI's Substack. I write detailed breakdowns on scaling LLMs, custom CUDA kernels, and mathematics behind Flow Matching and GRPO."
          />
          <form className="newsletter-form" action="https://hooshaai.substack.com" target="_blank" onSubmit={() => beep?.(800)}>
            <input type="email" placeholder="Enter your email address..." required className="newsletter-input" />
            <button type="submit" className="btn-primary newsletter-btn">
              Subscribe <i className="fas fa-paper-plane" style={{ marginLeft: '4px' }} />
            </button>
          </form>
          <div className="newsletter-meta">
            <span><i className="fas fa-check-circle" /> No spam</span>
            <span><i className="fas fa-check-circle" /> Highly technical</span>
            <span><i className="fas fa-check-circle" /> Once a week</span>
          </div>
        </div>
        <div className="newsletter-glow" />
      </div>
    </section>
  );
}
