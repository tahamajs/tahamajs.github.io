// src/components/modals/KeyboardShortcutsModal.jsx
import Modal from '../ui/Modal.jsx';

const SHORTCUTS = [
  { key: '⌘ K', desc: 'Open Global Command Palette' },
  { key: '⌘ J', desc: 'Open Interactive Terminal CLI Shell' },
  { key: '?', desc: 'Show / Hide Keyboard Shortcuts Cheat Sheet' },
  { key: '1', desc: 'Switch to Overview & Bio Page' },
  { key: '2', desc: 'Switch to Interactive AI Lab Page' },
  { key: '3', desc: 'Switch to Projects & HF Models Page' },
  { key: '4', desc: 'Switch to Papers & Substack Page' },
  { key: '5', desc: 'Switch to Contact & Recruit Page' },
  { key: 'M', desc: 'Toggle Ambient Sound & Weather Audio' },
  { key: 'Esc', desc: 'Close active modal window' },
];

export default function KeyboardShortcutsModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="section-tag">⌨️ Power User UX</div>
      <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Keyboard Shortcuts 🚀</h2>
      <div className="shortcuts-grid">
        {SHORTCUTS.map((s, i) => (
          <div key={i} className="shortcut-item">
            <span className="shortcut-key">{s.key}</span>
            <span className="shortcut-desc">{s.desc}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}
