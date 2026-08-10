// src/pages/EventDetail.jsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, MapPin, Users, BadgeCheck } from 'lucide-react';
import { events, getCategoryTheme } from '../data/events';

export default function EventDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const event      = events.find(e => e.id === id);

  if (!event) {
    return (
      <main style={styles.notFound}>
        <h1 style={{ color: '#fff' }}>Event not found.</h1>
        <Link to="/events" style={styles.backLink}>← Back to events</Link>
      </main>
    );
  }

  const theme = getCategoryTheme(event.category);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/events" style={styles.backLink}>
            <ArrowLeft size={16} /> All events
          </Link>
        </motion.div>

        {/* Cover image */}
        <motion.div
          style={styles.cover}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <img src={event.image_url} alt={event.title} style={styles.coverImg} />
          <div style={{ ...styles.coverOverlay, background: `linear-gradient(to top, oklch(0.14 0.018 285) 0%, transparent 60%)` }} />
          {/* Category pill over image */}
          <span style={{ ...styles.catPill, background: theme.base, color: theme.ink }}>
            {theme.label}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          style={styles.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          {event.title}
        </motion.h1>
        <p style={styles.desc}>{event.description}</p>

        {/* Main grid */}
        <div style={styles.mainGrid}>
          {/* Left column */}
          <div style={styles.leftCol}>
            {/* Info panel */}
            <div style={styles.glassBox}>
              <h2 style={styles.boxTitle}>Event Details</h2>
              <div style={styles.infoGrid}>
                {[
                  { icon: <Calendar size={16}/>, label: 'Date',       value: event.date      },
                  { icon: <Clock    size={16}/>, label: 'Time',       value: event.time      },
                  { icon: <MapPin   size={16}/>, label: 'Venue',      value: event.venue     },
                  { icon: <Users    size={16}/>, label: 'Seats left', value: `${event.seatsLeft} / ${event.seats}` },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={styles.infoItem}>
                    <span style={styles.infoIcon}>{icon}</span>
                    <div>
                      <div style={styles.infoLabel}>{label}</div>
                      <div style={styles.infoValue}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules panel */}
            {(event.category === 'hackathon' || event.category === 'competition') && event.rules.length > 0 && (
              <div style={styles.glassBox}>
                <h2 style={styles.boxTitle}>Rules & Guidelines</h2>
                <ul style={styles.rulesList}>
                  {event.rules.map((r, i) => (
                    <li key={i} style={styles.ruleItem}>
                      <span style={{ ...styles.ruleDot, background: theme.base }} />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Speaker panel */}
            {event.speaker && (
              <div style={styles.glassBox}>
                <h2 style={styles.boxTitle}>Speaker</h2>
                <div style={styles.speakerRow}>
                  <div style={styles.speakerAvatar}>
                    <img src={event.speaker.image} alt={event.speaker.name} style={styles.speakerAvatarImg} />
                  </div>
                  <div>
                    <div style={styles.speakerName}>
                      {event.speaker.name}
                      <BadgeCheck size={16} color="#3b82f6" style={{ display: 'inline', marginLeft: '4px' }} />
                    </div>
                    <div style={styles.speakerRole}>{event.speaker.role}</div>
                    <p style={styles.speakerBio}>{event.speaker.bio}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Aside — purchase card */}
          <aside style={styles.aside}>
            <div style={styles.purchaseCard}>
              <div style={styles.purchasePrice}>
                {event.price === 0
                  ? <span style={{ color: '#10b981', fontSize: '2.25rem', fontWeight: 800 }}>Free</span>
                  : (
                    <>
                      <span style={styles.priceCurrency}>₹</span>
                      <span style={styles.priceAmount}>{event.price}</span>
                    </>
                  )
                }
              </div>
              <p style={styles.priceNote}>per attendee · UPI payment</p>
              <button
                onClick={() => navigate(`/register?event=${event.id}`)}
                style={styles.registerBtn}
                id={`detail-register-btn-${event.id}`}
              >
                Register for this event
              </button>
              <div style={styles.purchaseMeta}>
                <span style={{ color: event.seatsLeft < 20 ? '#ef4444' : '#10b981' }}>
                  {event.seatsLeft} seats left
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: { paddingTop: '96px', minHeight: '100svh' },
  container: {
    maxWidth: '72rem',
    margin: '0 auto',
    padding: '2rem 1.25rem 6rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  notFound: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60svh',
    gap: '1rem',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.875rem',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  cover: {
    position: 'relative',
    height: '320px',
    borderRadius: '1.25rem',
    overflow: 'hidden',
  },
  coverImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  coverOverlay: {
    position: 'absolute',
    inset: 0,
  },
  catPill: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    padding: '4px 12px',
    borderRadius: '999px',
    fontSize: '0.6875rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 800,
    fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
    color: '#fff',
    lineHeight: 1.1,
  },
  desc: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '1rem',
    lineHeight: 1.65,
    maxWidth: '60ch',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: '2rem',
    alignItems: 'start',
    '@media (max-width: 768px)': { gridTemplateColumns: '1fr' },
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  glassBox: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '1rem',
    padding: '1.5rem',
    backdropFilter: 'blur(12px)',
  },
  boxTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: '1rem',
    color: '#fff',
    marginBottom: '1.25rem',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '1rem',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
  },
  infoIcon: {
    color: '#22d3ee',
    marginTop: '2px',
    flexShrink: 0,
  },
  infoLabel: {
    fontSize: '0.6875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.35)',
    marginBottom: '0.25rem',
  },
  infoValue: {
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: '#fff',
  },
  rulesList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem',
  },
  ruleItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 1.5,
  },
  ruleDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: '0.45em',
  },
  speakerRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  speakerAvatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid #8b5cf6',
    flexShrink: 0,
  },
  speakerAvatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'top',
  },
  speakerName: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: '1rem',
    color: '#fff',
    marginBottom: '0.25rem',
  },
  speakerRole: {
    fontSize: '0.8125rem',
    color: '#8b5cf6',
    marginBottom: '0.5rem',
  },
  speakerBio: {
    fontSize: '0.8125rem',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.5,
  },
  aside: {
    position: 'sticky',
    top: '96px',
  },
  purchaseCard: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '1.25rem',
    padding: '2rem',
    backdropFilter: 'blur(16px)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  purchasePrice: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.25rem',
  },
  priceCurrency: {
    fontSize: '1.5rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  priceAmount: {
    fontSize: '2.5rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontFamily: "'Space Grotesk', sans-serif",
  },
  priceNote: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.35)',
    marginTop: '-0.25rem',
  },
  registerBtn: {
    display: 'block',
    width: '100%',
    padding: '14px',
    borderRadius: '0.875rem',
    background: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.9375rem',
    fontFamily: "'Space Grotesk', sans-serif",
    border: 'none',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'opacity 0.2s',
  },
  purchaseMeta: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    textAlign: 'center',
  },
};
