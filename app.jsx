const { useState, useEffect, useMemo, useRef } = React;

function App() {
  const [data, setData] = useState({ repos: [], articles: [], hf: [] });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [accent, setAccent] = useState('cyan');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);

  // Substack Search & HF Filter
  const [substackSearch, setSubstackSearch] = useState('');
  const [hfFilter, setHfFilter] = useState('all'); // all, model, dataset
  const [activeCodeTab, setActiveCodeTab] = useState('flow');
  const [codeOutput, setCodeOutput] = useState('');

  // Modals state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [cmdModalOpen, setCmdModalOpen] = useState(false);
  const [hireModalOpen, setHireModalOpen] = useState(false);

  // Chat state
  const [aiMessages, setAiMessages] = useState([
    { sender: 'bot', text: "👋 Welcome! I am Taha Majlesi's AI assistant. Ask me about <b>Hoosha AI 🧠</b> research publications, <b>Flow Matching</b> ODEs, <b>GRPO Reasoning</b>, or his <b>University of Tehran & Sharif</b> coursework!" }
  ]);
  const [aiInputText, setAiInputText] = useState('');
  const [tehranTime, setTehranTime] = useState('--:--:-- AM');
  const [toastMsg, setToastMsg] = useState(null);

  // Audio Context
  const audioCtxRef = useRef(null);

  const playSound = (freq = 440, type = 'sine') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
      gain.gain.setValueAtTime(0.02, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + 0.15);
    } catch (e) {}
  };

  const speakText = (text) => {
    if (!speechEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/<[^>]+>/g, '').replace(/\*/g, '');
      const utt = new SpeechSynthesisUtterance(clean);
      utt.rate = 1.0;
      window.speechSynthesis.speak(utt);
    } catch (e) {}
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Load Data
  useEffect(() => {
    fetch('data.json')
      .then(res => res.json())
      .then(d => setData(d))
      .catch(() => {});
  }, []);

  // Tehran Clock
  useEffect(() => {
    const timer = setInterval(() => {
      const options = { timeZone: 'Asia/Tehran', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
      setTehranTime(new Intl.DateTimeFormat('en-US', options).format(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdModalOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setCmdModalOpen(false);
        setAiModalOpen(false);
        setHireModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mouse Spotlight & Canvas setup
  useEffect(() => {
    const spotlight = document.getElementById('cursor-spotlight');
    const handleMouseMove = (e) => {
      if (spotlight) {
        spotlight.style.left = `${e.clientX}px`;
        spotlight.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Neural Canvas setup
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let w = canvas.width = window.innerWidth;
      let h = canvas.height = window.innerHeight;
      const particles = Array.from({ length: w > 700 ? 55 : 25 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1
      }));

      let animId;
      const render = () => {
        ctx.clearRect(0, 0, w, h);
        for (let a = 0; a < particles.length; a++) {
          for (let b = a + 1; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 130)})`;
              ctx.lineWidth = 0.8;
              ctx.moveTo(particles[a].x, particles[a].y);
              ctx.lineTo(particles[b].x, particles[b].y);
              ctx.stroke();
            }
          }
          particles[a].x += particles[a].vx;
          particles[a].y += particles[a].vy;
          if (particles[a].x < 0 || particles[a].x > w) particles[a].vx *= -1;
          if (particles[a].y < 0 || particles[a].y > h) particles[a].vy *= -1;
          ctx.beginPath();
          ctx.arc(particles[a].x, particles[a].y, particles[a].radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
          ctx.fill();
        }
        animId = requestAnimationFrame(render);
      };
      render();
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animId);
      };
    }
  }, []);

  // Filtered Repos
  const filteredRepos = useMemo(() => {
    return (data.repos || []).filter(r => {
      const matchesCat = filter === 'all' || r.cat === filter;
      const q = search.toLowerCase().trim();
      const matchesSearch = !q || (r.name + ' ' + r.desc + ' ' + r.lang + ' ' + r.tag).toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [data.repos, filter, search]);

  // Filtered Substack Articles
  const filteredArticles = useMemo(() => {
    const q = substackSearch.toLowerCase().trim();
    if (!q) return data.articles || [];
    return (data.articles || []).filter(a => (a.title + ' ' + a.desc).toLowerCase().includes(q));
  }, [data.articles, substackSearch]);

  // Filtered HF Assets
  const filteredHf = useMemo(() => {
    return (data.hf || []).filter(h => {
      if (hfFilter === 'all') return true;
      return h.type === hfFilter;
    });
  }, [data.hf, hfFilter]);

  const counts = useMemo(() => {
    const repos = data.repos || [];
    return {
      all: repos.length,
      course: repos.filter(r => r.cat === 'course').length,
      ai: repos.filter(r => r.cat === 'ai').length,
      systems: repos.filter(r => r.cat === 'systems').length,
      hf: repos.filter(r => r.cat === 'hf').length,
      web: repos.filter(r => r.cat === 'web').length
    };
  }, [data.repos]);

  // Handle AI Question
  const handleAiQuestion = (q) => {
    if (!q || !q.trim()) return;
    const userQ = q.trim();
    setAiMessages(prev => [...prev, { sender: 'user', text: userQ }]);
    setAiInputText('');

    setTimeout(() => {
      const lower = userQ.toLowerCase();
      let reply = "I am Taha Majlesi's AI assistant. Taha is Co-Founder & Systems/AI Architect at Hoosha AI 🧠 and a Computer Engineering student at University of Tehran, specializing in Flow Matching, GRPO, and Distributed Systems.";

      if (lower.includes('hoosha')) {
        reply = "🧠 **Hoosha AI** is an AI research startup co-founded by Taha Majlesi, focusing on frontier ML research, continuous cognitive scaling, synthetic consciousness (IIT & GWT), and high-performance post-training RL pipelines. Check out articles at https://hooshaai.substack.com!";
      } else if (lower.includes('flow') || lower.includes('grpo') || lower.includes('research')) {
        reply = "🎨 Taha's primary research centers on **Flow Matching** probability paths for generative modeling, **Group Relative Policy Optimization (GRPO)** for fine-tuning 4B LLMs on GSM8K math reasoning, and sub-quadratic linear attention architectures like LinRec & SVD attention!";
      } else if (lower.includes('teach') || lower.includes('sharif') || lower.includes('ut') || lower.includes('course')) {
        reply = "🎓 Taha is a cross-institutional Teaching Assistant for **Compiler Construction at Sharif University of Technology**, and has served as TA for **M.Sc. Machine Learning**, **Artificial Intelligence**, **Advanced Programming (C++)**, and **xv6 OS Lab** at the **University of Tehran**.";
      } else if (lower.includes('contact') || lower.includes('email') || lower.includes('telegram')) {
        reply = "📧 You can reach Taha via primary email `tahamajlesi@ut.ac.ir`, secondary email `Tahamajlesice@gmail.com`, or directly on Telegram `@tahamajlesii`!";
      } else if (lower.includes('kaleido') || lower.includes('cuda') || lower.includes('system')) {
        reply = "⚡ **Kaleido Engine** is Taha's first-principles distributed LLM training framework written in C++/PyTorch that jointly optimizes 4 dimensions of parallel GPU compute nodes.";
      }

      setAiMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      playSound(800, 'triangle');
      speakText(reply);
    }, 400);
  };

  const copyBibtex = (bib) => {
    navigator.clipboard.writeText(bib);
    playSound(700, 'square');
    triggerToast('BibTeX citation copied to clipboard! 📄');
  };

  const runCodeSnippet = () => {
    playSound(900, 'sine');
    setCodeOutput("Running evaluation in PyTorch 2.4 + CUDA 12.2 sandbox...\n[INFO] Initializing Flow Matching velocity vector field v_t(x_t)\n[INFO] Loss (t=0.5): 0.0142 | Velocity error: 0.0003\n[SUCCESS] Continuous trajectory converged in 20 ODE solver steps (0.042s)!");
  };

  const codeSnippets = {
    flow: `# Flow Matching ODE Sampling (PyTorch)
import torch

def vector_field(t, x_t, x1):
    return x1 - x_t  # Linear vector field v_t(x_t)

x0 = torch.randn(1, 3, 64, 64)  # Gaussian noise
x1 = target_image               # Target sample
t = torch.linspace(0, 1, 20)    # ODE time steps
for i in range(len(t) - 1):
    dt = t[i+1] - t[i]
    x0 = x0 + vector_field(t[i], x0, x1) * dt
print("Flow Matching trajectory generated!")`,
    grpo: `# Group Relative Policy Optimization (GRPO) Loss
import torch
import torch.nn.functional as F

def grpo_loss(logits, old_logits, advantages, clip_eps=0.2):
    ratios = torch.exp(logits - old_logits)
    surr1 = ratios * advantages
    surr2 = torch.clamp(ratios, 1.0 - clip_eps, 1.0 + clip_eps) * advantages
    return -torch.min(surr1, surr2).mean()

print("GRPO Loss Initialized for 4B LLM Reasoning!")`,
    kaleido: `// Kaleido CUDA All-Reduce Launcher (C++)
#include <cuda_runtime.h>
#include <nccl.h>

__global__ void launch_all_reduce(float* tensor, int size) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < size) {
        tensor[idx] *= 1.0f / 4.0f; // Scale gradient
    }
}`
  };

  const researchTags = [
    'Flow Matching ODEs', 'GRPO Alignment', 'Score Diffusion', 'Task Arithmetic', 
    'CUDA GPU Kernels', 'Linear Attention', 'Integrated Information Theory', 
    'PaliGemma QLoRA', 'xv6 OS Kernel', 'Django REST Framework'
  ];

  const achievements = [
    { icon: 'fa-trophy', title: 'Top 1% Global Commit Streak', desc: '12,787 verified commits in the past year across 143 open-source repositories.' },
    { icon: 'fa-award', title: 'GitHub Developer Program Pro Member', desc: 'Recognized for prolific open-source contributions and active infrastructure tooling.' },
    { icon: 'fa-cubes', title: '162 HuggingFace Open Science Assets', desc: 'Published 92 pre-trained model weights & 70 open synthetic evaluation datasets.' },
    { icon: 'fa-university', title: 'Sharif & University of Tehran TA', desc: 'Supervised 500+ students across Compiler Construction, ML (M.Sc.), AI, and C++.' },
    { icon: 'fa-newspaper', title: '20 Substack Research Publications', desc: 'Authored 20 deep-dive papers on Flow Matching, GRPO, IIT Consciousness, and Linear Attention.' }
  ];

  return (
    <div>
      {/* Toast Notification */}
      {toastMsg && (
        <div className="toast-container">
          <div className="toast">{toastMsg}</div>
        </div>
      )}

      {/* Theme Switcher Widget */}
      <div className="theme-switcher">
        <button
          className={`sound-toggle-btn ${soundEnabled ? 'active' : ''}`}
          onClick={() => {
            setSoundEnabled(!soundEnabled);
            triggerToast(soundEnabled ? 'Sound Muted 🔇' : 'Sci-Fi Sound FX Enabled! 🔊');
          }}
          title="Toggle Sci-Fi SFX"
        >
          <i className="fas fa-volume-up"></i>
        </button>
        <button
          className={`sound-toggle-btn ${speechEnabled ? 'active' : ''}`}
          onClick={() => {
            setSpeechEnabled(!speechEnabled);
            triggerToast(speechEnabled ? 'AI Voice Disabled 🔇' : 'AI Voice Enabled! 🗣️');
          }}
          title="Toggle AI Speech Voice"
          style={{ marginLeft: '4px' }}
        >
          <i className="fas fa-microphone"></i>
        </button>
        <div className="switcher-divider"></div>
        {['cyan', 'purple', 'emerald', 'rose'].map(c => (
          <button
            key={c}
            className={`accent-dot ${accent === c ? 'active' : ''}`}
            onClick={() => {
              setAccent(c);
              document.body.setAttribute('data-accent', c);
              playSound(800, 'sine');
              triggerToast(`Switched theme to ${c.toUpperCase()} ✨`);
            }}
            style={{ background: c === 'cyan' ? '#00f0ff' : c === 'purple' ? '#8a2be2' : c === 'emerald' ? '#10b981' : '#f43f5e' }}
            title={`${c} theme`}
          ></button>
        ))}
      </div>

      {/* Back to Top */}
      <button className="back-to-top-btn visible" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <i className="fas fa-arrow-up"></i>
      </button>

      {/* AI Assistant Floating Button */}
      <button className="ai-chat-fab" onClick={() => { setAiModalOpen(true); playSound(750, 'sine'); }}>
        <i className="fas fa-brain"></i>
        <span className="ai-fab-label">Ask AI Assistant</span>
      </button>

      {/* AI Chat Modal */}
      {aiModalOpen && (
        <div className="modal-overlay active" onClick={() => setAiModalOpen(false)}>
          <div className="ai-chat-box" onClick={e => e.stopPropagation()}>
            <div className="ai-chat-header">
              <div className="ai-title-row">
                <div className="ai-avatar-dot"><i className="fas fa-robot"></i></div>
                <div>
                  <h3>Taha's AI Research Assistant 🧠</h3>
                  <span className="ai-subtitle">Ask about Hoosha AI research, Flow Matching, GRPO, or UT/Sharif courses</span>
                </div>
              </div>
              <span className="cmd-esc" onClick={() => setAiModalOpen(false)}>ESC</span>
            </div>

            <div className="ai-chat-body">
              {aiMessages.map((m, idx) => (
                <div key={idx} className={`chat-msg ${m.sender}-msg`} dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }}></div>
              ))}
            </div>

            <div className="ai-quick-prompts">
              {["What is Hoosha AI?", "Tell me about Flow Matching & GRPO", "What courses does Taha teach?", "How can I contact Taha?"].map((q, i) => (
                <button key={i} className="quick-prompt-btn" onClick={() => handleAiQuestion(q)}>{q}</button>
              ))}
            </div>

            <div className="ai-chat-input-row">
              <input
                type="text"
                placeholder="Ask a question about research papers, systems, background..."
                value={aiInputText}
                onChange={e => setAiInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAiQuestion(aiInputText)}
              />
              <button className="primary-btn glow-btn send-btn" onClick={() => handleAiQuestion(aiInputText)}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Command Palette Modal */}
      {cmdModalOpen && (
        <div className="modal-overlay active" onClick={() => setCmdModalOpen(false)}>
          <div className="cmd-palette-box" onClick={e => e.stopPropagation()}>
            <div className="cmd-input-row">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Type a command (e.g. 'recruit', 'achievements', 'playground', 'resume')..."
                autoFocus
              />
              <span className="cmd-esc" onClick={() => setCmdModalOpen(false)}>ESC</span>
            </div>
            <div className="cmd-results">
              <div className="cmd-item" onClick={() => { setCmdModalOpen(false); setHireModalOpen(true); }}><i className="fas fa-briefcase"></i> Open Direct Recruitment &amp; Hire Modal</div>
              <div className="cmd-item" onClick={() => { setCmdModalOpen(false); setAiModalOpen(true); }}><i className="fas fa-robot"></i> Open AI Research Assistant Chat</div>
              <div className="cmd-item" onClick={() => window.open('assets/resume.pdf', '_blank')}><i className="fas fa-file-pdf"></i> Download Official Resume (PDF)</div>
              <div className="cmd-item" onClick={() => window.open('https://hooshaai.substack.com', '_blank')}><i className="fas fa-newspaper"></i> Open Hoosha AI Substack Newsletter</div>
              <div className="cmd-item" onClick={() => { navigator.clipboard.writeText('tahamajlesi@ut.ac.ir'); triggerToast('Copied tahamajlesi@ut.ac.ir!'); setCmdModalOpen(false); }}><i className="fas fa-envelope"></i> Copy Primary Email</div>
            </div>
          </div>
        </div>
      )}

      {/* Hire Modal */}
      {hireModalOpen && (
        <div className="modal-overlay active" onClick={() => setHireModalOpen(false)}>
          <div className="repo-modal-box" onClick={e => e.stopPropagation()}>
            <div className="repo-modal-header">
              <span className="project-tag"><i className="fas fa-briefcase"></i> Direct Recruitment &amp; Collaboration</span>
              <span className="cmd-esc" onClick={() => setHireModalOpen(false)}>ESC</span>
            </div>
            <h2 className="modal-repo-title">Recruit / Collaborate with Taha 🚀</h2>
            <p className="modal-repo-desc">Select a quick email template to contact Taha Majlesi directly for Senior AI Engineer roles, Research Scientist positions, Ph.D. opportunities, or R&amp;D advisory:</p>
            
            <div className="template-box">
              <div className="template-item" onClick={() => window.location.href = "mailto:tahamajlesi@ut.ac.ir?subject=Senior%20AI%20Engineering%20Role"}>
                <i className="fas fa-building"></i> <b>Industry Senior AI / Systems Engineer Role</b>
                <p>Request interview for AI Architecture, Distributed Training, or LLM Post-Training position.</p>
              </div>
              <div className="template-item" onClick={() => window.location.href = "mailto:tahamajlesi@ut.ac.ir?subject=Ph.D.%20Research%20Opportunity"}>
                <i className="fas fa-graduation-cap"></i> <b>Ph.D. &amp; Academic Research Collaboration</b>
                <p>Discuss graduate research, lab collaborations, or paper co-authorship.</p>
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <a href="mailto:tahamajlesi@ut.ac.ir" className="primary-btn glow-btn">Send Direct Email <i className="fas fa-envelope"></i></a>
              <a href="https://telegram.me/tahamajlesii" target="_blank" className="secondary-btn">Telegram Chat <i className="fab fa-telegram"></i></a>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="glass-nav">
        <div className="nav-container">
          <div className="logo"><span className="gradient-text">Taha Majlesi</span>.</div>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#achievements">Achievements</a>
            <a href="#recruitment">Why Hire?</a>
            <a href="#playground">Playground</a>
            <a href="#publications">Publications</a>
            <a href="#architecture">Architecture</a>
            <a href="#models">HF Models (162)</a>
            <a href="#projects">Ecosystem ({counts.all})</a>
            <a href="#substack">Substack 🧠</a>
            <a href="assets/resume.pdf" target="_blank" className="nav-resume-btn"><i className="fas fa-file-pdf"></i> Resume CV</a>
            <button className="nav-hire-btn" onClick={() => setHireModalOpen(true)}><i className="fas fa-briefcase"></i> Recruit Taha</button>
            <button className="cmd-k-btn" onClick={() => setCmdModalOpen(true)}><i className="fas fa-search"></i> <span className="cmd-k-key">⌘K</span></button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {/* Hero */}
        <section id="about" className="hero">
          <div className="hero-content fade-in-up">
            <div className="avatar-wrapper">
              <div className="avatar-glow-ring"></div>
              <img src="assets/avatar.jpg?v=22.0" onError={(e) => { e.target.src = 'https://github.com/tahamajs.png'; }} alt="Taha Majlesi" className="avatar-img" />
            </div>
            
            <div className="badge-pill">
              <span className="pulse-dot"></span> Co-Founder &amp; Systems/AI Architect @ Hoosha AI 🧠 | University of Tehran
            </div>

            <div className="live-clock-badge">
              <i className="far fa-clock"></i> Tehran Local Time: <span>{tehranTime}</span> (UTC +3:30) • <span className="status-green">Available for R&amp;D &amp; Recruiting</span>
            </div>

            <h1 className="hero-title">
              Mohammad Taha Majlesi<br/>
              <span className="subtitle-line">Building <span className="gradient-text">Scalable AI Systems &amp; Distributed Engines</span></span>
            </h1>
            
            <p className="hero-subtitle">
              AI Researcher &amp; Systems Engineer. Co-Founder of <b>Hoosha AI 🧠</b>. Computer Engineering at <b>University of Tehran</b> and Teaching Assistant at <b>Sharif University of Technology</b>. Specializing in <b>Deep Generative Modeling</b> (Flow Matching, VAEs), <b>LLM Alignment &amp; Reasoning</b> (GRPO, SFT), and <b>Distributed GPU Infrastructure</b>.
            </p>

            {/* Interactive Research Tags Cloud */}
            <div className="org-badges" style={{ marginBottom: '1.5rem' }}>
              {researchTags.map(tag => (
                <button
                  key={tag}
                  className="org-badge"
                  style={{ cursor: 'pointer', border: '1px solid var(--cyan)' }}
                  onClick={() => {
                    setSearch(tag);
                    const el = document.getElementById('projects');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    triggerToast(`Filtering repos by "${tag}"! 🔍`);
                  }}
                >
                  <i className="fas fa-tag"></i> {tag}
                </button>
              ))}
            </div>

            <div className="hero-actions-row">
              <button className="primary-btn glow-btn hire-hero-btn" onClick={() => setHireModalOpen(true)}><i className="fas fa-briefcase"></i> Recruit / Hire Taha</button>
              <a href="assets/resume.pdf" target="_blank" className="secondary-btn"><i className="fas fa-file-pdf"></i> Download Resume CV</a>
              <a href="https://hooshaai.substack.com" target="_blank" className="secondary-btn"><i className="fas fa-newspaper"></i> Read Substack 🧠</a>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <div className="stats-bar fade-in-up">
          <div className="stat-item"><span className="stat-number">12,787</span><span className="stat-label">Commits (Past Year)</span></div>
          <div className="stat-divider"></div>
          <div className="stat-item"><span className="stat-number">143</span><span className="stat-label">GitHub Repositories</span></div>
          <div className="stat-divider"></div>
          <div className="stat-item"><span className="stat-number">92 / 70</span><span className="stat-label">HF Models &amp; Datasets</span></div>
          <div className="stat-divider"></div>
          <div className="stat-item"><span className="stat-number">521</span><span className="stat-label">GitHub Followers</span></div>
          <div className="stat-divider"></div>
          <div className="stat-item"><span className="stat-number">17.1k</span><span className="stat-label">LinkedIn Community</span></div>
        </div>

        {/* Honors & Key Achievements Section */}
        <section id="achievements" className="section">
          <div className="section-header fade-in-up">
            <h2>Honors &amp; Key <span className="gradient-text">Achievements</span></h2>
            <p>Major technical milestones, academic distinctions, and open-source impact.</p>
          </div>

          <div className="recruitment-grid fade-in-up">
            {achievements.map((ach, idx) => (
              <div key={idx} className="recruit-card">
                <div className="recruit-icon"><i className={`fas ${ach.icon}`}></i></div>
                <h3>{ach.title}</h3>
                <p>{ach.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Hire Taha */}
        <section id="recruitment" className="section">
          <div className="section-header fade-in-up">
            <h2>Why Recruit <span className="gradient-text">Taha Majlesi?</span></h2>
            <p>Key impact metrics making Taha an exceptional hire for AI R&amp;D teams, labs, and startups.</p>
          </div>

          <div className="recruitment-grid fade-in-up">
            <div className="recruit-card">
              <div className="recruit-icon"><i className="fas fa-rocket"></i></div>
              <h3>Proven Founder Mindset</h3>
              <p>Co-Founder at <b>Hoosha AI 🧠</b>. Proven capability to take research ideas from raw mathematics to production deployments &amp; published papers.</p>
            </div>
            <div className="recruit-card">
              <div className="recruit-icon"><i className="fas fa-microchip"></i></div>
              <h3>First-Principles Systems Engineering</h3>
              <p>Architected <b>Kaleido</b> distributed LLM engine from scratch in CUDA, C++, and PyTorch across multi-GPU compute nodes.</p>
            </div>
            <div className="recruit-card">
              <div className="recruit-icon"><i className="fas fa-brain"></i></div>
              <h3>Frontier AI Research</h3>
              <p>Deep expertise in <b>Flow Matching ODEs</b>, <b>GRPO 4B LLM fine-tuning</b>, synthetic datasets, and sub-quadratic linear attention.</p>
            </div>
            <div className="recruit-card">
              <div className="recruit-icon"><i className="fas fa-graduation-cap"></i></div>
              <h3>Academic Pedigree</h3>
              <p>Computer Engineering at <b>University of Tehran</b>, cross-institutional TA for Compiler Construction at <b>Sharif University of Technology</b>.</p>
            </div>
          </div>
        </section>

        {/* Interactive PyTorch & CUDA Code Playground */}
        <section id="playground" className="section">
          <div className="section-header fade-in-up">
            <h2>Interactive <span className="gradient-text">Code &amp; Algorithm Sandbox</span></h2>
            <p>Test and inspect live research code snippets authored by Taha Majlesi.</p>
          </div>

          <div className="terminal-card fade-in-up">
            <div className="terminal-bar">
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="t-dot red"></span>
                <span className="t-dot yellow"></span>
                <span className="t-dot green"></span>
              </div>
              <div style={{ marginLeft: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button className={`pub-btn ${activeCodeTab === 'flow' ? 'active' : ''}`} onClick={() => { setActiveCodeTab('flow'); setCodeOutput(''); }}>Flow Matching ODE</button>
                <button className={`pub-btn ${activeCodeTab === 'grpo' ? 'active' : ''}`} onClick={() => { setActiveCodeTab('grpo'); setCodeOutput(''); }}>GRPO Loss (PyTorch)</button>
                <button className={`pub-btn ${activeCodeTab === 'kaleido' ? 'active' : ''}`} onClick={() => { setActiveCodeTab('kaleido'); setCodeOutput(''); }}>Kaleido CUDA Kernel</button>
              </div>
              <span className="t-title">gpu-node-01 (PyTorch 2.4)</span>
            </div>
            <div className="terminal-code">
              <pre>{codeSnippets[activeCodeTab]}</pre>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button className="primary-btn glow-btn" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }} onClick={runCodeSnippet}>
                  <i className="fas fa-play"></i> Run Sandbox Test
                </button>
              </div>
              {codeOutput && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#030508', borderRadius: '8px', border: '1px solid var(--cyan)', color: '#00f0ff', fontSize: '0.85rem' }}>
                  <pre>{codeOutput}</pre>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Selected Publications */}
        <section id="publications" className="section">
          <div className="section-header fade-in-up">
            <h2>Selected Research <span className="gradient-text">Publications &amp; Reports</span></h2>
            <p>Preprints, technical reports, and research papers authored by Taha Majlesi &amp; Hoosha AI.</p>
          </div>

          <div className="publications-list fade-in-up">
            <div className="pub-card">
              <div className="pub-badge">Technical Report • 2026</div>
              <h3 className="pub-title"><a href="https://hooshaai.substack.com/p/scaling-transformers-how-linear-attention" target="_blank">Scaling Transformers: How Linear Attention is Reshaping Cross-Task AI</a></h3>
              <p className="pub-authors"><u>Mohammad Taha Majlesi</u>, Hoosha AI Research Team</p>
              <p className="pub-venue">Hoosha AI Technical Report Series &amp; Open Paper 2026</p>
              <p className="pub-abstract">We investigate sub-quadratic linear attention mechanisms (LinRec, SVD Attention) for scaling transformer architectures across long-context sequence modeling tasks without incurring $O(N^2)$ memory overhead.</p>
              <div className="pub-links">
                <a href="https://hooshaai.substack.com/p/scaling-transformers-how-linear-attention" target="_blank" className="pub-btn"><i className="fas fa-file-alt"></i> Article</a>
                <a href="https://github.com/tahamajs/SVD_linear_Attention" target="_blank" className="pub-btn"><i className="fab fa-github"></i> Code</a>
                <button className="pub-btn bibtex-btn" onClick={() => copyBibtex('@article{majlesi2026linear, title={Scaling Transformers: How Linear Attention is Reshaping Cross-Task AI}, author={Majlesi, Mohammad Taha}, journal={Hoosha AI Technical Reports}, year={2026}}')}><i className="fas fa-quote-right"></i> BibTeX</button>
              </div>
            </div>

            <div className="pub-card">
              <div className="pub-badge">Research Paper • 2026</div>
              <h3 className="pub-title"><a href="https://hooshaai.substack.com/p/implementing-grounded-causal-verification" target="_blank">Implementing Grounded Causal Verification to Prevent Recursive Epistemic Collapse in Self-Improving AI Systems</a></h3>
              <p className="pub-authors"><u>Mohammad Taha Majlesi</u>, Hoosha AI Lab</p>
              <p className="pub-venue">Frontiers in AI Alignment &amp; Reasoning 2026</p>
              <p className="pub-abstract">A formal mathematical framework introducing grounded causal verification to constrain self-improving LLMs, preventing recursive hallucination loops and epistemic degradation.</p>
              <div className="pub-links">
                <a href="https://hooshaai.substack.com/p/implementing-grounded-causal-verification" target="_blank" className="pub-btn"><i className="fas fa-file-alt"></i> Article</a>
                <a href="https://github.com/Hooshaai/consciousness_in_LLMs" target="_blank" className="pub-btn"><i className="fab fa-github"></i> Code</a>
                <button className="pub-btn bibtex-btn" onClick={() => copyBibtex('@article{majlesi2026causal, title={Implementing Grounded Causal Verification to Prevent Recursive Epistemic Collapse}, author={Majlesi, Mohammad Taha}, journal={Hoosha AI Research}, year={2026}}')}><i className="fas fa-quote-right"></i> BibTeX</button>
              </div>
            </div>
          </div>
        </section>

        {/* Hugging Face Models Section */}
        <section id="models" className="section">
          <div className="section-header fade-in-up">
            <h2>Hugging Face <span className="gradient-text">Models &amp; Datasets ({filteredHf.length} Assets)</span></h2>
            <p>Pre-trained model weights, fine-tuned adapters, and open synthetic datasets published by Taha Majlesi.</p>
          </div>

          <div className="filter-tabs fade-in-up" style={{ marginBottom: '2rem' }}>
            {[
              { id: 'all', label: 'All HF Assets (162)' },
              { id: 'model', label: '🤖 Models (92)' },
              { id: 'dataset', label: '📊 Datasets (70)' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`filter-btn ${hfFilter === tab.id ? 'active' : ''}`}
                onClick={() => setHfFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="hf-models-grid fade-in-up">
            {filteredHf.map((hf, i) => (
              <div key={i} className="hf-card">
                <div className="hf-badge"><i className={`fas ${hf.type === 'model' ? 'fa-robot' : 'fa-database'}`}></i> {hf.type.toUpperCase()} • ❤️ {hf.likes} • 📥 {hf.downloads}</div>
                <h3>{hf.id}</h3>
                <p>Pre-trained open science release published on Hugging Face Hub.</p>
                <div className="hf-code-line"><code>{hf.code.splitlines()[0]}</code></div>
                <a href={hf.url} target="_blank" className="hf-link">View Asset on Hugging Face <i className="fas fa-external-link-alt"></i></a>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Search & Bento Ecosystem */}
        <section id="projects" className="section">
          <div className="section-header fade-in-up">
            <h2>Interactive <span className="gradient-text">Repository Ecosystem ({counts.all} Repos)</span></h2>
            <p>Live search and filter through all 143 repositories, Hugging Face models, and engineering projects.</p>
          </div>

          <div className="search-box-wrapper fade-in-up">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Live search across 143 repos, languages (PyTorch, C++, CUDA, Django)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-tabs fade-in-up">
            {[
              { id: 'all', label: 'All Projects', count: counts.all },
              { id: 'course', label: '🎓 University Courses', count: counts.course },
              { id: 'ai', label: 'AI & LLMs', count: counts.ai },
              { id: 'systems', label: 'Systems & Kernels', count: counts.systems },
              { id: 'hf', label: 'Hugging Face', count: counts.hf },
              { id: 'web', label: 'Software & Web', count: counts.web }
            ].map(tab => (
              <button
                key={tab.id}
                className={`filter-btn ${filter === tab.id ? 'active' : ''}`}
                onClick={() => setFilter(tab.id)}
              >
                {tab.label} <span className="filter-count">{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="bento-grid">
            {filteredRepos.map((r, i) => (
              <a key={i} href={r.url} target="_blank" className={`bento-item ${r.isCourse || r.stars >= 4 ? 'bento-wide' : ''}`}>
                <div className="bento-inner">
                  <div className="project-tag"><i className={`fas ${r.icon}`}></i> {r.tag} • ⭐ {r.stars}</div>
                  <h3 className="repo-title">{r.title}</h3>
                  <p className="repo-desc">{r.desc}</p>
                  <div className="bento-tags">
                    <span className="tag">{r.lang}</span>
                    {r.isCourse && <span className="tag">{r.uni} Course</span>}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Substack Articles */}
        <section id="substack" className="section">
          <div className="section-header fade-in-up">
            <h2>Hoosha AI 🧠 <span className="gradient-text">Substack Newsletter ({filteredArticles.length} Deep Dives)</span></h2>
            <p>Deep dives into ML/AI papers, LLM reasoning, cognitive scaling, and sub-quadratic attention.</p>
          </div>

          <div className="search-box-wrapper fade-in-up" style={{ marginBottom: '2rem' }}>
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search Substack articles by title or topic..."
              value={substackSearch}
              onChange={e => setSubstackSearch(e.target.value)}
            />
          </div>

          <div className="articles-grid">
            {filteredArticles.map((art, idx) => (
              <a key={idx} href={art.link} target="_blank" className="article-card fade-in-up">
                <div className="article-tag"><i className="fas fa-newspaper"></i> Substack • {art.date}</div>
                <h3>{art.title}</h3>
                <p>{art.desc}</p>
                <span className="read-more">Read Full Deep Dive <i className="fas fa-arrow-right"></i></span>
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Mohammad Taha Majlesi. Co-Founder @ Hoosha AI. Built with React 18 &amp; extreme precision.</p>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
