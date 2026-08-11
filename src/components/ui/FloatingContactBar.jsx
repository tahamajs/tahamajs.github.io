// src/components/ui/FloatingContactBar.jsx

export default function FloatingContactBar({ onHire, onCopyEmail, onTelegramBot, onBookCall, onAuth, userProfile, beep, showToast }) {
  return (
    <div className="floating-contact-bar">
      <div className="floating-contact-inner">
        <button className="floating-contact-btn primary" onClick={() => { onHire(); beep?.(880); }} title="Direct Recruit / Contact Modal">
          <i className="fas fa-paper-plane" /> <span>Quick Contact</span>
        </button>

        <button className="floating-contact-btn" onClick={() => { onBookCall?.(); beep?.(880); }} title="Schedule 1-on-1 Call with Taha">
          <i className="fas fa-calendar-alt" style={{ color: 'var(--emerald)' }} /> <span>Book 1-on-1 Call</span>
        </button>

        <button className="floating-contact-btn" onClick={() => { onCopyEmail(); beep?.(700, 'square'); }} title="1-Click Copy Email">
          <i className="fas fa-envelope" /> <span>Copy Email</span>
        </button>

        <button className="floating-contact-btn" onClick={() => { onTelegramBot?.(); beep?.(880); }} title="Subscribe to Telegram Bot Updates">
          <i className="fab fa-telegram-plane" style={{ color: 'var(--cyan)' }} /> <span>Telegram Bot</span>
        </button>

        <a href="https://instagram.com/hooshaaii" target="_blank" className="floating-contact-btn" onClick={() => beep?.()} title="Instagram @hooshaaii">
          <i className="fab fa-instagram" /> <span>Instagram</span>
        </a>
      </div>
    </div>
  );
}
