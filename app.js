const { useState, useEffect, useMemo, useRef } = React;
function App() {
  const [data, setData] = useState({ repos: [], articles: [], hf: [] });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [accent, setAccent] = useState("cyan");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [viewMode, setViewMode] = useState("bento");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [gpuMetrics, setGpuMetrics] = useState({ flops: 312, vram: 68.4, latency: 1.2 });
  const [substackSearch, setSubstackSearch] = useState("");
  const [hfFilter, setHfFilter] = useState("all");
  const [activeCodeTab, setActiveCodeTab] = useState("flow");
  const [codeOutput, setCodeOutput] = useState("");
  const [cmdQuery, setCmdQuery] = useState("");
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [cmdModalOpen, setCmdModalOpen] = useState(false);
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [activeConstellationNode, setActiveConstellationNode] = useState(null);
  const [aiMessages, setAiMessages] = useState([
    { sender: "bot", text: "\u{1F44B} Welcome! I am Taha Majlesi's AI assistant. Ask me about <b>Hoosha AI \u{1F9E0}</b> research publications, <b>Flow Matching</b> ODEs, <b>GRPO Reasoning</b>, <b>17.1k LinkedIn Community</b>, or his <b>University of Tehran & Sharif</b> coursework!" }
  ]);
  const [aiInputText, setAiInputText] = useState("");
  const [tehranTime, setTehranTime] = useState("--:--:-- AM");
  const [toastMsg, setToastMsg] = useState(null);
  const audioCtxRef = useRef(null);
  const playSound = (freq = 440, type = "sine") => {
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
      gain.gain.exponentialRampToValueAtTime(1e-4, audioCtxRef.current.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + 0.15);
    } catch (e) {
    }
  };
  const speakText = (text) => {
    if (!speechEnabled || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/<[^>]+>/g, "").replace(/\*/g, "");
      const utt = new SpeechSynthesisUtterance(clean);
      utt.rate = 1;
      window.speechSynthesis.speak(utt);
    } catch (e) {
    }
  };
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3e3);
  };
  useEffect(() => {
    fetch("data.json").then((res) => res.json()).then((d) => setData(d)).catch(() => {
    });
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      setGpuMetrics({
        flops: (310 + Math.random() * 15).toFixed(1),
        vram: (67.5 + Math.random() * 2.5).toFixed(1),
        latency: (1.1 + Math.random() * 0.3).toFixed(2)
      });
    }, 2e3);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      const options = { timeZone: "Asia/Tehran", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true };
      setTehranTime(new Intl.DateTimeFormat("en-US", options).format(/* @__PURE__ */ new Date()));
    }, 1e3);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdModalOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setCmdModalOpen(false);
        setAiModalOpen(false);
        setHireModalOpen(false);
        setActiveConstellationNode(null);
        setMobileNavOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const constellationNodes = [
    { id: "core", label: "Mohammad Taha Majlesi", type: "core", x: 50, y: 50, desc: "Co-Founder & AI Architect @ Hoosha AI \u{1F9E0} | CE @ UT & TA @ Sharif" },
    { id: "hoosha", label: "Hoosha AI \u{1F9E0}", type: "startup", x: 25, y: 30, desc: "Frontier AI Startup co-founded by Taha. Focus on cognitive scaling, GRPO & IIT consciousness." },
    { id: "ut", label: "University of Tehran", type: "academic", x: 75, y: 30, desc: "Primary CE degree institution & Research Assistant for M.Sc. ML, AI & Operating Systems." },
    { id: "sharif", label: "Sharif University", type: "academic", x: 80, y: 70, desc: "Cross-institutional Teaching Assistant for Compiler Construction." },
    { id: "kaleido", label: "Kaleido Engine \u26A1", type: "system", x: 20, y: 70, desc: "First-principles distributed CUDA/C++ LLM engine jointly optimizing 4D parallel compute." },
    { id: "hf", label: "Hugging Face (162)", type: "open_science", x: 50, y: 20, desc: "92 pre-trained model weights & 70 open synthetic evaluation datasets." },
    { icon: "fa-newspaper", id: "substack", label: "Substack (20 Papers)", type: "research", x: 50, y: 80, desc: "20 published deep-dive research reports on Flow Matching & Linear Attention." }
  ];
  useEffect(() => {
    const spotlight = document.getElementById("cursor-spotlight");
    const handleMouseMove = (e) => {
      if (spotlight) {
        spotlight.style.left = `${e.clientX}px`;
        spotlight.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    const canvas = document.getElementById("neural-canvas");
    if (canvas) {
      const ctx = canvas.getContext("2d", { alpha: true });
      let w = canvas.width = window.innerWidth;
      let h = canvas.height = window.innerHeight;
      const starCount = w > 700 ? 55 : 25;
      const stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 1.8 + 0.8,
        alpha: Math.random(),
        alphaSpeed: (Math.random() * 0.02 + 5e-3) * (Math.random() < 0.5 ? 1 : -1)
      }));
      const shootingStars = [];
      const createShootingStar = () => {
        shootingStars.push({
          x: Math.random() * w,
          y: Math.random() * (h * 0.4),
          length: Math.random() * 70 + 40,
          speed: Math.random() * 7 + 6,
          angle: 45 * (Math.PI / 180),
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015
        });
      };
      const shootingInterval = setInterval(() => {
        if (Math.random() < 0.7) createShootingStar();
      }, 3e3);
      let animId;
      let lastTime = performance.now();
      const render = (now) => {
        if (now - lastTime < 16) {
          animId = requestAnimationFrame(render);
          return;
        }
        lastTime = now;
        ctx.clearRect(0, 0, w, h);
        for (let a = 0; a < stars.length; a++) {
          for (let b = a + 1; b < stars.length; b++) {
            const dx = stars[a].x - stars[b].x;
            const dy = stars[a].y - stars[b].y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 12e3) {
              const dist = Math.sqrt(distSq);
              ctx.beginPath();
              ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 * (1 - dist / 110)})`;
              ctx.lineWidth = 0.6;
              ctx.moveTo(stars[a].x, stars[a].y);
              ctx.lineTo(stars[b].x, stars[b].y);
              ctx.stroke();
            }
          }
          stars[a].x += stars[a].vx;
          stars[a].y += stars[a].vy;
          if (stars[a].x < 0) stars[a].x = w;
          if (stars[a].x > w) stars[a].x = 0;
          if (stars[a].y < 0) stars[a].y = h;
          if (stars[a].y > h) stars[a].y = 0;
          stars[a].alpha += stars[a].alphaSpeed;
          if (stars[a].alpha <= 0.2 || stars[a].alpha >= 1) stars[a].alphaSpeed *= -1;
          ctx.beginPath();
          ctx.arc(stars[a].x, stars[a].y, stars[a].radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 240, 255, ${stars[a].alpha * 0.8})`;
          ctx.fill();
        }
        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const ss = shootingStars[i];
          const endX = ss.x + Math.cos(ss.angle) * ss.length;
          const endY = ss.y + Math.sin(ss.angle) * ss.length;
          const grad = ctx.createLinearGradient(ss.x, ss.y, endX, endY);
          grad.addColorStop(0, `rgba(255, 255, 255, ${ss.alpha})`);
          grad.addColorStop(0.3, `rgba(0, 240, 255, ${ss.alpha * 0.8})`);
          grad.addColorStop(1, "rgba(138, 43, 226, 0)");
          ctx.beginPath();
          ctx.moveTo(ss.x, ss.y);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.2;
          ctx.stroke();
          ss.x += Math.cos(ss.angle) * ss.speed;
          ss.y += Math.sin(ss.angle) * ss.speed;
          ss.alpha -= ss.decay;
          if (ss.alpha <= 0 || ss.x > w || ss.y > h) {
            shootingStars.splice(i, 1);
          }
        }
        animId = requestAnimationFrame(render);
      };
      animId = requestAnimationFrame(render);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        clearInterval(shootingInterval);
        cancelAnimationFrame(animId);
      };
    }
  }, []);
  const filteredRepos = useMemo(() => {
    return (data.repos || []).filter((r) => {
      const matchesCat = filter === "all" || r.cat === filter;
      const q = search.toLowerCase().trim();
      const matchesSearch = !q || (r.name + " " + r.desc + " " + r.lang + " " + r.tag).toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [data.repos, filter, search]);
  const filteredArticles = useMemo(() => {
    const q = substackSearch.toLowerCase().trim();
    if (!q) return data.articles || [];
    return (data.articles || []).filter((a) => (a.title + " " + a.desc).toLowerCase().includes(q));
  }, [data.articles, substackSearch]);
  const filteredHf = useMemo(() => {
    return (data.hf || []).filter((h) => {
      if (hfFilter === "all") return true;
      return h.type === hfFilter;
    });
  }, [data.hf, hfFilter]);
  const counts = useMemo(() => {
    const repos = data.repos || [];
    return {
      all: repos.length,
      course: repos.filter((r) => r.cat === "course").length,
      ai: repos.filter((r) => r.cat === "ai").length,
      systems: repos.filter((r) => r.cat === "systems").length,
      hf: repos.filter((r) => r.cat === "hf").length,
      web: repos.filter((r) => r.cat === "web").length
    };
  }, [data.repos]);
  const handleAiQuestion = (q) => {
    if (!q || !q.trim()) return;
    const userQ = q.trim();
    setAiMessages((prev) => [...prev, { sender: "user", text: userQ }]);
    setAiInputText("");
    setTimeout(() => {
      const lower = userQ.toLowerCase();
      let reply = "I am Taha Majlesi's AI assistant. Taha is Co-Founder & Systems/AI Architect at Hoosha AI \u{1F9E0} with a community of over 17,100 LinkedIn followers, specializing in Flow Matching, GRPO, and Distributed Systems.";
      if (lower.includes("linkedin") || lower.includes("follower")) {
        reply = "\u{1F4BC} Taha Majlesi has built a strong community of over **17,100+ followers** on LinkedIn (https://linkedin.com/in/tahamajlesi), sharing insights on AI systems, Flow Matching, and distributed GPU training!";
      } else if (lower.includes("hoosha")) {
        reply = "\u{1F9E0} **Hoosha AI** is an AI research startup co-founded by Taha Majlesi, focusing on frontier ML research, continuous cognitive scaling, synthetic consciousness (IIT & GWT), and high-performance post-training RL pipelines. Check out articles at https://hooshaai.substack.com!";
      } else if (lower.includes("flow") || lower.includes("grpo") || lower.includes("research")) {
        reply = "\u{1F3A8} Taha's primary research centers on **Flow Matching** probability paths for generative modeling, **Group Relative Policy Optimization (GRPO)** for fine-tuning 4B LLMs on GSM8K math reasoning, and sub-quadratic linear attention architectures like LinRec & SVD attention!";
      } else if (lower.includes("teach") || lower.includes("sharif") || lower.includes("ut") || lower.includes("course")) {
        reply = "\u{1F393} Taha is a cross-institutional Teaching Assistant for **Compiler Construction at Sharif University of Technology**, and has served as TA for **M.Sc. Machine Learning**, **Artificial Intelligence**, **Advanced Programming (C++)**, and **xv6 OS Lab** at the **University of Tehran**.";
      } else if (lower.includes("contact") || lower.includes("email") || lower.includes("telegram")) {
        reply = "\u{1F4E7} You can reach Taha via primary email `tahamajlesi@ut.ac.ir`, secondary email `Tahamajlesice@gmail.com`, or directly on Telegram `@tahamajlesii`!";
      } else if (lower.includes("kaleido") || lower.includes("cuda") || lower.includes("system")) {
        reply = "\u26A1 **Kaleido Engine** is Taha's first-principles distributed LLM training framework written in C++/PyTorch that jointly optimizes 4 dimensions of parallel GPU compute nodes.";
      }
      setAiMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      playSound(800, "triangle");
      speakText(reply);
    }, 400);
  };
  const copyBibtex = (bib) => {
    navigator.clipboard.writeText(bib);
    playSound(700, "square");
    triggerToast("BibTeX citation copied to clipboard! \u{1F4C4}");
  };
  const runCodeSnippet = () => {
    playSound(900, "sine");
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
    "Flow Matching ODEs",
    "GRPO Alignment",
    "Score Diffusion",
    "Task Arithmetic",
    "CUDA GPU Kernels",
    "Linear Attention",
    "Integrated Information Theory",
    "PaliGemma QLoRA",
    "xv6 OS Kernel",
    "Django REST Framework"
  ];
  const achievements = [
    { icon: "fa-users", title: "17.1k+ LinkedIn Community", desc: "Over 17,100+ followers & connections on LinkedIn actively engaging with AI research content." },
    { icon: "fa-trophy", title: "Top 1% Global Commit Streak", desc: "12,787 verified commits in the past year across 143 open-source repositories." },
    { icon: "fa-award", title: "GitHub Developer Program Pro Member", desc: "Recognized for prolific open-source contributions and active infrastructure tooling." },
    { icon: "fa-cubes", title: "162 HuggingFace Open Science Assets", desc: "Published 92 pre-trained model weights & 70 open synthetic evaluation datasets." },
    { icon: "fa-university", title: "Sharif & University of Tehran TA", desc: "Supervised 500+ students across Compiler Construction, ML (M.Sc.), AI, and C++." },
    { icon: "fa-newspaper", title: "20 Substack Research Publications", desc: "Authored 20 deep-dive papers on Flow Matching, GRPO, IIT Consciousness, and Linear Attention." }
  ];
  const cmdItems = [
    { text: "Toggle 3D Constellation Network Mode", icon: "fas fa-project-diagram", action: () => {
      setCmdModalOpen(false);
      setViewMode((prev) => prev === "bento" ? "constellation" : "bento");
    } },
    { text: "Open LinkedIn Profile (17.1k Followers)", icon: "fab fa-linkedin", action: () => window.open("https://linkedin.com/in/tahamajlesi", "_blank") },
    { text: "Open Direct Recruitment & Hire Modal", icon: "fas fa-briefcase", action: () => {
      setCmdModalOpen(false);
      setHireModalOpen(true);
    } },
    { text: "Open AI Research Assistant Chat", icon: "fas fa-robot", action: () => {
      setCmdModalOpen(false);
      setAiModalOpen(true);
    } },
    { text: "Download Official Resume (PDF)", icon: "fas fa-file-pdf", action: () => window.open("assets/resume.pdf", "_blank") },
    { text: "Open Hoosha AI Substack Newsletter", icon: "fas fa-newspaper", action: () => window.open("https://hooshaai.substack.com", "_blank") }
  ];
  return /* @__PURE__ */ React.createElement("div", null, toastMsg && /* @__PURE__ */ React.createElement("div", { className: "toast-container", "aria-live": "polite" }, /* @__PURE__ */ React.createElement("div", { className: "toast" }, toastMsg)), /* @__PURE__ */ React.createElement("div", { className: "gpu-telemetry-bar" }, /* @__PURE__ */ React.createElement("span", { className: "gpu-dot", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("span", { className: "gpu-item" }, /* @__PURE__ */ React.createElement("b", null, "CUDA:"), " 0,1,2,3 (A100 SXM4)"), /* @__PURE__ */ React.createElement("span", { className: "gpu-item" }, /* @__PURE__ */ React.createElement("b", null, "FLOPS:"), " ", gpuMetrics.flops, " TFLOPS"), /* @__PURE__ */ React.createElement("span", { className: "gpu-item" }, /* @__PURE__ */ React.createElement("b", null, "VRAM:"), " ", gpuMetrics.vram, " GB / 80 GB"), /* @__PURE__ */ React.createElement("span", { className: "gpu-item" }, /* @__PURE__ */ React.createElement("b", null, "LATENCY:"), " ", gpuMetrics.latency, " ms"), /* @__PURE__ */ React.createElement("span", { className: "gpu-item" }, /* @__PURE__ */ React.createElement("b", null, "TEHRAN:"), " ", tehranTime)), /* @__PURE__ */ React.createElement("div", { className: "theme-switcher" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      className: `sound-toggle-btn ${viewMode === "constellation" ? "active" : ""}`,
      "aria-label": "Toggle Novel 3D Constellation Mode",
      onClick: () => {
        const next = viewMode === "bento" ? "constellation" : "bento";
        setViewMode(next);
        playSound(900, "triangle");
        triggerToast(next === "constellation" ? "Activated Interactive 3D Constellation Graph! \u{1F578}\uFE0F" : "Switched to Bento Matrix Grid! \u{1F39B}\uFE0F");
      },
      title: "Toggle Novel 3D Constellation Mode"
    },
    /* @__PURE__ */ React.createElement("i", { className: viewMode === "bento" ? "fas fa-project-diagram" : "fas fa-th-large", "aria-hidden": "true" })
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: `sound-toggle-btn ${soundEnabled ? "active" : ""}`,
      "aria-label": "Toggle Sci-Fi SFX Audio",
      onClick: () => {
        setSoundEnabled(!soundEnabled);
        triggerToast(soundEnabled ? "Sound Muted \u{1F507}" : "Sci-Fi Sound FX Enabled! \u{1F50A}");
      },
      title: "Toggle Sci-Fi SFX"
    },
    /* @__PURE__ */ React.createElement("i", { className: "fas fa-volume-up", "aria-hidden": "true" })
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: `sound-toggle-btn ${speechEnabled ? "active" : ""}`,
      "aria-label": "Toggle AI Speech Voice",
      onClick: () => {
        setSpeechEnabled(!speechEnabled);
        triggerToast(speechEnabled ? "AI Voice Disabled \u{1F507}" : "AI Voice Enabled! \u{1F5E3}\uFE0F");
      },
      title: "Toggle AI Speech Voice"
    },
    /* @__PURE__ */ React.createElement("i", { className: "fas fa-microphone", "aria-hidden": "true" })
  ), /* @__PURE__ */ React.createElement("div", { className: "switcher-divider" }), ["cyan", "purple", "emerald", "rose"].map((c) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: c,
      className: `accent-dot ${accent === c ? "active" : ""}`,
      "aria-label": `Switch theme color to ${c}`,
      onClick: () => {
        setAccent(c);
        document.body.setAttribute("data-accent", c);
        playSound(800, "sine");
        triggerToast(`Switched theme to ${c.toUpperCase()} \u2728`);
      },
      style: { background: c === "cyan" ? "#00f0ff" : c === "purple" ? "#8a2be2" : c === "emerald" ? "#10b981" : "#f43f5e" },
      title: `${c} theme`
    }
  ))), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "back-to-top-btn visible",
      "aria-label": "Scroll back to top of page",
      onClick: () => window.scrollTo({ top: 0, behavior: "smooth" })
    },
    /* @__PURE__ */ React.createElement("i", { className: "fas fa-arrow-up", "aria-hidden": "true" })
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "ai-chat-fab",
      "aria-label": "Open AI Research Assistant Chat Dialog",
      onClick: () => {
        setAiModalOpen(true);
        playSound(750, "sine");
      }
    },
    /* @__PURE__ */ React.createElement("i", { className: "fas fa-brain", "aria-hidden": "true" }),
    /* @__PURE__ */ React.createElement("span", { className: "ai-fab-label" }, "Ask AI Assistant")
  ), aiModalOpen && /* @__PURE__ */ React.createElement("div", { className: "modal-overlay active", onClick: () => setAiModalOpen(false) }, /* @__PURE__ */ React.createElement("div", { className: "ai-chat-box", role: "dialog", "aria-modal": "true", "aria-labelledby": "ai-modal-heading", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "ai-chat-header" }, /* @__PURE__ */ React.createElement("div", { className: "ai-title-row" }, /* @__PURE__ */ React.createElement("div", { className: "ai-avatar-dot", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-robot" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { id: "ai-modal-heading" }, "Taha's AI Research Assistant \u{1F9E0}"), /* @__PURE__ */ React.createElement("span", { className: "ai-subtitle" }, "Ask about Hoosha AI research, Flow Matching, GRPO, or UT/Sharif courses"))), /* @__PURE__ */ React.createElement("button", { className: "cmd-esc", "aria-label": "Close AI Assistant dialog", onClick: () => setAiModalOpen(false) }, "ESC")), /* @__PURE__ */ React.createElement("div", { className: "ai-chat-body" }, aiMessages.map((m, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: `chat-msg ${m.sender}-msg`, dangerouslySetInnerHTML: { __html: m.text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") } }))), /* @__PURE__ */ React.createElement("div", { className: "ai-quick-prompts" }, ["Tell me about LinkedIn 17.1k followers", "What is Hoosha AI?", "Tell me about Flow Matching & GRPO", "What courses does Taha teach?"].map((q, i) => /* @__PURE__ */ React.createElement("button", { key: i, className: "quick-prompt-btn", onClick: () => handleAiQuestion(q) }, q))), /* @__PURE__ */ React.createElement("div", { className: "ai-chat-input-row" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      "aria-label": "Ask AI Assistant a question",
      placeholder: "Ask a question about research papers, systems, background...",
      value: aiInputText,
      onChange: (e) => setAiInputText(e.target.value),
      onKeyDown: (e) => e.key === "Enter" && handleAiQuestion(aiInputText)
    }
  ), /* @__PURE__ */ React.createElement("button", { className: "primary-btn glow-btn send-btn", "aria-label": "Send Question", onClick: () => handleAiQuestion(aiInputText) }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-paper-plane", "aria-hidden": "true" }))))), cmdModalOpen && /* @__PURE__ */ React.createElement("div", { className: "modal-overlay active", onClick: () => setCmdModalOpen(false) }, /* @__PURE__ */ React.createElement("div", { className: "cmd-palette-box", role: "dialog", "aria-modal": "true", "aria-labelledby": "cmd-modal-heading", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "cmd-input-row" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-search", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      "aria-label": "Filter command actions",
      placeholder: "Type a command (e.g. 'recruit', 'linkedin', 'constellation', 'resume')...",
      value: cmdQuery,
      onChange: (e) => setCmdQuery(e.target.value),
      autoFocus: true
    }
  ), /* @__PURE__ */ React.createElement("button", { className: "cmd-esc", "aria-label": "Close Command Palette", onClick: () => setCmdModalOpen(false) }, "ESC")), /* @__PURE__ */ React.createElement("div", { className: "cmd-results" }, cmdItems.filter((item) => item.text.toLowerCase().includes(cmdQuery.toLowerCase())).map((item, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "cmd-item", role: "button", tabIndex: 0, onClick: item.action, onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && item.action() }, /* @__PURE__ */ React.createElement("i", { className: item.icon, "aria-hidden": "true" }), " ", item.text))))), hireModalOpen && /* @__PURE__ */ React.createElement("div", { className: "modal-overlay active", onClick: () => setHireModalOpen(false) }, /* @__PURE__ */ React.createElement("div", { className: "repo-modal-box", role: "dialog", "aria-modal": "true", "aria-labelledby": "hire-modal-heading", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "repo-modal-header" }, /* @__PURE__ */ React.createElement("span", { className: "project-tag" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-briefcase", "aria-hidden": "true" }), " Direct Recruitment & Collaboration"), /* @__PURE__ */ React.createElement("button", { className: "cmd-esc", "aria-label": "Close Recruitment dialog", onClick: () => setHireModalOpen(false) }, "ESC")), /* @__PURE__ */ React.createElement("h2", { id: "hire-modal-heading", className: "modal-repo-title" }, "Recruit / Collaborate with Taha \u{1F680}"), /* @__PURE__ */ React.createElement("p", { className: "modal-repo-desc" }, "Select a quick email template to contact Taha Majlesi directly for Senior AI Engineer roles, Research Scientist positions, Ph.D. opportunities, or R&D advisory:"), /* @__PURE__ */ React.createElement("div", { className: "template-box" }, /* @__PURE__ */ React.createElement("div", { className: "template-item", role: "button", tabIndex: 0, onClick: () => window.location.href = "mailto:tahamajlesi@ut.ac.ir?subject=Senior%20AI%20Engineering%20Role" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-building", "aria-hidden": "true" }), " ", /* @__PURE__ */ React.createElement("b", null, "Industry Senior AI / Systems Engineer Role"), /* @__PURE__ */ React.createElement("p", null, "Request interview for AI Architecture, Distributed Training, or LLM Post-Training position.")), /* @__PURE__ */ React.createElement("div", { className: "template-item", role: "button", tabIndex: 0, onClick: () => window.location.href = "mailto:tahamajlesi@ut.ac.ir?subject=Ph.D.%20Research%20Opportunity" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-graduation-cap", "aria-hidden": "true" }), " ", /* @__PURE__ */ React.createElement("b", null, "Ph.D. & Academic Research Collaboration"), /* @__PURE__ */ React.createElement("p", null, "Discuss graduate research, lab collaborations, or paper co-authorship."))), /* @__PURE__ */ React.createElement("div", { className: "modal-actions", style: { marginTop: "1.5rem" } }, /* @__PURE__ */ React.createElement("a", { href: "mailto:tahamajlesi@ut.ac.ir", className: "primary-btn glow-btn" }, "Send Direct Email ", /* @__PURE__ */ React.createElement("i", { className: "fas fa-envelope", "aria-hidden": "true" })), /* @__PURE__ */ React.createElement("a", { href: "https://telegram.me/tahamajlesii", target: "_blank", className: "secondary-btn" }, "Telegram Chat ", /* @__PURE__ */ React.createElement("i", { className: "fab fa-telegram", "aria-hidden": "true" }))))), /* @__PURE__ */ React.createElement("nav", { className: "glass-nav", "aria-label": "Main Navigation" }, /* @__PURE__ */ React.createElement("div", { className: "nav-container" }, /* @__PURE__ */ React.createElement("div", { className: "logo" }, /* @__PURE__ */ React.createElement("span", { className: "gradient-text" }, "Taha Majlesi"), "."), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "mobile-nav-toggle",
      "aria-label": "Toggle Mobile Navigation Menu",
      "aria-expanded": mobileNavOpen,
      onClick: () => setMobileNavOpen(!mobileNavOpen)
    },
    /* @__PURE__ */ React.createElement("i", { className: mobileNavOpen ? "fas fa-times" : "fas fa-bars", "aria-hidden": "true" })
  ), /* @__PURE__ */ React.createElement("div", { className: `nav-links ${mobileNavOpen ? "mobile-open" : ""}` }, /* @__PURE__ */ React.createElement("a", { href: "#about", onClick: () => setMobileNavOpen(false) }, "About"), /* @__PURE__ */ React.createElement("a", { href: "#achievements", onClick: () => setMobileNavOpen(false) }, "Achievements"), /* @__PURE__ */ React.createElement("a", { href: "#recruitment", onClick: () => setMobileNavOpen(false) }, "Why Hire?"), /* @__PURE__ */ React.createElement("a", { href: "#playground", onClick: () => setMobileNavOpen(false) }, "Playground"), /* @__PURE__ */ React.createElement("a", { href: "#publications", onClick: () => setMobileNavOpen(false) }, "Publications"), /* @__PURE__ */ React.createElement("a", { href: "#architecture", onClick: () => setMobileNavOpen(false) }, "Architecture"), /* @__PURE__ */ React.createElement("a", { href: "#models", onClick: () => setMobileNavOpen(false) }, "HF Models (162)"), /* @__PURE__ */ React.createElement("a", { href: "#projects", onClick: () => setMobileNavOpen(false) }, "Ecosystem (", counts.all, ")"), /* @__PURE__ */ React.createElement("a", { href: "#substack", onClick: () => setMobileNavOpen(false) }, "Substack \u{1F9E0}"), /* @__PURE__ */ React.createElement("button", { className: "nav-resume-btn", style: { background: viewMode === "constellation" ? "var(--cyan)" : "transparent", color: viewMode === "constellation" ? "#000" : "var(--cyan)" }, onClick: () => {
    setViewMode((prev) => prev === "bento" ? "constellation" : "bento");
    setMobileNavOpen(false);
  } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-project-diagram", "aria-hidden": "true" }), " ", viewMode === "bento" ? "Constellation Graph" : "Bento Grid"), /* @__PURE__ */ React.createElement("button", { className: "nav-hire-btn", onClick: () => {
    setHireModalOpen(true);
    setMobileNavOpen(false);
  } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-briefcase", "aria-hidden": "true" }), " Recruit Taha"), /* @__PURE__ */ React.createElement("button", { className: "cmd-k-btn", onClick: () => {
    setCmdModalOpen(true);
    setMobileNavOpen(false);
  } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-search", "aria-hidden": "true" }), " ", /* @__PURE__ */ React.createElement("span", { className: "cmd-k-key" }, "\u2318K"))))), /* @__PURE__ */ React.createElement("main", null, viewMode === "constellation" ? /* @__PURE__ */ React.createElement("section", { className: "section", style: { paddingTop: "8rem", minHeight: "85vh" } }, /* @__PURE__ */ React.createElement("div", { className: "section-header fade-in-up" }, /* @__PURE__ */ React.createElement("h2", null, "Interactive ", /* @__PURE__ */ React.createElement("span", { className: "gradient-text" }, "Neural Constellation Graph")), /* @__PURE__ */ React.createElement("p", null, "Click any node in Taha Majlesi's interconnected research & engineering universe.")), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: "100%", height: "550px", background: "rgba(5,7,12,0.8)", borderRadius: "20px", border: "1px solid rgba(0,240,255,0.2)", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("svg", { style: { position: "absolute", width: "100%", height: "100%" } }, constellationNodes.slice(1).map((n) => /* @__PURE__ */ React.createElement(
    "line",
    {
      key: n.id,
      x1: "50%",
      y1: "50%",
      x2: `${n.x}%`,
      y2: `${n.y}%`,
      stroke: "rgba(0, 240, 255, 0.4)",
      strokeWidth: "2",
      strokeDasharray: "5,5"
    }
  ))), constellationNodes.map((n) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: n.id,
      role: "button",
      tabIndex: 0,
      "aria-label": `Select constellation node ${n.label}`,
      onClick: () => {
        setActiveConstellationNode(n);
        playSound(850, "sine");
      },
      onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && setActiveConstellationNode(n),
      style: {
        position: "absolute",
        left: `${n.x}%`,
        top: `${n.y}%`,
        transform: "translate(-50%, -50%)",
        cursor: "pointer",
        background: n.type === "core" ? "var(--cyan)" : "rgba(15, 23, 42, 0.9)",
        color: n.type === "core" ? "#000" : "#fff",
        border: "2px solid var(--cyan)",
        borderRadius: "30px",
        padding: "0.6rem 1.4rem",
        fontWeight: "700",
        fontSize: n.type === "core" ? "1.1rem" : "0.9rem",
        boxShadow: "0 0 20px rgba(0, 240, 255, 0.5)",
        transition: "all 0.3s ease"
      }
    },
    /* @__PURE__ */ React.createElement("i", { className: `fas ${n.type === "core" ? "fa-brain" : n.type === "startup" ? "fa-rocket" : n.type === "academic" ? "fa-graduation-cap" : "fa-server"}`, "aria-hidden": "true", style: { marginRight: "8px" } }),
    n.label
  )), activeConstellationNode && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", width: "90%", maxWidth: "600px", background: "rgba(10,15,25,0.95)", border: "1px solid var(--cyan)", borderRadius: "16px", padding: "1.5rem", backdropFilter: "blur(10px)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("h3", { style: { margin: 0, color: "var(--cyan)" } }, activeConstellationNode.label), /* @__PURE__ */ React.createElement("button", { style: { background: "none", border: "none", color: "#fff", cursor: "pointer" }, "aria-label": "Close details", onClick: () => setActiveConstellationNode(null) }, "\u2715")), /* @__PURE__ */ React.createElement("p", { style: { marginTop: "0.5rem", fontSize: "0.9rem", color: "#94a3b8" } }, activeConstellationNode.desc)))) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("section", { id: "about", className: "hero" }, /* @__PURE__ */ React.createElement("div", { className: "hero-content fade-in-up" }, /* @__PURE__ */ React.createElement("div", { className: "avatar-wrapper" }, /* @__PURE__ */ React.createElement("div", { className: "avatar-glow-ring", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("img", { src: "assets/avatar.jpg?v=22.0", onError: (e) => {
    e.target.src = "https://github.com/tahamajs.png";
  }, alt: "Mohammad Taha Majlesi Headshot", className: "avatar-img" })), /* @__PURE__ */ React.createElement("div", { className: "badge-pill" }, /* @__PURE__ */ React.createElement("span", { className: "pulse-dot", "aria-hidden": "true" }), " Co-Founder & Systems/AI Architect @ Hoosha AI \u{1F9E0} | University of Tehran"), /* @__PURE__ */ React.createElement("div", { className: "live-clock-badge" }, /* @__PURE__ */ React.createElement("i", { className: "far fa-clock", "aria-hidden": "true" }), " Tehran Local Time: ", /* @__PURE__ */ React.createElement("span", null, tehranTime), " (UTC +3:30) \u2022 ", /* @__PURE__ */ React.createElement("span", { className: "status-green" }, "Available for R&D & Recruiting")), /* @__PURE__ */ React.createElement("h1", { className: "hero-title" }, "Mohammad Taha Majlesi", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "subtitle-line" }, "Building ", /* @__PURE__ */ React.createElement("span", { className: "gradient-text" }, "Scalable AI Systems & Distributed Engines"))), /* @__PURE__ */ React.createElement("p", { className: "hero-subtitle" }, "AI Researcher & Systems Engineer. Co-Founder of ", /* @__PURE__ */ React.createElement("b", null, "Hoosha AI \u{1F9E0}"), " with a ", /* @__PURE__ */ React.createElement("b", null, "17.1k+ LinkedIn Community"), ". Computer Engineering at ", /* @__PURE__ */ React.createElement("b", null, "University of Tehran"), " and Teaching Assistant at ", /* @__PURE__ */ React.createElement("b", null, "Sharif University of Technology"), ". Specializing in ", /* @__PURE__ */ React.createElement("b", null, "Deep Generative Modeling"), " (Flow Matching, VAEs), ", /* @__PURE__ */ React.createElement("b", null, "LLM Alignment & Reasoning"), " (GRPO, SFT), and ", /* @__PURE__ */ React.createElement("b", null, "Distributed GPU Infrastructure"), "."), /* @__PURE__ */ React.createElement("div", { className: "org-badges", style: { marginBottom: "1.5rem" } }, researchTags.map((tag) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: tag,
      className: "org-badge",
      style: { cursor: "pointer", border: "1px solid var(--cyan)" },
      onClick: () => {
        setSearch(tag);
        const el = document.getElementById("projects");
        if (el) el.scrollIntoView({ behavior: "smooth" });
        triggerToast(`Filtering repos by "${tag}"! \u{1F50D}`);
      }
    },
    /* @__PURE__ */ React.createElement("i", { className: "fas fa-tag", "aria-hidden": "true" }),
    " ",
    tag
  ))), /* @__PURE__ */ React.createElement("div", { className: "hero-actions-row" }, /* @__PURE__ */ React.createElement("button", { className: "primary-btn glow-btn hire-hero-btn", onClick: () => setHireModalOpen(true) }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-briefcase", "aria-hidden": "true" }), " Recruit / Hire Taha"), /* @__PURE__ */ React.createElement("a", { href: "assets/resume.pdf", target: "_blank", className: "secondary-btn" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-file-pdf", "aria-hidden": "true" }), " Download Resume CV"), /* @__PURE__ */ React.createElement("a", { href: "https://hooshaai.substack.com", target: "_blank", className: "secondary-btn substack-btn" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-newspaper", "aria-hidden": "true" }), " Read Substack \u{1F9E0}"), /* @__PURE__ */ React.createElement("div", { className: "social-row" }, /* @__PURE__ */ React.createElement("a", { href: "https://github.com/tahamajs", target: "_blank", className: "social-btn", "aria-label": "GitHub Profile (521 Followers)", title: "GitHub (521 Followers)" }, /* @__PURE__ */ React.createElement("i", { className: "fab fa-github", "aria-hidden": "true" })), /* @__PURE__ */ React.createElement("a", { href: "https://huggingface.co/tahamajs", target: "_blank", className: "social-btn", "aria-label": "Hugging Face Profile (162 Assets)", title: "Hugging Face (162 Assets)" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-robot", "aria-hidden": "true" })), /* @__PURE__ */ React.createElement("a", { href: "https://hooshaai.substack.com", target: "_blank", className: "social-btn", "aria-label": "Substack Newsletter", title: "Substack Newsletter" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-newspaper", "aria-hidden": "true" })), /* @__PURE__ */ React.createElement("a", { href: "https://linkedin.com/in/tahamajlesi", target: "_blank", className: "social-btn", "aria-label": "LinkedIn Profile (17.1k Followers)", title: "LinkedIn (17.1k+ Followers & Community)" }, /* @__PURE__ */ React.createElement("i", { className: "fab fa-linkedin-in", "aria-hidden": "true" })), /* @__PURE__ */ React.createElement("a", { href: "https://telegram.me/tahamajlesii", target: "_blank", className: "social-btn", "aria-label": "Telegram Chat", title: "Telegram (@tahamajlesii)" }, /* @__PURE__ */ React.createElement("i", { className: "fab fa-telegram", "aria-hidden": "true" })), /* @__PURE__ */ React.createElement("a", { href: "https://x.com/hooshaaii", target: "_blank", className: "social-btn", "aria-label": "X Twitter Profile", title: "X (Twitter)" }, /* @__PURE__ */ React.createElement("i", { className: "fab fa-x-twitter", "aria-hidden": "true" })), /* @__PURE__ */ React.createElement("a", { href: "mailto:tahamajlesi@ut.ac.ir", className: "social-btn", "aria-label": "Email Taha Majlesi", title: "Email" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-envelope", "aria-hidden": "true" })))))), /* @__PURE__ */ React.createElement("div", { className: "stats-bar fade-in-up" }, /* @__PURE__ */ React.createElement("div", { className: "stat-item" }, /* @__PURE__ */ React.createElement("span", { className: "stat-number" }, "12,787"), /* @__PURE__ */ React.createElement("span", { className: "stat-label" }, "Commits (Past Year)")), /* @__PURE__ */ React.createElement("div", { className: "stat-divider" }), /* @__PURE__ */ React.createElement("div", { className: "stat-item" }, /* @__PURE__ */ React.createElement("span", { className: "stat-number" }, "143"), /* @__PURE__ */ React.createElement("span", { className: "stat-label" }, "GitHub Repositories")), /* @__PURE__ */ React.createElement("div", { className: "stat-divider" }), /* @__PURE__ */ React.createElement("div", { className: "stat-item" }, /* @__PURE__ */ React.createElement("span", { className: "stat-number" }, "92 / 70"), /* @__PURE__ */ React.createElement("span", { className: "stat-label" }, "HF Models & Datasets")), /* @__PURE__ */ React.createElement("div", { className: "stat-divider" }), /* @__PURE__ */ React.createElement("div", { className: "stat-item" }, /* @__PURE__ */ React.createElement("span", { className: "stat-number" }, "521"), /* @__PURE__ */ React.createElement("span", { className: "stat-label" }, "GitHub Followers")), /* @__PURE__ */ React.createElement("div", { className: "stat-divider" }), /* @__PURE__ */ React.createElement("div", { className: "stat-item" }, /* @__PURE__ */ React.createElement("span", { className: "stat-number" }, "17.1k+"), /* @__PURE__ */ React.createElement("span", { className: "stat-label" }, "LinkedIn Followers"))), /* @__PURE__ */ React.createElement("section", { id: "achievements", className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "section-header fade-in-up" }, /* @__PURE__ */ React.createElement("h2", null, "Honors & Key ", /* @__PURE__ */ React.createElement("span", { className: "gradient-text" }, "Achievements")), /* @__PURE__ */ React.createElement("p", null, "Major technical milestones, academic distinctions, and open-source impact.")), /* @__PURE__ */ React.createElement("div", { className: "recruitment-grid fade-in-up" }, achievements.map((ach, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: "recruit-card" }, /* @__PURE__ */ React.createElement("div", { className: "recruit-icon" }, /* @__PURE__ */ React.createElement("i", { className: `fas ${ach.icon}`, "aria-hidden": "true" })), /* @__PURE__ */ React.createElement("h3", null, ach.title), /* @__PURE__ */ React.createElement("p", null, ach.desc))))), /* @__PURE__ */ React.createElement("section", { id: "recruitment", className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "section-header fade-in-up" }, /* @__PURE__ */ React.createElement("h2", null, "Why Recruit ", /* @__PURE__ */ React.createElement("span", { className: "gradient-text" }, "Taha Majlesi?")), /* @__PURE__ */ React.createElement("p", null, "Key impact metrics making Taha an exceptional hire for AI R&D teams, labs, and startups.")), /* @__PURE__ */ React.createElement("div", { className: "recruitment-grid fade-in-up" }, /* @__PURE__ */ React.createElement("div", { className: "recruit-card" }, /* @__PURE__ */ React.createElement("div", { className: "recruit-icon" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-rocket", "aria-hidden": "true" })), /* @__PURE__ */ React.createElement("h3", null, "Proven Founder Mindset"), /* @__PURE__ */ React.createElement("p", null, "Co-Founder at ", /* @__PURE__ */ React.createElement("b", null, "Hoosha AI \u{1F9E0}"), ". Proven capability to take research ideas from raw mathematics to production deployments & published papers.")), /* @__PURE__ */ React.createElement("div", { className: "recruit-card" }, /* @__PURE__ */ React.createElement("div", { className: "recruit-icon" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-microchip", "aria-hidden": "true" })), /* @__PURE__ */ React.createElement("h3", null, "First-Principles Systems Engineering"), /* @__PURE__ */ React.createElement("p", null, "Architected ", /* @__PURE__ */ React.createElement("b", null, "Kaleido"), " distributed LLM engine from scratch in CUDA, C++, and PyTorch across multi-GPU compute nodes.")), /* @__PURE__ */ React.createElement("div", { className: "recruit-card" }, /* @__PURE__ */ React.createElement("div", { className: "recruit-icon" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-brain", "aria-hidden": "true" })), /* @__PURE__ */ React.createElement("h3", null, "Frontier AI Research"), /* @__PURE__ */ React.createElement("p", null, "Deep expertise in ", /* @__PURE__ */ React.createElement("b", null, "Flow Matching ODEs"), ", ", /* @__PURE__ */ React.createElement("b", null, "GRPO 4B LLM fine-tuning"), ", synthetic datasets, and sub-quadratic linear attention.")), /* @__PURE__ */ React.createElement("div", { className: "recruit-card" }, /* @__PURE__ */ React.createElement("div", { className: "recruit-icon" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-graduation-cap", "aria-hidden": "true" })), /* @__PURE__ */ React.createElement("h3", null, "Academic & Social Pedigree"), /* @__PURE__ */ React.createElement("p", null, "Computer Engineering at ", /* @__PURE__ */ React.createElement("b", null, "University of Tehran"), ", TA at ", /* @__PURE__ */ React.createElement("b", null, "Sharif University of Technology"), ", reaching ", /* @__PURE__ */ React.createElement("b", null, "17.1k+ LinkedIn Followers"), ".")))), /* @__PURE__ */ React.createElement("section", { id: "playground", className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "section-header fade-in-up" }, /* @__PURE__ */ React.createElement("h2", null, "Interactive ", /* @__PURE__ */ React.createElement("span", { className: "gradient-text" }, "Code & Algorithm Sandbox")), /* @__PURE__ */ React.createElement("p", null, "Test and inspect live research code snippets authored by Taha Majlesi.")), /* @__PURE__ */ React.createElement("div", { className: "terminal-card fade-in-up" }, /* @__PURE__ */ React.createElement("div", { className: "terminal-bar" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px" } }, /* @__PURE__ */ React.createElement("span", { className: "t-dot red", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("span", { className: "t-dot yellow", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("span", { className: "t-dot green", "aria-hidden": "true" })), /* @__PURE__ */ React.createElement("div", { style: { marginLeft: "1.5rem", display: "flex", gap: "1rem" } }, /* @__PURE__ */ React.createElement("button", { className: `pub-btn ${activeCodeTab === "flow" ? "active" : ""}`, onClick: () => {
    setActiveCodeTab("flow");
    setCodeOutput("");
  } }, "Flow Matching ODE"), /* @__PURE__ */ React.createElement("button", { className: `pub-btn ${activeCodeTab === "grpo" ? "active" : ""}`, onClick: () => {
    setActiveCodeTab("grpo");
    setCodeOutput("");
  } }, "GRPO Loss (PyTorch)"), /* @__PURE__ */ React.createElement("button", { className: `pub-btn ${activeCodeTab === "kaleido" ? "active" : ""}`, onClick: () => {
    setActiveCodeTab("kaleido");
    setCodeOutput("");
  } }, "Kaleido CUDA Kernel")), /* @__PURE__ */ React.createElement("span", { className: "t-title" }, "gpu-node-01 (PyTorch 2.4)")), /* @__PURE__ */ React.createElement("div", { className: "terminal-code" }, /* @__PURE__ */ React.createElement("pre", null, codeSnippets[activeCodeTab]), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "1.5rem", display: "flex", gap: "1rem", alignItems: "center" } }, /* @__PURE__ */ React.createElement("button", { className: "primary-btn glow-btn", style: { padding: "0.5rem 1.5rem", fontSize: "0.9rem" }, onClick: runCodeSnippet }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-play", "aria-hidden": "true" }), " Run Sandbox Test")), codeOutput && /* @__PURE__ */ React.createElement("div", { style: { marginTop: "1rem", padding: "1rem", background: "#030508", borderRadius: "8px", border: "1px solid var(--cyan)", color: "#00f0ff", fontSize: "0.85rem" } }, /* @__PURE__ */ React.createElement("pre", null, codeOutput))))), /* @__PURE__ */ React.createElement("section", { id: "publications", className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "section-header fade-in-up" }, /* @__PURE__ */ React.createElement("h2", null, "Selected Research ", /* @__PURE__ */ React.createElement("span", { className: "gradient-text" }, "Publications & Reports")), /* @__PURE__ */ React.createElement("p", null, "Preprints, technical reports, and research papers authored by Taha Majlesi & Hoosha AI.")), /* @__PURE__ */ React.createElement("div", { className: "publications-list fade-in-up" }, /* @__PURE__ */ React.createElement("div", { className: "pub-card" }, /* @__PURE__ */ React.createElement("div", { className: "pub-badge" }, "Technical Report \u2022 2026"), /* @__PURE__ */ React.createElement("h3", { className: "pub-title" }, /* @__PURE__ */ React.createElement("a", { href: "https://hooshaai.substack.com/p/scaling-transformers-how-linear-attention", target: "_blank" }, "Scaling Transformers: How Linear Attention is Reshaping Cross-Task AI")), /* @__PURE__ */ React.createElement("p", { className: "pub-authors" }, /* @__PURE__ */ React.createElement("u", null, "Mohammad Taha Majlesi"), ", Hoosha AI Research Team"), /* @__PURE__ */ React.createElement("p", { className: "pub-venue" }, "Hoosha AI Technical Report Series & Open Paper 2026"), /* @__PURE__ */ React.createElement("p", { className: "pub-abstract" }, "We investigate sub-quadratic linear attention mechanisms (LinRec, SVD Attention) for scaling transformer architectures across long-context sequence modeling tasks without incurring $O(N^2)$ memory overhead."), /* @__PURE__ */ React.createElement("div", { className: "pub-links" }, /* @__PURE__ */ React.createElement("a", { href: "https://hooshaai.substack.com/p/scaling-transformers-how-linear-attention", target: "_blank", className: "pub-btn" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-file-alt", "aria-hidden": "true" }), " Article"), /* @__PURE__ */ React.createElement("a", { href: "https://github.com/tahamajs/SVD_linear_Attention", target: "_blank", className: "pub-btn" }, /* @__PURE__ */ React.createElement("i", { className: "fab fa-github", "aria-hidden": "true" }), " Code"), /* @__PURE__ */ React.createElement("button", { className: "pub-btn bibtex-btn", onClick: () => copyBibtex("@article{majlesi2026linear, title={Scaling Transformers: How Linear Attention is Reshaping Cross-Task AI}, author={Majlesi, Mohammad Taha}, journal={Hoosha AI Technical Reports}, year={2026}}") }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-quote-right", "aria-hidden": "true" }), " BibTeX"))), /* @__PURE__ */ React.createElement("div", { className: "pub-card" }, /* @__PURE__ */ React.createElement("div", { className: "pub-badge" }, "Research Paper \u2022 2026"), /* @__PURE__ */ React.createElement("h3", { className: "pub-title" }, /* @__PURE__ */ React.createElement("a", { href: "https://hooshaai.substack.com/p/implementing-grounded-causal-verification", target: "_blank" }, "Implementing Grounded Causal Verification to Prevent Recursive Epistemic Collapse in Self-Improving AI Systems")), /* @__PURE__ */ React.createElement("p", { className: "pub-authors" }, /* @__PURE__ */ React.createElement("u", null, "Mohammad Taha Majlesi"), ", Hoosha AI Lab"), /* @__PURE__ */ React.createElement("p", { className: "pub-venue" }, "Frontiers in AI Alignment & Reasoning 2026"), /* @__PURE__ */ React.createElement("p", { className: "pub-abstract" }, "A formal mathematical framework introducing grounded causal verification to constrain self-improving LLMs, preventing recursive hallucination loops and epistemic degradation."), /* @__PURE__ */ React.createElement("div", { className: "pub-links" }, /* @__PURE__ */ React.createElement("a", { href: "https://hooshaai.substack.com/p/implementing-grounded-causal-verification", target: "_blank", className: "pub-btn" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-file-alt", "aria-hidden": "true" }), " Article"), /* @__PURE__ */ React.createElement("a", { href: "https://github.com/Hooshaai/consciousness_in_LLMs", target: "_blank", className: "pub-btn" }, /* @__PURE__ */ React.createElement("i", { className: "fab fa-github", "aria-hidden": "true" }), " Code"), /* @__PURE__ */ React.createElement("button", { className: "pub-btn bibtex-btn", onClick: () => copyBibtex("@article{majlesi2026causal, title={Implementing Grounded Causal Verification to Prevent Recursive Epistemic Collapse}, author={Majlesi, Mohammad Taha}, journal={Hoosha AI Research}, year={2026}}") }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-quote-right", "aria-hidden": "true" }), " BibTeX"))))), /* @__PURE__ */ React.createElement("section", { id: "models", className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "section-header fade-in-up" }, /* @__PURE__ */ React.createElement("h2", null, "Hugging Face ", /* @__PURE__ */ React.createElement("span", { className: "gradient-text" }, "Models & Datasets (", filteredHf.length, " Assets)")), /* @__PURE__ */ React.createElement("p", null, "Pre-trained model weights, fine-tuned adapters, and open synthetic datasets published by Taha Majlesi.")), /* @__PURE__ */ React.createElement("div", { className: "filter-tabs fade-in-up", style: { marginBottom: "2rem" } }, [
    { id: "all", label: "All HF Assets (162)" },
    { id: "model", label: "\u{1F916} Models (92)" },
    { id: "dataset", label: "\u{1F4CA} Datasets (70)" }
  ].map((tab) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: tab.id,
      className: `filter-btn ${hfFilter === tab.id ? "active" : ""}`,
      onClick: () => setHfFilter(tab.id)
    },
    tab.label
  ))), /* @__PURE__ */ React.createElement("div", { className: "hf-models-grid fade-in-up" }, filteredHf.map((hf, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "hf-card" }, /* @__PURE__ */ React.createElement("div", { className: "hf-badge" }, /* @__PURE__ */ React.createElement("i", { className: `fas ${hf.type === "model" ? "fa-robot" : "fa-database"}`, "aria-hidden": "true" }), " ", hf.type.toUpperCase(), " \u2022 \u2764\uFE0F ", hf.likes, " \u2022 \u{1F4E5} ", hf.downloads), /* @__PURE__ */ React.createElement("h3", null, hf.id), /* @__PURE__ */ React.createElement("p", null, "Pre-trained open science release published on Hugging Face Hub."), /* @__PURE__ */ React.createElement("div", { className: "hf-code-line" }, /* @__PURE__ */ React.createElement("code", null, String(hf.code || "").split("\n")[0])), /* @__PURE__ */ React.createElement("a", { href: hf.url, target: "_blank", className: "hf-link" }, "View Asset on Hugging Face ", /* @__PURE__ */ React.createElement("i", { className: "fas fa-external-link-alt", "aria-hidden": "true" })))))), /* @__PURE__ */ React.createElement("section", { id: "projects", className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "section-header fade-in-up" }, /* @__PURE__ */ React.createElement("h2", null, "Interactive ", /* @__PURE__ */ React.createElement("span", { className: "gradient-text" }, "Repository Ecosystem (", counts.all, " Repos)")), /* @__PURE__ */ React.createElement("p", null, "Live search and filter through all 143 repositories, Hugging Face models, and engineering projects.")), /* @__PURE__ */ React.createElement("div", { className: "search-box-wrapper fade-in-up" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-search search-icon", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      "aria-label": "Live search across repositories",
      placeholder: "Live search across 143 repos, languages (PyTorch, C++, CUDA, Django)...",
      value: search,
      onChange: (e) => setSearch(e.target.value)
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "filter-tabs fade-in-up" }, [
    { id: "all", label: "All Projects", count: counts.all },
    { id: "course", label: "\u{1F393} University Courses", count: counts.course },
    { id: "ai", label: "AI & LLMs", count: counts.ai },
    { id: "systems", label: "Systems & Kernels", count: counts.systems },
    { id: "hf", label: "Hugging Face", count: counts.hf },
    { id: "web", label: "Software & Web", count: counts.web }
  ].map((tab) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: tab.id,
      className: `filter-btn ${filter === tab.id ? "active" : ""}`,
      onClick: () => setFilter(tab.id)
    },
    tab.label,
    " ",
    /* @__PURE__ */ React.createElement("span", { className: "filter-count" }, tab.count)
  ))), /* @__PURE__ */ React.createElement("div", { className: "bento-grid" }, filteredRepos.map((r, i) => /* @__PURE__ */ React.createElement("a", { key: i, href: r.url, target: "_blank", className: `bento-item ${r.isCourse || r.stars >= 4 ? "bento-wide" : ""}` }, /* @__PURE__ */ React.createElement("div", { className: "bento-inner" }, /* @__PURE__ */ React.createElement("div", { className: "project-tag" }, /* @__PURE__ */ React.createElement("i", { className: `fas ${r.icon}`, "aria-hidden": "true" }), " ", r.tag, " \u2022 \u2B50 ", r.stars), /* @__PURE__ */ React.createElement("h3", { className: "repo-title" }, r.title), /* @__PURE__ */ React.createElement("p", { className: "repo-desc" }, r.desc), /* @__PURE__ */ React.createElement("div", { className: "bento-tags" }, /* @__PURE__ */ React.createElement("span", { className: "tag" }, r.lang), r.isCourse && /* @__PURE__ */ React.createElement("span", { className: "tag" }, r.uni, " Course"))))))), /* @__PURE__ */ React.createElement("section", { id: "substack", className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "section-header fade-in-up" }, /* @__PURE__ */ React.createElement("h2", null, "Hoosha AI \u{1F9E0} ", /* @__PURE__ */ React.createElement("span", { className: "gradient-text" }, "Substack Newsletter (", filteredArticles.length, " Deep Dives)")), /* @__PURE__ */ React.createElement("p", null, "Deep dives into ML/AI papers, LLM reasoning, cognitive scaling, and sub-quadratic attention.")), /* @__PURE__ */ React.createElement("div", { className: "search-box-wrapper fade-in-up", style: { marginBottom: "2rem" } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-search search-icon", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      "aria-label": "Search Substack articles",
      placeholder: "Search Substack articles by title or topic...",
      value: substackSearch,
      onChange: (e) => setSubstackSearch(e.target.value)
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "articles-grid" }, filteredArticles.map((art, idx) => /* @__PURE__ */ React.createElement("a", { key: idx, href: art.link, target: "_blank", className: "article-card fade-in-up" }, /* @__PURE__ */ React.createElement("div", { className: "article-tag" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-newspaper", "aria-hidden": "true" }), " Substack \u2022 ", art.date), /* @__PURE__ */ React.createElement("h3", null, art.title), /* @__PURE__ */ React.createElement("p", null, art.desc), /* @__PURE__ */ React.createElement("span", { className: "read-more" }, "Read Full Deep Dive ", /* @__PURE__ */ React.createElement("i", { className: "fas fa-arrow-right", "aria-hidden": "true" })))))))), /* @__PURE__ */ React.createElement("footer", null, /* @__PURE__ */ React.createElement("p", null, "\xA9 2026 Mohammad Taha Majlesi. Co-Founder @ Hoosha AI. Built with React 18 & extreme precision.")));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
