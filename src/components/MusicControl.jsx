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
  // Tracks the last media command issued so lagging play/pause events from a
  // superseded command are ignored instead of flipping isPlaying and feeding
  // an infinite play() <-> pause() feedback loop (which re-renders the whole
  // App and used to keep the loading screen from ever dismissing).
  const cmdRef = useRef(null); // 'play' | 'pause' | null

  const issuePause = () => {
    if (audioRef.current && !audioRef.current.paused) {
      cmdRef.current = 'pause';
      audioRef.current.pause();
    }
  };

  const tryPlayAudio = async () => {
    if (!audioRef.current) return false;
    try {
      audioRef.current.volume = 0.75;
      cmdRef.current = 'play';
      await audioRef.current.play();
      setIsPlaying(true);
      setUsingFallbackSynth(false);
      return true;
    } catch (err) {
      // Playback did not start; no event will arrive to clear the flag,
      // and the UI must reflect reality (e.g. autoplay blocked).
      if (cmdRef.current === 'play') cmdRef.current = null;
      setIsPlaying(false);
      return false;
    }
  };

  // Toggle music playback
  const handleToggle = async () => {
    if (!audioRef.current) return;

    if (!audioRef.current.paused || isPlaying) {
      issuePause();
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
      issuePause();
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
        onPlay={() => {
          // Stale confirmation of a play that a later pause() superseded:
          // keep cmdRef='pause' so the pending onPause event still clears it.
          if (cmdRef.current === 'pause') return;
          cmdRef.current = null;
          setIsPlaying(true);
        }}
        onPause={() => {
          // Stale pause event from before our own play() command — ignore it,
          // otherwise isPlaying flips false and the sync effect issues yet
          // another pause(), restarting the feedback loop.
          if (cmdRef.current === 'play') {
            cmdRef.current = null;
            return;
          }
          cmdRef.current = null;
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
