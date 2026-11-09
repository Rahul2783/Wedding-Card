import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './FloatingPetals.css';

const PETAL_TYPES = ['petal-rose', 'petal-pink', 'petal-marigold', 'petal-gold'];

/**
 * FloatingPetals Component
 * Renders subtle, elegant floating flower petals (rose, marigold, gold foil)
 * drifting gracefully using GSAP transforms.
 *
 * @param {number} count - Total petals to render (default: 10 on desktop, 5 on mobile)
 * @param {string} className - Optional extra CSS class
 */
export default function FloatingPetals({ count: explicitCount, className = '' }) {
  const containerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const petalCount = explicitCount || (isMobile ? 5 : 10);

  // Generate stable petal descriptor list
  const petals = useRef([]);
  if (petals.current.length !== petalCount) {
    petals.current = Array.from({ length: petalCount }, (_, i) => {
      const type = PETAL_TYPES[i % PETAL_TYPES.length];
      const width = 14 + (i * 3) % 10; // 14px to 23px
      const height = Math.round(width * 1.35);
      const leftPercent = 5 + (i * 19.3) % 90; // Distributed across width
      return {
        id: `petal-${i}`,
        type,
        width,
        height,
        leftPercent,
        baseOpacity: 0.6 + ((i * 7) % 30) / 100, // 0.6 to 0.89
      };
    });
  }

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const elements = containerRef.current.querySelectorAll('.floating-petal-element');
      const containerHeight = containerRef.current.offsetHeight || 600;

      elements.forEach((el, index) => {
        const petalData = petals.current[index];
        if (!petalData) return;

        const duration = 9 + (index % 5) * 2.2; // 9s to 18s (slow, regal drift)
        const delay = index * 1.3; // Staggered entry

        // Initial setup
        gsap.set(el, {
          y: -45,
          x: 0,
          rotationZ: (index * 47) % 360,
          rotationX: (index * 29) % 180,
          opacity: petalData.baseOpacity,
          scale: 0.85 + (index % 4) * 0.1,
        });

        // Vertical falling animation that seamlessly repeats
        const verticalTl = gsap.timeline({
          repeat: -1,
          delay: delay,
        });

        verticalTl.fromTo(
          el,
          {
            y: -45,
            opacity: 0,
          },
          {
            y: containerHeight + 50,
            opacity: petalData.baseOpacity,
            duration: duration,
            ease: 'none',
            onStart: () => {
              gsap.to(el, { opacity: petalData.baseOpacity, duration: 1.2 });
            },
          }
        );

        // Horizontal sinusoidal sway
        const swayDistance = 25 + (index % 4) * 15;
        const swayDuration = 2.8 + (index % 3) * 0.9;
        gsap.to(el, {
          x: `+=${swayDistance}`,
          rotationZ: `+=${60 + index * 15}`,
          rotationX: `+=${45 + index * 10}`,
          duration: swayDuration,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: delay * 0.5,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [petalCount, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      ref={containerRef}
      className={`floating-petals-container ${className}`}
      aria-hidden="true"
    >
      {petals.current.map((p) => (
        <span
          key={p.id}
          className={`floating-petal-element ${p.type}`}
          style={{
            left: `${p.leftPercent}%`,
            width: `${p.width}px`,
            height: `${p.height}px`,
          }}
        />
      ))}
    </div>
  );
}

