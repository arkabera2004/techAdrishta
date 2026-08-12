// src/pages/Events.jsx
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import TicketCard from '../components/TicketCard';
import { events } from '../data/events';

const CATEGORIES = ['All', 'Hackathon', 'TED Talk', 'Workshop', 'Competition'];
const CAT_KEY = { 'Hackathon': 'hackathon', 'TED Talk': 'tedtalk', 'Workshop': 'workshop', 'Competition': 'competition' };

const getTilt = (id) => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  // Returns a pseudo-random rotation between -2 and +2 degrees
  return (hash % 5) - 2;
};

export default function Events() {
  const [filter, setFilter] = useState('All');
  const [query,  setQuery]  = useState('');

  const filtered = useMemo(() => {
    let list = events;
    if (filter !== 'All') {
      list = list.filter(e => e.category === CAT_KEY[filter]);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q)
      );
    }
    return list;
  }, [filter, query]);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <motion.div
          style={styles.pageHeader}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 style={styles.title}>
            The{' '}
            <span style={styles.gradientSpan}>ticket wall</span>
          </h1>
          <p style={styles.subtitle}>
            Every event is a ticket. Tear one off to register.
          </p>
        </motion.div>

        {/* Controls */}
        <div style={styles.controls}>
          <div style={styles.pills}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  ...styles.filterPill,
                  background: filter === cat
                    ? 'linear-gradient(135deg, #8b5cf6, #d946ef)'
                    : 'rgba(255,255,255,0.06)',
                  color: filter === cat ? '#fff' : 'rgba(255,255,255,0.55)',
                  border: filter === cat
                    ? 'none'
                    : '1px solid rgba(255,255,255,0.1)',
                }}
                id={`filter-${cat.replace(' ', '-').toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div style={styles.searchWrap}>
            <Search size={15} style={styles.searchIcon} />
            <input
              type="search"
              placeholder="Search events…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={styles.searchInput}
              id="events-search"
              aria-label="Search events"
            />
          </div>
        </div>

        {/* Wall */}
        {filtered.length > 0 ? (
          <div style={styles.wall}>
            {filtered.map((ev, i) => {
              const tilt = getTilt(ev.id);
              return (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: 24, rotate: tilt }}
                  animate={{ opacity: 1, y: 0, rotate: tilt }}
                  transition={{ delay: i * 0.06 }}
                >
                  <TicketCard event={ev} />
                  <div style={styles.seatsLine}>
                    <span style={{
                      color: ev.seatsLeft < 20 ? '#ef4444' : '#10b981',
                    }}>
                      {ev.seatsLeft} seats remaining
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div style={styles.empty}>
            <p style={styles.emptyText}>No events match your search.</p>
            <button
              onClick={() => { setFilter('All'); setQuery(''); }}
              style={styles.clearBtn}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  page: {
    paddingTop: '96px',
    minHeight: '100svh',
  },
  container: {
    maxWidth: '72rem',
    margin: '0 auto',
    padding: '3rem 1.25rem 6rem',
  },
  pageHeader: {
    marginBottom: '2.5rem',
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: 'clamp(2rem, 5vw, 3.25rem)',
    color: '#fff',
    lineHeight: 1.1,
    marginBottom: '0.75rem',
  },
  gradientSpan: {
    background: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '1rem',
  },
  controls: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    marginBottom: '2.5rem',
    flexWrap: 'wrap',
  },
  pills: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    flex: 1,
  },
  filterPill: {
    padding: '7px 16px',
    borderRadius: '999px',
    fontSize: '0.8125rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.18s',
    fontFamily: "'Space Grotesk', sans-serif",
    whiteSpace: 'nowrap',
  },
  searchWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: 'rgba(255,255,255,0.35)',
    pointerEvents: 'none',
  },
  searchInput: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '999px',
    padding: '8px 16px 8px 36px',
    color: '#fff',
    fontSize: '0.875rem',
    outline: 'none',
    width: '220px',
    transition: 'border-color 0.2s',
    fontFamily: "'Inter', sans-serif",
  },
  wall: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  seatsLine: {
    marginTop: '0.5rem',
    paddingLeft: '0.5rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.02em',
  },
  empty: {
    textAlign: 'center',
    padding: '6rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '1.125rem',
  },
  clearBtn: {
    padding: '10px 24px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Space Grotesk', sans-serif",
  },
};
