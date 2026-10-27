import React from 'react';
import { ArrowUp, Heart } from 'lucide-react';
import './Footer.css';

export default function Footer({ lang, weddingConfig }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="royal-footer">
      <div className="footer-container">
        {/* Sacred Ganesha Symbol */}
        <div className="footer-crest" onClick={scrollToTop} role="button" tabIndex={0} title="श्री गणेशाय नमः • ऊपर जाएँ">
          <img
            src="/images/ganesh-ji.png"
            alt="श्री गणेश"
            className="footer-ganesha-img"
            onError={(e) => {
              e.currentTarget.src = '/images/ganesh-ji.avif';
            }}
          />
        </div>

        <h3 className="footer-couple-name">
          सचिन साहू (शनि) <i>संग</i> अंजलि साहू
        </h3>
        <p className="footer-sub-text">
          ॥ 09 दिसंबर 2026, बुधवार • हरी प्रिया गार्डन, भरुआ सुमेरपुर ॥
        </p>

        <div className="ornamental-divider">
          <span className="divider-line" />
          <span className="divider-symbol">卐</span>
          <span className="divider-line" />
        </div>

        <p className="footer-note-text">
          {lang === 'hi'
            ? weddingConfig.poetry.noteHi
            : weddingConfig.poetry.noteEn}
        </p>

        <div className="footer-family-sign">
          <span>॥ सप्रेम निमंत्रण — समस्त साहू परिवार ॥</span>
        </div>

        {/* Back to Top */}
        <button
          className="back-to-top-btn"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
        >
          <ArrowUp size={16} />
          <span>{lang === 'hi' ? 'शीर्ष पर जाएं' : 'Back to Top'}</span>
        </button>

        <div className="footer-copyright">
          <small>
            © 2026 • {lang === 'hi' ? 'प्रेम और परंपरा के साथ निर्मित' : 'Crafted with Royal Hindu Tradition & Love'}
          </small>
        </div>
      </div>
    </footer>
  );
}
