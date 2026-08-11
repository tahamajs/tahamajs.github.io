// src/components/sections/ReadmeSection.jsx
import SectionHead from '../ui/SectionHead.jsx';

export default function ReadmeSection({ readmeHtml }) {
  return (
    <section id="readme" className="section fade-up">
      <SectionHead
        tag="Documentation"
        title="GitHub Profile README"
        sub="The source of truth for my current projects, tech stack, and GitHub stats."
      />
      <div className="readme-preview">
        <div className="readme-preview-bar">
          <i className="fab fa-markdown" style={{ color: 'var(--muted)' }} />
          <span>tahamajs / README.md</span>
          <a href="https://github.com/tahamajs" target="_blank" style={{ marginLeft: 'auto', color: 'var(--accent)', fontSize: '.78rem' }}>View on GitHub ↗</a>
        </div>
        <div className="readme-content" dangerouslySetInnerHTML={{ __html: readmeHtml }} />
      </div>
    </section>
  );
}
