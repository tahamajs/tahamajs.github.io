// src/components/layout/Footer.jsx

export default function Footer({ gpuM }) {
  return (
    <>
      <footer style={{ textAlign: 'center', padding: '4rem 1.5rem 8rem', borderTop: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginBottom: '1rem' }}>
          &copy; {new Date().getFullYear()} Mohammad Taha Majlesi. Open-Source AI Infrastructure.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://github.com/tahamajs" target="_blank">GitHub</a>
          <a href="https://huggingface.co/tahamajs" target="_blank">HuggingFace</a>
          <a href="https://hooshaai.substack.com" target="_blank">Hoosha AI</a>
          <a href="https://linkedin.com/in/tahamajlesi" target="_blank">LinkedIn</a>
          <a href="https://github.com/sponsors/tahamajs" target="_blank" style={{ color: '#ea4aaa' }}>Sponsor</a>
        </div>
      </footer>

      {/* GPU Telemetry Bar */}
      <div className="gpu-bar">
        <div className="gpu-dot" />
        <div className="gpu-item">Node: <b>A100-SXM4-80GB</b></div>
        <div className="gpu-item">SM Util: <span className="gpu-val">{gpuM.util}%</span></div>
        <div className="gpu-item">VRAM: <span className="gpu-val">{gpuM.vram} GB</span> / 80.0</div>
        <div className="gpu-item">Bandwidth: <span className="gpu-val">1.8 TB/s</span></div>
        <div className="gpu-item">TFLOPS: <span className="gpu-val">{gpuM.flops}</span></div>
        <div className="gpu-item">Temp: <span className="gpu-val">{gpuM.temp}°C</span></div>
      </div>
    </>
  );
}
