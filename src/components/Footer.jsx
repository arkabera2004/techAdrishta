// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { FEST } from '../data/events';

const links = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/talks", label: "Tech Talks" },
  { to: "/sponsors", label: "Sponsors" },
  { to: "/team", label: "Team" },
  { to: "/register", label: "Register" },
];

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid} className="footer-grid">
          {/* Brand & Details */}
          <div>
            <h3 style={styles.brand}>{FEST.name}</h3>
            <p style={styles.textMuted}>{FEST.tagline}</p>
            <p style={{ ...styles.textMuted, marginTop: '1rem' }}>
              {FEST.dates}
              <br />
              {FEST.venue}
            </p>
          </div>
          
          {/* Explore Links */}
          <div style={styles.col}>
            <h4 style={styles.heading}>Explore</h4>
            <ul style={styles.list}>
              {links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} style={styles.link} className="hover-cyan">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/admin" style={styles.link} className="hover-cyan">
                  Organiser login
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Details */}
          <div style={styles.col}>
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

      <style dangerouslySetInnerHTML={{ __html: `
        .hover-cyan { transition: color 0.2s; }
        .hover-cyan:hover { color: #22d3ee !important; }
        @media (min-width: 640px) {
          .footer-grid { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
        }
      `}} />
    </footer>
  );
}

const styles = {
  footer: {
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  container: {
    margin: '0 auto',
    maxWidth: '72rem',
    padding: '3rem 1.25rem 0',
  },
  grid: {
    display: 'grid',
    gap: '2rem',
    paddingBottom: '3rem',
    gridTemplateColumns: '1fr',
  },
  brand: {
    fontSize: '1.125rem',
    fontWeight: 800,
    color: '#fff',
    fontFamily: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
  },
  textMuted: {
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.6)',
    marginTop: '0.5rem',
  },
  col: {
    fontSize: '0.875rem',
  },
  heading: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#fff',
  },
  list: {
    marginTop: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    listStyle: 'none',
    color: 'rgba(255,255,255,0.6)',
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
  },
  socials: {
    marginTop: '1rem',
    display: 'flex',
    gap: '0.75rem',
    color: 'rgba(255,255,255,0.6)',
  },
  copyright: {
    paddingBottom: '2rem',
    textAlign: 'center',
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.6)',
  },
};
