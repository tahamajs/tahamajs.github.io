document.addEventListener('DOMContentLoaded', () => {

  // 1. Dynamic Typewriter Effect
  const words = [
    "Scalable AI Systems.",
    "Flow Matching Models.",
    "Distributed Engines.",
    "Trustworthy LLMs.",
    "Open Source Tools."
  ];
  let i = 0;
  let timer;
  
  function typingEffect() {
    let word = words[i].split("");
    var loopTyping = function() {
      if (word.length > 0) {
        const el = document.querySelector('.type-text');
        if (el) el.innerHTML += word.shift();
      } else {
        setTimeout(deletingEffect, 2000);
        return false;
      };
      timer = setTimeout(loopTyping, 90);
    };
    loopTyping();
  }

  function deletingEffect() {
    let word = words[i].split("");
    var loopDeleting = function() {
      if (word.length > 0) {
        word.pop();
        const el = document.querySelector('.type-text');
        if (el) el.innerHTML = word.join("");
      } else {
        if (words.length > (i + 1)) {
          i++;
        } else {
          i = 0;
        };
        setTimeout(typingEffect, 400);
        return false;
      };
      timer = setTimeout(loopDeleting, 40);
    };
    loopDeleting();
  }
  
  typingEffect();

  // 2. Interactive Neural Network Canvas Background
  const canvas = document.getElementById('neural-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    let mouseX = width / 2;
    let mouseY = height / 2;

    const spotlight = document.getElementById('cursor-spotlight');

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (spotlight) {
        spotlight.style.left = `${mouseX}px`;
        spotlight.style.top = `${mouseY}px`;
      }
    });

    const particles = [];
    const numParticles = Math.min(width > 700 ? 55 : 25, 60);

    for (let p = 0; p < numParticles; p++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1
      });
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
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

        // Mouse connection
        const mdx = particles[a].x - mouseX;
        const mdy = particles[a].y - mouseY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(138, 43, 226, ${0.25 * (1 - mdist / 150)})`;
          ctx.lineWidth = 1.2;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }

        // Particle position update
        particles[a].x += particles[a].vx;
        particles[a].y += particles[a].vy;

        if (particles[a].x < 0 || particles[a].x > width) particles[a].vx *= -1;
        if (particles[a].y < 0 || particles[a].y > height) particles[a].vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particles[a].x, particles[a].y, particles[a].radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.fill();
      }

      requestAnimationFrame(animateCanvas);
    }

    animateCanvas();
  }

  // 3. Web Audio API Sci-Fi SFX Synthesizer
  let soundEnabled = false;
  let audioCtx = null;

  function playSciFiSound(freq = 440, type = 'sine') {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch(e){}
  }

  const soundToggle = document.getElementById('sound-toggle');
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        soundToggle.classList.add('active');
        playSciFiSound(880, 'sine');
        showToast('Sci-Fi Sound FX Enabled! 🔊');
      } else {
        soundToggle.classList.remove('active');
        showToast('Sound Muted 🔇');
      }
    });
  }

  // Toast System
  function showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3000);
  }

  // 4. Live Tehran Clock Ticker
  function updateTehranClock() {
    const clockEl = document.getElementById('live-tehran-clock');
    if (clockEl) {
      const now = new Date();
      const options = { timeZone: 'Asia/Tehran', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
      clockEl.textContent = new Intl.DateTimeFormat('en-US', options).format(now);
    }
  }
  setInterval(updateTehranClock, 1000);
  updateTehranClock();

  // 5. Interactive "Ask Taha's AI Avatar" Instant Assistant Widget
  const aiChatBtn = document.getElementById('ai-chat-btn');
  const aiChatModal = document.getElementById('ai-chat-modal');
  const closeAiChat = document.getElementById('close-ai-chat');
  const aiChatBody = document.getElementById('ai-chat-body');
  const aiInput = document.getElementById('ai-input');
  const aiSendBtn = document.getElementById('ai-send-btn');
  const quickPrompts = document.querySelectorAll('.quick-prompt-btn');

  function openAiModal() {
    if (aiChatModal) {
      playSciFiSound(750, 'sine');
      aiChatModal.classList.add('active');
      if (aiInput) aiInput.focus();
    }
  }

  function closeAiModal() {
    if (aiChatModal) aiChatModal.classList.remove('active');
  }

  if (aiChatBtn) aiChatBtn.addEventListener('click', openAiModal);
  if (closeAiChat) closeAiChat.addEventListener('click', closeAiModal);
  if (aiChatModal) {
    aiChatModal.addEventListener('click', (e) => {
      if (e.target === aiChatModal) closeAiModal();
    });
  }

  function handleAiQuestion(q) {
    if (!q || q.trim() === '') return;
    const query = q.toLowerCase().trim();

    // Append User Message
    const uMsg = document.createElement('div');
    uMsg.className = 'chat-msg user-msg';
    uMsg.textContent = q;
    aiChatBody.appendChild(uMsg);

    if (aiInput) aiInput.value = '';
    aiChatBody.scrollTop = aiChatBody.scrollHeight;

    // Simulate Bot Thought & Reply
    setTimeout(() => {
      let reply = "I am Taha Majlesi's AI assistant. Taha is Co-Founder & Systems/AI Architect at Hoosha AI 🧠 and a Computer Engineering student at University of Tehran, specializing in Flow Matching, GRPO, and Distributed Systems.";

      if (query.includes('hoosha')) {
        reply = "🧠 **Hoosha AI** is an AI startup co-founded by Taha Majlesi, focusing on frontier ML research, continuous cognitive scaling, synthetic consciousness (IIT & GWT), and high-performance post-training RL pipelines. Check out articles at https://hooshaai.substack.com!";
      } else if (query.includes('flow') || query.includes('grpo') || query.includes('research')) {
        reply = "🎨 Taha's primary research centers on **Flow Matching** probability paths for generative modeling, **Group Relative Policy Optimization (GRPO)** for fine-tuning 4B LLMs on GSM8K math reasoning, and sub-quadratic linear attention architectures like LinRec & SVD attention!";
      } else if (query.includes('teach') || query.includes('sharif') || query.includes('ut') || query.includes('course')) {
        reply = "🎓 Taha is a cross-institutional Teaching Assistant for **Compiler Construction at Sharif University of Technology**, and has served as TA for **M.Sc. Machine Learning**, **Artificial Intelligence**, **Advanced Programming (C++)**, and **xv6 OS Lab** at the **University of Tehran**.";
      } else if (query.includes('contact') || query.includes('email') || query.includes('telegram')) {
        reply = "📧 You can reach Taha via primary email `tahamajlesi@ut.ac.ir`, secondary email `Tahamajlesice@gmail.com`, or directly on Telegram `@tahamajlesii`!";
      } else if (query.includes('kaleido') || query.includes('cuda') || query.includes('system')) {
        reply = "⚡ **Kaleido Engine** is Taha's first-principles distributed LLM training framework written in C++/PyTorch that jointly optimizes 4 dimensions of parallel GPU compute nodes.";
      }

      const bMsg = document.createElement('div');
      bMsg.className = 'chat-msg bot-msg';
      bMsg.innerHTML = reply.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
      aiChatBody.appendChild(bMsg);
      aiChatBody.scrollTop = aiChatBody.scrollHeight;
      playSciFiSound(800, 'triangle');
    }, 400);
  }

  if (aiSendBtn) {
    aiSendBtn.addEventListener('click', () => {
      if (aiInput) handleAiQuestion(aiInput.value);
    });
  }

  if (aiInput) {
    aiInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleAiQuestion(aiInput.value);
    });
  }

  quickPrompts.forEach(p => {
    p.addEventListener('click', () => {
      const q = p.getAttribute('data-query');
      handleAiQuestion(q);
    });
  });

  // 6. Zero-Dependency 3D Card Tilt Effect
  const tiltElements = document.querySelectorAll('[data-tilt]');
  tiltElements.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseenter', () => playSciFiSound(600, 'sine'));
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // 7. Category Filtering & Real-Time Search Logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  const bentoItems = document.querySelectorAll('.bento-item');
  const searchInput = document.getElementById('repo-search');

  function filterProjects() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    const activeCategory = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

    bentoItems.forEach(item => {
      const category = item.getAttribute('data-category');
      const textContent = item.textContent.toLowerCase();

      const matchesCategory = (activeCategory === 'all' || category === activeCategory);
      const matchesSearch = (query === "" || textContent.includes(query));

      if (matchesCategory && matchesSearch) {
        item.style.display = 'block';
        item.classList.remove('hide');
      } else {
        item.style.display = 'none';
        item.classList.add('hide');
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      playSciFiSound(500, 'triangle');
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProjects();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('keyup', filterProjects);
    searchInput.addEventListener('input', filterProjects);
  }

  // 8. Repo Quick Detail Modal Popup
  const repoModal = document.getElementById('repo-detail-modal');
  const modalTag = document.getElementById('modal-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalCloneCmd = document.getElementById('modal-clone-cmd');
  const modalLink = document.getElementById('modal-link');
  const closeRepoModal = document.getElementById('close-repo-modal');

  bentoItems.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey) return;
      
      const name = card.getAttribute('data-name');
      const url = card.getAttribute('data-url');
      const desc = card.getAttribute('data-desc');
      const tag = card.getAttribute('data-tag');

      if (name && url && repoModal) {
        e.preventDefault();
        playSciFiSound(700, 'square');
        modalTag.innerHTML = tag || 'GitHub Repository';
        modalTitle.textContent = name.replace(/_/g, ' ').replace(/-/g, ' ');
        modalDesc.textContent = desc || '';
        modalCloneCmd.textContent = `git clone ${url}.git`;
        modalLink.setAttribute('href', url);
        repoModal.classList.add('active');
      }
    });
  });

  function closeDetailModal() {
    if (repoModal) repoModal.classList.remove('active');
  }

  if (closeRepoModal) closeRepoModal.addEventListener('click', closeDetailModal);
  if (repoModal) {
    repoModal.addEventListener('click', (e) => {
      if (e.target === repoModal) closeDetailModal();
    });
  }

  // 9. Command Palette Modal (Cmd + K / Ctrl + K)
  const cmdModal = document.getElementById('cmd-palette-modal');
  const cmdTrigger = document.getElementById('cmd-k-trigger');
  const cmdInput = document.getElementById('cmd-input');
  const cmdItems = document.querySelectorAll('.cmd-item');

  function openCmdPalette() {
    if (cmdModal) {
      playSciFiSound(650, 'sawtooth');
      cmdModal.classList.add('active');
      if (cmdInput) {
        cmdInput.value = '';
        cmdInput.focus();
      }
    }
  }

  function closeCmdPalette() {
    if (cmdModal) {
      cmdModal.classList.remove('active');
    }
  }

  if (cmdTrigger) {
    cmdTrigger.addEventListener('click', openCmdPalette);
  }

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openCmdPalette();
    }
    if (e.key === 'Escape') {
      closeCmdPalette();
      closeDetailModal();
      closeAiModal();
    }
  });

  if (cmdModal) {
    cmdModal.addEventListener('click', (e) => {
      if (e.target === cmdModal) closeCmdPalette();
    });
  }

  cmdItems.forEach(item => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      const target = item.getAttribute('data-target');

      if (action === 'ai') {
        closeCmdPalette();
        openAiModal();
      } else if (action === 'goto') {
        closeCmdPalette();
        const targetEl = document.querySelector(target);
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'url') {
        window.open(target, '_blank');
        closeCmdPalette();
      } else if (action === 'copy') {
        navigator.clipboard.writeText(target);
        showToast(`Copied ${target} to clipboard! 🚀`);
        closeCmdPalette();
      }
    });
  });

  // 10. Back To Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      if (backToTopBtn) backToTopBtn.classList.add('visible');
    } else {
      if (backToTopBtn) backToTopBtn.classList.remove('visible');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 11. Theme Accent Switcher Widget
  const accentDots = document.querySelectorAll('.accent-dot');
  accentDots.forEach(dot => {
    dot.addEventListener('click', () => {
      accentDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      const color = dot.getAttribute('data-color');
      document.body.setAttribute('data-accent', color);
      playSciFiSound(800, 'sine');
      showToast(`Switched theme to ${color.toUpperCase()} ✨`);
    });
  });
});
