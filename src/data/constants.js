// src/data/constants.js — all static data for the portfolio

export const TAGS = [
  'Flow Matching ODEs','GRPO Alignment','Score-Based Diffusion','Task Arithmetic',
  'CUDA GPU Kernels','Linear Attention','Integrated Information Theory',
  'PaliGemma QLoRA','xv6 OS Kernel','Persian LLMs','Kaleido Engine','SVD Attention',
];

export const STATS = [
  { num:'12,787', label:'Commits (Past Year)' },
  { num:'143',    label:'GitHub Repositories' },
  { num:'92/70',  label:'HF Models / Datasets' },
  { num:'521',    label:'GitHub Followers' },
  { num:'17.1k+', label:'LinkedIn Followers' },
  { num:'20',     label:'Research Papers' },
];

export const ACHIEVEMENTS = [
  { icon:'fa-users',        val:'17.1k+', title:'LinkedIn Community',       desc:'One of Iran\'s largest AI communities — weekly deep-dives on LLM alignment, GPU engineering, and distributed systems.' },
  { icon:'fa-code-commit',  val:'12,787', title:'Commits (Past Year)',      desc:'Top 1% globally for open-source contribution velocity across 143 public repositories and 44 showcased projects.' },
  { icon:'fa-robot',        val:'162',    title:'Hugging Face Assets',      desc:'92 pre-trained model checkpoints + 70 synthetic evaluation datasets published openly on the HF Hub.' },
  { icon:'fa-newspaper',    val:'20',     title:'Research Papers',          desc:'Deep-dive Substack papers on Flow Matching, GRPO, CUDA kernels, IIT consciousness, and sub-quadratic attention.' },
  { icon:'fa-graduation-cap',val:'500+',  title:'Students Mentored',        desc:'TA across 6 graduate / undergraduate courses at University of Tehran and Sharif University of Technology.' },
  { icon:'fa-microchip',    val:'4D',     title:'Kaleido CUDA Engine',      desc:'First-principles distributed LLM training framework — data, tensor, sequence & pipeline parallelism on A100 clusters.' },
  { icon:'fa-flask',        val:'∞',      title:'Hoosha AI Co-Founder',     desc:'Research startup bridging frontier ML (Flow Matching, GRPO) with IIT-based synthetic cognitive AI research.' },
  { icon:'fa-heart',        val:'Open',   title:'GitHub Sponsor',           desc:'Support Taha\'s open-source work on CUDA engines, Persian LLMs, and AI research tooling via GitHub Sponsors.' },
];

export const SKILLS = [
  { cat:'Languages',       items:['Python','C++ 20','CUDA/C','Kotlin','Java','JavaScript','Verilog','Bash'] },
  { cat:'ML / AI',         items:['PyTorch 2.x','JAX/Flax','HuggingFace','DeepSpeed','PEFT / QLoRA','TRL / GRPO'] },
  { cat:'GPU Systems',     items:['CUDA 12.2','cuBLAS','NCCL','MPI','Triton','Nsight Compute'] },
  { cat:'Infra & DevOps',  items:['Docker','GitHub Actions','FastAPI','Django REST','PostgreSQL','Redis'] },
  { cat:'Research Topics', items:['Flow Matching','Diffusion SDEs','RLHF/GRPO','Linear Attention','VAE Unlearning','IIT Φ'] },
  { cat:'Systems CS',      items:['xv6 OS Kernel','Pipelined ARM CPU','Compilers (Flex/Bison)','TCP/UDP Sockets','Verilog RTL'] },
];

