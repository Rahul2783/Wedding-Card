import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Home } from 'lucide-react';
import './FamilySection.css';

gsap.registerPlugin(ScrollTrigger);

export default function FamilySection({ lang, family, groom, bride }) {
  const familyRef = useRef(null);
  // Default to first relative tab 'mangala'
  const [activeTab, setActiveTab] = useState('mangala');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.family-reveal-panel',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: familyRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, familyRef);

    return () => ctx.revert();
  }, []);

  // 3 Relative categories as requested: Mangala Kankshi, Darshanabhilashi, Vineet & Preshak
  const relativeTabs = [
    { key: 'mangala', labelHi: 'मंगला कांक्षी', labelEn: 'Mangala Kankshi' },
    { key: 'darshana', labelHi: 'दर्शनाभिलाषी', labelEn: 'Darshanabhilashi' },
    { key: 'preshak', labelHi: 'विनीत व प्रेषक', labelEn: 'Vineet & Preshak' },
  ];

  // FIXED: Groom & Bride Primary Panels
  const renderPrimaryFamilyGrid = () => (
    <div className="primary-family-grid family-reveal-panel">
      {/* Groom's Family Panel */}
      <div className="family-panel royal-card">
        <div className="corner-accent corner-top-left" />
        <div className="corner-accent corner-top-right" />
        <div className="corner-accent corner-bottom-left" />
        <div className="corner-accent corner-bottom-right" />

        <div className="panel-badge-top">
          <span>{lang === 'hi' ? 'वर पक्ष' : 'Groom’s Family'}</span>
        </div>
        <h3 className="panel-main-name">{groom.fullNameHi}</h3>

        <div className="panel-divider" />

        <div className="family-member-block">
          <span className="relation-label">
            {lang === 'hi' ? 'माता-पिता' : 'Parents'}
          </span>
          <p className="member-name">{groom.fatherHi}</p>
          <p className="member-subname">{groom.motherHi}</p>
        </div>

        <div className="family-member-block">
          <span className="relation-label">
            {lang === 'hi' ? 'दादा-दादी (सुपौत्र)' : 'Grandparents'}
          </span>
          <p className="member-name">{groom.grandfatherHi}</p>
          <p className="member-subname">{groom.grandmotherHi}</p>
        </div>

        <div className="family-residence-block">
          <span className="residence-address-text">
            <Home size={15} className="home-icon" /> {groom.residenceHi}
          </span>
        </div>
      </div>

      {/* Center Sacred Union (Var-Vadhu Illustration) */}
      <div className="family-center-knot">
        <div className="center-var-vadhu-wrap">
          <img
            src="/images/var-vadhu.png"
            alt="वर-वधू परिणय सूत्र"
            className="center-var-vadhu-img"
          />
        </div>
        <div className="knot-text">॥ परिणयोत्सव ॥</div>
      </div>

      {/* Bride's Family Panel */}
      <div className="family-panel royal-card">
        <div className="corner-accent corner-top-left" />
        <div className="corner-accent corner-top-right" />
        <div className="corner-accent corner-bottom-left" />
        <div className="corner-accent corner-bottom-right" />

        <div className="panel-badge-top">
          <span>{lang === 'hi' ? 'वधू पक्ष' : 'Bride’s Family'}</span>
        </div>
        <h3 className="panel-main-name">{bride.nameHi}</h3>

        <div className="panel-divider" />

        <div className="family-member-block">
          <span className="relation-label">
            {lang === 'hi' ? 'माता-पिता' : 'Parents'}
          </span>
          <p className="member-name">{bride.fatherHi}</p>
          <p className="member-subname">{bride.motherHi}</p>
        </div>

        <div className="family-member-block">
          <span className="relation-label">
            {lang === 'hi' ? 'दादा-दादी (सुपौत्री)' : 'Grandparents'}
          </span>
          <p className="member-name">{bride.grandfatherHi}</p>
          <p className="member-subname">{bride.grandmotherHi}</p>
        </div>

        <div className="family-residence-block">
          <span className="residence-address-text">
            <Home size={15} className="home-icon" /> {bride.residenceHi}
          </span>
        </div>
      </div>
    </div>
  );

  // Helper renderer: Mangala Kankshi (नाना-नानी, मामा-मामी, बुआ-फुफा, दीदी-जीजाजी)
  const renderMangalaBlock = () => (
    <div className="mangala-kankshi-block">
      <div className="card-ribbon-pill">
        <span className="ribbon-wing">((</span>
        <span className="ribbon-text">
          {lang === 'hi' ? family.mangalaKankshi.titleHi : family.mangalaKankshi.titleEn}
        </span>
        <span className="ribbon-wing">))</span>
      </div>

      <div className="mangala-columns-grid">
        {/* Left Column: नाना-नानी एवं मामा-मामी */}
        <div className="relative-column-box">
          {family.mangalaKankshi.groups.slice(0, 2).map((grp, gIdx) => (
            <div key={gIdx} className="relation-group-item">
              <span className="group-relation-title">({grp.relationHi})</span>
              <div className="group-names-list">
                {grp.membersHi.map((name, nIdx) => (
                  <p key={nIdx} className="group-name-entry">{name}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: बुआ-फुफा एवं दीदी-जीजाजी */}
        <div className="relative-column-box">
          {family.mangalaKankshi.groups.slice(2).map((grp, gIdx) => (
            <div key={gIdx} className="relation-group-item">
              <span className="group-relation-title">({grp.relationHi})</span>
              <div className="group-names-list">
                {grp.membersHi.map((name, nIdx) => (
                  <p key={nIdx} className="group-name-entry">{name}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Helper renderer: Darshanabhilashi & Swagatakankshi
  const renderDarshanaBlock = () => (
    <div className="middle-relatives-grid">
      {/* Left Column: दर्शनाभिलाषी */}
      <div className="darshana-column">
        <div className="card-ribbon-pill">
          <span className="ribbon-wing">((</span>
          <span className="ribbon-text">
            {lang === 'hi' ? family.darshanabhilashi.titleHi : family.darshanabhilashi.titleEn}
          </span>
          <span className="ribbon-wing">))</span>
        </div>

        <div className="relative-column-box">
          {family.darshanabhilashi.groups.map((grp, gIdx) => (
            <div key={gIdx} className="relation-group-item">
              <span className="group-relation-title">({grp.relationHi})</span>
              <div className="group-names-list">
                {grp.membersHi.map((name, nIdx) => (
                  <p key={nIdx} className="group-name-entry">{name}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: स्वागताकांक्षी */}
      <div className="swagata-column">
        <div className="card-ribbon-pill">
          <span className="ribbon-wing">((</span>
          <span className="ribbon-text">
            {lang === 'hi' ? family.swagatakankshi.titleHi : family.swagatakankshi.titleEn}
          </span>
          <span className="ribbon-wing">))</span>
        </div>

        <p className="swagata-names-paragraph">
          {family.swagatakankshi.membersHi}
        </p>
      </div>
    </div>
  );

  // Helper renderer: Vineet & Preshak
  const renderPreshakBlock = () => (
    <div className="bottom-relatives-grid">
      {/* Left Column: विनीत */}
      <div className="vineet-column">
        <div className="card-ribbon-pill">
          <span className="ribbon-wing">((</span>
          <span className="ribbon-text">
            {lang === 'hi' ? family.vineet.titleHi : family.vineet.titleEn}
          </span>
          <span className="ribbon-wing">))</span>
        </div>

        <div className="group-names-list">
          {family.vineet.membersHi.map((name, idx) => (
            <p key={idx} className="group-name-entry">{name}</p>
          ))}
        </div>
      </div>

      {/* Right Column: प्रेषक */}
      <div className="preshak-column">
        <div className="card-ribbon-pill">
          <span className="ribbon-wing">((</span>
          <span className="ribbon-text">
            {lang === 'hi' ? family.preshak.titleHi : family.preshak.titleEn}
          </span>
          <span className="ribbon-wing">))</span>
        </div>

        <div className="group-names-list">
          {family.preshak.membersHi.map((name, idx) => (
            <p key={idx} className="preshak-host-name">{name}</p>
          ))}
        </div>

        <div className="preshak-address-box">
          {family.preshak.addressHi}
        </div>
      </div>
    </div>
  );

  // Helper renderer: Monogram crest
  const renderMonogramCrest = () => (
    <div className="sheet-sa-monogram-corner">
      <div className="sa-heart-crest-wrap">
        <span className="sheet-divider-symbol">❧</span>
        <span className="sa-crest-text">SA</span>
        <span className="sheet-divider-symbol">❧</span>
      </div>
      <span className="sa-crest-blessing">॥ सप्रेम निमंत्रण — समस्त साहू परिवार ॥</span>
    </div>
  );

  return (
    <section id="family" className="family-royal-section" ref={familyRef}>
      <div className="section-shell">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <span>✦</span>
            <span>{lang === 'hi' ? 'शुभ आशीर्वाद' : 'With Family Blessings'}</span>
            <span>✦</span>
          </div>
          <h2 className="section-title">॥ परिवार व स्नेही ॥</h2>
          <div className="ornamental-divider">
            <span className="divider-line" />
            <span className="divider-symbol">卐</span>
            <span className="divider-line" />
          </div>
          <p className="section-subtitle">
            {lang === 'hi'
              ? 'दो परिवारों का पावन मिलन एवं समस्त आत्मीय जनों का सस्नेह आमंत्रण'
              : 'Warmest regards and divine blessings from both families'}
          </p>
        </div>

        {/* 1. FIXED: Primary Couple Family Panels (वर-वधू परिवार) */}
        {renderPrimaryFamilyGrid()}

        {/* 2. Interactive Filter Buttons (3 Buttons: मंगला कांक्षी, दर्शनाभिलाषी, विनीत व प्रेषक) */}
        <div className="family-filter-tabs">
          {relativeTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`family-filter-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
              aria-label={tab.labelHi}
            >
              <span>{lang === 'hi' ? tab.labelHi : tab.labelEn}</span>
            </button>
          ))}
        </div>

        {/* 3. Relatives Sheet with Dynamic Active Category */}
        <div key={activeTab} className="family-tab-content">
          <div className="relatives-card-page-sheet royal-card family-reveal-panel">
            <div className="corner-accent corner-top-left" />
            <div className="corner-accent corner-top-right" />
            <div className="corner-accent corner-bottom-left" />
            <div className="corner-accent corner-bottom-right" />

            {/* TAB 1: मंगला कांक्षी */}
            {activeTab === 'mangala' && renderMangalaBlock()}

            {/* TAB 2: दर्शनाभिलाषी व स्वागताकांक्षी */}
            {activeTab === 'darshana' && renderDarshanaBlock()}

            {/* TAB 3: विनीत व प्रेषक */}
            {activeTab === 'preshak' && renderPreshakBlock()}

            {/* Bottom SA Monogram Crest */}
            {renderMonogramCrest()}
          </div>
        </div>
      </div>
    </section>
  );
}
