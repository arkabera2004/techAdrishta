// src/pages/TechTalks.jsx
import { Suspense } from 'react';
import Lanyard from '../components/Lanyard';

export default function TechTalks() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* ── Page header ── */}
        <h1 style={styles.title}>
          Tech <span style={styles.gradient}>Talk</span>
        </h1>
        <p style={styles.subtitle}>
          Practitioners only. Every session comes from someone running the thing in production.
        </p>

        {/* ── Lanyard canvas — overflow hidden clips the 100vh canvas to the container height ── */}
        <div style={styles.lanyardWrap}>
          <Suspense fallback={<LanyardSkeleton />}>
            <Lanyard
              position={[0, 0, 10]}
              gravity={[0, -40, 0]}
              lanyardWidth={1}
              frontImage="/frontimage.png"
              backImage="/frontimage2.png"
              imageFit="cover"
            />
          </Suspense>
        </div>

        {/* Reserved: speaker ID card list */}
        {/* <TalkList /> */}
      </div>
    </main>
  );
}

function LanyardSkeleton() {
  return (
    <div style={styles.skeleton}>
      <div style={styles.skeletonCard} />
      <p style={styles.skeletonText}>Loading 3D scene…</p>
    </div>
  );
}

const styles = {
  page: {
    paddingTop: '80px',
    minHeight: '100svh',
  },
  container: {
    maxWidth: '72rem',   /* max-w-6xl */
    margin: '0 auto',
    padding: '4rem 1.25rem 6rem',
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: 'clamp(2rem, 5vw, 2.75rem)',
    color: '#fff',
    lineHeight: 1.1,
    marginBottom: 0,
  },
  gradient: {
    background: 'linear-gradient(135deg, var(--garnet), #B83A4A)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    marginTop: '0.75rem',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '1rem',
    lineHeight: 1.6,
    maxWidth: '52ch',
  },

  /* mt-8 h-[520px] overflow-hidden sm:h-[620px] */
  lanyardWrap: {
    marginTop: '2rem',
    height: 'clamp(520px, 65vh, 620px)',
    overflow: 'hidden',
    borderRadius: '1.25rem',
  },

  skeleton: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '1.25rem',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  skeletonCard: {
    width: '140px',
    height: '200px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    animation: 'pulse-glow 2s ease-in-out infinite',
  },
  skeletonText: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: '0.875rem',
    letterSpacing: '0.04em',
  },
};
