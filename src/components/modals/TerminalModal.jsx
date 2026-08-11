// src/components/modals/TerminalModal.jsx
import { useState, useRef, useEffect } from 'react';

const HELP_TEXT = `
Available commands:
  help        - Show this help menu
  about       - Overview of Mohammad Taha Majlesi
  hoosha      - Info on Hoosha AI 🧠 research startup
  skills      - List core technical capabilities & stack
  papers      - List published technical reports & papers
  repos       - Show featured GitHub repositories
  sponsor     - Open GitHub Sponsors page
  contact     - Display contact information
  clear       - Clear terminal history
  date        - Output current time in Tehran (UTC+3:30)
`;

export default function TerminalModal({ open, onClose, beep }) {
  const [history, setHistory] = useState([
    { type: 'sys', text: 'Hoosha AI Terminal Shell [v2.4.0-release]' },
    { type: 'sys', text: 'Type "help" to list available commands.' }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, open]);

  if (!open) return null;

  const handleCommand = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    beep?.(750, 'square');
    const newHist = [...history, { type: 'cmd', text: `taha@hoosha-ai:~$ ${input}` }];

    switch (cmd) {
      case 'help':
        newHist.push({ type: 'res', text: HELP_TEXT });
        break;
      case 'about':
        newHist.push({ type: 'res', text: 'Mohammad Taha Majlesi — AI Systems Engineer & Researcher. Co-Founder @ Hoosha AI 🧠. CE @ University of Tehran · TA @ Sharif University. 17.1k LinkedIn Community.' });
        break;
      case 'hoosha':
        newHist.push({ type: 'res', text: 'Hoosha AI 🧠: Frontier AI research startup focusing on Flow Matching generation, GRPO post-training, synthetic consciousness (IIT Φ), and custom 4D-parallel CUDA engines.' });
        break;
      case 'skills':
        newHist.push({ type: 'res', text: 'Stack: PyTorch 2.x, JAX, CUDA 12.2/C++, cuBLAS, NCCL, Triton, DeepSpeed, Flow Matching, GRPO, xv6 OS Kernel, Verilog.' });
        break;
      case 'papers':
        newHist.push({ type: 'res', text: '20 Research Papers on Substack: Conditional Flow Matching ODEs, GRPO GSM8K Reasoning (80.7% pass@1), Sub-quadratic Linear SVD Attention, Fused CUDA AllReduce Kernels.' });
        break;
      case 'repos':
        newHist.push({ type: 'res', text: 'Featured Repos: Kaleido-CUDA-Engine, Flow-Matching-PyTorch, GRPO-Reasoning-4B, SVD-Linear-Attention, Persian-Instruct-200k.' });
        break;
      case 'sponsor':
        window.open('https://github.com/sponsors/tahamajs', '_blank');
        newHist.push({ type: 'res', text: 'Opening https://github.com/sponsors/tahamajs in new tab... Thank you for supporting open-source AI!' });
        break;
      case 'contact':
        newHist.push({ type: 'res', text: 'Email: tahamajlesi@ut.ac.ir | Telegram: @tahamajlesii | LinkedIn: linkedin.com/in/tahamajlesi' });
        break;
      case 'date':
        newHist.push({ type: 'res', text: new Date().toLocaleString('en-US', { timeZone: 'Asia/Tehran' }) + ' (Tehran Time)' });
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      default:
        newHist.push({ type: 'err', text: `command not found: ${cmd}. Type "help" for a list of available commands.` });
    }

    setHistory(newHist);
    setInput('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="cli-modal" onClick={e => e.stopPropagation()}>
        <div className="cli-header">
          <div className="t-dots">
            <div className="t-dot r" onClick={onClose} /><div className="t-dot y" /><div className="t-dot g" />
          </div>
          <span className="cli-title">taha@hoosha-ai:~ (zsh)</span>
          <button className="cli-close" onClick={onClose}>ESC</button>
        </div>

        <div className="cli-body">
          {history.map((h, i) => (
            <div key={i} className={`cli-line cli-${h.type}`}>
              <pre>{h.text}</pre>
            </div>
          ))}
          <div className="cli-input-line">
            <span className="cli-prompt">taha@hoosha-ai:~$</span>
            <input
              autoFocus
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleCommand}
              className="cli-input"
            />
          </div>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
