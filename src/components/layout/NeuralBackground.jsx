// src/components/layout/NeuralBackground.jsx
import { useRef } from 'react';
import { useNeuralCanvas } from '../../hooks/index.js';

export default function NeuralBackground({ mode = 'rain' }) {
  const canvasRef = useRef(null);
  const spotlightRef = useRef(null);

  useNeuralCanvas(canvasRef, spotlightRef, mode);

  return (
    <>
      <div
        ref={spotlightRef}
        className="cursor-spotlight"
        id="cursor-spotlight"
      />
      <canvas
        ref={canvasRef}
        id="neural-canvas"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
    </>
  );
}
