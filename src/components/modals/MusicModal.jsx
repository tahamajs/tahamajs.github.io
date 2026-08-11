import Modal from '../ui/Modal.jsx';

export default function MusicModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.8rem', marginBottom: '0.5rem', color: '#fff' }}>
          <i className="fas fa-music" style={{ color: 'var(--cyan)' }}></i> Ambient Focus Music
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
          Listen to Iday's ambient masterpieces while exploring the portfolio.
        </p>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border)' }}>
        <script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-post="Iday_music/13" data-width="100%" data-color="343638" data-dark="1"></script>
        
        {/* Fallback if widget script doesn't execute in React easily */}
        <iframe 
          src="https://t.me/Iday_music/13?embed=1&dark=1" 
          width="100%" 
          height="150" 
          frameBorder="0" 
          scrolling="no" 
          style={{ border: 'none', overflow: 'hidden', borderRadius: '8px' }}
        ></iframe>
      </div>

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <button className="btn-secondary" onClick={onClose} style={{ padding: '0.6rem 2rem' }}>
          Close Player
        </button>
      </div>
    </Modal>
  );
}
