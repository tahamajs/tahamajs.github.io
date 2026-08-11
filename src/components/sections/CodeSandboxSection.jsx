// src/components/sections/CodeSandboxSection.jsx
import { useState, useEffect, useRef } from 'react';
import SectionHead from '../ui/SectionHead.jsx';
import { CODE_TABS } from '../../data/codeSnippets.js';

/* --- Animated Visualizers --- */

// Flow Matching: Particles moving from random noise to a target distribution (a circle)
function FlowMatchingVis({ playing }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!playing) return;
    const ctx = canvasRef.current.getContext('2d');
    let W = 300, H = 200;
    canvasRef.current.width = W; canvasRef.current.height = H;
    
    // N particles: start at random noise, target is a circle
    const N = 80;
    const pts = Array.from({length: N}, () => {
      const startX = W/2 + (Math.random()-0.5)*W*0.8;
      const startY = H/2 + (Math.random()-0.5)*H*0.8;
      const angle = Math.random() * Math.PI * 2;
      const targetX = W/2 + Math.cos(angle) * 50;
      const targetY = H/2 + Math.sin(angle) * 50;
      return { startX, startY, targetX, targetY, t: 0 };
    });

    let frame;
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      let allDone = true;
      pts.forEach(p => {
        if (p.t < 1) p.t += 0.01;
        if (p.t < 1) allDone = false;
        // Linear interpolation (straight paths in Flow Matching)
        const x = p.startX + (p.targetX - p.startX) * p.t;
        const y = p.startY + (p.targetY - p.startY) * p.t;
        
        ctx.beginPath();
        // Draw path trail
        ctx.moveTo(p.startX, p.startY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 * (1-p.t)})`;
        ctx.stroke();

        // Draw particle
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI*2);
        ctx.fillStyle = `rgba(0, 240, 255, ${0.3 + 0.7*p.t})`;
        ctx.fill();
      });
      if (!allDone) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  return (
    <div className="vis-container">
      <div className="vis-label">Flow Trajectories (x₀ → x₁)</div>
      <canvas ref={canvasRef} style={{ width: '100%', height: '200px' }} />
    </div>
  );
}

// GRPO: Generating rollouts, scoring them, and updating policy
function GRPOVis({ playing }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!playing) { setStep(0); return; }
    let s = 0;
    const id = setInterval(() => { s++; setStep(s); if(s>3) clearInterval(id); }, 800);
    return () => clearInterval(id);
  }, [playing]);

  const rollouts = [
    { id: 1, val: 0.1, color: '#f43f5e', text: 'x = 5' },
    { id: 2, val: 0.9, color: '#10b981', text: '\\boxed{42}' },
    { id: 3, val: 0.4, color: '#fbbf24', text: '42' },
    { id: 4, val: 0.8, color: '#10b981', text: '\\boxed{42}' },
  ];

  return (
    <div className="vis-container">
      <div className="vis-label">Group Relative Advantages</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' }}>
        {rollouts.map((r, i) => (
          <div key={r.id} style={{ 
            display: 'flex', alignItems: 'center', gap: '10px',
            opacity: step >= 1 ? 1 : 0, transition: 'all 0.5s', transitionDelay: `${i*0.1}s`
          }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px' }}>
              Output {r.id}: {r.text}
            </div>
            {step >= 2 && (
              <div style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${r.val*100}%`, height: '100%', background: r.color, transition: 'width 0.5s' }} />
              </div>
            )}
            {step >= 3 && (
              <div style={{ fontSize: '11px', color: r.val > 0.5 ? '#10b981' : '#f43f5e', width: '40px', fontWeight: 'bold' }}>
                {r.val > 0.5 ? '+Adv' : '-Adv'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// CUDA: Warp-level parallel reduction tree
function CUDAReductionVis({ playing }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!playing) { setStep(0); return; }
    let s = 0;
    const id = setInterval(() => { s++; setStep(s); if(s>3) clearInterval(id); }, 600);
    return () => clearInterval(id);
  }, [playing]);

  return (
    <div className="vis-container">
      <div className="vis-label">Warp-Level Reduction (Thread Shfl)</div>
      <div className="cuda-tree" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
        {/* Level 0: 8 threads */}
        <div style={{ display: 'flex', gap: '10px', opacity: step >= 0 ? 1 : 0, transition: 'opacity 0.3s' }}>
          {Array.from({length: 8}).map((_,i) => <div key={i} className="cuda-node" />)}
        </div>
        {/* Level 1: 4 threads */}
        <div style={{ display: 'flex', gap: '34px', opacity: step >= 1 ? 1 : 0, transition: 'opacity 0.3s' }}>
          {Array.from({length: 4}).map((_,i) => <div key={i} className="cuda-node active" />)}
        </div>
        {/* Level 2: 2 threads */}
        <div style={{ display: 'flex', gap: '82px', opacity: step >= 2 ? 1 : 0, transition: 'opacity 0.3s' }}>
          {Array.from({length: 2}).map((_,i) => <div key={i} className="cuda-node active" />)}
        </div>
        {/* Level 3: 1 thread */}
        <div style={{ display: 'flex', opacity: step >= 3 ? 1 : 0, transition: 'opacity 0.3s' }}>
          <div className="cuda-node final" />
        </div>
      </div>
    </div>
  );
}

