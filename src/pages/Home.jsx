// src/pages/Home.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';

import FlipClock from '../components/FlipClock';
import TicketCard from '../components/TicketCard';
import SpeakerCard from '../components/SpeakerCard';
import Lanyard from '../components/Lanyard';
import MusicPlayer from '../components/MusicPlayer.jsx'


import { events, FEST } from '../data/events';
import { speakers } from '../data/speakers';
import { schedule, scheduleColors } from '../data/schedule';
import { RevealText, RevealBreath, StaggerGroup, StaggerItem } from '../components/animations/Reveal';
import SwitchEventCard from '../components/SwitchEventCard.jsx';

/* ─── Constants & Data ─── */
const SPONSORS = ["HP", "DELL", "GOOGLE", "COCO COLA", "REDBULL", "JAVA"];

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
          {/* <div>
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
                Expect engiers who ship at scale, founders mid-raise, and security researchers who
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
          </RevealBreath> */}
          <SwitchEventCard />
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
      </div>

      {/* ─── SPEAKERS ─── */}
      <section style={{
        position: 'relative',
        width: '100%',
        margin: 0,
        padding: 0,
        aspectRatio: '1600 / 785',
        backgroundImage: "url('/speakerbackground.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
      }}>
        {/* MusicPlayer — far left of stage */}
        <div style={{
          position: 'absolute',
          left: '-1%',
          top: '70%',
          transform: 'translateY(-50%)',
          width: '17%',
          zIndex: 10,
        }}>
          <MusicPlayer />
        </div>

        {/* ─── "Featured Speaker" — pinned to top center ─── */}
        <div style={{
          position: 'absolute',
          top: '6%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}>
          <p style={{
            margin: 0,
            fontSize: 'clamp(0.6rem, 1vw, 0.85rem)',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#d4af37',
          }}>
            ✦ &nbsp; Featured Speaker &nbsp; ✦
          </p>
        </div>

        {/* ─── Speaker details — true screen center ─── */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '36%',
          zIndex: 10,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Speaker Name */}
          <h2 style={{
            margin: 0,
            fontSize: 'clamp(1.4rem, 3vw, 2.8rem)',
            fontWeight: 700,
            lineHeight: 1.05,
            fontFamily: "'Georgia', 'Times New Roman', serif",
            color: '#ffffff',
            letterSpacing: '-0.01em',
          }}>
            {topSpeakers[0]?.name}
          </h2>

          {/* Role · Company */}
          <p style={{
            margin: '0.5em 0 0',
            fontSize: 'clamp(0.7rem, 1.1vw, 0.95rem)',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            color: 'rgba(255,255,255,0.75)',
          }}>
            {topSpeakers[0]?.role}
            {topSpeakers[0]?.company && (
              <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>
                {' '}· {topSpeakers[0].company}
              </span>
            )}
          </p>

          {/* Gold divider */}
          <div style={{
            width: '2rem',
            height: '2px',
            background: '#d4af37',
            margin: '0.9em 0',
            borderRadius: '2px',
            opacity: 0.75,
          }} />

          {/* Talk title */}
          <p style={{
            margin: 0,
            fontSize: 'clamp(0.6rem, 0.95vw, 0.85rem)',
            fontFamily: "'Georgia', serif",
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.6,
            maxWidth: '30ch',
          }}>
            "{topSpeakers[0]?.talk}"
          </p>

          {/* Bio */}
          <p style={{
            margin: '0.8em 0 0',
            fontSize: 'clamp(0.55rem, 0.85vw, 0.75rem)',
            fontFamily: "'Inter', sans-serif",
            color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.65,
            maxWidth: '34ch',
          }}>
            {topSpeakers[0]?.bio}
          </p>

          {/* Social Icons */}
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.1em' }}>
            {topSpeakers[0]?.socials?.linkedin && (
              <a href={topSpeakers[0].socials.linkedin} target="_blank" rel="noreferrer" style={iconBtnStyle}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            )}
            {topSpeakers[0]?.socials?.twitter && (
              <a href={topSpeakers[0].socials.twitter} target="_blank" rel="noreferrer" style={iconBtnStyle}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
            )}
            {topSpeakers[0]?.socials?.github && (
              <a href={topSpeakers[0].socials.github} target="_blank" rel="noreferrer" style={iconBtnStyle}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
            )}
            {topSpeakers[0]?.socials?.instagram && (
              <a href={topSpeakers[0].socials.instagram} target="_blank" rel="noreferrer" style={iconBtnStyle}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Podium + Speaker composite — right spotlight */}
        <div style={{
          position: 'absolute',
          right: '10%',
          bottom: 0,
          width: '22%',
        }}>
          {/* Speaker — bottom anchored to the podium desk top (~38% up from base of podium) */}
          {/* NOTE: 38% offset is tuned to this specific podium.png — re-tune if podium asset changes */}
          <img
            src={topSpeakers[0]?.image}
            alt={topSpeakers[0]?.name}
            style={{
              position: 'absolute',
              bottom: '75%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              objectFit: 'contain',
              objectPosition: 'bottom',
              filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
              zIndex: 1,
            }}
          />
          {/* Podium — sits above speaker in z-order to mask lower body */}
          <img
            src="/podium.png"
            alt="Podium"
            style={{
              position: 'relative',
              width: '100%',
              display: 'block',
              objectFit: 'contain',
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))',
              zIndex: 2,
            }}
          />
        </div>
      </section>

      <div style={styles.contentWrap}>
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
            <h2 className="section-title">Sponsors</h2>
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

const iconBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '34px',
  height: '34px',
  borderRadius: '50%',
  border: '1px solid rgba(255,255,255,0.15)',
  color: 'rgba(255,255,255,0.7)',
  textDecoration: 'none',
  transition: 'background 0.2s, color 0.2s',
};

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
