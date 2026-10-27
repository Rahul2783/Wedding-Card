import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';
import './Countdown.css';

export default function Countdown({ lang, dateConfig, showDateBadge = true }) {
  const { days, hours, minutes, seconds } = useCountdown(dateConfig?.iso || '2026-12-09T00:00:00+05:30');

  const units = [
    { value: days, labelHi: 'दिन', labelEn: 'Days' },
    { value: hours, labelHi: 'घंटे', labelEn: 'Hours' },
    { value: minutes, labelHi: 'मिनट', labelEn: 'Minutes' },
    { value: seconds, labelHi: 'सेकेंड', labelEn: 'Seconds' },
  ];

  return (
    <div className="royal-countdown-container">
      {/* Auspicious Wedding Date Badge */}
      {showDateBadge && (
        <div className="countdown-date-badge">
          <Calendar size={18} className="badge-icon" />
          <span className="badge-date-text">
            {lang === 'hi' ? dateConfig.displayHi : dateConfig.displayEn}
          </span>
        </div>
      )}

      {/* 4 Ornate Golden Countdown Boxes matching reference layout */}
      <div className="countdown-grid">
        {units.map((unit, index) => (
          <div key={index} className="countdown-box">
            <div className="count-number">{unit.value}</div>
            <div className="count-label">
              {lang === 'hi' ? unit.labelHi : unit.labelEn}
            </div>
            <div className="count-sub-label">
              {lang === 'hi' ? unit.labelEn : unit.labelHi}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
