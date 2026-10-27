import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, PhoneCall, ExternalLink, Calendar, Sparkles } from 'lucide-react';
import './VenueSection.css';

gsap.registerPlugin(ScrollTrigger);

export default function VenueSection({ lang, venue, weddingDate }) {
  const venueRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.venue-card-wrapper',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: venueRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, venueRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="venue" className="venue-royal-section" ref={venueRef}>
      <div className="section-shell">
        {/* Section Header */}
        <div className="section-header">
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
