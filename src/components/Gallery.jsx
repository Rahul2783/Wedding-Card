import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Eye, X, ChevronLeft, ChevronRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import './Gallery.css';

gsap.registerPlugin(ScrollTrigger);

export default function Gallery({ lang, items }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const galleryRef = useRef(null);

  const filteredItems = items.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.tag === activeFilter;
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gallery-item-card',
        { opacity: 0, scale: 0.92, y: 25 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: galleryRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, galleryRef);

    return () => ctx.revert();
  }, [activeFilter]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      if (e.key === 'Escape') setSelectedImage(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  const currentIndex = items.findIndex((i) => i.id === selectedImage?.id);

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % items.length;
    setSelectedImage(items[nextIdx]);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + items.length) % items.length;
    setSelectedImage(items[prevIdx]);
  };

  const filterTabs = [
    { key: 'all', labelHi: 'सभी झलकियाँ', labelEn: 'All Photos' },
    { key: 'couple', labelHi: 'वर-वधू छायाचित्र', labelEn: 'Couple Moments' },
    { key: 'invitation', labelHi: 'मूल निमंत्रण पत्र', labelEn: 'Original Cards' },
  ];

  return (
    <section id="gallery" className="gallery-royal-section" ref={galleryRef}>
      <div className="section-shell">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <span>✦</span>
            <span>{lang === 'hi' ? 'स्मृति संचयन' : 'Sacred Memories'}</span>
            <span>✦</span>
          </div>
          <h2 className="section-title">॥ फोटो गैलरी ॥</h2>
          <div className="ornamental-divider">
            <span className="divider-line" />
            <span className="divider-symbol">📸</span>
            <span className="divider-line" />
          </div>
          <p className="section-subtitle">
            {lang === 'hi'
              ? 'वर-वधू के मधुर पलों और पारंपरिक निमंत्रण पत्र की एक सुंदर झलक'
              : 'Glimpses of love, tradition and authentic wedding keepsakes'}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="gallery-filter-tabs">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              className={`filter-btn ${activeFilter === tab.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(tab.key)}
            >
              <span>{lang === 'hi' ? tab.labelHi : tab.labelEn}</span>
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="gallery-items-grid">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="gallery-item-card"
              onClick={() => setSelectedImage(item)}
              role="button"
              tabIndex={0}
              aria-label={`View ${item.titleHi}`}
            >
              <div className="gallery-frame-inner">
                <img
                  src={item.src}
                  alt={item.titleHi}
                  className="gallery-thumbnail"
                  loading="lazy"
                />
                <div className="gallery-card-overlay">
                  <div className="overlay-center-icon">
                    <Eye size={22} />
                  </div>
                  <div className="overlay-info">
                    <h4 className="overlay-title">
                      {lang === 'hi' ? item.titleHi : item.titleEn}
                    </h4>
                    <p className="overlay-caption">
                      {lang === 'hi' ? item.captionHi : item.captionEn}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={() => setSelectedImage(null)}>
          <div
            className="lightbox-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="lightbox-close-btn"
              onClick={() => setSelectedImage(null)}
              aria-label="Close photo"
            >
              <X size={24} />
            </button>

            <button
              className="lightbox-nav-btn prev-btn"
              onClick={handlePrev}
              aria-label="Previous photo"
            >
              <ChevronLeft size={28} />
            </button>

            <div className="lightbox-media-wrapper">
              <img
                src={selectedImage.src}
                alt={selectedImage.titleHi}
                className="lightbox-image"
              />
              <div className="lightbox-caption-bar">
                <h4 className="lightbox-title">
                  {lang === 'hi' ? selectedImage.titleHi : selectedImage.titleEn}
                </h4>
                <p className="lightbox-desc">
                  {lang === 'hi' ? selectedImage.captionHi : selectedImage.captionEn}
                </p>
              </div>
            </div>

            <button
              className="lightbox-nav-btn next-btn"
              onClick={handleNext}
              aria-label="Next photo"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
