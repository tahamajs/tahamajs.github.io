// src/components/sections/CodeSandboxSection.jsx
import { useState, useEffect, useRef } from 'react';
import SectionHead from '../ui/SectionHead.jsx';
import { CODE_TABS } from '../../data/codeSnippets.js';

/* --- Interactive Canvas Visualizers with Full Controls --- */

// Flow Matching: Particle Trajectories with custom targets & solvers
function FlowMatchingVis({ playing, steps, solver, targetShape, noiseScale }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    let W = 380, H = 220;
    canvasRef.current.width = W; canvasRef.current.height = H;

    const N = 120;
    const pts = Array.from({length: N}, () => {
      const startX = W/2 + (Math.random()-0.5)*W*0.8;
      const startY = H/2 + (Math.random()-0.5)*H*0.8;
      let targetX = W/2, targetY = H/2;

      if (targetShape === 'circle') {
        const angle = Math.random() * Math.PI * 2;
        targetX = W/2 + Math.cos(angle) * 60;
        targetY = H/2 + Math.sin(angle) * 60;
      } else if (targetShape === 'moon') {
        const t = Math.random() * Math.PI;
        targetX = W/2 + Math.cos(t) * 70 - 20;
        targetY = H/2 + Math.sin(t) * 40 - 20;
      } else if (targetShape === 'spiral') {
        const r = Math.random() * 70;
        const a = r * 0.15;
        targetX = W/2 + Math.cos(a) * r;
        targetY = H/2 + Math.sin(a) * r;
      }

      return { startX, startY, targetX, targetY, t: 0 };
    });

    let frame;
    const dt = 1.0 / steps;
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      let allDone = true;
      pts.forEach(p => {
        if (playing && p.t < 1) p.t += dt * 0.8;
        if (p.t < 1) allDone = false;

        // Integration solver step (Euler vs Midpoint vs RK4 simulation)
        let t = Math.min(1, p.t);
        if (solver === 'Midpoint' && t > 0) t = Math.sin(t * Math.PI / 2); // smooth midpoint curve
        else if (solver === 'RK4' && t > 0) t = t * t * (3 - 2 * t); // smooth RK4 cubic

        const noiseX = (Math.random() - 0.5) * noiseScale * 20;
        const noiseY = (Math.random() - 0.5) * noiseScale * 20;

        const x = p.startX + (p.targetX - p.startX) * t + noiseX;
        const y = p.startY + (p.targetY - p.startY) * t + noiseY;

        ctx.beginPath();
        ctx.moveTo(p.startX, p.startY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.08 * (1 - t)})`;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI*2);
        ctx.fillStyle = `rgba(0, 240, 255, ${0.4 + 0.6 * t})`;
        ctx.fill();
      });
      if (playing && !allDone) frame = requestAnimationFrame(draw);
    };
    draw();
    if (playing) frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [playing, steps, solver, targetShape, noiseScale]);

  return (
    <div className="vis-container">
      <div className="vis-label">Flow Field ({solver} ODE · {steps} steps)</div>
      <canvas ref={canvasRef} style={{ width: '100%', height: '220px' }} />
    </div>
  );
}

// GRPO Alignment: Rollouts & Advantage Normalization
function GRPOVis({ playing, groupSize, klCoeff }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!playing) { setStep(0); return; }
    let s = 0;
    const id = setInterval(() => { s++; setStep(s); if(s > 3) clearInterval(id); }, 700);
    return () => clearInterval(id);
  }, [playing]);

  const rollouts = Array.from({ length: Math.min(groupSize, 6) }, (_, i) => ({
    id: i + 1,
    score: (0.2 + (i / groupSize) * 0.75).toFixed(2),
    isPos: i >= groupSize / 2
  }));

  return (
    <div className="vis-container">
      <div className="vis-label">Group Advantages (G={groupSize} · KL β={klCoeff})</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '20px' }}>
        {rollouts.map(r => (
          <div key={r.id} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            opacity: step >= 1 ? 1 : 0, transition: 'all 0.4s'
          }}>
            <span style={{ fontSize: '11px', color: 'var(--muted)', width: '60px', fontFamily: 'monospace' }}>
              Rollout {r.id}:
            </span>
            <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                width: step >= 2 ? `${r.score * 100}%` : '0%',
                height: '100%',
                background: r.isPos ? 'var(--emerald)' : 'var(--rose)',
                transition: 'width 0.5s ease'
              }} />
            </div>
            {step >= 3 && (
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: r.isPos ? 'var(--emerald)' : 'var(--rose)', width: '45px', fontFamily: 'monospace' }}>
                {r.isPos ? '+Adv' : '-Adv'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// CUDA Reduction Tree
function CUDAReductionVis({ playing, blockSize, precision }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!playing) { setStep(0); return; }
    let s = 0;
    const id = setInterval(() => { s++; setStep(s); if(s > 3) clearInterval(id); }, 500);
    return () => clearInterval(id);
  }, [playing]);

  return (
    <div className="vis-container">
      <div className="vis-label">Tree Shuffle ({precision} · {blockSize} Threads)</div>
      <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '8px', opacity: step >= 0 ? 1 : 0 }}>
          {Array.from({length: 8}).map((_,i) => <div key={i} className="cuda-node" />)}
        </div>
        <div style={{ display: 'flex', gap: '30px', opacity: step >= 1 ? 1 : 0 }}>
          {Array.from({length: 4}).map((_,i) => <div key={i} className="cuda-node active" />)}
        </div>
        <div style={{ display: 'flex', gap: '74px', opacity: step >= 2 ? 1 : 0 }}>
          {Array.from({length: 2}).map((_,i) => <div key={i} className="cuda-node active" />)}
        </div>
        <div style={{ opacity: step >= 3 ? 1 : 0 }}>
          <div className="cuda-node final" />
        </div>
      </div>
    </div>
  );
}

// SVD Attention Vis
function SVDVis({ playing, rank, seqLen }) {
  const memSaved = ((1 - rank / 512) * 100).toFixed(0);
  return (
    <div className="vis-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '15px' }}>
      <div className="vis-label">Low-Rank SVD (N={seqLen} · r={rank})</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div className={`matrix n-by-n ${playing ? 'shrink' : ''}`}>N×N</div>
        <span style={{ color: 'var(--muted)', fontSize: '18px' }}>≈</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <div className="matrix n-by-r" style={{ width: `${Math.max(16, rank/3)}px` }}>N×r</div>
          <div className="matrix r-by-n" style={{ height: `${Math.max(16, rank/3)}px` }}>r×N</div>
        </div>
      </div>
      <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'monospace' }}>
        {playing ? `✓ VRAM Memory Savings: ${memSaved}% (Complexity O(N·r))` : 'Adjust rank slider to test low-rank factorisation'}
      </div>
    </div>
  );
}

// Unlearning Vis
function UnlearningVis({ playing, threshold }) {
  return (
    <div className="vis-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '10px' }}>
      <div className="vis-label">Null-Space Projection (Threshold k={threshold})</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
        <div className={`matrix ${playing ? 'shrink' : ''}`} style={{ width: '80px', height: '50px', background: 'rgba(244,63,94,0.1)', borderColor: 'var(--rose)', color: 'var(--rose)' }}>W</div>
        <span style={{ color: 'var(--accent)' }}>×</span>
        <div className="matrix" style={{ width: '100px', height: '40px', background: 'rgba(0,240,255,0.1)', borderColor: 'var(--cyan)' }}>(I - U_k U_kᵀ)</div>
        <span style={{ color: 'var(--emerald)' }}>=</span>
        <div className="matrix" style={{ width: '80px', height: '50px', background: 'rgba(16,185,129,0.1)', borderColor: 'var(--emerald)', color: 'var(--emerald)' }}>W_clean</div>
      </div>
      <span style={{ fontSize: '11px', color: playing ? 'var(--emerald)' : 'var(--muted)', fontFamily: 'monospace' }}>
        {playing ? `✓ ${threshold} concept dimensions erased from weights` : 'Click Run to project weights onto null-space'}
      </span>
    </div>
  );
}

// IIT Vis
function IITVis({ playing, numNodes }) {
  return (
    <div className="vis-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '10px' }}>
      <div className="vis-label">IIT 4.0 Φ Metric (N={numNodes} Nodes)</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
        <div style={{ border: '1px dashed var(--accent)', padding: '8px', borderRadius: '10px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '4px' }}>
          {Array.from({length: Math.min(numNodes, 6)}).map((_,i) => (
            <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: playing ? 'var(--cyan)' : 'var(--muted)', boxShadow: playing ? '0 0 6px var(--cyan)' : 'none' }} />
          ))}
        </div>
        <div style={{ width: '2px', height: '40px', background: playing ? 'var(--rose)' : 'var(--muted)' }} />
        <div style={{ border: '1px dashed var(--purple)', padding: '8px', borderRadius: '10px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '4px' }}>
          {Array.from({length: Math.min(numNodes, 6)}).map((_,i) => (
            <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: playing ? 'var(--purple)' : 'var(--muted)', boxShadow: playing ? '0 0 6px var(--purple)' : 'none' }} />
          ))}
        </div>
      </div>
      <span style={{ fontSize: '11px', color: 'var(--cyan)', fontFamily: 'monospace' }}>
        {playing ? `Φ = ${(2.389 * (numNodes/16)).toFixed(3)} bits (System Integrated)` : 'Click Run to compute MIP cut'}
      </span>
    </div>
  );
}


/* --- Main Sandbox Component --- */

export default function CodeSandboxSection({ activeTab, setActiveTab, runOutput, setRunOutput, beep }) {
  const tabs = Object.keys(CODE_TABS);
  const data = CODE_TABS[activeTab];
  const [playing, setPlaying] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

  // Parameter controls state
  const [steps, setSteps] = useState(20);
  const [solver, setSolver] = useState('Euler');
  const [targetShape, setTargetShape] = useState('circle');
  const [noiseScale, setNoiseScale] = useState(0.01);

  const [groupSize, setGroupSize] = useState(8);
  const [klCoeff, setKlCoeff] = useState(0.04);

  const [blockSize, setBlockSize] = useState(256);
  const [precision, setPrecision] = useState('FP16');

  const [rank, setRank] = useState(64);
  const [seqLen, setSeqLen] = useState(4096);

  const [threshold, setThreshold] = useState(12);
  const [numNodes, setNumNodes] = useState(16);

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
    <section id="sandbox" className={`section fade-up ${fullScreen ? 'sandbox-fullscreen-mode' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <SectionHead
          tag="Interactive AI Laboratory"
          title="Explore Frontier Algorithms 🧪"
          sub="Adjust hyper-parameters, run ODE trajectories, and simulate CUDA warp reductions in real-time."
        />
        <button
          className="btn-secondary"
          onClick={() => { setFullScreen(!fullScreen); beep?.(); }}
          style={{ marginTop: '1rem', whiteSpace: 'nowrap' }}>
          <i className={`fas ${fullScreen ? 'fa-compress' : 'fa-expand'}`} /> {fullScreen ? 'Exit Fullscreen' : 'Fullscreen Lab'}
        </button>
      </div>
      
      <div className="sandbox-grid">
        
        {/* Left: Code & Terminal */}
        <div className="terminal sandbox-left">
          <div className="t-bar">
            <div className="t-dots">
              <div className="t-dot r" onClick={() => setFullScreen(false)} /><div className="t-dot y" /><div className="t-dot g" />
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
          </div>

          <div className="t-body">
            <div className="t-code">{data.code}</div>
            <button className="t-run-btn" onClick={handleRun} disabled={playing && runOutput.split('\n').length < data.output.split('\n').length}>
              <i className="fas fa-play" /> {playing ? 'Executing...' : 'Run Simulation'}
            </button>
            {runOutput && <div className="t-output">{runOutput}</div>}
          </div>
        </div>

        {/* Right: Educational Visualizer, Control Sliders & Explanation */}
        <div className="sandbox-right">
          <div className="sandbox-visualizer">
            {activeTab === 'flow' && <FlowMatchingVis playing={playing} steps={steps} solver={solver} targetShape={targetShape} noiseScale={noiseScale} />}
            {activeTab === 'grpo' && <GRPOVis playing={playing} groupSize={groupSize} klCoeff={klCoeff} />}
            {activeTab === 'cuda' && <CUDAReductionVis playing={playing} blockSize={blockSize} precision={precision} />}
            {activeTab === 'svd' && <SVDVis playing={playing} rank={rank} seqLen={seqLen} />}
            {activeTab === 'unlearning' && <UnlearningVis playing={playing} threshold={threshold} />}
            {activeTab === 'iit' && <IITVis playing={playing} numNodes={numNodes} />}
            {!playing && (
              <div className="vis-overlay-play" onClick={handleRun}>
                <i className="fas fa-play-circle" />
                <span>Click to animate</span>
              </div>
            )}
          </div>

          {/* Interactive Control Panel for Sliders & Parameters */}
          <div className="sandbox-controls-panel">
            <div className="controls-panel-title">
              <i className="fas fa-sliders-h" style={{ color: 'var(--accent)' }} /> Interactive Hyper-parameter Controls
            </div>
            {activeTab === 'flow' && (
              <div className="controls-row">
                <div className="ctrl-group">
                  <label>ODE Steps: {steps}</label>
                  <input type="range" min={5} max={50} value={steps} onChange={e => setSteps(Number(e.target.value))} />
                </div>
                <div className="ctrl-group">
                  <label>Solver</label>
                  <select value={solver} onChange={e => setSolver(e.target.value)}>
                    <option value="Euler">Euler</option>
                    <option value="Midpoint">Midpoint</option>
                    <option value="RK4">RK4</option>
                  </select>
                </div>
                <div className="ctrl-group">
                  <label>Target Shape</label>
                  <select value={targetShape} onChange={e => setTargetShape(e.target.value)}>
                    <option value="circle">Circle</option>
                    <option value="moon">Double Moon</option>
                    <option value="spiral">Spiral</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'grpo' && (
              <div className="controls-row">
                <div className="ctrl-group">
                  <label>Group Rollouts G: {groupSize}</label>
                  <input type="range" min={2} max={16} step={2} value={groupSize} onChange={e => setGroupSize(Number(e.target.value))} />
                </div>
                <div className="ctrl-group">
                  <label>KL Coeff β: {klCoeff}</label>
                  <input type="range" min={0.01} max={0.1} step={0.01} value={klCoeff} onChange={e => setKlCoeff(Number(e.target.value))} />
                </div>
              </div>
            )}

            {activeTab === 'cuda' && (
              <div className="controls-row">
                <div className="ctrl-group">
                  <label>Threads / Block: {blockSize}</label>
                  <select value={blockSize} onChange={e => setBlockSize(Number(e.target.value))}>
                    <option value={128}>128 threads</option>
                    <option value={256}>256 threads</option>
                    <option value={512}>512 threads</option>
                  </select>
                </div>
                <div className="ctrl-group">
                  <label>Precision</label>
                  <select value={precision} onChange={e => setPrecision(e.target.value)}>
                    <option value="FP16">FP16</option>
                    <option value="BF16">BF16</option>
                    <option value="FP8">FP8 E4M3</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'svd' && (
              <div className="controls-row">
                <div className="ctrl-group">
                  <label>SVD Rank r: {rank}</label>
                  <input type="range" min={16} max={128} step={16} value={rank} onChange={e => setRank(Number(e.target.value))} />
                </div>
                <div className="ctrl-group">
                  <label>Seq Length N: {seqLen}</label>
                  <select value={seqLen} onChange={e => setSeqLen(Number(e.target.value))}>
                    <option value={2048}>2,048 tokens</option>
                    <option value={4096}>4,096 tokens</option>
                    <option value={16384}>16,384 tokens</option>
                    <option value={65536}>65,536 tokens</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'unlearning' && (
              <div className="controls-row">
                <div className="ctrl-group">
                  <label>Null-Space Rank k: {threshold}</label>
                  <input type="range" min={2} max={24} value={threshold} onChange={e => setThreshold(Number(e.target.value))} />
                </div>
              </div>
            )}

            {activeTab === 'iit' && (
              <div className="controls-row">
                <div className="ctrl-group">
                  <label>Cognitive Nodes N: {numNodes}</label>
                  <input type="range" min={8} max={32} step={4} value={numNodes} onChange={e => setNumNodes(Number(e.target.value))} />
                </div>
              </div>
            )}
          </div>

          <div className="sandbox-tutorial">
            <h4><i className="fas fa-graduation-cap" /> Deep Dive Learning</h4>
            {activeTab === 'flow' && (
              <p><b>Conditional Flow Matching (CFM)</b> provides a simulation-free approach to training Continuous Normalizing Flows. Unlike Diffusion models that rely on complex noise schedules (SDEs), CFM directly regresses a vector field <i>v_θ(t, x)</i> pointing from a pure noise distribution <i>x₀ ~ N(0, I)</i> directly to the data distribution <i>x₁ ~ q(x₁)</i>. This allows for straight trajectories, requiring far fewer integration steps (e.g., {steps}) during inference using simple ODE solvers like {solver}.</p>
            )}
            {activeTab === 'grpo' && (
              <p><b>Group Relative Policy Optimization (GRPO)</b> eliminates the massive memory overhead of standard PPO by completely removing the need for an external Critic network. Instead of estimating absolute value functions, GRPO samples a <i>group</i> of <i>G={groupSize}</i> responses (rollouts) for a given prompt, scores them via a lightweight Reward Model, and normalizes the rewards <b>relative to that specific group</b> to compute advantages with KL coefficient β={klCoeff}.</p>
            )}
            {activeTab === 'cuda' && (
              <p><b>Fused CUDA Kernels</b> are critical for maximizing throughput in distributed LLM training. The <code>fused_allreduce_scale_fp16</code> kernel above bypasses expensive global memory round-trips using precision {precision} and {blockSize} threads per block. By utilizing <i>thread shuffle instructions</i> (<code>__shfl_xor_sync</code>), it performs gradient scaling and warp-level tree reductions directly in ultra-fast registers before atomic accumulation.</p>
            )}
            {activeTab === 'svd' && (
              <p><b>Linear Attention</b> solves the <i>O(N²)</i> sequence length bottleneck of the standard Transformer self-attention mechanism on sequences of N={seqLen}. By applying the kernel trick <i>exp(q · k) ≈ φ(q)^T φ(k)</i> (where <i>φ</i> represents a low-rank SVD projection with rank r={rank}), we can fundamentally alter the computation order from <i>(Q K^T) V</i> to <i>Q (K^T V)</i>. This mathematically reduces computational complexity and VRAM usage to <i>O(N · {rank})</i>.</p>
            )}
            {activeTab === 'unlearning' && (
              <p><b>Machine Unlearning &amp; Concept Erasure</b> removes copyrighted or sensitive concepts from trained model weights without full retraining. By computing singular value decomposition (SVD) on concept representations with rank threshold k={threshold}, we construct a <i>Null-Space Projection Matrix (I - U_k U_kᵀ)</i>. Multiplying model weights by this matrix completely zeroes out activation components along the target concept dimensions.</p>
            )}
            {activeTab === 'iit' && (
              <p><b>Integrated Information Theory (IIT 4.0)</b> quantifies synthetic consciousness and cognitive integration across N={numNodes} cognitive nodes via the <b>Φ (Phi) metric</b>. By evaluating the Effective Information (EI) of the system as a whole versus the sum of its Minimum Information Partition (MIP) cuts, Φ measures how irreducibly integrated a cognitive network is.</p>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
