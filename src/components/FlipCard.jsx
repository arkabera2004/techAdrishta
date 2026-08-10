// src/components/FlipCard.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, ExternalLink, Globe } from 'lucide-react';

export default function FlipCard({ speaker }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      style={styles.scene}
      onClick={() => setFlipped(f => !f)}
      id={`speaker-card-${speaker.id}`}
    >
      <motion.div
        style={styles.card}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, type: 'spring', stiffness: 180, damping: 22 }}
      >
        {/* --- FRONT --- */}
        <div style={styles.face}>
          {/* Speaker image */}
          <img
            src={speaker.image}
            alt={speaker.name}
            style={styles.image}
            loading="lazy"
          />
          {/* Bottom gradient overlay */}
          <div style={styles.overlay} />
          {/* Info */}
          <div style={styles.frontInfo}>
            <div style={styles.nameRow}>
              <span style={styles.name}>{speaker.name}</span>
              <BadgeCheck size={18} color="#3b82f6" style={{ flexShrink: 0 }} />
            </div>
            <span style={styles.role}>{speaker.role}</span>
            <p style={styles.bio}>{speaker.bio}</p>
          </div>
          {/* Hint */}
          <span style={styles.hintFront}>Tap to flip</span>
        </div>

        {/* --- BACK --- */}
        <div style={{ ...styles.face, ...styles.back }}>
          <div style={styles.backContent}>
            {/* Header */}
            <div style={styles.backHeader}>
              <div style={styles.backAvatar}>
                <img src={speaker.image} alt={speaker.name} style={styles.avatarImg} />
              </div>
              <div>
                <div style={styles.backName}>{speaker.name}</div>
                <div style={styles.backCompany}>{speaker.company}</div>
              </div>
            </div>

            <div style={styles.divider} />

            {/* Sections */}
            <Section title="About">
              {speaker.bio}
            </Section>
            <Section title="Experience">
              {speaker.experience}
            </Section>
            <Section title="Talk / Session">
              {speaker.talk}
            </Section>

            <div style={styles.divider} />

            {/* Connect */}
            <div style={styles.connectRow}>
              <span style={styles.sectionTitle}>Connect</span>
              <div style={styles.socials}>
              <a href={speaker.socials.github}   target="_blank" rel="noreferrer" style={styles.socialLink} aria-label="GitHub"><Globe size={16}/></a>
              <a href={speaker.socials.linkedin} target="_blank" rel="noreferrer" style={styles.socialLink} aria-label="LinkedIn"><ExternalLink size={16}/></a>
              <a href={speaker.socials.twitter}  target="_blank" rel="noreferrer" style={styles.socialLink} aria-label="Twitter"><ExternalLink size={14}/></a>
            </div>
            </div>

            <span style={styles.hintBack}>Tap to flip back</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '0.625rem' }}>
      <span style={styles.sectionTitle}>{title}</span>
      <p style={styles.sectionBody}>{children}</p>
    </div>
  );
}

const styles = {
  scene: {
    perspective: '1200px',
    cursor: 'pointer',
    width: '100%',
    height: '380px',
    userSelect: 'none',
  },
  card: {
    width: '100%',
    height: '100%',
    position: 'relative',
    transformStyle: 'preserve-3d',
  },
  face: {
    position: 'absolute',
    inset: 0,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    borderRadius: '1.25rem',
    overflow: 'hidden',
    background: 'oklch(0.18 0.02 285)',
    border: '1px solid rgba(255,255,255,0.07)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'top center',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(8,4,18,0.97) 0%, rgba(8,4,18,0.6) 45%, transparent 100%)',
  },
  frontInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
  },
  name: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: '1rem',
    color: '#fff',
  },
  role: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.55)',
    fontWeight: 500,
  },
  bio: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    marginTop: '0.25rem',
  },
  hintFront: {
    position: 'absolute',
    top: '0.75rem',
    right: '0.75rem',
    fontSize: '0.625rem',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: 'rgba(255,255,255,0.35)',
    background: 'rgba(0,0,0,0.35)',
    padding: '2px 8px',
    borderRadius: '999px',
  },
  back: {
    transform: 'rotateY(180deg)',
    background: 'oklch(0.16 0.022 285)',
  },
  backContent: {
    padding: '1.25rem',
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  backHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.25rem',
  },
  backAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid #8b5cf6',
    flexShrink: 0,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'top',
  },
  backName: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: '0.9375rem',
    color: '#fff',
  },
  backCompany: {
    fontSize: '0.75rem',
    color: '#8b5cf6',
  },
  divider: {
    height: '1px',
    background: 'rgba(255,255,255,0.07)',
    margin: '0.25rem 0',
  },
  sectionTitle: {
    display: 'block',
    fontSize: '0.6rem',
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    color: 'rgba(255,255,255,0.3)',
    marginBottom: '0.2rem',
    fontWeight: 600,
  },
  sectionBody: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 1.45,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  connectRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  socials: {
    display: 'flex',
    gap: '0.625rem',
  },
  socialLink: {
    color: 'rgba(255,255,255,0.5)',
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.2s',
  },
  hintBack: {
    fontSize: '0.6rem',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: 'rgba(255,255,255,0.25)',
    textAlign: 'right',
  },
};
