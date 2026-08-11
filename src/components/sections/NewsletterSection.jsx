// src/components/sections/NewsletterSection.jsx
import { useState } from 'react';
import SectionHead from '../ui/SectionHead.jsx';

export default function NewsletterSection({ beep, showToast }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    beep?.(880, 'sine');
    setSubscribed(true);
    showToast?.(`📧 Subscribed ${email} to Hoosha AI Substack! Check your inbox.`);
  };

  return (
    <section id="newsletter" className="section fade-up" style={{ background: 'rgba(0,240,255,0.01)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <SectionHead
        tag="Join 17,100+ Readers"
        title="Get Deep-Dive AI Engineering Essays 🧠"
        sub="Subscribe to Hoosha AI's Substack. I write detailed mathematical breakdowns on scaling LLMs, custom CUDA kernels, Flow Matching ODEs, and GRPO reinforcement learning."
      />

      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        {!subscribed ? (
          <form onSubmit={handleSubmit} className="newsletter-form" style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              type="email"
              required
              placeholder="Enter your email address (e.g. researcher@mit.edu)..."
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-input"
              style={{ flex: 1, minWidth: 280 }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '.75rem 1.6rem', whiteSpace: 'nowrap' }}>
              <i className="fas fa-paper-plane" /> Subscribe Now
            </button>
          </form>
        ) : (
          <div className="telegram-success-box" style={{ margin: '0 auto' }}>
            <i className="fas fa-envelope-open-text" style={{ fontSize: '2rem', color: 'var(--emerald)', marginBottom: '.4rem' }} />
            <h3>Welcome to Hoosha AI Journal!</h3>
            <p style={{ fontSize: '.85rem', color: 'var(--muted)', marginTop: '.3rem' }}>
              Subscription confirmed for <b>{email}</b>. You will receive weekly deep-dives directly in your inbox.
            </p>
          </div>
        )}

        <div className="newsletter-badges" style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '.8rem', color: 'var(--muted)', fontFamily: 'monospace' }}><i className="fas fa-shield-alt" style={{ color: 'var(--emerald)' }} /> No spam</span>
          <span style={{ fontSize: '.8rem', color: 'var(--muted)', fontFamily: 'monospace' }}><i className="fas fa-code" style={{ color: 'var(--accent)' }} /> Highly technical</span>
          <span style={{ fontSize: '.8rem', color: 'var(--muted)', fontFamily: 'monospace' }}><i className="fas fa-calendar-alt" style={{ color: 'var(--cyan)' }} /> Once a week</span>
        </div>
      </div>
    </section>
  );
}
