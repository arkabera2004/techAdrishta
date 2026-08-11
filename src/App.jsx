// src/App.jsx
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ChipPreloader from './components/ChipPreloader';
import './App.css';

export default function App() {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(true);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <>
      {loading ? (
        <ChipPreloader onComplete={() => setLoading(false)} />
      ) : (
        <>
          <Header />
          <div className="main-content">
            <Outlet />
          </div>
          <Footer />
        </>
      )}
    </>
  );
}
