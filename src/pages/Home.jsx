// src/pages/Home.jsx
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';

import FlipClock from '../components/FlipClock';
import TicketCard from '../components/TicketCard';
import SpeakerCard from '../components/SpeakerCard';
import Lanyard from '../components/Lanyard';
import MusicPlayer from '../components/MusicPlayer.jsx'


import { events, FEST } from '../data/events';
import { fetchEvents } from '../lib/supabase';
import { speakers } from '../data/speakers';
import { schedule, scheduleColors } from '../data/schedule';
import { RevealText, RevealBreath, StaggerGroup, StaggerItem } from '../components/animations/Reveal';
import SwitchEventCard from '../components/SwitchEventCard.jsx';
import TimelineSchedule from '../components/TimelineSchedule.jsx';

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
    "Yes — all TED talks are free to attend, but seats are allotted on registration order.",
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

/* ─── Helper Component for Sticky Tickets ─── */
function StickyTicket({ event, index, baseTilt }) {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", `start ${160 + index * 24}px`]
  });
  
  const rotate = useTransform(scrollYProgress, [0, 1], [baseTilt, 0]);
  
  return (
    <div
      ref={ref}
      style={{
        position: 'sticky',
        top: `calc(160px + ${index * 24}px)`,
        zIndex: index + 10,
      }}
    >
      <motion.div 
        style={{ rotate, transformOrigin: 'center center' }}
        whileHover={{ rotate: 0 }}
      >
        <TicketCard event={event} tilt={0} />
      </motion.div>
    </div>
  );
}

