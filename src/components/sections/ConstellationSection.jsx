// src/components/sections/ConstellationSection.jsx
import { useState, useEffect, useRef } from 'react';
import { CONSTELLATION } from '../../data/constants.js';
import SectionHead from '../ui/SectionHead.jsx';

const EDGES = [
  ['core','hoosha'],['core','ut'],['core','sharif'],['core','kaleido'],
  ['core','hf'],['core','sub'],['core','linkedin'],
  ['hoosha','kaleido'],['hoosha','sub'],['ut','sharif'],['hf','sub'],
];

const TYPE_COLORS = {
  core:     '#00f0ff',
  startup:  '#8a2be2',
  academic: '#10b981',
  system:   '#f59e0b',
  science:  '#60a5fa',
  research: '#f43f5e',
};

export default function ConstellationSection({ beep }) {
  const [active, setActive] = useState(null);
  const [dims, setDims] = useState({ w: 700, h: 400 });
  const ref = useRef(null);

  useEffect(() => {
    const update = () => {
      if (ref.current) setDims({ w: ref.current.offsetWidth, h: ref.current.offsetHeight });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const getPos = (node) => ({
    x: (node.x / 100) * dims.w,
    y: (node.y / 100) * dims.h,
  });

  const activeNode = CONSTELLATION.find(n => n.id === active);

  return (
    <section id="constellation" className="section fade-up">
      <SectionHead
        tag="Knowledge Graph"
        title="Research &amp; Affiliation Constellation"
        sub="Click any node to explore Taha's research ecosystem, affiliations, and impact vectors."
      />

      <div className="constellation-wrap" ref={ref}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Edges */}
          {EDGES.map(([aId, bId], i) => {
            const a = CONSTELLATION.find(n => n.id === aId);
            const b = CONSTELLATION.find(n => n.id === bId);
            const aPos = getPos(a); const bPos = getPos(b);
            const isActive = active === aId || active === bId;
            return (
              <line key={i}
                x1={aPos.x} y1={aPos.y} x2={bPos.x} y2={bPos.y}
                stroke={isActive ? '#00f0ff' : 'rgba(255,255,255,0.08)'}
                strokeWidth={isActive ? 1.5 : 0.8}
                style={{ transition: 'all 0.3s' }}
              />
            );
          })}

          {/* Nodes */}
          {CONSTELLATION.map(node => {
            const { x, y } = getPos(node);
            const color = TYPE_COLORS[node.type] || '#fff';
            const isActive = active === node.id;
            const isCore = node.id === 'core';
            const r = isCore ? 22 : isActive ? 16 : 11;
            return (
              <g key={node.id} style={{ cursor: 'pointer' }}
                onClick={() => { setActive(active === node.id ? null : node.id); beep?.(); }}>
                <circle cx={x} cy={y} r={r + 8} fill="transparent" />
                <circle cx={x} cy={y} r={r}
                  fill={isActive || isCore ? color : 'rgba(255,255,255,0.05)'}
                  stroke={color}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  filter={isActive || isCore ? 'url(#glow)' : ''}
                  style={{ transition: 'all 0.3s' }}
                />
                <text x={x} y={y + r + 16} textAnchor="middle"
                  fill={isActive ? color : '#9ca3af'}
                  fontSize={isCore ? 12 : 10}
                  fontFamily="'Space Grotesk', sans-serif"
                  fontWeight={isCore ? 700 : 500}
                  style={{ transition: 'all 0.3s' }}>
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Info panel */}
        {activeNode && (
          <div className="constellation-panel" style={{ borderColor: TYPE_COLORS[activeNode.type] }}>
            <div style={{ color: TYPE_COLORS[activeNode.type], fontSize: '.7rem', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '.4rem' }}>
              {activeNode.type}
            </div>
            <h4 style={{ color: '#fff', marginBottom: '.5rem' }}>{activeNode.label}</h4>
            <p style={{ color: '#9ca3af', fontSize: '.85rem', lineHeight: 1.6 }}>{activeNode.desc}</p>
          </div>
        )}
      </div>
    </section>
  );
}