// SVD: Matrix factorization N^2 -> N*r
function SVDVis({ playing }) {
  return (
    <div className="vis-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: '20px' }}>
      <div className="vis-label">Low-Rank Attention Complexity</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {/* N x N Matrix */}
        <div className={`matrix n-by-n ${playing ? 'shrink' : ''}`}>N × N</div>
        
        <div style={{ color: 'var(--muted)', fontSize: '20px', opacity: playing ? 1 : 0, transition: 'opacity 0.5s' }}>≈</div>
        
        {/* N x r and r x N */}
        <div style={{ display: 'flex', gap: '5px', opacity: playing ? 1 : 0, transition: 'opacity 0.5s' }}>
          <div className="matrix n-by-r">N×r</div>
          <div className="matrix r-by-n">r×N</div>
        </div>
      </div>
      <div style={{ fontSize: '12px', color: 'var(--accent)', opacity: playing ? 1 : 0, transition: 'opacity 0.5s 0.3s' }}>
        Memory reduced from 7.8GB to 1.2GB!
      </div>
    </div>
  );
}


/* --- Main Component --- */

export default function CodeSandboxSection({ activeTab, setActiveTab, runOutput, setRunOutput, beep }) {
  const tabs = Object.keys(CODE_TABS);
  const data = CODE_TABS[activeTab];
  const [playing, setPlaying] = useState(false);

  // Reset state on tab change
  useEffect(() => {
    setPlaying(false);
    setRunOutput('');
  }, [activeTab, setRunOutput]);

  const handleRun = () => {
    setRunOutput('');
    setPlaying(true);
    beep?.(600, 'square');
    let idx = 0;
    const lines = data.output.split('\n');
    const timer = setInterval(() => {
      setRunOutput(p => p + (p ? '\n' : '') + lines[idx]);
      idx++;
      if (idx >= lines.length) {
        clearInterval(timer);
        beep?.(880, 'sine', 0.05);
      }
    }, 150);
  };

  return (
    <section id="sandbox" className="section fade-up">
      <SectionHead
        tag="Interactive AI Lab"
        title="Explore Core Algorithms 🧪"
        sub="Execute Python and CUDA kernels directly in the browser. Watch the real-time visualizers to actively learn how these frontier architectures function under the hood."
      />
      
      <div className="sandbox-grid">
        
        {/* Left: Code & Terminal */}
        <div className="terminal sandbox-left">
          <div className="t-bar">
            <div className="t-dots">
              <div className="t-dot r" /><div className="t-dot y" /><div className="t-dot g" />
            </div>
            <div className="t-tabs">
              {tabs.map(k => (
                <button key={k}
                  className={`t-tab ${activeTab === k ? 'active' : ''}`}
                  onClick={() => { setActiveTab(k); beep?.(); }}>
                  {CODE_TABS[k].label}
                </button>
              ))}
            </div>
            <div className="t-label" style={{ display: 'none' }}>~/hoosha-ai/{activeTab}.{activeTab === 'cuda' ? 'cu' : 'py'}</div>
          </div>

          <div className="t-body">
            <div className="t-code">{data.code}</div>
            <button className="t-run-btn" onClick={handleRun} disabled={playing && runOutput.split('\n').length < data.output.split('\n').length}>
              <i className="fas fa-play" /> {playing ? 'Executing...' : 'Run Simulation'}
            </button>
            {runOutput && <div className="t-output">{runOutput}</div>}
          </div>
        </div>

        {/* Right: Educational Visualizer & Explanation */}
        <div className="sandbox-right">
          <div className="sandbox-visualizer">
            {activeTab === 'flow' && <FlowMatchingVis playing={playing} />}
            {activeTab === 'grpo' && <GRPOVis playing={playing} />}
            {activeTab === 'cuda' && <CUDAReductionVis playing={playing} />}
            {activeTab === 'svd' && <SVDVis playing={playing} />}
            {!playing && (
              <div className="vis-overlay-play" onClick={handleRun}>
                <i className="fas fa-play-circle" />
                <span>Click to animate</span>
              </div>
            )}
          </div>

          <div className="sandbox-tutorial">
            <h4><i className="fas fa-graduation-cap" /> Deep Dive Learning</h4>
            {activeTab === 'flow' && (
              <p><b>Conditional Flow Matching (CFM)</b> provides a simulation-free approach to training Continuous Normalizing Flows. Unlike Diffusion models that rely on complex noise schedules (SDEs), CFM directly regresses a vector field <i>v_θ(t, x)</i> pointing from a pure noise distribution <i>x₀ ~ N(0, I)</i> directly to the data distribution <i>x₁ ~ q(x₁)</i>. This allows for straight trajectories, requiring far fewer integration steps (e.g., 20) during inference using simple ODE solvers like Euler. The animation above demonstrates how straight-path interpolation cleanly maps noise to a target structure.</p>
            )}
            {activeTab === 'grpo' && (
              <p><b>Group Relative Policy Optimization (GRPO)</b> eliminates the massive memory overhead of standard PPO by completely removing the need for an external Critic network. Instead of estimating absolute value functions, GRPO samples a <i>group</i> of <i>G</i> responses (rollouts) for a given prompt, scores them via a lightweight Reward Model, and normalizes the rewards <b>relative to that specific group</b> to compute advantages. This enables RLHF/alignment training of large models like Qwen-4B on constrained clusters.</p>
            )}
            {activeTab === 'cuda' && (
              <p><b>Fused CUDA Kernels</b> are critical for maximizing throughput in distributed LLM training. The <code>fused_allreduce_scale_fp16</code> kernel above bypasses expensive global memory round-trips. By utilizing <i>thread shuffle instructions</i> (<code>__shfl_xor_sync</code>), it performs gradient scaling and warp-level tree reductions directly in ultra-fast registers before atomic accumulation. This achieves near-theoretical peak bandwidth on A100 SXM4 architecture.</p>
            )}
            {activeTab === 'svd' && (
              <p><b>Linear Attention</b> solves the <i>O(N²)</i> sequence length bottleneck of the standard Transformer self-attention mechanism. By applying the kernel trick <i>exp(q · k) ≈ φ(q)^T φ(k)</i> (where <i>φ</i> represents a low-rank SVD projection with rank <i>r</i>), we can fundamentally alter the computation order from <i>(Q K^T) V</i> to <i>Q (K^T V)</i>. This mathematically reduces computational complexity and VRAM usage to <i>O(N · r)</i>, unlocking the potential for infinite-context language models.</p>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
