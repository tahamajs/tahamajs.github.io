// src/components/sections/PhotosSection.jsx
import { useState } from 'react';
import SectionHead from '../ui/SectionHead.jsx';
import Modal from '../ui/Modal.jsx';

const PHOTOS = [
  {
    id: 'portrait',
    src: 'assets/photos/photo_portrait.png',
    fallback: '1786635321419.png',
    title: 'Mohammad Taha Majlesi',
    category: 'Portraits',
    location: 'Tehran, Iran',
    tag: 'Profile & AI Architect',
    desc: 'Co-Founder & AI Architect at Hoosha AI. Leading research across Flow Matching, GRPO, and CUDA systems.',
    aspect: 'tall'
  },
  {
    id: 'photo_7980',
    src: 'assets/photos/photo_7980.jpg',
    title: 'GPU Cluster & Systems Lab',
    category: 'Research & Lab',
    location: 'AI Research Lab',
    tag: 'Hardware & Infrastructure',
    desc: 'Deep work sessions on distributed GPU infrastructure and 4D-parallel CUDA kernels.',
    aspect: 'wide'
  },
  {
    id: 'photo_8006',
    src: 'assets/photos/photo_8006.jpg',
    title: 'Academic & Mentorship Sessions',
    category: 'Academic & Talks',
    location: 'University of Tehran & Sharif',
    tag: 'Teaching & Mentoring',
    desc: 'Teaching Assistant sessions for Compiler Construction, M.Sc. Machine Learning, and Operating Systems.',
    aspect: 'standard'
  },
  {
    id: 'photo_8008',
    src: 'assets/photos/photo_8008.jpg',
    title: 'Technical Discussions & Research Dispatches',
    category: 'Research & Lab',
    location: 'Hoosha AI Headquarters',
    tag: 'Research & Architecture',
    desc: 'Brainstorming continuous normalizing flows and group-relative policy optimization.',
    aspect: 'wide'
  },
  {
    id: 'photo_0080',
    src: 'assets/photos/photo_0080.jpg',
    title: 'Engineering & Exploration',
    category: 'Portraits',
    location: 'Tehran Campus',
    tag: 'Engineering Focus',
    desc: 'Moments from research sprints, compiler labs, and open-source software development.',
    aspect: 'standard'
  },
  {
    id: 'photo_0088',
    src: 'assets/photos/photo_0088.jpg',
    title: 'Campus & Scientific Journey',
    category: 'Academic & Talks',
    location: 'Sharif University & UT',
    tag: 'Academic Journey',
    desc: 'Collaborating with fellow researchers, students, and engineers across universities and labs.',
    aspect: 'standard'
  },
  {
    id: 'photo_0106',
    src: 'assets/photos/photo_0106.jpg',
    title: 'Deep Focus & Innovation',
    category: 'Research & Lab',
    location: 'AI Research Terminal',
    tag: 'Deep Work',
    desc: 'Architecting high-throughput LLM engines, synthetic consciousness models, and linear attention mechanisms.',
    aspect: 'wide'
  }
];

const CATEGORIES = ['All', 'Portraits', 'Research & Lab', 'Academic & Talks'];

export default function PhotosSection({ beep }) {
  const [activeCat, setActiveCat] = useState('All');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const filtered = activeCat === 'All' ? PHOTOS : PHOTOS.filter(p => p.category === activeCat);

  return (
    <section id="photos" className="section fade-up">
      <SectionHead
        tag="Moments &amp; Visual Journal"
        title="Field Notes &amp; Photo Gallery 📸"
        sub="A visual glimpse into AI systems engineering, academic lectures, GPU labs, and research journeys."
      />

      {/* Category Filter Pills */}
      <div className="photo-filters">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`photo-filter-btn ${activeCat === cat ? 'active' : ''}`}
            onClick={() => { setActiveCat(cat); beep?.(750); }}
          >
            {cat === 'All' ? '⚡ ' : ''}{cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="photo-gallery-grid">
        {filtered.map(p => (
          <div
            key={p.id}
            className={`photo-card ${p.aspect}`}
            onClick={() => { setSelectedPhoto(p); beep?.(840); }}
          >
            <div className="photo-img-wrap">
              <img
                src={p.src}
                alt={p.title}
                className="photo-img"
                loading="lazy"
                onError={e => {
                  if (p.fallback && !e.target.dataset.triedFallback) {
                    e.target.dataset.triedFallback = 'true';
                    e.target.src = p.fallback;
                  }
                }}
              />
              <div className="photo-overlay">
                <span className="photo-tag-badge">{p.tag}</span>
                <h3 className="photo-card-title">{p.title}</h3>
                <div className="photo-location"><i className="fas fa-map-marker-alt" /> {p.location}</div>
                <div className="photo-zoom-hint"><i className="fas fa-search-plus" /> View High-Res</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <Modal open={!!selectedPhoto} onClose={() => setSelectedPhoto(null)}>
          <div className="photo-lightbox-content">
            <div className="lightbox-img-wrap">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="lightbox-img"
                onError={e => {
                  if (selectedPhoto.fallback && !e.target.dataset.triedFallback) {
                    e.target.dataset.triedFallback = 'true';
                    e.target.src = selectedPhoto.fallback;
                  }
                }}
              />
            </div>
            <div className="lightbox-details">
              <div className="lightbox-meta">
                <span className="photo-tag-badge">{selectedPhoto.tag}</span>
                <span className="photo-location"><i className="fas fa-map-marker-alt" /> {selectedPhoto.location}</span>
              </div>
              <h2 className="lightbox-title">{selectedPhoto.title}</h2>
              <p className="lightbox-desc">{selectedPhoto.desc}</p>
              <div className="lightbox-actions">
                <a href={selectedPhoto.src} download className="btn-secondary" style={{ fontSize: '.82rem', padding: '.4rem 1rem' }}>
                  <i className="fas fa-download" /> Download Original
                </a>
                <button className="btn-primary" onClick={() => setSelectedPhoto(null)} style={{ fontSize: '.82rem', padding: '.4rem 1.2rem' }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
