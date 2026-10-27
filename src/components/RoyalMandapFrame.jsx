import React from 'react';
import './RoyalMandapFrame.css';

export default function RoyalMandapFrame({ children }) {
  return (
    <div className="royal-mandap-main-frame">
      {/* Outer Golden Filigree Border & Glow */}
      <div className="mandap-outer-border-line" />

      {/* Top Hanging Toran Garland with Brass Bells */}
      <div className="mandap-frame-top-toran">
        <img
          src="/images/top-mandap-toran.png"
          alt="Royal Marigold Toran with Brass Bells"
          className="top-toran-img"
        />
      </div>

      {/* Left Carved Temple Pillar */}
      <div className="mandap-pillar mandap-pillar-left">
        <img
          src="/images/left-temple-pillar.png"
          alt="Carved Golden Temple Pillar Left"
          className="pillar-img"
        />
      </div>

      {/* Right Carved Temple Pillar */}
      <div className="mandap-pillar mandap-pillar-right">
        <img
          src="/images/right-temple-pillar.png"
          alt="Carved Golden Temple Pillar Right"
          className="pillar-img"
        />
      </div>

      {/* Inner Invitation Content (Hero, Events, Baraat, Venue, Bottom Panels) */}
      <div className="mandap-frame-inner-body">
        {children}
      </div>
    </div>
  );
}
