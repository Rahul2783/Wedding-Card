import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, MapPin, Compass } from 'lucide-react';
import './BaraatSection.css';

gsap.registerPlugin(ScrollTrigger);

export default function BaraatSection({ lang, baraat, venue }) {
  const baraatRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.baraat-image-card',
        { opacity: 0, scale: 0.95, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: baraatRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.baraat-detail-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: baraatRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, baraatRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="baraat" className="baraat-royal-section" ref={baraatRef}>
      <div className="section-shell">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <span>✦</span>
            <span>{lang === 'hi' ? 'शाही सवारी' : 'Royal Procession'}</span>
            <span>✦</span>
          </div>
          <h2 className="section-title">॥ बारात प्रस्थान ॥</h2>
          <div className="ornamental-divider">
            <span className="divider-line" />
            <span className="divider-symbol">👑</span>
            <span className="divider-line" />
          </div>
          <p className="section-subtitle">
            {lang === 'hi'
              ? 'ढोल-नगाड़ों एवं शहनाई की मंगल ध्वनि के संग प्रस्थान'
              : 'The celebratory Baraat procession with traditional royal fanfare'}
          </p>
        </div>

        {/* Baraat Showcase Card */}
        <div className="baraat-content-grid">
          {/* Visual: Ornate Golden Carriage Artwork */}
          <div className="baraat-image-card">
            <img
              src="/images/baraat-procession.jpg"
              alt="Royal Wedding Baraat Procession"
              className="baraat-img"
            />
            <div className="baraat-image-overlay" />
            <div className="baraat-banner-tag">
              <span className="star">★</span>
              <span className="tag-inner">{lang === 'hi' ? 'शुभ बारात' : 'Grand Baraat'}</span>
              <span className="star">★</span>
            </div>
          </div>

          {/* Details & Journey Timeline */}
          <div className="baraat-detail-card royal-card">
            <div className="corner-accent corner-top-left" />
            <div className="corner-accent corner-top-right" />
            <div className="corner-accent corner-bottom-left" />
            <div className="corner-accent corner-bottom-right" />

            {/* Authentic Royal Proclamation Box (As printed on physical wedding card) */}
            <div className="baraat-proclamation-frame">
              <div className="proclamation-crest">
                <span className="proclamation-bullet">::</span>
                <span className="proclamation-heading">
                  {lang === 'hi' ? 'बारात प्रस्थान' : 'Baraat Procession'}
                </span>
                <span className="proclamation-bullet">::</span>
              </div>

              <div className="proclamation-content">
                <p className="proclamation-line-top">
                  {lang === 'hi' ? (
                    <>
                      बारात हमारे निज निवास <span className="highlight-gold">कर्बला रोड कंचन पुरवा बाँदा</span> से{' '}
                      <span className="highlight-pill">सायं 4.00 बजे</span>{' '}
                      <span className="highlight-gold">निजी साधन द्वारा</span>
                    </>
                  ) : (
                    <>
                      The Baraat procession will depart from our residence at{' '}
                      <span className="highlight-gold">Karbala Road, Kanchan Purwa, Banda</span> at{' '}
                      <span className="highlight-pill">4:00 PM</span>{' '}
                      <span className="highlight-gold">via private conveyance</span>
                    </>
                  )}
                </p>

                <div className="proclamation-venue-highlight">
                  <span className="bracket">[</span>
                  <span className="quotes">“</span>
                  <span className="venue-title-text">
                    {lang === 'hi' ? 'हरि प्रिया गार्डन' : 'Hari Priya Garden'}
                  </span>
                  <span className="quotes">”</span>
                  <span className="bracket">]</span>
                </div>

                <p className="proclamation-line-bottom">
                  {lang === 'hi'
                    ? 'दुध डेरी रोड, भरुआ सुमेरपुर, जिला-हमीरपुर के लिए प्रस्थान करेगी।'
                    : 'for Dudh Dairy Road, Bharua Sumerpur, Hamirpur District.'}
                </p>
              </div>
            </div>

            {/* Quick Glance Key Details Grid */}
            <div className="baraat-quick-details">
              <div className="quick-detail-item">
                <div className="detail-icon-box">
                  <Clock size={18} />
                </div>
                <div className="detail-text-box">
                  <span className="detail-label">
                    {lang === 'hi' ? 'प्रस्थान समय' : 'Departure Time'}
                  </span>
                  <span className="detail-value">
                    {lang === 'hi' ? baraat.timeHi : baraat.timeEn}
                  </span>
                </div>
              </div>

              <div className="quick-detail-item">
                <div className="detail-icon-box">
                  <Compass size={18} />
                </div>
                <div className="detail-text-box">
                  <span className="detail-label">
                    {lang === 'hi' ? 'यात्रा साधन' : 'Conveyance'}
                  </span>
                  <span className="detail-value">
                    {lang === 'hi' ? baraat.modeHi : baraat.modeEn}
                  </span>
                </div>
              </div>

              <div className="quick-detail-item">
                <div className="detail-icon-box">
                  <MapPin size={18} />
                </div>
                <div className="detail-text-box">
                  <span className="detail-label">
                    {lang === 'hi' ? 'गंतव्य स्थल' : 'Destination'}
                  </span>
                  <span className="detail-value">
                    {lang === 'hi' ? venue.nameHi : venue.nameEn}
                  </span>
                </div>
              </div>
            </div>

            <div className="procession-timeline">
              {/* Departure Point */}
              <div className="timeline-node">
                <div className="node-icon-circle origin-icon">
                  <Clock size={20} />
                </div>
                <div className="node-info">
                  <span className="node-label">
                    {lang === 'hi' ? 'प्रस्थान समय एवं स्थल' : 'Departure Time & Point'}
                  </span>
                  <h4 className="node-title">
                    {lang === 'hi' ? baraat.timeHi : baraat.timeEn}
                  </h4>
                  <p className="node-address">
                    {lang === 'hi' ? baraat.originHi : baraat.originEn}
                  </p>
                </div>
              </div>

              {/* Connecting Journey Line */}
              <div className="timeline-connector">
                <div className="connector-line" />
                <div className="connector-badge">
                  <Compass size={14} />
                  <span className="badge-text">{lang === 'hi' ? 'शुभ यात्रा' : 'En Route'}</span>
                </div>
              </div>

              {/* Destination Point */}
              <div className="timeline-node">
                <div className="node-icon-circle destination-icon">
                  <MapPin size={20} />
                </div>
                <div className="node-info">
                  <span className="node-label">
                    {lang === 'hi' ? 'गंतव्य स्थल (विवाह स्थल)' : 'Destination Venue'}
                  </span>
                  <h4 className="node-title">
                    {lang === 'hi' ? venue.nameHi : venue.nameEn}
                  </h4>
                  <p className="node-address">
                    {lang === 'hi' ? venue.addressHi : venue.addressEn}
                  </p>
                </div>
              </div>
            </div>

            {/* Note from card */}
            <div className="baraat-footer-note">
              <span>🪈</span>
              <span>
                {lang === 'hi'
                  ? 'निजी साधन द्वारा प्रस्थान — आप सभी सपरिवार सादर आमंत्रित हैं।'
                  : 'Departure via private vehicle — you are cordially invited with family.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
