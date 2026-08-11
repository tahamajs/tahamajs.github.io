// src/components/modals/HireModal.jsx
import Modal from '../ui/Modal.jsx';

const TEMPLATES = [
  { icon:'fa-building',       label:'Senior AI / Systems Engineer Role',   subj:'Senior%20AI%20Engineering%20Role' },
  { icon:'fa-graduation-cap', label:'Ph.D. & Academic Research Collaboration', subj:'PhD%20Research%20Collaboration' },
  { icon:'fa-lightbulb',      label:'Open-Source & R&D Partnership',        subj:'Open-Source%20Collaboration' },
  { icon:'fa-heart',          label:'Sponsor Taha\'s Open-Source Work',     subj:'GitHub%20Sponsor%20Inquiry', href:'https://github.com/sponsors/tahamajs' },
];

export default function HireModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="section-tag">💼 Direct Recruitment</div>
      <h2 style={{ color:'#fff', marginBottom:'.5rem' }}>Recruit / Collaborate with Taha 🚀</h2>
      <p style={{ color:'var(--muted)', fontSize:'.88rem', marginBottom:'1.5rem' }}>
        Taha is open to <b style={{color:'var(--text)'}}>Senior AI / ML Engineer</b>,{' '}
        <b style={{color:'var(--text)'}}>Research Scientist</b>, and{' '}
        <b style={{color:'var(--text)'}}>Ph.D.</b> opportunities, plus AI advisory, open-source collaboration, and GitHub Sponsorship.
      </p>

      <div className="hire-tmpl">
        {TEMPLATES.map((t, i) => (
          <a key={i} className="hire-tmpl-item"
            href={t.href || `mailto:tahamajlesi@ut.ac.ir?subject=${t.subj}`}
            target={t.href ? '_blank' : '_self'}>
            <i className={`fas ${t.icon}`} />
            <b>{t.label}</b>
            <i className="fas fa-arrow-right" style={{ marginLeft:'auto', opacity:.4, fontSize:'.75rem' }} />
          </a>
        ))}
      </div>

      <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap', marginTop:'1.5rem' }}>
        <a href="mailto:tahamajlesi@ut.ac.ir" className="btn-primary">
          <i className="fas fa-envelope" /> Email Taha
        </a>
        <a href="https://github.com/sponsors/tahamajs" target="_blank" className="btn-secondary" style={{ borderColor:'#ea4aaa', color:'#ea4aaa' }}>
          <i className="fas fa-heart" /> Sponsor on GitHub
        </a>
        <a href="https://telegram.me/tahamajlesii" target="_blank" className="btn-secondary">
          <i className="fab fa-telegram" /> Telegram
        </a>
        <a href="https://linkedin.com/in/tahamajlesi" target="_blank" className="btn-secondary">
          <i className="fab fa-linkedin" /> LinkedIn
        </a>
      </div>
    </Modal>
  );
}
