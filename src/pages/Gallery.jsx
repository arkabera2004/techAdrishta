import { useState, useEffect } from 'react';
import DomeGallery from '../components/DomeGallery';
import RetroTV from '../components/RetroTV';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function Gallery() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <main style={{ minHeight: '100svh', width: '100vw', background: '#08080c' }}>
      
      {/* Background Sticky Layer (Dome) */}
      <section style={{ 
        position: 'sticky', 
        top: 0, 
        height: '100svh', 
        width: '100%', 
        zIndex: 10,
        overflow: 'hidden'
      }}>
        <DomeGallery
          fit={isMobile ? 1.0 : 0.8}
          minRadius={isMobile ? 250 : 600}
          maxVerticalRotationDeg={0}
          segments={isMobile ? 18 : 34}
          tileInset={isMobile ? "4px" : "10px"}
          dragDampening={2}
          grayscale={true}
        />
        
        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(255, 255, 255, 0.6)',
            pointerEvents: 'none',
            zIndex: 30
          }}
        >
          <span style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll</span>
          <ChevronDown size={24} opacity={0.8} />
        </motion.div>
      </section>

      {/* Foreground Sliding Layer (RetroTV) */}
      <section style={{ 
        position: 'relative', 
        zIndex: 20, 
        minHeight: '100svh', 
        background: '#08080c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 -20px 50px rgba(0,0,0,0.8)'
      }}>
        <div style={{ width: '100%', maxWidth: '800px', padding: '4rem 1rem' }}>
          <RetroTV
            videos={[
              { name: "video1", videoUrl: "/videos/video1.mov" },
              { name: "video2", videoUrl: "/videos/video2.mov" },
              { name: "video3", videoUrl: "/videos/video3.mov" },
              { name: "video4", videoUrl: "/videos/video4.mov" },
            ]}
          />
        </div>
      </section>
    </main>
  );
}


