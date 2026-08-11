// src/components/layout/Footer.jsx

export default function Footer({ gpuM }) {
  return (
    <>
      <footer style={{ textAlign: 'center', padding: '4rem 1.5rem 8rem', borderTop: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <p style={{ color: 'var(--muted)', fontSize: '.88rem', marginBottom: '1.2rem', lineHeight: '1.6' }}>
          &copy; {new Date().getFullYear()} Mohammad Taha Majlesi. Open-Source AI Infrastructure &amp; Frontier Research.
        </p>
        <div style={{ display: 'flex', gap: '1.4rem', justifyContent: 'center', flexWrap: 'wrap', fontSize: '.88rem' }}>
          <a href="https://github.com/tahamajs" target="_blank" rel="noreferrer" style={{ color: '#fff' }}>
            <i className="fab fa-github" /> GitHub (@tahamajs)
          </a>
          <a href="https://huggingface.co/tahamajs" target="_blank" rel="noreferrer" style={{ color: '#ffd21e' }}>
            <i className="fas fa-robot" /> HuggingFace (162 Assets)
          </a>
          <a href="https://hooshaai.substack.com" target="_blank" rel="noreferrer" style={{ color: '#ff6719' }}>
            <i className="fas fa-newspaper" /> Hoosha AI Substack
          </a>
          <a href="https://linkedin.com/in/tahamajlesi" target="_blank" rel="noreferrer" style={{ color: '#0a66c2' }}>
            <i className="fab fa-linkedin" /> LinkedIn (17.1k)
          </a>
          <a href="https://instagram.com/hooshaaii" target="_blank" rel="noreferrer" style={{ color: '#e1306c' }}>
            <i className="fab fa-instagram" /> Instagram (@hooshaaii)
          </a>
          <a href="https://t.me/tahamajlesii" target="_blank" rel="noreferrer" style={{ color: '#229ed9' }}>
            <i className="fab fa-telegram" /> Telegram (@tahamajlesii)
          </a>
          <a href="https://github.com/sponsors/tahamajs" target="_blank" rel="noreferrer" style={{ color: '#ea4aaa', fontWeight: 600 }}>
            <i className="fas fa-heart" /> Sponsor Research
          </a>
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
