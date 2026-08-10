// src/pages/Home.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';

import FlipClock from '../components/FlipClock';
import TicketCard from '../components/TicketCard';
import SpeakerCard from '../components/SpeakerCard';
import Lanyard from '../components/Lanyard';

import { events, FEST } from '../data/events';
import { speakers } from '../data/speakers';
import { schedule, scheduleColors } from '../data/schedule';
import { RevealText, RevealBreath, StaggerGroup, StaggerItem } from '../components/animations/Reveal';

/* ─── Constants & Data ─── */
const SPONSORS = ["NEBULA", "CORTEXA", "CHAINSTACK", "VECTOR", "REDSHIFT", "FOUNDRY"];

const FAQS = [
  [
    "Do I need a team for the hackathon?",
    "No. Solo entries are welcome and we run a team-forming session an hour before kickoff.",
  ],
  [
    "How does payment work?",
    "Pay via UPI to the ID shown during registration, then submit your UTR number and a screenshot. Our team verifies within 24 hours.",
  ],
  [
    "Is there accommodation?",
    "Overnight floor space is available for hackathon participants. Bring your own sleeping bag.",
  ],
  [
    "Can I attend just the talks?",
    "Yes — all tech talks are free to attend, but seats are allotted on registration order.",
  ],
];

/* ─── Animation Variants ─── */
const revealText = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

