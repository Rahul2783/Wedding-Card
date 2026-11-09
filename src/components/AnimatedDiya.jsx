import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './AnimatedDiya.css';

/**
 * AnimatedDiya Component
 * Traditional Indian brass diya created purely with CSS shapes and gradients.
 * Features GSAP-powered gentle flame flickering, vertical swaying, and warm golden glow pulsing.
 *
 * @param {string} size - 'small', 'medium', or 'large' (default: 'medium')
 * @param {string} className - Optional extra CSS class
 * @param {string} label - Optional screen-reader or visual label
 * @param {number} delay - Animation initial delay offset for natural variety
 */
export default function AnimatedDiya({
  size = 'medium',
  className = '',
  label = '',
  delay = 0,
}) {
  const diyaRef = useRef(null);
  const flameRef = useRef(null);
  const haloRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Subtle, gentle flame scale & tilt sway
      // Uses smooth sinusoidal eases and varying durations for an organic flame feel
      const flameTl = gsap.timeline({
        repeat: -1,
        yoyo: true,
        defaults: { ease: 'sine.inOut' },
        delay: delay,
      });

      flameTl
        .to(flameRef.current, {
          scaleY: 1.08,
          scaleX: 0.94,
          y: -2,
          rotation: 1.5,
          opacity: 0.98,
          duration: 1.4,
        })
        .to(flameRef.current, {
          scaleY: 0.95,
          scaleX: 1.05,
          y: 0.5,
          rotation: -1.2,
          opacity: 0.92,
          duration: 1.7,
        })
        .to(flameRef.current, {
          scaleY: 1.05,
          scaleX: 0.98,
          y: -1.5,
          rotation: 0.8,
          opacity: 1,
          duration: 1.5,
        });

      // 2. Slow, ambient golden halo pulsing
      gsap.to(haloRef.current, {
        scale: 1.15,
        opacity: 0.85,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay * 0.7,
      });
    }, diyaRef);

    return () => ctx.revert();
  }, [delay, prefersReducedMotion]);

  return (
    <div
      ref={diyaRef}
      className={`royal-diya-container size-${size} ${className}`}
      aria-hidden={!label}
      role={label ? 'img' : 'presentation'}
      aria-label={label || 'पारंपरिक पावन दीप'}
    >
      {/* Golden Ambient Radiance Halo */}
      <div ref={haloRef} className="diya-halo-glow" />

      {/* Flame assembly */}
      <div ref={flameRef} className="diya-flame-wrapper">
        <div className="diya-flame-outer" />
        <div className="diya-flame-core" />
      </div>

      {/* Lamp body */}
      <div className="diya-body-wrapper">
        <div className="diya-wick" />
        <div className="diya-rim">
          <div className="diya-oil" />
        </div>
        <div className="diya-base" />
        <div className="diya-foot" />
      </div>

      {label && <span className="diya-caption">{label}</span>}
    </div>
  );
}

