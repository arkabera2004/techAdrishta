import { useEffect, useRef, useState } from "react";

/**
 * SwitchEventCard
 * A flat, straight-on recreation of a Nintendo Switch handheld, with the
 * screen replaced by event details rendered in a pixel/digital typeface.
 *
 * INTERACTION
 * - The D-pad's up/down buttons (left Joy-Con) scroll the on-screen content.
 * - Buttons have a subtle press animation for tactile feedback.
 *
 * SETUP
 * - Requires Tailwind CSS configured in your project.
 * - Pulls "Press Start 2P" (headings) and "VT323" (body/list text) from
 *   Google Fonts at runtime. For production, prefer adding these to your
 *   global CSS/<head> instead of the runtime injection below, for reliability.
 */

const RULES = [
    [
        "Accommodation will be provided strictly on a first-come, first-served basis upon prior booking.",
        "Advance payment must be completed for accommodation.",
        "A screenshot or proof of payment must be shared with the overall coordinators."
    ],
    [
        "Participants must adhere to hostel rules, including: Curfew timings, Cleanliness, and Proper conduct.",
        "Any damage to hostel property will result in fines and/or disqualification."
    ],
    [
        "Participants must vacate the accommodation within the stipulated time after KAALRAV, i.e. latest by 12:00 pm of 9th March 2026."
    ]
];

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

