// src/components/layout/ValueStrip.jsx
import React from 'react';
import { HIGHLIGHTS } from '../../data/constants.js';

export default function ValueStrip() {
  // Duplicate array twice to ensure smooth infinite marquee looping
  const items = [...HIGHLIGHTS, ...HIGHLIGHTS];

  return (
    <div className="value-strip" aria-label="Taha Majlesi highlights">
      <div className="strip-inner">
        {items.map((text, idx) => (
          <React.Fragment key={idx}>
            <span>{text}</span>
            {idx < items.length - 1 && <span className="sep">◆</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
