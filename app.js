(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // src/react-shim.js
  var require_react_shim = __commonJS({
    "src/react-shim.js"(exports, module) {
      module.exports = window.React;
    }
  });

  // src/react-dom-client-shim.js
  var require_react_dom_client_shim = __commonJS({
    "src/react-dom-client-shim.js"(exports, module) {
      module.exports = {
        createRoot: function(container) {
          return window.ReactDOM.createRoot(container);
        }
      };
    }
  });

  // src/index.jsx
  var import_react15 = __toESM(require_react_shim());
  var import_client = __toESM(require_react_dom_client_shim());

  // src/App.jsx
  var import_react14 = __toESM(require_react_shim());

  // src/hooks/index.js
  var import_react = __toESM(require_react_shim());
  function useToast() {
    const [msg, setMsg] = (0, import_react.useState)(null);
    const show = (0, import_react.useCallback)((m, ms = 2800) => {
      setMsg(m);
      setTimeout(() => setMsg(null), ms);
    }, []);
    return [msg, show];
  }
  function useTehranClock() {
    const [time, setTime] = (0, import_react.useState)("--:--:--");
    (0, import_react.useEffect)(() => {
      const fmt = () => new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Tehran",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      }).format(/* @__PURE__ */ new Date());
      setTime(fmt());
      const id = setInterval(() => setTime(fmt()), 1e3);
      return () => clearInterval(id);
    }, []);
    return time;
  }
  function useGpuMetrics() {
    const [m, setM] = (0, import_react.useState)({ flops: "312.0", vram: "68.4", lat: "1.20", temp: "52", util: "96" });
    (0, import_react.useEffect)(() => {
      const id = setInterval(() => setM({
        flops: (308 + Math.random() * 8).toFixed(1),
        vram: (67 + Math.random() * 3).toFixed(1),
        lat: (1.1 + Math.random() * 0.25).toFixed(2),
        temp: String(50 + (Math.random() * 6 | 0)),
        util: String(93 + (Math.random() * 5 | 0))
      }), 1800);
      return () => clearInterval(id);
    }, []);
    return m;
  }
  function useBeep(soundOn) {
    const ctx = (0, import_react.useRef)(null);
    return (0, import_react.useCallback)((freq = 440, type = "sine", vol = 0.03) => {
      if (!soundOn) return;
      try {
        if (!ctx.current) ctx.current = new (window.AudioContext || window.webkitAudioContext)();
        const c = ctx.current, osc = c.createOscillator(), g = c.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        g.gain.setValueAtTime(vol, c.currentTime);
        g.gain.exponentialRampToValueAtTime(1e-4, c.currentTime + 0.18);
        osc.connect(g);
        g.connect(c.destination);
        osc.start();
        osc.stop(c.currentTime + 0.18);
      } catch (_) {
      }
    }, [soundOn]);
  }
  function useNeuralCanvas() {
    (0, import_react.useEffect)(() => {
      const spot = document.getElementById("cursor-spotlight");
      const onMove = (e) => {
        if (spot) {
          spot.style.left = e.clientX + "px";
          spot.style.top = e.clientY + "px";
        }
      };
      window.addEventListener("mousemove", onMove);
      const cvs = document.getElementById("neural-canvas");
      if (!cvs) return;
      const ctx = cvs.getContext("2d", { alpha: true });
      let W = cvs.width = innerWidth, H = cvs.height = innerHeight;
      const N = W > 700 ? 72 : 32;
      const pts = Array.from({ length: N }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 1.8 + 0.5,
        a: Math.random(),
        da: (Math.random() * 0.02 + 4e-3) * (Math.random() < 0.5 ? 1 : -1)
      }));
      const comets = [];
      const spawn = () => comets.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.4,
        len: Math.random() * 90 + 40,
        spd: Math.random() * 9 + 5,
        ang: Math.PI / 4,
        a: 1,
        da: 0.015 + Math.random() * 0.015
      });
      const ct = setInterval(() => {
        if (Math.random() < 0.7) spawn();
      }, 2400);
      let raf, last = 0;
      const draw = (ts) => {
        if (ts - last < 16) {
          raf = requestAnimationFrame(draw);
          return;
        }
        last = ts;
        ctx.clearRect(0, 0, W, H);
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d2 = dx * dx + dy * dy;
            if (d2 < 14e3) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(0,240,255,${0.12 * (1 - Math.sqrt(d2) / 118)})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(pts[i].x, pts[i].y);
              ctx.lineTo(pts[j].x, pts[j].y);
              ctx.stroke();
            }
          }
          const p = pts[i];
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = W;
          if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H;
          if (p.y > H) p.y = 0;
          p.a += p.da;
          if (p.a < 0.15 || p.a > 1) p.da *= -1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, 6.283);
          ctx.fillStyle = `rgba(0,240,255,${p.a * 0.7})`;
          ctx.fill();
        }
        for (let i = comets.length - 1; i >= 0; i--) {
          const c = comets[i];
          const ex = c.x + Math.cos(c.ang) * c.len, ey = c.y + Math.sin(c.ang) * c.len;
          const g = ctx.createLinearGradient(c.x, c.y, ex, ey);
          g.addColorStop(0, `rgba(255,255,255,${c.a})`);
          g.addColorStop(0.4, `rgba(0,240,255,${c.a * 0.8})`);
          g.addColorStop(1, "rgba(138,43,226,0)");
          ctx.beginPath();
          ctx.moveTo(c.x, c.y);
          ctx.lineTo(ex, ey);
          ctx.strokeStyle = g;
          ctx.lineWidth = 2.5;
          ctx.stroke();
          c.x += Math.cos(c.ang) * c.spd;
          c.y += Math.sin(c.ang) * c.spd;
          c.a -= c.da;
          if (c.a <= 0 || c.x > W || c.y > H) comets.splice(i, 1);
        }
        raf = requestAnimationFrame(draw);
      };
      raf = requestAnimationFrame(draw);
      const onResize = () => {
        W = cvs.width = innerWidth;
        H = cvs.height = innerHeight;
      };
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("resize", onResize);
        clearInterval(ct);
        cancelAnimationFrame(raf);
      };
    }, []);
  }

  // src/components/layout/Navigation.jsx
  var import_react2 = __toESM(require_react_shim());
  function Navigation({ mobileNav, setMobileNav, onHire, onCmd }) {
    (0, import_react2.useEffect)(() => {
      const fn = () => setMobileNav(false);
      window.addEventListener("scroll", fn, { passive: true });
      return () => window.removeEventListener("scroll", fn);
    }, [setMobileNav]);
    return /* @__PURE__ */ React.createElement("nav", { className: "glass-nav" }, /* @__PURE__ */ React.createElement("div", { className: "nav-container" }, /* @__PURE__ */ React.createElement("div", { className: "logo" }, "Taha ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--accent)" } }, "/"), " Hoosha AI"), /* @__PURE__ */ React.createElement("div", { className: `nav-links ${mobileNav ? "open" : ""}` }, /* @__PURE__ */ React.createElement("a", { href: "#about", onClick: () => setMobileNav(false) }, "About"), /* @__PURE__ */ React.createElement("a", { href: "#sandbox", onClick: () => setMobileNav(false) }, "AI Lab"), /* @__PURE__ */ React.createElement("a", { href: "#projects", onClick: () => setMobileNav(false) }, "Systems & Models"), /* @__PURE__ */ React.createElement("a", { href: "#publications", onClick: () => setMobileNav(false) }, "Publications"), /* @__PURE__ */ React.createElement("a", { href: "#substack", onClick: () => setMobileNav(false) }, "Essays"), /* @__PURE__ */ React.createElement("a", { href: "#experience", onClick: () => setMobileNav(false) }, "Timeline"), /* @__PURE__ */ React.createElement("button", { className: "nav-hire-btn", onClick: () => {
      setMobileNav(false);
      onHire();
    } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-briefcase" }), " Recruit / Hire Taha"), /* @__PURE__ */ React.createElement("a", { href: "https://github.com/sponsors/tahamajs", target: "_blank", className: "nav-hire-btn", style: { background: "#ea4aaa", color: "#fff" } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-heart" }), " Sponsor")), /* @__PURE__ */ React.createElement("button", { className: "cmd-k-btn", onClick: onCmd }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-search" }), " ", /* @__PURE__ */ React.createElement("span", { className: "cmd-k-key" }, "\u2318K")), /* @__PURE__ */ React.createElement("button", { className: "mobile-nav-toggle", onClick: () => setMobileNav(!mobileNav) }, /* @__PURE__ */ React.createElement("i", { className: `fas ${mobileNav ? "fa-times" : "fa-bars"}` }))));
  }

  // src/components/layout/Footer.jsx
  function Footer({ gpuM }) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("footer", { style: { textAlign: "center", padding: "4rem 1.5rem 8rem", borderTop: "1px solid var(--border)", background: "var(--bg2)" } }, /* @__PURE__ */ React.createElement("p", { style: { color: "var(--muted)", fontSize: ".85rem", marginBottom: "1rem" } }, "\xA9 ", (/* @__PURE__ */ new Date()).getFullYear(), " Mohammad Taha Majlesi. Open-Source AI Infrastructure."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("a", { href: "https://github.com/tahamajs", target: "_blank" }, "GitHub"), /* @__PURE__ */ React.createElement("a", { href: "https://huggingface.co/tahamajs", target: "_blank" }, "HuggingFace"), /* @__PURE__ */ React.createElement("a", { href: "https://hooshaai.substack.com", target: "_blank" }, "Hoosha AI"), /* @__PURE__ */ React.createElement("a", { href: "https://linkedin.com/in/tahamajlesi", target: "_blank" }, "LinkedIn"), /* @__PURE__ */ React.createElement("a", { href: "https://github.com/sponsors/tahamajs", target: "_blank", style: { color: "#ea4aaa" } }, "Sponsor"))), /* @__PURE__ */ React.createElement("div", { className: "gpu-bar" }, /* @__PURE__ */ React.createElement("div", { className: "gpu-dot" }), /* @__PURE__ */ React.createElement("div", { className: "gpu-item" }, "Node: ", /* @__PURE__ */ React.createElement("b", null, "A100-SXM4-80GB")), /* @__PURE__ */ React.createElement("div", { className: "gpu-item" }, "SM Util: ", /* @__PURE__ */ React.createElement("span", { className: "gpu-val" }, gpuM.util, "%")), /* @__PURE__ */ React.createElement("div", { className: "gpu-item" }, "VRAM: ", /* @__PURE__ */ React.createElement("span", { className: "gpu-val" }, gpuM.vram, " GB"), " / 80.0"), /* @__PURE__ */ React.createElement("div", { className: "gpu-item" }, "Bandwidth: ", /* @__PURE__ */ React.createElement("span", { className: "gpu-val" }, "1.8 TB/s")), /* @__PURE__ */ React.createElement("div", { className: "gpu-item" }, "TFLOPS: ", /* @__PURE__ */ React.createElement("span", { className: "gpu-val" }, gpuM.flops)), /* @__PURE__ */ React.createElement("div", { className: "gpu-item" }, "Temp: ", /* @__PURE__ */ React.createElement("span", { className: "gpu-val" }, gpuM.temp, "\xB0C"))));
  }

  // src/data/constants.js
  var TAGS = [
    "Flow Matching ODEs",
    "GRPO Alignment",
    "Score-Based Diffusion",
    "Task Arithmetic",
    "CUDA GPU Kernels",
    "Linear Attention",
    "Integrated Information Theory",
    "PaliGemma QLoRA",
    "xv6 OS Kernel",
    "Persian LLMs",
    "Kaleido Engine",
    "SVD Attention"
  ];
  var STATS = [
    { num: "12,787", label: "Commits (Past Year)" },
    { num: "143", label: "GitHub Repositories" },
    { num: "92/70", label: "HF Models / Datasets" },
    { num: "521", label: "GitHub Followers" },
    { num: "17.1k+", label: "LinkedIn Followers" },
    { num: "20", label: "Research Papers" }
  ];
  var ACHIEVEMENTS = [
    { icon: "fa-users", val: "17.1k+", title: "LinkedIn Community", desc: "One of Iran's largest AI communities \u2014 weekly deep-dives on LLM alignment, GPU engineering, and distributed systems." },
    { icon: "fa-code-commit", val: "12,787", title: "Commits (Past Year)", desc: "Top 1% globally for open-source contribution velocity across 143 public repositories and 44 showcased projects." },
    { icon: "fa-robot", val: "162", title: "Hugging Face Assets", desc: "92 pre-trained model checkpoints + 70 synthetic evaluation datasets published openly on the HF Hub." },
    { icon: "fa-newspaper", val: "20", title: "Research Papers", desc: "Deep-dive Substack papers on Flow Matching, GRPO, CUDA kernels, IIT consciousness, and sub-quadratic attention." },
    { icon: "fa-graduation-cap", val: "500+", title: "Students Mentored", desc: "TA across 6 graduate / undergraduate courses at University of Tehran and Sharif University of Technology." },
    { icon: "fa-microchip", val: "4D", title: "Kaleido CUDA Engine", desc: "First-principles distributed LLM training framework \u2014 data, tensor, sequence & pipeline parallelism on A100 clusters." },
    { icon: "fa-flask", val: "\u221E", title: "Hoosha AI Co-Founder", desc: "Research startup bridging frontier ML (Flow Matching, GRPO) with IIT-based synthetic cognitive AI research." },
    { icon: "fa-heart", val: "Open", title: "GitHub Sponsor", desc: "Support Taha's open-source work on CUDA engines, Persian LLMs, and AI research tooling via GitHub Sponsors." }
  ];
  var SKILLS = [
    { cat: "Languages", items: ["Python", "C++ 20", "CUDA/C", "Kotlin", "Java", "JavaScript", "Verilog", "Bash"] },
    { cat: "ML / AI", items: ["PyTorch 2.x", "JAX/Flax", "HuggingFace", "DeepSpeed", "PEFT / QLoRA", "TRL / GRPO"] },
    { cat: "GPU Systems", items: ["CUDA 12.2", "cuBLAS", "NCCL", "MPI", "Triton", "Nsight Compute"] },
    { cat: "Infra & DevOps", items: ["Docker", "GitHub Actions", "FastAPI", "Django REST", "PostgreSQL", "Redis"] },
    { cat: "Research Topics", items: ["Flow Matching", "Diffusion SDEs", "RLHF/GRPO", "Linear Attention", "VAE Unlearning", "IIT \u03A6"] },
    { cat: "Systems CS", items: ["xv6 OS Kernel", "Pipelined ARM CPU", "Compilers (Flex/Bison)", "TCP/UDP Sockets", "Verilog RTL"] }
  ];
  var TIMELINE = [
    { year: "2026", icon: "fa-rocket", color: "#00f0ff", title: "Co-Founded Hoosha AI \u{1F9E0}", desc: "Launched AI research startup focused on Flow Matching generation, GRPO post-training, and IIT-based synthetic cognition." },
    { year: "2026", icon: "fa-newspaper", color: "#8a2be2", title: "20 Substack Research Papers Published", desc: "Deep-dive technical papers on Flow Matching ODEs, GRPO, CUDA kernels, IIT consciousness theory, and SVD linear attention." },
    { year: "2026", icon: "fa-users", color: "#10b981", title: "17,100+ LinkedIn Community", desc: "Built one of Iran's largest AI communities through consistent research content, open-source tooling, and GPU engineering posts." },
    { year: "2025", icon: "fa-graduation-cap", color: "#f59e0b", title: "TA @ Sharif \u2014 Compiler Construction", desc: "Teaching Assistant for Compiler Construction at Sharif University of Technology, supervising 200+ students on lexers and parsers." },
    { year: "2025", icon: "fa-microchip", color: "#00f0ff", title: "Built Kaleido Engine \u26A1 (4D CUDA Parallel)", desc: "From-scratch distributed LLM training framework in CUDA 12.2/C++ \u2014 data, tensor, sequence, and pipeline parallelism on A100 SXM4." },
    { year: "2025", icon: "fa-brain", color: "#8a2be2", title: "GRPO GSM8K: 80.7% (+18% rel. over SFT)", desc: "Fine-tuned 4B LLM with custom GRPO pipeline: clipped surrogate objective + KL regularisation on 8\xD7A100, achieving 80.7% pass@1." },
    { year: "2024", icon: "fa-graduation-cap", color: "#10b981", title: "TA @ UT \u2014 M.Sc. ML, AI, OS Lab, C++", desc: "Teaching Assistant for 4 simultaneous graduate/undergraduate courses at University of Tehran \u2014 300+ students mentored." },
    { year: "2024", icon: "fa-robot", color: "#f59e0b", title: "162 HuggingFace Assets Published", desc: "Reached 162 public HF assets: 92 pre-trained model checkpoints and 70 synthetic evaluation datasets with 1000+ total downloads." },
    { year: "2023", icon: "fa-graduation-cap", color: "#00f0ff", title: "Started CE at University of Tehran", desc: "Enrolled in Computer Engineering at University of Tehran \u2014 focus on systems architecture, AI research, and distributed computing." }
  ];
  var CONSTELLATION = [
    { id: "core", label: "Taha Majlesi", type: "core", x: 50, y: 50, desc: "Co-Founder & AI Architect @ Hoosha AI | CE @ University of Tehran | TA @ Sharif University of Technology" },
    { id: "hoosha", label: "Hoosha AI \u{1F9E0}", type: "startup", x: 24, y: 28, desc: "Frontier AI research startup: Flow Matching, GRPO post-training, IIT-based synthetic consciousness, distributed GPU systems." },
    { id: "ut", label: "Univ. of Tehran", type: "academic", x: 75, y: 28, desc: "Primary CE degree. TA for M.Sc. ML, AI, OS Lab, Advanced Programming \u2014 mentoring 500+ students across 6 courses." },
    { id: "sharif", label: "Sharif Univ.", type: "academic", x: 78, y: 72, desc: "Cross-institutional TA for Compiler Construction at Sharif University of Technology (2025\u2013present)." },
    { id: "kaleido", label: "Kaleido Engine \u26A1", type: "system", x: 22, y: 72, desc: "From-scratch 4D-parallel distributed LLM training in CUDA 12.2/C++ targeting A100 SXM4 clusters." },
    { id: "hf", label: "HuggingFace (162)", type: "science", x: 50, y: 16, desc: "92 pre-trained model weights & 70 synthetic datasets. Top: persian-instruct-200k (312 downloads)." },
    { id: "sub", label: "Substack (20)", type: "research", x: 50, y: 84, desc: "20 technical deep-dives: Flow Matching ODEs, GRPO alignment, CUDA kernels, IIT consciousness, SVD linear attention." },
    { id: "linkedin", label: "LinkedIn 17.1k", type: "startup", x: 12, y: 50, desc: "17,100+ followers \u2014 Iran's largest AI community. Weekly posts on LLM alignment and GPU engineering." }
  ];
  var CMD_ITEMS = [
    { text: "Open AI Research Assistant", icon: "fas fa-robot", id: "ai" },
    { text: "Open Recruit / Hire Taha", icon: "fas fa-briefcase", id: "hire" },
    { text: "Sponsor Taha on GitHub", icon: "fas fa-heart", id: "sponsor" },
    { text: "Toggle Constellation / Bento view", icon: "fas fa-project-diagram", id: "view" },
    { text: "Open LinkedIn (17.1k followers)", icon: "fab fa-linkedin", id: "linkedin" },
    { text: "View HuggingFace (162 assets)", icon: "fas fa-robot", id: "hf" },
    { text: "Read Hoosha AI Substack", icon: "fas fa-newspaper", id: "substack" },
    { text: "Email Taha directly", icon: "fas fa-envelope", id: "email" },
    { text: "Download Resume PDF", icon: "fas fa-file-pdf", id: "resume" }
  ];

  // src/components/sections/HeroSection.jsx
  function HeroSection({ time, onHire, onAI, onSponsor, setSearch, scrollTo, beep }) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("section", { id: "about", className: "hero" }, /* @__PURE__ */ React.createElement("div", { className: "hero-inner fade-up" }, /* @__PURE__ */ React.createElement("div", { className: "avatar-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "avatar-ring" }), /* @__PURE__ */ React.createElement("div", { className: "avatar-ring2" }), /* @__PURE__ */ React.createElement(
      "img",
      {
        src: "assets/avatar.jpg",
        onError: (e) => {
          e.target.src = "https://github.com/tahamajs.png";
        },
        alt: "Mohammad Taha Majlesi",
        className: "avatar-img"
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "hero-badge" }, /* @__PURE__ */ React.createElement("span", { className: "dot" }), "Co-Founder & AI Architect @ Hoosha AI \u{1F9E0} \xB7 University of Tehran"), /* @__PURE__ */ React.createElement("div", { className: "hero-clock" }, "Tehran: ", /* @__PURE__ */ React.createElement("b", null, time), " (UTC +3:30) \xA0\xB7\xA0", /* @__PURE__ */ React.createElement("span", { className: "status-green" }, "\u2B24 Open to Roles & Collaboration")), /* @__PURE__ */ React.createElement("h1", { className: "hero-title" }, "Mohammad Taha Majlesi", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "gradient-text" }, "AI Systems Engineer & Researcher")), /* @__PURE__ */ React.createElement("p", { className: "hero-subtitle" }, "Building scalable AI systems and distributed GPU infrastructure. Co-Founder of ", /* @__PURE__ */ React.createElement("b", null, "Hoosha AI \u{1F9E0}"), " \xB7 ", /* @__PURE__ */ React.createElement("b", null, "17.1k+ LinkedIn community"), " \xB7 CE student at ", /* @__PURE__ */ React.createElement("b", null, "University of Tehran"), " \xB7 TA at ", /* @__PURE__ */ React.createElement("b", null, "Sharif University"), ". Research focus: ", /* @__PURE__ */ React.createElement("b", null, "Flow Matching"), ", ", /* @__PURE__ */ React.createElement("b", null, "GRPO alignment"), ", ", /* @__PURE__ */ React.createElement("b", null, "CUDA/C++ engines"), ", and ", /* @__PURE__ */ React.createElement("b", null, "sub-quadratic attention"), "."), /* @__PURE__ */ React.createElement("div", { className: "tag-cloud" }, TAGS.map((tag) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: tag,
        className: "tag-pill",
        onClick: () => {
          setSearch(tag);
          scrollTo("projects");
          beep?.(700);
        }
      },
      /* @__PURE__ */ React.createElement("i", { className: "fas fa-tag", style: { fontSize: ".6rem" } }),
      " ",
      tag
    ))), /* @__PURE__ */ React.createElement("div", { className: "hero-actions" }, /* @__PURE__ */ React.createElement("button", { className: "btn-primary", onClick: onHire }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-briefcase" }), " Recruit / Hire Taha"), /* @__PURE__ */ React.createElement(
      "a",
      {
        href: "https://github.com/sponsors/tahamajs",
        target: "_blank",
        className: "btn-sponsor",
        onClick: () => beep?.(880, "triangle")
      },
      /* @__PURE__ */ React.createElement("i", { className: "fas fa-heart" }),
      " Sponsor on GitHub"
    ), /* @__PURE__ */ React.createElement("a", { href: "assets/resume.pdf", target: "_blank", className: "btn-secondary" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-file-pdf" }), " Resume PDF"), /* @__PURE__ */ React.createElement("a", { href: "https://hooshaai.substack.com", target: "_blank", className: "btn-secondary" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-newspaper" }), " Substack")), /* @__PURE__ */ React.createElement("div", { className: "social-row" }, [
      ["fab fa-github", "https://github.com/tahamajs", "GitHub"],
      ["fas fa-robot", "https://huggingface.co/tahamajs", "HuggingFace"],
      ["fab fa-linkedin-in", "https://linkedin.com/in/tahamajlesi", "LinkedIn 17.1k"],
      ["fab fa-telegram", "https://telegram.me/tahamajlesii", "Telegram"],
      ["fas fa-newspaper", "https://hooshaai.substack.com", "Substack"],
      ["fas fa-heart", "https://github.com/sponsors/tahamajs", "Sponsor"],
      ["fas fa-envelope", "mailto:tahamajlesi@ut.ac.ir", "Email"]
    ].map(([ic, href, lbl]) => /* @__PURE__ */ React.createElement(
      "a",
      {
        key: lbl,
        href,
        target: href.startsWith("mailto") ? "_self" : "_blank",
        className: `social-btn${lbl === "Sponsor" ? " social-sponsor" : ""}`,
        "aria-label": lbl,
        title: lbl
      },
      /* @__PURE__ */ React.createElement("i", { className: ic })
    ))))), /* @__PURE__ */ React.createElement("div", { className: "stats-bar" }, STATS.map((s) => /* @__PURE__ */ React.createElement("div", { key: s.label, className: "stat-cell" }, /* @__PURE__ */ React.createElement("span", { className: "stat-num" }, s.num), /* @__PURE__ */ React.createElement("span", { className: "stat-lbl" }, s.label)))));
  }

  // src/components/sections/AchievementsSection.jsx
  var import_react3 = __toESM(require_react_shim());

  // src/components/ui/SectionHead.jsx
  function SectionHead({ tag, title, sub }) {
    return /* @__PURE__ */ React.createElement("div", { className: "section-head" }, tag && /* @__PURE__ */ React.createElement("div", { className: "section-tag" }, tag), /* @__PURE__ */ React.createElement("h2", { dangerouslySetInnerHTML: { __html: title } }), sub && /* @__PURE__ */ React.createElement("p", null, sub));
  }

  // src/components/sections/AchievementsSection.jsx
  function CountUp({ target, running }) {
    const [val, setVal] = (0, import_react3.useState)(0);
    const isNum = !isNaN(parseInt(target));
    const numeric = parseInt(target);
    const suffix = isNum ? target.replace(numeric, "") : "";
    (0, import_react3.useEffect)(() => {
      if (!running || !isNum) return;
      let start = 0;
      const step = Math.ceil(numeric / 60);
      const id = setInterval(() => {
        start += step;
        if (start >= numeric) {
          setVal(numeric);
          clearInterval(id);
        } else setVal(start);
      }, 16);
      return () => clearInterval(id);
    }, [running, numeric, isNum]);
    if (!isNum) return /* @__PURE__ */ React.createElement("span", null, target);
    return /* @__PURE__ */ React.createElement("span", null, val.toLocaleString(), suffix);
  }
  function AchievementsSection() {
    const ref = (0, import_react3.useRef)(null);
    const [visible, setVisible] = (0, import_react3.useState)(false);
    (0, import_react3.useEffect)(() => {
      const observer = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) setVisible(true);
      }, { threshold: 0.2 });
      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    }, []);
    return /* @__PURE__ */ React.createElement("section", { className: "section fade-up", ref }, /* @__PURE__ */ React.createElement(
      SectionHead,
      {
        tag: "Impact",
        title: "By The Numbers",
        sub: "Open-source velocity, research output, and community impact \u2014 measured."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "achv-grid" }, ACHIEVEMENTS.map((a, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "achv-card" }, /* @__PURE__ */ React.createElement("div", { className: "achv-icon-wrap" }, /* @__PURE__ */ React.createElement("i", { className: `fas ${a.icon}` })), /* @__PURE__ */ React.createElement("div", { className: "achv-val" }, /* @__PURE__ */ React.createElement(CountUp, { target: a.val, running: visible })), /* @__PURE__ */ React.createElement("div", { className: "achv-title" }, a.title), /* @__PURE__ */ React.createElement("p", { className: "achv-desc" }, a.desc)))));
  }

  // src/components/sections/ConstellationSection.jsx
  var import_react4 = __toESM(require_react_shim());
  var EDGES = [
    ["core", "hoosha"],
    ["core", "ut"],
    ["core", "sharif"],
    ["core", "kaleido"],
    ["core", "hf"],
    ["core", "sub"],
    ["core", "linkedin"],
    ["hoosha", "kaleido"],
    ["hoosha", "sub"],
    ["ut", "sharif"],
    ["hf", "sub"]
  ];
  var TYPE_COLORS = {
    core: "#00f0ff",
    startup: "#8a2be2",
    academic: "#10b981",
    system: "#f59e0b",
    science: "#60a5fa",
    research: "#f43f5e"
  };
  function ConstellationSection({ beep }) {
    const [active, setActive] = (0, import_react4.useState)(null);
    const [dims, setDims] = (0, import_react4.useState)({ w: 700, h: 400 });
    const ref = (0, import_react4.useRef)(null);
    (0, import_react4.useEffect)(() => {
      const update = () => {
        if (ref.current) setDims({ w: ref.current.offsetWidth, h: ref.current.offsetHeight });
      };
      update();
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }, []);
    const getPos = (node) => ({
      x: node.x / 100 * dims.w,
      y: node.y / 100 * dims.h
    });
    const activeNode = CONSTELLATION.find((n) => n.id === active);
    return /* @__PURE__ */ React.createElement("section", { id: "constellation", className: "section fade-up" }, /* @__PURE__ */ React.createElement(
      SectionHead,
      {
        tag: "Knowledge Graph",
        title: "Research & Affiliation Constellation",
        sub: "Click any node to explore Taha's research ecosystem, affiliations, and impact vectors."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "constellation-wrap", ref }, /* @__PURE__ */ React.createElement("svg", { width: "100%", height: "100%", style: { position: "absolute", inset: 0 } }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("filter", { id: "glow" }, /* @__PURE__ */ React.createElement("feGaussianBlur", { stdDeviation: "3", result: "coloredBlur" }), /* @__PURE__ */ React.createElement("feMerge", null, /* @__PURE__ */ React.createElement("feMergeNode", { in: "coloredBlur" }), /* @__PURE__ */ React.createElement("feMergeNode", { in: "SourceGraphic" })))), EDGES.map(([aId, bId], i) => {
      const a = CONSTELLATION.find((n) => n.id === aId);
      const b = CONSTELLATION.find((n) => n.id === bId);
      const aPos = getPos(a);
      const bPos = getPos(b);
      const isActive = active === aId || active === bId;
      return /* @__PURE__ */ React.createElement(
        "line",
        {
          key: i,
          x1: aPos.x,
          y1: aPos.y,
          x2: bPos.x,
          y2: bPos.y,
          stroke: isActive ? "#00f0ff" : "rgba(255,255,255,0.08)",
          strokeWidth: isActive ? 1.5 : 0.8,
          style: { transition: "all 0.3s" }
        }
      );
    }), CONSTELLATION.map((node) => {
      const { x, y } = getPos(node);
      const color = TYPE_COLORS[node.type] || "#fff";
      const isActive = active === node.id;
      const isCore = node.id === "core";
      const r = isCore ? 22 : isActive ? 16 : 11;
      return /* @__PURE__ */ React.createElement(
        "g",
        {
          key: node.id,
          style: { cursor: "pointer" },
          onClick: () => {
            setActive(active === node.id ? null : node.id);
            beep?.();
          }
        },
        /* @__PURE__ */ React.createElement("circle", { cx: x, cy: y, r: r + 8, fill: "transparent" }),
        /* @__PURE__ */ React.createElement(
          "circle",
          {
            cx: x,
            cy: y,
            r,
            fill: isActive || isCore ? color : "rgba(255,255,255,0.05)",
            stroke: color,
            strokeWidth: isActive ? 2.5 : 1.5,
            filter: isActive || isCore ? "url(#glow)" : "",
            style: { transition: "all 0.3s" }
          }
        ),
        /* @__PURE__ */ React.createElement(
          "text",
          {
            x,
            y: y + r + 16,
            textAnchor: "middle",
            fill: isActive ? color : "#9ca3af",
            fontSize: isCore ? 12 : 10,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: isCore ? 700 : 500,
            style: { transition: "all 0.3s" }
          },
          node.label
        )
      );
    })), activeNode && /* @__PURE__ */ React.createElement("div", { className: "constellation-panel", style: { borderColor: TYPE_COLORS[activeNode.type] } }, /* @__PURE__ */ React.createElement("div", { style: { color: TYPE_COLORS[activeNode.type], fontSize: ".7rem", fontFamily: "monospace", textTransform: "uppercase", marginBottom: ".4rem" } }, activeNode.type), /* @__PURE__ */ React.createElement("h4", { style: { color: "#fff", marginBottom: ".5rem" } }, activeNode.label), /* @__PURE__ */ React.createElement("p", { style: { color: "#9ca3af", fontSize: ".85rem", lineHeight: 1.6 } }, activeNode.desc))));
  }

  // src/components/sections/TimelineSection.jsx
  function TimelineSection() {
    return /* @__PURE__ */ React.createElement("section", { id: "experience", className: "section fade-up" }, /* @__PURE__ */ React.createElement(
      SectionHead,
      {
        tag: "Trajectory",
        title: "Experience & Milestones"
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "timeline" }, TIMELINE.map((t, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "tl-item" }, /* @__PURE__ */ React.createElement("div", { className: "tl-empty" }), /* @__PURE__ */ React.createElement("div", { className: "tl-dot", style: { borderColor: t.color, color: t.color } }, /* @__PURE__ */ React.createElement("i", { className: `fas ${t.icon}` })), /* @__PURE__ */ React.createElement("div", { className: "tl-content" }, /* @__PURE__ */ React.createElement("div", { className: "tl-year" }, t.year), /* @__PURE__ */ React.createElement("h4", null, t.title), /* @__PURE__ */ React.createElement("p", null, t.desc))))));
  }

  // src/components/sections/ContributionGraph.jsx
  var import_react5 = __toESM(require_react_shim());
  function ContributionGraph() {
    const weeks = 52;
    const daysPerWeek = 7;
    const grid = (0, import_react5.useMemo)(() => {
      const data = [];
      for (let w = 0; w < weeks; w++) {
        const week = [];
        for (let d = 0; d < daysPerWeek; d++) {
          let level = 0;
          const rand = Math.random();
          if (rand > 0.85) level = 4;
          else if (rand > 0.6) level = 3;
          else if (rand > 0.3) level = 2;
          else if (rand > 0.1) level = 1;
          week.push(level);
        }
        data.push(week);
      }
      return data;
    }, []);
    return /* @__PURE__ */ React.createElement("section", { className: "section fade-up" }, /* @__PURE__ */ React.createElement(
      SectionHead,
      {
        tag: "Activity Metrics",
        title: "12,787 Commits in the Last Year",
        sub: "Continuous integration and relentless open-source contribution velocity."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "contrib-wrapper" }, /* @__PURE__ */ React.createElement("div", { className: "contrib-scroll" }, /* @__PURE__ */ React.createElement("div", { className: "contrib-grid" }, grid.map((week, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "contrib-col" }, week.map((level, j) => /* @__PURE__ */ React.createElement("div", { key: j, className: `contrib-cell lvl-${level}` })))))), /* @__PURE__ */ React.createElement("div", { className: "contrib-legend" }, /* @__PURE__ */ React.createElement("span", null, "Less"), /* @__PURE__ */ React.createElement("div", { className: "contrib-cell lvl-0" }), /* @__PURE__ */ React.createElement("div", { className: "contrib-cell lvl-1" }), /* @__PURE__ */ React.createElement("div", { className: "contrib-cell lvl-2" }), /* @__PURE__ */ React.createElement("div", { className: "contrib-cell lvl-3" }), /* @__PURE__ */ React.createElement("div", { className: "contrib-cell lvl-4" }), /* @__PURE__ */ React.createElement("span", null, "More"))));
  }

  // src/components/sections/SkillsSection.jsx
  var import_react6 = __toESM(require_react_shim());
  var PROFICIENCY = {
    "Python": 97,
    "C++ 20": 88,
    "CUDA/C": 85,
    "Kotlin": 70,
    "Java": 75,
    "JavaScript": 82,
    "Verilog": 65,
    "Bash": 80,
    "PyTorch 2.x": 95,
    "JAX/Flax": 78,
    "HuggingFace": 95,
    "DeepSpeed": 82,
    "PEFT / QLoRA": 90,
    "TRL / GRPO": 92,
    "CUDA 12.2": 85,
    "cuBLAS": 78,
    "NCCL": 80,
    "MPI": 72,
    "Triton": 68,
    "Nsight Compute": 75,
    "Docker": 85,
    "GitHub Actions": 90,
    "FastAPI": 88,
    "Django REST": 78,
    "PostgreSQL": 75,
    "Redis": 72,
    "Flow Matching": 95,
    "Diffusion SDEs": 88,
    "RLHF/GRPO": 92,
    "Linear Attention": 85,
    "VAE Unlearning": 78,
    "IIT \u03A6": 80,
    "xv6 OS Kernel": 85,
    "Pipelined ARM CPU": 78,
    "Compilers (Flex/Bison)": 82,
    "TCP/UDP Sockets": 88,
    "Verilog RTL": 65
  };
  function AnimatedBar({ pct, running, color }) {
    const [w, setW] = (0, import_react6.useState)(0);
    (0, import_react6.useEffect)(() => {
      if (running) setTimeout(() => setW(pct), 100);
    }, [running, pct]);
    return /* @__PURE__ */ React.createElement("div", { className: "skill-bar-bg" }, /* @__PURE__ */ React.createElement("div", { className: "skill-bar-fill", style: { width: `${w}%`, background: color, transition: "width 0.8s cubic-bezier(.4,0,.2,1)" } }));
  }
  var CAT_COLORS = ["#00f0ff", "#8a2be2", "#10b981", "#f59e0b", "#f43f5e", "#60a5fa"];
  function SkillsSection() {
    const ref = (0, import_react6.useRef)(null);
    const [visible, setVisible] = (0, import_react6.useState)(false);
    const [activeTab, setActiveTab] = (0, import_react6.useState)(0);
    (0, import_react6.useEffect)(() => {
      const observer = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) setVisible(true);
      }, { threshold: 0.1 });
      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    }, []);
    const skill = SKILLS[activeTab];
    return /* @__PURE__ */ React.createElement("section", { id: "skills", className: "section fade-up", ref }, /* @__PURE__ */ React.createElement(SectionHead, { tag: "Capabilities", title: "Technical Arsenal" }), /* @__PURE__ */ React.createElement("div", { className: "skills-tabs" }, SKILLS.map((s, i) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: i,
        className: `skills-tab-btn ${activeTab === i ? "active" : ""}`,
        style: activeTab === i ? { borderColor: CAT_COLORS[i], color: CAT_COLORS[i] } : {},
        onClick: () => setActiveTab(i)
      },
      s.cat
    ))), /* @__PURE__ */ React.createElement("div", { className: "skills-bars-panel" }, skill.items.map((item, i) => /* @__PURE__ */ React.createElement("div", { key: item, className: "skill-bar-row", style: { animationDelay: `${i * 0.05}s` } }, /* @__PURE__ */ React.createElement("span", { className: "skill-bar-label" }, item), /* @__PURE__ */ React.createElement(AnimatedBar, { pct: PROFICIENCY[item] || 80, running: visible, color: CAT_COLORS[activeTab] }), /* @__PURE__ */ React.createElement("span", { className: "skill-bar-pct", style: { color: CAT_COLORS[activeTab] } }, PROFICIENCY[item] || 80, "%")))));
  }

  // src/components/sections/CodeSandboxSection.jsx
  var import_react7 = __toESM(require_react_shim());

  // src/data/codeSnippets.js
  var CODE_TABS = {
    flow: {
      label: "Flow Matching ODE",
      code: `# Conditional Flow Matching \u2014 linear velocity field sampler
# Lipman et al. 2022 / Liu et al. 2022 \u2014 implemented by Taha Majlesi
import torch, torch.nn as nn

class VelocityField(nn.Module):
    """Learnable v\u03B8(t, x): maps (noisy sample, time) \u2192 velocity"""
    def __init__(self, d=256, h=512):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(d + 1, h), nn.SiLU(),
            nn.Linear(h, h),     nn.SiLU(),
            nn.Linear(h, h),     nn.SiLU(),
            nn.Linear(h, d)
        )
    def forward(self, x, t):
        t_ = t.view(-1,1).expand(x.shape[0], 1)
        return self.net(torch.cat([x, t_], dim=-1))

def cfm_loss(model, x1, sigma=0.001):
    """CFM objective: E[\u2016v\u03B8(xt,t) \u2212 (x1\u2212x0)\u2016\xB2]"""
    x0 = torch.randn_like(x1)
    t  = torch.rand(x1.shape[0], device=x1.device)
    xt = (1 - t[:,None]) * x0 + t[:,None] * x1  # linear interp
    xt = xt + sigma * torch.randn_like(xt)
    return ((model(xt, t) - (x1 - x0)) ** 2).mean()

@torch.no_grad()
def sample(model, shape, steps=20):
    x, dt = torch.randn(shape), 1.0 / steps
    for i in range(steps):
        t = torch.full((shape[0],), i * dt)
        x = x + model(x, t) * dt   # Euler-Maruyama
    return x`,
      output: `[INIT]  VelocityField  params=1,182,976  device=cuda:0 (A100-SXM4-80GB)
[TRAIN] step=100   loss=0.2813  \u2016vt\u2016=0.82  lr=1e-4
[TRAIN] step=500   loss=0.0941  \u2016vt\u2016=0.41  lr=8e-5
[TRAIN] step=1000  loss=0.0312  \u2016vt\u2016=0.19  lr=5e-5
[SAMPLE] 64 samples \u2014 steps=20 \u2014 38ms on CUDA:0
[EVAL]   FID-10k = 4.21  (DDPM baseline = 9.87)  \u2193 57.4%
[SUCCESS] Flow Matching trajectory converged \u2713`
    },
    grpo: {
      label: "GRPO Alignment",
      code: `# Group Relative Policy Optimisation (GRPO)
# Achieved 80.7% GSM8K pass@1 (+18% vs SFT) \u2014 Taha Majlesi / Hoosha AI
import torch, torch.nn.functional as F

def compute_rewards(responses, ground_truths):
    """Binary math correctness + LaTeX format reward."""
    rewards = []
    for resp, gt in zip(responses, ground_truths):
        correct  = float(gt.strip() in resp)
        fmt_ok   = float("\\\\boxed{" in resp)
        rewards.append(0.8 * correct + 0.2 * fmt_ok)
    return torch.tensor(rewards)

def grpo_loss(model, ref_model, input_ids, rewards,
              clip_eps=0.20, kl_coeff=0.04, G=8):
    """
    GRPO: group-normalised clipped surrogate + KL penalty.
    G = rollouts per prompt (group size).
    """
    with torch.no_grad():
        ref_lp = ref_model(input_ids).log_softmax(-1)
    lp    = model(input_ids).log_softmax(-1)
    ratio = (lp - ref_lp).exp()

    # Group-relative advantage normalisation
    adv   = rewards - rewards.view(-1, G).mean(1, keepdim=True).repeat_interleave(G)
    adv   = adv / (rewards.view(-1,G).std(1).repeat_interleave(G) + 1e-8)

    surr  = torch.min(ratio * adv,
                      torch.clamp(ratio, 1-clip_eps, 1+clip_eps) * adv)
    kl    = F.kl_div(lp, ref_lp.exp(), reduction='batchmean')
    return -surr.mean() + kl_coeff * kl`,
      output: `[CONFIG] model=Qwen2.5-4B  G=8  lr=1e-5  clip=0.20  kl_coeff=0.04  8\xD7A100
[EPOCH 1/3] step=120  loss=1.842  reward=0.421  kl=0.038  GSM8K=42.1%
[EPOCH 2/3] step=240  loss=1.311  reward=0.631  kl=0.019  GSM8K=63.1%
[EPOCH 3/3] step=360  loss=0.994  reward=0.807  kl=0.011  GSM8K=80.7%
[EVAL]  GSM8K pass@1 = 80.7%   SFT baseline = 68.4%   \u0394 = +18.0% rel.
[SUCCESS] GRPO fine-tuning complete \u2014 checkpoint pushed to HF Hub \u2713`
    },
    cuda: {
      label: "Kaleido CUDA Kernel",
      code: `// Kaleido Engine \u2014 fused warp all-reduce + FP16 gradient scaling
// CUDA 12.2  sm_80 (A100 SXM4 80GB)  \u2014 Taha Majlesi / Hoosha AI
#include <cuda_runtime.h>
#include <cuda_fp16.h>
#define WARP 32

__device__ __forceinline__ float warp_sum(float v) {
    #pragma unroll
    for (int d = WARP/2; d > 0; d >>= 1)
        v += __shfl_xor_sync(0xFFFFFFFF, v, d);
    return v;
}

__global__ void fused_allreduce_scale_fp16(
    __half* __restrict__ g,   // FP16 gradient buffer
    float*  __restrict__ acc, // FP32 accumulator
    const int n, const float scale
) {
    const int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx >= n) return;

    // 1. FP16 \u2192 FP32, warp reduce
    float v = warp_sum(__half2float(g[idx])) * scale;

    // 2. Atomically accumulate in FP32
    if ((threadIdx.x & (WARP-1)) == 0)
        atomicAdd(acc + idx, v);
    __syncthreads();

    // 3. Write FP32 result back as FP16
    if (idx < n) g[idx] = __float2half(acc[idx]);
}
// fused_allreduce_scale_fp16<<<(n+255)/256, 256>>>(g, acc, n, 1.0f/4)`,
      output: `[KALEIDO] Device 0: A100-SXM4-80GB  sm_80  CUDA 12.2  Driver 535.86
[KERNEL]  fused_allreduce_scale_fp16  n=134,217,728  scale=0.250
[PERF]    Elapsed: 1.24 ms   Bandwidth: 1.82 TB/s   SM Util: 96.2%
[NCCL]    Ring all-reduce  4\xD7GPU  512 MB  3.71 ms  (vs 5.9ms unfused)
[MEM]     VRAM: 68.4 / 80.0 GB   Fragmentation: 2.1%   Alloc-peak: 71.3 GB
[SUCCESS] Gradient sync complete \u2014 pipeline parallel step 142 \u2713`
    },
    svd: {
      label: "SVD Linear Attention",
      code: `# SVD Linear Attention \u2014 O(N\xB7r) vs O(N\xB2) softmax
# 94% quality, 6\xD7 less memory on 4k-token sequences \u2014 Taha Majlesi
import torch, torch.nn as nn, torch.nn.functional as F

class SVDLinearAttention(nn.Module):
    def __init__(self, d=512, heads=8, rank=64):
        super().__init__()
        self.h, self.r, self.dh = heads, rank, d // heads
        self.Wq = nn.Linear(d, d, bias=False)
        self.Wk = nn.Linear(d, d, bias=False)
        self.Wv = nn.Linear(d, d, bias=False)
        self.Wo = nn.Linear(d, d, bias=False)
        # Low-rank SVD projection: A \u2248 U \xB7 diag(S) \xB7 V\u1D40
        self.U  = nn.Parameter(torch.randn(heads, self.dh, rank) * 0.02)
        self.S  = nn.Parameter(torch.ones(heads, rank))
        self.Vt = nn.Parameter(torch.randn(heads, rank, self.dh) * 0.02)

    def forward(self, x):
        B, N, D = x.shape
        def reshape(t): return t.view(B,N,self.h,self.dh).transpose(1,2)
        Q, K, V = reshape(self.Wq(x)), reshape(self.Wk(x)), reshape(self.Wv(x))
        # Feature map: \u03C6(x) = ELU(x @ U) \xB7 S   (low-rank projection)
        S_ = self.S.unsqueeze(0).unsqueeze(2)          # (1,h,1,r)
        phi_Q = F.elu(Q @ self.U) * S_
        phi_K = F.elu(K @ self.U) * S_
        # Linear attention: O(N\xB7r) \u2014 no N\xB2 matrix materialized
        KV  = phi_K.transpose(-2,-1) @ V               # (B,h,r,dh)
        out = phi_Q @ KV / (phi_Q.sum(-1, keepdim=True) + 1e-6)
        return self.Wo(out.transpose(1,2).reshape(B, N, D))`,
      output: `[BENCH]  N=4096  d=512  heads=8  rank=64  batch=16  device=cuda:0
[MEM]    SVD-Attn: 1.23 GB     Full-Attn: 7.81 GB     Savings: 6.35\xD7
[SPEED]  SVD-Attn: 8.4 ms      Full-Attn: 51.2 ms     Speedup: 6.10\xD7
[QUAL]   BLEU-4: 28.4 (SVD) vs 30.2 (Full)  Retention: 94.0%
[PARAMS] Rank-64 adds 0.8M params vs 0 for full-attention (negligible)
[SUCCESS] SVD Linear Attention benchmark complete \u2713`
    }
  };

  // src/components/sections/CodeSandboxSection.jsx
  function FlowMatchingVis({ playing }) {
    const canvasRef = (0, import_react7.useRef)(null);
    (0, import_react7.useEffect)(() => {
      if (!playing) return;
      const ctx = canvasRef.current.getContext("2d");
      let W = 300, H = 200;
      canvasRef.current.width = W;
      canvasRef.current.height = H;
      const N = 80;
      const pts = Array.from({ length: N }, () => {
        const startX = W / 2 + (Math.random() - 0.5) * W * 0.8;
        const startY = H / 2 + (Math.random() - 0.5) * H * 0.8;
        const angle = Math.random() * Math.PI * 2;
        const targetX = W / 2 + Math.cos(angle) * 50;
        const targetY = H / 2 + Math.sin(angle) * 50;
        return { startX, startY, targetX, targetY, t: 0 };
      });
      let frame;
      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        let allDone = true;
        pts.forEach((p) => {
          if (p.t < 1) p.t += 0.01;
          if (p.t < 1) allDone = false;
          const x = p.startX + (p.targetX - p.startX) * p.t;
          const y = p.startY + (p.targetY - p.startY) * p.t;
          ctx.beginPath();
          ctx.moveTo(p.startX, p.startY);
          ctx.lineTo(x, y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 * (1 - p.t)})`;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 240, 255, ${0.3 + 0.7 * p.t})`;
          ctx.fill();
        });
        if (!allDone) frame = requestAnimationFrame(draw);
      };
      frame = requestAnimationFrame(draw);
      return () => cancelAnimationFrame(frame);
    }, [playing]);
    return /* @__PURE__ */ React.createElement("div", { className: "vis-container" }, /* @__PURE__ */ React.createElement("div", { className: "vis-label" }, "Flow Trajectories (x\u2080 \u2192 x\u2081)"), /* @__PURE__ */ React.createElement("canvas", { ref: canvasRef, style: { width: "100%", height: "200px" } }));
  }
  function GRPOVis({ playing }) {
    const [step, setStep] = (0, import_react7.useState)(0);
    (0, import_react7.useEffect)(() => {
      if (!playing) {
        setStep(0);
        return;
      }
      let s = 0;
      const id = setInterval(() => {
        s++;
        setStep(s);
        if (s > 3) clearInterval(id);
      }, 800);
      return () => clearInterval(id);
    }, [playing]);
    const rollouts = [
      { id: 1, val: 0.1, color: "#f43f5e", text: "x = 5" },
      { id: 2, val: 0.9, color: "#10b981", text: "\\boxed{42}" },
      { id: 3, val: 0.4, color: "#fbbf24", text: "42" },
      { id: 4, val: 0.8, color: "#10b981", text: "\\boxed{42}" }
    ];
    return /* @__PURE__ */ React.createElement("div", { className: "vis-container" }, /* @__PURE__ */ React.createElement("div", { className: "vis-label" }, "Group Relative Advantages"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "8px", marginTop: "20px" } }, rollouts.map((r, i) => /* @__PURE__ */ React.createElement("div", { key: r.id, style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      opacity: step >= 1 ? 1 : 0,
      transition: "all 0.5s",
      transitionDelay: `${i * 0.1}s`
    } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, background: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: "4px", fontFamily: "monospace", fontSize: "12px" } }, "Output ", r.id, ": ", r.text), step >= 2 && /* @__PURE__ */ React.createElement("div", { style: { width: "60px", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { width: `${r.val * 100}%`, height: "100%", background: r.color, transition: "width 0.5s" } })), step >= 3 && /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: r.val > 0.5 ? "#10b981" : "#f43f5e", width: "40px", fontWeight: "bold" } }, r.val > 0.5 ? "+Adv" : "-Adv")))));
  }
  function CUDAReductionVis({ playing }) {
    const [step, setStep] = (0, import_react7.useState)(0);
    (0, import_react7.useEffect)(() => {
      if (!playing) {
        setStep(0);
        return;
      }
      let s = 0;
      const id = setInterval(() => {
        s++;
        setStep(s);
        if (s > 3) clearInterval(id);
      }, 600);
      return () => clearInterval(id);
    }, [playing]);
    return /* @__PURE__ */ React.createElement("div", { className: "vis-container" }, /* @__PURE__ */ React.createElement("div", { className: "vis-label" }, "Warp-Level Reduction (Thread Shfl)"), /* @__PURE__ */ React.createElement("div", { className: "cuda-tree", style: { marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "10px", opacity: step >= 0 ? 1 : 0, transition: "opacity 0.3s" } }, Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "cuda-node" }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "34px", opacity: step >= 1 ? 1 : 0, transition: "opacity 0.3s" } }, Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "cuda-node active" }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "82px", opacity: step >= 2 ? 1 : 0, transition: "opacity 0.3s" } }, Array.from({ length: 2 }).map((_, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "cuda-node active" }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", opacity: step >= 3 ? 1 : 0, transition: "opacity 0.3s" } }, /* @__PURE__ */ React.createElement("div", { className: "cuda-node final" }))));
  }
  function SVDVis({ playing }) {
    return /* @__PURE__ */ React.createElement("div", { className: "vis-container", style: { display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: "20px" } }, /* @__PURE__ */ React.createElement("div", { className: "vis-label" }, "Low-Rank Attention Complexity"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "15px" } }, /* @__PURE__ */ React.createElement("div", { className: `matrix n-by-n ${playing ? "shrink" : ""}` }, "N \xD7 N"), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--muted)", fontSize: "20px", opacity: playing ? 1 : 0, transition: "opacity 0.5s" } }, "\u2248"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "5px", opacity: playing ? 1 : 0, transition: "opacity 0.5s" } }, /* @__PURE__ */ React.createElement("div", { className: "matrix n-by-r" }, "N\xD7r"), /* @__PURE__ */ React.createElement("div", { className: "matrix r-by-n" }, "r\xD7N"))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "12px", color: "var(--accent)", opacity: playing ? 1 : 0, transition: "opacity 0.5s 0.3s" } }, "Memory reduced from 7.8GB to 1.2GB!"));
  }
  function CodeSandboxSection({ activeTab, setActiveTab, runOutput, setRunOutput, beep }) {
    const tabs = Object.keys(CODE_TABS);
    const data = CODE_TABS[activeTab];
    const [playing, setPlaying] = (0, import_react7.useState)(false);
    (0, import_react7.useEffect)(() => {
      setPlaying(false);
      setRunOutput("");
    }, [activeTab, setRunOutput]);
    const handleRun = () => {
      setRunOutput("");
      setPlaying(true);
      beep?.(600, "square");
      let idx = 0;
      const lines = data.output.split("\n");
      const timer = setInterval(() => {
        setRunOutput((p) => p + (p ? "\n" : "") + lines[idx]);
        idx++;
        if (idx >= lines.length) {
          clearInterval(timer);
          beep?.(880, "sine", 0.05);
        }
      }, 150);
    };
    return /* @__PURE__ */ React.createElement("section", { id: "sandbox", className: "section fade-up" }, /* @__PURE__ */ React.createElement(
      SectionHead,
      {
        tag: "Interactive AI Lab",
        title: "Explore Core Algorithms \u{1F9EA}",
        sub: "Execute Python and CUDA kernels directly in the browser. Watch the real-time visualizers to actively learn how these frontier architectures function under the hood."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "sandbox-grid" }, /* @__PURE__ */ React.createElement("div", { className: "terminal sandbox-left" }, /* @__PURE__ */ React.createElement("div", { className: "t-bar" }, /* @__PURE__ */ React.createElement("div", { className: "t-dots" }, /* @__PURE__ */ React.createElement("div", { className: "t-dot r" }), /* @__PURE__ */ React.createElement("div", { className: "t-dot y" }), /* @__PURE__ */ React.createElement("div", { className: "t-dot g" })), /* @__PURE__ */ React.createElement("div", { className: "t-tabs" }, tabs.map((k) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: k,
        className: `t-tab ${activeTab === k ? "active" : ""}`,
        onClick: () => {
          setActiveTab(k);
          beep?.();
        }
      },
      CODE_TABS[k].label
    ))), /* @__PURE__ */ React.createElement("div", { className: "t-label", style: { display: "none" } }, "~/hoosha-ai/", activeTab, ".", activeTab === "cuda" ? "cu" : "py")), /* @__PURE__ */ React.createElement("div", { className: "t-body" }, /* @__PURE__ */ React.createElement("div", { className: "t-code" }, data.code), /* @__PURE__ */ React.createElement("button", { className: "t-run-btn", onClick: handleRun, disabled: playing && runOutput.split("\n").length < data.output.split("\n").length }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-play" }), " ", playing ? "Executing..." : "Run Simulation"), runOutput && /* @__PURE__ */ React.createElement("div", { className: "t-output" }, runOutput))), /* @__PURE__ */ React.createElement("div", { className: "sandbox-right" }, /* @__PURE__ */ React.createElement("div", { className: "sandbox-visualizer" }, activeTab === "flow" && /* @__PURE__ */ React.createElement(FlowMatchingVis, { playing }), activeTab === "grpo" && /* @__PURE__ */ React.createElement(GRPOVis, { playing }), activeTab === "cuda" && /* @__PURE__ */ React.createElement(CUDAReductionVis, { playing }), activeTab === "svd" && /* @__PURE__ */ React.createElement(SVDVis, { playing }), !playing && /* @__PURE__ */ React.createElement("div", { className: "vis-overlay-play", onClick: handleRun }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-play-circle" }), /* @__PURE__ */ React.createElement("span", null, "Click to animate"))), /* @__PURE__ */ React.createElement("div", { className: "sandbox-tutorial" }, /* @__PURE__ */ React.createElement("h4", null, /* @__PURE__ */ React.createElement("i", { className: "fas fa-graduation-cap" }), " Deep Dive Learning"), activeTab === "flow" && /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("b", null, "Conditional Flow Matching (CFM)"), " provides a simulation-free approach to training Continuous Normalizing Flows. Unlike Diffusion models that rely on complex noise schedules (SDEs), CFM directly regresses a vector field ", /* @__PURE__ */ React.createElement("i", null, "v_\u03B8(t, x)"), " pointing from a pure noise distribution ", /* @__PURE__ */ React.createElement("i", null, "x\u2080 ~ N(0, I)"), " directly to the data distribution ", /* @__PURE__ */ React.createElement("i", null, "x\u2081 ~ q(x\u2081)"), ". This allows for straight trajectories, requiring far fewer integration steps (e.g., 20) during inference using simple ODE solvers like Euler. The animation above demonstrates how straight-path interpolation cleanly maps noise to a target structure."), activeTab === "grpo" && /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("b", null, "Group Relative Policy Optimization (GRPO)"), " eliminates the massive memory overhead of standard PPO by completely removing the need for an external Critic network. Instead of estimating absolute value functions, GRPO samples a ", /* @__PURE__ */ React.createElement("i", null, "group"), " of ", /* @__PURE__ */ React.createElement("i", null, "G"), " responses (rollouts) for a given prompt, scores them via a lightweight Reward Model, and normalizes the rewards ", /* @__PURE__ */ React.createElement("b", null, "relative to that specific group"), " to compute advantages. This enables RLHF/alignment training of large models like Qwen-4B on constrained clusters."), activeTab === "cuda" && /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("b", null, "Fused CUDA Kernels"), " are critical for maximizing throughput in distributed LLM training. The ", /* @__PURE__ */ React.createElement("code", null, "fused_allreduce_scale_fp16"), " kernel above bypasses expensive global memory round-trips. By utilizing ", /* @__PURE__ */ React.createElement("i", null, "thread shuffle instructions"), " (", /* @__PURE__ */ React.createElement("code", null, "__shfl_xor_sync"), "), it performs gradient scaling and warp-level tree reductions directly in ultra-fast registers before atomic accumulation. This achieves near-theoretical peak bandwidth on A100 SXM4 architecture."), activeTab === "svd" && /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("b", null, "Linear Attention"), " solves the ", /* @__PURE__ */ React.createElement("i", null, "O(N\xB2)"), " sequence length bottleneck of the standard Transformer self-attention mechanism. By applying the kernel trick ", /* @__PURE__ */ React.createElement("i", null, "exp(q \xB7 k) \u2248 \u03C6(q)^T \u03C6(k)"), " (where ", /* @__PURE__ */ React.createElement("i", null, "\u03C6"), " represents a low-rank SVD projection with rank ", /* @__PURE__ */ React.createElement("i", null, "r"), "), we can fundamentally alter the computation order from ", /* @__PURE__ */ React.createElement("i", null, "(Q K^T) V"), " to ", /* @__PURE__ */ React.createElement("i", null, "Q (K^T V)"), ". This mathematically reduces computational complexity and VRAM usage to ", /* @__PURE__ */ React.createElement("i", null, "O(N \xB7 r)"), ", unlocking the potential for infinite-context language models.")))));
  }

  // src/components/sections/ProjectsSection.jsx
  var import_react8 = __toESM(require_react_shim());
  function ProjectsSection({ repos, search, setSearch, filter, setFilter, hfAssets, hfFilter, setHfFilter, counts, articles, subSearch, setSubSearch, beep }) {
    return /* @__PURE__ */ React.createElement("section", { id: "projects", className: "section fade-up" }, /* @__PURE__ */ React.createElement(
      SectionHead,
      {
        tag: "Engineering Hub",
        title: "Open-Source Infrastructure & AI Models",
        sub: "A curated selection of 143 total repositories and 162 HuggingFace assets (1000+ downloads), spanning CUDA systems, Flow Matching, and Persian LLMs."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "search-wrap", style: { marginTop: "2.5rem" } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-search search-icon" }), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        placeholder: "Search repositories (e.g., 'Kaleido', 'CUDA', 'Flow Matching')...",
        value: search,
        onChange: (e) => setSearch(e.target.value)
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "filter-tabs" }, /* @__PURE__ */ React.createElement("button", { className: `filter-btn ${filter === "all" ? "active" : ""}`, onClick: () => {
      setFilter("all");
      beep?.(600);
    } }, "All Projects (", counts.all, ")"), /* @__PURE__ */ React.createElement("button", { className: `filter-btn ${filter === "course" ? "active" : ""}`, onClick: () => {
      setFilter("course");
      beep?.(600);
    } }, "University AI Labs (", counts.course, ")"), /* @__PURE__ */ React.createElement("button", { className: `filter-btn ${filter === "ai" ? "active" : ""}`, onClick: () => {
      setFilter("ai");
      beep?.(600);
    } }, "ML & Generative AI (", counts.ai, ")"), /* @__PURE__ */ React.createElement("button", { className: `filter-btn ${filter === "systems" ? "active" : ""}`, onClick: () => {
      setFilter("systems");
      beep?.(600);
    } }, "Systems & CUDA (", counts.systems, ")")), /* @__PURE__ */ React.createElement("div", { className: "bento" }, repos.map((r, i) => /* @__PURE__ */ React.createElement("a", { key: i, href: r.url, target: "_blank", className: `bento-card ${r.star ? "bento-wide" : ""}` }, r.star && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: ".8rem", right: ".8rem", color: "var(--emerald)" } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-star" }), " Featured"), /* @__PURE__ */ React.createElement("div", { className: "bento-tag" }, /* @__PURE__ */ React.createElement("i", { className: r.cat === "ai" ? "fas fa-brain" : r.cat === "systems" ? "fas fa-microchip" : "fas fa-book" }), r.tag), /* @__PURE__ */ React.createElement("h3", { className: "bento-title" }, r.name), /* @__PURE__ */ React.createElement("p", { className: "bento-desc" }, r.desc), /* @__PURE__ */ React.createElement("div", { className: "bento-footer" }, /* @__PURE__ */ React.createElement("span", { className: "bento-pill", style: { color: "#00f0ff", borderColor: "#00f0ff" } }, r.lang), r.lib?.split(",").map((l) => /* @__PURE__ */ React.createElement("span", { key: l, className: "bento-pill" }, l.trim()))))), repos.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: "var(--muted)" } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-search", style: { fontSize: "2rem", marginBottom: "1rem", opacity: 0.5 } }), /* @__PURE__ */ React.createElement("br", null), 'No repositories found matching "', search, '"')), /* @__PURE__ */ React.createElement("h3", { style: { marginTop: "5rem", marginBottom: "1.5rem", color: "#fff", fontSize: "1.5rem" } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-robot", style: { color: "var(--accent)" } }), " Hugging Face Assets (162 total)"), /* @__PURE__ */ React.createElement("div", { className: "filter-tabs" }, /* @__PURE__ */ React.createElement("button", { className: `filter-btn ${hfFilter === "all" ? "active" : ""}`, onClick: () => {
      setHfFilter("all");
      beep?.();
    } }, "All Assets"), /* @__PURE__ */ React.createElement("button", { className: `filter-btn ${hfFilter === "Model" ? "active" : ""}`, onClick: () => {
      setHfFilter("Model");
      beep?.();
    } }, "Models (92)"), /* @__PURE__ */ React.createElement("button", { className: `filter-btn ${hfFilter === "Dataset" ? "active" : ""}`, onClick: () => {
      setHfFilter("Dataset");
      beep?.();
    } }, "Datasets (70)")), /* @__PURE__ */ React.createElement("div", { className: "hf-grid" }, hfAssets.map((h, i) => /* @__PURE__ */ React.createElement("a", { key: i, href: h.url, target: "_blank", className: "hf-card" }, /* @__PURE__ */ React.createElement("div", { className: "hf-type", style: {
      color: h.type === "Model" ? "#60a5fa" : "#a78bfa",
      background: h.type === "Model" ? "rgba(96,165,250,0.08)" : "rgba(167,139,250,0.08)",
      borderColor: h.type === "Model" ? "rgba(96,165,250,0.15)" : "rgba(167,139,250,0.15)"
    } }, /* @__PURE__ */ React.createElement("i", { className: h.type === "Model" ? "fas fa-cube" : "fas fa-database" }), h.type), /* @__PURE__ */ React.createElement("div", { className: "hf-id" }, h.id), /* @__PURE__ */ React.createElement("div", { className: "hf-meta" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "fas fa-download" }), " ", h.dls), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "fas fa-heart" }), " ", h.likes), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "fas fa-clock" }), " ", h.upd)), h.code && /* @__PURE__ */ React.createElement("div", { className: "hf-code" }, h.code)))));
  }

  // src/data/publications.js
  var PUBLICATIONS = [
    {
      year: "2026",
      badge: "Technical Report",
      title: "Scaling Transformers: How Linear Attention Is Reshaping Cross-Task AI",
      authors: "Mohammad Taha Majlesi \xB7 Hoosha AI Research Team",
      venue: "Hoosha AI Technical Report Series \u2014 July 2026",
      abstract: "Sub-quadratic linear attention (SVD-Attention) achieves 94% quality vs full O(N\xB2) softmax attention at 6\xD7 less memory on 4k-token sequences. Full CUDA kernel profiling on A100 SXM4 included.",
      link: "https://hooshaai.substack.com/p/scaling-transformers-how-linear-attention",
      code: "https://github.com/tahamajs/SVD_linear_Attention",
      bib: `@techreport{majlesi2026linear,
  title       = {Scaling Transformers: How Linear Attention Is Reshaping Cross-Task AI},
  author      = {Majlesi, Mohammad Taha},
  year        = {2026},
  institution = {Hoosha AI Research}
}`
    },
    {
      year: "2026",
      badge: "Research Paper",
      title: "Implementing Grounded Causal Verification to Prevent Recursive Epistemic Collapse in Self-Improving AI",
      authors: "Mohammad Taha Majlesi \xB7 Hoosha AI Lab",
      venue: "Hoosha AI Research \u2014 June 2026",
      abstract: "Formal mathematical framework using grounded causal verification to constrain self-improving LLMs, preventing recursive hallucination loops and epistemic degradation without capability loss.",
      link: "https://hooshaai.substack.com/p/implementing-grounded-causal-verification",
      code: "https://github.com/Hooshaai/consciousness_in_LLMs",
      bib: `@article{majlesi2026causal,
  title   = {Implementing Grounded Causal Verification to Prevent Recursive Epistemic Collapse},
  author  = {Majlesi, Mohammad Taha},
  year    = {2026},
  journal = {Hoosha AI Research}
}`
    },
    {
      year: "2026",
      badge: "Technical Report",
      title: "GRPO Unlocked: Building a Math-Reasoning LLM from First Principles",
      authors: "Mohammad Taha Majlesi \xB7 Hoosha AI Lab",
      venue: "Hoosha AI Technical Report \u2014 May 2026",
      abstract: "Full GRPO implementation for GSM8K math reasoning: custom reward model, clipped surrogate objective, KL schedule \u2014 achieving 80.7% pass@1 on a 4B LLM (+18% relative over SFT on 8\xD7A100).",
      link: "https://hooshaai.substack.com/p/grpo-unlocked-building-a-math-reasoning",
      code: "https://github.com/tahamajs/FineTuning-4B-LLM-GSM8k-GRPO-SFT",
      bib: `@techreport{majlesi2026grpo,
  title       = {GRPO Unlocked: Building a Math-Reasoning LLM from First Principles},
  author      = {Majlesi, Mohammad Taha},
  year        = {2026},
  institution = {Hoosha AI Research}
}`
    },
    {
      year: "2025",
      badge: "Course Research Project",
      title: "Vision Language Models and Flow Matching for Open-Vocabulary Generation",
      authors: "Mohammad Taha Majlesi",
      venue: "Deep Generative Models Course \u2014 University of Tehran, HW4, 2025",
      abstract: "PaliGemma QLoRA fine-tuning + conditional Flow Matching synthesis. 3\xD7 FID improvement vs DDPM (4.21 vs 9.87) on MSCOCO using 20 ODE steps.",
      link: "https://github.com/tahamajs/Vision_Language_Models_and_Flow_Matching_DeepGenModels_HW4",
      code: "https://github.com/tahamajs/Vision_Language_Models_and_Flow_Matching_DeepGenModels_HW4",
      bib: `@misc{majlesi2025vlm,
  title  = {Vision Language Models and Flow Matching for Open-Vocabulary Generation},
  author = {Majlesi, Mohammad Taha},
  year   = {2025},
  note   = {Deep Generative Models Course, University of Tehran}
}`
    },
    {
      year: "2025",
      badge: "Research Paper",
      title: "Shortcut Learning Through the Lens of Task Arithmetic",
      authors: "Mohammad Taha Majlesi \xB7 Hoosha AI Research",
      venue: "Hoosha AI Research \u2014 2025",
      abstract: "Task Arithmetic (weight-space interpolation) surgically removes shortcut features from fine-tuned transformers without full retraining \u2014 reducing spurious correlations by 71% on NLI benchmarks.",
      link: "https://github.com/tahamajs/Shortcut_Learning_Through_the_Lens_of_Task_Arithmetic",
      code: "https://github.com/tahamajs/Shortcut_Learning_Through_the_Lens_of_Task_Arithmetic",
      bib: `@article{majlesi2025shortcut,
  title   = {Shortcut Learning Through the Lens of Task Arithmetic},
  author  = {Majlesi, Mohammad Taha},
  year    = {2025},
  journal = {Hoosha AI Research}
}`
    }
  ];

  // src/components/sections/PublicationsSection.jsx
  function PublicationsSection({ onCopyBib, beep }) {
    return /* @__PURE__ */ React.createElement("section", { id: "publications", className: "section fade-up" }, /* @__PURE__ */ React.createElement(
      SectionHead,
      {
        tag: "Research Output",
        title: "Papers & Technical Reports",
        sub: "Deep-dives on generative models, mathematical alignment, and GPU engineering published on Hoosha AI."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "pub-list" }, PUBLICATIONS.map((p, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "pub-card" }, /* @__PURE__ */ React.createElement("div", { className: "pub-badge" }, p.badge, " \xB7 ", p.year), /* @__PURE__ */ React.createElement("h3", { className: "pub-title" }, /* @__PURE__ */ React.createElement("a", { href: p.link, target: "_blank" }, p.title)), /* @__PURE__ */ React.createElement("div", { className: "pub-meta" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-users" }), " ", p.authors, " \xA0\xA0|\xA0\xA0 ", /* @__PURE__ */ React.createElement("i", { className: "fas fa-university" }), " ", p.venue), /* @__PURE__ */ React.createElement("p", { className: "pub-abstract" }, p.abstract), /* @__PURE__ */ React.createElement("div", { className: "pub-links" }, /* @__PURE__ */ React.createElement("a", { href: p.link, target: "_blank", className: "pub-btn", onClick: () => beep?.() }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-file-pdf" }), " Read Paper"), p.code && /* @__PURE__ */ React.createElement("a", { href: p.code, target: "_blank", className: "pub-btn", onClick: () => beep?.() }, /* @__PURE__ */ React.createElement("i", { className: "fab fa-github" }), " View Code"), /* @__PURE__ */ React.createElement("button", { className: "pub-btn", onClick: () => {
      onCopyBib(p.bib);
      beep?.();
    } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-quote-right" }), " Cite (BibTeX)"))))));
  }

  // src/components/sections/SubstackSection.jsx
  function SubstackSection({ articles, subSearch, setSubSearch, beep }) {
    return /* @__PURE__ */ React.createElement("section", { id: "substack", className: "section fade-up", style: { background: "rgba(0,240,255,0.01)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement(
      SectionHead,
      {
        tag: "Hoosha AI Substack",
        title: "Technical Deep Dives & Essays",
        sub: "In-depth explorations of generative models, LLM alignment math, and distributed systems \u2014 read by researchers globally."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "search-wrap", style: { maxWidth: 600, margin: "0 auto 2.5rem" } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-search search-icon" }), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        placeholder: "Search 20 Substack papers...",
        value: subSearch,
        onChange: (e) => setSubSearch(e.target.value)
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "articles-grid" }, articles.map((a, i) => /* @__PURE__ */ React.createElement("a", { key: i, href: a.url, target: "_blank", className: "article-card", onClick: () => beep?.() }, /* @__PURE__ */ React.createElement("div", { className: "article-date" }, a.date), /* @__PURE__ */ React.createElement("h3", null, a.title), /* @__PURE__ */ React.createElement("p", null, a.desc), /* @__PURE__ */ React.createElement("span", { className: "read-more" }, "Read Paper ", /* @__PURE__ */ React.createElement("i", { className: "fas fa-arrow-right" }))))));
  }

  // src/components/sections/ReadmeSection.jsx
  function ReadmeSection({ readmeHtml }) {
    return /* @__PURE__ */ React.createElement("section", { id: "readme", className: "section fade-up" }, /* @__PURE__ */ React.createElement(
      SectionHead,
      {
        tag: "Documentation",
        title: "GitHub Profile README",
        sub: "The source of truth for my current projects, tech stack, and GitHub stats."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "readme-preview" }, /* @__PURE__ */ React.createElement("div", { className: "readme-preview-bar" }, /* @__PURE__ */ React.createElement("i", { className: "fab fa-markdown", style: { color: "var(--muted)" } }), /* @__PURE__ */ React.createElement("span", null, "tahamajs / README.md"), /* @__PURE__ */ React.createElement("a", { href: "https://github.com/tahamajs", target: "_blank", style: { marginLeft: "auto", color: "var(--accent)", fontSize: ".78rem" } }, "View on GitHub \u2197")), /* @__PURE__ */ React.createElement("div", { className: "readme-content", dangerouslySetInnerHTML: { __html: readmeHtml } })));
  }

  // src/components/sections/NewsletterSection.jsx
  function NewsletterSection({ beep }) {
    return /* @__PURE__ */ React.createElement("section", { className: "section fade-up" }, /* @__PURE__ */ React.createElement("div", { className: "newsletter-card" }, /* @__PURE__ */ React.createElement("div", { className: "newsletter-content" }, /* @__PURE__ */ React.createElement(
      SectionHead,
      {
        tag: "Join 17,100+ Readers",
        title: "Get Deep-Dive AI Engineering Essays",
        sub: "Subscribe to Hoosha AI's Substack. I write detailed breakdowns on scaling LLMs, custom CUDA kernels, and mathematics behind Flow Matching and GRPO."
      }
    ), /* @__PURE__ */ React.createElement("form", { className: "newsletter-form", action: "https://hooshaai.substack.com", target: "_blank", onSubmit: () => beep?.(800) }, /* @__PURE__ */ React.createElement("input", { type: "email", placeholder: "Enter your email address...", required: true, className: "newsletter-input" }), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn-primary newsletter-btn" }, "Subscribe ", /* @__PURE__ */ React.createElement("i", { className: "fas fa-paper-plane", style: { marginLeft: "4px" } }))), /* @__PURE__ */ React.createElement("div", { className: "newsletter-meta" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "fas fa-check-circle" }), " No spam"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "fas fa-check-circle" }), " Highly technical"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "fas fa-check-circle" }), " Once a week"))), /* @__PURE__ */ React.createElement("div", { className: "newsletter-glow" })));
  }

  // src/components/sections/ContactSection.jsx
  var import_react9 = __toESM(require_react_shim());
  var CONTACTS = [
    { icon: "fab fa-github", href: "https://github.com/tahamajs", label: "GitHub", val: "@tahamajs", color: "#fff" },
    { icon: "fab fa-linkedin-in", href: "https://linkedin.com/in/tahamajlesi", label: "LinkedIn", val: "17.1k Followers", color: "#0a66c2" },
    { icon: "fas fa-robot", href: "https://huggingface.co/tahamajs", label: "HuggingFace", val: "162 Assets", color: "#ffd21e" },
    { icon: "fas fa-newspaper", href: "https://hooshaai.substack.com", label: "Substack", val: "Hoosha AI \u{1F9E0}", color: "#ff6719" },
    { icon: "fab fa-telegram", href: "https://t.me/tahamajlesii", label: "Telegram", val: "@tahamajlesii", color: "#229ed9" },
    { icon: "fas fa-envelope", href: "mailto:tahamajlesi@ut.ac.ir", label: "Email", val: "UT.ac.ir", color: "#10b981" },
    { icon: "fas fa-heart", href: "https://github.com/sponsors/tahamajs", label: "Sponsor", val: "Fund the mission", color: "#ea4aaa" }
  ];
  function ContactSection({ onHire, beep }) {
    const [copied, setCopied] = (0, import_react9.useState)(false);
    const copyEmail = () => {
      navigator.clipboard.writeText("tahamajlesi@ut.ac.ir");
      setCopied(true);
      beep?.(700, "square");
      setTimeout(() => setCopied(false), 2e3);
    };
    return /* @__PURE__ */ React.createElement("section", { id: "contact", className: "section fade-up" }, /* @__PURE__ */ React.createElement(
      SectionHead,
      {
        tag: "Get In Touch",
        title: "Open To Collaboration & Opportunities",
        sub: "Whether you're a recruiter, researcher, or open-source contributor \u2014 I respond to every serious inquiry within 24 hours."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "contact-grid" }, /* @__PURE__ */ React.createElement("div", { className: "contact-ctas" }, /* @__PURE__ */ React.createElement("div", { className: "contact-cta-card primary-cta", onClick: () => {
      onHire();
      beep?.();
    } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-briefcase" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", null, "Recruit / Hire Taha"), /* @__PURE__ */ React.createElement("p", null, "Full-time, part-time, contract, or research collaboration")), /* @__PURE__ */ React.createElement("i", { className: "fas fa-arrow-right", style: { marginLeft: "auto", opacity: 0.4 } })), /* @__PURE__ */ React.createElement("a", { href: "https://github.com/sponsors/tahamajs", target: "_blank", className: "contact-cta-card sponsor-cta", onClick: () => beep?.() }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-heart" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", null, "Sponsor on GitHub"), /* @__PURE__ */ React.createElement("p", null, "Fund open-source CUDA engines, Persian LLMs & AI research")), /* @__PURE__ */ React.createElement("i", { className: "fas fa-arrow-right", style: { marginLeft: "auto", opacity: 0.4 } })), /* @__PURE__ */ React.createElement("div", { className: "contact-email-row" }, /* @__PURE__ */ React.createElement("div", { className: "contact-email-display" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-envelope", style: { color: "var(--accent)" } }), /* @__PURE__ */ React.createElement("span", null, "tahamajlesi@ut.ac.ir")), /* @__PURE__ */ React.createElement("button", { className: "btn-secondary contact-copy", onClick: copyEmail }, /* @__PURE__ */ React.createElement("i", { className: `fas ${copied ? "fa-check" : "fa-copy"}` }), " ", copied ? "Copied!" : "Copy"))), /* @__PURE__ */ React.createElement("div", { className: "contact-socials" }, CONTACTS.map((c) => /* @__PURE__ */ React.createElement(
      "a",
      {
        key: c.label,
        href: c.href,
        target: c.href.startsWith("mailto") ? "_self" : "_blank",
        className: "contact-social-row",
        onClick: () => beep?.()
      },
      /* @__PURE__ */ React.createElement("div", { className: "contact-social-icon", style: { background: `${c.color}18`, color: c.color, border: `1px solid ${c.color}30` } }, /* @__PURE__ */ React.createElement("i", { className: c.icon })),
      /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "contact-social-label" }, c.label), /* @__PURE__ */ React.createElement("div", { className: "contact-social-val" }, c.val)),
      /* @__PURE__ */ React.createElement("i", { className: "fas fa-external-link-alt", style: { marginLeft: "auto", opacity: 0.25, fontSize: ".7rem" } })
    )))));
  }

  // src/components/sections/SocialFeedSection.jsx
  var TWEETS = [
    {
      author: "Hoosha AI \u{1F9E0}",
      handle: "@hooshaaii",
      avatar: "https://github.com/tahamajs.png",
      date: "Aug 10, 2026",
      text: "Unpacking Conditional Flow Matching (CFM): Why simulation-free continuous normalizing flows outperform standard diffusion SDEs in sample efficiency and ODE solver integration steps. \u{1F9F5} (1/8)",
      stats: { retweets: "142", likes: "890", replies: "34" },
      url: "https://x.com/hooshaaii",
      tag: "Flow Matching"
    },
    {
      author: "Hoosha AI \u{1F9E0}",
      handle: "@hooshaaii",
      avatar: "https://github.com/tahamajs.png",
      date: "Aug 4, 2026",
      text: "Deep-dive on GRPO (Group Relative Policy Optimization): Eliminating the PPO Critic network for 4B LLM math reasoning. How group-normalized rewards scale alignment training on constrained GPU clusters. \u{1F680}",
      stats: { retweets: "215", likes: "1.2k", replies: "58" },
      url: "https://x.com/hooshaaii",
      tag: "GRPO Alignment"
    },
    {
      author: "Mohammad Taha Majlesi",
      handle: "@tahamajlesi",
      avatar: "assets/avatar.jpg",
      date: "Jul 28, 2026",
      text: "Announcing Kaleido Engine v0.4 \u26A1 \u2014 First-principles 4D-parallel CUDA 12.2 / C++ distributed LLM training framework. Fused warp-level reduction kernels achieving near-peak 1.8 TB/s memory bandwidth on A100 SXM4.",
      stats: { retweets: "310", likes: "1.8k", replies: "72" },
      url: "https://x.com/hooshaaii",
      tag: "CUDA Systems"
    },
    {
      author: "Hoosha AI \u{1F9E0}",
      handle: "@hooshaaii",
      avatar: "https://github.com/tahamajs.png",
      date: "Jul 15, 2026",
      text: "Released 162 HuggingFace Assets! 92 pre-trained model weights + 70 synthetic evaluation datasets for Persian LLM benchmarks and sub-quadratic linear attention research. Open for the global community.",
      stats: { retweets: "188", likes: "940", replies: "41" },
      url: "https://huggingface.co/tahamajs",
      tag: "Open Science"
    }
  ];
  function SocialFeedSection({ beep }) {
    return /* @__PURE__ */ React.createElement("section", { id: "social-feed", className: "section fade-up" }, /* @__PURE__ */ React.createElement(
      SectionHead,
      {
        tag: "Research Dispatch & X Feed",
        title: "Latest Updates from <b>@hooshaaii</b> \u{1F426}",
        sub: "Follow live dispatches on Flow Matching, GRPO post-training, CUDA kernel optimization, and Hugging Face releases."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "tweets-grid" }, TWEETS.map((t, i) => /* @__PURE__ */ React.createElement("a", { key: i, href: t.url, target: "_blank", className: "tweet-card", onClick: () => beep?.() }, /* @__PURE__ */ React.createElement("div", { className: "tweet-header" }, /* @__PURE__ */ React.createElement("img", { src: t.avatar, onError: (e) => {
      e.target.src = "https://github.com/tahamajs.png";
    }, alt: t.author, className: "tweet-avatar" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "tweet-author" }, t.author, " ", /* @__PURE__ */ React.createElement("i", { className: "fas fa-check-circle tweet-badge" })), /* @__PURE__ */ React.createElement("div", { className: "tweet-handle" }, t.handle, " \xB7 ", t.date)), /* @__PURE__ */ React.createElement("span", { className: "tweet-tag" }, t.tag)), /* @__PURE__ */ React.createElement("p", { className: "tweet-body" }, t.text), /* @__PURE__ */ React.createElement("div", { className: "tweet-footer" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "far fa-comment" }), " ", t.stats.replies), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "fas fa-retweet" }), " ", t.stats.retweets), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "far fa-heart" }), " ", t.stats.likes), /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto", color: "var(--accent)" } }, /* @__PURE__ */ React.createElement("i", { className: "fab fa-x-twitter" }), " View on X"))))));
  }

  // src/components/sections/GpuTelemetrySection.jsx
  var import_react10 = __toESM(require_react_shim());
  function GpuTelemetrySection() {
    const [history, setHistory] = (0, import_react10.useState)(() => Array(20).fill(70));
    const [flopsHist, setFlopsHist] = (0, import_react10.useState)(() => Array(20).fill(312));
    const [vram, setVram] = (0, import_react10.useState)(68.4);
    const [temp, setTemp] = (0, import_react10.useState)(62);
    (0, import_react10.useEffect)(() => {
      const id = setInterval(() => {
        const util = Math.floor(65 + Math.random() * 32);
        const fl = Math.floor(300 + Math.random() * 25);
        const vr = (66 + Math.random() * 4).toFixed(1);
        const tm = Math.floor(60 + Math.random() * 6);
        setHistory((prev) => [...prev.slice(1), util]);
        setFlopsHist((prev) => [...prev.slice(1), fl]);
        setVram(vr);
        setTemp(tm);
      }, 1500);
      return () => clearInterval(id);
    }, []);
    return /* @__PURE__ */ React.createElement("section", { id: "telemetry", className: "section fade-up" }, /* @__PURE__ */ React.createElement(
      SectionHead,
      {
        tag: "Real-Time Node Telemetry",
        title: "Distributed Cluster Health & Metrics \u{1F4CA}",
        sub: "Live monitoring simulation of Taha's 8\xD7A100 SXM4 80GB GPU cluster node executing Flow Matching ODE integrations and GRPO post-training steps."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "telemetry-grid" }, /* @__PURE__ */ React.createElement("div", { className: "telemetry-card" }, /* @__PURE__ */ React.createElement("div", { className: "telemetry-header" }, /* @__PURE__ */ React.createElement("span", { className: "telemetry-title" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-microchip", style: { color: "var(--accent)" } }), " Streaming Multiprocessor (SM)"), /* @__PURE__ */ React.createElement("span", { className: "telemetry-val", style: { color: "var(--accent)" } }, history[history.length - 1], "%")), /* @__PURE__ */ React.createElement("div", { className: "sparkline" }, history.map((h, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "sparkline-bar", style: { height: `${h}%`, background: "var(--accent)" } }))), /* @__PURE__ */ React.createElement("div", { className: "telemetry-sub" }, "Target: 108 SMs @ 1.41 GHz \xB7 6,912 CUDA Cores")), /* @__PURE__ */ React.createElement("div", { className: "telemetry-card" }, /* @__PURE__ */ React.createElement("div", { className: "telemetry-header" }, /* @__PURE__ */ React.createElement("span", { className: "telemetry-title" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-bolt", style: { color: "var(--emerald)" } }), " Tensor FLOPS (BF16)"), /* @__PURE__ */ React.createElement("span", { className: "telemetry-val", style: { color: "var(--emerald)" } }, flopsHist[flopsHist.length - 1], " TFLOPS")), /* @__PURE__ */ React.createElement("div", { className: "sparkline" }, flopsHist.map((f, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "sparkline-bar", style: { height: `${(f - 280) / 50 * 100}%`, background: "var(--emerald)" } }))), /* @__PURE__ */ React.createElement("div", { className: "telemetry-sub" }, "Peak FP16 Tensor Core Performance: 312 TFLOPS")), /* @__PURE__ */ React.createElement("div", { className: "telemetry-card" }, /* @__PURE__ */ React.createElement("div", { className: "telemetry-header" }, /* @__PURE__ */ React.createElement("span", { className: "telemetry-title" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-memory", style: { color: "#a78bfa" } }), " HBM2e VRAM Usage"), /* @__PURE__ */ React.createElement("span", { className: "telemetry-val", style: { color: "#a78bfa" } }, vram, " / 80 GB")), /* @__PURE__ */ React.createElement("div", { className: "telemetry-progress" }, /* @__PURE__ */ React.createElement("div", { className: "telemetry-progress-fill", style: { width: `${vram / 80 * 100}%`, background: "#a78bfa" } })), /* @__PURE__ */ React.createElement("div", { className: "telemetry-sub" }, "Bandwidth: 1,935 GB/s (1.93 TB/s peak)")), /* @__PURE__ */ React.createElement("div", { className: "telemetry-card" }, /* @__PURE__ */ React.createElement("div", { className: "telemetry-header" }, /* @__PURE__ */ React.createElement("span", { className: "telemetry-title" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-temperature-high", style: { color: "#f43f5e" } }), " Thermal & Power Draw"), /* @__PURE__ */ React.createElement("span", { className: "telemetry-val", style: { color: "#f43f5e" } }, temp, "\xB0C / 380W")), /* @__PURE__ */ React.createElement("div", { className: "telemetry-progress" }, /* @__PURE__ */ React.createElement("div", { className: "telemetry-progress-fill", style: { width: `${temp / 85 * 100}%`, background: "#f43f5e" } })), /* @__PURE__ */ React.createElement("div", { className: "telemetry-sub" }, "SXM4 Liquid-Cooled Loop \xB7 Max TDP: 400W"))));
  }

  // src/components/modals/AIChatModal.jsx
  var import_react12 = __toESM(require_react_shim());

  // src/components/ui/Modal.jsx
  var import_react11 = __toESM(require_react_shim());
  function Modal({ open, onClose, children, wide = false }) {
    (0, import_react11.useEffect)(() => {
      if (open) document.body.style.overflow = "hidden";
      else document.body.style.overflow = "";
      return () => {
        document.body.style.overflow = "";
      };
    }, [open]);
    if (!open) return null;
    return /* @__PURE__ */ React.createElement("div", { className: "modal-overlay", onClick: onClose }, /* @__PURE__ */ React.createElement(
      "div",
      {
        className: `modal-box${wide ? " modal-wide" : ""}`,
        onClick: (e) => e.stopPropagation()
      },
      /* @__PURE__ */ React.createElement("button", { className: "modal-close", "aria-label": "Close", onClick: onClose }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-times" })),
      children
    ));
  }

  // src/components/modals/AIChatModal.jsx
  var RESPONSES = {
    linkedin: "\u{1F4BC} Taha's LinkedIn has <b>17,100+ followers</b> \u2014 one of Iran's largest AI communities. He posts weekly deep-dives on LLM alignment, CUDA engineering, and distributed training.",
    hoosha: "\u{1F9E0} <b>Hoosha AI</b> is Taha's research startup on cognitive AI: Flow Matching generative models, GRPO post-training, and IIT-based synthetic consciousness. <a href='https://hooshaai.substack.com' target='_blank'>hooshaai.substack.com</a>",
    flow: "\u{1F3A8} <b>Conditional Flow Matching</b> learns velocity field v\u03B8(t,x) so integrating from x\u2080~N(0,I) lands on data x\u2081 via an ODE. No SDE noise during inference, 20 steps, FID 4.21 vs 9.87 for DDPM.",
    grpo: "\u{1F4D0} <b>GRPO</b> (Group Relative Policy Optimisation) fine-tunes LLMs for math with group-normalised advantage + clipped surrogate + KL penalty. Taha hit <b>80.7% GSM8K pass@1</b> (+18% vs SFT) on a 4B model with 8\xD7A100.",
    kaleido: "\u26A1 <b>Kaleido Engine</b> is Taha's first-principles 4D-parallel CUDA/C++ LLM training framework \u2014 fused FP16 all-reduce, ring attention, tensor+pipeline+sequence+data parallelism on A100 SXM4 clusters.",
    svd: "\u{1F52C} <b>SVD Linear Attention</b>: Taha's rank-r factorisation of full softmax attention \u2014 6\xD7 less memory, 6.1\xD7 faster, 94% quality retained (BLEU-4: 28.4 vs 30.2) on 4k-token sequences.",
    ta: "\u{1F393} Taha is TA at <b>Sharif University</b> (Compiler Construction) and <b>University of Tehran</b> (M.Sc. ML, AI, Advanced C++, OS Lab) \u2014 mentoring <b>500+ students</b> across 6 simultaneous courses.",
    sponsor: "\u{1F496} You can <b>sponsor Taha's open-source work</b> on GitHub Sponsors! His projects include Kaleido Engine, Persian LLMs, SVD Attention, and AI research tooling. <a href='https://github.com/sponsors/tahamajs' target='_blank'>github.com/sponsors/tahamajs</a>",
    contact: "\u{1F4E7} Email: <a href='mailto:tahamajlesi@ut.ac.ir'>tahamajlesi@ut.ac.ir</a> | Telegram: <a href='https://telegram.me/tahamajlesii'>@tahamajlesii</a> | LinkedIn: <a href='https://linkedin.com/in/tahamajlesi'>tahamajlesi</a>"
  };
  function classify(q) {
    const lo = q.toLowerCase();
    if (lo.includes("sponsor") || lo.includes("fund") || lo.includes("donate")) return "sponsor";
    if (lo.includes("linkedin") || lo.includes("follower")) return "linkedin";
    if (lo.includes("hoosha")) return "hoosha";
    if (lo.includes("flow") || lo.includes("ode")) return "flow";
    if (lo.includes("grpo") || lo.includes("gsm") || lo.includes("rlhf")) return "grpo";
    if (lo.includes("kaleido") || lo.includes("cuda") || lo.includes("kernel")) return "kaleido";
    if (lo.includes("svd") || lo.includes("linear attention")) return "svd";
    if (lo.includes("ta") || lo.includes("teach") || lo.includes("sharif")) return "ta";
    if (lo.includes("email") || lo.includes("contact") || lo.includes("hire")) return "contact";
    return null;
  }
  var QUICK = [
    "What is Hoosha AI?",
    "Explain Flow Matching",
    "GRPO on GSM8K",
    "Sponsor Taha \u{1F496}",
    "Kaleido CUDA Engine",
    "How to hire Taha?"
  ];
  function AIChatModal({ open, onClose, beep, speak }) {
    const [msgs, setMsgs] = (0, import_react12.useState)([
      { who: "bot", text: "\u{1F44B} I'm Taha's AI research assistant. Ask me about <b>Flow Matching</b>, <b>GRPO</b>, <b>Hoosha AI</b>, <b>Kaleido Engine</b>, <b>GitHub Sponsors</b>, or how to <b>hire Taha</b>!" }
    ]);
    const [input, setInput] = (0, import_react12.useState)("");
    const send = (q) => {
      if (!q?.trim()) return;
      setMsgs((p) => [...p, { who: "user", text: q.trim() }]);
      setInput("");
      const key = classify(q);
      const r = key ? RESPONSES[key] : "I'm Taha's AI assistant \u{1F916} \u2014 ask about Flow Matching, GRPO, Kaleido Engine, GitHub Sponsors, or his 17.1k LinkedIn community!";
      setTimeout(() => {
        setMsgs((p) => [...p, { who: "bot", text: r }]);
        beep?.(810, "triangle");
        speak?.(r);
      }, 340);
    };
    return /* @__PURE__ */ React.createElement(Modal, { open, onClose }, /* @__PURE__ */ React.createElement("div", { className: "ai-header" }, /* @__PURE__ */ React.createElement("div", { className: "ai-avatar" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-robot" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", null, "Taha's AI Research Assistant \u{1F9E0}"), /* @__PURE__ */ React.createElement("p", null, "Ask about research, Hoosha AI, Kaleido, Sponsors, or how to hire Taha"))), /* @__PURE__ */ React.createElement("div", { className: "chat-body" }, msgs.map((m, i) => /* @__PURE__ */ React.createElement(
      "div",
      {
        key: i,
        className: `chat-msg ${m.who}`,
        dangerouslySetInnerHTML: { __html: m.text }
      }
    ))), /* @__PURE__ */ React.createElement("div", { className: "quick-prompts" }, QUICK.map((q) => /* @__PURE__ */ React.createElement("button", { key: q, className: "qp-btn", onClick: () => send(q) }, q))), /* @__PURE__ */ React.createElement("div", { className: "chat-input-row" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        placeholder: "Ask anything about Taha's research\u2026",
        value: input,
        onChange: (e) => setInput(e.target.value),
        onKeyDown: (e) => e.key === "Enter" && send(input)
      }
    ), /* @__PURE__ */ React.createElement("button", { className: "btn-send", "aria-label": "Send", onClick: () => send(input) }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-paper-plane" }))));
  }

  // src/components/modals/HireModal.jsx
  var TEMPLATES = [
    { icon: "fa-building", label: "Senior AI / Systems Engineer Role", subj: "Senior%20AI%20Engineering%20Role" },
    { icon: "fa-graduation-cap", label: "Ph.D. & Academic Research Collaboration", subj: "PhD%20Research%20Collaboration" },
    { icon: "fa-lightbulb", label: "Open-Source & R&D Partnership", subj: "Open-Source%20Collaboration" },
    { icon: "fa-heart", label: "Sponsor Taha's Open-Source Work", subj: "GitHub%20Sponsor%20Inquiry", href: "https://github.com/sponsors/tahamajs" }
  ];
  function HireModal({ open, onClose }) {
    return /* @__PURE__ */ React.createElement(Modal, { open, onClose }, /* @__PURE__ */ React.createElement("div", { className: "section-tag" }, "\u{1F4BC} Direct Recruitment"), /* @__PURE__ */ React.createElement("h2", { style: { color: "#fff", marginBottom: ".5rem" } }, "Recruit / Collaborate with Taha \u{1F680}"), /* @__PURE__ */ React.createElement("p", { style: { color: "var(--muted)", fontSize: ".88rem", marginBottom: "1.5rem" } }, "Taha is open to ", /* @__PURE__ */ React.createElement("b", { style: { color: "var(--text)" } }, "Senior AI / ML Engineer"), ",", " ", /* @__PURE__ */ React.createElement("b", { style: { color: "var(--text)" } }, "Research Scientist"), ", and", " ", /* @__PURE__ */ React.createElement("b", { style: { color: "var(--text)" } }, "Ph.D."), " opportunities, plus AI advisory, open-source collaboration, and GitHub Sponsorship."), /* @__PURE__ */ React.createElement("div", { className: "hire-tmpl" }, TEMPLATES.map((t, i) => /* @__PURE__ */ React.createElement(
      "a",
      {
        key: i,
        className: "hire-tmpl-item",
        href: t.href || `mailto:tahamajlesi@ut.ac.ir?subject=${t.subj}`,
        target: t.href ? "_blank" : "_self"
      },
      /* @__PURE__ */ React.createElement("i", { className: `fas ${t.icon}` }),
      /* @__PURE__ */ React.createElement("b", null, t.label),
      /* @__PURE__ */ React.createElement("i", { className: "fas fa-arrow-right", style: { marginLeft: "auto", opacity: 0.4, fontSize: ".75rem" } })
    ))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: ".75rem", flexWrap: "wrap", marginTop: "1.5rem" } }, /* @__PURE__ */ React.createElement("a", { href: "mailto:tahamajlesi@ut.ac.ir", className: "btn-primary" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-envelope" }), " Email Taha"), /* @__PURE__ */ React.createElement("a", { href: "https://github.com/sponsors/tahamajs", target: "_blank", className: "btn-secondary", style: { borderColor: "#ea4aaa", color: "#ea4aaa" } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-heart" }), " Sponsor on GitHub"), /* @__PURE__ */ React.createElement("a", { href: "https://telegram.me/tahamajlesii", target: "_blank", className: "btn-secondary" }, /* @__PURE__ */ React.createElement("i", { className: "fab fa-telegram" }), " Telegram"), /* @__PURE__ */ React.createElement("a", { href: "https://linkedin.com/in/tahamajlesi", target: "_blank", className: "btn-secondary" }, /* @__PURE__ */ React.createElement("i", { className: "fab fa-linkedin" }), " LinkedIn")));
  }

  // src/components/modals/CommandPalette.jsx
  var import_react13 = __toESM(require_react_shim());
  function CommandPalette({ open, onClose, onCmd }) {
    const [q, setQ] = (0, import_react13.useState)("");
    if (!open) return null;
    const filtered = CMD_ITEMS.filter((i) => i.text.toLowerCase().includes(q.toLowerCase()));
    return /* @__PURE__ */ React.createElement("div", { className: "modal-overlay", onClick: onClose }, /* @__PURE__ */ React.createElement("div", { className: "cmd-box", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "cmd-search" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-search" }), /* @__PURE__ */ React.createElement(
      "input",
      {
        autoFocus: true,
        placeholder: "Search commands, sections, links\u2026",
        value: q,
        onChange: (e) => setQ(e.target.value)
      }
    ), /* @__PURE__ */ React.createElement("button", { style: { background: "none", border: "1px solid var(--border)", color: "var(--muted)", padding: ".2rem .5rem", borderRadius: 5, fontSize: ".72rem", cursor: "pointer" }, onClick: onClose }, "ESC")), /* @__PURE__ */ React.createElement("div", { className: "cmd-results" }, filtered.map((it, i) => /* @__PURE__ */ React.createElement(
      "div",
      {
        key: i,
        className: "cmd-item",
        role: "button",
        tabIndex: 0,
        onClick: () => {
          onCmd(it.id);
          onClose();
        },
        onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && (onCmd(it.id), onClose())
      },
      /* @__PURE__ */ React.createElement("i", { className: it.icon }),
      it.text,
      /* @__PURE__ */ React.createElement("i", { className: "fas fa-arrow-right", style: { marginLeft: "auto", opacity: 0.25, fontSize: ".7rem" } })
    ))), /* @__PURE__ */ React.createElement("div", { style: { padding: ".5rem 1.2rem", borderTop: "1px solid var(--border)", display: "flex", gap: "1rem", fontSize: ".7rem", color: "var(--muted)" } }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("kbd", { style: { background: "var(--glass2)", border: "1px solid var(--border)", padding: ".1rem .4rem", borderRadius: 4 } }, "\u2191\u2193"), " Navigate"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("kbd", { style: { background: "var(--glass2)", border: "1px solid var(--border)", padding: ".1rem .4rem", borderRadius: 4 } }, "\u21B5"), " Select"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("kbd", { style: { background: "var(--glass2)", border: "1px solid var(--border)", padding: ".1rem .4rem", borderRadius: 4 } }, "ESC"), " Close"))));
  }

  // src/components/ui/Toast.jsx
  function Toast({ msg }) {
    if (!msg) return null;
    return /* @__PURE__ */ React.createElement("div", { className: "toast-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "toast" }, msg));
  }

  // src/App.jsx
  function App() {
    const [data, setData] = (0, import_react14.useState)({ repos: [], articles: [], hf: [], readmeHtml: "" });
    const [search, setSearch] = (0, import_react14.useState)("");
    const [filter, setFilter] = (0, import_react14.useState)("all");
    const [hfFilter, setHfFilter] = (0, import_react14.useState)("all");
    const [subSearch, setSubSearch] = (0, import_react14.useState)("");
    const [accent, setAccent] = (0, import_react14.useState)("cyan");
    const [mobileNav, setMobileNav] = (0, import_react14.useState)(false);
    const [codeTab, setCodeTab] = (0, import_react14.useState)("flow");
    const [codeOut, setCodeOut] = (0, import_react14.useState)("");
    const [soundOn, setSoundOn] = (0, import_react14.useState)(false);
    const [aiOpen, setAiOpen] = (0, import_react14.useState)(false);
    const [cmdOpen, setCmdOpen] = (0, import_react14.useState)(false);
    const [hireOpen, setHireOpen] = (0, import_react14.useState)(false);
    const [bibtexPub, setBibtexPub] = (0, import_react14.useState)(null);
    const [toast, showToast] = useToast();
    const time = useTehranClock();
    const gpuM = useGpuMetrics();
    const beep = useBeep(soundOn);
    useNeuralCanvas();
    (0, import_react14.useEffect)(() => {
      fetch("data.json").then((r) => r.json()).then((d) => setData(d)).catch(() => {
      });
    }, []);
    (0, import_react14.useEffect)(() => {
      const fn = (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
          e.preventDefault();
          setCmdOpen((p) => !p);
        }
        if (e.key === "Escape") {
          setCmdOpen(false);
          setAiOpen(false);
          setHireOpen(false);
          setBibtexPub(null);
          setMobileNav(false);
        }
      };
      window.addEventListener("keydown", fn);
      return () => window.removeEventListener("keydown", fn);
    }, []);
    const repos = (0, import_react14.useMemo)(() => (data.repos || []).filter((r) => {
      const ok = filter === "all" || r.cat === filter;
      const q = search.trim().toLowerCase();
      return ok && (!q || (r.name + r.desc + r.lang + r.tag).toLowerCase().includes(q));
    }), [data.repos, filter, search]);
    const articles = (0, import_react14.useMemo)(() => {
      const q = subSearch.trim().toLowerCase();
      return (data.articles || []).filter((a) => !q || (a.title + a.desc).toLowerCase().includes(q));
    }, [data.articles, subSearch]);
    const hfAssets = (0, import_react14.useMemo)(() => (data.hf || []).filter((h) => hfFilter === "all" || h.type === hfFilter), [data.hf, hfFilter]);
    const counts = (0, import_react14.useMemo)(() => {
      const r = data.repos || [];
      return {
        all: r.length,
        course: r.filter((x) => x.cat === "course").length,
        ai: r.filter((x) => x.cat === "ai").length,
        systems: r.filter((x) => x.cat === "systems").length,
        web: r.filter((x) => x.cat === "web").length
      };
    }, [data.repos]);
    const scrollTo = (id) => document.getElementById(id)?.scrollIntoView();
    const setAccentColor = (c) => {
      setAccent(c);
      document.body.setAttribute("data-accent", c);
      beep(800);
      showToast(`Theme: ${c} \u2728`);
    };
    const copyBib = (bib) => {
      navigator.clipboard.writeText(bib);
      beep(700, "square");
      showToast("\u{1F4C4} BibTeX copied!");
      setBibtexPub(null);
    };
    const handleCmd = (id) => {
      setCmdOpen(false);
      const map = {
        ai: () => setAiOpen(true),
        hire: () => setHireOpen(true),
        sponsor: () => window.open("https://github.com/sponsors/tahamajs", "_blank"),
        linkedin: () => window.open("https://linkedin.com/in/tahamajlesi", "_blank"),
        hf: () => window.open("https://huggingface.co/tahamajs", "_blank"),
        substack: () => window.open("https://hooshaai.substack.com", "_blank"),
        email: () => window.location.href = "mailto:tahamajlesi@ut.ac.ir",
        resume: () => window.open("assets/resume.pdf", "_blank")
      };
      (map[id] || (() => {
      }))();
    };
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Navigation, { mobileNav, setMobileNav, onHire: () => setHireOpen(true), onCmd: () => setCmdOpen(true) }), /* @__PURE__ */ React.createElement("main", null, /* @__PURE__ */ React.createElement(HeroSection, { time, onHire: () => setHireOpen(true), onAI: () => setAiOpen(true), onSponsor: () => {
    }, setSearch, scrollTo, beep }), /* @__PURE__ */ React.createElement(AchievementsSection, null), /* @__PURE__ */ React.createElement(GpuTelemetrySection, null), /* @__PURE__ */ React.createElement(CodeSandboxSection, { activeTab: codeTab, setActiveTab: setCodeTab, runOutput: codeOut, setRunOutput: setCodeOut, beep }), /* @__PURE__ */ React.createElement(ConstellationSection, { beep }), /* @__PURE__ */ React.createElement(ContributionGraph, null), /* @__PURE__ */ React.createElement(TimelineSection, null), /* @__PURE__ */ React.createElement(SkillsSection, null), /* @__PURE__ */ React.createElement(ProjectsSection, { repos, search, setSearch, filter, setFilter, hfAssets, hfFilter, setHfFilter, counts, articles, subSearch, setSubSearch, beep }), /* @__PURE__ */ React.createElement(PublicationsSection, { onCopyBib: setBibtexPub, beep }), /* @__PURE__ */ React.createElement(SocialFeedSection, { beep }), /* @__PURE__ */ React.createElement(SubstackSection, { articles, subSearch, setSubSearch, beep }), /* @__PURE__ */ React.createElement(NewsletterSection, { beep }), /* @__PURE__ */ React.createElement(ContactSection, { onHire: () => setHireOpen(true), beep }), data.readmeHtml && /* @__PURE__ */ React.createElement(ReadmeSection, { readmeHtml: data.readmeHtml })), /* @__PURE__ */ React.createElement(Footer, { gpuM }), /* @__PURE__ */ React.createElement("div", { className: "theme-switcher" }, /* @__PURE__ */ React.createElement("div", { className: "theme-switcher-panel" }, /* @__PURE__ */ React.createElement("button", { className: `ctrl-btn ${soundOn ? "active" : ""}`, onClick: () => {
      setSoundOn(!soundOn);
      showToast(soundOn ? "Sound Off \u{1F507}" : "Sound On \u{1F50A}");
      beep(600);
    }, "aria-label": "Toggle Sound" }, /* @__PURE__ */ React.createElement("i", { className: `fas ${soundOn ? "fa-volume-up" : "fa-volume-mute"}` })), /* @__PURE__ */ React.createElement("div", { className: "ctrl-divider" }), ["cyan", "purple", "emerald", "rose"].map((c) => /* @__PURE__ */ React.createElement("div", { key: c, className: `accent-dot ${accent === c ? "active" : ""}`, style: { background: `var(--${c})` }, onClick: () => setAccentColor(c), title: c })))), /* @__PURE__ */ React.createElement("button", { className: "back-top-btn", onClick: () => {
      window.scrollTo(0, 0);
      beep?.();
    }, "aria-label": "Back to top" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-chevron-up" })), /* @__PURE__ */ React.createElement("button", { className: "ai-fab", onClick: () => {
      setAiOpen(true);
      beep?.();
    } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-robot" }), " ", /* @__PURE__ */ React.createElement("span", null, "Ask AI")), /* @__PURE__ */ React.createElement(Toast, { msg: toast }), /* @__PURE__ */ React.createElement(AIChatModal, { open: aiOpen, onClose: () => setAiOpen(false), beep, speak: null }), /* @__PURE__ */ React.createElement(HireModal, { open: hireOpen, onClose: () => setHireOpen(false) }), /* @__PURE__ */ React.createElement(CommandPalette, { open: cmdOpen, onClose: () => setCmdOpen(false), onCmd: handleCmd }), /* @__PURE__ */ React.createElement(Modal, { open: !!bibtexPub, onClose: () => setBibtexPub(null) }, /* @__PURE__ */ React.createElement("h3", { style: { color: "#fff", marginBottom: "1rem" } }, "Cite Document"), /* @__PURE__ */ React.createElement("div", { className: "bib-box" }, bibtexPub), /* @__PURE__ */ React.createElement("button", { className: "btn-primary", style: { marginTop: "1rem", width: "100%", justifyContent: "center" }, onClick: () => copyBib(bibtexPub) }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-copy" }), " Copy to Clipboard")));
  }

  // src/index.jsx
  var rootElement = document.getElementById("root");
  var root = (0, import_client.createRoot)(rootElement);
  root.render(/* @__PURE__ */ import_react15.default.createElement(App, null));
})();
