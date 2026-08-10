// src/pages/Sponsors.jsx
import { motion } from 'framer-motion';

export default function Sponsors() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <motion.h1
          style={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Sponsors
        </motion.h1>
        <motion.p
          style={styles.sub}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          Coming soon…
        </motion.p>
      </div>
    </main>
  );
}

const styles = {
  page: { paddingTop: '96px', minHeight: '100svh' },
  container: {
    maxWidth: '72rem',
    margin: '0 auto',
    padding: '5rem 1.25rem 8rem',
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
    color: '#fff',
    marginBottom: '1rem',
  },
  sub: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: '1.125rem',
  },
};