export const TIMELINE = [
  { year:'2026', icon:'fa-rocket',        color:'#00f0ff', title:'Co-Founded Hoosha AI 🧠',                     desc:'Launched AI research startup focused on Flow Matching generation, GRPO post-training, and IIT-based synthetic cognition.' },
  { year:'2026', icon:'fa-newspaper',     color:'#8a2be2', title:'20 Substack Research Papers Published',        desc:'Deep-dive technical papers on Flow Matching ODEs, GRPO, CUDA kernels, IIT consciousness theory, and SVD linear attention.' },
  { year:'2026', icon:'fa-users',         color:'#10b981', title:'17,100+ LinkedIn Community',                   desc:'Built one of Iran\'s largest AI communities through consistent research content, open-source tooling, and GPU engineering posts.' },
  { year:'2025', icon:'fa-graduation-cap',color:'#f59e0b', title:'TA @ Sharif — Compiler Construction',          desc:'Teaching Assistant for Compiler Construction at Sharif University of Technology, supervising 200+ students on lexers and parsers.' },
  { year:'2025', icon:'fa-microchip',     color:'#00f0ff', title:'Built Kaleido Engine ⚡ (4D CUDA Parallel)',   desc:'From-scratch distributed LLM training framework in CUDA 12.2/C++ — data, tensor, sequence, and pipeline parallelism on A100 SXM4.' },
  { year:'2025', icon:'fa-brain',         color:'#8a2be2', title:'GRPO GSM8K: 80.7% (+18% rel. over SFT)',      desc:'Fine-tuned 4B LLM with custom GRPO pipeline: clipped surrogate objective + KL regularisation on 8×A100, achieving 80.7% pass@1.' },
  { year:'2024', icon:'fa-graduation-cap',color:'#10b981', title:'TA @ UT — M.Sc. ML, AI, OS Lab, C++',        desc:'Teaching Assistant for 4 simultaneous graduate/undergraduate courses at University of Tehran — 300+ students mentored.' },
  { year:'2024', icon:'fa-robot',         color:'#f59e0b', title:'162 HuggingFace Assets Published',             desc:'Reached 162 public HF assets: 92 pre-trained model checkpoints and 70 synthetic evaluation datasets with 1000+ total downloads.' },
  { year:'2023', icon:'fa-graduation-cap',color:'#00f0ff', title:'Started CE at University of Tehran',           desc:'Enrolled in Computer Engineering at University of Tehran — focus on systems architecture, AI research, and distributed computing.' },
];

export const CONSTELLATION = [
  { id:'core',    label:'Taha Majlesi',       type:'core',     x:50, y:50, desc:'Co-Founder & AI Architect @ Hoosha AI | CE @ University of Tehran | TA @ Sharif University of Technology' },
  { id:'hoosha',  label:'Hoosha AI 🧠',       type:'startup',  x:24, y:28, desc:'Frontier AI research startup: Flow Matching, GRPO post-training, IIT-based synthetic consciousness, distributed GPU systems.' },
  { id:'ut',      label:'Univ. of Tehran',    type:'academic', x:75, y:28, desc:'Primary CE degree. TA for M.Sc. ML, AI, OS Lab, Advanced Programming — mentoring 500+ students across 6 courses.' },
  { id:'sharif',  label:'Sharif Univ.',       type:'academic', x:78, y:72, desc:'Cross-institutional TA for Compiler Construction at Sharif University of Technology (2025–present).' },
  { id:'kaleido', label:'Kaleido Engine ⚡',  type:'system',   x:22, y:72, desc:'From-scratch 4D-parallel distributed LLM training in CUDA 12.2/C++ targeting A100 SXM4 clusters.' },
  { id:'hf',      label:'HuggingFace (162)',  type:'science',  x:50, y:16, desc:'92 pre-trained model weights & 70 synthetic datasets. Top: persian-instruct-200k (312 downloads).' },
  { id:'sub',     label:'Substack (20)',       type:'research', x:50, y:84, desc:'20 technical deep-dives: Flow Matching ODEs, GRPO alignment, CUDA kernels, IIT consciousness, SVD linear attention.' },
  { id:'linkedin',label:'LinkedIn 17.1k',     type:'startup',  x:12, y:50, desc:'17,100+ followers — Iran\'s largest AI community. Weekly posts on LLM alignment and GPU engineering.' },
];

export const CMD_ITEMS = [
  { text:'Open AI Research Assistant',         icon:'fas fa-robot',           id:'ai' },
  { text:'Open Recruit / Hire Taha',            icon:'fas fa-briefcase',       id:'hire' },
  { text:'Sponsor Taha on GitHub',              icon:'fas fa-heart',           id:'sponsor' },
  { text:'View GPU Cluster Telemetry',         icon:'fas fa-chart-bar',       id:'telemetry' },
  { text:'Explore AI Lab & Simulations',       icon:'fas fa-vial',            id:'sandbox' },
  { text:'View Research Constellation Graph',  icon:'fas fa-project-diagram', id:'constellation' },
  { text:'Browse Projects & HF Assets',        icon:'fas fa-cubes',           id:'projects' },
  { text:'Read Publications & Papers',          icon:'fas fa-scroll',          id:'publications' },
  { text:'View X Feed (@hooshaaii)',           icon:'fab fa-x-twitter',       id:'feed' },
  { text:'Read Substack Essays',                icon:'fas fa-newspaper',       id:'substack' },
  { text:'Open LinkedIn (17.1k followers)',     icon:'fab fa-linkedin',        id:'linkedin' },
  { text:'View HuggingFace (162 assets)',       icon:'fas fa-brain',           id:'hf' },
  { text:'Email Taha directly',                 icon:'fas fa-envelope',        id:'email' },
  { text:'Download Resume PDF',                 icon:'fas fa-file-pdf',        id:'resume' },
];
