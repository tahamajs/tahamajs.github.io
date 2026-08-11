// src/utils/weatherAudio.js
// Native Web Audio API ambient sound generator (Rain noise & wind)

let audioCtx = null;
let noiseNode = null;
let filterNode = null;
let gainNode = null;
let isPlaying = false;

export function toggleWeatherAudio(mode = 'rain', volume = 0.15) {
  if (isPlaying) {
    stopWeatherAudio();
    return false;
  } else {
    startWeatherAudio(mode, volume);
    return true;
  }
}

export function startWeatherAudio(mode = 'rain', volume = 0.15) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Generate 5 seconds of pink/white noise buffer
    const bufferSize = audioCtx.sampleRate * 5;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11;
      b6 = white * 0.115926;
    }

    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = buffer;
    noiseNode.loop = true;

    // Filter for gentle rain frequency (lowpass cutoff around 800Hz - 1200Hz)
    filterNode = audioCtx.createBiquadFilter();
    filterNode.type = mode === 'snow' ? 'lowpass' : 'bandpass';
    filterNode.frequency.setValueAtTime(mode === 'snow' ? 400 : 900, audioCtx.currentTime);

    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);

    noiseNode.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    noiseNode.start();
    isPlaying = true;
    return true;
  } catch (err) {
    console.warn('Web Audio Weather sound not available:', err);
    return false;
  }
}

export function stopWeatherAudio() {
  if (noiseNode) {
    try {
      noiseNode.stop();
      noiseNode.disconnect();
    } catch {}
    noiseNode = null;
  }
  isPlaying = false;
  return false;
}
