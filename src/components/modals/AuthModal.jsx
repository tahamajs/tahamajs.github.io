// src/components/modals/AuthModal.jsx
import { useState } from 'react';
import Modal from '../ui/Modal.jsx';

export default function AuthModal({ open, onClose, onLogin, showToast, beep }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Researcher');

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    const user = {
      name,
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`
    };

    onLogin(user);
    beep?.(880, 'sine');
    showToast?.(`👋 Welcome ${name}! You are now signed in and connected to Taha Majlesi's AI Terminal.`);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="section-tag">🔐 Visitor Authentication</div>
      <h2 style={{ color: '#fff', marginBottom: '.5rem' }}>Sign In &amp; Talk with Taha 🟢</h2>
      <p style={{ fontSize: '.88rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1.2rem' }}>
        Log in to personalize your interactive AI session, save your neural network training weights, and initiate direct priority messaging with Taha Majlesi.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="form-group">
          <label>Your Full Name:</label>
          <input
            type="text"
            required
            placeholder="Prof. Alex Mercer"
            value={name}
            onChange={e => setName(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Your Email Address:</label>
          <input
            type="email"
            required
            placeholder="alex@stanford.edu"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Your Profession / Role:</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="form-input">
            <option value="AI Researcher">🔬 AI Researcher / Scientist</option>
            <option value="Software Engineer">💻 Senior Software / CUDA Engineer</option>
            <option value="Recruiter">💼 Tech Recruiter / Executive</option>
            <option value="Student">🎓 Student / Fellow</option>
          </select>
        </div>

        <div className="auth-hope-banner" style={{ background: 'rgba(0,240,255,0.06)', border: '1px solid var(--border)', padding: '.8rem 1rem', borderRadius: '10px', fontSize: '.82rem', color: 'var(--cyan)', lineHeight: '1.5' }}>
          💡 <b>Hope &amp; Direct Connection:</b> Taha actively reads and responds to all logged-in researcher messages within 24 hours!
        </div>

        <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '.4rem' }}>
          <i className="fas fa-sign-in-alt" /> Sign In &amp; Start Live Session
        </button>
      </form>
    </Modal>
  );
}
