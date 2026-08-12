// src/components/Header.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ParticleText from './ParticleText';

const links = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/tech-talks", label: "Tech Talk" },
  { to: "/gallery", label: "Gallery" },
  { to: "/team", label: "Team" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hoveredPath, setHoveredPath] = useState(null);
  const [focusedPath, setFocusedPath] = useState(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const activePath = links.find(link => isActive(link.to))?.to || null;
  const currentTarget = hoveredPath || focusedPath || activePath;

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    let previousY = window.scrollY;
    function handleScroll() {
      const currentY = window.scrollY;
      const scrollingDown = currentY > previousY;
      setHidden(scrollingDown && currentY > 96);
      previousY = currentY;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        style={{
          ...styles.header,
          paddingTop: isHome ? '0.75rem' : '1rem',
          paddingBottom: isHome ? '0' : '1rem',
          transform: hidden && !menuOpen ? 'translateY(-100%)' : 'translateY(0)',
        }}
      >
        <Link to="/" style={styles.topLeftLogo} className="mobile-logo" onClick={() => setMenuOpen(false)}>
          <ParticleText
            text="Tech Adrishta"
            particleSize={1.5}
            density={2}
            color="#e5e6e5ff"
            highlightColor="#ffffffff"
            scatter={120}
            gatherDuration={1200}
            stagger={200}
            pointerRepel={30}
            repelRadius={80}
            idleDrift={0.5}
            trigger="hover"
            fontSize="clamp(1.2rem, 6vw, 2rem)"
            fontWeight={900}
            fontFamily="'Space Grotesk', ui-sans-serif, system-ui, sans-serif"
            glow
          />
        </Link>

        <Link
          to="/register"
          style={styles.topRightBtn}
          className="desktop-only hover-scale"
        >
          Register Now
        </Link>

        <div style={styles.pill} className="nav-pill">
          <nav
            style={styles.desktopNav}
            className="desktop-only"
            onMouseLeave={() => setHoveredPath(null)}
          >
            {links.map((link) => {
              const isTarget = currentTarget === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    ...styles.navLink,
                    color: isTarget ? '#fff' : 'rgba(255,255,255,0.68)',
                  }}
                  onMouseEnter={() => setHoveredPath(link.to)}
                  onFocus={() => setFocusedPath(link.to)}
                  onBlur={() => setFocusedPath(null)}
                >
                  {isTarget && (
                    <motion.span
                      layoutId="site-nav-active-bubble"
                      style={styles.activeBubble}
                      transition={{ type: "spring", stiffness: 350, damping: 30, mass: 0.3 }}
                    />
                  )}
                  <span style={{ position: 'relative', zIndex: 10 }}>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            style={styles.hamburger}
            className="mobile-only"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={styles.mobileMenu}
            className="mobile-only"
          >
            <div style={styles.mobileMenuInner}>
              {links.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      ...styles.mobileLink,
                      background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                      color: active ? '#fff' : 'rgba(255,255,255,0.6)',
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{
        __html: `
        .mobile-logo { width: 320px; height: 60px; }
        @media (min-width: 768px) {
          .mobile-only { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-only { display: none !important; }
          .desktop-logo-only { display: none !important; }
          .mobile-logo { width: 220px !important; height: 50px !important; left: 1rem !important; }
          .nav-pill {
            position: absolute !important;
            right: 1rem !important;
            top: 0.75rem !important;
            padding: 0.5rem !important;
          }
        }
        .hover-scale { transition: transform 0.2s ease, filter 0.2s ease; }
        .hover-scale:hover { transform: scale(1.05); filter: brightness(1.15); }
      `}} />
    </>
  );
}

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 130,
    width: '100%',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    transition: 'transform 0.3s ease-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topLeftLogo: {
    position: 'absolute',
    top: '0.75rem',
    left: '1.5rem',
    zIndex: 120,
    textDecoration: 'none',
  },
  topRightBtn: {
    position: 'absolute',
    top: '0.75rem',
    right: '1.5rem',
    zIndex: 120,
    borderRadius: '9999px',
    border: '1px solid rgba(255,255,255,0.18)',
    background: 'rgba(255,255,255,0.08)',
    padding: '0.75rem 2.25rem',
    fontSize: '0.875rem',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '0.05em',
    textDecoration: 'none',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(255,255,255,0.08), 0 20px 60px -32px rgba(0,0,0,0.8)',
    backdropFilter: 'blur(64px) saturate(150%)',
    WebkitBackdropFilter: 'blur(64px) saturate(150%)',
    display: 'inline-flex',
  },
  pill: {
    position: 'relative',
    zIndex: 120,
    display: 'flex',
    width: 'max-content',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '9999px',
    border: '1px solid rgba(255,255,255,0.18)',
    background: 'rgba(255,255,255,0.08)',
    padding: '0.75rem 1.25rem',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(255,255,255,0.08), 0 20px 60px -32px rgba(0,0,0,0.8)',
    backdropFilter: 'blur(64px) saturate(150%)',
    WebkitBackdropFilter: 'blur(64px) saturate(150%)',
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.875rem',
    fontWeight: 600,
  },
  navLink: {
    position: 'relative',
    borderRadius: '9999px',
    padding: '0.5rem 1rem',
    transition: 'color 0.3s',
    textDecoration: 'none',
  },
  activeBubble: {
    position: 'absolute',
    inset: 0,
    borderRadius: '9999px',
    border: '1px solid rgba(255,255,255,0.18)',
    background: 'rgba(255,255,255,0.16)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.26), 0 10px 26px -18px rgba(255,255,255,0.8)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
  },
  hamburger: {
    display: 'grid',
    placeItems: 'center',
    height: '2.5rem',
    width: '2.5rem',
    borderRadius: '9999px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.04)',
    color: '#fff',
    cursor: 'pointer',
    transition: 'color 0.2s, border-color 0.2s',
  },
  mobileMenu: {
    position: 'fixed',
    inset: 0,
    zIndex: 110,
    minHeight: '100dvh',
    background: 'var(--background, oklch(0.14 0.018 285))',
    padding: '6rem 1.25rem 2rem',
  },
  mobileMenuInner: {
    margin: '0 auto',
    display: 'flex',
    maxWidth: '72rem',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  mobileLink: {
    borderRadius: '1rem',
    padding: '1.25rem 1.5rem',
    fontSize: '1.25rem',
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'background 0.2s, color 0.2s',
  },
};
