import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Send, MessageCircle } from 'lucide-react';
import './GuestbookSection.css';

export default function GuestbookSection({ lang, onFlowerShower }) {
  const initialWishes = [
    {
      id: 1,
      name: 'रमेश एवं सुनीता साहू',
      city: 'कानपुर',
      message: 'सचिन और अंजलि को वैवाहिक जीवन की अनंत मंगलकामनाएं! ईश्वर आपकी जोड़ी को सदा खुशहाल रखे।',
      date: 'अभी-अभी',
    },
    {
      id: 2,
      name: 'अमित कुमार गुप्ता',
      city: 'बांदा',
      message: 'मामा की शादी का बहुत-बहुत उत्साह! हार्दिक बधाई एवं शुभकामनाएं।',
      date: 'आज',
    },
    {
      id: 3,
      name: 'डॉ. विवेक एवं परिवार',
      city: 'लखनऊ',
      message: 'A very happy married life to Sachin & Anjali! May love and prosperity always blossom.',
      date: 'कल',
    },
  ];

  const [wishes, setWishes] = useState(() => {
    try {
      const saved = localStorage.getItem('sachin_anjali_guestbook');
      return saved ? JSON.parse(saved) : initialWishes;
    } catch {
      return initialWishes;
    }
  });

  const [author, setAuthor] = useState('');
  const [city, setCity] = useState('');
  const [text, setText] = useState('');

  const handleAddWish = (e) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;

    const newWish = {
      id: Date.now(),
      name: author.trim(),
      city: city.trim() || (lang === 'hi' ? 'शुभचिंतक' : 'Well Wisher'),
      message: text.trim(),
      date: lang === 'hi' ? 'अभी-अभी' : 'Just now',
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    try {
      localStorage.setItem('sachin_anjali_guestbook', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setAuthor('');
    setCity('');
    setText('');

    // Trigger celebratory flower shower!
    if (onFlowerShower) {
      onFlowerShower();
    }
  };

  return (
    <section id="guestbook" className="guestbook-royal-section">
      <div className="section-shell">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <span>✦</span>
            <span>{lang === 'hi' ? 'स्नेह संदेश' : 'Traditional Blessings'}</span>
            <span>✦</span>
          </div>
          <h2 className="section-title">॥ शुभ आशीर्वाद पुस्तिका ॥</h2>
          <div className="ornamental-divider">
            <span className="divider-line" />
            <span className="divider-symbol">🌸</span>
            <span className="divider-line" />
          </div>
          <p className="section-subtitle">
            {lang === 'hi'
              ? 'वर-वधू के नवजीवन हेतु अपने स्नेहिल शब्द एवं पावन आशीर्वाद अर्पित करें'
              : 'Leave your heartfelt blessings and warm wishes for Sachin & Anjali'}
          </p>
        </div>

        <div className="guestbook-grid">
          {/* Write Wish Card */}
          <div className="write-wish-card royal-card">
            <div className="corner-accent corner-top-left" />
            <div className="corner-accent corner-top-right" />
            <div className="corner-accent corner-bottom-left" />
            <div className="corner-accent corner-bottom-right" />

            <h3 className="card-form-heading">
              <Sparkles size={18} className="gold-sparkle" />
              <span>{lang === 'hi' ? 'शुभकामना संदेश लिखें' : 'Send Your Blessing'}</span>
            </h3>

            <form onSubmit={handleAddWish} className="guestbook-form">
              <div className="form-group">
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder={lang === 'hi' ? 'आपका नाम *' : 'Your Name *'}
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder={lang === 'hi' ? 'स्थान / शहर (उदा. बांदा, लखनऊ)' : 'Your City / Town'}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="form-group">
                <textarea
                  rows="3"
                  required
                  className="form-textarea"
                  placeholder={lang === 'hi' ? 'वर-वधू के लिए आपका स्नेहिल आशीर्वाद...' : 'Your blessings for the couple...'}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-royal-primary write-submit-btn">
                <Heart size={16} />
                <span>{lang === 'hi' ? 'आशीर्वाद समर्पित करें' : 'Post Blessing'}</span>
              </button>

              <p className="guestbook-demo-disclaimer">
                <span>ℹ️</span>
                <span>
                  {lang === 'hi'
                    ? 'नोट: यह एक क्लाइंट-साइड प्रदर्शन है; संदेश आपके इस ब्राउज़र में सहेजे जाते हैं।'
                    : 'Note: This is a client-side guestbook demonstration; messages are stored locally in your browser.'}
                </span>
              </p>
            </form>
          </div>

          {/* List of Blessings */}
          <div className="wishes-stream">
            {wishes.map((w) => (
              <div key={w.id} className="wish-card-item royal-card">
                <div className="wish-top-row">
                  <div className="author-details">
                    <h4 className="author-name">{w.name}</h4>
                    <span className="author-city">{w.city}</span>
                  </div>
                  <span className="wish-time-badge">{w.date}</span>
                </div>
                <p className="wish-message-body">"{w.message}"</p>
                <div className="wish-bottom-ornament">
                  <Heart size={12} className="tiny-heart" />
                  <span className="blessing-tag">॥ सदा सुहागन रहो ॥</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
