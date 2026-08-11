const { useState, useEffect, useMemo, useRef, useCallback } = React;
const firstLine = v => String(v == null ? '' : v).split('\n')[0];

/* ── tiny toast hook ── */
function useToast() {
  const [msg, setMsg] = useState(null);
  const show = useCallback((m, ms = 2800) => { setMsg(m); setTimeout(() => setMsg(null), ms); }, []);
  return [msg, show];
}

/* ─── CONSTANTS ─── */
const TAGS = [
  'Flow Matching ODEs','GRPO Alignment','Score-Based Diffusion','Task Arithmetic',
  'CUDA GPU Kernels','Linear Attention','Integrated Information Theory',
  'PaliGemma QLoRA','xv6 OS Kernel','Persian LLMs','Kaleido Engine','SVD Attention'
];

const ACHIEVEMENTS = [
  { icon:'fa-users',        v:'17,100+',   title:'LinkedIn Community',       desc:'17.1k+ followers engaging with deep AI systems, LLM alignment, and distributed GPU research.' },
  { icon:'fa-code-commit',  v:'12,787',    title:'Commits (Past Year)',       desc:'Top 1% globally for open-source contribution velocity across 143 public repositories.' },
  { icon:'fa-robot',        v:'162',       title:'Hugging Face Assets',       desc:'92 pre-trained model weights + 70 synthetic evaluation datasets published openly on HF Hub.' },
  { icon:'fa-newspaper',    v:'20',        title:'Substack Research Papers',  desc:'Deep-dive technical reports on Flow Matching, GRPO, IIT Consciousness, and linear attention.' },
  { icon:'fa-graduation-cap',v:'500+',    title:'Students Mentored',         desc:'TA across 6 graduate/undergraduate courses at University of Tehran and Sharif University.' },
  { icon:'fa-microchip',    v:'4D',        title:'Kaleido Parallel Engine',   desc:'From-scratch distributed CUDA/C++ LLM training with data, tensor, sequence & pipeline parallel.' },
  { icon:'fa-flask',        v:'∞',         title:'Hoosha AI Co-Founder',      desc:'Research startup on frontier ML: Flow Matching, GRPO post-training, IIT synthetic cognition.' },
  { icon:'fa-award',        v:'Pro',       title:'GitHub Pro Developer',      desc:'Recognised by GitHub Developer Program for prolific open-source AI infrastructure contributions.' },
];

const SKILLS = [
  { cat:'Languages',      items:['Python','C++','CUDA/C','Kotlin','Java','JavaScript','Verilog'] },
  { cat:'ML Frameworks',  items:['PyTorch 2.x','JAX','HuggingFace','DeepSpeed','PEFT / QLoRA','TRL / GRPO'] },
  { cat:'Systems',        items:['CUDA 12.2','NCCL','MPI','Linux Kernel','xv6 OS','Verilog RTL'] },
  { cat:'Infra & DevOps', items:['Docker','GitHub Actions','FastAPI','Django REST','PostgreSQL','Redis'] },
  { cat:'Research',       items:['Flow Matching','Diffusion SDEs','RLHF/GRPO','Linear Attention','VAE Unlearning','IIT'] },
];

const TIMELINE = [
  { year:'2026', icon:'fa-rocket',       color:'#00f0ff', title:'Co-Founded Hoosha AI 🧠',                   desc:'Launched AI research startup focused on Flow Matching, GRPO post-training, and IIT-based synthetic consciousness.' },
  { year:'2026', icon:'fa-newspaper',    color:'#8a2be2', title:'Published 20 Substack Research Papers',      desc:'20 deep-dive technical papers on Flow Matching, GRPO, CUDA kernels, consciousness theory published on Hoosha AI Substack.' },
  { year:'2026', icon:'fa-users',        color:'#10b981', title:'17,100+ LinkedIn Community',                 desc:'Built one of Iran\'s largest AI communities on LinkedIn through consistent research content and open-source contributions.' },
  { year:'2025', icon:'fa-graduation-cap',color:'#f59e0b',title:'TA @ Sharif Univ. — Compiler Construction',  desc:'Teaching Assistant for Compiler Construction at Sharif University of Technology, supervising 200+ students.' },
  { year:'2025', icon:'fa-microchip',    color:'#00f0ff', title:'Built Kaleido Engine ⚡ (4D Parallel CUDA)', desc:'From-scratch distributed LLM training framework in CUDA/C++ targeting A100 clusters with 4D tensor parallelism.' },
  { year:'2025', icon:'fa-brain',        color:'#8a2be2', title:'GRPO Fine-Tuning: GSM8K +18% rel. gain',     desc:'Fine-tuned 4B LLM with custom GRPO pipeline, achieving 80.7% pass@1 on GSM8K math reasoning (+18% over SFT).' },
  { year:'2024', icon:'fa-graduation-cap',color:'#10b981','title':'TA @ UT — M.Sc. ML, AI, OS Lab, C++',      desc:'Teaching Assistant for 4 simultaneous graduate courses at University of Tehran, mentoring 300+ students.' },
  { year:'2024', icon:'fa-robot',        color:'#f59e0b', title:'162 HuggingFace Assets Published',           desc:'Reached 162 public HF assets: 92 pre-trained model checkpoints and 70 synthetic evaluation datasets.' },
  { year:'2023', icon:'fa-graduation-cap',color:'#00f0ff','title':'Started CE at University of Tehran',        desc:'Enrolled in Computer Engineering at University of Tehran, focusing on systems, AI, and distributed computing.' },
];

