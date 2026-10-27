import React from 'react';
import './BottomInvitationPanels.css';

export default function BottomInvitationPanels({
  lang,
  balAagrah,
  isFlowerShowerActive,
  toggleFlowerShower,
  onOpenRsvp,
  onOpenGuestbook,
}) {
  return (
    <section className="invitation-bottom-panels-section">
      <div className="bottom-panels-grid">
        {/* Left Panel: ॥ बाल आग्रह ॥ */}
        <div className="bottom-panel-card bal-aagrah-panel">
          <div className="panel-header">
            <span className="panel-ornament">-- ✦ --</span>
            <h3 className="panel-title">॥ बाल आग्रह ॥</h3>
            <span className="panel-ornament">-- ✦ --</span>
          </div>

          <div className="bal-panel-content">
            {/* Dholak Illustration on Left */}
            <div className="bal-art-left">
              <img
                src="/images/dholak-art.png"
                alt="Dholak"
                className="dholak-img"
                loading="lazy"
              />
            </div>

            {/* Rhyme & Names in Center */}
            <div className="bal-rhyme-center">
              <p className="rhyme-line-1">बाजे ढोल, गूंजे शहनाई...</p>
              <p className="rhyme-line-2">हमारे मामा की शादी में जरूर आना...</p>
              <p className="rhyme-kids-names">- नितेश, सनावि, मायती, किट्टों</p>
            </div>

            {/* Shehnai Illustration on Right */}
            <div className="bal-art-right">
              <img
                src="/images/shehnai-art.png"
                alt="Shehnai"
                className="shehnai-img"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Right Panel: ॥ परिवार व स्नेही ॥ */}
        <div className="bottom-panel-card parivar-snehi-panel">
          <div className="panel-header">
            <span className="panel-ornament">-- ✦ --</span>
            <h3 className="panel-title">॥ परिवार व स्नेही ॥</h3>
            <span className="panel-ornament">-- ✦ --</span>
          </div>

          {/* 3 Circular Action Hubs matching reference design */}
          <div className="actions-three-hubs">
            {/* Hub 1: पुष्प वर्षा */}
            <button
              type="button"
              className={`action-hub-btn ${isFlowerShowerActive ? 'hub-active' : 'hub-inactive'}`}
              onClick={toggleFlowerShower}
              title={
                isFlowerShowerActive
                  ? (lang === 'hi' ? 'पुष्प वर्षा बंद करें (Turn OFF)' : 'Turn OFF Flower Shower')
                  : (lang === 'hi' ? 'पुष्प वर्षा चालू करें (Turn ON)' : 'Turn ON Flower Shower')
              }
            >
              <div className="hub-circle-icon icon-pushp">
                <img
                  src="/images/icon-pushp-varsha.png"
                  alt="पुष्प वर्षा"
                  className="hub-icon-img"
                />
                <span className={`hub-status-badge ${isFlowerShowerActive ? 'status-on' : 'status-off'}`}>
                  {isFlowerShowerActive ? 'ON' : 'OFF'}
                </span>
              </div>
              <span className="hub-label">{lang === 'hi' ? 'पुष्प वर्षा' : 'Petal Shower'}</span>
            </button>

            {/* Hub 2: RSVP भेजें */}
            <button
              type="button"
              className="action-hub-btn"
              onClick={onOpenRsvp}
              title={lang === 'hi' ? 'RSVP भेजें' : 'Send RSVP'}
            >
              <div className="hub-circle-icon icon-rsvp">
                <img
                  src="/images/icon-rsvp-letter.png"
                  alt="RSVP भेजें"
                  className="hub-icon-img"
                />
              </div>
              <span className="hub-label">{lang === 'hi' ? 'RSVP भेजें' : 'Send RSVP'}</span>
            </button>

            {/* Hub 3: Traditional Blessings Guestbook */}
            <button
              type="button"
              className="action-hub-btn"
              onClick={onOpenGuestbook}
              title={lang === 'hi' ? 'शुभकामना संदेश' : 'Guestbook Blessings'}
            >
              <div className="hub-circle-icon icon-blessings">
                <img
                  src="/images/icon-guestbook-blessings.png"
                  alt="Traditional Blessings Guestbook"
                  className="hub-icon-img"
                />
              </div>
              <span className="hub-label hub-label-multiline">Traditional Blessings Guestbook</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
