import { useState } from 'react';
import { 
  BadgeCheck, 
  User, 
  Briefcase, 
  Mic, 
  Link as LinkIcon 
} from 'lucide-react';
import { events } from '../data/events';

const Linkedin = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Instagram = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Twitter = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Github = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function SpeakerCard({ speaker }) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Attempt to find the event this speaker is giving to show date/time
  const relatedEvent = events.find(e => e.speaker?.name === speaker.name);

  return (
    <div
      style={styles.container}
      onClick={() => setIsFlipped(!isFlipped)}
      className="speaker-card-container group"
    >
      <div
        style={{
          ...styles.inner,
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <CardFront speaker={speaker} />
        <CardBack speaker={speaker} event={relatedEvent} />
      </div>
    </div>
  );
}

function CardFront({ speaker }) {
  return (
    <div style={styles.front}>
      <img
        src={speaker.image}
        alt={speaker.name}
        className="speaker-img"
        style={styles.image}
      />
      <div style={styles.frontGradient} />
      <div style={styles.frontContent}>
        <h3 style={styles.nameRow}>
          {speaker.name}
          <BadgeCheck size={20} fill="#3b82f6" color="#ffffff" style={{ flexShrink: 0 }} />
        </h3>
        <p style={styles.role}>{speaker.role}</p>
        <p style={styles.bioFront}>
          {speaker.bio}
        </p>
      </div>
    </div>
  );
}

function CardBack({ speaker, event }) {
  // If the data structure has an array of experiences, use it. Otherwise, split by '. ' or just show the string.
  const expList = Array.isArray(speaker.experience) 
    ? speaker.experience 
    : speaker.experience.split('. ').filter(Boolean).map(s => s + (s.endsWith('.') ? '' : '.'));

  return (
    <div style={styles.back}>
      <div style={styles.backContent}>
        
        {/* About */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <User size={18} />
            About
          </div>
          <p style={styles.sectionBody}>
            {speaker.bio}
          </p>
        </div>

        {/* Experience */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <Briefcase size={18} />
            Experience
          </div>
          <ul style={styles.experienceList}>
            {expList.map((exp, i) => (
              <li key={i} style={styles.experienceItem}>{exp}</li>
            ))}
          </ul>
        </div>

        {/* Talk / Session */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <Mic size={18} />
            Talk / Session
          </div>
          <div style={styles.sectionBody}>
            <p style={{ color: '#cbd5e1', marginBottom: '0.25rem' }}>
              {event ? event.title : speaker.talk}
            </p>
            {(event || speaker.date) && (
              <p style={{ color: '#64748b' }}>
                {event ? `${event.date} • ${event.time}` : `${speaker.date} • ${speaker.time}`}
              </p>
            )}
          </div>
        </div>

        {/* Connect */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <LinkIcon size={18} />
            Connect
          </div>
          <div style={styles.socials}>
            {speaker.socials?.linkedin && (
              <a href={speaker.socials.linkedin} target="_blank" rel="noreferrer" style={styles.socialIconBtn}>
                <Linkedin size={18} />
              </a>
            )}
            {speaker.socials?.instagram && (
              <a href={speaker.socials.instagram} target="_blank" rel="noreferrer" style={styles.socialIconBtn}>
                <Instagram size={18} />
              </a>
            )}
            {speaker.socials?.twitter && !speaker.socials?.instagram && (
              <a href={speaker.socials.twitter} target="_blank" rel="noreferrer" style={styles.socialIconBtn}>
                <Twitter size={18} />
              </a>
            )}
            {speaker.socials?.github && !speaker.socials?.instagram && (
              <a href={speaker.socials.github} target="_blank" rel="noreferrer" style={styles.socialIconBtn}>
                <Github size={18} />
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    margin: '0 auto',
    height: '480px', // Increased height to prevent vertical scroll on the back
    width: '100%',
    maxWidth: '22rem',
    cursor: 'pointer',
    perspective: '1200px',
  },
  inner: {
    position: 'relative',
    height: '100%',
    width: '100%',
    borderRadius: '1.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    transformStyle: 'preserve-3d',
    transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
  },
  front: {
    position: 'absolute',
    inset: 0,
    height: '100%',
    width: '100%',
    borderRadius: '1.5rem',
    overflow: 'hidden',
    backgroundColor: '#0f141e',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    transition: 'transform 700ms ease-out',
  },
  frontGradient: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(10,14,23,1) 0%, rgba(10,14,23,0.8) 20%, rgba(10,14,23,0.3) 50%, transparent 100%)',
  },
  frontContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: '1.5rem',
    textAlign: 'left',
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '1.35rem',
    fontWeight: 700,
    color: '#ffffff',
    margin: 0,
    fontFamily: "'Inter', sans-serif",
  },
  role: {
    marginTop: '0.25rem',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: '#cbd5e1',
    margin: '0.25rem 0 0 0',
    fontFamily: "'Inter', sans-serif",
  },
  bioFront: {
    marginTop: '0.5rem',
    fontSize: '0.75rem',
    color: '#64748b',
    maxWidth: '95%',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    margin: '0.5rem 0 0 0',
    lineHeight: 1.5,
    fontFamily: "'Inter', sans-serif",
  },
  back: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: '1.5rem',
    backgroundColor: '#0a0d14', // very dark navy matching the image
    padding: '1.75rem',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    transform: 'rotateY(180deg)',
    fontFamily: "'Inter', sans-serif",
    border: '1px solid rgba(255,255,255,0.03)',
  },
  backContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    textAlign: 'left',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: '#f8fafc', // bright white for titles
    fontSize: '1.05rem',
    fontWeight: 500,
  },
  sectionBody: {
    fontSize: '0.85rem',
    color: '#94a3b8', // slate gray
    lineHeight: 1.6,
    margin: '0 0 0 1.85rem', // indent under the icon
  },
  experienceList: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    lineHeight: 1.6,
    margin: '0 0 0 1.85rem',
    paddingLeft: '1rem',
    listStyleType: 'disc',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  experienceItem: {
    paddingLeft: '0.25rem',
  },
  socials: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginLeft: '1.85rem',
  },
  socialIconBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#cbd5e1',
    textDecoration: 'none',
    transition: 'all 0.2s',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
};
