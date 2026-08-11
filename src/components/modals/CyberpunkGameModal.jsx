// src/components/modals/CyberpunkGameModal.jsx
import { useState, useEffect, useRef } from 'react';

export default function CyberpunkGameModal({ open, onClose, showToast, beep }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [modelSize, setModelSize] = useState('1B Params');
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!open || !gameStarted || gameOver) return;
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let W = cvs.width = 460, H = cvs.height = 360;

    let playerX = W / 2 - 20;
    const playerW = 40, playerH = 14;
    let scoreCount = 0;
    let isDead = false;

    // Tokens to catch & obstacles to avoid
    const items = [];
    const itemTypes = [
      { text: 'FlowMatching', color: '#00f0ff', points: 100, bad: false },
      { text: 'GRPO Loss', color: '#10b981', points: 150, bad: false },
      { text: 'CUDA Kernel', color: '#a78bfa', points: 200, bad: false },
      { text: 'OOM Error!', color: '#f43f5e', points: -1, bad: true },
      { text: 'NaN Spike', color: '#fbbf24', points: -1, bad: true },
    ];

    const onKey = e => {
      if (['ArrowLeft', 'ArrowRight', 'a', 'd', 'A', 'D'].includes(e.key)) e.preventDefault();
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') playerX = Math.max(0, playerX - 24);
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') playerX = Math.min(W - playerW, playerX + 24);
    };
    window.addEventListener('keydown', onKey);

    const spawnInterval = setInterval(() => {
      const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
      items.push({
        x: Math.random() * (W - 40) + 10,
        y: -20,
        spd: Math.random() * 2 + 2,
        ...type
      });
    }, 600);

    let raf;
    const loop = () => {
      if (isDead) return;
      ctx.clearRect(0, 0, W, H);

      // Draw Arcade Grid Background
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }

      // Draw Player Shuttle (Taha Bot)
      ctx.fillStyle = 'var(--accent)';
      ctx.fillRect(playerX, H - 25, playerW, playerH);
      ctx.fillStyle = '#fff';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('🤖 TAHA', playerX + 2, H - 14);

      // Update & Draw Items
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.y += item.spd;

        ctx.fillStyle = item.color;
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText(item.text, item.x, item.y);

        // Collision Check
        if (item.y >= H - 35 && item.y <= H - 10 && item.x >= playerX - 20 && item.x <= playerX + playerW + 10) {
          items.splice(i, 1);
          if (item.bad) {
            isDead = true;
            setGameOver(true);
            beep?.(300, 'sawtooth');
            showToast?.('💥 Model Crashed! OOM Error!');
          } else {
            scoreCount += item.points;
            setScore(scoreCount);
            beep?.(880, 'sine');

            if (scoreCount >= 2000) { setLevel(4); setModelSize('70B MoE Params'); }
            else if (scoreCount >= 1000) { setLevel(3); setModelSize('14B Params'); }
            else if (scoreCount >= 400) { setLevel(2); setModelSize('7B Params'); }
          }
        } else if (item.y > H) {
          items.splice(i, 1);
        }
      }

      if (!isDead) raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', onKey);
      clearInterval(spawnInterval);
      cancelAnimationFrame(raf);
    };
  }, [open, gameStarted, gameOver]);

  if (!open) return null;

  const handleStart = () => {
    setScore(0);
    setLevel(1);
    setModelSize('1B Params');
    setGameOver(false);
    setGameStarted(true);
    beep?.(600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box arcade-modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3><i className="fas fa-gamepad" style={{ color: 'var(--accent)' }} /> Cyberpunk AI Arcade: Neural Defender</h3>
          <button className="modal-close" onClick={onClose}><i className="fas fa-times" /></button>
        </div>

        <div className="arcade-status-bar">
          <div>Score: <b style={{ color: 'var(--accent)' }}>{score} FLOPS</b></div>
          <div>Level: <b>LVL {level}</b></div>
          <div>Model Size: <b style={{ color: 'var(--emerald)' }}>{modelSize}</b></div>
        </div>

        <div className="arcade-canvas-wrapper">
          <canvas ref={canvasRef} style={{ borderRadius: '10px', border: '1px solid var(--border)', background: '#030712' }} />

          {(!gameStarted || gameOver) && (
            <div className="arcade-overlay-screen">
              <h2>{gameOver ? '💥 GAME OVER' : '👾 NEURAL DEFENDER'}</h2>
              <p>{gameOver ? `Final Model Capacity: ${modelSize} (${score} FLOPS)` : 'Use ⬅️ Arrow Keys ➡️ to catch Gradient Tokens and avoid OOM Monsters!'}</p>
              <button className="btn-primary" onClick={handleStart} style={{ marginTop: '1rem' }}>
                <i className="fas fa-play" /> {gameOver ? 'Try Again' : 'Start Arcade Game'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
