import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Heart, Send, BookOpen } from 'lucide-react';
import Countdown from '../components/Countdown';
import './HeroSection.css';

export default function HeroSection({
  lang,
  weddingConfig,
  isFlowerShowerActive,
  toggleFlowerShower,
  onOpenRsvp,
  onOpenGuestbook,
}) {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.hero-ganesha-badge',
        { opacity: 0, y: -25, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9 }
      )
        .fromTo(
          '.hero-main-title',
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.8 },
          '-=0.5'
        )
        .fromTo(
          '.hero-tagline',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4'
        )
        .fromTo(
          ['.arch-groom', '.arch-center-couple', '.arch-bride'],
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 },
          '-=0.3'
        )
        .fromTo(
          '.hero-interactive-strip',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.2'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const { groom, bride, date } = weddingConfig;

  return (
    <section id="home" className="hero-royal-section" ref={heroRef}>
      {/* Background with illuminated temple mandap */}
      <div className="hero-bg-wrapper">
        <div
          className="hero-mandap-bg"
          style={{ backgroundImage: `url('/images/royal-mandap.jpg')` }}
        />
        <div className="hero-gradient-overlay" />
      </div>

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
              src="/images/ganesh-ji.png"
              alt="भगवान श्री गणेश"
              className="ganesha-crest-img"
              onError={(e) => {
                e.currentTarget.src = '/images/ganesh-ji.avif';
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
            <div className="arch-inner-content">
              <span className="arch-role-tag">
                <span className="tag-text">{lang === 'hi' ? 'वर' : 'Groom'}</span>
              </span>
              <h2 className="arch-person-name">{groom.nameHi}</h2>
              <span className="arch-nickname">({groom.nicknameHi})</span>
              <div className="arch-ornament-line">
                <span className="line" />
                <span className="dot">✦</span>
                <span className="line" />
              </div>
              <p className="arch-relation">
                {lang === 'hi' ? 'सुपुत्र :' : 'Son of :'} {groom.fatherHi}
              </p>
              <p className="arch-relation-sub">
                {lang === 'hi' ? 'एवं' : '&'} {groom.motherHi}
              </p>
              <p className="arch-grand-relation">
                {lang === 'hi' ? 'सुपौत्र :' : 'Grandson of :'} {groom.grandfatherHi}
              </p>
            </div>
          </div>

          {/* Center: Bride & Groom Royal Portrait */}
          <div className="mandap-center-portrait arch-center-couple">
            <div className="couple-halo-frame">
              <div className="halo-glow" />
              <img
                src="/images/couple-illustration.jpg"
                alt="Sachin and Anjali Royal Wedding"
                className="couple-portrait-img"
              />
              <div className="varmala-badge">
                <Heart size={14} className="varmala-heart" />
                <span className="varmala-text">परिणय सूत्र</span>
              </div>
            </div>
          </div>

          {/* Right Arch: Bride (वधू) */}
          <div className="mandap-arch-pillar arch-bride">
            <div className="arch-inner-content">
              <span className="arch-role-tag">
                <span className="tag-text">{lang === 'hi' ? 'वधू' : 'Bride'}</span>
              </span>
              <h2 className="arch-person-name">{bride.nameHi}</h2>
              <span className="arch-nickname">
                {lang === 'hi' ? '(अंजलि)' : '(Anjali)'}
              </span>
              <div className="arch-ornament-line">
                <span className="line" />
                <span className="dot">✦</span>
                <span className="line" />
              </div>
              <p className="arch-relation">
                {lang === 'hi' ? 'सुपुत्री :' : 'Daughter of :'} {bride.fatherHi}
              </p>
              <p className="arch-relation-sub">
                {lang === 'hi' ? 'एवं' : '&'} {bride.motherHi}
              </p>
              <p className="arch-grand-relation">
                {lang === 'hi' ? 'सुपौत्री :' : 'Granddaughter of :'} {bride.grandfatherHi}
              </p>
            </div>
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
