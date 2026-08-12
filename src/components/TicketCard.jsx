// src/components/TicketCard.jsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion, animate } from 'framer-motion';
import { getCategoryTheme } from '../data/events';

/* ─── Clip-path constants ─── */
const TORN_EDGE_START = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
const TORN_EDGE_END =
  'polygon(0 0, 96% 0, 99% 4%, 95% 8%, 99% 13%, 94% 18%, 98% 23%, 94% 28%, 99% 33%, 95% 38%, 98% 43%, 94% 48%, 99% 53%, 95% 58%, 98% 63%, 94% 68%, 99% 73%, 95% 78%, 98% 83%, 94% 88%, 99% 93%, 96% 100%, 0 100%)';
const MOBILE_TORN_EDGE =
  'polygon(0 0, 94% 0, 98% 7%, 93% 14%, 97% 21%, 92% 28%, 98% 35%, 93% 42%, 97% 49%, 92% 56%, 98% 63%, 93% 70%, 97% 77%, 92% 84%, 98% 91%, 94% 100%, 0 100%)';

/* ─── Sound ─── */
function playTearSound() {
  const audio = new Audio('/paper-tear-sound-effect.mp3');
  audio.volume = 0.2;
  void audio.play().catch(() => { });
}

/* ─── SVG Pattern overlay (proper <defs> approach) ─── */
function Pattern({ kind, color }) {
  const id = `pat-${kind}-${color.replace('#', '')}`;
  return (
    <svg
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: 0.25,
        pointerEvents: 'none',
      }}
    >
      <defs>
        <pattern id={id} width="44" height="44" patternUnits="userSpaceOnUse">
          {kind === 'circuit' && (
            <path
              d="M2 22h14M22 2v14M22 30v12M30 22h12M22 22m-3 0a3 3 0 106 0a3 3 0 10-6 0"
              fill="none"
              stroke={color}
              strokeWidth="1.6"
            />
          )}
          {kind === 'waves' && (
            <path
              d="M0 22q11 -14 22 0t22 0"
              fill="none"
              stroke={color}
              strokeWidth="1.6"
            />
          )}
          {kind === 'gears' && (
            <g fill="none" stroke={color} strokeWidth="1.6">
              <circle cx="22" cy="22" r="8" />
              <path d="M22 6v6M22 32v6M6 22h6M32 22h6" />
            </g>
          )}
          {kind === 'grid' && (
            <g fill="none" stroke={color} strokeWidth="1.4">
              <path d="M0 0h44v44H0z" />
              <path d="M11 11h22v22H11z" />
            </g>
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/* ─── Confetti (React component, not DOM injection) ─── */
function Confetti({ color }) {
  const bits = Array.from({ length: 20 }, (_, i) => i);
  return (
    <div
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '62%',
        width: '8px',
      }}
    >
      {bits.map((i) => (
        <motion.span
          key={i}
          style={{
            position: 'absolute',
            display: 'block',
            width: '6px',
            height: '6px',
            borderRadius: '1px',
            background: i % 3 === 0 ? '#fff' : color,
            top: `${(i / bits.length) * 100}%`,
          }}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          animate={{
            opacity: 0,
            x: (i % 2 ? 1 : -1) * (20 + (i % 5) * 18),
            y: (i % 3) * 26 - 20,
            rotate: 180 + i * 12,
          }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

/* ─── Main TicketCard ─── */
export default function TicketCard({ event, tilt = 0 }) {
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  const isSoldOut = typeof event.seatsLeft === 'number' && event.seatsLeft <= 0;
  const originalTheme = getCategoryTheme(event.category);
  const theme = isSoldOut
    ? { base: '#1a1a24', ink: '#4b4b5c', accent: '#222230', label: 'CLOSED', pattern: originalTheme.pattern }
    : originalTheme;

  const [isTearing, setIsTearing] = useState(false);
  const cardRef = useRef(null);
  const hasStartedRouteChange = useRef(false);

  const go = useCallback(() => {
    navigate(`/register?event=${event.id}`);
  }, [event.id, navigate]);

  function handleRegister() {
    if (isSoldOut) return;
    playTearSound();
    if (reduced) { go(); return; }
    if (!cardRef.current || isTearing) return;
    setIsTearing(true);
  }

  /* ─── Imperative tear animation (runs once isTearing = true) ─── */
  useEffect(() => {
    if (!isTearing) return;
    const card = cardRef.current;
    const leftSource = card?.querySelector(".ticket-left");
    if (!card || !leftSource) {
      go();
      return;
    }

    const overlay = document.createElement("div");
    const scrim = document.createElement("div");
    const fragment = document.createElement("div");
    const front = document.createElement("div");
    const leftClone = leftSource.cloneNode(true);
    const leftRect = leftSource.getBoundingClientRect();

    hasStartedRouteChange.current = false;
    card.classList.add("ticket-card-is-tearing");

    overlay.className = "ticket-tear-overlay";
    scrim.className = "ticket-tear-scrim";
    fragment.className = "ticket-tear-fragment";
    front.className = "ticket-tear-face ticket-tear-front";

    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      zIndex: "9999",
      overflow: "visible",
    });

    Object.assign(fragment.style, {
      position: "absolute",
      top: `${leftRect.top}px`,
      left: `${leftRect.left}px`,
      width: `${leftRect.width}px`,
      height: `${leftRect.height}px`,
      transformOrigin: "center center",
      clipPath: TORN_EDGE_START,
    });

    Object.assign(leftClone.style, {
      width: "100%",
      height: "100%",
      minHeight: "0",
      transform: "none",
    });

    front.appendChild(leftClone);
    fragment.append(front);
    overlay.append(scrim, fragment);
    document.body.appendChild(overlay);

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const fragmentCenterX = leftRect.left + leftRect.width / 2;
    const fragmentCenterY = leftRect.top + leftRect.height / 2;
    const centerDeltaX = window.innerWidth / 2 - fragmentCenterX;
    const centerDeltaY = window.innerHeight / 2 - fragmentCenterY;
    const maxScale = Math.min(
      (window.innerWidth * (isMobile ? 0.88 : 0.82)) / leftRect.width,
      (window.innerHeight * (isMobile ? 0.58 : 0.78)) / leftRect.height,
    );
    const zoomScale = Math.max(1.04, Math.min(isMobile ? 1.16 : 1.44, maxScale));
    const destinationClip = isMobile ? MOBILE_TORN_EDGE : TORN_EDGE_END;
    const fallY = centerDeltaY + window.innerHeight / 2 + (leftRect.height * zoomScale) / 2 + 90;

    animate(scrim, { opacity: [0, 1] }, { duration: 0.35, ease: "easeOut" });

    animate(
      fragment,
      {
        x: [
          0,
          isMobile ? -8 : -18,
          centerDeltaX,
          centerDeltaX + (isMobile ? 10 : 18),
          centerDeltaX - (isMobile ? 8 : 14),
          centerDeltaX,
        ],
        y: [0, isMobile ? -8 : -18, centerDeltaY, centerDeltaY + 90, fallY * 0.74, fallY],
        scale: [1, 1.02, zoomScale, zoomScale, zoomScale, zoomScale],
        rotateZ: [0, isMobile ? -1.5 : -3, 0, 6, -5, 4],
        clipPath: [
          TORN_EDGE_START,
          destinationClip,
          destinationClip,
          destinationClip,
          destinationClip,
          destinationClip,
        ],
      },
      {
        duration: isMobile ? 1.02 : 1.08,
        ease: [0.22, 0.8, 0.24, 1],
        times: [0, 0.18, 0.48, 0.64, 0.82, 1],
        onComplete: () => {
          if (overlay.parentNode === document.body) document.body.removeChild(overlay);
          hasStartedRouteChange.current = true;
          sessionStorage.setItem("ticket-register-slide", "1");
          go();
        },
      },
    );

    return () => {
      card.classList.remove("ticket-card-is-tearing");
      if (!hasStartedRouteChange.current && overlay.parentNode === document.body) {
        document.body.removeChild(overlay);
      }
    };
  }, [go, isTearing]);

  /* Page background for notch circles */
  const pageBg = 'oklch(0.14 0.018 285)';

  return (
    <motion.article
      initial={{ rotate: tilt }}
      whileHover={reduced ? { rotate: tilt } : { rotate: 0, y: -6 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      style={{ position: 'relative', width: '100%', perspective: 1200 }}
    >
      <div
        ref={cardRef}
        className="ticket-card-shell"
        style={{
          position: 'relative',
          display: 'flex',
          minHeight: '320px',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 18px 50px -24px rgba(0,0,0,0.9)',
        }}
      >
        {/* ── Left stub ── */}
        <div
          className="ticket-left"
          style={{
            position: 'relative',
            width: '62%',
            padding: '1.25rem',
            background: theme.base,
            color: theme.ink,
            overflow: 'hidden',
          }}
        >
          <Pattern kind={theme.pattern} color={theme.accent} />

          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Category pill */}
            <span style={{
              display: 'inline-block', alignSelf: 'flex-start',
              borderRadius: '999px', padding: '3px 10px',
              fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              background: theme.ink, color: theme.base,
            }}>
              {theme.label}
            </span>

            {/* Title */}
            <h3 style={{
              marginTop: '0.75rem',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
              lineHeight: 1.05,
              fontWeight: 800,
              textTransform: 'uppercase',
              color: theme.ink,
              textShadow: `2px 2px 0 ${theme.accent}`,
            }}>
              {event.title}
            </h3>

            {/* Description */}
            <p style={{
              marginTop: '0.5rem',
              fontSize: '0.75rem', fontWeight: 500, opacity: 0.8,
              color: theme.ink,
              display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {event.description}
            </p>

            {/* Bottom row */}
            <div style={{
              marginTop: 'auto', paddingTop: '1rem',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
              fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.04em', textTransform: 'uppercase',
              color: theme.ink,
            }}>
              <span>
                {event.event_date && event.event_time
                  ? new Date(`${event.event_date}T${event.event_time}`).toLocaleString("en-IN", {
                      day: "numeric", month: "short", hour: "numeric", minute: "2-digit",
                    })
                  : `${event.date} · ${event.time}`}
                {' · '}{event.venue}
              </span>
              <span style={{ fontSize: '1.125rem', fontWeight: 900 }}>
                {event.price === 0 ? 'Free' : `₹${event.price}`}
              </span>
            </div>
          </div>
        </div>

        {/* ── Perforation ── */}
        <div style={{
          position: 'relative', width: 0, flexShrink: 0,
          borderLeft: `2px dashed ${theme.ink}`, opacity: 0.5,
        }} />

        {/* CLOSED Tag */}
        {isSoldOut && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-15deg)',
            background: 'rgba(239, 68, 68, 0.05)',
            border: '4px solid #ef4444',
            color: '#ef4444',
            padding: '0.5rem 1.5rem',
            borderRadius: '8px',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 900,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            zIndex: 10,
            backdropFilter: 'blur(2px)',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.15)',
            pointerEvents: 'none'
          }}>
            CLOSED
          </div>
        )}

        {/* ── Right stub ── */}
        <div style={{
          position: 'relative', flex: 1, overflow: 'hidden',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: '1rem',
          background: theme.accent, color: theme.ink,
        }}>
          {/* Metadata */}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px', lineHeight: 1.7,
            fontWeight: 700, letterSpacing: '0.16em',
            textTransform: 'uppercase', opacity: 0.8, color: theme.ink,
          }}>
            <div>Gate · {event.venue?.split(',')[0] ?? 'Main'}</div>
            <div>Slot · {event.time}</div>
            <div>Track · {theme.label}</div>
          </div>

          {/* Barcode bars */}
          <div style={{ display: 'flex', height: '32px', alignItems: 'flex-end', gap: '2px', opacity: 0.6 }} aria-hidden="true">
            {Array.from({ length: 22 }, (_, i) => (
              <span key={i} style={{
                display: 'block', width: '2px',
                height: `${40 + ((i * 37) % 60)}%`,
                background: theme.ink,
              }} />
            ))}
          </div>

          {/* Register button */}
          <motion.button
            type="button"
            onClick={handleRegister}
            disabled={isSoldOut}
            whileHover={isSoldOut ? {} : { scale: 1.03 }}
            whileTap={isSoldOut ? {} : { scale: 0.97 }}
            style={{
              width: '100%', padding: '10px 0',
              borderRadius: '12px', border: 'none', cursor: isSoldOut ? 'not-allowed' : 'pointer',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.6875rem', fontWeight: 900,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              background: 'var(--signature-gold)', color: 'var(--bg)',
              opacity: isSoldOut ? 0.6 : 1,
            }}
            id={`register-btn-${event.id}`}
          >
            {isSoldOut ? 'SOLD OUT' : 'Register Now'}
          </motion.button>

          {/* Confetti fires when tearing starts */}
          {isTearing && !reduced && <Confetti color={theme.base} />}
        </div>

        {/* ── Notch circles at perforation ── */}
        <span style={{
          position: 'absolute', top: '-10px', left: '62%',
          transform: 'translateX(-50%)',
          width: '20px', height: '20px',
          borderRadius: '50%', background: pageBg,
          backgroundImage: 'radial-gradient(circle at center, transparent 0 9px, currentColor 9px)'
        }} />
        <span style={{
          position: 'absolute', bottom: '-10px', left: '62%',
          transform: 'translateX(-50%)',
          width: '20px', height: '20px',
          borderRadius: '50%', background: pageBg,
        }} />
      </div>
    </motion.article>
  );
}
