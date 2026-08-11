// src/hooks/index.js — custom React hooks

import { useState, useEffect, useRef, useCallback } from 'react';

/* ── Toast ── */
export function useToast() {
  const [msg, setMsg] = useState(null);
  const show = useCallback((m, ms = 2800) => {
    setMsg(m);
    setTimeout(() => setMsg(null), ms);
  }, []);
  return [msg, show];
}

/* ── Tehran clock ── */
export function useTehranClock() {
  const [time, setTime] = useState('--:--:--');
  useEffect(() => {
    const fmt = () => new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Tehran', hour: '2-digit', minute: '2-digit',
      second: '2-digit', hour12: true
    }).format(new Date());
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ── GPU metric flicker ── */
export function useGpuMetrics() {
  const [m, setM] = useState({ flops:'312.0', vram:'68.4', lat:'1.20', temp:'52', util:'96' });
  useEffect(() => {
    const id = setInterval(() => setM({
      flops: (308 + Math.random() * 8).toFixed(1),
      vram:  (67  + Math.random() * 3).toFixed(1),
      lat:   (1.1 + Math.random() * 0.25).toFixed(2),
      temp:  String(50 + (Math.random() * 6 | 0)),
      util:  String(93 + (Math.random() * 5 | 0)),
    }), 1800);
    return () => clearInterval(id);
  }, []);
  return m;
}

/* ── Sound ── */
export function useBeep(soundOn) {
  const ctx = useRef(null);
  return useCallback((freq = 440, type = 'sine', vol = 0.03) => {
    if (!soundOn) return;
    try {
      if (!ctx.current) ctx.current = new (window.AudioContext || window.webkitAudioContext)();
      const c = ctx.current, osc = c.createOscillator(), g = c.createGain();
      osc.type = type; osc.frequency.value = freq;
      g.gain.setValueAtTime(vol, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.18);
      osc.connect(g); g.connect(c.destination);
      osc.start(); osc.stop(c.currentTime + 0.18);
    } catch (_) {}
  }, [soundOn]);
}

/* ── Canvas: neural mesh + snow + rain + matrix ── */
export function useNeuralCanvas(mode = 'rain') {
  useEffect(() => {
    const spot = document.getElementById('cursor-spotlight');
    const onMove = e => {
      if (spot) { spot.style.left = e.clientX + 'px'; spot.style.top = e.clientY + 'px'; }
    };
    window.addEventListener('mousemove', onMove);

    const cvs = document.getElementById('neural-canvas');
    if (!cvs) return;
    const ctx = cvs.getContext('2d', { alpha: true });
    let W = cvs.width = innerWidth, H = cvs.height = innerHeight;
    
    // Mesh points
    const N = W > 700 ? 60 : 25;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .6, vy: (Math.random() - .5) * .6,
      r: Math.random() * 1.8 + .5, a: Math.random(),
      da: (Math.random() * .02 + .004) * (Math.random() < .5 ? 1 : -1),
    }));

    // Rain particles
    const rain = Array.from({ length: W > 700 ? 50 : 20 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      len: Math.random() * 25 + 15, spd: Math.random() * 4 + 2,
      opacity: Math.random() * 0.4 + 0.1
    }));
    const ripples = [];

    // Snow particles
    const snow = Array.from({ length: W > 700 ? 65 : 30 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 3 + 1, spd: Math.random() * 1 + 0.5,
      sway: Math.random() * 1 - 0.5, opacity: Math.random() * 0.7 + 0.3
    }));

    // Matrix characters
    const chars = '01λ∫∇∂θπΣΦΨ';
    const matrixCols = Array.from({ length: Math.floor(W / 20) }, () => Math.random() * H);

    let raf, last = 0;
    const draw = ts => {
      if (ts - last < 16) { raf = requestAnimationFrame(draw); return; }
      last = ts;
      ctx.clearRect(0, 0, W, H);

      // 1. Mesh constellation
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d2 = dx*dx + dy*dy;
          if (d2 < 14000) { ctx.beginPath(); ctx.strokeStyle = `rgba(0,240,255,${.12*(1-Math.sqrt(d2)/118)})`; ctx.lineWidth = .5; ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
        }
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        p.a += p.da; if (p.a < .15 || p.a > 1) p.da *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fillStyle = `rgba(0,240,255,${p.a * .7})`; ctx.fill();
      }

      // 2. Weather mode specific drawing
      if (mode === 'rain') {
        for (let i = 0; i < rain.length; i++) {
          const r = rain[i];
          ctx.beginPath(); ctx.moveTo(r.x, r.y); ctx.lineTo(r.x, r.y + r.len);
          ctx.strokeStyle = `rgba(0, 240, 255, ${r.opacity})`; ctx.lineWidth = 1; ctx.stroke();
          r.y += r.spd;
          if (r.y > H) {
            if (Math.random() < 0.6) ripples.push({ x: r.x, y: H - 5, radius: 2, maxR: Math.random() * 20 + 10, alpha: 0.6 });
            r.y = -r.len; r.x = Math.random() * W;
          }
        }
        for (let i = ripples.length - 1; i >= 0; i--) {
          const rip = ripples[i];
          ctx.beginPath(); ctx.ellipse(rip.x, rip.y, rip.radius, rip.radius * 0.4, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(138, 43, 226, ${rip.alpha})`; ctx.lineWidth = 1; ctx.stroke();
          rip.radius += 0.8; rip.alpha -= 0.02;
          if (rip.alpha <= 0 || rip.radius >= rip.maxR) ripples.splice(i, 1);
        }
      } else if (mode === 'snow') {
        for (let i = 0; i < snow.length; i++) {
          const s = snow[i];
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`; ctx.fill();
          s.y += s.spd; s.x += Math.sin(s.y * 0.02) * s.sway;
          if (s.y > H) { s.y = -5; s.x = Math.random() * W; }
        }
      } else if (mode === 'matrix') {
        ctx.font = '14px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';
        matrixCols.forEach((y, x) => {
          const ch = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(ch, x * 20, y);
          matrixCols[x] = y > H || Math.random() > 0.975 ? 0 : y + 16;
        });
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    const onResize = () => { W = cvs.width = innerWidth; H = cvs.height = innerHeight; };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, [mode]);
}
