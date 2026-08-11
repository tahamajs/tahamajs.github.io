// src/components/sections/ContactSection.jsx
import { useState } from 'react';
import SectionHead from '../ui/SectionHead.jsx';

const CONTACTS = [
  { icon: 'fab fa-github',        href: 'https://github.com/tahamajs',          label: 'GitHub',          val: '@tahamajs',         color: '#fff' },
  { icon: 'fab fa-linkedin-in',   href: 'https://linkedin.com/in/tahamajlesi',  label: 'LinkedIn',        val: '17.1k Followers',   color: '#0a66c2' },
  { icon: 'fab fa-instagram',     href: 'https://instagram.com/hooshaaii',      label: 'Instagram',       val: '@hooshaaii',        color: '#e1306c' },
  { icon: 'fas fa-robot',         href: 'https://huggingface.co/tahamajs',      label: 'HuggingFace',     val: '162 Assets',        color: '#ffd21e' },
  { icon: 'fas fa-newspaper',     href: 'https://hooshaai.substack.com',        label: 'Substack',        val: 'Hoosha AI 🧠',       color: '#ff6719' },
  { icon: 'fab fa-telegram',      href: 'https://t.me/tahamajlesii',             label: 'Telegram',        val: '@tahamajlesii',     color: '#229ed9' },
  { icon: 'fas fa-envelope',      href: 'mailto:tahamajlesi@ut.ac.ir',          label: 'Email',           val: 'UT.ac.ir',          color: '#10b981' },
  { icon: 'fas fa-heart',         href: 'https://github.com/sponsors/tahamajs', label: 'Sponsor',         val: 'Fund the mission',   color: '#ea4aaa' },
];

export default function ContactSection({ onHire, beep }) {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText('tahamajlesi@ut.ac.ir');
    setCopied(true);
    beep?.(700, 'square');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="section fade-up">
      <SectionHead
        tag="Get In Touch"
        title="Open To Collaboration &amp; Opportunities"
        sub="Whether you're a recruiter, researcher, or open-source contributor — I respond to every serious inquiry within 24 hours."
      />

      <div className="contact-grid">
        {/* Left: CTA Cards */}
        <div className="contact-ctas">
          <div className="contact-cta-card primary-cta" onClick={() => { onHire(); beep?.(); }}>
            <i className="fas fa-briefcase" />
            <div>
              <h4>Recruit / Hire Taha</h4>
              <p>Full-time, part-time, contract, or research collaboration</p>
            </div>
            <i className="fas fa-arrow-right" style={{ marginLeft: 'auto', opacity: .4 }} />
          </div>

          <a href="https://github.com/sponsors/tahamajs" target="_blank" className="contact-cta-card sponsor-cta" onClick={() => beep?.()}>
            <i className="fas fa-heart" />
            <div>
              <h4>Sponsor on GitHub</h4>
              <p>Fund open-source CUDA engines, Persian LLMs &amp; AI research</p>
            </div>
            <i className="fas fa-arrow-right" style={{ marginLeft: 'auto', opacity: .4 }} />
          </a>

          <div className="contact-email-row">
            <div className="contact-email-display">
              <i className="fas fa-envelope" style={{ color: 'var(--accent)' }} />
              <span>tahamajlesi@ut.ac.ir</span>
            </div>
            <button className="btn-secondary contact-copy" onClick={copyEmail}>
              <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} /> {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Right: Social Links */}
        <div className="contact-socials">
          {CONTACTS.map(c => (
            <a key={c.label} href={c.href} target={c.href.startsWith('mailto') ? '_self' : '_blank'}
              className="contact-social-row" onClick={() => beep?.()}>
              <div className="contact-social-icon" style={{ background: `${c.color}18`, color: c.color, border: `1px solid ${c.color}30` }}>
                <i className={c.icon} />
              </div>
              <div>
                <div className="contact-social-label">{c.label}</div>
                <div className="contact-social-val">{c.val}</div>
              </div>
              <i className="fas fa-external-link-alt" style={{ marginLeft: 'auto', opacity: .25, fontSize: '.7rem' }} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
