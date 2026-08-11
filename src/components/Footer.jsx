// src/components/Footer.jsx
import { FEST } from '../data/events';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      {/* Dark overlay for text readability over the background image */}
      <div style={styles.overlay}></div>

      <div style={styles.container}>
        <div style={styles.flexContainer} className="footer-flex">
          {/* Brand & Details (Left) */}
          <div style={styles.leftCol}>
            <h3 style={styles.brand}>{FEST.name}</h3>
            <p style={{ ...styles.textMuted, marginTop: '1rem', fontSize: '0.875rem' }}>
              {FEST.dates}
              <br />
              {FEST.venue}
            </p>
          </div>

          {/* Contact Details (Right) */}
          <div style={styles.rightCol}>
            <h4 style={styles.heading}>Contact</h4>
            <p style={{ ...styles.textMuted, marginTop: '0.75rem' }}>hello@techadrishta.in</p>
            <p style={{ ...styles.textMuted, marginTop: '0.25rem' }}>UPI: techadrishta@upi</p>
            <div style={styles.socials}>
              <span className="hover-cyan" style={{ cursor: 'pointer', transition: 'color 0.2s' }}>X</span>
              <span className="hover-cyan" style={{ cursor: 'pointer', transition: 'color 0.2s' }}>LinkedIn</span>
              <span className="hover-cyan" style={{ cursor: 'pointer', transition: 'color 0.2s' }}>Discord</span>
            </div>
          </div>
        </div>

        <p style={styles.copyright}>
          © 2026 {FEST.name}. Built for people who ship.
        </p>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hover-cyan { transition: color 0.2s; }
        .hover-cyan:hover { color: #22d3ee !important; }
        @media (max-width: 640px) {
          .footer-flex { flex-direction: column !important; gap: 2.5rem; }
        }
      `}} />
    </footer>
  );
}

const styles = {
  footer: {
    position: 'relative',
    backgroundImage: 'url(/footer1.jpeg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderTop: 'none',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.80)', // Dark overlay for white text readability
    zIndex: 0,
  },
  container: {
    position: 'relative',
    zIndex: 1,
    margin: '0 auto',
    width: '100%',
    padding: '4rem 2rem 0',
  },
  flexContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '3rem',
  },
  leftCol: {
    maxWidth: '400px',
  },
  rightCol: {
    maxWidth: '400px',
  },
  brand: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#fff',
    fontFamily: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
    textTransform: 'uppercase',
  },
  textMuted: {
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.7)',
    marginTop: '0.5rem',
    lineHeight: 1.5,
  },
  heading: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '1rem',
  },
  socials: {
    marginTop: '1.5rem',
    display: 'flex',
    gap: '1rem',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.875rem',
  },
  copyright: {
    paddingBottom: '2rem',
    textAlign: 'center',
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.5)',
  },
};
