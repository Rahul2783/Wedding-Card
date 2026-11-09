import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Send, BookOpen } from 'lucide-react';
import Countdown from '../components/Countdown';
import FloatingPetals from '../components/FloatingPetals';
import AnimatedDiya from '../components/AnimatedDiya';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './HeroSection.css';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection({
  lang,
  weddingConfig,
  isFlowerShowerActive,
  toggleFlowerShower,
  onOpenRsvp,
  onOpenGuestbook,
}) {
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.hero-ganesha-badge',
        { opacity: 0, y: -25, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.85 }
      )
        .fromTo(
          '.hero-main-title',
          { opacity: 0, scale: 0.92, y: 15 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            onComplete: () => {
              if (!prefersReducedMotion) {
                // One-time royal gold shimmer glow
                gsap.fromTo(
                  '.hero-main-title',
                  { filter: 'drop-shadow(0 0 35px rgba(255, 216, 117, 0.85))' },
                  {
                    filter: 'drop-shadow(0 0 16px rgba(255, 216, 117, 0.4))',
                    duration: 1.4,
                    ease: 'power2.out',
                  }
                );
              }
            },
          },
          '-=0.4'
        )
        .fromTo(
          '.hero-tagline',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.3'
        )
        .fromTo(
          ['.arch-groom', '.arch-center-couple', '.arch-bride'],
          { opacity: 0, y: 25, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.14 },
          '-=0.3'
        )
        .fromTo(
          '.hero-diya-flank-row',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.2'
        )
        .fromTo(
          '.hero-interactive-strip',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.3'
        );

      // 2. Parallax Mandap Background (subtle & restrained)
      if (!prefersReducedMotion && bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const { date } = weddingConfig;

  return (
    <section id="home" className="hero-royal-section" ref={heroRef}>
      {/* Background with illuminated temple mandap and subtle parallax */}
      <div className="hero-bg-wrapper">
        <div
          ref={bgRef}
          className="hero-mandap-bg"
          style={{ backgroundImage: `url('/images/royal-mandap.jpg')` }}
        />
        <div className="hero-gradient-overlay" />
      </div>

      {/* Subtle Floating Flower Petals Layer */}
      <FloatingPetals count={8} />

      {/* Hanging Brass Bells with Swing Animation */}
      <div className="hero-toran-layer">
        <div className="hero-bell bell-left swing-bell-left">
          <span className="bell-cord" />
          <span className="bell-symbol">🔔</span>
        </div>
        <div className="hero-bell bell-right swing-bell-right">
          <span className="bell-cord" />
          <span className="bell-symbol">🔔</span>
        </div>
      </div>

      <div className="hero-container">
        {/* Top Blessing & Ganesha Crest */}
        <div className="hero-ganesha-badge">
          <div className="ganesha-crest">
            <img
              src="/images/New_GaneshJi.png"
              alt="भगवान श्री गणेश"
              className="ganesha-crest-img"
              onError={(e) => {
                e.currentTarget.src = '/images/ganesh-ji.png';
              }}
            />
          </div>
          <div className="hero-shloka-text">॥ श्री गणेशाय नमः ॥</div>
        </div>

        {/* Grand Wedding Heading */}
        <h1 className="hero-main-title">॥ शुभविवाह ॥</h1>
        <p className="hero-tagline">
          {lang === 'hi'
            ? 'हमारे जीवन के नए अध्याय की शुभ शुरुआत'
            : 'A Sacred Union & The Beginning of a New Journey'}
        </p>

        {/* Grand Royal Arches Framing Couple & Names */}
        <div className="hero-mandap-stage">
          {/* Left Arch: Groom (वर) */}
          <div className="mandap-arch-pillar arch-groom">
            <img
              src="/images/Var.png"
              alt="वर: सचिन साहू (शनि) - सुपुत्र: श्री राज कुमार साहू (राजू) एवं श्रीमती सावित्री देवी, सुपौत्र: श्री रामेश्वर प्रसाद साहू"
              className="mandap-card-img"
            />
          </div>

          {/* Center: Bride & Groom Royal Portrait */}
          <div className="mandap-center-portrait arch-center-couple">
            <div className="couple-halo-frame">
              <img
                src="/images/Frame.png"
                alt="सचिन एवं अंजलि - परिणय सूत्र"
                className="couple-portrait-img couple-frame-art"
              />
              <div className="varmala-badge">
                <Heart size={14} className="varmala-heart" />
                <span className="varmala-text">परिणय सूत्र</span>
              </div>
            </div>
          </div>

          {/* Right Arch: Bride (वधू) */}
          <div className="mandap-arch-pillar arch-bride">
            <img
              src="/images/Vadhu.png"
              alt="वधू: अंजलि साहू - सुपुत्री: श्री राजेश साहू एवं श्रीमती जगरानी देवी, सुपौत्री: स्व. श्री हरिश्चन्द्र साहू"
              className="mandap-card-img"
            />
          </div>
        </div>

        {/* Traditional Glowing Diyas Flanking the Mandap Stage */}
        <div className="hero-diya-flank-row" aria-hidden="true">
          <div className="hero-diya-left">
            <AnimatedDiya size="medium" delay={0.2} />
            <span className="hero-diya-tag">॥ शुभ ॥</span>
          </div>
          <div className="hero-diya-right">
            <span className="hero-diya-tag">॥ लाभ ॥</span>
            <AnimatedDiya size="medium" delay={0.8} />
          </div>
        </div>

        {/* Live Countdown */}
        <Countdown lang={lang} dateConfig={date} />

        {/* Interactive Action Bar (पुष्प वर्षा Toggle, RSVP, Guestbook) */}
        <div className="hero-interactive-strip">
          <button
            type="button"
            className={`interactive-card-btn flower-card-btn ${isFlowerShowerActive ? 'active-shower-card' : 'inactive-shower-card'}`}
            onClick={toggleFlowerShower}
            title={
              isFlowerShowerActive
                ? (lang === 'hi' ? 'पुष्प वर्षा बंद करें (Turn OFF)' : 'Turn OFF Petal Shower')
                : (lang === 'hi' ? 'पुष्प वर्षा चालू करें (Turn ON)' : 'Turn ON Petal Shower')
            }
          >
            <div className="icon-wrap">
              <span className={`card-emoji ${isFlowerShowerActive ? 'pulse-flower' : ''}`}>🌸</span>
            </div>
            <div className="label-with-state">
              <span className="btn-label">
                {lang === 'hi' ? 'पुष्प वर्षा' : 'Petal Shower'}
              </span>
              <span className={`hero-state-pill ${isFlowerShowerActive ? 'state-on' : 'state-off'}`}>
                {isFlowerShowerActive ? (lang === 'hi' ? 'चालू' : 'ON') : (lang === 'hi' ? 'बंद' : 'OFF')}
              </span>
            </div>
            <span className="btn-sub">
              {isFlowerShowerActive
                ? (lang === 'hi' ? 'बंद करने के लिए क्लिक करें' : 'Click to Turn OFF')
                : (lang === 'hi' ? 'चालू करने के लिए क्लिक करें' : 'Click to Turn ON')}
            </span>
          </button>

          <button
            type="button"
            className="interactive-card-btn rsvp-card-btn"
            onClick={onOpenRsvp}
          >
            <div className="icon-wrap">
              <Send size={20} className="gold-icon" />
            </div>
            <span className="btn-label">{lang === 'hi' ? 'RSVP भेजें' : 'Send RSVP'}</span>
            <span className="btn-sub">{lang === 'hi' ? 'उपस्थिति दर्ज करें' : 'Confirm Attendance'}</span>
          </button>

          <button
            type="button"
            className="interactive-card-btn guestbook-card-btn"
            onClick={onOpenGuestbook}
          >
            <div className="icon-wrap">
              <BookOpen size={20} className="gold-icon" />
            </div>
            <span className="btn-label">
              {lang === 'hi' ? 'शुभकामना संदेश' : 'Guestbook'}
            </span>
            <span className="btn-sub">{lang === 'hi' ? 'आशीर्वाद लिखें' : 'Write Wishes'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
