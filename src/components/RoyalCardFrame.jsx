import React from 'react';
import './RoyalCardFrame.css';

export default function RoyalCardFrame({ children }) {
  return (
    <div className="royal-invitation-frame-wrapper">
      {/* Fixed Ambient Screen Border & Corner Flourishes */}
      <div className="royal-fixed-screen-frame" aria-hidden="true">
        {/* 4 Ornate Golden Corners */}
        <div className="screen-corner corner-tl">
          <svg viewBox="0 0 48 48" className="corner-flourish-svg">
            <path d="M4 44 V12 C4 7 7 4 12 4 H44" fill="none" stroke="#FFD875" strokeWidth="2.5" />
            <path d="M10 44 V16 C10 12 12 10 16 10 H44" fill="none" stroke="#D4A64A" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="12" cy="12" r="3.5" fill="#FFD875" />
            <path d="M4 4 L14 14" stroke="#FFD875" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="screen-corner corner-tr">
          <svg viewBox="0 0 48 48" className="corner-flourish-svg">
            <path d="M4 4 H36 C41 4 44 7 44 12 V44" fill="none" stroke="#FFD875" strokeWidth="2.5" />
            <path d="M4 10 H32 C36 10 38 12 38 16 V44" fill="none" stroke="#D4A64A" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="36" cy="12" r="3.5" fill="#FFD875" />
            <path d="M44 4 L34 14" stroke="#FFD875" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="screen-corner corner-bl">
          <svg viewBox="0 0 48 48" className="corner-flourish-svg">
            <path d="M4 4 V36 C4 41 7 44 12 44 H44" fill="none" stroke="#FFD875" strokeWidth="2.5" />
            <path d="M10 4 V32 C10 36 12 38 16 38 H44" fill="none" stroke="#D4A64A" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="12" cy="36" r="3.5" fill="#FFD875" />
            <path d="M4 44 L14 34" stroke="#FFD875" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="screen-corner corner-br">
          <svg viewBox="0 0 48 48" className="corner-flourish-svg">
            <path d="M4 44 H36 C41 44 44 41 44 36 V4" fill="none" stroke="#FFD875" strokeWidth="2.5" />
            <path d="M4 38 H32 C36 38 38 36 38 32 V4" fill="none" stroke="#D4A64A" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="36" cy="36" r="3.5" fill="#FFD875" />
            <path d="M44 44 L34 34" stroke="#FFD875" strokeWidth="1.5" />
          </svg>
        </div>

        {/* 4 Border Bars */}
        <div className="screen-border-bar border-top" />
        <div className="screen-border-bar border-bottom" />
        <div className="screen-border-bar border-left" />
        <div className="screen-border-bar border-right" />
      </div>

      {/* Main Content inside Frame */}
      <div className="royal-invitation-inner-content">
        {children}
      </div>
    </div>
  );
}
