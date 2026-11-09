import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp } from 'lucide-react';
import AnimatedDiya from './AnimatedDiya';
import FloatingPetals from './FloatingPetals';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

export default function Footer({ lang, weddingConfig }) {
  const footerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.footer-container > *',
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <footer className="royal-footer" ref={footerRef}>
      {/* Subtle gentle drifting petals for the closing moments */}
      <FloatingPetals count={5} />

      <div className="footer-container">
        {/* Sacred Ganesha Symbol */}
        <div
          className="footer-crest"
          onClick={scrollToTop}
          role="button"
          tabIndex={0}
          title="श्री गणेशाय नमः • ऊपर जाएँ"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') scrollToTop();
          }}
        >
          <img
            src="/images/New_GaneshJi.png"
            alt="श्री गणेश"
            className="footer-ganesha-img"
            onError={(e) => {
              e.currentTarget.src = '/images/ganesh-ji.png';
            }}
          />
        </div>

        {/* Bride & Groom Names */}
        <h3 className="footer-couple-name">
          सचिन साहू (शनि) <i>संग</i> अंजलि साहू
        </h3>
        <p className="footer-sub-text">
          ॥ 09 दिसंबर 2026, बुधवार • हरी प्रिया गार्डन, भरुआ सुमेरपुर ॥
        </p>

        {/* Ornamental Divider with Glowing Diyas */}
        <div className="footer-diya-flank-row" aria-hidden="true">
          <AnimatedDiya size="small" delay={0.2} />
          <div className="ornamental-divider" style={{ margin: 0 }}>
            <span className="divider-line" />
            <span className="divider-symbol">卐</span>
            <span className="divider-line" />
          </div>
          <AnimatedDiya size="small" delay={0.7} />
        </div>

        {/* Sacred Hindi Blessing Card */}
        <div className="footer-blessing-box">
          <p className="footer-welcome-poetry">
            {lang === 'hi'
              ? weddingConfig.poetry.welcomeHi
              : weddingConfig.poetry.welcomeEn}
          </p>
          <p className="footer-blessing-prose">
            {lang === 'hi'
              ? weddingConfig.poetry.blessingHi
              : weddingConfig.poetry.blessingEn}
          </p>
        </div>

        <p className="footer-note-text">
          {lang === 'hi'
            ? weddingConfig.poetry.noteHi
            : weddingConfig.poetry.noteEn}
        </p>

        <div className="footer-family-sign">
          <span>॥ सप्रेम निमंत्रण — समस्त साहू परिवार ॥</span>
        </div>

        {/* Back to Top */}
        <button
          className="back-to-top-btn"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
        >
          <ArrowUp size={16} />
          <span>{lang === 'hi' ? 'शीर्ष पर जाएं' : 'Back to Top'}</span>
        </button>

        <div className="footer-copyright">
          <small>
            © 2026 • {lang === 'hi' ? 'प्रेम और परंपरा के साथ निर्मित' : 'Crafted with Royal Hindu Tradition & Love'}
          </small>
        </div>
      </div>
    </footer>
  );
}
