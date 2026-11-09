import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, PhoneCall, ExternalLink, Calendar, Sparkles } from 'lucide-react';
import AnimatedDiya from './AnimatedDiya';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './VenueSection.css';

gsap.registerPlugin(ScrollTrigger);

export default function VenueSection({ lang, venue, weddingDate }) {
  const venueRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: venueRef.current,
          start: 'top 80%',
          once: true,
        },
        defaults: { ease: 'power2.out' },
      });

      // 1. Section Header Reveal
      tl.fromTo(
        '.venue-header-group .section-eyebrow',
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
        .fromTo(
          '.venue-header-group .section-title',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          '.venue-header-group .ornamental-divider',
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.5 },
          '-=0.3'
        )
        .fromTo(
          '.venue-header-group .section-subtitle',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.3'
        )
        // 2. Main Venue Card Entrance
        .fromTo(
          '.venue-card-wrapper',
          { opacity: 0, y: 35, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.2'
        )
        // 3. Image and Info Columns Stagger
        .fromTo(
          '.venue-image-box',
          { opacity: 0, x: -25 },
          { opacity: 1, x: 0, duration: 0.75 },
          '-=0.5'
        )
        .fromTo(
          '.venue-info-box > *',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
          '-=0.4'
        );
    }, venueRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="venue" className="venue-royal-section" ref={venueRef}>
      <div className="section-shell">
        {/* Section Header */}
        <div className="section-header venue-header-group">
          <div className="section-eyebrow">
            <span>✦</span>
            <span>{lang === 'hi' ? 'शुभ विवाह स्थल' : 'Wedding Venue'}</span>
            <span>✦</span>
          </div>
          <h2 className="section-title">॥ विवाह स्थल ॥</h2>
          <div className="ornamental-divider">
            <span className="divider-line" />
            <span className="divider-symbol">🏛️</span>
            <span className="divider-line" />
          </div>
          <p className="section-subtitle">
            {lang === 'hi'
              ? 'आपकी गरिमामयी उपस्थिति हमारे इस मांगलिक उत्सव को और अधिक पावन बनाएगी'
              : 'Your presence will bless this sacred union and multiply our joy'}
          </p>
        </div>

        {/* Venue Grand Card */}
        <div className="venue-card-wrapper royal-card">
          <div className="corner-accent corner-top-left" />
          <div className="corner-accent corner-top-right" />
          <div className="corner-accent corner-bottom-left" />
          <div className="corner-accent corner-bottom-right" />

          <div className="venue-card-grid">
            {/* Venue Image */}
            <div className="venue-image-box">
              <img
                src="/images/venue-garden.jpg"
                alt="Hari Priya Garden Wedding Lawn"
                className="venue-showcase-img"
              />
              <div className="venue-img-glow" />
              <div className="venue-name-overlay-badge">
                <Sparkles size={15} />
                <span className="badge-text">{venue.nameHi}</span>
              </div>
            </div>

            {/* Venue Details & Interactive Map Actions */}
            <div className="venue-info-box">
              <span className="venue-kicker">
                {lang === 'hi' ? 'शुभ विवाह मंडप' : 'Grand Wedding Destination'}
              </span>
              <h3 className="venue-main-name">
                {lang === 'hi' ? venue.nameHi : venue.nameEn}
              </h3>

              <div className="venue-address-item">
                <MapPin size={22} className="venue-pin-icon" />
                <div className="address-texts">
                  <p className="address-full">
                    {lang === 'hi' ? venue.addressHi : venue.addressEn}
                  </p>
                  <span className="address-landmark">
                    {lang === 'hi'
                      ? '(भरुआ सुमेरपुर, जिला - हमीरपुर, उत्तर प्रदेश)'
                      : '(Bharua Sumerpur, District Hamirpur, U.P.)'}
                  </span>
                </div>
              </div>

              {/* Date & Ceremony Badge */}
              <div className="venue-datetime-badge">
                <Calendar size={18} />
                <span className="badge-text">
                  {lang === 'hi'
                    ? '09 दिसंबर 2026, बुधवार (शुभ विवाह)'
                    : '09 December 2026, Wednesday (Wedding Day)'}
                </span>
              </div>

              {/* Action Buttons as requested */}
              <div className="venue-actions-row">
                {/* स्थान देखें Button */}
                <a
                  href={venue.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-royal-primary venue-action-btn"
                >
                  <MapPin size={18} />
                  <span>{lang === 'hi' ? 'स्थान देखें' : 'View Location'}</span>
                  <ExternalLink size={15} />
                </a>

                {/* Call / Navigation Button */}
                <a
                  href={`tel:${venue.phone}`}
                  className="btn-royal-outline venue-action-btn"
                >
                  <PhoneCall size={18} />
                  <span>{lang === 'hi' ? 'Call / Navigation' : 'Call / Directions'}</span>
                </a>
              </div>

              {/* Contact Assistance Phone Numbers from Original Card */}
              <div className="venue-contact-strip">
                <span className="contact-label">
                  {lang === 'hi' ? 'सम्पर्क सूत्र (साहू परिवार) :' : 'Contact Numbers :'}
                </span>
                <div className="contact-numbers-list">
                  {venue.allPhones.map((ph, idx) => (
                    <a key={idx} href={`tel:+91${ph}`} className="phone-link">
                      +91 {ph}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
