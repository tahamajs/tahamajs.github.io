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
    { type: 'sys', text: 'Taha Majlesi AI Systems Shell [v2.4.0-release]' },
    { type: 'sys', text: 'Type "help" for available commands (projects, papers, hoosha, hire, clear).' }
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
        newHist.push({ type: 'res', text: 'Hoosha AI 🧠: Frontier AI research startup co-founded by Taha Majlesi, focusing on Flow Matching generation, GRPO post-training, synthetic consciousness (IIT Φ), and custom 4D-parallel CUDA engines.' });
        break;
      case 'projects':
        newHist.push({ type: 'res', text: 'Top Projects: Kaleido Engine (CUDA 12), SVD Linear Attention, Persian LLM Benchmarks (162 HF Assets).' });
        break;
      case 'papers':
        newHist.push({ type: 'res', text: 'Publications: Conditional Flow Matching for Generative AI, GRPO on Constrained Compute (GSM8K 80.7%), SVD Attention (6× VRAM Reduction).' });
        break;
      case 'hire':
        newHist.push({ type: 'res', text: 'Email: tahamajlesi@ut.ac.ir | Telegram: @tahamajlesii | Open to high-impact AI Research & Systems Engineering roles.' });
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      default:
        newHist.push({ type: 'err', text: `zsh: command not found: ${input}. Type "help" for a list of commands.` });
    }

    setHistory(newHist);
    setInput('');
    beep?.(600, 'square');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="cli-modal" onClick={e => e.stopPropagation()}>
        <div className="cli-header">
          <div className="t-dots">
            <div className="t-dot r" onClick={onClose} /><div className="t-dot y" /><div className="t-dot g" />
          </div>
          <span className="cli-title">taha@tahamajs:~ (zsh)</span>
          <button className="cli-close" onClick={onClose}>ESC</button>
        </div>

        <div className="cli-body">
          {history.map((h, i) => (
            <div key={i} className={`cli-line cli-${h.type}`}>
              <pre>{h.text}</pre>
            </div>
          ))}
          <div className="cli-input-line">
            <span className="cli-prompt">taha@tahamajs:~$</span>
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
