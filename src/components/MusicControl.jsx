import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { startSynthesizedShehnai, stopSynthesizedShehnai } from '../utils/audioSynth';
import './MusicControl.css';

export default function MusicControl({
  lang,
  isPlaying,
  setIsPlaying,
}) {
  const audioRef = useRef(null);
  const [usingFallbackSynth, setUsingFallbackSynth] = useState(false);

  const tryPlayAudio = async () => {
    if (!audioRef.current) return false;
    try {
      audioRef.current.volume = 0.75;
      await audioRef.current.play();
      setIsPlaying(true);
      setUsingFallbackSynth(false);
      return true;
    } catch (err) {
      return false;
    }
  };

  // Toggle music playback
  const handleToggle = async () => {
    if (!audioRef.current) return;

    if (!audioRef.current.paused || isPlaying) {
      audioRef.current.pause();
      stopSynthesizedShehnai();
      setIsPlaying(false);
      setUsingFallbackSynth(false);
    } else {
      audioRef.current.volume = 0.75;
      const played = await tryPlayAudio();
      if (!played) {
        console.warn('HTML5 Audio play error, engaging authentic Web Audio synthesis');
        const started = startSynthesizedShehnai();
        if (started) {
          setIsPlaying(true);
          setUsingFallbackSynth(true);
        }
      }
    }
  };

  // Immediate autoplay attempt & Global User-Interaction capture listener
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.75;
    }

    // 1. Try immediate autoplay
    tryPlayAudio();

    // 2. Set up global capture listeners on window for instant unlock on first interaction
    const handleFirstGesture = async () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.volume = 0.75;
        const played = await tryPlayAudio();
        if (played) {
          removeGestureListeners();
        }
      }
    };

    const removeGestureListeners = () => {
      ['pointerdown', 'touchstart', 'click', 'keydown', 'wheel'].forEach((type) => {
        window.removeEventListener(type, handleFirstGesture, true);
      });
    };

    ['pointerdown', 'touchstart', 'click', 'keydown', 'wheel'].forEach((type) => {
      window.addEventListener(type, handleFirstGesture, { capture: true, passive: true });
    });

    return () => {
      removeGestureListeners();
    };
  }, []);

  // Sync with prop changes when triggered by external buttons (Navbar, etc.)
  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = 0.75;

    if (isPlaying) {
      if (audioRef.current.paused) {
        tryPlayAudio();
      }
    } else {
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }
      stopSynthesizedShehnai();
      setUsingFallbackSynth(false);
    }
  }, [isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopSynthesizedShehnai();
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src="/images/Song.mp3"
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => {
          if (!usingFallbackSynth) setIsPlaying(false);
        }}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Floating Bottom Music Bar */}
      <div className={`floating-music-bar ${isPlaying ? 'active' : ''}`}>
        <button
          type="button"
          className="floating-music-btn"
          onClick={handleToggle}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          title={lang === 'hi' ? 'शहनाई संगीत चालू / बंद' : 'Toggle Shehnai Music'}
        >
          <div className="music-icon-bubble">
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </div>
          <div className="floating-music-info">
            <span className="track-title">
              {lang === 'hi' ? 'शहनाई वादन (विवाह राग)' : 'Shehnai Wedding Music'}
            </span>
            <span className="track-status">
              {isPlaying
                ? (lang === 'hi' ? 'बज रहा है • स्पर्श से रोकें' : 'Playing • Tap to pause')
                : (lang === 'hi' ? 'संगीत सुनें • स्पर्श करें' : 'Tap to play music')}
            </span>
          </div>
          {isPlaying && (
            <div className="floating-eq">
              <span className="eq-bar" />
              <span className="eq-bar" />
              <span className="eq-bar" />
            </div>
          )}
        </button>
      </div>
    </>
  );
}
