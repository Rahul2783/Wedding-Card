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

  // When 100% reached, trigger exit fade
  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => {
        gsap.to(containerRef.current, {
          opacity: 0,
          scale: 1.03,
          filter: 'blur(10px)',
          duration: 0.85,
          ease: 'power2.inOut',
          onComplete: () => {
            onComplete();
          },
        });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isReady, onComplete]);

  return (
    <div className="royal-loader-screen" ref={containerRef}>
      {/* Authentic Masterpiece Reference Art Background */}
      <div className="loader-art-bg" />

      {/* Dynamic Animated Interactive Progress Zone aligned with reference */}
      <div className="loader-progress-overlay">
        <div className="loader-counter-text">{progress}%</div>

        {/* Ornate Gold Filigree Capsule Bar */}
        <div className="loader-filigree-bar-frame">
          <div
            className="loader-lava-fill"
            style={{ width: `${progress}%` }}
          >
            <span className="loader-lava-glow-tip" />
          </div>
        </div>

        <div className="loader-tagline-text">
          <span>✦</span>
          <span>शुभ अवसर की तैयारी हो रही है...</span>
          <span>✦</span>
        </div>
      </div>
    </div>
  );
}