const CONSTELLATION = [
  { id:'core',    label:'Taha Majlesi',       type:'core',     x:50, y:50, desc:'Co-Founder & AI Architect @ Hoosha AI | CE @ University of Tehran | TA @ Sharif University of Technology' },
  { id:'hoosha',  label:'Hoosha AI 🧠',       type:'startup',  x:24, y:28, desc:'Frontier AI research startup. Flow Matching, GRPO post-training, IIT-based synthetic consciousness, and distributed GPU systems.' },
  { id:'ut',      label:'Univ. of Tehran',    type:'academic', x:75, y:28, desc:'Primary CE degree. TA for M.Sc. ML, AI, OS Lab, Advanced Programming — mentoring 500+ students across 6 courses.' },
  { id:'sharif',  label:'Sharif Univ.',       type:'academic', x:78, y:72, desc:'Cross-institutional TA for Compiler Construction at Sharif University of Technology (2025–present).' },
  { id:'kaleido', label:'Kaleido Engine ⚡',  type:'system',   x:22, y:72, desc:'First-principles 4D-parallel distributed LLM training engine in CUDA/C++ targeting A100 SXM4 clusters.' },
  { id:'hf',      label:'HuggingFace (162)',  type:'science',  x:50, y:16, desc:'92 pre-trained model weights & 70 synthetic evaluation datasets. Top downloaded: persian-instruct-200k (312 downloads).' },
  { id:'sub',     label:'Substack (20)',      type:'research', x:50, y:84, desc:'20 deep-dive technical papers covering Flow Matching, GRPO, CUDA, IIT consciousness, and linear attention.' },
  { id:'linkedin',label:'LinkedIn 17.1k',    type:'startup',  x:12, y:50, desc:'17,100+ followers — one of Iran\'s largest AI communities. Weekly deep-dives on AI systems and distributed training.' },
];

