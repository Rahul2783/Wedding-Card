import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import MusicControl from './components/MusicControl';
import RoyalCardFrame from './components/RoyalCardFrame';
import HeroSection from './sections/HeroSection';
import MessageSection from './sections/MessageSection';
import EventsSection from './sections/EventsSection';
import BaraatSection from './sections/BaraatSection';
import VenueSection from './components/VenueSection';
import FamilySection from './components/FamilySection';
import Gallery from './components/Gallery';
import RSVPForm from './components/RSVPForm';
import GuestbookSection from './sections/GuestbookSection';
import Footer from './components/Footer';
import { weddingConfig } from './data/weddingData';
import {
  startContinuousFlowerShower,
  stopContinuousFlowerShower,
  triggerCelebrationBurst,
} from './utils/flowerShower';
import './styles/global.css';
import './styles/animations.css';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState('hi');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  // पुष्प वर्षा by default ON as requested
  const [isFlowerShowerActive, setIsFlowerShowerActive] = useState(true);

  // Manage Continuous Flower Shower Lifecycle (ON by default)
  useEffect(() => {
    if (!isLoading) {
      if (isFlowerShowerActive) {
        startContinuousFlowerShower();
      } else {
        stopContinuousFlowerShower();
      }
    }
    return () => {
      stopContinuousFlowerShower();
    };
  }, [isLoading, isFlowerShowerActive]);

  // Toggle Flower Shower ON / OFF
  const toggleFlowerShower = () => {
    setIsFlowerShowerActive((prev) => !prev);
  };

  const handleOpenRsvp = () => {
    const el = document.getElementById('rsvp');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenGuestbook = () => {
    const el = document.getElementById('guestbook');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <div className="wedding-app">
      {/* 1. Cinematic Loading Screen */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* 2. Main Royal Invitation Layout with Royal Frame */}
      {!isLoading && (
        <RoyalCardFrame>
          {/* Sticky Royal Navigation with Flower Shower & Music controls */}
          <Navbar
            lang={lang}
            setLang={setLang}
            isMusicPlaying={isMusicPlaying}
            toggleMusic={() => setIsMusicPlaying(!isMusicPlaying)}
            isFlowerShowerActive={isFlowerShowerActive}
            toggleFlowerShower={toggleFlowerShower}
          />

          <main id="main-content">
            {/* Grand Hero Section with Mandap Background, Arches & Action Buttons */}
            <HeroSection
              lang={lang}
              weddingConfig={weddingConfig}
              isFlowerShowerActive={isFlowerShowerActive}
              toggleFlowerShower={toggleFlowerShower}
              onOpenRsvp={handleOpenRsvp}
              onOpenGuestbook={handleOpenGuestbook}
            />

            {/* Wedding Message / Bal Aagrah */}
            <MessageSection
              lang={lang}
              balAagrah={weddingConfig.balAagrah}
              poetry={weddingConfig.poetry}
            />

            {/* Auspicious Events (मांगलिक कार्यक्रम) */}
            <EventsSection
              lang={lang}
              events={weddingConfig.events}
              venue={weddingConfig.venue}
            />

            {/* Baraat Procession (बारात प्रस्थान) */}
            <BaraatSection
              lang={lang}
              baraat={weddingConfig.baraat}
              venue={weddingConfig.venue}
            />

            {/* Wedding Venue (विवाह स्थल) */}
            <VenueSection
              lang={lang}
              venue={weddingConfig.venue}
              weddingDate={weddingConfig.date}
            />

            {/* Family & Relatives (परिवार व स्नेही) */}
            <FamilySection
              lang={lang}
              family={weddingConfig.family}
              groom={weddingConfig.groom}
              bride={weddingConfig.bride}
            />

            {/* Photo Gallery with Lightbox */}
            <Gallery lang={lang} items={weddingConfig.gallery} />

            {/* RSVP Form with WhatsApp */}
            <RSVPForm
              lang={lang}
              phone={weddingConfig.venue.phone}
              groomName={weddingConfig.groom.fullNameHi}
              brideName={weddingConfig.bride.nameHi}
              weddingDate={weddingConfig.date.displayHi}
            />

            {/* Blessings Guestbook */}
            <GuestbookSection
              lang={lang}
              onFlowerShower={() => triggerCelebrationBurst(30)}
            />
          </main>

          {/* Royal Footer */}
          <Footer lang={lang} weddingConfig={weddingConfig} />

          {/* Floating Audio Player Control with Equalizer */}
          <MusicControl
            lang={lang}
            isPlaying={isMusicPlaying}
            setIsPlaying={setIsMusicPlaying}
          />
        </RoyalCardFrame>
      )}
    </div>
  );
}
