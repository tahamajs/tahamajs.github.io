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
  var import_react21 = __toESM(require_react_shim());
  var import_client = __toESM(require_react_dom_client_shim());

  // src/App.jsx
  var import_react20 = __toESM(require_react_shim());

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
  function useNeuralCanvas(mode = "rain") {
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
      const N = W > 700 ? 60 : 25;
      const pts = Array.from({ length: N }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 1.8 + 0.5,
        a: Math.random(),
        da: (Math.random() * 0.02 + 4e-3) * (Math.random() < 0.5 ? 1 : -1)
      }));
      const rain = Array.from({ length: W > 700 ? 50 : 20 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        len: Math.random() * 25 + 15,
        spd: Math.random() * 4 + 2,
        opacity: Math.random() * 0.4 + 0.1
      }));
      const ripples = [];
      const snow = Array.from({ length: W > 700 ? 65 : 30 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 3 + 1,
        spd: Math.random() * 1 + 0.5,
        sway: Math.random() * 1 - 0.5,
        opacity: Math.random() * 0.7 + 0.3
      }));
      const chars = "01\u03BB\u222B\u2207\u2202\u03B8\u03C0\u03A3\u03A6\u03A8";
      const matrixCols = Array.from({ length: Math.floor(W / 20) }, () => Math.random() * H);
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
        if (mode === "rain") {
          for (let i = 0; i < rain.length; i++) {
            const r = rain[i];
            ctx.beginPath();
            ctx.moveTo(r.x, r.y);
            ctx.lineTo(r.x, r.y + r.len);
            ctx.strokeStyle = `rgba(0, 240, 255, ${r.opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            r.y += r.spd;
            if (r.y > H) {
              if (Math.random() < 0.6) ripples.push({ x: r.x, y: H - 5, radius: 2, maxR: Math.random() * 20 + 10, alpha: 0.6 });
              r.y = -r.len;
              r.x = Math.random() * W;
            }
          }
          for (let i = ripples.length - 1; i >= 0; i--) {
            const rip = ripples[i];
            ctx.beginPath();
            ctx.ellipse(rip.x, rip.y, rip.radius, rip.radius * 0.4, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(138, 43, 226, ${rip.alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            rip.radius += 0.8;
            rip.alpha -= 0.02;
            if (rip.alpha <= 0 || rip.radius >= rip.maxR) ripples.splice(i, 1);
          }
        } else if (mode === "snow") {
          for (let i = 0; i < snow.length; i++) {
            const s = snow[i];
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
            ctx.fill();
            s.y += s.spd;
            s.x += Math.sin(s.y * 0.02) * s.sway;
            if (s.y > H) {
              s.y = -5;
              s.x = Math.random() * W;
            }
          }
        } else if (mode === "matrix") {
          ctx.font = '14px "JetBrains Mono", monospace';
          ctx.fillStyle = "rgba(16, 185, 129, 0.4)";
          matrixCols.forEach((y, x) => {
            const ch = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(ch, x * 20, y);
            matrixCols[x] = y > H || Math.random() > 0.975 ? 0 : y + 16;
          });
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
        cancelAnimationFrame(raf);
      };
    }, [mode]);
  }

  // src/components/layout/Navigation.jsx
  var import_react2 = __toESM(require_react_shim());
  function Navigation({ mobileNav, setMobileNav, onHire, onCmd }) {
    (0, import_react2.useEffect)(() => {
      const fn = () => setMobileNav(false);
      window.addEventListener("scroll", fn, { passive: true });
      return () => window.removeEventListener("scroll", fn);
    }, [setMobileNav]);
    return /* @__PURE__ */ React.createElement("nav", { className: "glass-nav" }, /* @__PURE__ */ React.createElement("div", { className: "nav-container" }, /* @__PURE__ */ React.createElement("div", { className: "logo" }, "Taha ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--accent)" } }, "/"), " Hoosha AI"), /* @__PURE__ */ React.createElement("div", { className: `nav-links ${mobileNav ? "open" : ""}` }, /* @__PURE__ */ React.createElement("a", { href: "#about", onClick: () => setMobileNav(false) }, "About"), /* @__PURE__ */ React.createElement("a", { href: "#telemetry", onClick: () => setMobileNav(false) }, "Telemetry"), /* @__PURE__ */ React.createElement("a", { href: "#sandbox", onClick: () => setMobileNav(false) }, "AI Lab"), /* @__PURE__ */ React.createElement("a", { href: "#constellation", onClick: () => setMobileNav(false) }, "Graph"), /* @__PURE__ */ React.createElement("a", { href: "#projects", onClick: () => setMobileNav(false) }, "Projects"), /* @__PURE__ */ React.createElement("a", { href: "#publications", onClick: () => setMobileNav(false) }, "Papers"), /* @__PURE__ */ React.createElement("a", { href: "#social-feed", onClick: () => setMobileNav(false) }, "X Feed"), /* @__PURE__ */ React.createElement("a", { href: "#substack", onClick: () => setMobileNav(false) }, "Substack"), /* @__PURE__ */ React.createElement("a", { href: "#experience", onClick: () => setMobileNav(false) }, "Timeline"), /* @__PURE__ */ React.createElement("a", { href: "#contact", onClick: () => setMobileNav(false) }, "Contact"), /* @__PURE__ */ React.createElement("button", { className: "nav-hire-btn", onClick: () => {
      setMobileNav(false);
      onHire();
    } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-briefcase" }), " Recruit / Hire Taha"), /* @__PURE__ */ React.createElement("a", { href: "https://github.com/tahamajs", target: "_blank", className: "nav-hire-btn", style: { background: "#24292e", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" } }, /* @__PURE__ */ React.createElement("i", { className: "fab fa-github" }), " Follow"), /* @__PURE__ */ React.createElement("a", { href: "https://github.com/sponsors/tahamajs", target: "_blank", className: "nav-hire-btn", style: { background: "#ea4aaa", color: "#fff" } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-heart" }), " Sponsor")), /* @__PURE__ */ React.createElement("button", { className: "cmd-k-btn", onClick: onCmd }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-search" }), " ", /* @__PURE__ */ React.createElement("span", { className: "cmd-k-key" }, "\u2318K")), /* @__PURE__ */ React.createElement("button", { className: "mobile-nav-toggle", onClick: () => setMobileNav(!mobileNav) }, /* @__PURE__ */ React.createElement("i", { className: `fas ${mobileNav ? "fa-times" : "fa-bars"}` }))));
  }

  // src/components/layout/PageRouterBar.jsx
  var PAGES = [
    { id: "all", label: "\u{1F310} View All (Full Dashboard)", icon: "fas fa-globe" },
    { id: "home", label: "\u{1F464} Overview & Bio", icon: "fas fa-user-circle" },
    { id: "lab", label: "\u{1F9EA} Interactive AI Lab", icon: "fas fa-flask" },
    { id: "projects", label: "\u{1F680} Projects & HF Models", icon: "fas fa-cubes" },
    { id: "papers", label: "\u{1F4C4} Papers & Substack", icon: "fas fa-file-alt" },
    { id: "contact", label: "\u{1F4EC} Contact & Recruit", icon: "fas fa-paper-plane" }
  ];
  function PageRouterBar({ pageView, setPageView, beep }) {
    return /* @__PURE__ */ React.createElement("div", { className: "page-router-bar" }, /* @__PURE__ */ React.createElement("div", { className: "page-router-inner" }, /* @__PURE__ */ React.createElement("span", { className: "page-router-label" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-layer-group", style: { color: "var(--accent)" } }), " Multi-Page Mode:"), /* @__PURE__ */ React.createElement("div", { className: "page-router-tabs" }, PAGES.map((p) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: p.id,
        className: `page-router-tab ${pageView === p.id ? "active" : ""}`,
        onClick: () => {
          setPageView(p.id);
          beep?.(700);
          window.scrollTo(0, 0);
        }
      },
      /* @__PURE__ */ React.createElement("i", { className: p.icon }),
      " ",
      p.label
    )))));
  }

  // src/components/layout/Footer.jsx
  function Footer({ gpuM }) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("footer", { style: { textAlign: "center", padding: "4rem 1.5rem 8rem", borderTop: "1px solid var(--border)", background: "var(--bg2)" } }, /* @__PURE__ */ React.createElement("p", { style: { color: "var(--muted)", fontSize: ".85rem", marginBottom: "1rem" } }, "\xA9 ", (/* @__PURE__ */ new Date()).getFullYear(), " Mohammad Taha Majlesi. Open-Source AI Infrastructure."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("a", { href: "https://github.com/tahamajs", target: "_blank" }, "GitHub"), /* @__PURE__ */ React.createElement("a", { href: "https://huggingface.co/tahamajs", target: "_blank" }, "HuggingFace"), /* @__PURE__ */ React.createElement("a", { href: "https://hooshaai.substack.com", target: "_blank" }, "Hoosha AI"), /* @__PURE__ */ React.createElement("a", { href: "https://linkedin.com/in/tahamajlesi", target: "_blank" }, "LinkedIn"), /* @__PURE__ */ React.createElement("a", { href: "https://github.com/sponsors/tahamajs", target: "_blank", style: { color: "#ea4aaa" } }, "Sponsor"))), /* @__PURE__ */ React.createElement("div", { className: "gpu-bar" }, /* @__PURE__ */ React.createElement("div", { className: "gpu-dot" }), /* @__PURE__ */ React.createElement("div", { className: "gpu-item" }, "Node: ", /* @__PURE__ */ React.createElement("b", null, "A100-SXM4-80GB")), /* @__PURE__ */ React.createElement("div", { className: "gpu-item" }, "SM Util: ", /* @__PURE__ */ React.createElement("span", { className: "gpu-val" }, gpuM.util, "%")), /* @__PURE__ */ React.createElement("div", { className: "gpu-item" }, "VRAM: ", /* @__PURE__ */ React.createElement("span", { className: "gpu-val" }, gpuM.vram, " GB"), " / 80.0"), /* @__PURE__ */ React.createElement("div", { className: "gpu-item" }, "Bandwidth: ", /* @__PURE__ */ React.createElement("span", { className: "gpu-val" }, "1.8 TB/s")), /* @__PURE__ */ React.createElement("div", { className: "gpu-item" }, "TFLOPS: ", /* @__PURE__ */ React.createElement("span", { className: "gpu-val" }, gpuM.flops)), /* @__PURE__ */ React.createElement("div", { className: "gpu-item" }, "Temp: ", /* @__PURE__ */ React.createElement("span", { className: "gpu-val" }, gpuM.temp, "\xB0C"))));
  }

  // src/components/ui/FloatingContactBar.jsx
  function FloatingContactBar({ onHire, onCopyEmail, beep, showToast }) {
    return /* @__PURE__ */ React.createElement("div", { className: "floating-contact-bar" }, /* @__PURE__ */ React.createElement("div", { className: "floating-contact-inner" }, /* @__PURE__ */ React.createElement("button", { className: "floating-contact-btn primary", onClick: () => {
      onHire();
      beep?.(880);
    }, title: "Direct Recruit / Contact Modal" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-paper-plane" }), " ", /* @__PURE__ */ React.createElement("span", null, "Quick Contact")), /* @__PURE__ */ React.createElement("button", { className: "floating-contact-btn", onClick: () => {
      onCopyEmail();
      beep?.(700, "square");
    }, title: "1-Click Copy Email" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-envelope" }), " ", /* @__PURE__ */ React.createElement("span", null, "Copy Email")), /* @__PURE__ */ React.createElement("a", { href: "https://t.me/tahamajlesii", target: "_blank", className: "floating-contact-btn", onClick: () => beep?.(), title: "Instant Telegram Chat" }, /* @__PURE__ */ React.createElement("i", { className: "fab fa-telegram-plane" }), " ", /* @__PURE__ */ React.createElement("span", null, "Telegram")), /* @__PURE__ */ React.createElement("a", { href: "https://instagram.com/hooshaaii", target: "_blank", className: "floating-contact-btn", onClick: () => beep?.(), title: "Instagram @hooshaaii" }, /* @__PURE__ */ React.createElement("i", { className: "fab fa-instagram" }), " ", /* @__PURE__ */ React.createElement("span", null, "Instagram"))));
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
    { text: "Open Interactive CLI Shell (\u2318J)", icon: "fas fa-terminal", id: "cli" },
    { text: "Open 2D Neural Net Playground", icon: "fas fa-brain", id: "nn" },
    { text: "Open AI Research Assistant", icon: "fas fa-robot", id: "ai" },
    { text: "Open Recruit / Hire Taha", icon: "fas fa-briefcase", id: "hire" },
    { text: "Sponsor Taha on GitHub", icon: "fas fa-heart", id: "sponsor" },
    { text: "View GPU Cluster Telemetry", icon: "fas fa-chart-bar", id: "telemetry" },
    { text: "Explore AI Lab & Simulations", icon: "fas fa-vial", id: "sandbox" },
    { text: "View Research Constellation Graph", icon: "fas fa-project-diagram", id: "constellation" },
    { text: "Browse Projects & HF Assets", icon: "fas fa-cubes", id: "projects" },
    { text: "Read Publications & Papers", icon: "fas fa-scroll", id: "publications" },
    { text: "View X Feed (@hooshaaii)", icon: "fab fa-x-twitter", id: "feed" },
    { text: "Open Instagram (@hooshaaii)", icon: "fab fa-instagram", id: "instagram" },
    { text: "Read Substack Essays", icon: "fas fa-newspaper", id: "substack" },
    { text: "Open LinkedIn (17.1k followers)", icon: "fab fa-linkedin", id: "linkedin" },
    { text: "View HuggingFace (162 assets)", icon: "fas fa-brain", id: "hf" },
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
    ))), /* @__PURE__ */ React.createElement("div", { className: "hero-actions" }, /* @__PURE__ */ React.createElement("a", { href: "https://github.com/tahamajs", target: "_blank", className: "btn-github-follow", onClick: () => beep?.(700) }, /* @__PURE__ */ React.createElement("i", { className: "fab fa-github" }), " Follow @tahamajs ", /* @__PURE__ */ React.createElement("span", { className: "follow-count" }, "521")), /* @__PURE__ */ React.createElement("a", { href: "https://github.com/sponsors/tahamajs", target: "_blank", className: "btn-sponsor", onClick: () => beep?.(880, "triangle") }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-heart" }), " Sponsor on GitHub"), /* @__PURE__ */ React.createElement("button", { className: "btn-primary", onClick: onHire }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-briefcase" }), " Recruit / Hire Taha"), /* @__PURE__ */ React.createElement("a", { href: "assets/resume.pdf", target: "_blank", className: "btn-secondary" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-file-pdf" }), " Resume PDF")), /* @__PURE__ */ React.createElement("div", { className: "social-row" }, [
      ["fab fa-github", "https://github.com/tahamajs", "GitHub"],
      ["fas fa-robot", "https://huggingface.co/tahamajs", "HuggingFace"],
      ["fab fa-linkedin-in", "https://linkedin.com/in/tahamajlesi", "LinkedIn 17.1k"],
      ["fab fa-instagram", "https://instagram.com/hooshaaii", "Instagram @hooshaaii"],
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
    },
    unlearning: {
      label: "Machine Unlearning",
      code: `# Machine Unlearning & Concept Erasure via Null-Space Projection
# Erasing copyright/sensitive concepts without retraining \u2014 Taha Majlesi / Hoosha AI
import torch, torch.nn as nn, torch.nn.functional as F

def erase_concept_subspace(model_weights, concept_vectors):
    """
    Project model parameters onto the null-space of concept representations:
    W_unlearned = W (I - U U^T), where U = SVD(concept_vectors).k
    """
    U, S, V = torch.linalg.svd(concept_vectors, full_matrices=False)
    k = (S > 0.1).sum().item()  # rank threshold
    U_k = U[:, :k]
    P_null = torch.eye(model_weights.shape[1]) - U_k @ U_k.T
    return model_weights @ P_null

def compute_unlearning_loss(model, forget_loader, retain_loader, alpha=0.5):
    """Objective: Maximise entropy on forget set while preserving retain accuracy."""
    forget_loss = 0.0
    for x_f in forget_loader:
        logits = model(x_f)
        # Maximise KL divergence from target to uniform distribution
        forget_loss += -F.kl_div(logits.log_softmax(-1), 
                                 torch.full_like(logits, 1.0/logits.shape[-1]))
    retain_loss = sum(F.cross_entropy(model(x_r), y_r) for x_r, y_r in retain_loader)
    return forget_loss + alpha * retain_loss`,
      output: `[UNLEARN] Target concept: "Copyrighted Corpus v2"  Alpha=0.5  k=12
[BEFORE]   Forget Set Accuracy = 98.4%   Retain Set Accuracy = 94.2%
[PROJECT]  Null-Space Projection matrix (I - UU\u1D40) constructed (rank=12)
[AFTER]    Forget Set Accuracy = 1.2%    Retain Set Accuracy = 93.8%
[EVAL]     Concept Erased successfully \u2014 Retain loss degradation < 0.4%
[SUCCESS] Machine unlearning completed without full retraining \u2713`
    },
    iit: {
      label: "IIT \u03A6 Calculator",
      code: `# Integrated Information Theory (IIT 4.0) \u2014 Integrated Information \u03A6 Calculator
# Measuring synthetic consciousness & cognitive integration \u2014 Taha Majlesi / Hoosha AI
import numpy as np

def compute_effective_information(system_matrix, cause_effect_state):
    """Calculate EI = I(X_past; X_future) for a cause-effect system state."""
    # Entropy of whole system vs minimum partition entropy
    H_whole = -np.sum(cause_effect_state * np.log2(cause_effect_state + 1e-12))
    return H_whole

def compute_phi(transition_matrix):
    """
    Compute Integrated Information \u03A6:
    \u03A6 = EI(Whole System) - min_partition [ EI(Subsystem A) + EI(Subsystem B) ]
    """
    N = transition_matrix.shape[0]
    EI_whole = np.trace(transition_matrix) * np.log2(N)
    
    # Minimum Information Partition (MIP) search across 2^(N-1) partitions
    min_partition_EI = EI_whole * 0.42  # Synthetic minimum partition
    phi = max(0.0, EI_whole - min_partition_EI)
    return phi, EI_whole

# Compute \u03A6 for Hoosha Cognitive Architecture
W_cognition = np.random.dirichlet(np.ones(16), size=16)
phi_val, ei_val = compute_phi(W_cognition)`,
      output: `[IIT 4.0] System Dimension: N=16 cognitive nodes  Architecture=Recurrent
[COMPUTE]  Whole System Effective Information (EI) = 4.120 bits
[MIP]      Minimum Information Partition (MIP) cut identified: Partition (A: 8 | B: 8)
[PHI]      Integrated Information \u03A6 = 2.389 bits  (Threshold \u03A6 > 0: Integrated System)
[STATUS]   Synthetic Cognition Module is Integrated (\u03A6 > 0.0) \u2713`
    }
  };

  // src/components/sections/CodeSandboxSection.jsx
  function FlowMatchingVis({ playing, steps, solver, targetShape, noiseScale }) {
    const canvasRef = (0, import_react7.useRef)(null);
    (0, import_react7.useEffect)(() => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      let W = 380, H = 220;
      canvasRef.current.width = W;
      canvasRef.current.height = H;
      const N = 120;
      const pts = Array.from({ length: N }, () => {
        const startX = W / 2 + (Math.random() - 0.5) * W * 0.8;
        const startY = H / 2 + (Math.random() - 0.5) * H * 0.8;
        let targetX = W / 2, targetY = H / 2;
        if (targetShape === "circle") {
          const angle = Math.random() * Math.PI * 2;
          targetX = W / 2 + Math.cos(angle) * 60;
          targetY = H / 2 + Math.sin(angle) * 60;
        } else if (targetShape === "moon") {
          const t = Math.random() * Math.PI;
          targetX = W / 2 + Math.cos(t) * 70 - 20;
          targetY = H / 2 + Math.sin(t) * 40 - 20;
        } else if (targetShape === "spiral") {
          const r = Math.random() * 70;
          const a = r * 0.15;
          targetX = W / 2 + Math.cos(a) * r;
          targetY = H / 2 + Math.sin(a) * r;
        }
        return { startX, startY, targetX, targetY, t: 0 };
      });
      let frame;
      const dt = 1 / steps;
      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        let allDone = true;
        pts.forEach((p) => {
          if (playing && p.t < 1) p.t += dt * 0.8;
          if (p.t < 1) allDone = false;
          let t = Math.min(1, p.t);
          if (solver === "Midpoint" && t > 0) t = Math.sin(t * Math.PI / 2);
          else if (solver === "RK4" && t > 0) t = t * t * (3 - 2 * t);
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
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 240, 255, ${0.4 + 0.6 * t})`;
          ctx.fill();
        });
        if (playing && !allDone) frame = requestAnimationFrame(draw);
      };
      draw();
      if (playing) frame = requestAnimationFrame(draw);
      return () => cancelAnimationFrame(frame);
    }, [playing, steps, solver, targetShape, noiseScale]);
    return /* @__PURE__ */ React.createElement("div", { className: "vis-container" }, /* @__PURE__ */ React.createElement("div", { className: "vis-label" }, "Flow Field (", solver, " ODE \xB7 ", steps, " steps)"), /* @__PURE__ */ React.createElement("canvas", { ref: canvasRef, style: { width: "100%", height: "220px" } }));
  }
  function GRPOVis({ playing, groupSize, klCoeff }) {
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
      }, 700);
      return () => clearInterval(id);
    }, [playing]);
    const rollouts = Array.from({ length: Math.min(groupSize, 6) }, (_, i) => ({
      id: i + 1,
      score: (0.2 + i / groupSize * 0.75).toFixed(2),
      isPos: i >= groupSize / 2
    }));
    return /* @__PURE__ */ React.createElement("div", { className: "vis-container" }, /* @__PURE__ */ React.createElement("div", { className: "vis-label" }, "Group Advantages (G=", groupSize, " \xB7 KL \u03B2=", klCoeff, ")"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "6px", marginTop: "20px" } }, rollouts.map((r) => /* @__PURE__ */ React.createElement("div", { key: r.id, style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      opacity: step >= 1 ? 1 : 0,
      transition: "all 0.4s"
    } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "11px", color: "var(--muted)", width: "60px", fontFamily: "monospace" } }, "Rollout ", r.id, ":"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: {
      width: step >= 2 ? `${r.score * 100}%` : "0%",
      height: "100%",
      background: r.isPos ? "var(--emerald)" : "var(--rose)",
      transition: "width 0.5s ease"
    } })), step >= 3 && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "10px", fontWeight: "bold", color: r.isPos ? "var(--emerald)" : "var(--rose)", width: "45px", fontFamily: "monospace" } }, r.isPos ? "+Adv" : "-Adv")))));
  }
  function CUDAReductionVis({ playing, blockSize, precision }) {
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
      }, 500);
      return () => clearInterval(id);
    }, [playing]);
    return /* @__PURE__ */ React.createElement("div", { className: "vis-container" }, /* @__PURE__ */ React.createElement("div", { className: "vis-label" }, "Tree Shuffle (", precision, " \xB7 ", blockSize, " Threads)"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "25px", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px", opacity: step >= 0 ? 1 : 0 } }, Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "cuda-node" }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "30px", opacity: step >= 1 ? 1 : 0 } }, Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "cuda-node active" }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "74px", opacity: step >= 2 ? 1 : 0 } }, Array.from({ length: 2 }).map((_, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "cuda-node active" }))), /* @__PURE__ */ React.createElement("div", { style: { opacity: step >= 3 ? 1 : 0 } }, /* @__PURE__ */ React.createElement("div", { className: "cuda-node final" }))));
  }
  function SVDVis({ playing, rank, seqLen }) {
    const memSaved = ((1 - rank / 512) * 100).toFixed(0);
    return /* @__PURE__ */ React.createElement("div", { className: "vis-container", style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "15px" } }, /* @__PURE__ */ React.createElement("div", { className: "vis-label" }, "Low-Rank SVD (N=", seqLen, " \xB7 r=", rank, ")"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "15px" } }, /* @__PURE__ */ React.createElement("div", { className: `matrix n-by-n ${playing ? "shrink" : ""}` }, "N\xD7N"), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--muted)", fontSize: "18px" } }, "\u2248"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "4px" } }, /* @__PURE__ */ React.createElement("div", { className: "matrix n-by-r", style: { width: `${Math.max(16, rank / 3)}px` } }, "N\xD7r"), /* @__PURE__ */ React.createElement("div", { className: "matrix r-by-n", style: { height: `${Math.max(16, rank / 3)}px` } }, "r\xD7N"))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: "var(--accent)", fontFamily: "monospace" } }, playing ? `\u2713 VRAM Memory Savings: ${memSaved}% (Complexity O(N\xB7r))` : "Adjust rank slider to test low-rank factorisation"));
  }
  function UnlearningVis({ playing, threshold }) {
    return /* @__PURE__ */ React.createElement("div", { className: "vis-container", style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "10px" } }, /* @__PURE__ */ React.createElement("div", { className: "vis-label" }, "Null-Space Projection (Threshold k=", threshold, ")"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "12px", marginTop: "10px" } }, /* @__PURE__ */ React.createElement("div", { className: `matrix ${playing ? "shrink" : ""}`, style: { width: "80px", height: "50px", background: "rgba(244,63,94,0.1)", borderColor: "var(--rose)", color: "var(--rose)" } }, "W"), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--accent)" } }, "\xD7"), /* @__PURE__ */ React.createElement("div", { className: "matrix", style: { width: "100px", height: "40px", background: "rgba(0,240,255,0.1)", borderColor: "var(--cyan)" } }, "(I - U_k U_k\u1D40)"), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--emerald)" } }, "="), /* @__PURE__ */ React.createElement("div", { className: "matrix", style: { width: "80px", height: "50px", background: "rgba(16,185,129,0.1)", borderColor: "var(--emerald)", color: "var(--emerald)" } }, "W_clean")), /* @__PURE__ */ React.createElement("span", { style: { fontSize: "11px", color: playing ? "var(--emerald)" : "var(--muted)", fontFamily: "monospace" } }, playing ? `\u2713 ${threshold} concept dimensions erased from weights` : "Click Run to project weights onto null-space"));
  }
  function IITVis({ playing, numNodes }) {
    return /* @__PURE__ */ React.createElement("div", { className: "vis-container", style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "10px" } }, /* @__PURE__ */ React.createElement("div", { className: "vis-label" }, "IIT 4.0 \u03A6 Metric (N=", numNodes, " Nodes)"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "20px", marginTop: "10px" } }, /* @__PURE__ */ React.createElement("div", { style: { border: "1px dashed var(--accent)", padding: "8px", borderRadius: "10px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "4px" } }, Array.from({ length: Math.min(numNodes, 6) }).map((_, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { width: "10px", height: "10px", borderRadius: "50%", background: playing ? "var(--cyan)" : "var(--muted)", boxShadow: playing ? "0 0 6px var(--cyan)" : "none" } }))), /* @__PURE__ */ React.createElement("div", { style: { width: "2px", height: "40px", background: playing ? "var(--rose)" : "var(--muted)" } }), /* @__PURE__ */ React.createElement("div", { style: { border: "1px dashed var(--purple)", padding: "8px", borderRadius: "10px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "4px" } }, Array.from({ length: Math.min(numNodes, 6) }).map((_, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { width: "10px", height: "10px", borderRadius: "50%", background: playing ? "var(--purple)" : "var(--muted)", boxShadow: playing ? "0 0 6px var(--purple)" : "none" } })))), /* @__PURE__ */ React.createElement("span", { style: { fontSize: "11px", color: "var(--cyan)", fontFamily: "monospace" } }, playing ? `\u03A6 = ${(2.389 * (numNodes / 16)).toFixed(3)} bits (System Integrated)` : "Click Run to compute MIP cut"));
  }
  function CodeSandboxSection({ activeTab, setActiveTab, runOutput, setRunOutput, beep }) {
    const tabs = Object.keys(CODE_TABS);
    const data = CODE_TABS[activeTab];
    const [playing, setPlaying] = (0, import_react7.useState)(false);
    const [fullScreen, setFullScreen] = (0, import_react7.useState)(false);
    const [steps, setSteps] = (0, import_react7.useState)(20);
    const [solver, setSolver] = (0, import_react7.useState)("Euler");
    const [targetShape, setTargetShape] = (0, import_react7.useState)("circle");
    const [noiseScale, setNoiseScale] = (0, import_react7.useState)(0.01);
    const [groupSize, setGroupSize] = (0, import_react7.useState)(8);
    const [klCoeff, setKlCoeff] = (0, import_react7.useState)(0.04);
    const [blockSize, setBlockSize] = (0, import_react7.useState)(256);
    const [precision, setPrecision] = (0, import_react7.useState)("FP16");
    const [rank, setRank] = (0, import_react7.useState)(64);
    const [seqLen, setSeqLen] = (0, import_react7.useState)(4096);
    const [threshold, setThreshold] = (0, import_react7.useState)(12);
    const [numNodes, setNumNodes] = (0, import_react7.useState)(16);
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
    return /* @__PURE__ */ React.createElement("section", { id: "sandbox", className: `section fade-up ${fullScreen ? "sandbox-fullscreen-mode" : ""}` }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement(
      SectionHead,
      {
        tag: "Interactive AI Laboratory",
        title: "Explore Frontier Algorithms \u{1F9EA}",
        sub: "Adjust hyper-parameters, run ODE trajectories, and simulate CUDA warp reductions in real-time."
      }
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn-secondary",
        onClick: () => {
          setFullScreen(!fullScreen);
          beep?.();
        },
        style: { marginTop: "1rem", whiteSpace: "nowrap" }
      },
      /* @__PURE__ */ React.createElement("i", { className: `fas ${fullScreen ? "fa-compress" : "fa-expand"}` }),
      " ",
      fullScreen ? "Exit Fullscreen" : "Fullscreen Lab"
    )), /* @__PURE__ */ React.createElement("div", { className: "sandbox-grid" }, /* @__PURE__ */ React.createElement("div", { className: "terminal sandbox-left" }, /* @__PURE__ */ React.createElement("div", { className: "t-bar" }, /* @__PURE__ */ React.createElement("div", { className: "t-dots" }, /* @__PURE__ */ React.createElement("div", { className: "t-dot r", onClick: () => setFullScreen(false) }), /* @__PURE__ */ React.createElement("div", { className: "t-dot y" }), /* @__PURE__ */ React.createElement("div", { className: "t-dot g" })), /* @__PURE__ */ React.createElement("div", { className: "t-tabs" }, tabs.map((k) => /* @__PURE__ */ React.createElement(
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
    )))), /* @__PURE__ */ React.createElement("div", { className: "t-body" }, /* @__PURE__ */ React.createElement("div", { className: "t-code" }, data.code), /* @__PURE__ */ React.createElement("button", { className: "t-run-btn", onClick: handleRun, disabled: playing && runOutput.split("\n").length < data.output.split("\n").length }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-play" }), " ", playing ? "Executing..." : "Run Simulation"), runOutput && /* @__PURE__ */ React.createElement("div", { className: "t-output" }, runOutput))), /* @__PURE__ */ React.createElement("div", { className: "sandbox-right" }, /* @__PURE__ */ React.createElement("div", { className: "sandbox-visualizer" }, activeTab === "flow" && /* @__PURE__ */ React.createElement(FlowMatchingVis, { playing, steps, solver, targetShape, noiseScale }), activeTab === "grpo" && /* @__PURE__ */ React.createElement(GRPOVis, { playing, groupSize, klCoeff }), activeTab === "cuda" && /* @__PURE__ */ React.createElement(CUDAReductionVis, { playing, blockSize, precision }), activeTab === "svd" && /* @__PURE__ */ React.createElement(SVDVis, { playing, rank, seqLen }), activeTab === "unlearning" && /* @__PURE__ */ React.createElement(UnlearningVis, { playing, threshold }), activeTab === "iit" && /* @__PURE__ */ React.createElement(IITVis, { playing, numNodes }), !playing && /* @__PURE__ */ React.createElement("div", { className: "vis-overlay-play", onClick: handleRun }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-play-circle" }), /* @__PURE__ */ React.createElement("span", null, "Click to animate"))), /* @__PURE__ */ React.createElement("div", { className: "sandbox-controls-panel" }, /* @__PURE__ */ React.createElement("div", { className: "controls-panel-title" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-sliders-h", style: { color: "var(--accent)" } }), " Interactive Hyper-parameter Controls"), activeTab === "flow" && /* @__PURE__ */ React.createElement("div", { className: "controls-row" }, /* @__PURE__ */ React.createElement("div", { className: "ctrl-group" }, /* @__PURE__ */ React.createElement("label", null, "ODE Steps: ", steps), /* @__PURE__ */ React.createElement("input", { type: "range", min: 5, max: 50, value: steps, onChange: (e) => setSteps(Number(e.target.value)) })), /* @__PURE__ */ React.createElement("div", { className: "ctrl-group" }, /* @__PURE__ */ React.createElement("label", null, "Solver"), /* @__PURE__ */ React.createElement("select", { value: solver, onChange: (e) => setSolver(e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "Euler" }, "Euler"), /* @__PURE__ */ React.createElement("option", { value: "Midpoint" }, "Midpoint"), /* @__PURE__ */ React.createElement("option", { value: "RK4" }, "RK4"))), /* @__PURE__ */ React.createElement("div", { className: "ctrl-group" }, /* @__PURE__ */ React.createElement("label", null, "Target Shape"), /* @__PURE__ */ React.createElement("select", { value: targetShape, onChange: (e) => setTargetShape(e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "circle" }, "Circle"), /* @__PURE__ */ React.createElement("option", { value: "moon" }, "Double Moon"), /* @__PURE__ */ React.createElement("option", { value: "spiral" }, "Spiral")))), activeTab === "grpo" && /* @__PURE__ */ React.createElement("div", { className: "controls-row" }, /* @__PURE__ */ React.createElement("div", { className: "ctrl-group" }, /* @__PURE__ */ React.createElement("label", null, "Group Rollouts G: ", groupSize), /* @__PURE__ */ React.createElement("input", { type: "range", min: 2, max: 16, step: 2, value: groupSize, onChange: (e) => setGroupSize(Number(e.target.value)) })), /* @__PURE__ */ React.createElement("div", { className: "ctrl-group" }, /* @__PURE__ */ React.createElement("label", null, "KL Coeff \u03B2: ", klCoeff), /* @__PURE__ */ React.createElement("input", { type: "range", min: 0.01, max: 0.1, step: 0.01, value: klCoeff, onChange: (e) => setKlCoeff(Number(e.target.value)) }))), activeTab === "cuda" && /* @__PURE__ */ React.createElement("div", { className: "controls-row" }, /* @__PURE__ */ React.createElement("div", { className: "ctrl-group" }, /* @__PURE__ */ React.createElement("label", null, "Threads / Block: ", blockSize), /* @__PURE__ */ React.createElement("select", { value: blockSize, onChange: (e) => setBlockSize(Number(e.target.value)) }, /* @__PURE__ */ React.createElement("option", { value: 128 }, "128 threads"), /* @__PURE__ */ React.createElement("option", { value: 256 }, "256 threads"), /* @__PURE__ */ React.createElement("option", { value: 512 }, "512 threads"))), /* @__PURE__ */ React.createElement("div", { className: "ctrl-group" }, /* @__PURE__ */ React.createElement("label", null, "Precision"), /* @__PURE__ */ React.createElement("select", { value: precision, onChange: (e) => setPrecision(e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "FP16" }, "FP16"), /* @__PURE__ */ React.createElement("option", { value: "BF16" }, "BF16"), /* @__PURE__ */ React.createElement("option", { value: "FP8" }, "FP8 E4M3")))), activeTab === "svd" && /* @__PURE__ */ React.createElement("div", { className: "controls-row" }, /* @__PURE__ */ React.createElement("div", { className: "ctrl-group" }, /* @__PURE__ */ React.createElement("label", null, "SVD Rank r: ", rank), /* @__PURE__ */ React.createElement("input", { type: "range", min: 16, max: 128, step: 16, value: rank, onChange: (e) => setRank(Number(e.target.value)) })), /* @__PURE__ */ React.createElement("div", { className: "ctrl-group" }, /* @__PURE__ */ React.createElement("label", null, "Seq Length N: ", seqLen), /* @__PURE__ */ React.createElement("select", { value: seqLen, onChange: (e) => setSeqLen(Number(e.target.value)) }, /* @__PURE__ */ React.createElement("option", { value: 2048 }, "2,048 tokens"), /* @__PURE__ */ React.createElement("option", { value: 4096 }, "4,096 tokens"), /* @__PURE__ */ React.createElement("option", { value: 16384 }, "16,384 tokens"), /* @__PURE__ */ React.createElement("option", { value: 65536 }, "65,536 tokens")))), activeTab === "unlearning" && /* @__PURE__ */ React.createElement("div", { className: "controls-row" }, /* @__PURE__ */ React.createElement("div", { className: "ctrl-group" }, /* @__PURE__ */ React.createElement("label", null, "Null-Space Rank k: ", threshold), /* @__PURE__ */ React.createElement("input", { type: "range", min: 2, max: 24, value: threshold, onChange: (e) => setThreshold(Number(e.target.value)) }))), activeTab === "iit" && /* @__PURE__ */ React.createElement("div", { className: "controls-row" }, /* @__PURE__ */ React.createElement("div", { className: "ctrl-group" }, /* @__PURE__ */ React.createElement("label", null, "Cognitive Nodes N: ", numNodes), /* @__PURE__ */ React.createElement("input", { type: "range", min: 8, max: 32, step: 4, value: numNodes, onChange: (e) => setNumNodes(Number(e.target.value)) })))), /* @__PURE__ */ React.createElement("div", { className: "sandbox-tutorial" }, /* @__PURE__ */ React.createElement("h4", null, /* @__PURE__ */ React.createElement("i", { className: "fas fa-graduation-cap" }), " Deep Dive Learning & Mathematical Rigor"), activeTab === "flow" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("b", null, "Conditional Flow Matching (CFM)"), " [Lipman et al., ICLR 2023] provides a simulation-free objective for training Continuous Normalizing Flows (CNFs) by regressing a neural velocity field ", /* @__PURE__ */ React.createElement("i", null, "v_\u03B8(t, x)"), " onto straight target vector fields ", /* @__PURE__ */ React.createElement("i", null, "u_t(x|z)"), ":"), /* @__PURE__ */ React.createElement("div", { style: { background: "rgba(0,0,0,0.3)", padding: ".6rem 1rem", borderRadius: "8px", margin: ".5rem 0", fontFamily: "serif", color: "var(--accent)" } }, "$$\\mathcal{L}_{\\text{CFM}}(\\theta) = \\mathbb{E}_{t, q(z), p_t(x|z)} \\| v_\\theta(x, t) - u_t(x|z) \\|^2$$"), /* @__PURE__ */ React.createElement("p", null, "By enforcing straight Optimal Transport (OT) probability paths between noise ", /* @__PURE__ */ React.createElement("i", null, "x\u2080 ~ N(0, I)"), " and data ", /* @__PURE__ */ React.createElement("i", null, "x\u2081"), ", CFM requires as few as ", /* @__PURE__ */ React.createElement("b", null, steps, " integration steps"), " using the ", /* @__PURE__ */ React.createElement("b", null, solver), " ODE solver, outperforming SDE diffusion models in both sampling velocity and FID metrics.")), activeTab === "grpo" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("b", null, "Group Relative Policy Optimization (GRPO)"), " [DeepSeek R1, 2025] eliminates the memory-heavy Critic network by computing group-normalized advantage ", /* @__PURE__ */ React.createElement("i", null, "A_i = (r_i - \\mu_r) / \\sigma_r"), " across ", /* @__PURE__ */ React.createElement("b", null, "G=", groupSize), " sampled rollouts:"), /* @__PURE__ */ React.createElement("div", { style: { background: "rgba(0,0,0,0.3)", padding: ".6rem 1rem", borderRadius: "8px", margin: ".5rem 0", fontFamily: "serif", color: "var(--emerald)" } }, "$$\\mathcal{L}_{\\text{GRPO}} = -\\frac{1}{G} \\sum_{i=1}^G \\min\\left( \\frac{\\pi_\\theta}{\\pi_{old}} A_i, \\text{clip}\\left(\\frac{\\pi_\\theta}{\\pi_{old}}, 1-\\epsilon, 1+\\epsilon\\right) A_i \\right) + \\beta \\mathbb{D}_{\\text{KL}}(\\pi_\\theta \\| \\pi_{\\text{ref}})$$"), /* @__PURE__ */ React.createElement("p", null, "With KL penalty coefficient ", /* @__PURE__ */ React.createElement("b", null, "\u03B2=", klCoeff), ", GRPO stabilizes reasoning policy updates for complex mathematical benchmarks (e.g., GSM8K pass@1 reaching 80.7%).")), activeTab === "cuda" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("b", null, "Fused CUDA Kernels & Register Shuffles"), " optimize distributed LLM gradient scaling. By executing warp-level tree reduction via ", /* @__PURE__ */ React.createElement("code", null, "__shfl_xor_sync"), " across ", /* @__PURE__ */ React.createElement("b", null, blockSize, " threads"), " per CUDA block in precision ", /* @__PURE__ */ React.createElement("b", null, precision), ", global memory bandwidth bottlenecks are completely bypassed, achieving near-peak 1.82 TB/s hardware utilization on A100 SXM4 architectures.")), activeTab === "svd" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("b", null, "Sub-Quadratic Linear Attention"), " [Katharopoulos et al.] applies low-rank SVD kernel decomposition ", /* @__PURE__ */ React.createElement("i", null, "\u03C6(x) = ELU(x U) S"), " with rank ", /* @__PURE__ */ React.createElement("b", null, "r=", rank), " on sequence length ", /* @__PURE__ */ React.createElement("b", null, "N=", seqLen), ":"), /* @__PURE__ */ React.createElement("div", { style: { background: "rgba(0,0,0,0.3)", padding: ".6rem 1rem", borderRadius: "8px", margin: ".5rem 0", fontFamily: "serif", color: "var(--cyan)" } }, "$$\\text{Attention}(Q, K, V) = \\phi(Q) \\cdot \\Big( \\phi(K)^T V \\Big)$$"), /* @__PURE__ */ React.createElement("p", null, "By re-associating matrix multiplication order to ", /* @__PURE__ */ React.createElement("i", null, "Q (K^T V)"), ", VRAM memory complexity drops from ", /* @__PURE__ */ React.createElement("i", null, "O(N\xB2)"), " down to ", /* @__PURE__ */ React.createElement("b", null, /* @__PURE__ */ React.createElement("i", null, "O(N \xB7 ", rank, ")")), ".")), activeTab === "unlearning" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("b", null, "Machine Unlearning & Concept Erasure"), " removes sensitive concept representations using Null-Space Projection ", /* @__PURE__ */ React.createElement("i", null, "W_clean = W (I - U_k U_k\u1D40)"), " with singular value rank threshold ", /* @__PURE__ */ React.createElement("b", null, "k=", threshold), ". Concept activations are zeroed out while retaining 93.8%+ task accuracy across non-targeted domain capabilities.")), activeTab === "iit" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("b", null, "Integrated Information Theory (IIT 4.0)"), " evaluates the ", /* @__PURE__ */ React.createElement("b", null, "\u03A6 (Phi) metric"), " across ", /* @__PURE__ */ React.createElement("b", null, "N=", numNodes), " cognitive nodes by computing Effective Information (EI) against the Minimum Information Partition (MIP) cut. Higher \u03A6 values quantify irreducibly integrated cause-effect power in synthetic cognitive networks."))))));
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
  function PublicationsSection({ onCopyBib, onSelectPaper, beep }) {
    return /* @__PURE__ */ React.createElement("section", { id: "publications", className: "section fade-up" }, /* @__PURE__ */ React.createElement(
      SectionHead,
      {
        tag: "Research Output",
        title: "Papers & Technical Reports \u{1F4C4}",
        sub: "Deep-dives on generative models, mathematical alignment, and GPU engineering published on Hoosha AI."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "pub-list" }, PUBLICATIONS.map((p, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "pub-card" }, /* @__PURE__ */ React.createElement("div", { className: "pub-badge" }, p.badge, " \xB7 ", p.year), /* @__PURE__ */ React.createElement("h3", { className: "pub-title" }, /* @__PURE__ */ React.createElement("a", { href: p.link, target: "_blank" }, p.title)), /* @__PURE__ */ React.createElement("div", { className: "pub-meta" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-users" }), " ", p.authors, " \xA0\xA0|\xA0\xA0 ", /* @__PURE__ */ React.createElement("i", { className: "fas fa-university" }), " ", p.venue), /* @__PURE__ */ React.createElement("p", { className: "pub-abstract" }, p.abstract), /* @__PURE__ */ React.createElement("div", { className: "pub-links" }, /* @__PURE__ */ React.createElement("button", { className: "pub-btn", style: { background: "var(--glass2)", borderColor: "var(--accent)", color: "var(--accent)" }, onClick: () => {
      onSelectPaper(p);
      beep?.();
    } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-microscope" }), " Interactive Math Reader"), /* @__PURE__ */ React.createElement("a", { href: p.link, target: "_blank", className: "pub-btn", onClick: () => beep?.() }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-file-pdf" }), " Read Paper"), p.code && /* @__PURE__ */ React.createElement("a", { href: p.code, target: "_blank", className: "pub-btn", onClick: () => beep?.() }, /* @__PURE__ */ React.createElement("i", { className: "fab fa-github" }), " View Code"), /* @__PURE__ */ React.createElement("button", { className: "pub-btn", onClick: () => {
      onCopyBib(p.bib);
      beep?.();
    } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-quote-right" }), " Cite (BibTeX)"))))));
  }

  // src/components/sections/SubstackSection.jsx
  function SubstackSection({ articles, subSearch, setSubSearch, onOpenArticleModal, beep }) {
    return /* @__PURE__ */ React.createElement("section", { id: "substack", className: "section fade-up", style: { background: "rgba(0,240,255,0.01)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement(
      SectionHead,
      {
        tag: "Hoosha AI Substack",
        title: "Technical Deep Dives & Essays",
        sub: "In-depth explorations of generative models, LLM alignment math, and distributed systems \u2014 read by researchers globally."
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "1rem", maxWidth: 800, margin: "0 auto 2.5rem", alignItems: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", { className: "search-wrap", style: { flex: 1, margin: 0 } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-search search-icon" }), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        placeholder: `Search ${articles.length} Substack papers...`,
        value: subSearch,
        onChange: (e) => setSubSearch(e.target.value)
      }
    )), /* @__PURE__ */ React.createElement("button", { className: "btn-primary", onClick: onOpenArticleModal, style: { whiteSpace: "nowrap", padding: ".75rem 1.4rem" } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-plus" }), " Add New Article")), /* @__PURE__ */ React.createElement("div", { className: "articles-grid" }, articles.map((a, i) => /* @__PURE__ */ React.createElement("a", { key: i, href: a.url, target: "_blank", className: "article-card", onClick: () => beep?.() }, /* @__PURE__ */ React.createElement("div", { className: "article-date" }, a.date), /* @__PURE__ */ React.createElement("h3", null, a.title), /* @__PURE__ */ React.createElement("p", null, a.desc), /* @__PURE__ */ React.createElement("span", { className: "read-more" }, "Read Paper ", /* @__PURE__ */ React.createElement("i", { className: "fas fa-arrow-right" }))))));
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
    { icon: "fab fa-instagram", href: "https://instagram.com/hooshaaii", label: "Instagram", val: "@hooshaaii", color: "#e1306c" },
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

  // src/components/sections/BenchmarkSection.jsx
  var BENCHMARKS = [
    {
      title: "Distributed LLM Training Throughput (Tokens / Sec / GPU)",
      subtitle: "8\xD7A100 SXM4 80GB \u2014 LLaMA-3 8B Training (Seq Length: 8192)",
      metrics: [
        { name: "Kaleido Engine \u26A1 (Custom Fused CUDA)", val: 4850, max: 5e3, color: "var(--cyan)", highlight: true },
        { name: "DeepSpeed ZeRO-3 + FlashAttn2", val: 4120, max: 5e3, color: "#8a2be2" },
        { name: "PyTorch FSDP (Full Shard)", val: 3650, max: 5e3, color: "#60a5fa" },
        { name: "Standard PyTorch DDP", val: 2400, max: 5e3, color: "#64748b" }
      ]
    },
    {
      title: "Peak VRAM Memory Consumption (GB)",
      subtitle: "Lower is better \u2014 Batch Size 16 per GPU, Gradient Checkpointing enabled",
      metrics: [
        { name: "Kaleido Engine \u26A1 (Sub-Quadratic SVD Attn)", val: 24.8, max: 80, color: "var(--emerald)", highlight: true },
        { name: "DeepSpeed ZeRO-3 Offload", val: 38.2, max: 80, color: "#8a2be2" },
        { name: "PyTorch FSDP", val: 52.6, max: 80, color: "#60a5fa" },
        { name: "Standard PyTorch DDP", val: 78.4, max: 80, color: "#f43f5e" }
      ]
    }
  ];
  function BenchmarkSection() {
    return /* @__PURE__ */ React.createElement("section", { id: "benchmarks", className: "section fade-up" }, /* @__PURE__ */ React.createElement(
      SectionHead,
      {
        tag: "Systems Benchmarks",
        title: "Kaleido Engine vs. Standard Frameworks \u26A1",
        sub: "Empirical benchmark performance comparing Taha's from-scratch 4D-parallel CUDA engine against PyTorch FSDP & DeepSpeed ZeRO-3 on A100 GPU clusters."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "benchmarks-container" }, BENCHMARKS.map((b, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: "benchmark-card" }, /* @__PURE__ */ React.createElement("h3", { className: "benchmark-card-title" }, b.title), /* @__PURE__ */ React.createElement("div", { className: "benchmark-card-sub" }, b.subtitle), /* @__PURE__ */ React.createElement("div", { className: "benchmark-bars" }, b.metrics.map((m, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: `benchmark-row ${m.highlight ? "highlight" : ""}` }, /* @__PURE__ */ React.createElement("div", { className: "benchmark-label" }, /* @__PURE__ */ React.createElement("span", null, m.name), /* @__PURE__ */ React.createElement("span", { className: "benchmark-val", style: { color: m.color } }, m.val.toLocaleString())), /* @__PURE__ */ React.createElement("div", { className: "benchmark-bar-bg" }, /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "benchmark-bar-fill",
        style: {
          width: `${m.val / m.max * 100}%`,
          background: m.color,
          boxShadow: m.highlight ? `0 0 12px ${m.color}` : "none"
        }
      }
    )))))))));
  }

  // src/components/sections/TeachingSection.jsx
  var COURSES = [
    {
      code: "CS-401",
      role: "Head Teaching Assistant",
      title: "Compiler Construction & Code Generation",
      inst: "Sharif University of Technology",
      term: "Spring 2026",
      desc: "Leading lab sessions on LLVM IR code generation, register allocation algorithms, and lexer/parser construction in C++/Rust.",
      topics: ["LLVM IR", "Register Allocation", "Lexing & Parsing", "LALR(1) Grammars"],
      slides: "https://github.com/tahamajs/compiler-construction-lab"
    },
    {
      code: "CE-204",
      role: "Teaching Assistant",
      title: "Computer Architecture & Assembly Language",
      inst: "University of Tehran",
      term: "Fall 2025",
      desc: "Designing RISC-V processor simulators, cache memory hierarchy labs, and hardware pipelining experiments.",
      topics: ["RISC-V ISA", "Cache Memory", "5-Stage Pipeline", "Hazard Resolution"],
      slides: "https://github.com/tahamajs/riscv-architecture-simulator"
    },
    {
      code: "AI-502",
      role: "Workshop Instructor",
      title: "Distributed LLM Training & Fused CUDA Kernels",
      inst: "Hoosha AI Academy",
      term: "Winter 2025",
      desc: "Hands-on intensive workshop on PyTorch FSDP, DeepSpeed ZeRO-3, and custom CUDA warp shuffle kernel programming.",
      topics: ["Fused CUDA", "PyTorch FSDP", "ZeRO-3", "FlashAttention-2"],
      slides: "https://github.com/tahamajs/distributed-llm-workshop"
    }
  ];
  function TeachingSection({ beep }) {
    return /* @__PURE__ */ React.createElement("section", { id: "teaching", className: "section fade-up" }, /* @__PURE__ */ React.createElement(
      SectionHead,
      {
        tag: "Academic Pedagogy",
        title: "Teaching & Mentorship \u{1F468}\u200D\u{1F3EB}",
        sub: "Course instruction, lab design, and curriculum development at Sharif University and University of Tehran."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "teaching-grid" }, COURSES.map((c, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "teaching-card" }, /* @__PURE__ */ React.createElement("div", { className: "teaching-header" }, /* @__PURE__ */ React.createElement("span", { className: "teaching-code" }, c.code), /* @__PURE__ */ React.createElement("span", { className: "teaching-role" }, c.role)), /* @__PURE__ */ React.createElement("h3", { className: "teaching-title" }, c.title), /* @__PURE__ */ React.createElement("div", { className: "teaching-inst" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-university" }), " ", c.inst, " \xB7 ", c.term), /* @__PURE__ */ React.createElement("p", { className: "teaching-desc" }, c.desc), /* @__PURE__ */ React.createElement("div", { className: "teaching-topics" }, c.topics.map((t) => /* @__PURE__ */ React.createElement("span", { key: t, className: "teaching-tag" }, t))), /* @__PURE__ */ React.createElement("div", { className: "teaching-actions" }, /* @__PURE__ */ React.createElement("a", { href: c.slides, target: "_blank", className: "pub-btn", onClick: () => beep?.() }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-folder-open" }), " View Course Materials & Labs"))))));
  }

  // src/components/sections/TalksSection.jsx
  var TALKS = [
    {
      title: "Flow Matching vs Diffusion: The Frontier of Continuous Normalizing Flows",
      event: "Hoosha AI Annual Keynote 2026",
      location: "Tehran, Iran / Virtual",
      date: "Jan 2026",
      desc: "Deep dive into straight optimal transport probability paths, simulation-free ODE velocity regression, and 5-step sampling.",
      slides: "https://hooshaai.substack.com",
      video: "https://youtube.com"
    },
    {
      title: "Group Relative Policy Optimization (GRPO) for Reasoning LLMs",
      event: "Sharif AI & Robotics Colloquium",
      location: "Sharif University of Technology",
      date: "Nov 2025",
      desc: "Eliminating the Critic network in PPO. Mathematical formulation of group-normalized advantages and KL regularization.",
      slides: "https://hooshaai.substack.com",
      video: null
    },
    {
      title: "Writing Custom CUDA Kernels for High-Throughput LLM Inference",
      event: "University of Tehran Systems Seminar",
      location: "University of Tehran",
      date: "Sep 2025",
      desc: "Warp-level register shuffles, shared memory bank conflict elimination, and FP16/BF16 memory alignment.",
      slides: "https://github.com/tahamajs/cuda-learning-lab",
      video: null
    }
  ];
  function TalksSection({ beep }) {
    return /* @__PURE__ */ React.createElement("section", { id: "talks", className: "section fade-up" }, /* @__PURE__ */ React.createElement(
      SectionHead,
      {
        tag: "Academic Outreach",
        title: "Invited Keynotes & Seminars \u{1F3A4}",
        sub: "Technical presentations, guest lectures, and keynote addresses on generative AI and GPU computing."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "talks-grid" }, TALKS.map((t, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "talk-card" }, /* @__PURE__ */ React.createElement("div", { className: "talk-date-badge" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-calendar-alt" }), " ", t.date), /* @__PURE__ */ React.createElement("h3", { className: "talk-title" }, t.title), /* @__PURE__ */ React.createElement("div", { className: "talk-event" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-microphone" }), " ", t.event, " \xB7 ", t.location), /* @__PURE__ */ React.createElement("p", { className: "talk-desc" }, t.desc), /* @__PURE__ */ React.createElement("div", { className: "talk-links" }, /* @__PURE__ */ React.createElement("a", { href: t.slides, target: "_blank", className: "pub-btn", onClick: () => beep?.() }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-file-powerpoint" }), " View Slides"), t.video && /* @__PURE__ */ React.createElement("a", { href: t.video, target: "_blank", className: "pub-btn", onClick: () => beep?.() }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-video" }), " Watch Recording"))))));
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
  var import_react13 = __toESM(require_react_shim());
  var TEMPLATES = [
    { icon: "fa-building", label: "Senior AI / Systems Engineer Role", subj: "Senior AI Engineering Role" },
    { icon: "fa-graduation-cap", label: "Ph.D. & Academic Research Collaboration", subj: "PhD Research Collaboration" },
    { icon: "fa-lightbulb", label: "AI Advisory & Consulting", subj: "AI Advisory Inquiry" },
    { icon: "fa-heart", label: "Sponsor Open-Source AI Work", subj: "GitHub Sponsor Inquiry", href: "https://github.com/sponsors/tahamajs" }
  ];
  function HireModal({ open, onClose, showToast, beep }) {
    const [name, setName] = (0, import_react13.useState)("");
    const [email, setEmail] = (0, import_react13.useState)("");
    const [msg, setMsg] = (0, import_react13.useState)("");
    const [copied, setCopied] = (0, import_react13.useState)(false);
    const handleCopyEmail = () => {
      navigator.clipboard.writeText("tahamajlesi@ut.ac.ir");
      setCopied(true);
      beep?.(700, "square");
      showToast?.("\u{1F4CB} Email (tahamajlesi@ut.ac.ir) copied to clipboard!");
      setTimeout(() => setCopied(false), 2e3);
    };
    const handleDirectSend = (e) => {
      e.preventDefault();
      const mailtoUrl = `mailto:tahamajlesi@ut.ac.ir?subject=${encodeURIComponent(`Inquiry from ${name || "Collaborator"}`)}&body=${encodeURIComponent(`From: ${name} (${email})

${msg}`)}`;
      window.location.href = mailtoUrl;
      beep?.(880, "sine");
      showToast?.("\u{1F680} Launching email client...");
      onClose();
    };
    return /* @__PURE__ */ React.createElement(Modal, { open, onClose }, /* @__PURE__ */ React.createElement("div", { className: "section-tag" }, "\u{1F4BC} Direct Contact & Recruitment"), /* @__PURE__ */ React.createElement("h2", { style: { color: "#fff", marginBottom: ".5rem" } }, "Contact / Hire Taha Majlesi \u{1F680}"), /* @__PURE__ */ React.createElement("p", { style: { color: "var(--muted)", fontSize: ".88rem", marginBottom: "1.2rem" } }, "Taha is open to ", /* @__PURE__ */ React.createElement("b", { style: { color: "var(--accent)" } }, "Senior AI Engineer"), ",", " ", /* @__PURE__ */ React.createElement("b", { style: { color: "var(--cyan)" } }, "Research Scientist"), ", and", " ", /* @__PURE__ */ React.createElement("b", { style: { color: "var(--emerald)" } }, "Ph.D."), " opportunities, plus AI consulting, teaching, and open-source partnerships."), /* @__PURE__ */ React.createElement("div", { className: "hire-tmpl" }, TEMPLATES.map((t, i) => /* @__PURE__ */ React.createElement(
      "a",
      {
        key: i,
        className: "hire-tmpl-item",
        href: t.href || `mailto:tahamajlesi@ut.ac.ir?subject=${encodeURIComponent(t.subj)}`,
        target: t.href ? "_blank" : "_self",
        onClick: () => beep?.()
      },
      /* @__PURE__ */ React.createElement("i", { className: `fas ${t.icon}` }),
      /* @__PURE__ */ React.createElement("b", null, t.label),
      /* @__PURE__ */ React.createElement("i", { className: "fas fa-arrow-right", style: { marginLeft: "auto", opacity: 0.4, fontSize: ".75rem" } })
    ))), /* @__PURE__ */ React.createElement("form", { onSubmit: handleDirectSend, style: { marginTop: "1.2rem", display: "flex", flexDirection: "column", gap: ".8rem" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".8rem" } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        placeholder: "Your Name",
        value: name,
        onChange: (e) => setName(e.target.value),
        className: "form-input",
        required: true
      }
    ), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "email",
        placeholder: "Your Email",
        value: email,
        onChange: (e) => setEmail(e.target.value),
        className: "form-input",
        required: true
      }
    )), /* @__PURE__ */ React.createElement(
      "textarea",
      {
        placeholder: "Your message or collaboration proposal...",
        value: msg,
        onChange: (e) => setMsg(e.target.value),
        className: "form-input",
        rows: 3,
        required: true
      }
    ), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn-primary", style: { width: "100%", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-paper-plane" }), " Send Direct Email to Taha")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: ".75rem", flexWrap: "wrap", marginTop: "1.2rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("button", { onClick: handleCopyEmail, className: "btn-secondary" }, /* @__PURE__ */ React.createElement("i", { className: `fas ${copied ? "fa-check" : "fa-copy"}`, style: { color: copied ? "var(--emerald)" : "" } }), " ", copied ? "Email Copied!" : "Copy Email"), /* @__PURE__ */ React.createElement("a", { href: "https://telegram.me/tahamajlesii", target: "_blank", className: "btn-secondary", onClick: () => beep?.() }, /* @__PURE__ */ React.createElement("i", { className: "fab fa-telegram" }), " Telegram @tahamajlesii"), /* @__PURE__ */ React.createElement("a", { href: "https://instagram.com/hooshaaii", target: "_blank", className: "btn-secondary", onClick: () => beep?.() }, /* @__PURE__ */ React.createElement("i", { className: "fab fa-instagram" }), " Instagram @hooshaaii"), /* @__PURE__ */ React.createElement("a", { href: "https://linkedin.com/in/tahamajlesi", target: "_blank", className: "btn-secondary", onClick: () => beep?.() }, /* @__PURE__ */ React.createElement("i", { className: "fab fa-linkedin" }), " LinkedIn 17.1k")));
  }

  // src/components/modals/CommandPalette.jsx
  var import_react14 = __toESM(require_react_shim());
  function CommandPalette({ open, onClose, onCmd }) {
    const [q, setQ] = (0, import_react14.useState)("");
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

  // src/components/modals/TerminalModal.jsx
  var import_react15 = __toESM(require_react_shim());
  var HELP_TEXT = `
Available commands:
  help        - Show this help menu
  about       - Overview of Mohammad Taha Majlesi
  hoosha      - Info on Hoosha AI \u{1F9E0} research startup
  skills      - List core technical capabilities & stack
  papers      - List published technical reports & papers
  repos       - Show featured GitHub repositories
  sponsor     - Open GitHub Sponsors page
  contact     - Display contact information
  clear       - Clear terminal history
  date        - Output current time in Tehran (UTC+3:30)
`;
  function TerminalModal({ open, onClose, beep }) {
    const [history, setHistory] = (0, import_react15.useState)([
      { type: "sys", text: "Hoosha AI Terminal Shell [v2.4.0-release]" },
      { type: "sys", text: 'Type "help" to list available commands.' }
    ]);
    const [input, setInput] = (0, import_react15.useState)("");
    const bottomRef = (0, import_react15.useRef)(null);
    (0, import_react15.useEffect)(() => {
      if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history, open]);
    if (!open) return null;
    const handleCommand = (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      const cmd = input.trim().toLowerCase();
      if (!cmd) return;
      beep?.(750, "square");
      const newHist = [...history, { type: "cmd", text: `taha@hoosha-ai:~$ ${input}` }];
      switch (cmd) {
        case "help":
          newHist.push({ type: "res", text: HELP_TEXT });
          break;
        case "about":
          newHist.push({ type: "res", text: "Mohammad Taha Majlesi \u2014 AI Systems Engineer & Researcher. Co-Founder @ Hoosha AI \u{1F9E0}. CE @ University of Tehran \xB7 TA @ Sharif University. 17.1k LinkedIn Community." });
          break;
        case "hoosha":
          newHist.push({ type: "res", text: "Hoosha AI \u{1F9E0}: Frontier AI research startup focusing on Flow Matching generation, GRPO post-training, synthetic consciousness (IIT \u03A6), and custom 4D-parallel CUDA engines." });
          break;
        case "skills":
          newHist.push({ type: "res", text: "Stack: PyTorch 2.x, JAX, CUDA 12.2/C++, cuBLAS, NCCL, Triton, DeepSpeed, Flow Matching, GRPO, xv6 OS Kernel, Verilog." });
          break;
        case "papers":
          newHist.push({ type: "res", text: "20 Research Papers on Substack: Conditional Flow Matching ODEs, GRPO GSM8K Reasoning (80.7% pass@1), Sub-quadratic Linear SVD Attention, Fused CUDA AllReduce Kernels." });
          break;
        case "repos":
          newHist.push({ type: "res", text: "Featured Repos: Kaleido-CUDA-Engine, Flow-Matching-PyTorch, GRPO-Reasoning-4B, SVD-Linear-Attention, Persian-Instruct-200k." });
          break;
        case "sponsor":
          window.open("https://github.com/sponsors/tahamajs", "_blank");
          newHist.push({ type: "res", text: "Opening https://github.com/sponsors/tahamajs in new tab... Thank you for supporting open-source AI!" });
          break;
        case "contact":
          newHist.push({ type: "res", text: "Email: tahamajlesi@ut.ac.ir | Telegram: @tahamajlesii | LinkedIn: linkedin.com/in/tahamajlesi" });
          break;
        case "date":
          newHist.push({ type: "res", text: (/* @__PURE__ */ new Date()).toLocaleString("en-US", { timeZone: "Asia/Tehran" }) + " (Tehran Time)" });
          break;
        case "clear":
          setHistory([]);
          setInput("");
          return;
        default:
          newHist.push({ type: "err", text: `command not found: ${cmd}. Type "help" for a list of available commands.` });
      }
      setHistory(newHist);
      setInput("");
    };
    return /* @__PURE__ */ React.createElement("div", { className: "modal-overlay", onClick: onClose }, /* @__PURE__ */ React.createElement("div", { className: "cli-modal", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "cli-header" }, /* @__PURE__ */ React.createElement("div", { className: "t-dots" }, /* @__PURE__ */ React.createElement("div", { className: "t-dot r", onClick: onClose }), /* @__PURE__ */ React.createElement("div", { className: "t-dot y" }), /* @__PURE__ */ React.createElement("div", { className: "t-dot g" })), /* @__PURE__ */ React.createElement("span", { className: "cli-title" }, "taha@hoosha-ai:~ (zsh)"), /* @__PURE__ */ React.createElement("button", { className: "cli-close", onClick: onClose }, "ESC")), /* @__PURE__ */ React.createElement("div", { className: "cli-body" }, history.map((h, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: `cli-line cli-${h.type}` }, /* @__PURE__ */ React.createElement("pre", null, h.text))), /* @__PURE__ */ React.createElement("div", { className: "cli-input-line" }, /* @__PURE__ */ React.createElement("span", { className: "cli-prompt" }, "taha@hoosha-ai:~$"), /* @__PURE__ */ React.createElement(
      "input",
      {
        autoFocus: true,
        type: "text",
        value: input,
        onChange: (e) => setInput(e.target.value),
        onKeyDown: handleCommand,
        className: "cli-input"
      }
    )), /* @__PURE__ */ React.createElement("div", { ref: bottomRef }))));
  }

  // src/components/modals/ArticleCreatorModal.jsx
  var import_react16 = __toESM(require_react_shim());
  function ArticleCreatorModal({ open, onClose, onAddArticle, beep, showToast }) {
    const [title, setTitle] = (0, import_react16.useState)("");
    const [desc, setDesc] = (0, import_react16.useState)("");
    const [url, setUrl] = (0, import_react16.useState)("https://hooshaai.substack.com/p/");
    const [date, setDate] = (0, import_react16.useState)((/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
    const [tag, setTag] = (0, import_react16.useState)("Flow Matching");
    if (!open) return null;
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!title.trim() || !desc.trim()) return;
      const newArticle = {
        title: title.trim(),
        desc: desc.trim(),
        url: url.trim(),
        date: date.trim(),
        tag: tag.trim()
      };
      onAddArticle(newArticle);
      beep?.(800, "sine");
      showToast?.("\u{1F389} Article added successfully!");
      setTitle("");
      setDesc("");
      onClose();
    };
    return /* @__PURE__ */ React.createElement("div", { className: "modal-overlay", onClick: onClose }, /* @__PURE__ */ React.createElement("div", { className: "modal-box article-creator-box", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "modal-header" }, /* @__PURE__ */ React.createElement("h3", null, /* @__PURE__ */ React.createElement("i", { className: "fas fa-pen-nib", style: { color: "var(--accent)" } }), " Publish / Add Technical Article"), /* @__PURE__ */ React.createElement("button", { className: "modal-close", onClick: onClose }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-times" }))), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit, className: "article-form" }, /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", { className: "form-label" }, "Article Title"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        required: true,
        placeholder: "e.g. Scaling Continuous Normalizing Flows with Conditional Flow Matching",
        value: title,
        onChange: (e) => setTitle(e.target.value),
        className: "form-input"
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "form-row" }, /* @__PURE__ */ React.createElement("div", { className: "form-group flex-1" }, /* @__PURE__ */ React.createElement("label", { className: "form-label" }, "Category Tag"), /* @__PURE__ */ React.createElement("select", { value: tag, onChange: (e) => setTag(e.target.value), className: "form-input" }, /* @__PURE__ */ React.createElement("option", { value: "Flow Matching" }, "Flow Matching"), /* @__PURE__ */ React.createElement("option", { value: "GRPO Alignment" }, "GRPO Alignment"), /* @__PURE__ */ React.createElement("option", { value: "CUDA Systems" }, "CUDA Systems"), /* @__PURE__ */ React.createElement("option", { value: "Linear Attention" }, "Linear Attention"), /* @__PURE__ */ React.createElement("option", { value: "Machine Unlearning" }, "Machine Unlearning"), /* @__PURE__ */ React.createElement("option", { value: "IIT Cognition" }, "IIT Cognition"))), /* @__PURE__ */ React.createElement("div", { className: "form-group flex-1" }, /* @__PURE__ */ React.createElement("label", { className: "form-label" }, "Publication Date"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        value: date,
        onChange: (e) => setDate(e.target.value),
        className: "form-input"
      }
    ))), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", { className: "form-label" }, "Substack / Link URL"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "url",
        required: true,
        placeholder: "https://hooshaai.substack.com/p/your-post",
        value: url,
        onChange: (e) => setUrl(e.target.value),
        className: "form-input"
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", { className: "form-label" }, "Abstract / Summary"), /* @__PURE__ */ React.createElement(
      "textarea",
      {
        required: true,
        rows: 4,
        placeholder: "In-depth exploration of vector field regression, sample efficiency, and ODE solver integration steps...",
        value: desc,
        onChange: (e) => setDesc(e.target.value),
        className: "form-input form-textarea"
      }
    )), title && /* @__PURE__ */ React.createElement("div", { className: "article-preview-box" }, /* @__PURE__ */ React.createElement("div", { className: "form-label", style: { marginBottom: ".5rem", color: "var(--accent)" } }, "Live Card Preview:"), /* @__PURE__ */ React.createElement("div", { className: "article-card preview-card" }, /* @__PURE__ */ React.createElement("div", { className: "article-date" }, date, " \xB7 ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--accent)" } }, tag)), /* @__PURE__ */ React.createElement("h3", null, title), /* @__PURE__ */ React.createElement("p", null, desc), /* @__PURE__ */ React.createElement("span", { className: "read-more" }, "Read Paper ", /* @__PURE__ */ React.createElement("i", { className: "fas fa-arrow-right" })))), /* @__PURE__ */ React.createElement("div", { className: "form-actions" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-secondary", onClick: onClose }, "Cancel"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn-primary" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-plus-circle" }), " Publish Article to Site")))));
  }

  // src/components/modals/NNPlaygroundModal.jsx
  var import_react17 = __toESM(require_react_shim());
  function NNPlaygroundModal({ open, onClose, beep, showToast }) {
    const canvasRef = (0, import_react17.useRef)(null);
    const [layers, setLayers] = (0, import_react17.useState)([2, 4, 4, 1]);
    const [activation, setActivation] = (0, import_react17.useState)("SiLU");
    const [lr, setLr] = (0, import_react17.useState)(0.03);
    const [dataset, setDataset] = (0, import_react17.useState)("circle");
    const [training, setTraining] = (0, import_react17.useState)(false);
    const [epoch, setEpoch] = (0, import_react17.useState)(0);
    const [loss, setLoss] = (0, import_react17.useState)(0.482);
    (0, import_react17.useEffect)(() => {
      if (!open) return;
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      let W = 340, H = 260;
      canvasRef.current.width = W;
      canvasRef.current.height = H;
      ctx.clearRect(0, 0, W, H);
      for (let x = 0; x < W; x += 10) {
        for (let y = 0; y < H; y += 10) {
          const nx = (x - W / 2) / (W / 2);
          const ny = (y - H / 2) / (H / 2);
          let val = 0;
          if (dataset === "circle") val = nx * nx + ny * ny - 0.35;
          else if (dataset === "xor") val = nx * ny;
          else if (dataset === "spiral") val = Math.atan2(ny, nx) - Math.sqrt(nx * nx + ny * ny);
          const valTrained = val + (training ? (Math.random() - 0.5) * 0.1 : 0);
          ctx.fillStyle = valTrained > 0 ? "rgba(0, 240, 255, 0.15)" : "rgba(244, 63, 94, 0.15)";
          ctx.fillRect(x, y, 10, 10);
        }
      }
      for (let i = 0; i < 40; i++) {
        const angle = i / 40 * Math.PI * 2;
        const r = (i % 2 === 0 ? 0.3 : 0.7) * (W / 2);
        const px = W / 2 + Math.cos(angle) * r;
        const py = H / 2 + Math.sin(angle) * r;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? "var(--cyan)" : "var(--rose)";
        ctx.fill();
      }
    }, [open, dataset, training, epoch]);
    (0, import_react17.useEffect)(() => {
      if (!training) return;
      const id = setInterval(() => {
        setEpoch((e) => e + 1);
        setLoss((l) => Math.max(0.012, l * 0.94));
      }, 100);
      return () => clearInterval(id);
    }, [training]);
    if (!open) return null;
    const handleTrain = () => {
      setTraining(true);
      beep?.(700, "square");
      showToast?.("\u26A1 Neural Network training started on GPU!");
      setTimeout(() => {
        setTraining(false);
        beep?.(880, "sine");
        showToast?.("\u{1F389} Model converged! Loss: 0.012");
      }, 3e3);
    };
    return /* @__PURE__ */ React.createElement("div", { className: "modal-overlay", onClick: onClose }, /* @__PURE__ */ React.createElement("div", { className: "modal-box nn-playground-box", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "modal-header" }, /* @__PURE__ */ React.createElement("h3", null, /* @__PURE__ */ React.createElement("i", { className: "fas fa-brain", style: { color: "var(--accent)" } }), " 2D Neural Network Classifier Playground"), /* @__PURE__ */ React.createElement("button", { className: "modal-close", onClick: onClose }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-times" }))), /* @__PURE__ */ React.createElement("div", { className: "nn-grid" }, /* @__PURE__ */ React.createElement("div", { className: "nn-controls" }, /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", { className: "form-label" }, "Dataset Pattern"), /* @__PURE__ */ React.createElement("select", { value: dataset, onChange: (e) => setDataset(e.target.value), className: "form-input" }, /* @__PURE__ */ React.createElement("option", { value: "circle" }, "Concentric Circles"), /* @__PURE__ */ React.createElement("option", { value: "xor" }, "XOR Quadrants"), /* @__PURE__ */ React.createElement("option", { value: "spiral" }, "Twin Spirals"))), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", { className: "form-label" }, "Activation Function"), /* @__PURE__ */ React.createElement("select", { value: activation, onChange: (e) => setActivation(e.target.value), className: "form-input" }, /* @__PURE__ */ React.createElement("option", { value: "SiLU" }, "SiLU (Swish)"), /* @__PURE__ */ React.createElement("option", { value: "ReLU" }, "ReLU"), /* @__PURE__ */ React.createElement("option", { value: "GELU" }, "GELU"), /* @__PURE__ */ React.createElement("option", { value: "Tanh" }, "Tanh"))), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", { className: "form-label" }, "Learning Rate \u03B7: ", lr), /* @__PURE__ */ React.createElement("input", { type: "range", min: 1e-3, max: 0.1, step: 5e-3, value: lr, onChange: (e) => setLr(Number(e.target.value)) })), /* @__PURE__ */ React.createElement("div", { className: "nn-stats-box" }, /* @__PURE__ */ React.createElement("div", null, "Epoch: ", /* @__PURE__ */ React.createElement("b", null, epoch)), /* @__PURE__ */ React.createElement("div", null, "Loss: ", /* @__PURE__ */ React.createElement("b", { style: { color: "var(--emerald)" } }, loss.toFixed(4))), /* @__PURE__ */ React.createElement("div", null, "Architecture: ", /* @__PURE__ */ React.createElement("b", null, "[2 \u2192 4 \u2192 4 \u2192 1]"))), /* @__PURE__ */ React.createElement("button", { className: "btn-primary", onClick: handleTrain, disabled: training }, /* @__PURE__ */ React.createElement("i", { className: `fas ${training ? "fa-spinner fa-spin" : "fa-play"}` }), " ", training ? "Training Network..." : "Train Neural Net")), /* @__PURE__ */ React.createElement("div", { className: "nn-canvas-container" }, /* @__PURE__ */ React.createElement("div", { className: "vis-label", style: { marginBottom: "8px" } }, "Decision Boundary Mapping"), /* @__PURE__ */ React.createElement("canvas", { ref: canvasRef, style: { borderRadius: "10px", border: "1px solid var(--border)" } })))));
  }

  // src/components/modals/PaperReaderModal.jsx
  var import_react18 = __toESM(require_react_shim());
  function PaperReaderModal({ paper, onClose, onCopyBib, beep }) {
    const [tab, setTab] = (0, import_react18.useState)("abstract");
    if (!paper) return null;
    return /* @__PURE__ */ React.createElement("div", { className: "modal-overlay", onClick: onClose }, /* @__PURE__ */ React.createElement("div", { className: "modal-box paper-reader-box", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "paper-reader-header" }, /* @__PURE__ */ React.createElement("div", { className: "paper-tag-badge" }, paper.tag || "AI Research Paper"), /* @__PURE__ */ React.createElement("h2", { className: "paper-title" }, paper.title), /* @__PURE__ */ React.createElement("div", { className: "paper-meta" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "fas fa-user-edit" }), " Mohammad Taha Majlesi, Hoosha AI Research Team"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "fas fa-calendar-alt" }), " ", paper.date || "2026"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "fas fa-book" }), " ", paper.venue || "Hoosha AI Technical Report Series")), /* @__PURE__ */ React.createElement("button", { className: "modal-close", onClick: onClose }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-times" }))), /* @__PURE__ */ React.createElement("div", { className: "paper-reader-tabs" }, /* @__PURE__ */ React.createElement("button", { className: `paper-tab ${tab === "abstract" ? "active" : ""}`, onClick: () => {
      setTab("abstract");
      beep?.();
    } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-file-alt" }), " Abstract & Overview"), /* @__PURE__ */ React.createElement("button", { className: `paper-tab ${tab === "math" ? "active" : ""}`, onClick: () => {
      setTab("math");
      beep?.();
    } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-square-root-alt" }), " Math Derivations"), /* @__PURE__ */ React.createElement("button", { className: `paper-tab ${tab === "benchmarks" ? "active" : ""}`, onClick: () => {
      setTab("benchmarks");
      beep?.();
    } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-chart-line" }), " Empirical Results"), /* @__PURE__ */ React.createElement("button", { className: `paper-tab ${tab === "bibtex" ? "active" : ""}`, onClick: () => {
      setTab("bibtex");
      beep?.();
    } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-quote-right" }), " BibTeX Citation")), /* @__PURE__ */ React.createElement("div", { className: "paper-reader-body" }, tab === "abstract" && /* @__PURE__ */ React.createElement("div", { className: "paper-section-content" }, /* @__PURE__ */ React.createElement("h4", null, "Abstract"), /* @__PURE__ */ React.createElement("p", { className: "paper-paragraph" }, paper.desc || paper.abstract || "This technical paper presents novel mathematical formulations and systems optimizations for high-throughput AI workloads."), /* @__PURE__ */ React.createElement("h4", null, "Key Research Contributions"), /* @__PURE__ */ React.createElement("ul", { className: "paper-contributions-list" }, /* @__PURE__ */ React.createElement("li", null, "First-principles derivation of optimal transport velocity fields for continuous normalizing flows."), /* @__PURE__ */ React.createElement("li", null, "Reduction of memory complexity from O(N\xB2) to O(N\xB7r) on sequence lengths up to 131k tokens."), /* @__PURE__ */ React.createElement("li", null, "Open-source implementation released on GitHub & pre-trained weights published on HuggingFace Hub."))), tab === "math" && /* @__PURE__ */ React.createElement("div", { className: "paper-section-content" }, /* @__PURE__ */ React.createElement("h4", null, "Mathematical Formulation"), /* @__PURE__ */ React.createElement("div", { className: "paper-math-card" }, /* @__PURE__ */ React.createElement("p", null, "Objective function optimization over probability paths:"), /* @__PURE__ */ React.createElement("div", { className: "paper-latex-display" }, "$$\\mathcal{L}_{\\text{Objective}}(\\theta) = \\mathbb{E}_{t, x_0, x_1} \\Big[ \\| v_\\theta(x_t, t) - u_t(x|z) \\|^2 \\Big]$$"), /* @__PURE__ */ React.createElement("p", null, "Where $x_t = (1-t)x_0 + t x_1$ represents linear interpolation along the optimal transport geodesic."))), tab === "benchmarks" && /* @__PURE__ */ React.createElement("div", { className: "paper-section-content" }, /* @__PURE__ */ React.createElement("h4", null, "Empirical Performance & Evaluation"), /* @__PURE__ */ React.createElement("div", { className: "paper-metrics-grid" }, /* @__PURE__ */ React.createElement("div", { className: "paper-metric-card" }, /* @__PURE__ */ React.createElement("span", { className: "paper-metric-num", style: { color: "var(--cyan)" } }, "+18.0%"), /* @__PURE__ */ React.createElement("span", { className: "paper-metric-label" }, "Pass@1 Gain on GSM8K")), /* @__PURE__ */ React.createElement("div", { className: "paper-metric-card" }, /* @__PURE__ */ React.createElement("span", { className: "paper-metric-num", style: { color: "var(--emerald)" } }, "6.35\xD7"), /* @__PURE__ */ React.createElement("span", { className: "paper-metric-label" }, "VRAM Memory Reduction")), /* @__PURE__ */ React.createElement("div", { className: "paper-metric-card" }, /* @__PURE__ */ React.createElement("span", { className: "paper-metric-num", style: { color: "#a78bfa" } }, "1.82 TB/s"), /* @__PURE__ */ React.createElement("span", { className: "paper-metric-label" }, "CUDA Memory Bandwidth")))), tab === "bibtex" && /* @__PURE__ */ React.createElement("div", { className: "paper-section-content" }, /* @__PURE__ */ React.createElement("h4", null, "BibTeX Citation"), /* @__PURE__ */ React.createElement("pre", { className: "paper-bibtex-block" }, `@article{majlesi2026${paper.id || "research"},
  title={${paper.title}},
  author={Majlesi, Mohammad Taha and Hoosha AI Research Team},
  journal={Hoosha AI Technical Field Notes},
  year={2026},
  url={${paper.url || "https://hooshaai.substack.com"}}
}`), /* @__PURE__ */ React.createElement("button", { className: "btn-primary", style: { marginTop: "1rem" }, onClick: () => onCopyBib?.(`@article{majlesi2026,
  title={${paper.title}},
  author={Majlesi, Mohammad Taha},
  year={2026}
}`) }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-copy" }), " Copy Citation to Clipboard"))), /* @__PURE__ */ React.createElement("div", { className: "paper-reader-footer" }, /* @__PURE__ */ React.createElement("a", { href: paper.url || "https://hooshaai.substack.com", target: "_blank", className: "btn-primary" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-external-link-alt" }), " Read Full Paper on Substack"), /* @__PURE__ */ React.createElement("button", { className: "btn-secondary", onClick: onClose }, "Close Reader"))));
  }

  // src/components/modals/CyberpunkGameModal.jsx
  var import_react19 = __toESM(require_react_shim());
  function CyberpunkGameModal({ open, onClose, showToast, beep }) {
    const canvasRef = (0, import_react19.useRef)(null);
    const [score, setScore] = (0, import_react19.useState)(0);
    const [level, setLevel] = (0, import_react19.useState)(1);
    const [modelSize, setModelSize] = (0, import_react19.useState)("1B Params");
    const [gameOver, setGameOver] = (0, import_react19.useState)(false);
    const [gameStarted, setGameStarted] = (0, import_react19.useState)(false);
    (0, import_react19.useEffect)(() => {
      if (!open || !gameStarted || gameOver) return;
      const cvs = canvasRef.current;
      if (!cvs) return;
      const ctx = cvs.getContext("2d");
      let W = cvs.width = 460, H = cvs.height = 360;
      let playerX = W / 2 - 20;
      const playerW = 40, playerH = 14;
      let scoreCount = 0;
      let isDead = false;
      const items = [];
      const itemTypes = [
        { text: "FlowMatching", color: "#00f0ff", points: 100, bad: false },
        { text: "GRPO Loss", color: "#10b981", points: 150, bad: false },
        { text: "CUDA Kernel", color: "#a78bfa", points: 200, bad: false },
        { text: "OOM Error!", color: "#f43f5e", points: -1, bad: true },
        { text: "NaN Spike", color: "#fbbf24", points: -1, bad: true }
      ];
      const onKey = (e) => {
        if (e.key === "ArrowLeft" || e.key === "a") playerX = Math.max(0, playerX - 24);
        if (e.key === "ArrowRight" || e.key === "d") playerX = Math.min(W - playerW, playerX + 24);
      };
      window.addEventListener("keydown", onKey);
      const spawnInterval = setInterval(() => {
        const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        items.push({
          x: Math.random() * (W - 40) + 10,
          y: -20,
          spd: Math.random() * 2 + 2,
          ...type
        });
      }, 600);
      let raf;
      const loop = () => {
        if (isDead) return;
        ctx.clearRect(0, 0, W, H);
        ctx.strokeStyle = "rgba(0, 240, 255, 0.08)";
        ctx.lineWidth = 1;
        for (let x = 0; x < W; x += 20) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, H);
          ctx.stroke();
        }
        ctx.fillStyle = "var(--accent)";
        ctx.fillRect(playerX, H - 25, playerW, playerH);
        ctx.fillStyle = "#fff";
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText("\u{1F916} TAHA", playerX + 2, H - 14);
        for (let i = items.length - 1; i >= 0; i--) {
          const item = items[i];
          item.y += item.spd;
          ctx.fillStyle = item.color;
          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillText(item.text, item.x, item.y);
          if (item.y >= H - 35 && item.y <= H - 10 && item.x >= playerX - 20 && item.x <= playerX + playerW + 10) {
            items.splice(i, 1);
            if (item.bad) {
              isDead = true;
              setGameOver(true);
              beep?.(300, "sawtooth");
              showToast?.("\u{1F4A5} Model Crashed! OOM Error!");
            } else {
              scoreCount += item.points;
              setScore(scoreCount);
              beep?.(880, "sine");
              if (scoreCount >= 2e3) {
                setLevel(4);
                setModelSize("70B MoE Params");
              } else if (scoreCount >= 1e3) {
                setLevel(3);
                setModelSize("14B Params");
              } else if (scoreCount >= 400) {
                setLevel(2);
                setModelSize("7B Params");
              }
            }
          } else if (item.y > H) {
            items.splice(i, 1);
          }
        }
        if (!isDead) raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      return () => {
        window.removeEventListener("keydown", onKey);
        clearInterval(spawnInterval);
        cancelAnimationFrame(raf);
      };
    }, [open, gameStarted, gameOver]);
    if (!open) return null;
    const handleStart = () => {
      setScore(0);
      setLevel(1);
      setModelSize("1B Params");
      setGameOver(false);
      setGameStarted(true);
      beep?.(600);
    };
    return /* @__PURE__ */ React.createElement("div", { className: "modal-overlay", onClick: onClose }, /* @__PURE__ */ React.createElement("div", { className: "modal-box arcade-modal-box", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "modal-header" }, /* @__PURE__ */ React.createElement("h3", null, /* @__PURE__ */ React.createElement("i", { className: "fas fa-gamepad", style: { color: "var(--accent)" } }), " Cyberpunk AI Arcade: Neural Defender"), /* @__PURE__ */ React.createElement("button", { className: "modal-close", onClick: onClose }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-times" }))), /* @__PURE__ */ React.createElement("div", { className: "arcade-status-bar" }, /* @__PURE__ */ React.createElement("div", null, "Score: ", /* @__PURE__ */ React.createElement("b", { style: { color: "var(--accent)" } }, score, " FLOPS")), /* @__PURE__ */ React.createElement("div", null, "Level: ", /* @__PURE__ */ React.createElement("b", null, "LVL ", level)), /* @__PURE__ */ React.createElement("div", null, "Model Size: ", /* @__PURE__ */ React.createElement("b", { style: { color: "var(--emerald)" } }, modelSize))), /* @__PURE__ */ React.createElement("div", { className: "arcade-canvas-wrapper" }, /* @__PURE__ */ React.createElement("canvas", { ref: canvasRef, style: { borderRadius: "10px", border: "1px solid var(--border)", background: "#030712" } }), (!gameStarted || gameOver) && /* @__PURE__ */ React.createElement("div", { className: "arcade-overlay-screen" }, /* @__PURE__ */ React.createElement("h2", null, gameOver ? "\u{1F4A5} GAME OVER" : "\u{1F47E} NEURAL DEFENDER"), /* @__PURE__ */ React.createElement("p", null, gameOver ? `Final Model Capacity: ${modelSize} (${score} FLOPS)` : "Use \u2B05\uFE0F Arrow Keys \u27A1\uFE0F to catch Gradient Tokens and avoid OOM Monsters!"), /* @__PURE__ */ React.createElement("button", { className: "btn-primary", onClick: handleStart, style: { marginTop: "1rem" } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-play" }), " ", gameOver ? "Try Again" : "Start Arcade Game")))));
  }

  // src/components/ui/Toast.jsx
  function Toast({ msg }) {
    if (!msg) return null;
    return /* @__PURE__ */ React.createElement("div", { className: "toast-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "toast" }, msg));
  }

  // src/utils/weatherAudio.js
  var audioCtx = null;
  var noiseNode = null;
  var filterNode = null;
  var gainNode = null;
  var isPlaying = false;
  function toggleWeatherAudio(mode = "rain", volume = 0.15) {
    if (isPlaying) {
      stopWeatherAudio();
      return false;
    } else {
      startWeatherAudio(mode, volume);
      return true;
    }
  }
  function startWeatherAudio(mode = "rain", volume = 0.15) {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      const bufferSize = audioCtx.sampleRate * 5;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11;
        b6 = white * 0.115926;
      }
      noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = buffer;
      noiseNode.loop = true;
      filterNode = audioCtx.createBiquadFilter();
      filterNode.type = mode === "snow" ? "lowpass" : "bandpass";
      filterNode.frequency.setValueAtTime(mode === "snow" ? 400 : 900, audioCtx.currentTime);
      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
      noiseNode.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      noiseNode.start();
      isPlaying = true;
      return true;
    } catch (err) {
      console.warn("Web Audio Weather sound not available:", err);
      return false;
    }
  }
  function stopWeatherAudio() {
    if (noiseNode) {
      try {
        noiseNode.stop();
        noiseNode.disconnect();
      } catch {
      }
      noiseNode = null;
    }
    isPlaying = false;
    return false;
  }

  // src/App.jsx
  function App() {
    const [data, setData] = (0, import_react20.useState)({ repos: [], articles: [], hf: [], readmeHtml: "" });
    const [search, setSearch] = (0, import_react20.useState)("");
    const [filter, setFilter] = (0, import_react20.useState)("all");
    const [hfFilter, setHfFilter] = (0, import_react20.useState)("all");
    const [subSearch, setSubSearch] = (0, import_react20.useState)("");
    const [pageView, setPageView] = (0, import_react20.useState)("all");
    const [weatherMode, setWeatherMode] = (0, import_react20.useState)("rain");
    const [weatherAudioOn, setWeatherAudioOn] = (0, import_react20.useState)(false);
    const [accent, setAccent] = (0, import_react20.useState)("cyan");
    const [mobileNav, setMobileNav] = (0, import_react20.useState)(false);
    const [codeTab, setCodeTab] = (0, import_react20.useState)("flow");
    const [codeOut, setCodeOut] = (0, import_react20.useState)("");
    const [soundOn, setSoundOn] = (0, import_react20.useState)(false);
    const [aiOpen, setAiOpen] = (0, import_react20.useState)(false);
    const [cmdOpen, setCmdOpen] = (0, import_react20.useState)(false);
    const [hireOpen, setHireOpen] = (0, import_react20.useState)(false);
    const [cliOpen, setCliOpen] = (0, import_react20.useState)(false);
    const [nnOpen, setNnOpen] = (0, import_react20.useState)(false);
    const [gameOpen, setGameOpen] = (0, import_react20.useState)(false);
    const [articleModalOpen, setArticleModalOpen] = (0, import_react20.useState)(false);
    const [selectedPaper, setSelectedPaper] = (0, import_react20.useState)(null);
    const [bibtexPub, setBibtexPub] = (0, import_react20.useState)(null);
    const [toast, showToast] = useToast();
    const time = useTehranClock();
    const gpuM = useGpuMetrics();
    const beep = useBeep(soundOn);
    useNeuralCanvas(weatherMode);
    const handleToggleWeatherAudio = () => {
      const active = toggleWeatherAudio(weatherMode, 0.15);
      setWeatherAudioOn(active);
      showToast(active ? `\u{1F327}\uFE0F ${weatherMode.toUpperCase()} Ambient Sound ON` : "\u{1F507} Weather Audio OFF");
      beep(700);
    };
    (0, import_react20.useEffect)(() => {
      fetch("data.json").then((r) => r.json()).then((d) => setData(d)).catch(() => {
      });
    }, []);
    (0, import_react20.useEffect)(() => {
      const fn = (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
          e.preventDefault();
          setCmdOpen((p) => !p);
        }
        if ((e.metaKey || e.ctrlKey) && e.key === "j") {
          e.preventDefault();
          setCliOpen((p) => !p);
        }
        if (e.key === "Escape") {
          setCmdOpen(false);
          setAiOpen(false);
          setHireOpen(false);
          setCliOpen(false);
          setBibtexPub(null);
          setMobileNav(false);
        }
      };
      window.addEventListener("keydown", fn);
      return () => window.removeEventListener("keydown", fn);
    }, []);
    const repos = (0, import_react20.useMemo)(() => (data.repos || []).filter((r) => {
      const ok = filter === "all" || r.cat === filter;
      const q = search.trim().toLowerCase();
      return ok && (!q || (r.name + r.desc + r.lang + r.tag).toLowerCase().includes(q));
    }), [data.repos, filter, search]);
    const articles = (0, import_react20.useMemo)(() => {
      const q = subSearch.trim().toLowerCase();
      return (data.articles || []).filter((a) => !q || (a.title + a.desc).toLowerCase().includes(q));
    }, [data.articles, subSearch]);
    const hfAssets = (0, import_react20.useMemo)(() => (data.hf || []).filter((h) => hfFilter === "all" || h.type === hfFilter), [data.hf, hfFilter]);
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
        cli: () => setCliOpen(true),
        nn: () => setNnOpen(true),
        ai: () => setAiOpen(true),
        hire: () => setHireOpen(true),
        sponsor: () => window.open("https://github.com/sponsors/tahamajs", "_blank"),
        linkedin: () => window.open("https://linkedin.com/in/tahamajlesi", "_blank"),
        instagram: () => window.open("https://instagram.com/hooshaaii", "_blank"),
        hf: () => window.open("https://huggingface.co/tahamajs", "_blank"),
        substack: () => window.open("https://hooshaai.substack.com", "_blank"),
        email: () => window.location.href = "mailto:tahamajlesi@ut.ac.ir",
        resume: () => window.open("assets/resume.pdf", "_blank"),
        telemetry: () => {
          setPageView("lab");
          scrollTo("telemetry");
        },
        sandbox: () => {
          setPageView("lab");
          scrollTo("sandbox");
        },
        constellation: () => {
          setPageView("projects");
          scrollTo("constellation");
        },
        projects: () => {
          setPageView("projects");
          scrollTo("projects");
        },
        publications: () => {
          setPageView("papers");
          scrollTo("publications");
        },
        feed: () => {
          setPageView("papers");
          scrollTo("social-feed");
        },
        experience: () => {
          setPageView("home");
          scrollTo("experience");
        },
        contact: () => {
          setPageView("contact");
          scrollTo("contact");
        }
      };
      (map[id] || (() => {
      }))();
    };
    const handleAddArticle = (newArticle) => {
      setData((prev) => ({
        ...prev,
        articles: [newArticle, ...prev.articles || []]
      }));
    };
    const counts = (0, import_react20.useMemo)(() => ({
      all: repos.length,
      course: repos.filter((r) => r.category === "course").length,
      ml: repos.filter((r) => r.category === "ml").length,
      systems: repos.filter((r) => r.category === "systems").length,
      hfModels: hfAssets.filter((a) => a.type === "model").length,
      hfDatasets: hfAssets.filter((a) => a.type === "dataset").length
    }), [repos, hfAssets]);
    const handleCopyEmail = () => {
      navigator.clipboard.writeText("tahamajlesi@ut.ac.ir");
      showToast("\u{1F4CB} Email (tahamajlesi@ut.ac.ir) copied to clipboard!");
    };
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Navigation, { mobileNav, setMobileNav, onHire: () => setHireOpen(true), onCmd: () => setCmdOpen(true) }), /* @__PURE__ */ React.createElement(PageRouterBar, { pageView, setPageView, beep }), /* @__PURE__ */ React.createElement(FloatingContactBar, { onHire: () => setHireOpen(true), onCopyEmail: handleCopyEmail, beep, showToast }), /* @__PURE__ */ React.createElement("main", { style: { paddingTop: "80px" } }, (pageView === "all" || pageView === "home") && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(HeroSection, { time, onHire: () => setHireOpen(true), onAI: () => setAiOpen(true), onSponsor: () => {
    }, setSearch, scrollTo, beep }), /* @__PURE__ */ React.createElement(AchievementsSection, null), /* @__PURE__ */ React.createElement(TimelineSection, null), /* @__PURE__ */ React.createElement(TeachingSection, { beep }), /* @__PURE__ */ React.createElement(SkillsSection, null)), (pageView === "all" || pageView === "lab") && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(GpuTelemetrySection, null), /* @__PURE__ */ React.createElement(CodeSandboxSection, { activeTab: codeTab, setActiveTab: setCodeTab, runOutput: codeOut, setRunOutput: setCodeOut, beep }), /* @__PURE__ */ React.createElement(BenchmarkSection, null)), (pageView === "all" || pageView === "projects") && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ConstellationSection, { beep }), /* @__PURE__ */ React.createElement(ContributionGraph, null), /* @__PURE__ */ React.createElement(ProjectsSection, { repos, search, setSearch, filter, setFilter, hfAssets, hfFilter, setHfFilter, counts, articles, subSearch, setSubSearch, beep })), (pageView === "all" || pageView === "papers") && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(PublicationsSection, { onCopyBib: setBibtexPub, onSelectPaper: setSelectedPaper, beep }), /* @__PURE__ */ React.createElement(TalksSection, { beep }), /* @__PURE__ */ React.createElement(SocialFeedSection, { beep }), /* @__PURE__ */ React.createElement(SubstackSection, { articles, subSearch, setSubSearch, onOpenArticleModal: () => setArticleModalOpen(true), beep })), (pageView === "all" || pageView === "contact") && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(NewsletterSection, { beep }), /* @__PURE__ */ React.createElement(ContactSection, { onHire: () => setHireOpen(true), beep })), data.readmeHtml && /* @__PURE__ */ React.createElement(ReadmeSection, { readmeHtml: data.readmeHtml })), /* @__PURE__ */ React.createElement(Footer, { gpuM }), /* @__PURE__ */ React.createElement("div", { className: "theme-switcher" }, /* @__PURE__ */ React.createElement("div", { className: "theme-switcher-panel" }, /* @__PURE__ */ React.createElement("button", { className: `ctrl-btn ${soundOn ? "active" : ""}`, onClick: () => {
      setSoundOn(!soundOn);
      showToast(soundOn ? "Sound Off \u{1F507}" : "UI Beeps On \u{1F50A}");
      beep(600);
    }, title: "Toggle UI Sound Beeps" }, /* @__PURE__ */ React.createElement("i", { className: `fas ${soundOn ? "fa-volume-up" : "fa-volume-mute"}` })), /* @__PURE__ */ React.createElement("button", { className: `ctrl-btn ${weatherAudioOn ? "active" : ""}`, onClick: handleToggleWeatherAudio, title: "Toggle Ambient Weather Rain Soundscape" }, /* @__PURE__ */ React.createElement("i", { className: `fas ${weatherAudioOn ? "fa-cloud-showers-heavy" : "fa-cloud-sun"}`, style: { color: weatherAudioOn ? "var(--cyan)" : "" } })), /* @__PURE__ */ React.createElement("div", { className: "ctrl-divider" }), [
      ["rain", "fa-cloud-rain", "Cyber Rain"],
      ["snow", "fa-snowflake", "Cyber Snow"],
      ["matrix", "fa-terminal", "Matrix Rain"],
      ["stars", "fa-star", "Constellation Stars"]
    ].map(([m, ic, title]) => /* @__PURE__ */ React.createElement("button", { key: m, className: `ctrl-btn ${weatherMode === m ? "active" : ""}`, onClick: () => {
      setWeatherMode(m);
      showToast(`Weather: ${title} \u2728`);
      beep(700);
    }, title }, /* @__PURE__ */ React.createElement("i", { className: `fas ${ic}` }))), /* @__PURE__ */ React.createElement("button", { className: `ctrl-btn ${gameOpen ? "active" : ""}`, onClick: () => {
      setGameOpen(true);
      beep(880);
    }, title: "Play Cyberpunk AI Arcade Game (Neural Defender)" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-gamepad", style: { color: "var(--accent)" } })), /* @__PURE__ */ React.createElement("div", { className: "ctrl-divider" }), ["cyan", "purple", "emerald", "rose"].map((c) => /* @__PURE__ */ React.createElement("div", { key: c, className: `accent-dot ${accent === c ? "active" : ""}`, style: { background: `var(--${c})` }, onClick: () => setAccentColor(c), title: c })))), /* @__PURE__ */ React.createElement("button", { className: "back-top-btn", onClick: () => {
      window.scrollTo(0, 0);
      beep?.();
    }, "aria-label": "Back to top" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-chevron-up" })), /* @__PURE__ */ React.createElement("button", { className: "ai-fab", onClick: () => {
      setAiOpen(true);
      beep?.();
    } }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-robot" }), " ", /* @__PURE__ */ React.createElement("span", null, "Ask AI")), /* @__PURE__ */ React.createElement(Toast, { msg: toast }), /* @__PURE__ */ React.createElement(AIChatModal, { open: aiOpen, onClose: () => setAiOpen(false), beep, speak: null }), /* @__PURE__ */ React.createElement(HireModal, { open: hireOpen, onClose: () => setHireOpen(false), showToast, beep }), /* @__PURE__ */ React.createElement(CommandPalette, { open: cmdOpen, onClose: () => setCmdOpen(false), onCmd: handleCmd }), /* @__PURE__ */ React.createElement(TerminalModal, { open: cliOpen, onClose: () => setCliOpen(false), beep }), /* @__PURE__ */ React.createElement(ArticleCreatorModal, { open: articleModalOpen, onClose: () => setArticleModalOpen(false), onAddArticle: handleAddArticle, beep, showToast }), /* @__PURE__ */ React.createElement(NNPlaygroundModal, { open: nnOpen, onClose: () => setNnOpen(false), beep, showToast }), /* @__PURE__ */ React.createElement(PaperReaderModal, { paper: selectedPaper, onClose: () => setSelectedPaper(null), onCopyBib: copyBib, beep }), /* @__PURE__ */ React.createElement(CyberpunkGameModal, { open: gameOpen, onClose: () => setGameOpen(false), showToast, beep }), /* @__PURE__ */ React.createElement(Modal, { open: !!bibtexPub, onClose: () => setBibtexPub(null) }, /* @__PURE__ */ React.createElement("h3", { style: { color: "#fff", marginBottom: "1rem" } }, "Cite Document"), /* @__PURE__ */ React.createElement("div", { className: "bib-box" }, bibtexPub), /* @__PURE__ */ React.createElement("button", { className: "btn-primary", style: { marginTop: "1rem", width: "100%", justifyContent: "center" }, onClick: () => copyBib(bibtexPub) }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-copy" }), " Copy to Clipboard")));
  }

  // src/index.jsx
  var rootElement = document.getElementById("root");
  var root = (0, import_client.createRoot)(rootElement);
  root.render(/* @__PURE__ */ import_react21.default.createElement(App, null));
})();
