// src/components/modals/CommandPalette.jsx
import { useState } from 'react';
import { CMD_ITEMS } from '../../data/constants.js';

export default function CommandPalette({ open, onClose, onCmd }) {
  const [q, setQ] = useState('');
  if (!open) return null;
  const filtered = CMD_ITEMS.filter(i => i.text.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="cmd-box" onClick={e => e.stopPropagation()}>
        <div className="cmd-search">
          <i className="fas fa-search" />
          <input autoFocus placeholder="Search commands, sections, links…"
            value={q} onChange={e => setQ(e.target.value)} />
          <button style={{ background:'none', border:'1px solid var(--border)', color:'var(--muted)', padding:'.2rem .5rem', borderRadius:5, fontSize:'.72rem', cursor:'pointer' }} onClick={onClose}>ESC</button>
        </div>
        <div className="cmd-results">
          {filtered.map((it, i) => (
            <div key={i} className="cmd-item" role="button" tabIndex={0}
              onClick={() => { onCmd(it.id); onClose(); }}
              onKeyDown={e => (e.key==='Enter'||e.key===' ') && (onCmd(it.id), onClose())}>
              <i className={it.icon} />
              {it.text}
              <i className="fas fa-arrow-right" style={{ marginLeft:'auto', opacity:.25, fontSize:'.7rem' }} />
            </div>
          ))}
        </div>
        <div style={{ padding:'.5rem 1.2rem', borderTop:'1px solid var(--border)', display:'flex', gap:'1rem', fontSize:'.7rem', color:'var(--muted)' }}>
          <span><kbd style={{ background:'var(--glass2)', border:'1px solid var(--border)', padding:'.1rem .4rem', borderRadius:4 }}>↑↓</kbd> Navigate</span>
          <span><kbd style={{ background:'var(--glass2)', border:'1px solid var(--border)', padding:'.1rem .4rem', borderRadius:4 }}>↵</kbd> Select</span>
          <span><kbd style={{ background:'var(--glass2)', border:'1px solid var(--border)', padding:'.1rem .4rem', borderRadius:4 }}>ESC</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}
