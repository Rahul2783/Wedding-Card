import React, { useState, useEffect } from 'react';
import { Menu, X, Music2, ChevronDown, Heart } from 'lucide-react';
import './Navbar.css';

export default function Navbar({
  lang,
  setLang,
  isMusicPlaying,
  toggleMusic,
  isFlowerShowerActive,
  toggleFlowerShower,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', labelHi: 'होम', labelEn: 'Home' },
    { href: '#about', labelHi: 'हमारे बारे में', labelEn: 'About' },
    { href: '#events', labelHi: 'कार्यक्रम', labelEn: 'Events' },
    { href: '#family', labelHi: 'परिवार', labelEn: 'Family' },
    { href: '#venue', labelHi: 'स्थान', labelEn: 'Venue' },
    { href: '#gallery', labelHi: 'गैलरी', labelEn: 'Gallery' },
    { href: '#rsvp', labelHi: 'RSVP', labelEn: 'RSVP' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`royal-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Mobile Menu Hamburger (Visible on Mobile Left) */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Left / Center Royal SA Monogram Logo */}
          <a href="#home" className="navbar-brand-monogram">
            <span className="brand-monogram-text">SA</span>
            <span className="brand-monogram-flourish">❦</span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="navbar-desktop-nav" aria-label="Main Navigation">
            {navLinks.map((item, idx) => (
              <React.Fragment key={item.href}>
                <a href={item.href} className="nav-link">
                  {lang === 'hi' ? item.labelHi : item.labelEn}
                </a>
                {idx < navLinks.length - 1 && <span className="nav-divider-dot">✦</span>}
              </React.Fragment>
            ))}
          </nav>

          {/* Right Action: Music Toggle Pill with Chevron */}
          <div className="navbar-right-actions">
            <button
              className={`music-royal-pill ${isMusicPlaying ? 'music-playing' : ''}`}
              onClick={toggleMusic}
              title={
                isMusicPlaying
                  ? (lang === 'hi' ? 'संगीत रोकें' : 'Pause Music')
                  : (lang === 'hi' ? 'शहनाई संगीत बजाएं' : 'Play Music')
              }
            >
              <Music2 size={15} className={`music-note-icon ${isMusicPlaying ? 'pulse-note' : ''}`} />
              <span className="music-pill-label">
                {lang === 'hi' ? 'संगीत' : 'Music'}
              </span>
              <ChevronDown size={13} className="music-chevron" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="drawer-overlay" onClick={() => setMobileMenuOpen(false)} />
        <div className="drawer-content">
          <div className="drawer-header">
            <div className="brand-monogram-text drawer-crest-sa">SA</div>
            <button
              className="drawer-close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <div className="drawer-divider">
            <span className="divider-line" />
            <span className="divider-symbol">卐</span>
            <span className="divider-line" />
          </div>

          <nav className="drawer-links">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="drawer-link"
                onClick={handleLinkClick}
              >
                <span>{lang === 'hi' ? item.labelHi : item.labelEn}</span>
                <span className="drawer-arrow">❧</span>
              </a>
            ))}
          </nav>

          <div className="drawer-footer-actions">
            <button
              className="drawer-action-btn"
              onClick={() => {
                toggleFlowerShower();
                setMobileMenuOpen(false);
              }}
            >
              🌸 पुष्प वर्षा: {isFlowerShowerActive ? 'चालू' : 'बंद'}
            </button>
            <button
              className="drawer-action-btn"
              onClick={() => {
                toggleMusic();
                setMobileMenuOpen(false);
              }}
            >
              {isMusicPlaying ? '⏸ संगीत रोकें' : '▶️ शहनाई संगीत सुनें'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