const CODE_TABS = {
  flow: {
    label:'Flow Matching ODE', lang:'python',
    code:`# Conditional Flow Matching — velocity field sampler
# Paper: Lipman et al. 2022 / Liu et al. 2022
import torch, torch.nn as nn

class VelocityField(nn.Module):
    """Learnable velocity field vθ(t, x)"""
    def __init__(self, d=256, h=512):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(d + 1, h), nn.SiLU(),
            nn.Linear(h, h),     nn.SiLU(),
            nn.Linear(h, d)
        )
    def forward(self, x, t):
        t_ = t.view(-1, 1).expand(x.shape[0], 1)
        return self.net(torch.cat([x, t_], dim=-1))

def cfm_loss(model, x1, sigma=0.001):
    """Conditional Flow Matching objective E[‖vθ(xt,t) − (x1−x0)‖²]"""
    x0 = torch.randn_like(x1)
    t  = torch.rand(x1.shape[0], device=x1.device)
    xt = (1 - t[:,None]) * x0 + t[:,None] * x1  # linear interpolation
    xt = xt + sigma * torch.randn_like(xt)       # small noise
    vt = model(xt, t)
    return ((vt - (x1 - x0)) ** 2).mean()

@torch.no_grad()
def sample(model, shape, steps=20):
    x = torch.randn(shape)
    dt = 1.0 / steps
    for i in range(steps):
        t = torch.full((shape[0],), i * dt)
        x = x + model(x, t) * dt   # Euler-Maruyama
    return x`,
    output:`[INIT]  VelocityField  params=1,182,976  device=cuda:0 (A100-SXM4)
[TRAIN] step=100  loss=0.2813  lr=1e-4  t_mean=0.502
[TRAIN] step=500  loss=0.0941  lr=8e-5  t_mean=0.498
[TRAIN] step=1000 loss=0.0312  lr=5e-5  t_mean=0.501
[SAMPLE] Generating 64 samples — steps=20 — 0.038s
[FID]   FID-10k = 4.21  (DDPM baseline = 9.87)
[SUCCESS] Flow Matching trajectory converged ✓`
  },
  grpo: {
    label:'GRPO Alignment', lang:'python',
    code:`# Group Relative Policy Optimisation (GRPO) — DeepSeekMath variant
# Achieves +18% relative gain on GSM8K vs SFT baseline
import torch, torch.nn.functional as F

def compute_rewards(responses: list[str], ground_truths: list[str]) -> torch.Tensor:
    """Binary math correctness reward + format reward."""
    rewards = []
    for resp, gt in zip(responses, ground_truths):
        correct = float(gt.strip() in resp)   # exact match
        fmt_ok  = float("\\\\boxed{" in resp)  # LaTeX box format
        rewards.append(0.8 * correct + 0.2 * fmt_ok)
    return torch.tensor(rewards)

def grpo_loss(model, ref_model, input_ids, rewards,
              clip_eps=0.20, kl_coeff=0.04, G=8):
    """
    GRPO: group-normalised clipped surrogate + KL penalty.
    G = group size (rollouts per prompt).
    """
    with torch.no_grad():
        ref_logp = ref_model(input_ids).log_softmax(-1)
    logp     = model(input_ids).log_softmax(-1)
    ratio    = (logp - ref_logp).exp()
    # Group-relative advantage (normalised within each group of G)
    adv      = (rewards - rewards.view(-1, G).mean(1, keepdim=True).repeat(1,G).view(-1))
    adv      = adv / (adv.view(-1,G).std(1, keepdim=True).repeat(1,G).view(-1) + 1e-8)
    surr1    = ratio * adv
    surr2    = torch.clamp(ratio, 1-clip_eps, 1+clip_eps) * adv
    kl       = F.kl_div(logp, ref_logp.exp(), reduction='batchmean')
    return -torch.min(surr1, surr2).mean() + kl_coeff * kl`,
    output:`[CONFIG] model=Qwen2.5-4B  G=8  lr=1e-5  clip=0.20  kl=0.04
[EPOCH 1/3] step=120  loss=1.842  reward=0.421  kl=0.038  acc=42.1%
[EPOCH 2/3] step=240  loss=1.311  reward=0.631  kl=0.019  acc=63.1%
[EPOCH 3/3] step=360  loss=0.994  reward=0.807  kl=0.011  acc=80.7%
[EVAL]  GSM8K pass@1 = 80.7%  SFT baseline = 68.4%  Δ = +18.0% rel.
[SUCCESS] GRPO fine-tuning complete — checkpoint saved to HF Hub ✓`
  },
  cuda: {
    label:'Kaleido CUDA Kernel', lang:'cpp',
    code:`// Kaleido Engine — fused warp-level all-reduce + gradient scaling
// Target: CUDA 12.2  sm_80 (A100 SXM4 80GB)  NCCL 2.18
#include <cuda_runtime.h>
#include <cuda_fp16.h>
#define WARP_SIZE 32
#define BLOCK     256

__device__ __forceinline__ float warp_reduce_sum(float v) {
    #pragma unroll
    for (int d = WARP_SIZE / 2; d > 0; d >>= 1)
        v += __shfl_xor_sync(0xFFFFFFFF, v, d);
    return v;
}

__global__ void fused_reduce_scale_fp16(
    __half* __restrict__ grad,   // FP16 gradient buffer
    float*  __restrict__ acc,    // FP32 accumulator
    const int  n,                // total element count
    const float scale            // 1 / world_size
) {
    const int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx >= n) return;

    float v = __half2float(grad[idx]);
    v = warp_reduce_sum(v) * scale;          // in-warp all-reduce

    if ((threadIdx.x & (WARP_SIZE-1)) == 0)
        atomicAdd(acc + idx, v);             // accumulate to FP32
    __syncthreads();
    if (idx < n) grad[idx] = __float2half(acc[idx]);  // write back
}
// Launch: fused_reduce_scale_fp16<<<(n+BLOCK-1)/BLOCK, BLOCK>>>
//         (grad_fp16, acc_fp32, n, 1.0f/world_size)`,
    output:`[KALEIDO] Device 0: A100-SXM4-80GB  sm_80  CUDA 12.2
[KERNEL]  fused_reduce_scale_fp16  n=134,217,728  scale=0.25
[PERF]    Elapsed: 1.24 ms   BW: 1.82 TB/s   SM Util: 96.2%
[NCCL]    Ring all-reduce — 4 GPUs — 512 MB — 3.71 ms
[MEM]     VRAM: 68.4 / 80.0 GB   Fragmentation: 2.1%
[SUCCESS] Gradient sync complete — pipeline step 142 ✓`
  },
  svd: {
    label:'SVD Linear Attention', lang:'python',
    code:`# SVD Linear Attention — O(N·r) instead of O(N²)
# Approx. full softmax-attention with rank-r SVD factorisation
# Achieves 94% quality at 6× less memory on 4k-token sequences
import torch, torch.nn as nn, torch.nn.functional as F

class SVDLinearAttention(nn.Module):
    def __init__(self, d_model=512, n_heads=8, rank=64):
        super().__init__()
        self.h, self.r = n_heads, rank
        self.d_h = d_model // n_heads
        self.Wq  = nn.Linear(d_model, d_model, bias=False)
        self.Wk  = nn.Linear(d_model, d_model, bias=False)
        self.Wv  = nn.Linear(d_model, d_model, bias=False)
        self.Wo  = nn.Linear(d_model, d_model, bias=False)
        # Low-rank projection matrices (rank-r SVD approximation)
        self.U   = nn.Parameter(torch.randn(n_heads, self.d_h, rank) * 0.02)
        self.S   = nn.Parameter(torch.ones(n_heads, rank))
        self.Vt  = nn.Parameter(torch.randn(n_heads, rank, self.d_h) * 0.02)

    def forward(self, x):
        B, N, D = x.shape
        Q = self.Wq(x).view(B,N,self.h,self.d_h).transpose(1,2)
        K = self.Wk(x).view(B,N,self.h,self.d_h).transpose(1,2)
        V = self.Wv(x).view(B,N,self.h,self.d_h).transpose(1,2)
        # Approximate A ≈ U·diag(S)·Vᵀ  (rank-r SVD)
        phi_Q = F.elu(Q @ self.U) * self.S.unsqueeze(0).unsqueeze(2)
        phi_K = F.elu(K @ self.U) * self.S.unsqueeze(0).unsqueeze(2)
        # Linear attention: O(N·r)  no softmax, no N² matrix
        kv    = phi_K.transpose(-2,-1) @ V        # (B,h,r,d_h)
        out   = phi_Q @ kv / (phi_Q.sum(-1, keepdim=True) + 1e-6)
        return self.Wo(out.transpose(1,2).reshape(B,N,D))`,
    output:`[BENCH]  seq_len=4096  d_model=512  heads=8  rank=64  batch=16
[MEM]    SVD-Attn: 1.23 GB   Full-Attn: 7.81 GB   Reduction: 6.3×
[SPEED]  SVD-Attn: 8.4 ms    Full-Attn: 51.2 ms   Speedup: 6.1×
[QUAL]   BLEU-4 SVD=28.4  Full=30.2  Retention: 94.0%
[SUCCESS] SVD Linear Attention benchmark complete ✓`
  }
};

