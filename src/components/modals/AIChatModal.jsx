// src/components/modals/AIChatModal.jsx
import { useState } from 'react';
import Modal from '../ui/Modal.jsx';

const RESPONSES = {
  linkedin:   "💼 Taha's LinkedIn has <b>17,100+ followers</b> — one of Iran's largest AI communities. He posts weekly deep-dives on LLM alignment, CUDA engineering, and distributed training.",
  hoosha:     "🧠 <b>Hoosha AI</b> is Taha's research startup on cognitive AI: Flow Matching generative models, GRPO post-training, and IIT-based synthetic consciousness. <a href='https://hooshaai.substack.com' target='_blank'>hooshaai.substack.com</a>",
  flow:       "🎨 <b>Conditional Flow Matching</b> learns velocity field vθ(t,x) so integrating from x₀~N(0,I) lands on data x₁ via an ODE. No SDE noise during inference, 20 steps, FID 4.21 vs 9.87 for DDPM.",
  grpo:       "📐 <b>GRPO</b> (Group Relative Policy Optimisation) fine-tunes LLMs for math with group-normalised advantage + clipped surrogate + KL penalty. Taha hit <b>80.7% GSM8K pass@1</b> (+18% vs SFT) on a 4B model with 8×A100.",
  kaleido:    "⚡ <b>Kaleido Engine</b> is Taha's first-principles 4D-parallel CUDA/C++ LLM training framework — fused FP16 all-reduce, ring attention, tensor+pipeline+sequence+data parallelism on A100 SXM4 clusters.",
  svd:        "🔬 <b>SVD Linear Attention</b>: Taha's rank-r factorisation of full softmax attention — 6× less memory, 6.1× faster, 94% quality retained (BLEU-4: 28.4 vs 30.2) on 4k-token sequences.",
  ta:         "🎓 Taha is TA at <b>Sharif University</b> (Compiler Construction) and <b>University of Tehran</b> (M.Sc. ML, AI, Advanced C++, OS Lab) — mentoring <b>500+ students</b> across 6 simultaneous courses.",
  sponsor:    "💖 You can <b>sponsor Taha's open-source work</b> on GitHub Sponsors! His projects include Kaleido Engine, Persian LLMs, SVD Attention, and AI research tooling. <a href='https://github.com/sponsors/tahamajs' target='_blank'>github.com/sponsors/tahamajs</a>",
  contact:    "📧 Email: <a href='mailto:tahamajlesi@ut.ac.ir'>tahamajlesi@ut.ac.ir</a> | Telegram: <a href='https://telegram.me/tahamajlesii'>@tahamajlesii</a> | LinkedIn: <a href='https://linkedin.com/in/tahamajlesi'>tahamajlesi</a>",
};

function classify(q) {
  const lo = q.toLowerCase();
  if (lo.includes('sponsor') || lo.includes('fund') || lo.includes('donate')) return 'sponsor';
  if (lo.includes('linkedin') || lo.includes('follower')) return 'linkedin';
  if (lo.includes('hoosha')) return 'hoosha';
  if (lo.includes('flow') || lo.includes('ode')) return 'flow';
  if (lo.includes('grpo') || lo.includes('gsm') || lo.includes('rlhf')) return 'grpo';
  if (lo.includes('kaleido') || lo.includes('cuda') || lo.includes('kernel')) return 'kaleido';
  if (lo.includes('svd') || lo.includes('linear attention')) return 'svd';
  if (lo.includes('ta') || lo.includes('teach') || lo.includes('sharif')) return 'ta';
  if (lo.includes('email') || lo.includes('contact') || lo.includes('hire')) return 'contact';
  return null;
}

const QUICK = [
  'What is Hoosha AI?', 'Explain Flow Matching', 'GRPO on GSM8K',
  'Sponsor Taha 💖', 'Kaleido CUDA Engine', 'How to hire Taha?',
];

export default function AIChatModal({ open, onClose, beep, speak }) {
  const [msgs, setMsgs] = useState([
    { who:'bot', text:"👋 I'm Taha's AI research assistant. Ask me about <b>Flow Matching</b>, <b>GRPO</b>, <b>Hoosha AI</b>, <b>Kaleido Engine</b>, <b>GitHub Sponsors</b>, or how to <b>hire Taha</b>!" }
  ]);
  const [input, setInput] = useState('');

  const send = q => {
    if (!q?.trim()) return;
    setMsgs(p => [...p, { who:'user', text:q.trim() }]);
    setInput('');
    const key = classify(q);
    const r = key ? RESPONSES[key] : "I'm Taha's AI assistant 🤖 — ask about Flow Matching, GRPO, Kaleido Engine, GitHub Sponsors, or his 17.1k LinkedIn community!";
    setTimeout(() => {
      setMsgs(p => [...p, { who:'bot', text:r }]);
      beep?.(810, 'triangle');
      speak?.(r);
    }, 340);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="ai-header">
        <div className="ai-avatar"><i className="fas fa-robot" /></div>
        <div>
          <h3>Taha's AI Research Assistant 🧠</h3>
          <p>Ask about research, Hoosha AI, Kaleido, Sponsors, or how to hire Taha</p>
        </div>
      </div>

      <div className="chat-body">
        {msgs.map((m, i) => (
          <div key={i} className={`chat-msg ${m.who}`}
            dangerouslySetInnerHTML={{ __html: m.text }} />
        ))}
      </div>

      <div className="quick-prompts">
        {QUICK.map(q => (
          <button key={q} className="qp-btn" onClick={() => send(q)}>{q}</button>
        ))}
      </div>

      <div className="chat-input-row">
        <input
          type="text" placeholder="Ask anything about Taha's research…"
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send(input)}
        />
        <button className="btn-send" aria-label="Send" onClick={() => send(input)}>
          <i className="fas fa-paper-plane" />
        </button>
      </div>
    </Modal>
  );
}
