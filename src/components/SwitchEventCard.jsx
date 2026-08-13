import { useEffect, useRef, useState } from "react";
import Wordmark from "./Wordmark";
import { motion, useTransform, useMotionValue } from "framer-motion";
import FlipClock from "./FlipClock";
import PixelCountdown from "./PixelCountdown";

/**
 * SwitchEventCard
 * A flat, straight-on recreation of a Nintendo Switch handheld, with the
 * screen replaced by event details rendered in a pixel/digital typeface.
 */

const EVENT = {
    heading: "About the event",
    paragraphs: [
        "TECH ADRISHTA started as a dorm-room hackathon and grew into the largest independent tech fest in the region. Two days, four tracks, and a single rule: everything you present has to actually run.",
        "Expect engineers who ship at scale, founders mid-raise, and security researchers who break things on stage. No keynote fluff.",
    ],
    tracksTitle: "Four tracks",
    tracks: [
        { name: "Build", desc: "36-hour hackathon with hardware and cloud credits." },
        { name: "Learn", desc: "hands-on workshops capped at 60 seats." },
        { name: "Listen", desc: "talks from people running production systems." },
        { name: "Compete", desc: "CTF, pitch arena and the gaming bracket." },
    ],
};

function useGoogleFonts() {
    useEffect(() => {
        const id = "switch-card-fonts";
        if (document.getElementById(id)) return;
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href =
            "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap";
        document.head.appendChild(link);
    }, []);
}

