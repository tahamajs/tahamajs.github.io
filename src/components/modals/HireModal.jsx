// src/components/modals/HireModal.jsx
import { useState } from 'react';
import Modal from '../ui/Modal.jsx';

const TEMPLATES = [
  { icon:'fa-building',       label:'Senior AI / Systems Engineer Role',   subj:'Senior AI Engineering Role' },
  { icon:'fa-graduation-cap', label:'Ph.D. & Academic Research Collaboration', subj:'PhD Research Collaboration' },
  { icon:'fa-lightbulb',      label:'AI Advisory & Consulting',             subj:'AI Advisory Inquiry' },
  { icon:'fa-heart',          label:'Sponsor Open-Source AI Work',          subj:'GitHub Sponsor Inquiry', href:'https://github.com/sponsors/tahamajs' },
];

export default function HireModal({ open, onClose, showToast, beep }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('tahamajlesi@ut.ac.ir');
    setCopied(true);
    beep?.(700, 'square');
    showToast?.('📋 Email (tahamajlesi@ut.ac.ir) copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDirectSend = (e) => {
    e.preventDefault();
    const mailtoUrl = `mailto:tahamajlesi@ut.ac.ir?subject=${encodeURIComponent(`Inquiry from ${name || 'Collaborator'}`)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${msg}`)}`;
    window.location.href = mailtoUrl;
    beep?.(880, 'sine');
    showToast?.('🚀 Launching email client...');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="section-tag">💼 Direct Contact &amp; Recruitment</div>
      <h2 style={{ color:'#fff', marginBottom:'.5rem' }}>Contact / Hire Taha Majlesi 🚀</h2>
      <p style={{ color:'var(--muted)', fontSize:'.88rem', marginBottom:'1.2rem' }}>
        Taha is open to <b style={{color:'var(--accent)'}}>Senior AI Engineer</b>,{' '}
        <b style={{color:'var(--cyan)'}}>Research Scientist</b>, and{' '}
        <b style={{color:'var(--emerald)'}}>Ph.D.</b> opportunities, plus AI consulting, teaching, and open-source partnerships.
      </p>

      {/* 1-Click Template Row */}
      <div className="hire-tmpl">
        {TEMPLATES.map((t, i) => (
          <a key={i} className="hire-tmpl-item"
            href={t.href || `mailto:tahamajlesi@ut.ac.ir?subject=${encodeURIComponent(t.subj)}`}
            target={t.href ? '_blank' : '_self'} onClick={() => beep?.()}>
            <i className={`fas ${t.icon}`} />
            <b>{t.label}</b>
            <i className="fas fa-arrow-right" style={{ marginLeft:'auto', opacity:.4, fontSize:'.75rem' }} />
          </a>
        ))}
      </div>

      {/* Direct Message Form */}
      <form onSubmit={handleDirectSend} style={{ marginTop:'1.2rem', display:'flex', flexDirection:'column', gap:'.8rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.8rem' }}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="form-input"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <textarea
          placeholder="Your message or collaboration proposal..."
          value={msg}
          onChange={e => setMsg(e.target.value)}
          className="form-input"
          rows={3}
          required
        />
        <button type="submit" className="btn-primary" style={{ width:'100%', justifyContent:'center' }}>
          <i className="fas fa-paper-plane" /> Send Direct Email to Taha
        </button>
      </form>

      {/* Quick Social Buttons */}
      <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap', marginTop:'1.2rem', paddingTop:'1rem', borderTop:'1px solid var(--border)' }}>
        <button onClick={handleCopyEmail} className="btn-secondary">
          <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} style={{ color: copied ? 'var(--emerald)' : '' }} /> {copied ? 'Email Copied!' : 'Copy Email'}
        </button>
        <a href="https://telegram.me/tahamajlesii" target="_blank" className="btn-secondary" onClick={() => beep?.()}>
          <i className="fab fa-telegram" /> Telegram @tahamajlesii
        </a>
        <a href="https://instagram.com/hooshaaii" target="_blank" className="btn-secondary" onClick={() => beep?.()}>
          <i className="fab fa-instagram" /> Instagram @hooshaaii
        </a>
        <a href="https://linkedin.com/in/tahamajlesi" target="_blank" className="btn-secondary" onClick={() => beep?.()}>
          <i className="fab fa-linkedin" /> LinkedIn 17.1k
        </a>
      </div>
    </Modal>
  );
}
