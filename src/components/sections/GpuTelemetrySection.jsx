// src/components/sections/GpuTelemetrySection.jsx
import { useState, useEffect } from 'react';
import SectionHead from '../ui/SectionHead.jsx';

export default function GpuTelemetrySection() {
  const [history, setHistory] = useState(() => Array(20).fill(70));
  const [flopsHist, setFlopsHist] = useState(() => Array(20).fill(312));
  const [vram, setVram] = useState(68.4);
  const [temp, setTemp] = useState(62);

  useEffect(() => {
    const id = setInterval(() => {
      const util = Math.floor(65 + Math.random() * 32);
      const fl = Math.floor(300 + Math.random() * 25);
      const vr = (66 + Math.random() * 4).toFixed(1);
      const tm = Math.floor(60 + Math.random() * 6);

      setHistory(prev => [...prev.slice(1), util]);
      setFlopsHist(prev => [...prev.slice(1), fl]);
      setVram(vr);
      setTemp(tm);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="telemetry" className="section fade-up">
      <SectionHead
        tag="Real-Time Node Telemetry"
        title="Distributed Cluster Health &amp; Metrics 📊"
        sub="Live monitoring simulation of Taha's 8×A100 SXM4 80GB GPU cluster node executing Flow Matching ODE integrations and GRPO post-training steps."
      />

      <div className="telemetry-grid">
        {/* Metric 1: SM Util */}
        <div className="telemetry-card">
          <div className="telemetry-header">
            <span className="telemetry-title"><i className="fas fa-microchip" style={{ color: 'var(--accent)' }} /> Streaming Multiprocessor (SM)</span>
            <span className="telemetry-val" style={{ color: 'var(--accent)' }}>{history[history.length - 1]}%</span>
          </div>
          <div className="sparkline">
            {history.map((h, i) => (
              <div key={i} className="sparkline-bar" style={{ height: `${h}%`, background: 'var(--accent)' }} />
            ))}
          </div>
          <div className="telemetry-sub">Target: 108 SMs @ 1.41 GHz · 6,912 CUDA Cores</div>
        </div>

        {/* Metric 2: Tensor FLOPS */}
        <div className="telemetry-card">
          <div className="telemetry-header">
            <span className="telemetry-title"><i className="fas fa-bolt" style={{ color: 'var(--emerald)' }} /> Tensor FLOPS (BF16)</span>
            <span className="telemetry-val" style={{ color: 'var(--emerald)' }}>{flopsHist[flopsHist.length - 1]} TFLOPS</span>
          </div>
          <div className="sparkline">
            {flopsHist.map((f, i) => (
              <div key={i} className="sparkline-bar" style={{ height: `${((f - 280) / 50) * 100}%`, background: 'var(--emerald)' }} />
            ))}
          </div>
          <div className="telemetry-sub">Peak FP16 Tensor Core Performance: 312 TFLOPS</div>
        </div>

        {/* Metric 3: VRAM Allocation */}
        <div className="telemetry-card">
          <div className="telemetry-header">
            <span className="telemetry-title"><i className="fas fa-memory" style={{ color: '#a78bfa' }} /> HBM2e VRAM Usage</span>
            <span className="telemetry-val" style={{ color: '#a78bfa' }}>{vram} / 80 GB</span>
          </div>
          <div className="telemetry-progress">
            <div className="telemetry-progress-fill" style={{ width: `${(vram / 80) * 100}%`, background: '#a78bfa' }} />
          </div>
          <div className="telemetry-sub">Bandwidth: 1,935 GB/s (1.93 TB/s peak)</div>
        </div>

        {/* Metric 4: Thermals & Power */}
        <div className="telemetry-card">
          <div className="telemetry-header">
            <span className="telemetry-title"><i className="fas fa-temperature-high" style={{ color: '#f43f5e' }} /> Thermal &amp; Power Draw</span>
            <span className="telemetry-val" style={{ color: '#f43f5e' }}>{temp}°C / 380W</span>
          </div>
          <div className="telemetry-progress">
            <div className="telemetry-progress-fill" style={{ width: `${(temp / 85) * 100}%`, background: '#f43f5e' }} />
          </div>
          <div className="telemetry-sub">SXM4 Liquid-Cooled Loop · Max TDP: 400W</div>
        </div>
      </div>
    </section>
  );
}
