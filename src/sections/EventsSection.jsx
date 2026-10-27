import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import EventCard from '../components/EventCard';
import './EventsSection.css';

gsap.registerPlugin(ScrollTrigger);

export default function EventsSection({ lang, events, venue }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.event-arch-card',
        { opacity: 0, y: 35, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="events" className="events-royal-section" ref={sectionRef}>
      <div className="section-shell">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <span>✦</span>
            <span>{lang === 'hi' ? 'शुभ तिथियाँ' : 'Auspicious Dates'}</span>
            <span>✦</span>
          </div>
          <h2 className="section-title">॥ मांगलिक कार्यक्रम ॥</h2>
          <div className="ornamental-divider">
            <span className="divider-line" />
            <span className="divider-symbol">卐</span>
            <span className="divider-line" />
          </div>
          <p className="section-subtitle">
            {lang === 'hi'
              ? 'परमपिता परमेश्वर की असीम अनुकम्पा से आयोजित पावन विवाह प्रसंग'
              : 'Join us to celebrate the auspicious rituals and sacred ceremonies'}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="events-grid-layout">
          {events.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              lang={lang}
              venue={venue}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
