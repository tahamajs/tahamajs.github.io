// src/components/modals/AlgorithmGameModal.jsx
import { useState, useEffect, useRef } from 'react';
import Modal from '../ui/Modal.jsx';

const ALGO_LEVELS = [
  {
    id: 'flow',
    title: 'Level 1: Flow Matching Velocity Field 🌊',
    algo: 'Conditional Flow Matching (Lipman et al.)',
    task: 'Select the optimal ODE integration solver to reach the target data distribution with minimum function evaluations (NFE):',
    formula: '\\mathcal{L}_{CFM}(\\theta) = \\mathbb{E}_{t, q(z), p_t(x|z)} \\| v_\\theta(x, t) - u_t(x|z) \\|^2',
    options: [
      { text: 'Euler Solver (NFE=50)', correct: false, exp: 'Euler works but requires 50+ steps for curved paths.' },
      { text: 'Optimal Transport Straight Path + Midpoint (NFE=15)', correct: true, exp: 'Correct! OT straight paths allow simulation-free ODE integration in just 15 steps!' },
      { text: 'SDE Noise Schedule Diffusion (NFE=1000)', correct: false, exp: 'Diffusion SDEs are far too slow compared to CFM.' },
    ]
  },
  {
    id: 'grpo',
    title: 'Level 2: GRPO Policy Alignment 🎯',
    algo: 'Group Relative Policy Optimization (DeepSeek R1)',
    task: 'For a prompt group of G=4 rollouts with rewards [0.9, 0.2, 0.8, 0.1], which rollout receives the highest positive advantage A_i?',
    formula: 'A_i = \\frac{r_i - \\text{mean}(\\{r_j\\})}{\\text{std}(\\{r_j\\}) + \\epsilon}',
    options: [
      { text: 'Rollout 1 (Reward = 0.9)', correct: true, exp: 'Correct! Rollout 1 exceeds the group mean μ_r=0.5, giving it the maximum positive advantage +Adv!' },
      { text: 'Rollout 4 (Reward = 0.1)', correct: false, exp: 'Incorrect. Reward 0.1 is below average, resulting in negative advantage -Adv.' },
      { text: 'All rollouts receive equal advantage', correct: false, exp: 'Incorrect. GRPO normalizes advantages relative to group mean and std.' },
    ]
  },
  {
    id: 'cuda',
    title: 'Level 3: CUDA Warp Tree Reduction ⚡',
    algo: 'Fused CUDA Warp Reduction Kernel',
    task: 'In a 32-thread CUDA warp executing __shfl_xor_sync(mask, val, delta), what offset delta is used in the first reduction step?',
    formula: '\\text{val} += \\text{__shfl\\_xor\\_sync}(0\\text{xffffffff}, \\text{val}, 16)',
    options: [
      { text: 'delta = 1', correct: false, exp: 'delta=1 is the final step in a warp tree reduction.' },
      { text: 'delta = 16 (WARP / 2)', correct: true, exp: 'Correct! Thread 0 pairs with Thread 16, Thread 1 pairs with Thread 17 down to delta=1!' },
      { text: 'delta = 32', correct: false, exp: 'delta=32 is outside the 32-thread warp bounds.' },
    ]
  },
  {
    id: 'svd',
    title: 'Level 4: Linear SVD Attention 📐',
    algo: 'Sub-Quadratic Linear Attention (Katharopoulos et al.)',
    task: 'On a sequence of length N=65,536 tokens, how does Linear SVD Attention avoid the O(N²) memory bottleneck?',
    formula: 'O(N^2 d) \\longrightarrow O(N d r)',
    options: [
      { text: 'By computing (Q K^T) V softmax matrix first', correct: false, exp: 'Materializing (Q K^T) creates a massive 65536×65536 matrix (O(N²)).' },
      { text: 'By re-associating to Q (K^T V) using SVD rank r projection', correct: true, exp: 'Correct! Multiplying K^T @ V first reduces memory complexity from O(N²) down to O(N·r)!' },
      { text: 'By dropping 90% of tokens randomly', correct: false, exp: 'Dropping tokens destroys context quality.' },
    ]
  },
  {
    id: 'unlearning',
    title: 'Level 5: Null-Space Machine Unlearning 🧹',
    algo: 'Concept Erasure via Null-Space Projection',
    task: 'To erase a sensitive concept representation U_k from weight matrix W, which projection matrix is applied?',
    formula: 'W_{\\text{clean}} = W \\left(I - U_k U_k^T\\right)',
    options: [
      { text: 'W_clean = W (I - U_k U_k^T)', correct: true, exp: 'Correct! Multiplying by (I - U_k U_k^T) projects weights onto the null-space, zeroing out concept activations!' },
      { text: 'W_clean = W + U_k', correct: false, exp: 'Adding concept vectors amplifies the target concept.' },
      { text: 'W_clean = 0', correct: false, exp: 'Zeroing out all weights destroys all model capabilities.' },
    ]
  },
  {
    id: 'iit',
    title: 'Level 6: Integrated Information Φ 🧠',
    algo: 'Integrated Information Theory (IIT 4.0)',
    task: 'What condition indicates that a synthetic cognitive network possesses irreducibly integrated cause-effect power?',
    formula: '\\Phi = \\min_{P \\in \\text{MIP}} D_{KL}\\left(p_{\\text{whole}} \\parallel p_P\\right) > 0',
    options: [
      { text: 'Φ > 0.0 (EI of Whole > EI of Minimum Information Partition)', correct: true, exp: 'Correct! Φ > 0 proves the system as a whole generates more cause-effect info than its MIP cut!' },
      { text: 'Φ = 0.0', correct: false, exp: 'Φ = 0 means the system is completely reducible to independent parts.' },
      { text: 'Φ < 0.0', correct: false, exp: 'Φ is non-negative by definition.' },
    ]
  }
];

