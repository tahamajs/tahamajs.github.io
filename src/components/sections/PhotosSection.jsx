// src/components/sections/PhotosSection.jsx
import { useState, useEffect } from 'react';
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
    specs: 'Studio Portrait · AI Systems',
    desc: 'Co-Founder & AI Architect at Hoosha AI. Conducting frontier research in Flow Matching, GRPO alignment, and first-principles distributed GPU systems.',
    aspect: 'tall'
  },
  {
    id: 'photo_7980',
    src: 'assets/photos/photo_7980.jpg',
    title: 'GPU Cluster & Systems Lab',
    category: 'Research & Lab',
    location: 'AI Systems Lab',
    tag: 'Hardware & Infrastructure',
    specs: 'A100 SXM4 Cluster · 4D Parallelism',
    desc: 'Deep work sessions profiling CUDA memory bandwidth, fused all-reduce kernels, and high-throughput training topologies.',
    aspect: 'wide'
  },
  {
    id: 'photo_8006',
    src: 'assets/photos/photo_8006.jpg',
    title: 'Academic & Mentorship Sessions',
    category: 'Academic & Talks',
    location: 'University of Tehran & Sharif',
    tag: 'Teaching & Mentoring',
    specs: 'Compiler Lab & M.Sc. ML',
    desc: 'Mentoring over 500+ university students across Compiler Construction, Advanced C++, Machine Learning, and Operating Systems.',
    aspect: 'standard'
  },
  {
    id: 'photo_8008',
    src: 'assets/photos/photo_8008.jpg',
    title: 'Technical Discussions & Research Dispatches',
    category: 'Research & Lab',
    location: 'Hoosha AI Headquarters',
    tag: 'Research & Architecture',
    specs: 'Generative Models · IIT Theory',
    desc: 'Brainstorming session on continuous normalizing flows, sample efficiency, and synthetic consciousness representations.',
    aspect: 'wide'
  },
  {
    id: 'photo_0080',
    src: 'assets/photos/photo_0080.jpg',
    title: 'Engineering & Exploration',
    category: 'Portraits',
    location: 'Tehran Campus',
    tag: 'Engineering Focus',
    specs: 'Campus Field Notes · Research',
    desc: 'Moments between research sprints, open-source repository releases, and distributed systems benchmarking.',
    aspect: 'standard'
  },
  {
    id: 'photo_0088',
    src: 'assets/photos/photo_0088.jpg',
    title: 'Campus & Scientific Journey',
    category: 'Academic & Talks',
    location: 'Sharif University & UT',
    tag: 'Academic Journey',
    specs: 'Research Collaboration',
    desc: 'Collaborating with fellow researchers, students, and engineers across top universities and AI research labs.',
    aspect: 'standard'
  },
  {
    id: 'photo_0106',
    src: 'assets/photos/photo_0106.jpg',
    title: 'Deep Focus & Innovation',
    category: 'Research & Lab',
    location: 'AI Research Terminal',
    tag: 'Deep Work',
    specs: 'Kaleido Engine · SVD Attention',
    desc: 'Architecting high-throughput LLM engines, synthetic evaluation datasets, and rank-r factorized linear attention algorithms.',
    aspect: 'wide'
  }
];

const CATEGORIES = ['All', 'Portraits', 'Research & Lab', 'Academic & Talks'];

export default function PhotosSection({ beep }) {
  const [activeCat, setActiveCat] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState(null);

  const filtered = activeCat === 'All' ? PHOTOS : PHOTOS.filter(p => p.category === activeCat);

  const currentPhoto = selectedIndex !== null ? filtered[selectedIndex] : null;

  const handleNext = (e) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      const next = (selectedIndex + 1) % filtered.length;
      setSelectedIndex(next);
      beep?.(880, 'sine');
    }
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      const prev = (selectedIndex - 1 + filtered.length) % filtered.length;
      setSelectedIndex(prev);
      beep?.(700, 'sine');
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filtered.length]);

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
            onClick={() => { setActiveCat(cat); setSelectedIndex(null); beep?.(750); }}
          >
            {cat === 'All' ? '⚡ ' : ''}{cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="photo-gallery-grid">
        {filtered.map((p, index) => (
          <div
            key={p.id}
            className={`photo-card ${p.aspect}`}
            onClick={() => { setSelectedIndex(index); beep?.(840); }}
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
                <div className="photo-header-row">
                  <span className="photo-tag-badge">{p.tag}</span>
                  <span className="photo-specs-badge"><i className="fas fa-camera" /> {p.specs}</span>
                </div>
                <h3 className="photo-card-title">{p.title}</h3>
                <div className="photo-location"><i className="fas fa-map-marker-alt" /> {p.location}</div>
                <div className="photo-zoom-hint"><i className="fas fa-search-plus" /> View High-Res ({index + 1}/{filtered.length})</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal with Next/Prev and Full Controls */}
      {currentPhoto && (
        <Modal open={!!currentPhoto} onClose={() => setSelectedIndex(null)}>
          <div className="photo-lightbox-content">
            <div className="lightbox-img-wrap">
              <img
                src={currentPhoto.src}
                alt={currentPhoto.title}
                className="lightbox-img"
                onError={e => {
                  if (currentPhoto.fallback && !e.target.dataset.triedFallback) {
                    e.target.dataset.triedFallback = 'true';
                    e.target.src = currentPhoto.fallback;
                  }
                }}
              />
              {filtered.length > 1 && (
                <>
                  <button className="lightbox-nav-btn prev" onClick={handlePrev} aria-label="Previous Photo">
                    <i className="fas fa-chevron-left" />
                  </button>
                  <button className="lightbox-nav-btn next" onClick={handleNext} aria-label="Next Photo">
                    <i className="fas fa-chevron-right" />
                  </button>
                </>
              )}
            </div>

            <div className="lightbox-details">
              <div className="lightbox-meta">
                <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className="photo-tag-badge">{currentPhoto.tag}</span>
                  <span className="photo-specs-badge"><i className="fas fa-camera" /> {currentPhoto.specs}</span>
                </div>
                <span className="lightbox-counter">Photo {selectedIndex + 1} of {filtered.length}</span>
              </div>
              <h2 className="lightbox-title">{currentPhoto.title}</h2>
              <div className="photo-location" style={{ marginBottom: '.4rem' }}>
                <i className="fas fa-map-marker-alt" /> {currentPhoto.location}
              </div>
              <p className="lightbox-desc">{currentPhoto.desc}</p>
              <div className="lightbox-actions">
                <a href={currentPhoto.src} download className="btn-secondary" style={{ fontSize: '.82rem', padding: '.4rem 1.1rem' }}>
                  <i className="fas fa-download" /> Download Original (High-Res)
                </a>
                <button className="btn-primary" onClick={() => setSelectedIndex(null)} style={{ fontSize: '.82rem', padding: '.4rem 1.4rem' }}>
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