export default function SwitchEventCard({ forceStateE = false, isZoomingOut = true, onStateE = () => { }, onBootStateChange = () => { }, scrollYProgress }) {
    useGoogleFonts();
    const scrollRef = useRef(null);
    const [pressed, setPressed] = useState(null);

    const fallbackScroll = useMotionValue(0);
    const effectiveScroll = scrollYProgress || fallbackScroll;

    const [maxScale, setMaxScale] = useState(1.35);

    useEffect(() => {
        function updateScale() {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const containerWidth = Math.min(0.95 * w, 1.9 * h);
            // Inner screen height is 420/1000 = 0.42 of the container width
            // We want the inner screen to exactly fit the viewport height
            let scale = h / (0.42 * containerWidth);
            // Add a tiny bit of padding so it doesn't perfectly touch the edges
            scale = scale * 0.98;
            setMaxScale(scale);
        }
        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    // Joy-Con scroll animations
    const leftJoyconX = useTransform(effectiveScroll, [0, 0.4], [0, -800]);
    const rightJoyconX = useTransform(effectiveScroll, [0, 0.4], [0, 800]);

    // Console zoom animation
    const consoleScaleScroll = useTransform(effectiveScroll, [0.4, 1], [1, maxScale]);


    const [bootState, setBootState] = useState('A');
    const [blackFade, setBlackFade] = useState(false);

    useEffect(() => {
        if (forceStateE) {
            setBootState('E');
            return;
        }

        if (!isZoomingOut) return;

        const zoomOutDelay = 1500; // 1.5s zoom out
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const hasBooted = sessionStorage.getItem('bootPlayed');

        if (prefersReducedMotion || hasBooted) {
            const t = setTimeout(() => {
                setBootState('D');
            }, zoomOutDelay);
            return () => clearTimeout(t);
        }

        sessionStorage.setItem('bootPlayed', 'true');

        const t1 = setTimeout(() => {
            const audio = new Audio('/chime.mp3');
            audio.play().catch(e => console.log('Audio play failed:', e));
            setBootState('B');
        }, zoomOutDelay + 400);

        const t2 = setTimeout(() => {
            setBootState('C');
        }, zoomOutDelay + 400 + 800);

        const t3 = setTimeout(() => {
            setBootState('D');
        }, zoomOutDelay + 400 + 800 + 600);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [forceStateE, isZoomingOut]);

    useEffect(() => {
        if (forceStateE && bootState !== 'E') {
            setBootState('E');
        }
    }, [forceStateE, bootState]);

    useEffect(() => {
        if (bootState === 'E') {
            onStateE();
        }
        onBootStateChange(bootState);
    }, [bootState, onStateE, onBootStateChange]);

    const scrollBy = (amount) => {
        scrollRef.current?.scrollBy({ top: amount, behavior: "smooth" });
    };

    const playSound = () => {
        const audio = new Audio('/button.mp3');
        audio.play().catch(e => console.log('Audio play failed:', e));
    };

    const press = (id, action) => {
        playSound();
        setPressed(id);
        action?.();
        setTimeout(() => setPressed(null), 120);
    };

    const handleDown = () => {
        if (bootState === 'C' || bootState === 'D') {
            setBlackFade(true);
            setTimeout(() => {
                setBootState('E');
                setBlackFade(false);
            }, 300);
        }
    };

    const handleUp = () => {
        if (bootState === 'E') {
            setBlackFade(true);
            setTimeout(() => {
                setBootState('D');
                setBlackFade(false);
            }, 300);
        }
    };

    const navRoutes = ['/', '/events', '/talks', '/gallery', '/team'];

    const handleRight = () => {
        const currentIdx = navRoutes.indexOf(window.location.pathname);
        if (currentIdx !== -1 && currentIdx < navRoutes.length - 1) {
            window.location.href = navRoutes[currentIdx + 1];
        } else {
            window.location.href = navRoutes[0];
        }
    };

    const handleLeft = () => {
        const currentIdx = navRoutes.indexOf(window.location.pathname);
        if (currentIdx > 0) {
            window.location.href = navRoutes[currentIdx - 1];
        } else {
            window.location.href = navRoutes[navRoutes.length - 1];
        }
    };

    return (
        <motion.div style={{ scale: consoleScaleScroll, transformOrigin: 'center center', width: 'min(95vw, 190vh)', position: 'relative' }} className="mx-auto">
            <motion.div
                className="mx-auto overflow-hidden sm:overflow-visible w-full h-full"
                initial={{ scale: 4, opacity: 1 }}
                animate={{ scale: isZoomingOut ? 1 : 4, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }} // cinematic pull back
            >
            <div className="switch-scaler relative w-full" style={{ aspectRatio: '1000/480', containerType: 'inline-size' }}>
                <style>{`
                    .switch-particle-wrapper {
                        transform: translateY(0) scale(1);
                    }
                    .switch-particle-wrapper.boot-d {
                        transform: translateY(-11cqi) scale(0.85);
                    }
                    .switch-details-container {
                        bottom: 4.5cqi;
                        gap: 1.8cqi;
                    }
                    .switch-flip-clock {
                        transform: scale(0.7);
                    }
                    .switch-date-text {
                        font-size: 1.4cqi;
                    }
                    .switch-desc-text {
                        font-size: 1.5cqi;
                    }
                    .pixel-nav-link {
                        color: #ffffff;
                        text-decoration: none;
                        font-family: 'Press Start 2P', monospace;
                        font-size: 1cqi;
                        transition: color 0.2s;
                        letter-spacing: 1px;
                        cursor: pointer;
                    }
                    .pixel-nav-link:hover {
                        color: #ff4554;
                    }
                    .pixel-nav-link.active {
                        border: 0.15cqi solid #ef4444;
                        padding: 0.5cqi 1cqi;
                        border-radius: 0.3cqi;
                        background: transparent;
                        box-shadow: none;
                    }
                    .pixel-btn {
                        font-family: 'Press Start 2P', monospace;
                        font-size: 1.1cqi;
                        background: linear-gradient(to bottom, #fde047, #d97706);
                        border: 0.2cqi solid #000;
                        border-radius: 0.8cqi;
                        padding: 1.2cqi 2.5cqi;
                        color: #000;
                        cursor: pointer;
                        box-shadow: inset -0.2cqi -0.4cqi 0 rgba(0,0,0,0.3);
                        transition: transform 0.1s;
                        display: flex;
                        align-items: center;
                        gap: 0.8cqi;
                        margin-top: 1.5cqi;
                        margin-bottom: 2cqi;
                    }
                    .pixel-btn:active {
                        transform: translateY(0.4cqi);
                        box-shadow: inset 0 -0.4cqi 0 #b45309;
                    }
                    .pixel-title-wrapper {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 0.5cqi;
                        margin-top: 2cqi;
                        margin-bottom: 2cqi;
                    }
                    .pixel-title-tech {
                        font-family: 'Press Start 2P', monospace;
                        font-size: 3.8cqi;
                        background: linear-gradient(to bottom, #fde047 10%, #d97706 90%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        -webkit-text-stroke: 0.15cqi black;
                        filter: drop-shadow(0.3cqi 0.3cqi 0 #593922);
                        letter-spacing: -2px;
                        line-height: 1;
                    }
                    .pixel-title-adrishta {
                        font-family: 'Press Start 2P', monospace;
                        font-size: 4.4cqi;
                        color: #fdfdf9;
                        -webkit-text-stroke: 0.15cqi black;
                        filter: drop-shadow(0.3cqi 0.3cqi 0 #7f1d1d);
                        letter-spacing: -2px;
                        line-height: 1;
                        margin-top: -0.2cqi;
                    }
                    @keyframes bounce-horizontal {
                        0%, 100% { transform: translateX(0); }
                        50% { transform: translateX(2cqi); }
                    }
                    .pixel-cloud {
                        animation: bounce-horizontal 4s ease-in-out infinite;
                    }
                    .pixel-cloud-reverse {
                        animation: bounce-horizontal 4.5s ease-in-out infinite reverse;
                    }
                    .screen-grid {
                        background-size: 4cqi 4cqi;
                        background-image: 
                            linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px);
                    }
                    .stars-bg {
                        background-image: 
                            radial-gradient(1px 1px at 10% 20%, #fff, transparent),
                            radial-gradient(1px 1px at 30% 10%, #fff, transparent),
                            radial-gradient(1px 1px at 50% 30%, #fff, transparent),
                            radial-gradient(1px 1px at 70% 15%, #fff, transparent),
                            radial-gradient(1px 1px at 90% 25%, #fff, transparent),
                            radial-gradient(1px 1px at 20% 40%, #fff, transparent),
                            radial-gradient(1px 1px at 80% 35%, #fff, transparent);
                        background-size: 100% 100%;
                    }
                    @media (max-width: 767px) {
                        .switch-scaler {
                            width: 172%;
                            transform: translateX(-21%);
                        }
                        .switch-particle-wrapper.boot-d {
                            transform: translateY(-16cqi) scale(0.7);
                        }
                        .switch-details-container {
                            bottom: 2cqi;
                            gap: 0.5cqi;
                        }
                        .switch-flip-clock {
                            transform: scale(0.45);
                            margin-top: -1cqi;
                        }
                        .switch-date-text {
                            font-size: 2cqi;
                        }
                        .switch-desc-text {
                            font-size: 1.8cqi;
                            max-width: 95% !important;
                        }
                    }
                `}</style>
                <svg viewBox="0 0 1000 480" className="absolute inset-0 w-full h-full" style={{ display: 'block' }}>
                    <defs>
                        <linearGradient id="blueJoycon" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#04568a" />
                            <stop offset="3%" stopColor="#1183c2" />
                            <stop offset="10%" stopColor="#4bc6fa" />
                            <stop offset="18%" stopColor="#1eb0f2" />
                            <stop offset="85%" stopColor="#17a4e8" />
                            <stop offset="100%" stopColor="#0f77ab" />
                        </linearGradient>
                        <linearGradient id="redJoycon" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#d92e2e" />
                            <stop offset="65%" stopColor="#fc3d3d" />
                            <stop offset="85%" stopColor="#ff7070" />
                            <stop offset="97%" stopColor="#b31515" />
                            <stop offset="100%" stopColor="#630000" />
                        </linearGradient>
                        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#38383a" />
                            <stop offset="100%" stopColor="#1c1c1e" />
                        </linearGradient>
                        <linearGradient id="sheen" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                            <stop offset="15%" stopColor="rgba(255,255,255,0)" />
                        </linearGradient>
                        <linearGradient id="buttonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3a3a3c" />
                            <stop offset="100%" stopColor="#141415" />
                        </linearGradient>
                        <radialGradient id="thumbstickBase" cx="50%" cy="50%" r="50%">
                            <stop offset="60%" stopColor="#1c1c1e" />
                            <stop offset="100%" stopColor="#0a0a0a" />
                        </radialGradient>
                        <radialGradient id="thumbstickCap" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#1c1c1e" />
                            <stop offset="80%" stopColor="#303033" />
                            <stop offset="100%" stopColor="#0f0f10" />
                        </radialGradient>
                        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="160%">
                            <feDropShadow dx="0" dy="16" stdDeviation="32" floodColor="#d4af37" floodOpacity="0.15" />
                        </filter>
                        <filter id="buttonShadow" x="-30%" y="-30%" width="160%" height="160%">
                            <feDropShadow dx="0" dy="2.5" stdDeviation="1.5" floodColor="#000" floodOpacity="0.75" />
                        </filter>
                        <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feOffset dx="0" dy="2" />
                            <feGaussianBlur stdDeviation="3" result="offset-blur" />
                            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                            <feFlood floodColor="#000" floodOpacity="0.7" result="color" />
                            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                        </filter>
                        <linearGradient id="screenGlare" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                            <stop offset="40%" stopColor="rgba(255,255,255,0)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                        </linearGradient>
                    </defs>

                    <g filter="url(#dropShadow)">
                        {/* ================= CENTER BODY ================= */}
                        <rect x="95" y="0" width="810" height="480" rx="12" fill="url(#bodyGrad)" />
                        <rect x="110" y="0" width="780" height="480" rx="0" fill="#141415" />
                        <rect x="110" y="0" width="780" height="90" fill="url(#sheen)" opacity="0.4" />

                        {/* top edge details: power button + volume */}
                        <rect x="255" y="0" width="46" height="4" fill="#000" />
                        <rect x="320" y="0" width="70" height="4" fill="#000" />

                        {/* screen bezel (huge black glass) */}
                        <rect x="105" y="10" width="790" height="460" rx="8" fill="#131315" />
                        {/* subtle inner bezel edge */}
                        <rect x="105" y="10" width="790" height="460" rx="8" fill="none" stroke="#2a2a2d" strokeWidth="1.5" />

                        {/* Actual inner screen area */}
                        <rect x="125" y="30" width="750" height="420" fill="#0a0a0c" />

                        {/* ================= LEFT JOY-CON (blue) ================= */}
                        <motion.g style={{ x: leftJoyconX }}>
                            <motion.g
                                initial={{ x: -400 }}
                                animate={{ x: isZoomingOut ? 0 : -400 }}
                                transition={{ delay: 0.5, duration: 1, type: "spring", stiffness: 100, damping: 12, mass: 1 }}
                            >
                            {/* L-Shoulder Button removed to avoid clipping artifacts */}

                            <path
                                d="M 110,0 L 56,0 A 56,56 0 0 0 0,56 L 0,424 A 56,56 0 0 0 56,480 L 110,480 Z"
                                fill="url(#blueJoycon)"
                            />
                            <path
                                d="M 110,0 L 56,0 A 56,56 0 0 0 0,56 L 0,424 A 56,56 0 0 0 56,480 L 110,480 Z"
                                fill="url(#sheen)"
                            />
                            {/* 3D Edge Highlight */}
                            <path
                                d="M 56,1.5 A 54.5,54.5 0 0 0 1.5,56 L 1.5,424 A 54.5,54.5 0 0 0 56,478.5"
                                fill="none"
                                stroke="rgba(255,255,255,0.4)"
                                strokeWidth="1.5"
                            />
                            <rect x="107" y="10" width="3" height="460" fill="rgba(0,0,0,0.25)" />
                            <rect x="105" y="10" width="2" height="460" fill="rgba(255,255,255,0.15)" />

                            {/* SL / SR indicator on rail */}
                            <rect x="111" y="150" width="6" height="34" rx="3" fill="rgba(0,0,0,0.35)" />

                            {/* Thumbstick */}
                            <circle cx="55" cy="118" r="38" fill="#18181a" stroke="#000" strokeWidth="2.5" filter="url(#buttonShadow)" />
                            <circle cx="55" cy="118" r="36.5" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                            <circle cx="55" cy="118" r="30" fill="url(#thumbstickCap)" stroke="#000" strokeWidth="1.5" />

                            {/* Thumbstick Notches */}
                            <line x1="55" y1="82" x2="55" y2="87" stroke="#080808" strokeWidth="2" strokeLinecap="round" />
                            <line x1="55" y1="149" x2="55" y2="154" stroke="#080808" strokeWidth="2" strokeLinecap="round" />
                            <line x1="20" y1="118" x2="25" y2="118" stroke="#080808" strokeWidth="2" strokeLinecap="round" />
                            <line x1="85" y1="118" x2="90" y2="118" stroke="#080808" strokeWidth="2" strokeLinecap="round" />

                            {/* D-pad: four individual button caps */}
                            <g filter="url(#buttonShadow)">
                                {/* up */}
                                <circle cx="55" cy="219" r="14" fill={pressed === "up" ? "#5a9ae6" : "url(#buttonGrad)"} onPointerDown={() => press("up", handleUp)} style={{ cursor: "pointer" }} />
                                <circle cx="55" cy="219" r="13" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" pointerEvents="none" />
                                <polygon points="55,212 50,218 60,218" fill="#000" opacity="0.75" pointerEvents="none" />

                                {/* left */}
                                <circle cx="25" cy="249" r="14" fill={pressed === "left" ? "#5a9ae6" : "url(#buttonGrad)"} onPointerDown={() => press("left", handleLeft)} style={{ cursor: "pointer" }} />
                                <circle cx="25" cy="249" r="13" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" pointerEvents="none" />
                                <polygon points="18,249 24,244 24,254" fill="#000" opacity="0.75" pointerEvents="none" />

                                {/* right */}
                                <circle cx="85" cy="249" r="14" fill={pressed === "right" ? "#5a9ae6" : "url(#buttonGrad)"} onPointerDown={() => press("right", handleRight)} style={{ cursor: "pointer" }} />
                                <circle cx="85" cy="249" r="13" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" pointerEvents="none" />
                                <polygon points="92,249 86,244 86,254" fill="#000" opacity="0.75" pointerEvents="none" />

                                {/* down */}
                                <circle cx="55" cy="279" r="14" fill={pressed === "down" ? "#5a9ae6" : "url(#buttonGrad)"} onPointerDown={() => press("down", handleDown)} style={{ cursor: "pointer" }} />
                                <circle cx="55" cy="279" r="13" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" pointerEvents="none" />
                                <polygon points="55,286 50,280 60,280" fill="#000" opacity="0.75" pointerEvents="none" />
                            </g>

                            {/* capture + minus buttons */}
                            <g filter="url(#buttonShadow)">
                                {/* Capture Button */}
                                <rect x="44" y="356" width="22" height="22" rx="3" fill="#141415" />
                            </g>
                            <rect x="44" y="356" width="22" height="22" rx="3" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                            <circle cx="55" cy="367" r="7" fill="#050505" stroke="#000" strokeWidth="1.5" />

                            <g filter="url(#buttonShadow)">
                                {/* Minus Button */}
                                <rect x="80" y="60" width="16" height="5" rx="1.5" fill="#141415" />
                            </g>
                            <rect x="80" y="60" width="16" height="5" rx="1.5" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

                            </motion.g>
                        </motion.g>

                        {/* ================= RIGHT JOY-CON (red) ================= */}
                        <motion.g style={{ x: rightJoyconX }}>
                            <motion.g
                                initial={{ x: 400 }}
                                animate={{ x: isZoomingOut ? 0 : 400 }}
                                transition={{ delay: 0.5, duration: 1, type: "spring", stiffness: 100, damping: 12, mass: 1 }}
                            >
                            <path
                                d="M 890,0 L 944,0 A 56,56 0 0 1 1000,56 L 1000,424 A 56,56 0 0 1 944,480 L 890,480 Z"
                                fill="url(#redJoycon)"
                            />
                            <path
                                d="M 890,0 L 944,0 A 56,56 0 0 1 1000,56 L 1000,424 A 56,56 0 0 1 944,480 L 890,480 Z"
                                fill="url(#sheen)"
                            />
                            {/* R-Shoulder Button removed to avoid clipping artifacts */}
                            <path
                                d="M 944,1.5 A 54.5,54.5 0 0 1 998.5,56 L 998.5,424 A 54.5,54.5 0 0 1 944,478.5"
                                fill="none"
                                stroke="rgba(255,255,255,0.4)"
                                strokeWidth="1.5"
                            />
                            <rect x="890" y="10" width="3" height="460" fill="rgba(0,0,0,0.3)" />
                            <rect x="895" y="10" width="2" height="460" fill="rgba(255,255,255,0.08)" />
                            <rect x="883" y="150" width="6" height="34" rx="3" fill="rgba(0,0,0,0.35)" />

                            {/* Plus Button */}
                            <g filter="url(#buttonShadow)">
                                <path d="M 922.5,62.5 h 5 v 5.5 h 5.5 v 5 h -5.5 v 5.5 h -5 v -5.5 h -5.5 v -5 h 5.5 z" fill="#141415" />
                            </g>
                            <path d="M 922.5,62.5 h 5 v 5.5 h 5.5 v 5 h -5.5 v 5.5 h -5 v -5.5 h -5.5 v -5 h 5.5 z" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

                            {/* Home Button */}
                            <circle cx="920" cy="370" r="17" fill="#18181a" filter="url(#buttonShadow)" />
                            <circle cx="920" cy="370" r="15" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                            <circle cx="920" cy="370" r="12" fill="#050505" stroke="#000" strokeWidth="1.5" />
                            {/* house icon */}
                            <path d="M 915,371 L 920,365 L 925,371 V 375 H 915 Z" fill="rgba(255,255,255,0.2)" />

                            {/* ABXY diamond */}
                            <g fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill="#b0b0b5" textAnchor="middle">
                                {/* X */}
                                <circle cx="945" cy="142" r="14" fill="url(#buttonGrad)" filter="url(#buttonShadow)" />
                                <circle cx="945" cy="142" r="13" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" pointerEvents="none" />
                                <text x="945" y="142" dy="0.35em">X</text>

                                {/* A */}
                                <circle cx="975" cy="172" r="14" fill="url(#buttonGrad)" filter="url(#buttonShadow)" />
                                <circle cx="975" cy="172" r="13" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" pointerEvents="none" />
                                <text x="975" y="172" dy="0.35em">A</text>

                                {/* Y */}
                                <circle cx="915" cy="172" r="14" fill="url(#buttonGrad)" filter="url(#buttonShadow)" />
                                <circle cx="915" cy="172" r="13" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" pointerEvents="none" />
                                <text x="915" y="172" dy="0.35em">Y</text>

                                {/* B */}
                                <circle cx="945" cy="202" r="14" fill="url(#buttonGrad)" filter="url(#buttonShadow)" />
                                <circle cx="945" cy="202" r="13" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" pointerEvents="none" />
                                <text x="945" y="202" dy="0.35em">B</text>
                            </g>

                            {/* Thumbstick */}
                            <circle cx="945" cy="286" r="38" fill="#18181a" stroke="#000" strokeWidth="2.5" filter="url(#buttonShadow)" />
                            <circle cx="945" cy="286" r="36.5" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                            <circle cx="945" cy="286" r="30" fill="url(#thumbstickCap)" stroke="#000" strokeWidth="1.5" />

                            {/* Thumbstick Notches */}
                            <line x1="945" y1="250" x2="945" y2="255" stroke="#080808" strokeWidth="2" strokeLinecap="round" />
                            <line x1="945" y1="317" x2="945" y2="322" stroke="#080808" strokeWidth="2" strokeLinecap="round" />
                            <line x1="910" y1="286" x2="915" y2="286" stroke="#080808" strokeWidth="2" strokeLinecap="round" />
                            <line x1="980" y1="286" x2="975" y2="286" stroke="#080808" strokeWidth="2" strokeLinecap="round" />
                            </motion.g>
                        </motion.g>
                    </g>
                </svg>

                {/* ================= SCREEN HTML OVERLAY ================= */}
                <div
                    className="absolute z-10"
                    style={{
                        left: '12.5%',     /* 125 / 1000 */
                        top: '6.25%',      /* 30 / 480 */
                        width: '75%',      /* 750 / 1000 */
                        height: '87.5%',   /* 420 / 480 */
                        borderRadius: '0.6%', /* Matches rx=4 proportionally */
                        overflow: 'hidden',
                        backgroundColor: '#0B0F1C'
                    }}
                >
                    <div
                        ref={scrollRef}
                        className="switch-screen-scroll w-full h-full overflow-hidden flex flex-col relative"
                        style={{ backgroundColor: '#060a14' }}
                    >
                        {/* STATE A is empty screen before boot */}

                        {/* Shared Background for C, D, E */}
                        {(bootState === 'C' || bootState === 'D' || bootState === 'E') && (
                            <div className="absolute inset-0 w-full h-full pointer-events-none stars-bg opacity-70 z-0"></div>
                        )}

                        {/* Shared Navbar for C, D, E */}
                        {(bootState === 'C' || bootState === 'D' || bootState === 'E') && (
                            <div className="w-full flex justify-between items-center px-[4cqi] py-[1.5cqi] border-b border-[rgba(135,206,235,0.15)] animate-in fade-in slide-in-from-top-4 duration-700 relative z-20">
                                {/* Spacer to keep nav centered */}
                                <div style={{ width: '2.5cqi' }}></div>
                                <div className="flex items-center gap-[3cqi]">
                                    <div className="pixel-nav-link active" style={{ fontSize: '0.8cqi', padding: '0.5cqi 0.8cqi' }}>HOME</div>
                                    <div className="pixel-nav-link" style={{ fontSize: '0.8cqi' }} onClick={() => window.location.href = '/events'}>EVENTS</div>
                                    <div className="pixel-nav-link" style={{ fontSize: '0.8cqi' }} onClick={() => window.location.href = '/talks'}>TECH TALK</div>
                                    <div className="pixel-nav-link" style={{ fontSize: '0.8cqi' }} onClick={() => window.location.href = '/gallery'}>GALLERY</div>
                                    <div className="pixel-nav-link" style={{ fontSize: '0.8cqi' }} onClick={() => window.location.href = '/team'}>TEAM</div>
                                </div>

                                {/* FAQ Mario block button */}
                                <button
                                    onClick={() => {
                                        if (window.location.pathname === '/') {
                                            document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' });
                                        } else {
                                            window.location.href = '/#faqs';
                                        }
                                    }}
                                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}
                                    className="hover-scale"
                                    aria-label="FAQ"
                                >
                                    <img src="/question_mark.png" alt="FAQ" style={{ width: '2.5cqi', height: '2.5cqi', imageRendering: 'pixelated' }} />
                                </button>
                            </div>
                        )}

                        {/* STATE C & D: Pixel Mario UI */}
                        {(bootState === 'C' || bootState === 'D') && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: blackFade ? 0 : 1 }}
                                transition={{ duration: blackFade ? 0.25 : 1 }}
                                className="w-full flex-1 flex flex-col items-center relative z-10"
                            >
                                {/* Floating Images (now with transparent background) */}
                                    <img src="/pixel_cloud.png" className="absolute top-[8cqi] left-[8cqi] w-[5.5cqi] pixel-cloud" alt="cloud" />
                                    <img src="/pixel_cloud.png" className="absolute top-[10cqi] right-[8cqi] w-[7cqi] pixel-cloud-reverse" alt="cloud" />

                                    <img src="/pixel_boy.png" className="absolute bottom-[4cqi] left-[0.5cqi] w-[21cqi]" alt="Boy on island" />
                                    <img src="/pixel_flag.png" className="absolute bottom-[5cqi] right-[0.5cqi] w-[19cqi]" alt="Flag on island" />

                                    {/* Health Bar UI */}
                                    <div className="absolute bottom-[13cqi] left-[5cqi] flex gap-[0.5cqi]">
                                        {/* Heart 1 */}
                                        <svg width="1.6cqi" height="1.6cqi" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 0H3V1H4V2H5V1H6V0H8V1H9V4H8V5H7V6H6V7H5V8H4V7H3V6H2V5H1V4H0V1H1V0Z" fill="#000" />
                                            <path d="M1 1H3V2H4V3H5V2H6V1H8V3H1V1Z" fill="#ff3b3b" />
                                            <path d="M1 3H8V4H7V5H6V6H5V7H4V6H3V5H2V4H1V3Z" fill="#ff3b3b" />
                                        </svg>
                                        {/* Heart 2 */}
                                        <svg width="1.6cqi" height="1.6cqi" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 0H3V1H4V2H5V1H6V0H8V1H9V4H8V5H7V6H6V7H5V8H4V7H3V6H2V5H1V4H0V1H1V0Z" fill="#000" />
                                            <path d="M1 1H3V2H4V3H5V2H6V1H8V3H1V1Z" fill="#ff3b3b" />
                                            <path d="M1 3H8V4H7V5H6V6H5V7H4V6H3V5H2V4H1V3Z" fill="#ff3b3b" />
                                        </svg>
                                        {/* Heart 3 (Empty) */}
                                        <svg width="1.6cqi" height="1.6cqi" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 0H3V1H4V2H5V1H6V0H8V1H9V4H8V5H7V6H6V7H5V8H4V7H3V6H2V5H1V4H0V1H1V0Z" fill="#000" />
                                            <path d="M1 1H3V2H4V3H5V2H6V1H8V3H1V1Z" fill="transparent" />
                                        </svg>
                                    </div>

                                    <div className="z-10 flex-1 w-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-1000 pb-[4cqi]">
                                        <div className="flex items-center gap-[1cqi]" style={{ marginBottom: '4cqi' }}>
                                            <span className="font-['Press_Start_2P']" style={{ fontSize: '0.8cqi', color: '#38bdf8' }}>&gt;&gt; 12 - 13 SEPTEMBER 2026 ♦ SMIT CAMPUS, SIKKIM &lt;&lt;</span>
                                        </div>

                                        <div className="pixel-title-wrapper" style={{ margin: '0' }}>
                                            <div className="pixel-title-tech">TECH</div>
                                            <div className="pixel-title-adrishta">ADRISHTA</div>
                                        </div>

                                        <div className="text-center font-mono mt-[3cqi] mb-[1cqi]" style={{ fontSize: '1.05cqi', color: '#f3f4f6', lineHeight: '1.6' }}>
                                            <p>Two days of building, breaking and shipping.</p>
                                            <p>A hackathon, a stage, a lab and a leaderboard —</p>
                                            <p>all under one roof.</p>
                                        </div>

                                        <button className="pixel-btn" style={{ marginTop: '1.5cqi', marginBottom: '1.5cqi' }} onClick={() => window.location.href = '/events'}>
                                            REGISTER NOW <span style={{ fontFamily: 'sans-serif', fontWeight: 'bold' }}>&gt;</span>
                                        </button>

                                        <div className="mt-[0cqi] scale-[0.60] origin-top">
                                            <PixelCountdown />
                                        </div>
                                    </div>
                            </motion.div>
                        )}

                        {/* STATE E: About Content (Single Screen Replacement) */}
                        {bootState === 'E' && (
                            <div className="w-full flex-1 flex flex-col items-center gap-[1.5cqi] animate-in fade-in duration-300 z-10" style={{ padding: '1.5cqi 2cqi 1cqi 2cqi', transition: 'opacity 0.25s ease', opacity: blackFade ? 0 : 1 }}>
                                
                                {/* Outlined Container */}
                                <div className="w-full flex-1 flex flex-col justify-between border border-gray-700/60 shadow-lg" style={{ borderRadius: '0.8cqi', backgroundColor: 'rgba(17, 24, 39, 0.3)', padding: '1.5cqi 1cqi 0.5cqi 1cqi' }}>
                                    
                                    {/* TOP ROW: Text and Island */}
                                    <div className="w-full flex items-start justify-between flex-1 px-[1cqi]">
                                    
                                    {/* Left Column */}
                                    <div className="flex flex-col justify-start" style={{ width: '50%', paddingRight: '1cqi', paddingTop: '1.5cqi' }}>
                                        {/* Title */}
                                        <h2 className="flex items-center tracking-wide" style={{ fontFamily: "var(--font-mono)", fontSize: "1.8cqi", fontWeight: "bold", marginBottom: "3cqi" }}>
                                            <span style={{ color: '#ef4444', marginRight: '0.8cqi' }}>&gt;&gt;</span>
                                            <span style={{ color: '#eab308' }}>About the event</span>
                                        </h2>
                                        
                                        {/* Paragraphs */}
                                        <p className="leading-relaxed text-gray-300" style={{ fontSize: '1cqi', marginBottom: '1.2cqi', fontFamily: 'var(--font-mono)' }}>
                                            TECH ADRISHTA started as a dorm-room hackathon and grew into the largest independent tech fest in the region. Two days, four tracks, and a single rule: everything you present has to actually run.
                                        </p>
                                        <p className="leading-relaxed text-gray-300" style={{ fontSize: '1cqi', fontFamily: 'var(--font-mono)' }}>
                                            Expect engineers who ship at scale, founders mid-raise, and security researchers who break things on stage. No keynote fluff.
                                        </p>
                                    </div>
                                    
                                    {/* Right Column: Island */}
                                    <div className="flex justify-end items-end relative" style={{ width: '50%', height: '100%', paddingRight: '2cqi' }}>
                                        <img src="/pixel_cloud.png" className="absolute top-[1cqi] left-[8cqi] w-[5.5cqi] pixel-cloud" style={{ opacity: 0.8 }} alt="cloud" />
                                        <img src="/pixel_cloud.png" className="absolute top-[-0.5cqi] right-[8cqi] w-[6.5cqi] pixel-cloud-reverse" style={{ opacity: 0.8 }} alt="cloud" />
                                        <img src="/island.png" alt="Floating Island" style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'relative', zIndex: 10 }} />
                                    </div>
                                </div>

                                    {/* BOTTOM SECTION */}
                                    <div className="w-full flex flex-col items-center shrink-0">
                                        
                                        {/* Stats Bar */}
                                        <div className="w-full flex items-center justify-between border-t border-gray-700/60 mt-[1cqi]" style={{ padding: '1cqi 0 0.5cqi 0' }}>
                                        
                                        {/* 1. DATE */}
                                        <div className="flex flex-row items-center justify-center gap-[0.8cqi] w-1/4">
                                            <span style={{ fontSize: '1.8cqi' }}>📅</span>
                                            <div className="flex flex-col text-left" style={{ fontFamily: 'var(--font-mono)', lineHeight: '1.2' }}>
                                                <span style={{ color: '#ef4444', fontSize: '0.8cqi' }}>DATE</span>
                                                <span style={{ color: '#fff', fontSize: '0.75cqi', letterSpacing: '0.5px' }}>12 - 13<br/>SEPTEMBER 2026</span>
                                            </div>
                                        </div>

                                        <div className="w-[1px] h-[3cqi] border-l border-dashed border-gray-600/50"></div>
                                        
                                        {/* 2. VENUE */}
                                        <div className="flex flex-row items-center justify-center gap-[0.8cqi] w-1/4">
                                            <span style={{ fontSize: '1.8cqi' }}>📍</span>
                                            <div className="flex flex-col text-left" style={{ fontFamily: 'var(--font-mono)', lineHeight: '1.2' }}>
                                                <span style={{ color: '#ef4444', fontSize: '0.8cqi' }}>VENUE</span>
                                                <span style={{ color: '#fff', fontSize: '0.75cqi', letterSpacing: '0.5px' }}>SMIT CAMPUS,<br/>SIKKIM</span>
                                            </div>
                                        </div>

                                        <div className="w-[1px] h-[3cqi] border-l border-dashed border-gray-600/50"></div>
                                        
                                        {/* 3. PARTICIPANTS */}
                                        <div className="flex flex-row items-center justify-center gap-[0.8cqi] w-1/4">
                                            <span style={{ fontSize: '1.8cqi' }}>👥</span>
                                            <div className="flex flex-col text-left" style={{ fontFamily: 'var(--font-mono)', lineHeight: '1.2' }}>
                                                <span style={{ color: '#ef4444', fontSize: '0.8cqi' }}>PARTICIPANTS</span>
                                                <span style={{ color: '#fff', fontSize: '0.75cqi', letterSpacing: '0.5px' }}>1000+<br/>INNOVATORS</span>
                                            </div>
                                        </div>

                                        <div className="w-[1px] h-[3cqi] border-l border-dashed border-gray-600/50"></div>
                                        
                                        {/* 4. DURATION */}
                                        <div className="flex flex-row items-center justify-center gap-[0.8cqi] w-1/4">
                                            <span style={{ fontSize: '1.8cqi' }}>⏱️</span>
                                            <div className="flex flex-col text-left" style={{ fontFamily: 'var(--font-mono)', lineHeight: '1.2' }}>
                                                <span style={{ color: '#ef4444', fontSize: '0.8cqi' }}>DURATION</span>
                                                <span style={{ color: '#fff', fontSize: '0.75cqi', letterSpacing: '0.5px' }}>2 DAYS</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div> {/* End of Outlined Container */}

                                    {/* Buttons Row */}
                                    <div className="flex items-center gap-[3cqi]" style={{ marginTop: '0.5cqi' }}>
                                        <button className="hover:scale-105 transition-transform flex items-center justify-center" 
                                            onClick={() => window.location.href = '/events'}
                                            style={{ 
                                                backgroundColor: '#ffb800', 
                                                color: '#000',
                                                border: 'none',
                                                padding: '1.2cqi 2.5cqi',
                                                margin: '6px',
                                                fontFamily: 'var(--font-mono)',
                                                fontWeight: 'bold',
                                                fontSize: '1cqi',
                                                boxShadow: 'inset 0 -3px 0 0 rgba(217, 119, 6, 0.5), 0 -3px 0 0 #000, 0 3px 0 0 #000, -3px 0 0 0 #000, 3px 0 0 0 #000, 0 -6px 0 0 #d97706, 0 6px 0 0 #d97706, -6px 0 0 0 #d97706, 6px 0 0 0 #d97706, -3px -3px 0 0 #d97706, 3px -3px 0 0 #d97706, -3px 3px 0 0 #d97706, 3px 3px 0 0 #d97706'
                                            }}>
                                            REGISTER NOW &gt;
                                        </button>
                                        <button className="hover:scale-105 transition-transform flex items-center justify-center" 
                                            onClick={() => window.location.href = '/events'}
                                            style={{ 
                                                backgroundColor: 'rgba(0,0,0,0.6)',
                                                color: '#fff',
                                                border: 'none',
                                                padding: '1.2cqi 2.5cqi',
                                                margin: '6px',
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: '1cqi',
                                                boxShadow: '0 -3px 0 0 #9ca3af, 0 3px 0 0 #9ca3af, -3px 0 0 0 #9ca3af, 3px 0 0 0 #9ca3af'
                                            }}>
                                            VIEW SCHEDULE
                                        </button>
                                    </div>
                                </div>
                        )}
                    </div>
                </div>

                {/* ================= SCREEN GLARE OVERLAY ================= */}
                <svg viewBox="0 0 1000 480" className="absolute inset-0 w-full h-full pointer-events-none" style={{ display: 'block' }}>
                    <rect x="125" y="30" width="750" height="420" rx="10" fill="url(#screenGlare)" pointerEvents="none" />
                </svg>
            </div>

            <style>{`
        .switch-screen-scroll::-webkit-scrollbar { width: 5px; }
        .switch-screen-scroll::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
        .switch-screen-scroll::-webkit-scrollbar-track { background: transparent; }
      `}</style>
            </motion.div>
        </motion.div>
    );
}