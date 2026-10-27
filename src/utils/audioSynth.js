/**
 * Web Audio API synthesizer for traditional Shehnai & Tanpura melody
 * Used as a dependable fallback when audio file playback is unavailable.
 */

let audioCtx = null;
let isPlaying = false;
let loopTimer = null;
let currentNodes = [];

export function startSynthesizedShehnai() {
  if (isPlaying) return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;

    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlaying = true;
    currentNodes = [];

    // Master gain
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.18, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
    currentNodes.push(masterGain);

    // Tanpura Drone (Sa, Pa, High Sa)
    const droneFreqs = [130.81, 196.0, 261.63];
    droneFreqs.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      osc.start();
      currentNodes.push(osc);
    });

    // Shehnai Yaman Raag Melody sequence
    const notes = [
      { f: 261.63, dur: 2.2 }, // Sa
      { f: 329.63, dur: 1.6 }, // Ga
      { f: 369.99, dur: 1.6 }, // Tivra Ma
      { f: 392.0, dur: 3.0 },  // Pa
      { f: 440.0, dur: 1.8 },  // Dha
      { f: 493.88, dur: 1.8 }, // Ni
      { f: 523.25, dur: 3.2 }, // High Sa
      { f: 493.88, dur: 1.8 }, // Ni
      { f: 440.0, dur: 1.8 },  // Dha
      { f: 392.0, dur: 2.2 },  // Pa
      { f: 369.99, dur: 1.6 }, // Tivra Ma
      { f: 329.63, dur: 2.0 }, // Ga
      { f: 293.66, dur: 1.8 }, // Re
      { f: 261.63, dur: 3.8 }, // Sa
    ];

    let noteIndex = 0;
    function playNextNote() {
      if (!isPlaying || !audioCtx) return;

      const n = notes[noteIndex];
      noteIndex = (noteIndex + 1) % notes.length;

      const osc = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      // Shehnai nasal reed timbre
      osc.type = 'sawtooth';
      osc2.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, audioCtx.currentTime);
      osc2.frequency.setValueAtTime(n.f * 2, audioCtx.currentTime);

      // Vibrato
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.setValueAtTime(5.8, audioCtx.currentTime);
      lfoGain.gain.setValueAtTime(3.5, audioCtx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfoGain.connect(osc2.frequency);
      lfo.start();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, audioCtx.currentTime);
      filter.Q.setValueAtTime(1.8, audioCtx.currentTime);

      // Envelope
      const now = audioCtx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.35);
      gain.gain.setValueAtTime(0.18, now + n.dur - 0.4);
      gain.gain.linearRampToValueAtTime(0, now + n.dur);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + n.dur);
      osc2.stop(now + n.dur);
      lfo.stop(now + n.dur);

      loopTimer = setTimeout(playNextNote, n.dur * 1000 - 80);
    }

    playNextNote();
    return true;
  } catch (e) {
    console.warn('Audio synth error:', e);
    return false;
  }
}

export function stopSynthesizedShehnai() {
  isPlaying = false;
  if (loopTimer) {
    clearTimeout(loopTimer);
    loopTimer = null;
  }
  if (currentNodes && currentNodes.length > 0) {
    currentNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {
        // ignore
      }
    });
    currentNodes = [];
  }
  if (audioCtx && audioCtx.state !== 'closed') {
    try {
      audioCtx.suspend();
    } catch {
      // ignore
    }
  }
}