const PUBS = [
  {
    year:'2026', badge:'Technical Report',
    title:'Scaling Transformers: How Linear Attention Is Reshaping Cross-Task AI',
    authors:'Mohammad Taha Majlesi · Hoosha AI Research Team',
    venue:'Hoosha AI Technical Report Series — July 2026',
    abstract:'We study sub-quadratic linear attention mechanisms (LinRec, SVD-Attention) for scaling transformers across long-context tasks without O(N²) memory. SVD-Attention achieves 94% quality vs. full attention at 6× less memory on 4k-token sequences, with full CUDA kernel profiling on A100 hardware.',
    link:'https://hooshaai.substack.com/p/scaling-transformers-how-linear-attention',
    code:'https://github.com/tahamajs/SVD_linear_Attention',
    bib:`@techreport{majlesi2026linear,
  title  = {Scaling Transformers: How Linear Attention Is Reshaping Cross-Task AI},
  author = {Majlesi, Mohammad Taha},
  year   = {2026},
  institution = {Hoosha AI Research}
}`
  },
  {
    year:'2026', badge:'Research Paper',
    title:'Implementing Grounded Causal Verification to Prevent Recursive Epistemic Collapse in Self-Improving AI',
    authors:'Mohammad Taha Majlesi · Hoosha AI Lab',
    venue:'Hoosha AI Research — June 2026',
    abstract:'We introduce a formal mathematical framework of grounded causal verification to constrain self-improving LLMs, preventing recursive hallucination and epistemic degradation without sacrificing capability or alignment tax. Includes formal proofs and empirical evaluation on GPT-4 class models.',
    link:'https://hooshaai.substack.com/p/implementing-grounded-causal-verification',
    code:'https://github.com/Hooshaai/consciousness_in_LLMs',
    bib:`@article{majlesi2026causal,
  title  = {Implementing Grounded Causal Verification to Prevent Recursive Epistemic Collapse},
  author = {Majlesi, Mohammad Taha},
  year   = {2026},
  journal = {Hoosha AI Research}
}`
  },
  {
    year:'2026', badge:'Technical Report',
    title:'GRPO Unlocked: Building a Math-Reasoning LLM from First Principles',
    authors:'Mohammad Taha Majlesi · Hoosha AI Lab',
    venue:'Hoosha AI Technical Report — May 2026',
    abstract:'Full implementation of Group Relative Policy Optimisation for GSM8K math reasoning. We design a custom reward model, clipped surrogate objective, and KL regularisation schedule, achieving 80.7% pass@1 on a 4B LLM — an 18% relative gain over SFT baseline on 8×A100.',
    link:'https://hooshaai.substack.com/p/grpo-unlocked-building-a-math-reasoning',
    code:'https://github.com/tahamajs/FineTuning-4B-LLM-GSM8k-GRPO-SFT',
    bib:`@techreport{majlesi2026grpo,
  title  = {GRPO Unlocked: Building a Math-Reasoning LLM from First Principles},
  author = {Majlesi, Mohammad Taha},
  year   = {2026},
  institution = {Hoosha AI Research}
}`
  },
  {
    year:'2025', badge:'Course Research Project',
    title:'Vision Language Models and Flow Matching for Open-Vocabulary Generation',
    authors:'Mohammad Taha Majlesi',
    venue:'Deep Generative Models Course, University of Tehran — HW4, 2025',
    abstract:'PaliGemma QLoRA fine-tuning combined with conditional Flow Matching image synthesis. Demonstrates 3× sample quality improvement (FID: 4.21 vs 9.87) vs. DDPM baseline on MSCOCO using only 20 ODE integration steps.',
    link:'https://github.com/tahamajs/Vision_Language_Models_and_Flow_Matching_DeepGenModels_HW4',
    code:'https://github.com/tahamajs/Vision_Language_Models_and_Flow_Matching_DeepGenModels_HW4',
    bib:`@misc{majlesi2025vlm,
  title  = {Vision Language Models and Flow Matching for Open-Vocabulary Generation},
  author = {Majlesi, Mohammad Taha},
  year   = {2025},
  note   = {Deep Generative Models Course, University of Tehran}
}`
  },
  {
    year:'2025', badge:'Research Paper',
    title:'Shortcut Learning Through the Lens of Task Arithmetic',
    authors:'Mohammad Taha Majlesi · Hoosha AI Research',
    venue:'Hoosha AI Research — 2025',
    abstract:'Novel approach using Task Arithmetic (weight-space interpolation) to surgically remove shortcut features from fine-tuned transformers without full retraining. We show that shortcut task vectors can be isolated and subtracted, reducing spurious correlation reliance by 71% on NLI benchmarks.',
    link:'https://github.com/tahamajs/Shortcut_Learning_Through_the_Lens_of_Task_Arithmetic',
    code:'https://github.com/tahamajs/Shortcut_Learning_Through_the_Lens_of_Task_Arithmetic',
    bib:`@article{majlesi2025shortcut,
  title  = {Shortcut Learning Through the Lens of Task Arithmetic},
  author = {Majlesi, Mohammad Taha},
  year   = {2025},
  journal = {Hoosha AI Research}
}`
  },
];

