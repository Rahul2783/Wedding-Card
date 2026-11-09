import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import EventCard from '../components/EventCard';
import AnimatedDiya from '../components/AnimatedDiya';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './EventsSection.css';

gsap.registerPlugin(ScrollTrigger);

export default function EventsSection({ lang, events, venue }) {
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Section Header Reveal Timeline
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          once: true,
        },
      });

      headerTl
        .fromTo(
          '.events-section-header .section-eyebrow',
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        )
        .fromTo(
          '.events-section-header .section-title',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          '.events-section-header .ornamental-divider',
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.3'
        )
        .fromTo(
          '.events-section-header .section-subtitle',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.3'
        )
        // 2. Controlled Stagger for the 4 Event Cards (0.14s interval)
        .fromTo(
          '.event-arch-card',
          { opacity: 0, y: 40, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            stagger: 0.14,
            ease: 'power3.out',
          },
          '-=0.2'
        )
        .fromTo(
          '.events-diya-decor',
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
          '-=0.4'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="events" className="events-royal-section" ref={sectionRef}>
      <div className="section-shell">
        {/* Section Header */}
        <div className="section-header events-section-header">
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

        {/* Decorative Diya Base Accent */}
        <div className="events-diya-decor" style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
          <AnimatedDiya size="small" delay={0.4} />
        </div>
      </div>
    </section>
  );
}
