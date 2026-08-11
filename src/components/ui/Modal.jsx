// src/components/ui/Modal.jsx
import { useEffect } from 'react';

export default function Modal({ open, onClose, children, wide = false }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-box${wide ? ' modal-wide' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" aria-label="Close" onClick={onClose}>
          <i className="fas fa-times" />
        </button>
        {children}
      </div>
    </div>
  );
}
