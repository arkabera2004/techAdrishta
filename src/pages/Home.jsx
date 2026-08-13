// src/pages/Home.jsx
import { useState, useRef, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';

import FlipClock from '../components/FlipClock';
import TicketCard from '../components/TicketCard';
import SpeakerCard from '../components/SpeakerCard';
import Lanyard from '../components/Lanyard';
import MusicPlayer from '../components/MusicPlayer.jsx'


import { events, FEST } from '../data/events';
import { fetchEvents, supabase } from '../lib/supabase';
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
function StickyTicket({ event, index, baseTilt, scrollContainerRef, isScrolling, bootState, nintendoIndex }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollContainerRef,
    offset: ["start end", `start ${160 + index * 24}px`]
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [baseTilt, 0]);

  const isNintendo = !isScrolling;
  const isNintendoVisible = bootState === 'F' && nintendoIndex >= index;
  return (
    <div
      ref={ref}
      style={{
        position: isNintendo ? 'absolute' : 'sticky',
        top: isNintendo ? `calc(160px + ${index * 24}px)` : `calc(160px + ${index * 24}px)`,
        left: 0,
        width: '100%',
        zIndex: isNintendo ? (index + 50) : (index + 10),
        pointerEvents: isNintendo ? (isNintendoVisible ? 'auto' : 'none') : 'auto',
      }}
    >
      <motion.div
        initial={false}
        animate={{ 
          y: isNintendo ? (isNintendoVisible ? 0 : 500) : 0, 
          opacity: isNintendo ? (isNintendoVisible ? 1 : 0) : 1 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={isNintendo ? {} : { rotate, transformOrigin: 'center center' }}
        whileHover={isNintendo ? {} : { rotate: 0 }}
      >
        <TicketCard event={event} tilt={0} />
      </motion.div>
    </div>
  );
}

/* ─── Page Component ─── */
export default function Home() {
  const context = useOutletContext();
  const bootSequenceTriggered = context?.bootSequenceTriggered ?? true;
  const [schedDay, setSchedDay] = useState('day1');
  const [openFaq, setOpenFaq] = useState(null);
  const [innerScrollRef, setInnerScrollRef] = useState(null);

  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;
    // ResizeObserver moved to SwitchEventCard
  }, []);

  const { scrollY } = useScroll();
  const [vh2, setVh2] = useState(2000);
  useEffect(() => { setVh2(window.innerHeight * 2); }, []);
  const contentY = useTransform(scrollY, [vh2, vh2 + contentHeight], [0, -contentHeight]);


  const [bootState, setBootState] = useState('A');
  const [mobileStartClicked, setMobileStartClicked] = useState(false);

  const showHeroDetails = bootState === 'D' || bootState === 'E';
  const showMobileStart = bootState === 'D' && !mobileStartClicked;

  // 1. Scroll Prevention During Boot
  useEffect(() => {
    // Only allow scrolling once bootState has reached at least C
    if (bootState === 'C' || bootState === 'D' || bootState === 'E') {
      document.body.style.overflow = '';
    } else {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [bootState]);

  // 2. Setup Sticky Scroll Container
  const heroWrapperRef = useRef(null);

  const zoomTrackerRef = useRef(null);
  const { scrollYProgress: zoomProgress } = useScroll({
    target: zoomTrackerRef,
    offset: ["start start", "end end"]
  });

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroWrapperRef,
    offset: ["start start", "end end"]
  });

  const panelARef = useRef(null);
  const { scrollYProgress: panelAProgress } = useScroll({
    target: panelARef,
    container: innerScrollRef,
    offset: ["start end", "start top"]
  });
  const heroScale = useTransform(panelAProgress, [0, 1], [1, 0.97]);
  const heroOpacity = useTransform(panelAProgress, [0, 1], [1, 0.75]);
  const heroY = useTransform(panelAProgress, [0, 1], ["0px", "-20px"]);

  const panelBRef = useRef(null);
  const { scrollYProgress: panelBProgress } = useScroll({
    target: panelBRef,
    container: innerScrollRef,
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
              type: dbMatch.type,
              event_date: dbMatch.event_date,
              event_time: dbMatch.event_time,
              venue: dbMatch.venue || staticEv.venue
            };
          }
          return staticEv;
        }));
      }
    }).catch(err => console.error("Failed to fetch events", err));

    const channel = supabase
      .channel("events-availability")
      .on("broadcast", { event: "seats_updated" }, ({ payload }) => {
        console.log("BROADCAST PAYLOAD (Home):", payload);
        setEventsList((prev) =>
          prev.map((e) =>
            e.id === payload.event_id
              ? { ...e, seatsLeft: payload.seats_left }
              : e
          )
        );
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const featuredEvents = eventsList.slice(0, 3);
  const topSpeakers = speakers.slice(0, 4);

  function triggerRegisterSlide() {
    sessionStorage.setItem("ticket-register-slide", "1");
  }

  return (
    <main style={{ backgroundColor: '#000', paddingTop: 0 }}>
      {/* ─── NEW HERO ─── */}
            <section ref={heroWrapperRef} style={{ height: `calc(300vh + ${contentHeight}px)`, position: 'relative', zIndex: 20 }}>
        <div ref={zoomTrackerRef} style={{ position: 'absolute', top: 0, height: '300vh', width: '100%', pointerEvents: 'none' }} />
          <div style={{ 
              position: 'sticky',
              top: 0,
              height: '100vh',
              backgroundColor: '#0A0908', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center',
              overflow: 'hidden'
          }}>
              {/* Radial glow */}
          <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80vw',
              height: '80vw',
              maxWidth: '800px',
              maxHeight: '800px',
              background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, rgba(212,175,55,0) 70%)',
              pointerEvents: 'none',
              zIndex: 0
          }} />

          <div style={{ flex: 1, width: '100%' }} />

          <div style={{ zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <SwitchEventCard 
                onBootStateChange={setBootState} 
                isZoomingOut={bootSequenceTriggered} 
                scrollYProgress={zoomProgress}
                contentY={contentY}
                onContentHeightChange={setContentHeight}
              >
                 {({ scrollRef, isScrolling, bootState, nintendoIndex }) => {
                     if (!innerScrollRef && scrollRef.current) {
                         setTimeout(() => setInnerScrollRef(scrollRef.current), 0);
                     }
                     return (
                         <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
{/* ─── PANEL A (Foreground Layer) ─── */}
      <section
        ref={panelARef}
        style={{
          position: !isScrolling ? 'absolute' : 'relative',
          top: 0,
          left: 0,
          width: '100%',
          height: !isScrolling ? '100%' : 'auto',
          zIndex: 10,
          backgroundColor: !isScrolling ? 'transparent' : 'var(--bg)',
          paddingTop: !isScrolling ? 0 : '2rem',
          opacity: !isScrolling ? (bootState === 'F' ? 1 : 0) : 1,
          pointerEvents: !isScrolling ? (bootState === 'F' ? 'auto' : 'none') : 'auto',
          transition: 'opacity 0.5s ease',
        }}
      >

        <div style={!isScrolling ? { margin: 0, padding: 0 } : styles.contentWrap}>
          {/* ─── FEATURED TICKETS ─── */}
          <section>
            <div style={{
              ...styles.sectionHeader,
              display: !isScrolling ? 'none' : 'flex',
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
            <div style={{ paddingBottom: !isScrolling ? 0 : '2.5rem', paddingTop: !isScrolling ? 0 : '2rem' }}>
              <div style={{ display: 'flex', width: '100%', flexDirection: 'column', gap: !isScrolling ? 0 : '5rem' }}>
                {featuredEvents.map((ev, i) => (
                  <StickyTicket key={ev.id} event={ev} index={i} baseTilt={ev.tilt ?? 0} scrollContainerRef={innerScrollRef} isScrolling={isScrolling} bootState={bootState} nintendoIndex={nintendoIndex} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

                          </div>
                      );
                  }}
              </SwitchEventCard>
            </div>

            <div style={{ flex: 1, width: '100%' }} />
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