/* ─── Page Component ─── */
export default function Home() {
  const [schedDay, setSchedDay] = useState('day1');
  const [openFaq, setOpenFaq] = useState(null);

  const featuredEvents = events.slice(0, 3);
  const topSpeakers = speakers.slice(0, 4);

  function triggerRegisterSlide() {
    sessionStorage.setItem("ticket-register-slide", "1");
  }

  return (
    <main style={{ paddingTop: 0 }}>
      {/* ─── HERO ─── */}
      <section style={styles.heroSection}>
        {/* Background Layers */}
        <div 
          style={{
            position: 'absolute', inset: 0, 
            backgroundImage: "url('/backgroundimage.jpeg')", 
            backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
            opacity: 0.35, zIndex: 0
          }} 
          aria-hidden="true" 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1 }} aria-hidden="true" />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '56px 56px', zIndex: 1 }} aria-hidden="true" />
        
        {/* Hero Content */}
        <div style={styles.heroContent}>
          <motion.p 
            initial="hidden" animate="visible" variants={revealText}
            style={styles.heroEyebrow}
          >
            {FEST.dates} · {FEST.venue}
          </motion.p>
          
          <motion.h1 
            initial="hidden" animate="visible" variants={revealText}
            style={styles.heroTitle}
          >
            {FEST.name}
          </motion.h1>
          
          <motion.p 
            initial="hidden" animate="visible" variants={revealText}
            style={styles.heroTagline}
          >
            Two days of building, breaking and shipping. A hackathon, a stage,<br />
            a lab and a leaderboard — all under one roof.
          </motion.p>
          
          <motion.div 
            initial="hidden" animate="visible" variants={revealText}
            style={styles.heroCtaWrap}
          >
            <Link 
              to="/register" 
              onClick={triggerRegisterSlide}
              className="stamp-cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to right, #e7c553, #efcf69, #d4af37)',
                padding: '1.25rem 4.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#000',
                textDecoration: 'none'
              }}
            >
              <span style={{ position: 'relative', zIndex: 10 }}>Register Now</span>
            </Link>
            <FlipClock />
          </motion.div>
        </div>
      </section>

      <div style={styles.contentWrap}>
        {/* ─── ABOUT ─── */}
        <section style={styles.gridSection}>
          <div>
            <RevealText>
              <h2 className="section-title">About the event</h2>
            </RevealText>
            <RevealBreath delay={0.1}>
              <p style={styles.textMuted}>
                TECH ADRISHTA started as a dorm-room hackathon and grew into the largest independent
                tech fest in the region. Two days, four tracks, and a single rule: everything you
                present has to actually run.
              </p>
            </RevealBreath>
            <RevealBreath delay={0.2}>
              <p style={{ ...styles.textMuted, marginTop: '1rem' }}>
                Expect engineers who ship at scale, founders mid-raise, and security researchers who
                break things on stage. No keynote fluff.
              </p>
            </RevealBreath>
          </div>
          <RevealBreath delay={0.3} style={styles.glassPanel}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Four tracks</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', listStyle: 'none' }}>
              <li><strong style={{ color: '#fff' }}>Build</strong> — 36-hour hackathon with hardware and cloud credits.</li>
              <li><strong style={{ color: '#fff' }}>Learn</strong> — hands-on workshops capped at 60 seats.</li>
              <li><strong style={{ color: '#fff' }}>Listen</strong> — talks from people running production systems.</li>
              <li><strong style={{ color: '#fff' }}>Compete</strong> — CTF, pitch arena and the gaming bracket.</li>
            </ul>
          </RevealBreath>
        </section>

        {/* ─── FEATURED TICKETS ─── */}
        <section>
          <div style={styles.sectionHeader}>
            <RevealText>
              <h2 className="section-title">Featured tickets</h2>
            </RevealText>
            <RevealBreath delay={0.1}>
              <Link to="/events" style={styles.seeAll}>See all events →</Link>
            </RevealBreath>
          </div>
          <div style={{ paddingBottom: '2.5rem', paddingTop: '2rem' }}>
            <div style={{ display: 'flex', width: '100%', flexDirection: 'column', gap: '5rem' }}>
              {featuredEvents.map((ev, i) => (
                <div
                  key={ev.id}
                  style={{
                    position: 'sticky',
                    top: `calc(120px + ${i * 24}px)`,
                    zIndex: i + 10,
                  }}
                >
                  <TicketCard event={ev} tilt={[-1.5, 1, -1][i] ?? 0} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SPEAKERS ─── */}
        <section>
          <RevealText>
            <h2 className="section-title">Speakers</h2>
          </RevealText>
          <StaggerGroup style={styles.speakerGrid}>
            {topSpeakers.map(s => (
              <StaggerItem key={s.id} style={{ width: '100%' }}>
                <SpeakerCard speaker={s} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>

        {/* ─── SCHEDULE ─── */}
        <section>
          <RevealText>
            <h2 className="section-title">Schedule</h2>
          </RevealText>
          <RevealBreath delay={0.1} style={{ marginTop: '2rem' }}>
            <div style={styles.tabs}>
              {[
                { key: 'day1', label: 'Day 1 · 12 Sept' },
                { key: 'day2', label: 'Day 2 · 13 Sept' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setSchedDay(tab.key)}
                  style={{
                    ...styles.tab,
                    background: schedDay === tab.key ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: schedDay === tab.key ? '#fff' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div style={styles.scheduleList}>
              {schedule[schedDay].map((row, i) => (
                <Link
                  key={i}
                  to="/events"
                  style={styles.schedRow}
                >
                  <span style={{ ...styles.schedTime, color: scheduleColors[row.category] || '#22d3ee' }}>{row.time}</span>
                  <span style={styles.schedTitle}>{row.title}</span>
                  <span style={styles.schedVenue}>{row.venue}</span>
                </Link>
              ))}
            </div>
          </RevealBreath>
        </section>

        {/* ─── SPONSORS ─── */}
        <section>
          <RevealText>
            <h2 className="section-title">Backed by</h2>
          </RevealText>
          <StaggerGroup style={styles.sponsorGrid}>
            {SPONSORS.map(s => (
              <StaggerItem key={s} style={styles.sponsorCard}>
                {s}
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>

        {/* ─── FAQ ─── */}
        <section style={{ marginBottom: '5rem' }}>
          <RevealText>
            <h2 className="section-title">FAQ</h2>
          </RevealText>
          <RevealBreath delay={0.1} style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {FAQS.map(([q, a], i) => (
                <div key={i} style={styles.faqItem}>
                  <button
                    style={styles.faqQ}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span>{q}</span>
                    <motion.span animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.22 }} style={{ flexShrink: 0 }}>
                      <ChevronDown size={18} />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p style={styles.faqA}>{a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </RevealBreath>
        </section>
      </div>
    </main>
  );
}

const styles = {
  heroSection: {
    position: 'relative',
    height: '100svh',
    overflow: 'hidden',
  },
  heroContent: {
    position: 'relative',
    zIndex: 10,
    margin: '0 auto',
    display: 'flex',
    height: '100%',
    maxWidth: '72rem',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 1.25rem',
    textAlign: 'center',
  },
  heroEyebrow: {
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.3em',
    color: '#22d3ee',
    textTransform: 'uppercase',
  },
  heroTitle: {
    marginTop: '1.25rem',
    width: '100%',
    maxWidth: '48rem',
    fontFamily: "'Asset', ui-serif, serif",
    fontSize: 'clamp(3rem, 8vw, 5rem)',
    lineHeight: 0.95,
    fontWeight: 700,
    color: '#fff',
    WebkitTextStroke: '1.5px #D4AF37',
    textShadow: '0 0 16px rgba(212, 175, 55, 0.25)',
    textAlign: 'center',
  },
  heroTagline: {
    marginTop: '1.25rem',
    maxWidth: '36rem',
    fontSize: '1.125rem',
    color: 'rgba(255,255,255,0.65)',
  },
  heroCtaWrap: {
    marginTop: '2.25rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2rem',
  },
  contentWrap: {
    margin: '0 auto',
    maxWidth: '72rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '6rem',
    padding: '5rem 1.25rem',
  },
  gridSection: {
    display: 'grid',
    gap: '2.5rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  },
  textMuted: {
    color: 'rgba(255,255,255,0.65)',
    marginTop: '1rem',
  },
  glassPanel: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '1rem',
    padding: '1.5rem',
    backdropFilter: 'blur(12px)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  seeAll: {
    fontSize: '0.875rem',
    color: '#22d3ee',
    textDecoration: 'none',
  },
  speakerGrid: {
    marginTop: '2rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
    width: '100%',
  },
  tabs: {
    display: 'flex',
    background: 'rgba(255,255,255,0.04)',
    padding: '4px',
    borderRadius: '0.5rem',
    width: 'max-content',
    marginBottom: '1.5rem',
  },
  tab: {
    padding: '6px 16px',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  scheduleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  schedRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    padding: '1rem 1.25rem',
    borderRadius: '0.75rem',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    textDecoration: 'none',
    color: '#fff',
    transition: 'background 0.2s, transform 0.2s',
  },
  schedTime: {
    flexShrink: 0,
    width: '6rem',
    fontSize: '0.875rem',
    fontWeight: 600,
  },
  schedTitle: {
    flex: 1,
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  schedVenue: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.5)',
  },
  sponsorGrid: {
    marginTop: '2rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '1rem',
  },
  sponsorCard: {
    display: 'grid',
    placeItems: 'center',
    height: '5rem',
    borderRadius: '0.75rem',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.18em',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    filter: 'grayscale(1)',
  },
  faqItem: {
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  faqQ: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 0',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 500,
    textAlign: 'left',
    cursor: 'pointer',
  },
  faqA: {
    paddingBottom: '1.25rem',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.875rem',
    lineHeight: 1.6,
  },
};