export default function SwitchRulesCard({ onClose }) {
    useGoogleFonts();
    const scrollRef = useRef(null);
    const [pressed, setPressed] = useState(null);
    const [page, setPage] = useState(0);

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

    const nextPage = () => setPage((p) => Math.min(p + 1, 2));
    const prevPage = () => setPage((p) => Math.max(p - 1, 0));

    return (
        <div className="w-full max-w-[1100px] mx-auto" style={{ padding: '0 1rem' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1000/480', containerType: 'inline-size' }}>
                <svg viewBox="0 0 1000 480" className="absolute inset-0 w-full h-full" style={{ display: 'block' }}>
                    <defs>
                        <linearGradient id="blueJoycon" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#007994" />
                            <stop offset="12%" stopColor="#00c3e3" />
                            <stop offset="88%" stopColor="#00c3e3" />
                            <stop offset="100%" stopColor="#00a1bc" />
                        </linearGradient>
                        <linearGradient id="redJoycon" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#d13542" />
                            <stop offset="12%" stopColor="#ff4554" />
                            <stop offset="88%" stopColor="#ff4554" />
                            <stop offset="100%" stopColor="#c32d39" />
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
                            <feDropShadow dx="0" dy="16" stdDeviation="24" floodColor="#000" floodOpacity="0.4" />
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
                        {/* ================= LEFT JOY-CON (blue) ================= */}
                        <path
                            d="M 46,4
                   L 154,4
                   L 154,476
                   L 46,476
                   A 46,46 0 0 1 0,430
                   L 0,50
                   A 46,46 0 0 1 46,4 Z"
                            fill="url(#blueJoycon)"
                        />
                        <path
                            d="M 46,4 L 154,4 L 154,476 L 46,476 A 46,46 0 0 1 0,430 L 0,50 A 46,46 0 0 1 46,4 Z"
                            fill="url(#sheen)"
                        />
                        {/* rail seam */}
                        <rect x="150" y="14" width="3" height="452" fill="rgba(0,0,0,0.3)" />
                        <rect x="146" y="14" width="2" height="452" fill="rgba(255,255,255,0.08)" />

                        {/* SL / SR indicator on rail */}
                        <rect x="151" y="150" width="6" height="34" rx="3" fill="rgba(0,0,0,0.35)" />

                        {/* thumbstick */}
                        <circle cx="97" cy="98" r="40" fill="url(#thumbstickBase)" filter="url(#buttonShadow)" />
                        <circle cx="97" cy="98" r="40" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2" />
                        <circle cx="97" cy="98" r="30" fill="url(#thumbstickCap)" />
                        <circle cx="97" cy="98" r="30" fill="none" stroke="#000" strokeWidth="1" opacity="0.3" />

                        {/* D-pad: four individual button caps */}
                        <g filter="url(#buttonShadow)">
                            {/* up */}
                            <rect
                                x="80" y="188" width="34" height="34" rx="8"
                                fill={pressed === "up" ? "#5a9ae6" : "url(#buttonGrad)"}
                                onPointerDown={() => press("up", () => scrollBy(-70))}
                                style={{ cursor: "pointer" }}
                            />
                            {/* left */}
                            <rect 
                                x="46" y="222" width="34" height="34" rx="8" 
                                fill={pressed === "left" ? "#5a9ae6" : "url(#buttonGrad)"}
                                onPointerDown={() => press("left", prevPage)}
                                style={{ cursor: "pointer" }}
                            />
                            {/* right */}
                            <rect 
                                x="114" y="222" width="34" height="34" rx="8" 
                                fill={pressed === "right" ? "#5a9ae6" : "url(#buttonGrad)"}
                                onPointerDown={() => press("right", nextPage)}
                                style={{ cursor: "pointer" }}
                            />
                            {/* down */}
                            <rect
                                x="80" y="256" width="34" height="34" rx="8"
                                fill={pressed === "down" ? "#5a9ae6" : "url(#buttonGrad)"}
                                onPointerDown={() => press("down", () => scrollBy(70))}
                                style={{ cursor: "pointer" }}
                            />
                        </g>

                        {/* capture + minus buttons */}
                        <rect x="68" y="356" width="22" height="22" rx="5" fill="#0e0e0f" />
                        <circle cx="128" cy="367" r="12" fill="#0e0e0f" />
                        <rect x="122" y="365" width="12" height="3" fill="#5a5a5c" />

                        {/* ================= CENTER BODY ================= */}
                        <rect x="150" y="0" width="700" height="480" rx="22" fill="url(#bodyGrad)" />
                        <rect x="150" y="0" width="700" height="90" rx="22" fill="url(#sheen)" opacity="0.5" />

                        {/* top edge details: power button + headphone jack */}
                        <rect x="255" y="3" width="46" height="6" rx="3" fill="#000" opacity="0.7" />
                        <circle cx="805" cy="18" r="7" fill="#0a0a0a" />
                        <circle cx="805" cy="18" r="7" fill="none" stroke="#333" strokeWidth="1" />

                        {/* notification light */}
                        <circle cx="475" cy="46" r="4" fill="#1d1d1f" />

                        {/* screen bezel */}
                        <rect x="215" y="46" width="570" height="388" rx="20" fill="#000" filter="url(#innerShadow)" />
                        <rect x="223" y="54" width="554" height="372" rx="14" fill="#0a0a0c" />

                        {/* ================= RIGHT JOY-CON (red) ================= */}
                        <path
                            d="M 846,4
                   L 954,4
                   A 46,46 0 0 1 1000,50
                   L 1000,430
                   A 46,46 0 0 1 954,476
                   L 846,476 Z"
                            fill="url(#redJoycon)"
                        />
                        <path
                            d="M 846,4 L 954,4 A 46,46 0 0 1 1000,50 L 1000,430 A 46,46 0 0 1 954,476 L 846,476 Z"
                            fill="url(#sheen)"
                        />
                        <rect x="847" y="14" width="3" height="452" fill="rgba(0,0,0,0.3)" />
                        <rect x="852" y="14" width="2" height="452" fill="rgba(255,255,255,0.08)" />
                        <rect x="843" y="150" width="6" height="34" rx="3" fill="rgba(0,0,0,0.35)" />

                        {/* plus + home row */}
                        <circle cx="890" cy="72" r="10" fill="#0e0e0f" />
                        <rect x="885" y="70" width="10" height="4" fill="#5a5a5c" />
                        <rect x="888.5" y="66.5" width="3" height="11" fill="#5a5a5c" />

                        <circle cx="954" cy="72" r="17" fill="#0e0e0f" />
                        <circle cx="954" cy="72" r="17" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                        <circle cx="954" cy="72" r="10" fill="#dd402a" />

                        {/* ABXY diamond */}
                        <g fontFamily="sans-serif" fontSize="16" fontWeight="700" fill="#e8e8ea" textAnchor="middle">
                            <circle cx="922" cy="182" r="19" fill="url(#buttonGrad)" filter="url(#buttonShadow)" />
                            <text x="922" y="188">X</text>
                            <circle cx="968" cy="228" r="19" fill="url(#buttonGrad)" filter="url(#buttonShadow)" />
                            <text x="968" y="234">A</text>
                            <circle cx="876" cy="228" r="19" fill="url(#buttonGrad)" filter="url(#buttonShadow)" />
                            <text x="876" y="234">Y</text>
                            <circle cx="922" cy="274" r="19" fill="url(#buttonGrad)" filter="url(#buttonShadow)" />
                            <text x="922" y="280">B</text>
                        </g>

                        {/* thumbstick */}
                        <circle cx="922" cy="366" r="40" fill="url(#thumbstickBase)" filter="url(#buttonShadow)" />
                        <circle cx="922" cy="366" r="40" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2" />
                        <circle cx="922" cy="366" r="30" fill="url(#thumbstickCap)" />
                        <circle cx="922" cy="366" r="30" fill="none" stroke="#000" strokeWidth="1" opacity="0.3" />
                    </g>
                </svg>

                {/* ================= SCREEN HTML OVERLAY ================= */}
                <div 
                    className="absolute z-10"
                    style={{
                        left: '22.3%',
                        top: '11.25%',
                        width: '55.4%',
                        height: '77.5%',
                        borderRadius: '1.4cqi',
                        overflow: 'hidden'
                    }}
                >
                    <div
                        ref={scrollRef}
                        className="switch-screen-scroll w-full h-full overflow-hidden text-[#cfcfd6]"
                        style={{ fontFamily: "'VT323', monospace", position: 'relative' }}
                    >
                        <div className="w-full h-full flex flex-col justify-center items-start text-left animate-in fade-in duration-300" style={{ padding: '2.4cqi' }}>
                            <h2
                                className="text-white tracking-wide"
                                style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "2.4cqi", lineHeight: "1.6", marginBottom: '1.6cqi' }}
                            >
                                Hostel Rules
                            </h2>

                            {RULES[page].map((p, i) => (
                                <p key={i} className="leading-relaxed text-gray-300 w-full" style={{ fontSize: '2.1cqi', marginBottom: '1.6cqi' }}>
                                    - {p}
                                </p>
                            ))}

                            <div style={{ position: 'absolute', bottom: '2.4cqi', width: '90%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {page > 0 ? (
                                    <div 
                                        className="text-white flex items-center cursor-pointer"
                                        onClick={() => press('left', prevPage)}
                                        style={{ gap: '0.8cqi' }}
                                    >
                                        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "1.4cqi", marginTop: "0.4cqi" }}>&lt;</span>
                                        <span className="animate-pulse" style={{ fontSize: '2.2cqi' }}>BACK</span>
                                    </div>
                                ) : <div></div>}
                                
                                {page < 2 ? (
                                    <div 
                                        className="text-white flex items-center cursor-pointer"
                                        onClick={() => press('right', nextPage)}
                                        style={{ gap: '0.8cqi' }}
                                    >
                                        <span className="animate-pulse" style={{ fontSize: '2.2cqi' }}>NEXT</span>
                                        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "1.4cqi", marginTop: "0.4cqi" }}>&gt;</span>
                                    </div>
                                ) : <div></div>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= SCREEN GLARE OVERLAY ================= */}
                <svg viewBox="0 0 1000 480" className="absolute inset-0 w-full h-full pointer-events-none" style={{ display: 'block' }}>
                    <rect x="215" y="46" width="570" height="388" rx="20" fill="url(#screenGlare)" pointerEvents="none" />
                </svg>
            </div>

            <style>{`
        .switch-screen-scroll::-webkit-scrollbar { width: 5px; }
        .switch-screen-scroll::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
        .switch-screen-scroll::-webkit-scrollbar-track { background: transparent; }
      `}</style>
        </div>
    );
}