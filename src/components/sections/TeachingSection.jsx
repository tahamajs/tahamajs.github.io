// src/components/sections/TeachingSection.jsx
import SectionHead from '../ui/SectionHead.jsx';

const COURSES = [
  {
    code: 'CS-401',
    role: 'Head Teaching Assistant',
    title: 'Compiler Construction & Code Generation',
    inst: 'Sharif University of Technology',
    term: 'Spring 2026',
    desc: 'Leading lab sessions on LLVM IR code generation, register allocation algorithms, and lexer/parser construction in C++/Rust.',
    topics: ['LLVM IR', 'Register Allocation', 'Lexing & Parsing', 'LALR(1) Grammars'],
    slides: 'https://github.com/tahamajs/compiler-construction-lab'
  },
  {
    code: 'CE-204',
    role: 'Teaching Assistant',
    title: 'Computer Architecture & Assembly Language',
    inst: 'University of Tehran',
    term: 'Fall 2025',
    desc: 'Designing RISC-V processor simulators, cache memory hierarchy labs, and hardware pipelining experiments.',
    topics: ['RISC-V ISA', 'Cache Memory', '5-Stage Pipeline', 'Hazard Resolution'],
    slides: 'https://github.com/tahamajs/riscv-architecture-simulator'
  },
  {
    code: 'AI-502',
    role: 'Workshop Instructor',
    title: 'Distributed LLM Training & Fused CUDA Kernels',
    inst: 'Hoosha AI Academy',
    term: 'Winter 2025',
    desc: 'Hands-on intensive workshop on PyTorch FSDP, DeepSpeed ZeRO-3, and custom CUDA warp shuffle kernel programming.',
    topics: ['Fused CUDA', 'PyTorch FSDP', 'ZeRO-3', 'FlashAttention-2'],
    slides: 'https://github.com/tahamajs/distributed-llm-workshop'
  }
];

export default function TeachingSection({ beep }) {
  return (
    <section id="teaching" className="section fade-up">
      <SectionHead
        tag="Academic Pedagogy"
        title="Teaching &amp; Mentorship 👨‍🏫"
        sub="Course instruction, lab design, and curriculum development at Sharif University and University of Tehran."
      />
      <div className="teaching-grid">
        {COURSES.map((c, i) => (
          <div key={i} className="teaching-card">
            <div className="teaching-header">
              <span className="teaching-code">{c.code}</span>
              <span className="teaching-role">{c.role}</span>
            </div>
            <h3 className="teaching-title">{c.title}</h3>
            <div className="teaching-inst"><i className="fas fa-university" /> {c.inst} · {c.term}</div>
            <p className="teaching-desc">{c.desc}</p>
            <div className="teaching-topics">
              {c.topics.map(t => (
                <span key={t} className="teaching-tag">{t}</span>
              ))}
            </div>
            <div className="teaching-actions">
              <a href={c.slides} target="_blank" className="pub-btn" onClick={() => beep?.()}>
                <i className="fas fa-folder-open" /> View Course Materials &amp; Labs
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