export default function AlgorithmGameModal({ open, onClose, showToast, beep }) {
  const [levelIdx, setLevelIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const canvasRef = useRef(null);

  const currentLevel = ALGO_LEVELS[levelIdx];

  // Animated simulation visualizer on canvas
  useEffect(() => {
    if (!open || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frameId;
    let t = 0;

    const render = () => {
      t += 0.03;
      const W = canvas.width = 380;
      const H = canvas.height = 140;
      ctx.clearRect(0, 0, W, H);

      // Background grid
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }

      if (levelIdx === 0) {
        // Flow Matching straight trajectories
        for (let i = 0; i < 8; i++) {
          const x0 = 30, y0 = 20 + i * 14;
          const x1 = W - 30, y1 = 30 + (i * 13) % 90;
          ctx.strokeStyle = `hsl(${180 + i * 15}, 100%, 50%)`;
          ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();

          // Particle moving along trajectory
          const p = (t + i * 0.15) % 1;
          const px = x0 + (x1 - x0) * p;
          const py = y0 + (y1 - y0) * p;
          ctx.fillStyle = '#00f0ff';
          ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
        }
      } else if (levelIdx === 1) {
        // GRPO group reward bars
        const rewards = [0.9, 0.2, 0.8, 0.1];
        rewards.forEach((r, idx) => {
          const bw = 50, bh = r * 90;
          const bx = 40 + idx * 80, by = H - 20 - bh;
          ctx.fillStyle = idx === 0 ? '#10b981' : idx === 3 ? '#f43f5e' : '#a78bfa';
          ctx.fillRect(bx, by, bw, bh);
          ctx.fillStyle = '#fff'; ctx.font = '11px monospace';
          ctx.fillText(`G${idx + 1}: ${r}`, bx + 6, by - 6);
        });
      } else if (levelIdx === 2) {
        // CUDA Warp reduction tree
        for (let th = 0; th < 16; th++) {
          const tx = 20 + th * 22;
          ctx.fillStyle = th % 2 === 0 ? '#00f0ff' : '#a78bfa';
          ctx.beginPath(); ctx.arc(tx, 40, 6, 0, Math.PI * 2); ctx.fill();
          if (th < 8) {
            ctx.strokeStyle = 'rgba(0,240,255,0.4)';
            ctx.beginPath(); ctx.moveTo(tx, 40); ctx.lineTo(tx + 176, 40); ctx.stroke();
          }
        }
      } else {
        // SVD / Null Space matrix wave
        ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < W; x += 4) {
          const y = H / 2 + Math.sin(x * 0.05 + t) * 30 * Math.cos(t * 0.5);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      frameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frameId);
  }, [open, levelIdx]);

  if (!open) return null;

  const handleSelect = (optIdx) => {
    if (answered) return;
    setSelectedOpt(optIdx);
    setAnswered(true);
    const isCorrect = currentLevel.options[optIdx].correct;

    if (isCorrect) {
      beep?.(880, 'sine', 0.04, 'chime');
      setScore(s => s + 500);
    } else {
      beep?.(220, 'sawtooth');
    }
  };

  const handleNext = () => {
    if (levelIdx < ALGO_LEVELS.length - 1) {
      setLevelIdx(l => l + 1);
      setSelectedOpt(null);
      setAnswered(false);
      beep?.(700);
    } else {
      beep?.(1000, 'sine', 0.05, 'chime');
      showToast?.(`🏆 ALGORITHM MASTER CERTIFICATE EARNED! Final Score: ${score} XP`);
      setLevelIdx(0);
      setScore(0);
      setSelectedOpt(null);
      setAnswered(false);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} wide={true}>
      <div className="section-tag">🎮 Interactive AI Algorithm Quest</div>
      <h2 style={{ color: '#fff', marginBottom: '.3rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
        AI Algorithm Quest 🧪
      </h2>

      <div className="algo-game-progress" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '.8rem 0', background: 'rgba(0,0,0,0.3)', padding: '.6rem 1rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
        <span style={{ color: 'var(--accent)', fontWeight: 600, fontFamily: 'monospace' }}>Level {levelIdx + 1} of {ALGO_LEVELS.length}</span>
        <span style={{ color: 'var(--emerald)', fontWeight: 700, fontFamily: 'monospace', fontSize: '1.05rem' }}>Score: {score} / 3000 XP</span>
      </div>

      <div className="algo-game-card" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '1.2rem', borderRadius: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.6rem' }}>
          <span className="algo-game-algo-badge" style={{ background: 'rgba(0,240,255,0.1)', color: 'var(--cyan)', padding: '.25rem .7rem', borderRadius: '20px', fontSize: '.75rem', fontFamily: 'monospace' }}>
            {currentLevel.algo}
          </span>
          <span style={{ fontSize: '.75rem', color: 'var(--muted)' }}>Simulation Active</span>
        </div>

        <h3 className="algo-game-title" style={{ color: '#fff', fontSize: '1.2rem', margin: '.4rem 0' }}>{currentLevel.title}</h3>
        <p className="algo-game-task" style={{ color: 'var(--text)', fontSize: '.9rem', lineHeight: '1.5', marginBottom: '1rem' }}>{currentLevel.task}</p>

        {/* Live Simulation Canvas */}
        <div style={{ textAlign: 'center', marginBottom: '1rem', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '.5rem', border: '1px solid var(--border)' }}>
          <canvas ref={canvasRef} style={{ width: '100%', maxHeight: '140px', borderRadius: '8px' }} />
        </div>

        {/* Option Cards */}
        <div className="algo-options" style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
          {currentLevel.options.map((opt, idx) => {
            let stateClass = '';
            if (answered) {
              if (opt.correct) stateClass = 'correct';
              else if (selectedOpt === idx) stateClass = 'wrong';
            }
            return (
              <button
                key={idx}
                className={`algo-opt-btn ${selectedOpt === idx ? 'selected' : ''} ${stateClass}`}
                disabled={answered}
                onClick={() => handleSelect(idx)}
                style={{
                  textAlign: 'left',
                  padding: '.8rem 1rem',
                  borderRadius: '10px',
                  background: stateClass === 'correct' ? 'rgba(16,185,129,0.15)' : stateClass === 'wrong' ? 'rgba(244,63,94,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${stateClass === 'correct' ? 'var(--emerald)' : stateClass === 'wrong' ? '#f43f5e' : 'rgba(255,255,255,0.1)'}`,
                  color: '#fff',
                  cursor: answered ? 'default' : 'pointer',
                  transition: 'all .2s'
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '.88rem' }}>{opt.text}</div>
                {answered && (opt.correct || selectedOpt === idx) && (
                  <div style={{ fontSize: '.78rem', marginTop: '.4rem', color: opt.correct ? 'var(--emerald)' : '#f43f5e' }}>
                    {opt.exp}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {answered && (
          <button
            className="btn-primary"
            onClick={handleNext}
            style={{ width: '100%', marginTop: '1.2rem', padding: '.75rem', fontWeight: 700 }}
          >
            {levelIdx < ALGO_LEVELS.length - 1 ? 'Next Level ➔' : 'Claim Master Certificate 🏆'}
          </button>
        )}
      </div>
    </Modal>
  );
}
