import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ChipPreloader from './components/ChipPreloader';
import { motion } from 'framer-motion';
import './App.css';

export default function App() {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(true);
  const [bootSequenceTriggered, setBootSequenceTriggered] = useState(false);
  
  const footerRef = useRef(null);
  const [footerHeight, setFooterHeight] = useState(0);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  // Measure footer height for the reveal effect
  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // Use borderBoxSize if available, fallback to contentRect + some padding estimate or just offsetHeight
        setFooterHeight(footerRef.current.offsetHeight);
      }
    });
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, [loading]); // re-run after loading finishes

  return (
    <>
      {loading && (
        <ChipPreloader 
          onTriggerZoomOut={() => setBootSequenceTriggered(true)} 
          onComplete={() => setLoading(false)} 
        />
      )}
      
      <div style={{ position: 'relative', zIndex: 1, backgroundColor: 'var(--bg)', marginBottom: footerHeight }}>
        {pathname !== '/' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: bootSequenceTriggered ? 1 : 0 }} 
            transition={{ delay: 1.5, duration: 1 }}
          >
            <Header />
          </motion.div>
        )}
        <div className="main-content">
          <Outlet context={{ bootSequenceTriggered }} />
        </div>
      </div>
      
      <div ref={footerRef} style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: -1, backgroundColor: "#000" }}>
        {/* <Footer /> */}
      </div>
    </>
  );
}
