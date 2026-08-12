// src/pages/Team.jsx
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import PixelTransition from '../components/PixelTransition';

const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const teamMembers = [
  { id: 1, name: 'Alex Johnson', role: 'Lead Developer', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&h=400', linkedin: '#', email: '#' },
  { id: 2, name: 'Sam Smith', role: 'UI/UX Designer', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400&h=400', linkedin: '#', email: '#' },
  { id: 3, name: 'Jordan Lee', role: 'Product Manager', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=400', linkedin: '#', email: '#' },
  { id: 4, name: 'Taylor Swift', role: 'Marketing', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400', linkedin: '#', email: '#' },
  { id: 5, name: 'Morgan Webb', role: 'Engineer', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=400', linkedin: '#', email: '#' },
  { id: 6, name: 'Casey Neistat', role: 'Content Creator', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400', linkedin: '#', email: '#' },
  { id: 7, name: 'Riley Reid', role: 'Sales', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400&h=400', linkedin: '#', email: '#' },
  { id: 8, name: 'Jamie Doe', role: 'Support', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400', linkedin: '#', email: '#' },
];

export default function Team() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h1 style={styles.title}>Meet Our Team</h1>
          <p style={styles.sub}>The passionate individuals behind the magic.</p>
        </motion.div>

        <div style={styles.grid}>
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PixelTransition
                firstContent={
                  <img
                    src={member.image}
                    alt={member.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                }
                secondContent={
                  <div style={styles.detailCard}>
                    <h3 style={styles.memberName}>{member.name}</h3>
                    <p style={styles.memberRole}>{member.role}</p>
                    <div style={styles.socials}>
                      <motion.a 
                        href={member.linkedin} 
                        style={styles.socialBtn}
                        initial="rest"
                        whileHover="hover"
                        whileTap="pressed"
                        variants={{
                          rest: { scale: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
                          hover: { scale: 1.15, backgroundColor: 'rgba(255,255,255,0.2)' },
                          pressed: { scale: 0.95 }
                        }}
                      >
                        <motion.div
                          variants={{
                            rest: { y: 0, rotate: 0, color: '#ffffff' },
                            hover: { y: -3, rotate: -10, color: '#0A66C2', transition: { type: "spring", stiffness: 300 } }
                          }}
                        >
                          <LinkedinIcon />
                        </motion.div>
                      </motion.a>
                      <motion.a 
                        href={member.email} 
                        style={styles.socialBtn}
                        initial="rest"
                        whileHover="hover"
                        whileTap="pressed"
                        variants={{
                          rest: { scale: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
                          hover: { scale: 1.15, backgroundColor: 'rgba(255,255,255,0.2)' },
                          pressed: { scale: 0.95 }
                        }}
                      >
                        <motion.div
                          variants={{
                            rest: { y: 0, rotate: 0, color: '#ffffff' },
                            hover: { y: -3, rotate: 10, color: '#EA4335', transition: { type: "spring", stiffness: 300 } }
                          }}
                        >
                          <Mail size={20} />
                        </motion.div>
                      </motion.a>
                    </div>
                  </div>
                }
                gridSize={8}
                pixelColor="#ffffff"
                once={false}
                animationStepDuration={0.4}
                style={{ width: '100%', height: '100%', borderRadius: '1rem', border: 'none' }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: { paddingTop: '96px', minHeight: '100svh', background: 'var(--bg)' },
  container: {
    maxWidth: '72rem',
    margin: '0 auto',
    padding: '4rem 1.25rem 18rem',
  },
  title: {
    fontFamily: "var(--font-heading)",
    fontWeight: 800,
    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
    color: 'var(--signature-gold)',
    marginBottom: '1rem',
  },
  sub: {
    color: 'var(--text-muted)',
    fontSize: '1.125rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1.5rem',
  },
  detailCard: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderTop: '3px solid var(--brass)', // Brass accent
  },
  memberName: {
    color: 'var(--text)',
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '0.25rem',
  },
  memberRole: {
    color: 'var(--brass)',
    fontSize: '0.875rem',
    marginBottom: '1.5rem',
  },
  socials: {
    display: 'flex',
    gap: '1rem',
  },
  socialBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    textDecoration: 'none',
    transition: 'background 0.2s',
  }
};
