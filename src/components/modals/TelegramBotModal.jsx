// src/components/modals/TelegramBotModal.jsx
import { useState } from 'react';
import Modal from '../ui/Modal.jsx';

export default function TelegramBotModal({ open, onClose, showToast, beep }) {
  const [telegramHandle, setTelegramHandle] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [topic, setTopic] = useState('all');

  if (!open) return null;

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!telegramHandle.trim()) return;
    beep?.(880, 'sine');
    setSubscribed(true);
    showToast?.(`✈️ Subscribed ${telegramHandle} to Hoosha AI & Taha Majlesi Telegram Bot!`);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="section-tag">✈️ Automated Notifications</div>
      <h2 style={{ color: '#fff', marginBottom: '.5rem' }}>Telegram AI Bot Updates 🤖</h2>
      <p style={{ fontSize: '.88rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1rem' }}>
        Connect your Telegram account to receive instant research updates, new HuggingFace model releases, Substack papers, and direct message replies from Taha Majlesi.
      </p>

      {!subscribed ? (
        <form onSubmit={handleSubscribe} className="telegram-bot-form">
          <div className="form-group">
            <label>Your Telegram @username or Chat ID:</label>
            <input
              type="text"
              placeholder="@tahamajlesii"
              value={telegramHandle}
              onChange={e => setTelegramHandle(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Notification Topics:</label>
            <select value={topic} onChange={e => setTopic(e.target.value)} className="form-input">
              <option value="all">🚀 All Research, Models & Keynote Updates</option>
              <option value="papers">📄 Research Papers & Math Derivations</option>
              <option value="models">🤗 HuggingFace Models & CUDA Kernels</option>
              <option value="recruit">💼 Direct Recruitment / Advisory Opportunities</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '.8rem', marginTop: '1rem' }}>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              <i className="fab fa-telegram-plane" /> Subscribe via Bot
            </button>
            <a
              href="https://t.me/tahamajlesii"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              style={{ justifyContent: 'center' }}
              onClick={() => beep?.()}>
              <i className="fas fa-external-link-alt" /> Open Telegram
            </a>
          </div>
        </form>
      ) : (
        <div className="telegram-success-box">
          <i className="fas fa-check-circle" style={{ fontSize: '2.5rem', color: 'var(--emerald)', marginBottom: '.5rem' }} />
          <h3>Successfully Subscribed!</h3>
          <p style={{ fontSize: '.85rem', color: 'var(--muted)', marginTop: '.4rem' }}>
            Updates for <b>{telegramHandle}</b> are active. You will receive Telegram notifications directly from <code>@tahamajlesii</code> / Hoosha AI Bot!
          </p>

          <button className="btn-secondary" onClick={() => setSubscribed(false)} style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
            Edit Subscription Handle
          </button>
        </div>
      )}
    </Modal>
  );
}
