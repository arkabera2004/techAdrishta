// src/pages/Sponsors.jsx
import LogoLoop from '../components/LogoLoop';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';

const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];

export default function Sponsors() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={{ marginBottom: '4rem' }}>
          <h1 style={styles.title}>Sponsors</h1>
        </div>

        <div style={{ height: '200px', position: 'relative', overflow: 'hidden'}}>
          <LogoLoop
            logos={techLogos}
            speed={100}
            direction="left"
            logoHeight={60}
            gap={60}
            hoverSpeed={0}
            scaleOnHover
            fadeOut
            fadeOutColor="#08080c"
            ariaLabel="Technology partners"
          />
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: { paddingTop: '96px', minHeight: '100svh', background: '#08080c' },
  container: {
    maxWidth: '72rem',
    margin: '0 auto',
    padding: '5rem 1.25rem 8rem',
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    color: '#fff',
    marginBottom: '1rem',
  },
};
