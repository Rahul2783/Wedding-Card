import React, { useState } from 'react';
import { Send, Heart, Users, CheckCircle, MessageSquare, Phone } from 'lucide-react';
import './RSVPForm.css';

export default function RSVPForm({ lang, phone, groomName, brideName, weddingDate }) {
  const [formData, setFormData] = useState({
    name: '',
    guests: '2',
    status: 'attending', // 'attending' or 'declined'
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    // Generate prefilled WhatsApp text
    const statusText =
      formData.status === 'attending'
        ? 'हर्षपूर्वक उपस्थित होंगे (Joyfully Attending)'
        : 'उपस्थित होने में असमर्थ (Unable to Attend with Best Wishes)';

    const waText = encodeURIComponent(
      `॥ श्री गणेशाय नमः ॥\n\n` +
      `सादर नमस्ते साहू परिवार!\n\n` +
      `सचिन साहू (शनि) संग अंजलि साहू के शुभ विवाह (09 दिसंबर 2026) के लिए हमारा RSVP:\n\n` +
      `• अतिथि का नाम: ${formData.name}\n` +
      `• अतिथियों की संख्या: ${formData.guests}\n` +
      `• उपस्थिति स्थिति: ${statusText}\n` +
      (formData.message.trim() ? `• शुभकामना संदेश: "${formData.message}"\n\n` : '\n') +
      `वर-वधू को हमारा हार्दिक शुभ आशीर्वाद!`
    );

    // Clean phone number (digits only)
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${waText}`;

    // Open WhatsApp
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <section id="rsvp" className="rsvp-royal-section">
      <div className="section-shell">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <span>✦</span>
            <span>{lang === 'hi' ? 'स्नेह निमंत्रण' : 'Warm Invitation'}</span>
            <span>✦</span>
          </div>
          <h2 className="section-title">॥ RSVP भेजें ॥</h2>
          <div className="ornamental-divider">
            <span className="divider-line" />
            <span className="divider-symbol">💌</span>
            <span className="divider-line" />
          </div>
          <p className="section-subtitle">
            {lang === 'hi'
              ? 'आपकी गरिमामयी उपस्थिति हमारे इस मांगलिक आयोजन की शोभा बढ़ाएगी। कृपया अपनी उपस्थिति सुनिश्चित करें।'
              : 'Please let us know your presence so we may warmly welcome you and your family.'}
          </p>
        </div>

        {/* RSVP Form Box */}
        <div className="rsvp-form-wrapper royal-card">
          <div className="corner-accent corner-top-left" />
          <div className="corner-accent corner-top-right" />
          <div className="corner-accent corner-bottom-left" />
          <div className="corner-accent corner-bottom-right" />

          {submitted ? (
            <div className="rsvp-success-state">
              <div className="success-icon-halo">
                <CheckCircle size={48} className="gold-icon" />
              </div>
              <h3 className="success-title">
                {lang === 'hi' ? 'हार्दिक धन्यवाद!' : 'Thank You!'}
              </h3>
              <p className="success-msg">
                {lang === 'hi'
                  ? 'आपका RSVP WhatsApp के माध्यम से प्रेषित किया जा रहा है। आपके आगमन की प्रतीक्षा में साहू परिवार।'
                  : 'Your RSVP details have been prepared for WhatsApp. We eagerly await your presence.'}
              </p>
              <button
                className="btn-royal-outline"
                onClick={() => setSubmitted(false)}
              >
                {lang === 'hi' ? 'अन्य RSVP भेजें' : 'Send Another RSVP'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rsvp-actual-form">
              {/* Name Field */}
              <div className="form-group">
                <label className="form-label" htmlFor="guestName">
                  {lang === 'hi' ? 'आपका शुभ नाम *' : 'Your Full Name *'}
                </label>
                <input
                  id="guestName"
                  type="text"
                  required
                  className="form-input"
                  placeholder={lang === 'hi' ? 'उदा. श्री राजेश कुमार एवं परिवार' : 'e.g. Mr. Rajesh Kumar & Family'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Number of Guests */}
              <div className="form-group">
                <label className="form-label" htmlFor="guestCount">
                  {lang === 'hi' ? 'अतिथियों की संख्या (सपरिवार)' : 'Number of Guests Attending'}
                </label>
                <div className="guests-select-wrap">
                  <select
                    id="guestCount"
                    className="form-select"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  >
                    <option value="1">1 {lang === 'hi' ? 'व्यक्ति' : 'Guest'}</option>
                    <option value="2">2 {lang === 'hi' ? 'व्यक्ति' : 'Guests'}</option>
                    <option value="3">3 {lang === 'hi' ? 'व्यक्ति' : 'Guests'}</option>
                    <option value="4">4 {lang === 'hi' ? 'व्यक्ति' : 'Guests'}</option>
                    <option value="5+">5+ {lang === 'hi' ? 'सपरिवार (Family)' : 'Full Family'}</option>
                  </select>
                </div>
              </div>

              {/* Attendance Status Radios */}
              <div className="form-group">
                <label className="form-label">
                  {lang === 'hi' ? 'उपस्थिति स्थिति' : 'Attendance Status'}
                </label>
                <div className="status-options-row">
                  <label className={`status-pill ${formData.status === 'attending' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="status"
                      value="attending"
                      checked={formData.status === 'attending'}
                      onChange={() => setFormData({ ...formData, status: 'attending' })}
                    />
                    <span className="pill-dot" />
                    <span>{lang === 'hi' ? 'हर्षपूर्वक उपस्थित होंगे' : 'Joyfully Attending'}</span>
                  </label>

                  <label className={`status-pill ${formData.status === 'declined' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="status"
                      value="declined"
                      checked={formData.status === 'declined'}
                      onChange={() => setFormData({ ...formData, status: 'declined' })}
                    />
                    <span className="pill-dot" />
                    <span>{lang === 'hi' ? 'उपस्थित होने में असमर्थ' : 'Unable to Attend'}</span>
                  </label>
                </div>
              </div>

              {/* Message / Blessing */}
              <div className="form-group">
                <label className="form-label" htmlFor="guestMessage">
                  {lang === 'hi' ? 'वर-वधू के लिए शुभकामना संदेश (वैकल्पिक)' : 'Blessings / Wishes for the Couple (Optional)'}
                </label>
                <textarea
                  id="guestMessage"
                  rows="3"
                  className="form-textarea"
                  placeholder={lang === 'hi' ? 'सदा सुहागन रहो, नवदंपति को ढेरों खुशियाँ...' : 'May your journey together be blessed with endless happiness...'}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              {/* Submit to WhatsApp */}
              <button type="submit" className="btn-royal-primary rsvp-submit-btn">
                <Send size={18} />
                <span>{lang === 'hi' ? 'WhatsApp पर RSVP प्रेषित करें' : 'Send RSVP via WhatsApp'}</span>
              </button>

              <div className="form-note">
                <span>✦</span>
                <span>
                  {lang === 'hi'
                    ? 'यह बटन सीधे साहू परिवार के WhatsApp नंबर पर संदेश खोलेगा।'
                    : 'This button will directly prefill your RSVP message to the host family on WhatsApp.'}
                </span>
                <span>✦</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
