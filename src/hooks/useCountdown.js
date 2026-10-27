import { useState, useEffect } from 'react';

/**
 * Custom hook for live wedding countdown
 * Targets Indian Standard Time (IST) 2026-12-09T00:00:00+05:30
 */
export function useCountdown(targetIsoDate = '2026-12-09T00:00:00+05:30') {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetIsoDate));

  useEffect(() => {
    // Initial calculation
    setTimeLeft(calculateTimeLeft(targetIsoDate));

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetIsoDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetIsoDate]);

  return timeLeft;
}

function calculateTimeLeft(targetIsoDate) {
  const difference = new Date(targetIsoDate).getTime() - Date.now();

  if (difference <= 0) {
    return {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
      isCompleted: true,
      totalMs: 0,
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    isCompleted: false,
    totalMs: difference,
  };
}
