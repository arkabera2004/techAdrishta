// src/components/FlipClock.jsx
import { useEffect, useState, memo } from 'react';

/* ─── Inject keyframes once into the document head ─── */
if (typeof document !== 'undefined' && !document.getElementById('flip-clock-css')) {
  const s = document.createElement('style');
  s.id = 'flip-clock-css';
  s.textContent = `
    @keyframes flipTop {
      from { transform: rotateX(0deg);   }
      to   { transform: rotateX(-90deg); }
    }
    @keyframes flipBottom {
      from { transform: rotateX(90deg); }
      to   { transform: rotateX(0deg);  }
    }
    @keyframes shadowFadeIn {
      from { opacity: 0;   }
      to   { opacity: 0.6; }
    }
    @keyframes shadowFadeOut {
      from { opacity: 0.6; }
      to   { opacity: 0;   }
    }
  `;
  document.head.appendChild(s);
}

/* ─── Countdown math ─── */
const TARGET = '2026-09-12T00:00:00+05:30';

function diff() {
  const ms = Math.max(0, new Date(TARGET).getTime() - Date.now());
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor(ms / 3600000) % 24,
    m: Math.floor(ms / 60000) % 60,
    s: Math.floor(ms / 1000) % 60,
  };
}

/* ─── Single flip digit card ─── */
const FlipDigit = memo(({ digit }) => {
  const [currentDigit, setCurrentDigit] = useState(digit);
  const [isFlipping,   setIsFlipping]   = useState(false);

  useEffect(() => {
    if (digit !== currentDigit) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setCurrentDigit(digit);
        setIsFlipping(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [digit, currentDigit]);

  // Background: top half shows NEXT digit, bottom half shows CURRENT digit
  const topNum    = isFlipping ? digit : currentDigit;
  const bottomNum = currentDigit;

  return (
    <div style={styles.digitWrap}>

      {/* Static top half — next digit */}
      <div style={{ ...styles.halfBase, ...styles.halfTop, background: '#25262b' }}>
        <div style={styles.digitNum}>{topNum}</div>
      </div>

      {/* Static bottom half — current digit */}
      <div style={{ ...styles.halfBase, ...styles.halfBottom, background: '#1e1f24' }}>
        <div style={{ ...styles.digitNum, ...styles.digitNumBottom }}>{bottomNum}</div>
      </div>

      {/* Animated top half — current digit folds DOWN (0 → -90deg) */}
      {isFlipping && (
        <div
          key={`top-${currentDigit}-to-${digit}`}
          style={{
            ...styles.halfBase,
            ...styles.halfTop,
            background: '#25262b',
            zIndex: 10,
            transformOrigin: 'bottom center',
            animation: 'flipTop 0.3s ease-in forwards',
          }}
        >
          <div style={styles.digitNum}>{currentDigit}</div>
          <div style={{ ...styles.shadowOverlay, animation: 'shadowFadeIn 0.3s ease-in forwards' }} />
        </div>
      )}

      {/* Animated bottom half — next digit unfolds UP (90 → 0deg) */}
      {isFlipping && (
        <div
          key={`bot-${currentDigit}-to-${digit}`}
          style={{
            ...styles.halfBase,
            ...styles.halfBottom,
            background: '#1e1f24',
            zIndex: 10,
            transformOrigin: 'top center',
            animation: 'flipBottom 0.3s ease-out 0.3s both',
          }}
        >
          <div style={{ ...styles.digitNum, ...styles.digitNumBottom }}>{digit}</div>
          <div style={{ ...styles.shadowOverlay, animation: 'shadowFadeOut 0.3s ease-out 0.3s both', opacity: 0.6 }} />
        </div>
      )}

      {/* Center hinge line */}
      <div style={styles.hinge} />
      {/* Left hinge knob */}
      <div style={{ ...styles.knob, left: '-2px', borderRadius: '0 3px 3px 0', borderRight: '1px solid #000', borderTop: '1px solid #000', borderBottom: '1px solid #000' }} />
      {/* Right hinge knob */}
      <div style={{ ...styles.knob, right: '-2px', borderRadius: '3px 0 0 3px', borderLeft: '1px solid #000', borderTop: '1px solid #000', borderBottom: '1px solid #000' }} />
    </div>
  );
});
FlipDigit.displayName = 'FlipDigit';

/* ─── Two-digit unit (tens + ones) with label ─── */
function TimeUnit({ label, value }) {
  const tens = Math.floor(value / 10);
  const ones = value % 10;

  return (
    <div style={styles.unit}>
      <div style={styles.unitInner}>
        <FlipDigit digit={tens} />
        <FlipDigit digit={ones} />
      </div>
      <span style={styles.unitLabel}>{label}</span>
    </div>
  );
}

/* ─── Main export: FlipClock ─── */
export default function FlipClock() {
  const [t, setT] = useState(diff);

  useEffect(() => {
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={styles.clock}>
      <TimeUnit label="DAYS"    value={t.d} />
      <TimeUnit label="HOURS"   value={t.h} />
      <TimeUnit label="MINUTES" value={t.m} />
      <TimeUnit label="SECONDS" value={t.s} />
    </div>
  );
}

/* ─── Styles ─── */
const DIGIT_W  = 'clamp(36px, 4vw, 50px)';
const DIGIT_H  = 'clamp(54px, 6vw, 72px)';
const FONT_SZ  = 'clamp(1.75rem, 3.5vw, 2.75rem)';

const styles = {
  clock: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 'clamp(6px, 2vw, 24px)',
  },
  unit: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0,
  },
  unitInner: {
    display: 'flex',
    background: '#121316',
    padding: '6px 8px',
    borderRadius: '12px',
    boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.05)',
    gap: 0,
  },
  unitLabel: {
    marginTop: '12px',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    color: '#e5e7eb',
    opacity: 0.8,
    fontFamily: "'Inter', sans-serif",
  },

  /* ── Digit card ── */
  digitWrap: {
    position: 'relative',
    width: DIGIT_W,
    height: DIGIT_H,
    background: '#1a1b1e',
    borderRadius: '8px',
    boxShadow: '0 12px 24px -8px rgba(0,0,0,0.8)',
    margin: '0 2px',
    flexShrink: 0,
    color: '#e5e7eb',
    perspective: '600px',
  },

  /* ── Half panels ── */
  halfBase: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  halfTop: {
    top: 0,
    height: '50%',
    borderRadius: '8px 8px 0 0',
  },
  halfBottom: {
    bottom: 0,
    height: '50%',
    borderRadius: '0 0 8px 8px',
  },

  /* ── Digit number centering ── */
  digitNum: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: DIGIT_H,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: FONT_SZ,
    fontWeight: 700,
    fontFamily: "'Space Grotesk', sans-serif",
    color: '#e5e7eb',
    userSelect: 'none',
  },
  digitNumBottom: {
    top: 'auto',
    bottom: 0,
  },

  /* ── Shadow overlay during flip ── */
  shadowOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
  },

  /* ── Center hinge ── */
  hinge: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: '2px',
    marginTop: '-1px',
    background: '#0a0a0b',
    zIndex: 20,
    boxShadow: '0 1px 0 rgba(255,255,255,0.07)',
  },

  /* ── Side knobs ── */
  knob: {
    position: 'absolute',
    top: '50%',
    width: '4px',
    height: '12px',
    marginTop: '-6px',
    background: '#33353a',
    zIndex: 20,
  },
};
