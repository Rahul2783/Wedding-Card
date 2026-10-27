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

  // Toggle music playback
  const handleToggle = async () => {
    if (isPlaying) {
      if (audioRef.current && !usingFallbackSynth) {
        audioRef.current.pause();
      }
      stopSynthesizedShehnai();
      setIsPlaying(false);
      setUsingFallbackSynth(false);
    } else {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setUsingFallbackSynth(false);
        } catch (err) {
          console.warn('HTML5 Audio play error, engaging authentic Web Audio synthesis:', err);
          const started = startSynthesizedShehnai();
          if (started) {
            setIsPlaying(true);
            setUsingFallbackSynth(true);
          }
        }
      } else {
        const started = startSynthesizedShehnai();
        if (started) {
          setIsPlaying(true);
          setUsingFallbackSynth(true);
        }
      }
    }
  };

  // Sync with prop changes
  useEffect(() => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          const started = startSynthesizedShehnai();
          if (started) setUsingFallbackSynth(true);
        });
      }
    } else {
      if (audioRef.current) audioRef.current.pause();
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
        src="/wedding-music.mp3"
        loop
        preload="metadata"
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
