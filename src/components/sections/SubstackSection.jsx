// src/components/sections/SubstackSection.jsx
import SectionHead from '../ui/SectionHead.jsx';

export default function SubstackSection({ articles, subSearch, setSubSearch, beep }) {
  return (
    <section id="substack" className="section fade-up" style={{ background: 'rgba(0,240,255,0.01)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <SectionHead
        tag="Hoosha AI Substack"
        title="Technical Deep Dives &amp; Essays"
        sub="In-depth explorations of generative models, LLM alignment math, and distributed systems — read by researchers globally."
      />
      <div className="search-wrap" style={{ maxWidth: 600, margin: '0 auto 2.5rem' }}>
        <i className="fas fa-search search-icon" />
        <input
          type="text"
          placeholder="Search 20 Substack papers..."
          value={subSearch}
          onChange={e => setSubSearch(e.target.value)}
        />
      </div>
      <div className="articles-grid">
        {articles.map((a, i) => (
          <a key={i} href={a.url} target="_blank" className="article-card" onClick={() => beep?.()}>
            <div className="article-date">{a.date}</div>
            <h3>{a.title}</h3>
            <p>{a.desc}</p>
            <span className="read-more">Read Paper <i className="fas fa-arrow-right" /></span>
          </a>
        ))}
      </div>
    </section>
  );
}
