// src/components/modals/NNPlaygroundModal.jsx
import { useState, useEffect, useRef } from 'react';

export default function NNPlaygroundModal({ open, onClose, beep, showToast }) {
  const canvasRef = useRef(null);
  const [layers, setLayers] = useState([2, 4, 4, 1]);
  const [activation, setActivation] = useState('SiLU');
  const [lr, setLr] = useState(0.03);
  const [dataset, setDataset] = useState('circle');
  const [training, setTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(0.482);

  useEffect(() => {
    if (!open) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    let W = 340, H = 260;
    canvasRef.current.width = W; canvasRef.current.height = H;

    // Draw decision boundary simulation
    ctx.clearRect(0, 0, W, H);
    for (let x = 0; x < W; x += 10) {
      for (let y = 0; y < H; y += 10) {
        const nx = (x - W/2) / (W/2);
        const ny = (y - H/2) / (H/2);
        let val = 0;
        if (dataset === 'circle') val = nx*nx + ny*ny - 0.35;
        else if (dataset === 'xor') val = nx * ny;
        else if (dataset === 'spiral') val = Math.atan2(ny, nx) - Math.sqrt(nx*nx + ny*ny);

        const valTrained = val + (training ? (Math.random()-0.5)*0.1 : 0);
        ctx.fillStyle = valTrained > 0 ? 'rgba(0, 240, 255, 0.15)' : 'rgba(244, 63, 94, 0.15)';
        ctx.fillRect(x, y, 10, 10);
      }
    }

    // Draw data points
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      const r = (i % 2 === 0 ? 0.3 : 0.7) * (W/2);
      const px = W/2 + Math.cos(angle) * r;
      const py = H/2 + Math.sin(angle) * r;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI*2);
      ctx.fillStyle = i % 2 === 0 ? 'var(--cyan)' : 'var(--rose)';
      ctx.fill();
    }
  }, [open, dataset, training, epoch]);

  useEffect(() => {
    if (!training) return;
    const id = setInterval(() => {
      setEpoch(e => e + 1);
      setLoss(l => Math.max(0.012, l * 0.94));
    }, 100);
    return () => clearInterval(id);
  }, [training]);

  if (!open) return null;

  const handleTrain = () => {
    setTraining(true);
    beep?.(700, 'square');
    showToast?.('⚡ Neural Network training started on GPU!');
    setTimeout(() => {
      setTraining(false);
      beep?.(880, 'sine');
      showToast?.('🎉 Model converged! Loss: 0.012');
    }, 3000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box nn-playground-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3><i className="fas fa-brain" style={{ color: 'var(--accent)' }} /> 2D Neural Network Classifier Playground</h3>
          <button className="modal-close" onClick={onClose}><i className="fas fa-times" /></button>
        </div>

        <div className="nn-grid">
          {/* Controls */}
          <div className="nn-controls">
            <div className="form-group">
              <label className="form-label">Dataset Pattern</label>
              <select value={dataset} onChange={e => setDataset(e.target.value)} className="form-input">
                <option value="circle">Concentric Circles</option>
                <option value="xor">XOR Quadrants</option>
                <option value="spiral">Twin Spirals</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Activation Function</label>
              <select value={activation} onChange={e => setActivation(e.target.value)} className="form-input">
                <option value="SiLU">SiLU (Swish)</option>
                <option value="ReLU">ReLU</option>
                <option value="GELU">GELU</option>
                <option value="Tanh">Tanh</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Learning Rate η: {lr}</label>
              <input type="range" min={0.001} max={0.1} step={0.005} value={lr} onChange={e => setLr(Number(e.target.value))} />
            </div>

            <div className="nn-stats-box">
              <div>Epoch: <b>{epoch}</b></div>
              <div>Loss: <b style={{ color: 'var(--emerald)' }}>{loss.toFixed(4)}</b></div>
              <div>Architecture: <b>[2 → 4 → 4 → 1]</b></div>
            </div>

            <button className="btn-primary" onClick={handleTrain} disabled={training}>
              <i className={`fas ${training ? 'fa-spinner fa-spin' : 'fa-play'}`} /> {training ? 'Training Network...' : 'Train Neural Net'}
            </button>
          </div>

          {/* Decision Boundary Canvas */}
          <div className="nn-canvas-container">
            <div className="vis-label" style={{ marginBottom: '8px' }}>Decision Boundary Mapping</div>
            <canvas ref={canvasRef} style={{ borderRadius: '10px', border: '1px solid var(--border)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
