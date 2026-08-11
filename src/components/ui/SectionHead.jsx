// src/components/ui/SectionHead.jsx
export default function SectionHead({ tag, title, sub }) {
  return (
    <div className="section-head">
      {tag && <div className="section-tag">{tag}</div>}
      <h2 dangerouslySetInnerHTML={{ __html: title }} />
      {sub && <p>{sub}</p>}
    </div>
  );
}
