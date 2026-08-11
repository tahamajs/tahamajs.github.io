// src/components/sections/BenchmarkSection.jsx
import SectionHead from '../ui/SectionHead.jsx';

const BENCHMARKS = [
  {
    title: 'Distributed LLM Training Throughput (Tokens / Sec / GPU)',
    subtitle: '8×A100 SXM4 80GB — LLaMA-3 8B Training (Seq Length: 8192)',
    metrics: [
      { name: 'Kaleido Engine ⚡ (Custom Fused CUDA)', val: 4850, max: 5000, color: 'var(--cyan)', highlight: true },
      { name: 'DeepSpeed ZeRO-3 + FlashAttn2', val: 4120, max: 5000, color: '#8a2be2' },
      { name: 'PyTorch FSDP (Full Shard)', val: 3650, max: 5000, color: '#60a5fa' },
      { name: 'Standard PyTorch DDP', val: 2400, max: 5000, color: '#64748b' }
    ]
  },
  {
    title: 'Peak VRAM Memory Consumption (GB)',
    subtitle: 'Lower is better — Batch Size 16 per GPU, Gradient Checkpointing enabled',
    metrics: [
      { name: 'Kaleido Engine ⚡ (Sub-Quadratic SVD Attn)', val: 24.8, max: 80, color: 'var(--emerald)', highlight: true },
      { name: 'DeepSpeed ZeRO-3 Offload', val: 38.2, max: 80, color: '#8a2be2' },
      { name: 'PyTorch FSDP', val: 52.6, max: 80, color: '#60a5fa' },
      { name: 'Standard PyTorch DDP', val: 78.4, max: 80, color: '#f43f5e' }
    ]
  }
];

export default function BenchmarkSection() {
  return (
    <section id="benchmarks" className="section fade-up">
      <SectionHead
        tag="Systems Benchmarks"
        title="Kaleido Engine vs. Standard Frameworks ⚡"
        sub="Empirical benchmark performance comparing Taha's from-scratch 4D-parallel CUDA engine against PyTorch FSDP &amp; DeepSpeed ZeRO-3 on A100 GPU clusters."
      />

      <div className="benchmarks-container">
        {BENCHMARKS.map((b, idx) => (
          <div key={idx} className="benchmark-card">
            <h3 className="benchmark-card-title">{b.title}</h3>
            <div className="benchmark-card-sub">{b.subtitle}</div>

            <div className="benchmark-bars">
              {b.metrics.map((m, i) => (
                <div key={i} className={`benchmark-row ${m.highlight ? 'highlight' : ''}`}>
                  <div className="benchmark-label">
                    <span>{m.name}</span>
                    <span className="benchmark-val" style={{ color: m.color }}>{m.val.toLocaleString()}</span>
                  </div>
                  <div className="benchmark-bar-bg">
                    <div
                      className="benchmark-bar-fill"
                      style={{
                        width: `${(m.val / m.max) * 100}%`,
                        background: m.color,
                        boxShadow: m.highlight ? `0 0 12px ${m.color}` : 'none'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
