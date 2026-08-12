import { useState, useEffect } from 'react';

export default function PixelCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  useEffect(() => {
    const targetDate = new Date('2026-09-12T09:00:00+05:30').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: d.toString().padStart(2, '0'),
        hours: h.toString().padStart(2, '0'),
        minutes: m.toString().padStart(2, '0'),
        seconds: s.toString().padStart(2, '0')
      });
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, []);

  const Box = ({ label, value }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        backgroundColor: '#0b0f1c',
        border: '0.15cqi solid #00ffff',
        boxShadow: '0 0 0.8cqi rgba(0, 255, 255, 0.4), inset 0 0 0.8cqi rgba(0, 255, 255, 0.1)',
        padding: '1.2cqi 1cqi',
        borderRadius: '0.8cqi',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '10cqi',
        height: '8.5cqi'
      }}>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          color: '#00ffff',
          fontSize: '2.8cqi',
          textShadow: '0 0 0.5cqi rgba(0,255,255,0.8)',
          marginBottom: '1cqi'
        }}>
          {value}
        </div>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          color: '#a5f3fc',
          fontSize: '0.7cqi',
          letterSpacing: '0.1em'
        }}>
          {label}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: '0.8cqi', alignItems: 'center' }}>
      <Box label="DAYS" value={timeLeft.days} />
      <span style={{ color: '#00ffff', textShadow: '0 0 0.5cqi rgba(0,255,255,0.8)', fontFamily: "'Press Start 2P', monospace", fontSize: '2cqi' }}>:</span>
      <Box label="HOURS" value={timeLeft.hours} />
      <span style={{ color: '#00ffff', textShadow: '0 0 0.5cqi rgba(0,255,255,0.8)', fontFamily: "'Press Start 2P', monospace", fontSize: '2cqi' }}>:</span>
      <Box label="MINUTES" value={timeLeft.minutes} />
      <span style={{ color: '#00ffff', textShadow: '0 0 0.5cqi rgba(0,255,255,0.8)', fontFamily: "'Press Start 2P', monospace", fontSize: '2cqi' }}>:</span>
      <Box label="SECONDS" value={timeLeft.seconds} />
    </div>
  );
}
