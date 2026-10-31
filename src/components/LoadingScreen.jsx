import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import './LoadingScreen.css';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Smooth progress counter: 0 to 100 over 2.6 seconds
    const startTime = Date.now();
    const duration = 2600;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const timePercent = Math.min(100, Math.floor((elapsed / duration) * 100));

      setProgress(timePercent);

      if (timePercent >= 100) {
        clearInterval(interval);
        setIsReady(true);
      }
    }, 35);

    return () => clearInterval(interval);
  }, []);

  // When 100% reached, smoothly move loading screen upward to reveal the royal card
  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => {
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 1.8,
          ease: 'power3.inOut',
          force3D: true,
          onStart: () => {
            if (containerRef.current) {
              containerRef.current.style.pointerEvents = 'none';
            }
          },
          onComplete: () => {
            if (onComplete) onComplete();
          },
        });
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [isReady, onComplete]);

  return (
    <div
      className="royal-loader-screen"
      ref={containerRef}
      style={{ cursor: 'pointer' }}
      title="स्पर्श करें • संगीत के साथ प्रवेश करें"
    >
      {/* Authentic Masterpiece Reference Art Background (Clean without baked-in bars) */}
      <div className="loader-art-bg" />

      {/* Dynamic Animated Interactive Progress Zone */}
      <div className="loader-progress-overlay">
        <div className="loader-counter-text">{progress}%</div>

        {/* Ornate Royal Gold Filigree Bar with Authentic Wings */}
        <div className="loader-ornate-bar-container">
          {/* Left Filigree Wing */}
          <svg viewBox="0 0 42 34" className="loader-filigree-wing left" aria-hidden="true">
            <path d="M40 5 C30 5 20 10 16 17 C20 24 30 29 40 29" fill="none" stroke="#FFD875" strokeWidth="2" />
            <path d="M16 17 L2 17 M2 17 L10 11 M2 17 L10 23" stroke="#FFD875" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M10 17 Q16 9 24 10 Q19 14 16 17 Q19 20 24 24 Q16 25 10 17 Z" fill="#D4A64A" />
            <circle cx="3" cy="17" r="2.5" fill="#FFE494" />
          </svg>

          {/* Ornate Gold Filigree Capsule Bar */}
          <div className="loader-filigree-bar-frame">
            <div
              className="loader-lava-fill"
              style={{ width: `${progress}%` }}
            >
              <span className="loader-lava-glow-tip" />
            </div>
          </div>

          {/* Right Filigree Wing */}
          <svg viewBox="0 0 42 34" className="loader-filigree-wing right" aria-hidden="true">
            <path d="M2 5 C12 5 22 10 26 17 C22 24 12 29 2 29" fill="none" stroke="#FFD875" strokeWidth="2" />
            <path d="M26 17 L40 17 M40 17 L32 11 M40 17 L32 23" stroke="#FFD875" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M32 17 Q26 9 18 10 Q23 14 26 17 Q23 20 18 24 Q26 25 32 17 Z" fill="#D4A64A" />
            <circle cx="39" cy="17" r="2.5" fill="#FFE494" />
          </svg>
        </div>

        <div className="loader-tagline-text">
          {progress >= 100
            ? '॥ संगीत के साथ स्वागत है • स्पर्श करें ॥'
            : 'शुभ अवसर की तैयारी हो रही है...'}
        </div>

        {/* Sacred Lotus Divider underneath Tagline */}
        <div className="loader-lotus-divider" aria-hidden="true">
          <span className="lotus-divider-line" />
          <svg viewBox="0 0 28 20" className="loader-lotus-svg">
            <path d="M14 2 C11 7 11 13 14 17 C17 13 17 7 14 2 Z" fill="#FFD875" />
            <path d="M13 6 C8 9 7 14 13 17 C10 14 10 9 13 6 Z" fill="#D4A64A" />
            <path d="M15 6 C20 9 21 14 15 17 C18 14 18 9 15 6 Z" fill="#D4A64A" />
            <path d="M7 13 C2 15 4 18 11 18 C7 17 6 15 7 13 Z" fill="#9B6E1F" />
            <path d="M21 13 C26 15 24 18 17 18 C21 17 22 15 21 13 Z" fill="#9B6E1F" />
            <circle cx="14" cy="18" r="1.5" fill="#FFE494" />
          </svg>
          <span className="lotus-divider-line" />
        </div>
      </div>
    </div>
  );
}
