// src/components/modals/ArticleCreatorModal.jsx
import { useState } from 'react';

export default function ArticleCreatorModal({ open, onClose, onAddArticle, beep, showToast }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [url, setUrl] = useState('https://hooshaai.substack.com/p/');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
  const [tag, setTag] = useState('Flow Matching');

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) return;

    const newArticle = {
      title: title.trim(),
      desc: desc.trim(),
      url: url.trim(),
      date: date.trim(),
      tag: tag.trim()
    };

    onAddArticle(newArticle);
    beep?.(800, 'sine');
    showToast?.('🎉 Article added successfully!');
    
    // Reset form
    setTitle('');
    setDesc('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box article-creator-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3><i className="fas fa-pen-nib" style={{ color: 'var(--accent)' }} /> Publish / Add Technical Article</h3>
          <button className="modal-close" onClick={onClose}><i className="fas fa-times" /></button>
        </div>

        <form onSubmit={handleSubmit} className="article-form">
          <div className="form-group">
            <label className="form-label">Article Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Scaling Continuous Normalizing Flows with Conditional Flow Matching"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Category Tag</label>
              <select value={tag} onChange={e => setTag(e.target.value)} className="form-input">
                <option value="Flow Matching">Flow Matching</option>
                <option value="GRPO Alignment">GRPO Alignment</option>
                <option value="CUDA Systems">CUDA Systems</option>
                <option value="Linear Attention">Linear Attention</option>
                <option value="Machine Unlearning">Machine Unlearning</option>
                <option value="IIT Cognition">IIT Cognition</option>
              </select>
            </div>
            <div className="form-group flex-1">
              <label className="form-label">Publication Date</label>
              <input
                type="text"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Substack / Link URL</label>
            <input
              type="url"
              required
              placeholder="https://hooshaai.substack.com/p/your-post"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Abstract / Summary</label>
            <textarea
              required
              rows={4}
              placeholder="In-depth exploration of vector field regression, sample efficiency, and ODE solver integration steps..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="form-input form-textarea"
            />
          </div>

          {/* Live Preview Card */}
          {title && (
            <div className="article-preview-box">
              <div className="form-label" style={{ marginBottom: '.5rem', color: 'var(--accent)' }}>Live Card Preview:</div>
              <div className="article-card preview-card">
                <div className="article-date">{date} · <span style={{ color: 'var(--accent)' }}>{tag}</span></div>
                <h3>{title}</h3>
                <p>{desc}</p>
                <span className="read-more">Read Paper <i className="fas fa-arrow-right" /></span>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">
              <i className="fas fa-plus-circle" /> Publish Article to Site
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
