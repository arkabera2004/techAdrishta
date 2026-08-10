// src/components/StampCTA.jsx
import { motion } from 'framer-motion';

export default function StampCTA({ children, onClick, href, style }) {
  const content = (
    <motion.button
      onClick={onClick}
      style={{ ...stampStyles.btn, ...style }}
      whileHover={{ y: -3, boxShadow: '0 12px 36px rgba(212,160,23,0.5)' }}
      whileTap={{ y: 0, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 24 }}
      id="stamp-cta"
    >
      {/* Perforated top edge */}
      <span style={stampStyles.perfTop} aria-hidden />
      {/* Perforated bottom edge */}
      <span style={stampStyles.perfBottom} aria-hidden />
      {/* Inner shine */}
      <span style={stampStyles.shine} aria-hidden />
      {/* Label */}
      <span style={stampStyles.label}>{children}</span>
    </motion.button>
  );

  if (href) {
    return (
      <a href={href} style={{ textDecoration: 'none' }}>
        {content}
      </a>
    );
  }
  return content;
}

const PERF_SIZE = 10; // px — diameter of each hole

const stampStyles = {
  btn: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 40px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #d4a017, #fbbf24, #d97706)',
    border: 'none',
    cursor: 'pointer',
    overflow: 'visible',
    boxShadow: '0 6px 24px rgba(212,160,23,0.4), inset 0 1px 0 rgba(255,255,255,0.35)',
    transition: 'box-shadow 0.25s',
  },
  perfTop: {
    position: 'absolute',
    top: `-${PERF_SIZE / 2}px`,
    left: '20px',
    right: '20px',
    height: `${PERF_SIZE}px`,
    background: `radial-gradient(circle, oklch(0.14 0.018 285) ${PERF_SIZE / 2}px, transparent ${PERF_SIZE / 2}px)`,
    backgroundSize: `${PERF_SIZE * 2}px ${PERF_SIZE}px`,
    backgroundRepeat: 'repeat-x',
  },
  perfBottom: {
    position: 'absolute',
    bottom: `-${PERF_SIZE / 2}px`,
    left: '20px',
    right: '20px',
    height: `${PERF_SIZE}px`,
    background: `radial-gradient(circle, oklch(0.14 0.018 285) ${PERF_SIZE / 2}px, transparent ${PERF_SIZE / 2}px)`,
    backgroundSize: `${PERF_SIZE * 2}px ${PERF_SIZE}px`,
    backgroundRepeat: 'repeat-x',
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderRadius: '20px 20px 0 0',
    background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)',
    pointerEvents: 'none',
  },
  label: {
    position: 'relative',
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: '1rem',
    letterSpacing: '0.04em',
    color: '#1a0a00',
    zIndex: 1,
  },
};