/* ─── Page Component ─── */
export default function Home() {
  const [schedDay, setSchedDay] = useState('day1');
  const [openFaq, setOpenFaq] = useState(null);

  const panelARef = useRef(null);
  const { scrollYProgress: panelAProgress } = useScroll({
    target: panelARef,
    offset: ["start end", "start top"]
  });
  const heroScale = useTransform(panelAProgress, [0, 1], [1, 0.97]);
  const heroOpacity = useTransform(panelAProgress, [0, 1], [1, 0.75]);
  const heroY = useTransform(panelAProgress, [0, 1], ["0px", "-20px"]);

  const panelBRef = useRef(null);
  const { scrollYProgress: panelBProgress } = useScroll({
    target: panelBRef,
    offset: ["start end", "start top"]
  });
  const speakerScale = useTransform(panelBProgress, [0, 1], [1, 0.97]);
  const speakerOpacity = useTransform(panelBProgress, [0, 1], [1, 0.75]);
  const speakerY = useTransform(panelBProgress, [0, 1], ["0px", "-20px"]);

  const [eventsList, setEventsList] = useState(events);

  useEffect(() => {
    fetchEvents().then(data => {
      if (data && data.length > 0) {
        setEventsList(events.map(staticEv => {
          const dbMatch = data.find(d => d.id === staticEv.id);
          if (dbMatch) {
            return {
              ...staticEv,
              id: dbMatch.id, // Use UUID for correct routing
              title: dbMatch.name, // Update title dynamically
              price: dbMatch.price,
              seatsLeft: dbMatch.seats_left,
              seatLimit: dbMatch.seat_limit,
              type: dbMatch.type
            };
          }
          return staticEv;
        }));
      }
    }).catch(err => console.error("Failed to fetch events", err));
  }, []);

  const featuredEvents = eventsList.slice(0, 3);
  const topSpeakers = speakers.slice(0, 4);

  function triggerRegisterSlide() {
    sessionStorage.setItem("ticket-register-slide", "1");
  }

  return (
    <main style={{ backgroundColor: '#000', paddingTop: 0 }}>
      {/* ─── HERO (Sticky Layer) ─── */}
      <section style={{ position: 'sticky', top: 0, minHeight: '100dvh', zIndex: 0, display: 'flex', flexDirection: 'column' }}>
        <motion.div style={{ scale: heroScale, opacity: heroOpacity, y: heroY, flex: 1, display: 'flex', flexDirection: 'column', transformOrigin: 'center top' }}>
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
              className="hero-register-btn"
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ffffff',
                padding: '1.25rem 4rem',
                borderRadius: '9999px',
                fontSize: '1.125rem',
                fontWeight: 800,
                color: '#000000',
                letterSpacing: '0.05em',
                textDecoration: 'none',
                boxShadow: '0 4px 14px 0 rgba(255, 255, 255, 0.39)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 255, 255, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(255, 255, 255, 0.39)';
              }}
            >
              <span style={{ position: 'relative', zIndex: 10 }}>Register Now</span>
            </Link>
            <FlipClock />
          </motion.div>
        </div>
          </section>
        </motion.div>
      </section>

      {/* ─── PANEL A (Foreground Layer) ─── */}
      <section 
        ref={panelARef}
        style={{ 
          position: 'relative', 
          zIndex: 10, 
          backgroundColor: 'var(--bg)', 
          borderTopLeftRadius: '32px', 
          borderTopRightRadius: '32px', 
          boxShadow: '0 -20px 40px rgba(0,0,0,0.5)',
          paddingTop: '2rem'
        }}
      >
        <div style={{ width: '100%', overflow: 'hidden', padding: '2rem 0 5rem 0', display: 'flex', justifyContent: 'center' }}>
          <SwitchEventCard />
        </div>
        
        <div style={styles.contentWrap}>
        {/* ─── FEATURED TICKETS ─── */}
        <section>
          <div style={{ 
            ...styles.sectionHeader, 
            position: 'sticky', 
            top: '-1px', 
            zIndex: 5, 
            background: '#09090f',
            paddingTop: '96px', // Fills the 6rem gap
            marginTop: '-96px', // Offsets the padding visually
            paddingBottom: '1.5rem',
            marginLeft: '-1.25rem', // Bleed horizontally
            marginRight: '-1.25rem',
            paddingLeft: '1.25rem',
            paddingRight: '1.25rem',
          }}>
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
                <StickyTicket key={ev.id} event={ev} index={i} baseTilt={ev.tilt ?? 0} />
              ))}
            </div>
          </div>
        </section>
      </div>
      </section>

      {/* ─── SPEAKERS (Sticky Layer) ─── */}
      <section style={{ position: 'sticky', top: 0, minHeight: '100dvh', zIndex: 0, display: 'flex', flexDirection: 'column', backgroundColor: '#000', marginTop: '-100vh', marginBottom: '100vh' }}>
        <motion.div style={{ scale: speakerScale, opacity: speakerOpacity, y: speakerY, flex: 1, display: 'flex', flexDirection: 'column', transformOrigin: 'center top' }}>
          <section style={{
            position: 'relative',
            width: '100%',
            flex: 1,
            margin: 0,
            padding: 0,
            minHeight: '100dvh',
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
        </motion.div>
      </section>

      {/* ─── PANEL B (Foreground Layer) ─── */}
      <section 
        ref={panelBRef}
        style={{ 
          position: 'relative', 
          zIndex: 10, 
          backgroundColor: 'var(--bg)', 
          borderTopLeftRadius: '32px', 
          borderTopRightRadius: '32px', 
          boxShadow: '0 -20px 40px rgba(0,0,0,0.5)',
          paddingTop: '2rem'
        }}
      >
        <div style={styles.contentWrap}>
          {/* ─── SCHEDULE ─── */}
        <section>
          <RevealText>
            <h2 className="section-title">Schedule</h2>
          </RevealText>
          <RevealBreath delay={0.1} style={{ marginTop: '2rem' }}>
            <TimelineSchedule schedDay={schedDay} setSchedDay={setSchedDay} />
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
      </section>
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
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  heroContent: {
    position: 'relative',
    zIndex: 10,
    margin: '0 auto',
    display: 'flex',
    flex: 1,
    width: '100%',
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
    marginTop: '1rem',
    width: '100%',
    maxWidth: '64rem',
    fontFamily: "'Black Ops One', 'Impact', sans-serif",
    fontSize: 'clamp(3rem, 10vw, 8rem)',
    lineHeight: 0.9,
    fontWeight: 900,
    color: '#fff',
    background: 'linear-gradient(to bottom, #fef08a 0%, #eab308 40%, #ca8a04 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    WebkitTextStroke: '2px #854d0e',
    textShadow: '0 4px 20px rgba(234, 179, 8, 0.4)',
    textAlign: 'center',
    textTransform: 'uppercase',
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
