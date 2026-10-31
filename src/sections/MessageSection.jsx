import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Music } from 'lucide-react';
import './MessageSection.css';

gsap.registerPlugin(ScrollTrigger);

export default function MessageSection({ lang, balAagrah, poetry }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.parchment-message-card',
        { opacity: 0, scale: 0.94, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="message-royal-section" ref={sectionRef}>
      <div className="section-shell">
        <div className="parchment-message-card royal-card">
          <div className="corner-accent corner-top-left" />
          <div className="corner-accent corner-top-right" />
          <div className="corner-accent corner-bottom-left" />
          <div className="corner-accent corner-bottom-right" />

          {/* Top Traditional Welcome Poetry */}
          <div className="poetry-banner">
            <span className="flourish">❧</span>
            <p className="poetry-lines">
              {lang === 'hi' ? poetry.welcomeHi : poetry.welcomeEn}
            </p>
            <span className="flourish">❧</span>
          </div>

          <div className="ornamental-divider">
            <span className="divider-line" />
            <span className="divider-symbol">ॐ</span>
            <span className="divider-line" />
          </div>

          {/* Bal Aagrah Card Box */}
          <div className="bal-aagrah-box">
            <div className="bal-header">
              <span className="badge-flank">✦</span>
              <h3 className="bal-title">॥ बाल आग्रह ॥</h3>
              <span className="badge-flank">✦</span>
            </div>

            <div className="bal-content-row">
              {/* Dholak Illustration */}
              <div className="instrument-col instrument-dholak">
                <img
                  src="/images/Dholak.png"
                  alt="बाजे ढोल"
                  className="instrument-img dholak-img"
                />
                <span className="instrument-label">बाजे ढोल</span>
              </div>

              {/* Shloka Text */}
              <div className="shloka-center">
                <p className="bal-rhyme">
                  {lang === 'hi' ? (
                    <>
                      बाजे ढोल, गूंजे शहनाई, शादी की तारीख है आई...
                      <br />
                      ना कोई चिट्ठी ना कोई बहाना हमारे मामा की शादी में जरूर जरूर आना...
                    </>
                  ) : (
                    balAagrah.shlokaEn
                  )}
                </p>
                <div className="kids-signature">
                  <Heart size={14} className="heart-inline" />
                  <span>
                    {lang === 'hi'
                      ? `स्नेहाकांक्षी: ${balAagrah.kidsHi}`
                      : `With Love: ${balAagrah.kidsEn}`}
                  </span>
                  <Heart size={14} className="heart-inline" />
                </div>
              </div>

              {/* Shehnai Illustration */}
              <div className="instrument-col instrument-shehnai">
                <img
                  src="/images/Shehnai.png"
                  alt="गूंजे शहनाई"
                  className="instrument-img shehnai-img"
                />
                <span className="instrument-label">गूंजे शहनाई</span>
              </div>
            </div>
          </div>

          {/* Blessing Message */}
          <div className="family-invitation-message">
            <p className="invitation-text">
              {lang === 'hi' ? poetry.blessingHi : poetry.blessingEn}
            </p>
            <div className="respect-note">
              <span>🌺</span>
              <span>{lang === 'hi' ? poetry.noteHi : poetry.noteEn}</span>
              <span>🌺</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