const CMD_ITEMS = [
  { text:'Open AI Research Assistant',           icon:'fas fa-robot',           id:'ai' },
  { text:'Open Recruit / Hire Taha',             icon:'fas fa-briefcase',       id:'hire' },
  { text:'Toggle Constellation / Bento view',    icon:'fas fa-project-diagram', id:'view' },
  { text:'Open LinkedIn (17.1k followers)',       icon:'fab fa-linkedin',        id:'linkedin' },
  { text:'View HuggingFace (162 assets)',         icon:'fas fa-robot',           id:'hf' },
  { text:'Read Hoosha AI Substack',              icon:'fas fa-newspaper',       id:'substack' },
  { text:'Email Taha directly',                  icon:'fas fa-envelope',        id:'email' },
  { text:'Download Resume PDF',                  icon:'fas fa-file-pdf',        id:'resume' },
];

function App() {
  const [data, setData]               = useState({ repos:[], articles:[], hf:[] });
  const [search, setSearch]           = useState('');
  const [filter, setFilter]           = useState('all');
  const [hfFilter, setHfFilter]       = useState('all');
  const [subSearch, setSubSearch]     = useState('');
  const [viewMode, setViewMode]       = useState('bento');
  const [accent, setAccent]           = useState('cyan');
  const [mobileNav, setMobileNav]     = useState(false);
  const [codeTab, setCodeTab]         = useState('flow');
  const [codeOut, setCodeOut]         = useState('');
  const [cmdQ, setCmdQ]               = useState('');
  const [activeNode, setActiveNode]   = useState(null);
  const [aiOpen, setAiOpen]           = useState(false);
  const [cmdOpen, setCmdOpen]         = useState(false);
  const [hireOpen, setHireOpen]       = useState(false);
  const [readmeOpen, setReadmeOpen]   = useState(false);
  const [soundOn, setSoundOn]         = useState(false);
  const [speechOn, setSpeechOn]       = useState(false);
  const [tehranTime, setTehranTime]   = useState('--:--:--');
  const [gpuM, setGpuM]               = useState({ flops:'312.0', vram:'68.4', lat:'1.20', temp:'52' });
  const [bibtexPub, setBibtexPub]     = useState(null);
  const [msgs, setMsgs]               = useState([{ who:'bot', text:"👋 I'm Taha's AI research assistant. Ask me about <b>Flow Matching</b>, <b>GRPO</b>, <b>Hoosha AI</b>, <b>Kaleido Engine</b>, the <b>17.1k LinkedIn community</b>, or how to <b>hire Taha</b>!" }]);
  const [chatInput, setChatInput]     = useState('');
  const [toast, showToast]            = useToast();
  const audioCtx                      = useRef(null);

  /* ── audio ── */
  const beep = useCallback((freq=440, type='sine', vol=0.03) => {
    if (!soundOn) return;
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext||window.webkitAudioContext)();
      const ctx=audioCtx.current, osc=ctx.createOscillator(), g=ctx.createGain();
      osc.type=type; osc.frequency.value=freq;
      g.gain.setValueAtTime(vol,ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+0.18);
      osc.connect(g); g.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime+0.18);
    } catch(_){}
  }, [soundOn]);

  const speak = useCallback(txt => {
    if (!speechOn || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(txt.replace(/<[^>]+>/g,'')));
  }, [speechOn]);

  /* ── fetch data ── */
  useEffect(()=>{ fetch('data.json').then(r=>r.json()).then(d=>setData(d)).catch(()=>{}); },[]);

  /* ── clock ── */
  useEffect(()=>{
    const id=setInterval(()=>{
      setTehranTime(new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Tehran',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true}).format(new Date()));
    },1000); return()=>clearInterval(id);
  },[]);

  /* ── GPU flicker ── */
  useEffect(()=>{
    const id=setInterval(()=>setGpuM({
      flops:(308+Math.random()*8).toFixed(1), vram:(67+Math.random()*3).toFixed(1),
      lat:(1.1+Math.random()*0.25).toFixed(2), temp:(50+Math.random()*6|0)+''
    }),1800); return()=>clearInterval(id);
  },[]);

  /* ── keyboard shortcuts ── */
  useEffect(()=>{
    const fn=e=>{
      if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();setCmdOpen(p=>!p);}
      if(e.key==='Escape'){setCmdOpen(false);setAiOpen(false);setHireOpen(false);setReadmeOpen(false);setActiveNode(null);setMobileNav(false);setBibtexPub(null);}
    };
    window.addEventListener('keydown',fn); return()=>window.removeEventListener('keydown',fn);
  },[]);

  /* ── canvas: stars + comets + spotlight ── */
  useEffect(()=>{
    const spot=document.getElementById('cursor-spotlight');
    const onMov=e=>{if(spot){spot.style.left=e.clientX+'px';spot.style.top=e.clientY+'px';}};
    window.addEventListener('mousemove',onMov);
    const cvs=document.getElementById('neural-canvas');
    if(!cvs) return;
    const ctx=cvs.getContext('2d',{alpha:true});
    let W=cvs.width=innerWidth, H=cvs.height=innerHeight;
    const N=W>700?70:32;
    const pts=Array.from({length:N},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6,r:Math.random()*1.8+.5,a:Math.random(),da:(Math.random()*.02+.004)*(Math.random()<.5?1:-1)}));
    const comets=[]; const spawnComet=()=>comets.push({x:Math.random()*W,y:Math.random()*H*.4,len:Math.random()*90+40,spd:Math.random()*9+5,ang:Math.PI/4,a:1,da:.015+Math.random()*.015});
    const ct=setInterval(()=>{if(Math.random()<.7)spawnComet();},2500);
    let raf, last=0;
    const draw=ts=>{
      if(ts-last<16){raf=requestAnimationFrame(draw);return;} last=ts;
      ctx.clearRect(0,0,W,H);
      for(let i=0;i<pts.length;i++){
        for(let j=i+1;j<pts.length;j++){
          const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d2=dx*dx+dy*dy;
          if(d2<14000){ctx.beginPath();ctx.strokeStyle=`rgba(0,240,255,${.12*(1-Math.sqrt(d2)/118)})`;ctx.lineWidth=.5;ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke();}
        }
        const p=pts[i];
        p.x+=p.vx;p.y+=p.vy;
        if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
        p.a+=p.da;if(p.a<.15||p.a>1)p.da*=-1;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fillStyle=`rgba(0,240,255,${p.a*.7})`;ctx.fill();
      }
      for(let i=comets.length-1;i>=0;i--){
        const c=comets[i];
        const ex=c.x+Math.cos(c.ang)*c.len,ey=c.y+Math.sin(c.ang)*c.len;
        const g=ctx.createLinearGradient(c.x,c.y,ex,ey);
        g.addColorStop(0,`rgba(255,255,255,${c.a})`);g.addColorStop(.4,`rgba(0,240,255,${c.a*.8})`);g.addColorStop(1,'rgba(138,43,226,0)');
        ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(ex,ey);ctx.strokeStyle=g;ctx.lineWidth=2.4;ctx.stroke();
        c.x+=Math.cos(c.ang)*c.spd;c.y+=Math.sin(c.ang)*c.spd;c.a-=c.da;
        if(c.a<=0||c.x>W||c.y>H)comets.splice(i,1);
      }
      raf=requestAnimationFrame(draw);
    };
    raf=requestAnimationFrame(draw);
    const onRes=()=>{W=cvs.width=innerWidth;H=cvs.height=innerHeight;};
    window.addEventListener('resize',onRes);
    return()=>{window.removeEventListener('mousemove',onMov);window.removeEventListener('resize',onRes);clearInterval(ct);cancelAnimationFrame(raf);};
  },[]);

  /* ── derived data ── */
  const repos=useMemo(()=>(data.repos||[]).filter(r=>{
    const ok=filter==='all'||r.cat===filter;
    const q=search.trim().toLowerCase();
    return ok&&(!q||(r.name+r.desc+r.lang+r.tag).toLowerCase().includes(q));
  }),[data.repos,filter,search]);

  const articles=useMemo(()=>{const q=subSearch.trim().toLowerCase();return(data.articles||[]).filter(a=>!q||(a.title+a.desc).toLowerCase().includes(q));},[data.articles,subSearch]);
  const hfAssets=useMemo(()=>(data.hf||[]).filter(h=>hfFilter==='all'||h.type===hfFilter),[data.hf,hfFilter]);
  const counts=useMemo(()=>{const r=data.repos||[];return{all:r.length,course:r.filter(x=>x.cat==='course').length,ai:r.filter(x=>x.cat==='ai').length,systems:r.filter(x=>x.cat==='systems').length,web:r.filter(x=>x.cat==='web').length};},[data.repos]);

  /* ── AI chat ── */
  const handleChat=q=>{
    if(!q?.trim()) return;
    setMsgs(p=>[...p,{who:'user',text:q.trim()}]); setChatInput('');
    const lo=q.toLowerCase();
    let r="I'm Taha's AI assistant 🤖 — Co-Founder of Hoosha AI, AI Architect, and researcher in Flow Matching, GRPO, and CUDA systems.";
    if(lo.includes('linkedin')||lo.includes('follower')) r="💼 Taha's LinkedIn has grown to <b>17,100+ followers</b> through weekly research deep-dives on AI systems, LLM alignment, and GPU engineering.";
    else if(lo.includes('hoosha')) r="🧠 <b>Hoosha AI</b> is Taha's research startup on cognitive AI: Flow Matching generative models, GRPO post-training, and IIT-based synthetic consciousness research. Substack: <a href='https://hooshaai.substack.com' target='_blank'>hooshaai.substack.com</a>.";
    else if(lo.includes('flow')) r="🎨 <b>Conditional Flow Matching</b> defines a continuous-time ODE: learn vθ(t,x) so that integrating from x₀~N(0,I) lands on data x₁. No SDE noise during inference, 20 ODE steps, FID 4.21 on MSCOCO vs 9.87 for DDPM.";
    else if(lo.includes('grpo')) r="📐 <b>GRPO</b> (Group Relative Policy Optimisation) fine-tunes LLMs for math reasoning via group-normalised clipped surrogate + KL penalty. Taha achieved <b>80.7% pass@1 on GSM8K</b> (+18% vs SFT baseline) on a 4B LLM with 8×A100.";
    else if(lo.includes('kaleido')||lo.includes('cuda')) r="⚡ <b>Kaleido Engine</b> is Taha's from-scratch 4D-parallel LLM training framework in CUDA 12.2 / C++ / PyTorch targeting A100 SXM4 clusters — fused FP16 all-reduce, pipeline parallel, and ring attention.";
    else if(lo.includes('sharif')||lo.includes('teach')||lo.includes('ta')) r="🎓 Taha is TA at <b>Sharif University</b> (Compiler Construction) and <b>University of Tehran</b> (M.Sc. ML, AI, C++ Advanced Programming, OS Lab), mentoring <b>500+ students</b> across 6 courses.";
    else if(lo.includes('svd')||lo.includes('linear attention')) r="🔬 <b>SVD Linear Attention</b>: Taha's rank-r approximation to full softmax attention — 6× less memory, 6.1× speedup on 4k-token sequences, retaining 94% quality (BLEU-4: 28.4 vs 30.2).";
    else if(lo.includes('email')||lo.includes('contact')||lo.includes('hire')) r="📧 Email: <a href='mailto:tahamajlesi@ut.ac.ir'>tahamajlesi@ut.ac.ir</a> | Telegram: <a href='https://telegram.me/tahamajlesii'>@tahamajlesii</a> | LinkedIn: <a href='https://linkedin.com/in/tahamajlesi'>linkedin.com/in/tahamajlesi</a>";
    else if(lo.includes('paper')||lo.includes('pub')||lo.includes('substack')) r="📄 Taha has published <b>20 research papers</b> on Hoosha AI Substack covering Flow Matching ODEs, GRPO alignment, CUDA kernel engineering, IIT consciousness, SVD attention, and machine unlearning.";
    setTimeout(()=>{setMsgs(p=>[...p,{who:'bot',text:r}]);beep(810,'triangle');speak(r);},350);
  };

  /* ── cmd actions ── */
  const runCmd=id=>{
    setCmdOpen(false);
    const map={
      ai:()=>setAiOpen(true), hire:()=>setHireOpen(true),
      view:()=>setViewMode(p=>p==='bento'?'constellation':'bento'),
      linkedin:()=>window.open('https://linkedin.com/in/tahamajlesi','_blank'),
      hf:()=>window.open('https://huggingface.co/tahamajs','_blank'),
      substack:()=>window.open('https://hooshaai.substack.com','_blank'),
      email:()=>window.location.href='mailto:tahamajlesi@ut.ac.ir',
      resume:()=>window.open('assets/resume.pdf','_blank'),
    };
    (map[id]||(() => {}))();
  };

  /* ── helpers ── */
  const copyBib=bib=>{navigator.clipboard.writeText(bib);beep(700,'square');showToast('📄 BibTeX copied!');setBibtexPub(null);};
  const setAccentColor=c=>{setAccent(c);document.body.setAttribute('data-accent',c);beep(800);showToast(`Theme: ${c} ✨`);};

  /* ── Overlay Modal ── */
  const Modal=({open,onClose,children})=>!open?null:(
    <div className="modal-overlay active" onClick={onClose}>
      <div onClick={e=>e.stopPropagation()}>{children}</div>
    </div>
  );
