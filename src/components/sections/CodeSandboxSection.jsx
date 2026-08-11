// src/components/sections/CodeSandboxSection.jsx
import { useState } from 'react';
import SectionHead from '../ui/SectionHead.jsx';
import { CODE_TABS } from '../../data/codeSnippets.js';

export default function CodeSandboxSection({ activeTab, setActiveTab, runOutput, setRunOutput, beep }) {
  const tabs = Object.keys(CODE_TABS);
  const data = CODE_TABS[activeTab];

  const handleRun = () => {
    setRunOutput('');
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
        tag="Interactive Lab"
        title="Interactive <b>AI Research Sandbox</b> 🧪"
        sub="Explore and execute core implementations of Flow Matching ODEs, GRPO alignment, and CUDA kernels directly in the browser. Learn how these frontier architectures are built from first principles."
      />
      <div className="terminal">
        <div className="t-bar">
          <div className="t-dots">
            <div className="t-dot r" /><div className="t-dot y" /><div className="t-dot g" />
          </div>
          <div className="t-tabs">
            {tabs.map(k => (
              <button key={k}
                className={`t-tab ${activeTab === k ? 'active' : ''}`}
                onClick={() => { setActiveTab(k); setRunOutput(''); beep?.(); }}>
                {CODE_TABS[k].label}
              </button>
            ))}
          </div>
          <div className="t-label">~/hoosha-ai/research/{activeTab}.{activeTab === 'cuda' ? 'cu' : 'py'}</div>
        </div>

        <div className="t-body">
          <div className="t-code">{data.code}</div>
          <button className="t-run-btn" onClick={handleRun}>
            <i className="fas fa-play" /> Execute Simulation
          </button>
          {runOutput && <div className="t-output">{runOutput}</div>}
          
          <div className="sandbox-tutorial">
            <h4><i className="fas fa-graduation-cap" /> Deep Dive Learning</h4>
            {activeTab === 'flow' && (
              <p><b>Conditional Flow Matching (CFM)</b> provides a simulation-free approach to training Continuous Normalizing Flows. Unlike Diffusion models that rely on SDEs with complex noise schedules, CFM directly regresses a vector field <i>v_θ(t, x)</i> pointing from a noise distribution <i>x₀ ~ N(0, I)</i> to the data distribution <i>x₁ ~ q(x₁)</i>. This allows for straight paths, requiring far fewer integration steps (e.g., 20) during inference using simple ODE solvers like Euler.</p>
            )}
            {activeTab === 'grpo' && (
              <p><b>Group Relative Policy Optimization (GRPO)</b> eliminates the need for an external Critic network used in PPO. Instead of estimating value functions, GRPO samples a <i>group</i> of <i>G</i> responses for a prompt, scores them via a Reward Model, and normalizes the rewards within that specific group to compute advantages. This massively reduces VRAM overhead, enabling RLHF/alignment training of large models like Qwen-4B on constrained clusters.</p>
            )}
            {activeTab === 'cuda' && (
              <p><b>Fused CUDA Kernels</b> are critical for distributed LLM training. The <code>fused_allreduce_scale_fp16</code> kernel above bypasses expensive global memory round-trips by performing gradient scaling (dividing by world size) and warp-level reductions directly in registers and shared memory before atomic accumulation. This achieves near-theoretical peak bandwidth on A100 SXM4 architecture.</p>
            )}
            {activeTab === 'svd' && (
              <p><b>Linear Attention</b> solves the <i>O(N²)</i> sequence length bottleneck of standard Transformer attention. By applying the kernel trick <i>exp(q · k) ≈ φ(q)^T φ(k)</i> (where <i>φ</i> represents a low-rank SVD projection), we can change the computation order from <i>(Q K^T) V</i> to <i>Q (K^T V)</i>. This reduces computational complexity and memory usage to <i>O(N · r)</i>, making infinite-context LLMs possible.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
