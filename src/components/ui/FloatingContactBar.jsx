// src/components/ui/FloatingContactBar.jsx

export default function FloatingContactBar({ onHire, onCopyEmail, beep, showToast }) {
  return (
    <div className="floating-contact-bar">
      <div className="floating-contact-inner">
        <button className="floating-contact-btn primary" onClick={() => { onHire(); beep?.(880); }} title="Direct Recruit / Contact Modal">
          <i className="fas fa-paper-plane" /> <span>Quick Contact</span>
        </button>

        <button className="floating-contact-btn" onClick={() => { onCopyEmail(); beep?.(700, 'square'); }} title="1-Click Copy Email">
          <i className="fas fa-envelope" /> <span>Copy Email</span>
        </button>

        <a href="https://t.me/tahamajlesii" target="_blank" className="floating-contact-btn" onClick={() => beep?.()} title="Instant Telegram Chat">
          <i className="fab fa-telegram-plane" /> <span>Telegram</span>
        </a>

        <a href="https://instagram.com/hooshaaii" target="_blank" className="floating-contact-btn" onClick={() => beep?.()} title="Instagram @hooshaaii">
          <i className="fab fa-instagram" /> <span>Instagram</span>
        </a>
      </div>
    </div>
  );
}
