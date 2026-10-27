import React, { useState } from 'react';
import { Calendar, ChevronDown, Download, ExternalLink } from 'lucide-react';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import './EventCard.css';

export default function EventCard({ event, index, lang, venue }) {
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);

  // Traditional SVG icons for each event
  const renderEventIcon = (type) => {
    switch (type) {
      case 'havan':
        return (
          <svg viewBox="0 0 64 64" className="event-svg-icon" fill="none">
            {/* Havan Kund fire altar */}
            <path d="M12 44h40l-6 12H18l-6-12z" fill="#D4A64A" stroke="#FFD875" strokeWidth="2" />
            <path d="M16 44l16-8 16 8" stroke="#FFD875" strokeWidth="2" />
            {/* Flames */}
            <path d="M32 12c-4 8 2 12-1 18 6-3 9-9 7-14-3 5-5 5-6-4z" fill="#ff4500" />
            <path d="M26 22c-3 6 1 10 0 14 4-2 6-6 4-11-2 4-3 4-4-3z" fill="#ffaa00" />
            <path d="M38 22c3 6-1 10 0 14-4-2-6-6-4-11 2 4 3 4 4-3z" fill="#ffaa00" />
            <path d="M32 20c-2 4 1 6 0 9 3-1 4-4 3-7-1 2-2 2-3-2z" fill="#fff" />
          </svg>
        );
      case 'kalash':
        return (
          <svg viewBox="0 0 64 64" className="event-svg-icon" fill="none">
            {/* Mangal Kalash pot */}
            <path d="M20 30c-6 4-6 16 0 22h24c6-6 6-18 0-22H20z" fill="#D4A64A" stroke="#FFD875" strokeWidth="2" />
            <path d="M22 30h20v-4H22v4z" fill="#FFD875" />
            {/* Coconut & Mango Leaves */}
            <circle cx="32" cy="18" r="8" fill="#8B4513" stroke="#D4A64A" strokeWidth="2" />
            <path d="M24 24c-8-6-6-14-2-16 4 4 4 10 2 16z" fill="#2e7d32" />
            <path d="M40 24c8-6 6-14 2-16-4 4-4 10-2 16z" fill="#2e7d32" />
            {/* Swastika on pot */}
            <path d="M32 37v8M28 41h8M28 37h4M32 45h4M28 45v-4M36 37v4" stroke="#c01525" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'couple':
        return (
          <svg viewBox="0 0 64 64" className="event-svg-icon" fill="none">
            {/* Varmala ceremony couple */}
            <circle cx="24" cy="20" r="7" fill="#FFD875" />
            <circle cx="40" cy="20" r="7" fill="#FFD875" />
            {/* Groom Turban & Bride Dupatta */}
            <path d="M17 19c0-6 7-8 14-6" stroke="#c01525" strokeWidth="3" />
            <path d="M33 19c0-6 7-8 14-6" stroke="#c01525" strokeWidth="3" />
            {/* Bodies & Varmala */}
            <path d="M16 48c0-12 8-16 16-16s16 4 16 16" fill="#7a0815" stroke="#D4A64A" strokeWidth="2" />
            <path d="M20 34c6 8 18 8 24 0" stroke="#ffaa00" strokeWidth="3" strokeDasharray="3 3" />
            <circle cx="32" cy="38" r="3" fill="#ff334b" />
          </svg>
        );
      case 'doli':
        return (
          <svg viewBox="0 0 64 64" className="event-svg-icon" fill="none">
            {/* Royal Doli / Palki */}
            <path d="M6 30h52" stroke="#FFD875" strokeWidth="3" strokeLinecap="round" />
            <path d="M18 30v18h28v-18" fill="#7a0815" stroke="#D4A64A" strokeWidth="2" />
            <path d="M16 30l16-12 16 12" fill="#D4A64A" stroke="#FFD875" strokeWidth="2" />
            <circle cx="32" cy="14" r="3" fill="#FFD875" />
            <path d="M22 36h20v8H22z" fill="#250006" stroke="#FFD875" strokeWidth="1" />
          </svg>
        );
      default:
        return <Calendar size={36} className="event-default-icon" />;
    }
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
      {/* Arch Scallop Head */}
      <div className="card-arch-top">
        <span className="arch-badge">
          <span className="badge-text">{lang === 'hi' ? event.badgeHi : event.badgeEn}</span>
        </span>
        <div className="event-icon-circle">{renderEventIcon(event.iconType)}</div>
      </div>

      <div className="card-body">
        {/* Date Tag */}
        <div className="event-date-pill">
          <Calendar size={14} className="calendar-icon" />
          <span className="date-pill-text">{lang === 'hi' ? event.dateHi : event.dateEn}</span>
        </div>

        {/* Title */}
        <h3 className="event-name-hi">{event.titleHi}</h3>
        <p className="event-name-en">{event.titleEn}</p>

        <div className="event-divider-line" />

        {/* Description */}
        <p className="event-desc">
          {lang === 'hi' ? event.descriptionHi : event.descriptionEn}
        </p>

        {/* Add to Calendar Action */}
        <div className="calendar-action-container">
          <button
            type="button"
            className="btn-add-calendar"
            onClick={() => setShowCalendarMenu(!showCalendarMenu)}
            aria-expanded={showCalendarMenu}
            aria-label="Add event to calendar"
          >
            <Calendar size={16} />
            <span className="cal-btn-text">{lang === 'hi' ? 'कैलेंडर में जोड़ें' : 'Add to Calendar'}</span>
            <ChevronDown size={14} className={`chevron ${showCalendarMenu ? 'rotated' : ''}`} />
          </button>

          {showCalendarMenu && (
            <div className="calendar-dropdown-menu">
              <button type="button" className="dropdown-item" onClick={handleGoogleCalendar}>
                <ExternalLink size={15} />
                <span>Google Calendar</span>
              </button>
              <button type="button" className="dropdown-item" onClick={handleIcsDownload}>
                <Download size={15} />
                <span>Apple / iCal (.ics)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
