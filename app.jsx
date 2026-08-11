const { useState, useEffect, useMemo, useRef, useCallback } = React;

/* ─── helper: safely get first line of hf code snippet ─── */
const firstLine = (val) => String(val == null ? '' : val).split('\n')[0];

/* ─── helper: safe pluralise ─── */
const n = (num, label) => `${num.toLocaleString()} ${label}`;

function App() {
  /* ── data ── */
  const [data, setData] = useState({ repos: [], articles: [], hf: [] });

  /* ── ui state ── */
  const [search, setSearch]                 = useState('');
  const [filter, setFilter]                 = useState('all');
  const [hfFilter, setHfFilter]             = useState('all');
  const [substackSearch, setSubstackSearch] = useState('');
  const [viewMode, setViewMode]             = useState('bento');
  const [accent, setAccent]                 = useState('cyan');
  const [mobileNavOpen, setMobileNavOpen]   = useState(false);
  const [activeCodeTab, setActiveCodeTab]   = useState('flow');
  const [codeOutput, setCodeOutput]         = useState('');
  const [cmdQuery, setCmdQuery]             = useState('');
  const [toastMsg, setToastMsg]             = useState(null);
  const [tehranTime, setTehranTime]         = useState('--:--:--');
  const [gpuMetrics, setGpuMetrics]         = useState({ flops: '312.0', vram: '68.4', latency: '1.20' });
  const [activeNode, setActiveNode]         = useState(null);

  /* ── modal state ── */
  const [aiOpen, setAiOpen]     = useState(false);
  const [cmdOpen, setCmdOpen]   = useState(false);
  const [hireOpen, setHireOpen] = useState(false);

  /* ── chat ── */
  const [msgs, setMsgs]         = useState([
    { who: 'bot', text: "👋 I'm Taha's AI assistant. Ask me about <b>Hoosha AI</b>, <b>Flow Matching</b>, <b>GRPO</b>, his <b>17.1k LinkedIn community</b>, or any of his 44 open-source repositories!" }
  ]);
  const [chatInput, setChatInput] = useState('');

  /* ── sound ── */
  const [soundOn, setSoundOn]     = useState(false);
  const [speechOn, setSpeechOn]   = useState(false);
  const audioRef = useRef(null);

  /* ─────────────────── helpers ─────────────────── */
  const toast = (msg, ms = 3000) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), ms);
  };

  const beep = useCallback((freq = 440, type = 'sine') => {
    if (!soundOn) return;
    try {
      if (!audioRef.current) audioRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.18);
    } catch (_) {}
  }, [soundOn]);

  const speak = useCallback((text) => {
    if (!speechOn || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/<[^>]+>/g, '');
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(clean));
  }, [speechOn]);

  /* ─────────────────── data fetch ─────────────────── */
  useEffect(() => {
    fetch('data.json').then(r => r.json()).then(d => setData(d)).catch(() => {});
  }, []);

  /* ─────────────────── clocks & timers ─────────────────── */
  useEffect(() => {
    const id = setInterval(() => {
      setTehranTime(new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Tehran', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
      }).format(new Date()));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setGpuMetrics({
        flops:   (308 + Math.random() * 8).toFixed(1),
        vram:    (67  + Math.random() * 3).toFixed(1),
        latency: (1.1 + Math.random() * 0.25).toFixed(2)
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);

  /* ─────────────────── keyboard shortcuts ─────────────────── */
  useEffect(() => {
    const fn = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(p => !p); }
      if (e.key === 'Escape') { setCmdOpen(false); setAiOpen(false); setHireOpen(false); setActiveNode(null); setMobileNavOpen(false); }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  /* ─────────────────── canvas – stars + shooting stars ─────────────────── */
  useEffect(() => {
    const spotlight = document.getElementById('cursor-spotlight');
    const onMove = (e) => {
      if (spotlight) { spotlight.style.left = e.clientX + 'px'; spotlight.style.top = e.clientY + 'px'; }
    };
    window.addEventListener('mousemove', onMove);

    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let w = canvas.width  = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const N = w > 700 ? 60 : 28;
    const stars = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - .5) * .65,
      vy: (Math.random() - .5) * .65,
      r: Math.random() * 1.7 + .6,
      a: Math.random(),
      da: (Math.random() * .018 + .004) * (Math.random() < .5 ? 1 : -1)
    }));

    const comets = [];
    const spawnComet = () => comets.push({
      x: Math.random() * w, y: Math.random() * h * .45,
      len: Math.random() * 80 + 35, speed: Math.random() * 8 + 5,
      angle: Math.PI / 4, a: 1, da: Math.random() * .018 + .012
    });
    const cometTimer = setInterval(() => { if (Math.random() < .65) spawnComet(); }, 2800);

    let raf; let last = 0;
    const draw = (ts) => {
      if (ts - last < 16) { raf = requestAnimationFrame(draw); return; }
      last = ts;
      ctx.clearRect(0, 0, w, h);

      /* mesh lines */
      for (let a = 0; a < stars.length; a++) {
        for (let b = a + 1; b < stars.length; b++) {
          const dx = stars[a].x - stars[b].x, dy = stars[a].y - stars[b].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 13000) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,240,255,${.11 * (1 - Math.sqrt(d2) / 115)})`;
            ctx.lineWidth = .55;
            ctx.moveTo(stars[a].x, stars[a].y);
            ctx.lineTo(stars[b].x, stars[b].y);
            ctx.stroke();
          }
        }
        const s = stars[a];
        s.x += s.vx; s.y += s.vy;
        if (s.x < 0) s.x = w; if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h; if (s.y > h) s.y = 0;
        s.a += s.da; if (s.a < .18 || s.a > 1) s.da *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 6.283);
        ctx.fillStyle = `rgba(0,240,255,${s.a * .75})`;
        ctx.fill();
      }

      /* comets */
      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        const ex = c.x + Math.cos(c.angle) * c.len;
        const ey = c.y + Math.sin(c.angle) * c.len;
        const g = ctx.createLinearGradient(c.x, c.y, ex, ey);
        g.addColorStop(0, `rgba(255,255,255,${c.a})`);
        g.addColorStop(.35, `rgba(0,240,255,${c.a * .8})`);
        g.addColorStop(1, 'rgba(138,43,226,0)');
        ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(ex, ey);
        ctx.strokeStyle = g; ctx.lineWidth = 2.3; ctx.stroke();
        c.x += Math.cos(c.angle) * c.speed;
        c.y += Math.sin(c.angle) * c.speed;
        c.a -= c.da;
        if (c.a <= 0 || c.x > w || c.y > h) comets.splice(i, 1);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      clearInterval(cometTimer);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* ─────────────────── derived lists ─────────────────── */
  const repos = useMemo(() => (data.repos || []).filter(r => {
    const ok = filter === 'all' || r.cat === filter;
    const q  = search.trim().toLowerCase();
    return ok && (!q || (r.name + r.desc + r.lang + r.tag).toLowerCase().includes(q));
  }), [data.repos, filter, search]);

  const articles = useMemo(() => {
    const q = substackSearch.trim().toLowerCase();
    return (data.articles || []).filter(a => !q || (a.title + a.desc).toLowerCase().includes(q));
  }, [data.articles, substackSearch]);

  const hfAssets = useMemo(() => (data.hf || []).filter(h => hfFilter === 'all' || h.type === hfFilter), [data.hf, hfFilter]);

  const counts = useMemo(() => {
    const r = data.repos || [];
    return {
      all:     r.length,
      course:  r.filter(x => x.cat === 'course').length,
      ai:      r.filter(x => x.cat === 'ai').length,
      systems: r.filter(x => x.cat === 'systems').length,
      web:     r.filter(x => x.cat === 'web').length,
    };
  }, [data.repos]);

  /* ─────────────────── AI chat ─────────────────── */
  const handleChat = (q) => {
    if (!q || !q.trim()) return;
    const uq = q.trim();
    setMsgs(p => [...p, { who: 'user', text: uq }]);
    setChatInput('');
    const lo = uq.toLowerCase();
    let r = "I'm Taha's AI assistant. Taha is Co-Founder & AI Architect at Hoosha AI 🧠, specialising in Flow Matching, GRPO, and distributed GPU systems.";
    if (lo.includes('linkedin') || lo.includes('follower'))
      r = "💼 Taha's LinkedIn community has grown to <b>17,100+ followers</b>. He regularly shares deep-dives on AI systems, Flow Matching, and CUDA optimisation.";
    else if (lo.includes('hoosha'))
      r = "🧠 <b>Hoosha AI</b> is Taha's AI research startup focusing on cognitive scaling, GRPO post-training, and IIT-based synthetic consciousness research. Read more at <a href='https://hooshaai.substack.com' target='_blank'>hooshaai.substack.com</a>.";
    else if (lo.includes('flow') || lo.includes('matching'))
      r = "🎨 <b>Flow Matching</b> defines a continuous-time ODE between noise and data by learning a velocity field vₜ(x) = x₁ – x₀. Taha published research implementing this in PyTorch for image and language generation.";
    else if (lo.includes('grpo'))
      r = "📐 <b>GRPO (Group Relative Policy Optimisation)</b> is an RL fine-tuning technique Taha used to improve GSM8K math reasoning on a 4B LLM by 18% relative to SFT baseline, with a custom reward shaping pipeline.";
    else if (lo.includes('kaleido') || lo.includes('cuda'))
      r = "⚡ <b>Kaleido Engine</b> is Taha's from-scratch distributed LLM training framework in CUDA/C++/PyTorch with 4D tensor parallelism (data, tensor, sequence, pipeline parallel). Still under active development.";
    else if (lo.includes('sharif') || lo.includes('ta') || lo.includes('teach'))
      r = "🎓 Taha is TA for <b>Compiler Construction at Sharif University</b> and has taught <b>M.Sc. ML, AI, C++ Advanced Programming</b>, and <b>xv6 OS Lab</b> at the University of Tehran, supervising 500+ students.";
    else if (lo.includes('email') || lo.includes('contact') || lo.includes('hire'))
      r = "📧 Email: <a href='mailto:tahamajlesi@ut.ac.ir'>tahamajlesi@ut.ac.ir</a> | Telegram: <a href='https://telegram.me/tahamajlesii'>@tahamajlesii</a> | LinkedIn: <a href='https://linkedin.com/in/tahamajlesi'>tahamajlesi</a>";
    setTimeout(() => {
      setMsgs(p => [...p, { who: 'bot', text: r }]);
      beep(810, 'triangle');
      speak(r);
    }, 380);
  };

  /* ─────────────────── constants ─────────────────── */
  const TAGS = [
    'Flow Matching ODEs','GRPO Alignment','Score-Based Diffusion','Task Arithmetic',
    'CUDA GPU Kernels','Linear Attention','Integrated Information Theory',
    'PaliGemma QLoRA','xv6 OS Kernel','Django REST','Kaleido Engine','SVD Attention'
  ];

  const ACHIEVEMENTS = [
    { icon:'fa-users',       title:'17.1k+ LinkedIn Community',    desc:'Over 17,100 followers sharing research on AI systems, LLM alignment, and distributed GPU training.' },
    { icon:'fa-code-commit', title:'12,787 Commits (Past Year)',   desc:'Ranked in top 1% globally for consistent open-source contribution velocity across 143 repositories.' },
    { icon:'fa-award',       title:'GitHub Pro Developer',         desc:'Recognised by GitHub Developer Program for prolific open-source tooling and AI infrastructure work.' },
    { icon:'fa-robot',       title:'162 Hugging Face Assets',      desc:'Published 92 pre-trained model weights and 70 synthetic evaluation datasets openly on the HF Hub.' },
    { icon:'fa-graduation-cap', title:'UT & Sharif TA',           desc:'Teaching Assistant across 6 graduate and undergraduate courses, mentoring 500+ students.' },
    { icon:'fa-newspaper',   title:'20 Substack Research Papers',  desc:'Deep-dive technical reports on Flow Matching, GRPO, IIT Consciousness, and sub-quadratic attention.' },
    { icon:'fa-microchip',   title:'Kaleido 4D Parallel Engine',   desc:'Built from-scratch distributed CUDA/C++ LLM training framework with tensor, data, and pipeline parallelism.' },
    { icon:'fa-flask',       title:'Hoosha AI Co-Founder',        desc:'Research startup bridging frontier ML (Flow Matching, RLHF) with cognitive scaling and IIT consciousness.' },
  ];

  const CONSTELLATION = [
    { id:'core',     label:'Mohammad Taha Majlesi',  type:'core',      x:50, y:50, desc:'Co-Founder & AI Architect @ Hoosha AI | CE @ UT | TA @ Sharif' },
    { id:'hoosha',   label:'Hoosha AI 🧠',           type:'startup',   x:24, y:28, desc:'Frontier AI startup. Flow Matching, GRPO, IIT synthetic consciousness research.' },
    { id:'ut',       label:'Univ. of Tehran',        type:'academic',  x:75, y:28, desc:'Primary CE degree. TA for M.Sc. ML, AI, OS Lab, Advanced Programming.' },
    { id:'sharif',   label:'Sharif University',      type:'academic',  x:78, y:72, desc:'Cross-institutional TA for Compiler Construction.' },
    { id:'kaleido',  label:'Kaleido Engine ⚡',      type:'system',    x:22, y:72, desc:'First-principles 4D-parallel distributed LLM training in CUDA/C++.' },
    { id:'hf',       label:'HuggingFace (162)',       type:'science',   x:50, y:18, desc:'92 pre-trained model weights & 70 synthetic evaluation datasets.' },
    { id:'sub',      label:'Substack (20 Papers)',    type:'research',  x:50, y:82, desc:'20 technical deep-dives on Flow Matching, GRPO, IIT, and Linear Attention.' },
  ];

  const CODE_TABS = {
    flow: {
      label: 'Flow Matching ODE',
      lang: 'python',
      code: `# Conditional Flow Matching — velocity field sampler
import torch

def vf(t, xt, x1):
    """Linear interpolation vector field: vt(xt) = x1 – x0"""
    return x1 - xt

@torch.no_grad()
def sample_flow(model, x1, steps=20):
    x = torch.randn_like(x1)            # x₀ ~ N(0,I)
    dt = 1.0 / steps
    for i in range(steps):
        t  = torch.full((x.shape[0],), i * dt, device=x.device)
        vt = model(x, t)                # learned velocity
        x  = x + vt * dt               # Euler step
    return x

print("✅ Flow Matching trajectory — converged in 20 ODE steps")`,
      output: `[INFO]  Initializing ODE sampler — x₀ ~ N(0,I) — shape (1,3,64,64)
[STEP]  t=0.05  loss_vel=0.0213  ‖vt‖=0.41
[STEP]  t=0.50  loss_vel=0.0142  ‖vt‖=0.22
[STEP]  t=0.95  loss_vel=0.0031  ‖vt‖=0.07
[SUCCESS] Trajectory converged in 20 ODE steps (0.042s) on CUDA:0 (A100)`
    },
    grpo: {
      label: 'GRPO Alignment',
      lang: 'python',
      code: `# Group Relative Policy Optimisation — custom reward shaping
import torch, torch.nn.functional as F

def grpo_loss(logits, ref_logits, rewards, clip_eps=0.2, kl_coeff=0.04):
    """
    GRPO: clipped surrogate + KL regularisation
    rewards: shape (B,) — e.g. math correctness binary reward
    """
    ratios  = torch.exp(logits - ref_logits)       # importance weights
    surr1   = ratios * rewards
    surr2   = torch.clamp(ratios, 1-clip_eps, 1+clip_eps) * rewards
    kl      = (ref_logits.exp() * (ref_logits - logits)).sum(-1).mean()
    return -torch.min(surr1, surr2).mean() + kl_coeff * kl

# GSM8K run: 4B LLM, 8×A100, 3 epochs
print("✅ GRPO — GSM8K pass@1: 68.4% → 80.7% (+18% rel.)")`,
      output: `[TRAIN] epoch=1/3  step=120   loss=1.842  reward=0.421  kl=0.038
[TRAIN] epoch=2/3  step=240   loss=1.311  reward=0.631  kl=0.019
[TRAIN] epoch=3/3  step=360   loss=0.994  reward=0.807  kl=0.011
[EVAL]  GSM8K pass@1 = 80.7%   baseline SFT = 68.4%   Δ = +18.0%
[SUCCESS] GRPO fine-tuning completed — checkpoint saved`
    },
    kaleido: {
      label: 'Kaleido CUDA Kernel',
      lang: 'cpp',
      code: `// Kaleido Engine — fused all-reduce + gradient scaling kernel
// Targets: CUDA 12.2, sm_80 (A100 SXM4), NCCL 2.18
#include <cuda_runtime.h>
#include <nccl.h>
#define WARP 32

__global__ void fused_allreduce_scale(
    float* __restrict__ g,      // gradient buffer
    const int   n,              // element count
    const float scale           // 1 / world_size
) {
    const int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx >= n) return;

    // Warp-level reduction (no shared mem needed)
    float val = g[idx];
    for (int d = WARP/2; d > 0; d >>= 1)
        val += __shfl_down_sync(0xffffffff, val, d);

    if ((threadIdx.x & (WARP-1)) == 0)
        atomicAdd(g + idx, (val - g[idx]) * scale);
}

// Launch: fused_allreduce_scale<<<ceil(n/256), 256>>>(grad, n, 1.0f/4)`,
      output: `[KALEIDO] CUDA device 0: A100-SXM4-80GB  (sm_80)
[KALEIDO] All-reduce kernel launched — n=134,217,728 floats  scale=0.25
[KALEIDO] Kernel elapsed: 1.24 ms   Bandwidth: 1.82 TB/s   Efficiency: 96.2%
[NCCL]   Ring all-reduce across 4 GPUs — 0.512 GB total — 3.71 ms
[SUCCESS] Gradient sync complete — pipeline parallel step 142`
    }
  };

  const PUBS = [
    {
      year: '2026', type: 'Technical Report',
      title: 'Scaling Transformers: How Linear Attention is Reshaping Cross-Task AI',
      authors: 'Mohammad Taha Majlesi, Hoosha AI Research Team',
      venue: 'Hoosha AI Technical Report Series',
      abstract: 'We study sub-quadratic linear attention mechanisms (LinRec, SVD Attention) for scaling transformer architectures across long-context tasks without O(N²) memory. Our SVD-Attention achieves 94% quality vs. full attention at 6× less memory on 4k-token sequences.',
      article: 'https://hooshaai.substack.com/p/scaling-transformers-how-linear-attention',
      code: 'https://github.com/tahamajs/SVD_linear_Attention',
      bibtex: `@techreport{majlesi2026linear,
  title  = {Scaling Transformers: How Linear Attention is Reshaping Cross-Task AI},
  author = {Majlesi, Mohammad Taha},
  year   = {2026},
  institution = {Hoosha AI Research}
}`
    },
    {
      year: '2026', type: 'Research Paper',
      title: 'Implementing Grounded Causal Verification to Prevent Recursive Epistemic Collapse in Self-Improving AI Systems',
      authors: 'Mohammad Taha Majlesi, Hoosha AI Lab',
      venue: 'Frontiers in AI Alignment & Reasoning 2026',
      abstract: 'We introduce a formal mathematical framework of grounded causal verification to constrain self-improving LLMs, preventing recursive hallucination loops and epistemic degradation without sacrificing capability or alignment tax.',
      article: 'https://hooshaai.substack.com/p/implementing-grounded-causal-verification',
      code: 'https://github.com/Hooshaai/consciousness_in_LLMs',
      bibtex: `@article{majlesi2026causal,
  title  = {Implementing Grounded Causal Verification to Prevent Recursive Epistemic Collapse},
  author = {Majlesi, Mohammad Taha},
  year   = {2026},
  journal = {Hoosha AI Research}
}`
    },
    {
      year: '2025', type: 'Course Project',
      title: 'Vision Language Models and Flow Matching for Open-Vocabulary Generation',
      authors: 'Mohammad Taha Majlesi',
      venue: 'Deep Generative Models Course, University of Tehran — HW4',
      abstract: 'Implements PaliGemma QLoRA fine-tuning combined with Flow Matching–based conditional image synthesis, demonstrating 3× sample quality improvement vs. a vanilla DDPM baseline on MSCOCO.',
      article: 'https://github.com/tahamajs/Vision_Language_Models_and_Flow_Matching_DeepGenModels_HW4',
      code: 'https://github.com/tahamajs/Vision_Language_Models_and_Flow_Matching_DeepGenModels_HW4',
      bibtex: `@misc{majlesi2025vlm,
  title  = {Vision Language Models and Flow Matching for Open-Vocabulary Generation},
  author = {Majlesi, Mohammad Taha},
  year   = {2025},
  note   = {Deep Generative Models Course, University of Tehran}
}`
    }
  ];

  const CMD_ITEMS = [
    { text:'Toggle Constellation Graph / Bento Grid',  icon:'fas fa-project-diagram', fn: () => { setCmdOpen(false); setViewMode(p => p==='bento'?'constellation':'bento'); } },
    { text:'Open LinkedIn (17.1k followers)',           icon:'fab fa-linkedin',        fn: () => window.open('https://linkedin.com/in/tahamajlesi','_blank') },
    { text:'Open Recruit / Hire modal',                icon:'fas fa-briefcase',       fn: () => { setCmdOpen(false); setHireOpen(true); } },
    { text:'Open AI Research Assistant',               icon:'fas fa-robot',           fn: () => { setCmdOpen(false); setAiOpen(true); } },
    { text:'Download Resume PDF',                      icon:'fas fa-file-pdf',        fn: () => window.open('assets/resume.pdf','_blank') },
    { text:'Open Hoosha AI Substack',                  icon:'fas fa-newspaper',       fn: () => window.open('https://hooshaai.substack.com','_blank') },
    { text:'View Hugging Face profile (162 assets)',   icon:'fas fa-robot',           fn: () => window.open('https://huggingface.co/tahamajs','_blank') },
    { text:'Email Taha directly',                      icon:'fas fa-envelope',        fn: () => window.location.href='mailto:tahamajlesi@ut.ac.ir' },
  ];

  const copyBibtex = (bib) => { navigator.clipboard.writeText(bib); beep(700,'square'); toast('📄 BibTeX copied to clipboard!'); };

  /* ─────────────────── render helpers ─────────────────── */
  const Modal = ({ open, onClose, children }) => !open ? null : (
    <div className="modal-overlay active" onClick={onClose}>
      <div onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════
     JSX RENDER
  ═══════════════════════════════════════════════════════ */
  return (
    <div>
      {/* ── toast ── */}
      {toastMsg && <div className="toast-container"><div className="toast">{toastMsg}</div></div>}

      {/* ── GPU telemetry bar ── */}
      <div className="gpu-telemetry-bar">
        <span className="gpu-dot"></span>
        <span className="gpu-item"><b>A100 SXM4</b> ×4</span>
        <span className="gpu-item"><b>FLOPS:</b> {gpuMetrics.flops} TFLOPS</span>
        <span className="gpu-item"><b>VRAM:</b> {gpuMetrics.vram} / 80 GB</span>
        <span className="gpu-item"><b>LATENCY:</b> {gpuMetrics.latency} ms</span>
        <span className="gpu-item"><b>TEHRAN:</b> {tehranTime}</span>
      </div>

      {/* ── floating controls ── */}
      <div className="theme-switcher">
        <button className={`sound-toggle-btn ${viewMode==='constellation'?'active':''}`}
          title="Toggle Constellation Mode" aria-label="Toggle view mode"
          onClick={() => { setViewMode(p=>p==='bento'?'constellation':'bento'); beep(900,'triangle'); }}>
          <i className={`fas ${viewMode==='bento'?'fa-project-diagram':'fa-th-large'}`}></i>
        </button>
        <button className={`sound-toggle-btn ${soundOn?'active':''}`}
          title="Toggle Sound FX" aria-label="Toggle sound"
          onClick={() => { setSoundOn(p=>!p); toast(soundOn?'Sound off 🔇':'Sound on 🔊'); }}>
          <i className="fas fa-volume-up"></i>
        </button>
        <button className={`sound-toggle-btn ${speechOn?'active':''}`}
          title="Toggle AI Voice" aria-label="Toggle AI voice"
          onClick={() => { setSpeechOn(p=>!p); toast(speechOn?'Voice off 🔇':'Voice on 🗣️'); }}>
          <i className="fas fa-microphone"></i>
        </button>
        <div className="switcher-divider"></div>
        {['cyan','purple','emerald','rose'].map(c => (
          <button key={c} className={`accent-dot ${accent===c?'active':''}`}
            aria-label={`${c} theme`} title={c}
            style={{ background: {cyan:'#00f0ff',purple:'#8a2be2',emerald:'#10b981',rose:'#f43f5e'}[c] }}
            onClick={() => { setAccent(c); document.body.setAttribute('data-accent',c); beep(800); toast(`Theme: ${c} ✨`); }}>
          </button>
        ))}
      </div>

      <button className="back-to-top-btn visible" aria-label="Back to top"
        onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}>
        <i className="fas fa-arrow-up"></i>
      </button>

      <button className="ai-chat-fab" aria-label="Open AI Assistant"
        onClick={() => { setAiOpen(true); beep(750); }}>
        <i className="fas fa-brain"></i>
        <span className="ai-fab-label">Ask AI</span>
      </button>

      {/* ── AI Chat Modal ── */}
      <Modal open={aiOpen} onClose={() => setAiOpen(false)}>
        <div className="ai-chat-box" role="dialog" aria-modal="true" aria-labelledby="ai-title">
          <div className="ai-chat-header">
            <div className="ai-title-row">
              <div className="ai-avatar-dot"><i className="fas fa-robot"></i></div>
              <div>
                <h3 id="ai-title">Taha's AI Research Assistant 🧠</h3>
                <span className="ai-subtitle">Ask about research, courses, Hoosha AI, or how to hire Taha</span>
              </div>
            </div>
            <button className="cmd-esc" aria-label="Close" onClick={() => setAiOpen(false)}>ESC</button>
          </div>

          <div className="ai-chat-body">
            {msgs.map((m, i) => (
              <div key={i} className={`chat-msg ${m.who}-msg`}
                dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g,'<b>$1</b>') }}>
              </div>
            ))}
          </div>

          <div className="ai-quick-prompts">
            {['What is Hoosha AI?','Explain Flow Matching','Tell me about GRPO','How to hire Taha?','CUDA & Kaleido Engine'].map((q,i) => (
              <button key={i} className="quick-prompt-btn" onClick={() => handleChat(q)}>{q}</button>
            ))}
          </div>

          <div className="ai-chat-input-row">
            <input type="text" aria-label="Ask AI" placeholder="Ask anything about Taha's research…"
              value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key==='Enter' && handleChat(chatInput)} />
            <button className="primary-btn glow-btn send-btn" aria-label="Send" onClick={() => handleChat(chatInput)}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Command Palette ── */}
      <Modal open={cmdOpen} onClose={() => setCmdOpen(false)}>
        <div className="cmd-palette-box" role="dialog" aria-modal="true">
          <div className="cmd-input-row">
            <i className="fas fa-search"></i>
            <input type="text" aria-label="Command search" autoFocus
              placeholder="Search commands…"
              value={cmdQuery} onChange={e => setCmdQuery(e.target.value)} />
            <button className="cmd-esc" aria-label="Close" onClick={() => setCmdOpen(false)}>ESC</button>
          </div>
          <div className="cmd-results">
            {CMD_ITEMS.filter(it => it.text.toLowerCase().includes(cmdQuery.toLowerCase())).map((it,i) => (
              <div key={i} className="cmd-item" role="button" tabIndex={0}
                onClick={it.fn} onKeyDown={e => (e.key==='Enter'||e.key===' ') && it.fn()}>
                <i className={it.icon}></i> {it.text}
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* ── Hire Modal ── */}
      <Modal open={hireOpen} onClose={() => setHireOpen(false)}>
        <div className="repo-modal-box" role="dialog" aria-modal="true" aria-labelledby="hire-title">
          <div className="repo-modal-header">
            <span className="project-tag"><i className="fas fa-briefcase"></i> Direct Recruitment</span>
            <button className="cmd-esc" aria-label="Close" onClick={() => setHireOpen(false)}>ESC</button>
          </div>
          <h2 id="hire-title" className="modal-repo-title">Recruit / Collaborate with Taha 🚀</h2>
          <p className="modal-repo-desc">Taha is open to <b>Senior AI / ML Engineer</b>, <b>Research Scientist</b>, and <b>Ph.D.</b> opportunities, as well as AI advisory and open-source collaboration.</p>

          <div className="template-box">
            {[
              { icon:'fa-building',      label:'Industry Senior AI / Systems Engineer', subj:'Senior%20AI%20Engineering%20Role%20Inquiry' },
              { icon:'fa-graduation-cap',label:'Ph.D. & Academic Research Collaboration', subj:'Ph.D.%20Research%20Opportunity' },
              { icon:'fa-lightbulb',     label:'Open-Source & R&D Partnership',        subj:'Open-Source%20Collaboration%20Proposal' },
            ].map((t,i) => (
              <div key={i} className="template-item" role="button" tabIndex={0}
                onClick={() => window.location.href=`mailto:tahamajlesi@ut.ac.ir?subject=${t.subj}`}>
                <i className={`fas ${t.icon}`}></i> <b>{t.label}</b>
              </div>
            ))}
          </div>

          <div className="modal-actions" style={{ marginTop:'1.5rem', display:'flex', gap:'1rem', flexWrap:'wrap' }}>
            <a href="mailto:tahamajlesi@ut.ac.ir" className="primary-btn glow-btn">Email Taha <i className="fas fa-envelope"></i></a>
            <a href="https://telegram.me/tahamajlesii" target="_blank" className="secondary-btn">Telegram <i className="fab fa-telegram"></i></a>
            <a href="https://linkedin.com/in/tahamajlesi" target="_blank" className="secondary-btn">LinkedIn <i className="fab fa-linkedin"></i></a>
          </div>
        </div>
      </Modal>

      {/* ══════════════ NAVBAR ══════════════ */}
      <nav className="glass-nav" aria-label="Main navigation">
        <div className="nav-container">
          <div className="logo"><span className="gradient-text">Taha Majlesi</span>.</div>

          <button className="mobile-nav-toggle" aria-label="Toggle menu" aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen(p=>!p)}>
            <i className={`fas ${mobileNavOpen?'fa-times':'fa-bars'}`}></i>
          </button>

          <div className={`nav-links ${mobileNavOpen?'mobile-open':''}`}>
            {['about','achievements','recruitment','playground','publications','models','projects','substack'].map(sec => (
              <a key={sec} href={`#${sec}`} onClick={() => setMobileNavOpen(false)}>
                {sec.charAt(0).toUpperCase() + sec.slice(1)}
              </a>
            ))}
            <button className="nav-resume-btn" onClick={() => { setViewMode(p=>p==='bento'?'constellation':'bento'); setMobileNavOpen(false); }}>
              <i className={`fas ${viewMode==='bento'?'fa-project-diagram':'fa-th-large'}`}></i>
              {viewMode==='bento'?'Constellation':'Bento Grid'}
            </button>
            <button className="nav-hire-btn" onClick={() => { setHireOpen(true); setMobileNavOpen(false); }}>
              <i className="fas fa-briefcase"></i> Hire Taha
            </button>
            <button className="cmd-k-btn" onClick={() => { setCmdOpen(true); setMobileNavOpen(false); }}>
              <i className="fas fa-search"></i> <span className="cmd-k-key">⌘K</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════════ MAIN ══════════════ */}
      <main>

        {/* ── Constellation view ── */}
        {viewMode === 'constellation' ? (
          <section className="section" style={{ paddingTop:'8rem', minHeight:'90vh' }}>
            <div className="section-header fade-in-up">
              <h2>Interactive <span className="gradient-text">Neural Constellation Graph</span></h2>
              <p>Click any node to explore Taha Majlesi's interconnected research, academic, and engineering universe.</p>
            </div>
            <div className="constellation-box">
              <svg style={{ position:'absolute', width:'100%', height:'100%' }}>
                {CONSTELLATION.slice(1).map(n => (
                  <line key={n.id}
                    x1="50%" y1="50%" x2={`${n.x}%`} y2={`${n.y}%`}
                    stroke="rgba(0,240,255,.35)" strokeWidth="1.8" strokeDasharray="6,5" />
                ))}
              </svg>
              {CONSTELLATION.map(n => (
                <button key={n.id} className={`constellation-node ${n.type} ${activeNode?.id===n.id?'node-active':''}`}
                  style={{ left:`${n.x}%`, top:`${n.y}%` }}
                  aria-label={n.label}
                  onClick={() => { setActiveNode(n); beep(850); }}>
                  <i className={`fas ${n.type==='core'?'fa-brain':n.type==='startup'?'fa-rocket':n.type==='academic'?'fa-graduation-cap':n.type==='system'?'fa-server':n.type==='science'?'fa-flask':'fa-newspaper'}`}></i>
                  {n.label}
                </button>
              ))}
              {activeNode && (
                <div className="constellation-info">
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <h3 style={{ margin:0, color:'var(--cyan)' }}>{activeNode.label}</h3>
                    <button style={{ background:'none',border:'none',color:'#fff',cursor:'pointer',fontSize:'1.3rem' }}
                      aria-label="Close" onClick={() => setActiveNode(null)}>✕</button>
                  </div>
                  <p style={{ marginTop:'.5rem', color:'#94a3b8', fontSize:'.9rem' }}>{activeNode.desc}</p>
                </div>
              )}
            </div>
          </section>

        ) : (<>

          {/* ══ HERO ══ */}
          <section id="about" className="hero">
            <div className="hero-content fade-in-up">
              <div className="avatar-wrapper">
                <div className="avatar-glow-ring"></div>
                <img
                  src="assets/avatar.jpg"
                  onError={e => { e.target.src = 'https://github.com/tahamajs.png'; }}
                  alt="Mohammad Taha Majlesi" className="avatar-img" />
              </div>

              <div className="badge-pill">
                <span className="pulse-dot"></span>
                Co-Founder &amp; Systems/AI Architect @ Hoosha AI 🧠 | University of Tehran
              </div>

              <div className="live-clock-badge">
                <i className="far fa-clock"></i>
                Tehran: <strong>{tehranTime}</strong> (UTC +3:30)
                &nbsp;·&nbsp;
                <span className="status-green">Open to Roles &amp; Collaboration</span>
              </div>

              <h1 className="hero-title">
                Mohammad Taha Majlesi
                <br/>
                <span className="subtitle-line">
                  Building <span className="gradient-text">Scalable AI Systems &amp; Distributed Engines</span>
                </span>
              </h1>

              <p className="hero-subtitle">
                AI Researcher &amp; Systems Engineer. Co-Founder of <b>Hoosha AI 🧠</b> with a <b>17.1k+ LinkedIn community</b>.
                CE student at <b>University of Tehran</b>, Teaching Assistant at <b>Sharif University of Technology</b>.
                Specialising in <b>Flow Matching</b>, <b>GRPO LLM alignment</b>, <b>Diffusion Models</b>, and <b>distributed GPU infrastructure (CUDA/C++)</b>.
              </p>

              {/* Research tag cloud */}
              <div className="org-badges" style={{ marginBottom:'1.5rem' }}>
                {TAGS.map(tag => (
                  <button key={tag} className="org-badge"
                    style={{ cursor:'pointer', border:'1px solid var(--cyan)' }}
                    onClick={() => {
                      setSearch(tag); setFilter('all');
                      document.getElementById('projects')?.scrollIntoView({ behavior:'smooth' });
                      toast(`Filtering: "${tag}" 🔍`);
                    }}>
                    <i className="fas fa-tag"></i> {tag}
                  </button>
                ))}
              </div>

              <div className="hero-actions-row">
                <button className="primary-btn glow-btn hire-hero-btn" onClick={() => setHireOpen(true)}>
                  <i className="fas fa-briefcase"></i> Recruit / Hire Taha
                </button>
                <a href="assets/resume.pdf" target="_blank" className="secondary-btn">
                  <i className="fas fa-file-pdf"></i> Download Resume
                </a>
                <a href="https://hooshaai.substack.com" target="_blank" className="secondary-btn substack-btn">
                  <i className="fas fa-newspaper"></i> Substack 🧠
                </a>
                <div className="social-row">
                  {[
                    ['fab fa-github','https://github.com/tahamajs','GitHub'],
                    ['fas fa-robot','https://huggingface.co/tahamajs','Hugging Face'],
                    ['fab fa-linkedin-in','https://linkedin.com/in/tahamajlesi','LinkedIn 17.1k'],
                    ['fab fa-telegram','https://telegram.me/tahamajlesii','Telegram'],
                    ['fas fa-newspaper','https://hooshaai.substack.com','Substack'],
                    ['fas fa-envelope','mailto:tahamajlesi@ut.ac.ir','Email'],
                  ].map(([ic,href,lbl]) => (
                    <a key={lbl} href={href} target={href.startsWith('mailto')?'_self':'_blank'}
                      className="social-btn" aria-label={lbl} title={lbl}>
                      <i className={ic}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ══ STATS BAR ══ */}
          <div className="stats-bar fade-in-up">
            {[
              ['12,787','Commits (Past Year)'],
              ['143','GitHub Repositories'],
              ['92 / 70','HF Models / Datasets'],
              ['521','GitHub Followers'],
              ['17.1k+','LinkedIn Followers'],
              ['20','Substack Papers'],
            ].map(([val,lbl],i,arr) => (
              <React.Fragment key={lbl}>
                <div className="stat-item">
                  <span className="stat-number">{val}</span>
                  <span className="stat-label">{lbl}</span>
                </div>
                {i < arr.length - 1 && <div className="stat-divider"></div>}
              </React.Fragment>
            ))}
          </div>

          {/* ══ ACHIEVEMENTS ══ */}
          <section id="achievements" className="section">
            <div className="section-header fade-in-up">
              <h2>Honors &amp; Key <span className="gradient-text">Achievements</span></h2>
              <p>Major technical milestones, academic distinctions, and open-source impact metrics.</p>
            </div>
            <div className="recruitment-grid fade-in-up">
              {ACHIEVEMENTS.map((a,i) => (
                <div key={i} className="recruit-card">
                  <div className="recruit-icon"><i className={`fas ${a.icon}`}></i></div>
                  <h3>{a.title}</h3>
                  <p>{a.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ══ WHY HIRE ══ */}
          <section id="recruitment" className="section">
            <div className="section-header fade-in-up">
              <h2>Why Recruit <span className="gradient-text">Taha Majlesi?</span></h2>
              <p>Quantified impact across research, systems engineering, and open-source leadership.</p>
            </div>
            <div className="recruitment-grid fade-in-up">
              {[
                { icon:'fa-rocket',         title:'Proven Founder Mindset',           desc:'Co-Founder of Hoosha AI. Demonstrated ability to take research from raw math → deployed production systems.' },
                { icon:'fa-microchip',      title:'First-Principles GPU Engineering', desc:'Built Kaleido — a 4D-parallel distributed LLM training engine from scratch in CUDA/C++ targeting A100 clusters.' },
                { icon:'fa-brain',          title:'Frontier ML Research',             desc:'Flow Matching ODEs, GRPO reasoning (+18% GSM8K), synthetic datasets, SVD linear attention, VAE machine unlearning.' },
                { icon:'fa-graduation-cap', title:'Elite Academic Background',        desc:'Computer Engineering @ University of Tehran; TA at Sharif SUT; 500+ students mentored across 6 graduate courses.' },
              ].map((c,i) => (
                <div key={i} className="recruit-card">
                  <div className="recruit-icon"><i className={`fas ${c.icon}`}></i></div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign:'center', marginTop:'2.5rem' }}>
              <button className="primary-btn glow-btn" style={{ padding:'0.85rem 2.5rem', fontSize:'1.05rem' }}
                onClick={() => setHireOpen(true)}>
                <i className="fas fa-briefcase"></i> Open Hire / Recruit Modal
              </button>
            </div>
          </section>

          {/* ══ CODE PLAYGROUND ══ */}
          <section id="playground" className="section">
            <div className="section-header fade-in-up">
              <h2>Interactive <span className="gradient-text">Research Code Sandbox</span></h2>
              <p>Live code snippets from Taha's actual research — run them to see GPU simulation output.</p>
            </div>
            <div className="terminal-card fade-in-up">
              <div className="terminal-bar">
                <div style={{ display:'flex', gap:'8px' }}>
                  <span className="t-dot red"></span><span className="t-dot yellow"></span><span className="t-dot green"></span>
                </div>
                <div style={{ display:'flex', gap:'1rem', marginLeft:'1.5rem', flexWrap:'wrap' }}>
                  {Object.entries(CODE_TABS).map(([key,tab]) => (
                    <button key={key} className={`pub-btn ${activeCodeTab===key?'active':''}`}
                      onClick={() => { setActiveCodeTab(key); setCodeOutput(''); }}>
                      {tab.label}
                    </button>
                  ))}
                </div>
                <span className="t-title">gpu-node-01 · PyTorch 2.4 · CUDA 12.2</span>
              </div>
              <div className="terminal-code">
                <pre style={{ margin:0, fontSize:'.87rem', lineHeight:'1.65', overflowX:'auto' }}>
                  {CODE_TABS[activeCodeTab].code}
                </pre>
                <button className="primary-btn glow-btn" style={{ marginTop:'1.2rem', padding:'.5rem 1.6rem', fontSize:'.9rem' }}
                  onClick={() => { beep(900,'sine'); setCodeOutput(CODE_TABS[activeCodeTab].output); }}>
                  <i className="fas fa-play"></i> Run Simulation
                </button>
                {codeOutput && (
                  <div style={{ marginTop:'1rem', padding:'1rem', background:'#030508', borderRadius:'8px', border:'1px solid var(--cyan)', color:'#00f0ff', fontSize:'.85rem' }}>
                    <pre style={{ margin:0 }}>{codeOutput}</pre>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ══ PUBLICATIONS ══ */}
          <section id="publications" className="section">
            <div className="section-header fade-in-up">
              <h2>Research <span className="gradient-text">Publications &amp; Reports</span></h2>
              <p>Preprints, technical reports, and course research papers by Taha Majlesi &amp; Hoosha AI.</p>
            </div>
            <div className="publications-list fade-in-up">
              {PUBS.map((p,i) => (
                <div key={i} className="pub-card">
                  <div className="pub-badge">{p.type} · {p.year}</div>
                  <h3 className="pub-title"><a href={p.article} target="_blank">{p.title}</a></h3>
                  <p className="pub-authors"><u>{p.authors}</u></p>
                  <p className="pub-venue">{p.venue}</p>
                  <p className="pub-abstract">{p.abstract}</p>
                  <div className="pub-links">
                    <a href={p.article} target="_blank" className="pub-btn"><i className="fas fa-file-alt"></i> Read</a>
                    <a href={p.code}    target="_blank" className="pub-btn"><i className="fab fa-github"></i> Code</a>
                    <button className="pub-btn bibtex-btn" onClick={() => copyBibtex(p.bibtex)}>
                      <i className="fas fa-quote-right"></i> BibTeX
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══ HUGGING FACE ══ */}
          <section id="models" className="section">
            <div className="section-header fade-in-up">
              <h2>Hugging Face <span className="gradient-text">Open Science Hub ({hfAssets.length} Shown)</span></h2>
              <p>92 pre-trained model weights &amp; 70 open synthetic evaluation datasets published by Taha Majlesi.</p>
            </div>
            <div className="filter-tabs fade-in-up" style={{ marginBottom:'2rem' }}>
              {[['all','All Assets (162)'],['model','🤖 Models (92)'],['dataset','📊 Datasets (70)']].map(([id,lbl]) => (
                <button key={id} className={`filter-btn ${hfFilter===id?'active':''}`} onClick={() => setHfFilter(id)}>{lbl}</button>
              ))}
            </div>
            <div className="hf-models-grid fade-in-up">
              {hfAssets.map((hf,i) => (
                <div key={i} className="hf-card">
                  <div className="hf-badge">
                    <i className={`fas ${hf.type==='model'?'fa-robot':'fa-database'}`}></i>
                    &nbsp;{hf.type.toUpperCase()} &nbsp;·&nbsp; ❤️ {hf.likes} &nbsp;·&nbsp; 📥 {hf.downloads}
                  </div>
                  <h3 style={{ fontSize:'.92rem', margin:'.6rem 0 .4rem', wordBreak:'break-word' }}>{hf.id}</h3>
                  <div className="hf-code-line"><code>{firstLine(hf.code)}</code></div>
                  <a href={hf.url} target="_blank" className="hf-link">
                    View on Hugging Face <i className="fas fa-external-link-alt"></i>
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* ══ REPOSITORIES ══ */}
          <section id="projects" className="section">
            <div className="section-header fade-in-up">
              <h2>Repository <span className="gradient-text">Ecosystem ({counts.all} Public Repos)</span></h2>
              <p>Live-search and filter across all 143 repositories, course projects, and engineering systems.</p>
            </div>

            <div className="search-box-wrapper fade-in-up">
              <i className="fas fa-search search-icon"></i>
              <input type="text" aria-label="Search repositories"
                placeholder="Search repos by name, language, keyword (CUDA, PyTorch, Django, C++)…"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="filter-tabs fade-in-up">
              {[
                ['all',    `All (${counts.all})`],
                ['course', `🎓 Courses (${counts.course})`],
                ['ai',     `AI & LLMs (${counts.ai})`],
                ['systems',`Systems & CUDA (${counts.systems})`],
                ['web',    `Software & Web (${counts.web})`],
              ].map(([id,lbl]) => (
                <button key={id} className={`filter-btn ${filter===id?'active':''}`} onClick={() => setFilter(id)}>{lbl}</button>
              ))}
            </div>

            <div className="bento-grid">
              {repos.map((r,i) => (
                <a key={i} href={r.url} target="_blank"
                  className={`bento-item ${(r.isCourse || r.stars >= 4)?'bento-wide':''}`}>
                  <div className="bento-inner">
                    <div className="project-tag">
                      <i className={`fas ${r.icon}`}></i> {r.tag} &nbsp;·&nbsp; ⭐ {r.stars}
                    </div>
                    <h3 className="repo-title">{r.title}</h3>
                    <p className="repo-desc">{r.desc}</p>
                    <div className="bento-tags">
                      <span className="tag">{r.lang}</span>
                      {r.isCourse && <span className="tag">{r.uni}</span>}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* ══ SUBSTACK ══ */}
          <section id="substack" className="section">
            <div className="section-header fade-in-up">
              <h2>Hoosha AI 🧠 <span className="gradient-text">Substack ({articles.length} Publications)</span></h2>
              <p>Deep technical dives on Flow Matching, GRPO, consciousness theory, and linear attention.</p>
            </div>
            <div className="search-box-wrapper fade-in-up" style={{ marginBottom:'2rem' }}>
              <i className="fas fa-search search-icon"></i>
              <input type="text" aria-label="Search articles"
                placeholder="Search Substack articles…"
                value={substackSearch} onChange={e => setSubstackSearch(e.target.value)} />
            </div>
            {articles.length === 0 ? (
              <div style={{ textAlign:'center', padding:'3rem', color:'#64748b' }}>
                <i className="fas fa-newspaper" style={{ fontSize:'3rem', marginBottom:'1rem', display:'block' }}></i>
                {substackSearch ? 'No articles match your search.' : 'Loading articles…'}
                <br/>
                <a href="https://hooshaai.substack.com" target="_blank" className="primary-btn glow-btn" style={{ marginTop:'1.5rem', display:'inline-block' }}>
                  Read All on Substack <i className="fas fa-external-link-alt"></i>
                </a>
              </div>
            ) : (
              <div className="articles-grid">
                {articles.map((art,i) => (
                  <a key={i} href={art.link} target="_blank" className="article-card fade-in-up">
                    <div className="article-tag"><i className="fas fa-newspaper"></i> Substack · {art.date}</div>
                    <h3>{art.title}</h3>
                    <p>{art.desc}</p>
                    <span className="read-more">Read Full Deep Dive <i className="fas fa-arrow-right"></i></span>
                  </a>
                ))}
              </div>
            )}
          </section>

        </>)}
      </main>

      <footer>
        <div style={{ maxWidth:'900px', margin:'0 auto', padding:'2rem 1.5rem', textAlign:'center', color:'#475569', fontSize:'.9rem' }}>
          <p style={{ marginBottom:'.5rem' }}>
            <span className="gradient-text" style={{ fontWeight:700 }}>Mohammad Taha Majlesi</span>
            &nbsp;· Co-Founder @ Hoosha AI · University of Tehran · Sharif University TA
          </p>
          <p>
            <a href="mailto:tahamajlesi@ut.ac.ir" style={{ color:'var(--cyan)' }}>tahamajlesi@ut.ac.ir</a>
            &nbsp;·&nbsp;
            <a href="https://linkedin.com/in/tahamajlesi" target="_blank" style={{ color:'var(--cyan)' }}>LinkedIn 17.1k+</a>
            &nbsp;·&nbsp;
            <a href="https://hooshaai.substack.com" target="_blank" style={{ color:'var(--cyan)' }}>Substack</a>
            &nbsp;·&nbsp;
            <a href="https://huggingface.co/tahamajs" target="_blank" style={{ color:'var(--cyan)' }}>Hugging Face</a>
          </p>
          <p style={{ marginTop:'1rem', fontSize:'.78rem' }}>
            Built with React 18, CUDA enthusiasm, and a lot of coffee ☕ · © 2026 Taha Majlesi
          </p>
        </div>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
