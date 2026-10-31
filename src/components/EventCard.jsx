import React, { useState } from 'react';
import { Calendar, ChevronDown, Download, ExternalLink } from 'lucide-react';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import './EventCard.css';

export default function EventCard({ event, index, lang, venue }) {
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);

  // Image-based icons for each event
  const eventIconMap = {
    havan: '/images/Agni.png',
    kalash: '/images/Kalash.png',
    couple: '/images/Vivah.png',
    doli: '/images/Doli.png',
  };

  const renderEventIcon = (type) => {
    const src = eventIconMap[type];
    if (src) {
      return (
        <img
          src={src}
          alt={type}
          className={`event-img-icon event-img-${type}`}
        />
      );
    }
    return <Calendar size={36} className="event-default-icon" />;
  };

  const handleGoogleCalendar = () => {
    const url = generateGoogleCalendarUrl(event, venue.nameHi, venue.addressHi);
    window.open(url, '_blank', 'noopener,noreferrer');
    setShowCalendarMenu(false);
  };

  const handleIcsDownload = () => {
    downloadIcsFile(event, venue.nameHi, venue.addressHi);
    setShowCalendarMenu(false);
  };

  return (
    <article className="event-arch-card" style={{ animationDelay: `${index * 120}ms` }}>
      {/* 1. Badge at Top */}
      <div className="card-badge-wrap">
        <span className="arch-badge">
          <span className="badge-text">{event.badgeHi}</span>
        </span>
      </div>

      {/* 2. Photo in dome */}
      <div className="card-arch-top">
        <div className="event-icon-circle">{renderEventIcon(event.iconType)}</div>
      </div>

      {/* 3. Text Body */}
      <div className="card-body">
        {/* Date (07-12-2026, सोमवार) */}
        <div className="event-date-pill">
          <Calendar size={12} className="calendar-icon" />
          <span className="date-pill-text">{event.dateHi}</span>
        </div>

        {/* Hindi Title (मण्डपाच्छादन) */}
        <h3 className="event-name-hi">{event.titleHi}</h3>

        {/* English Title (Mandapachchhadan) */}
        <p className="event-name-en">{event.titleEn}</p>

        {/* Description (शुभ मंडप प्रतिष्ठा एवं वैदिक हवन पूजन) */}
        <p className="event-desc">{event.descriptionHi}</p>
      </div>

      {/* 4. Add to Calendar Button */}
      <div className="calendar-action-container">
        <button
          type="button"
          className="btn-add-calendar"
          onClick={() => setShowCalendarMenu(!showCalendarMenu)}
          aria-expanded={showCalendarMenu}
          aria-label="Add event to calendar"
        >
          <Calendar size={13} className="cal-btn-icon" />
          <span className="cal-btn-text">कैलेंडर में जोड़ें</span>
          <ChevronDown size={11} className={`chevron ${showCalendarMenu ? 'rotated' : ''}`} />
        </button>

        {showCalendarMenu && (
          <div className="calendar-dropdown-menu">
            <button type="button" className="dropdown-item" onClick={handleGoogleCalendar}>
              <ExternalLink size={13} />
              <span>Google Calendar</span>
            </button>
            <button type="button" className="dropdown-item" onClick={handleIcsDownload}>
              <Download size={13} />
              <span>Apple / iCal (.ics)</span>
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
