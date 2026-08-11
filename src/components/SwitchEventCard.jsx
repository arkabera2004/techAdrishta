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

export default function SwitchEventCard() {
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

    const nextPage = () => setPage((p) => Math.min(p + 1, 1));
    const prevPage = () => setPage((p) => Math.max(p - 1, 0));

    return (
        <div className="w-full max-w-3xl mx-auto">
            <svg viewBox="0 0 1000 480" className="w-full h-auto">
                <defs>
                    <linearGradient id="blueJoycon" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4d8fe0" />
                        <stop offset="45%" stopColor="#2f68b8" />
                        <stop offset="100%" stopColor="#1c4788" />
                    </linearGradient>
                    <linearGradient id="redJoycon" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f66850" />
                        <stop offset="45%" stopColor="#dd402a" />
                        <stop offset="100%" stopColor="#b02717" />
                    </linearGradient>
                    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#2b2b2d" />
                        <stop offset="100%" stopColor="#151516" />
                    </linearGradient>
                    <linearGradient id="sheen" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
                        <stop offset="18%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>
                    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="160%">
                        <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#000" floodOpacity="0.28" />
                    </filter>
                    <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feOffset dx="0" dy="2" />
                        <feGaussianBlur stdDeviation="3" result="offset-blur" />
                        <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                        <feFlood floodColor="#000" floodOpacity="0.55" result="color" />
                        <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                        <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                    </filter>
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
                    <circle cx="97" cy="98" r="40" fill="#0e0e0f" />
                    <circle cx="97" cy="98" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
                    <circle cx="97" cy="98" r="31" fill="#2c2c2e" />
                    <circle cx="97" cy="98" r="31" fill="url(#sheen)" opacity="0.5" />

                    {/* D-pad: four individual button caps */}
                    <g>
                        {/* up */}
                        <rect
                            x="80" y="188" width="34" height="34" rx="8"
                            fill={pressed === "up" ? "#5a9ae6" : "#0e0e0f"}
                            onPointerDown={() => press("up", () => scrollBy(-70))}
                            style={{ cursor: "pointer" }}
                        />
                        {/* left */}
                        <rect 
                            x="46" y="222" width="34" height="34" rx="8" 
                            fill={pressed === "left" ? "#5a9ae6" : "#0e0e0f"}
                            onPointerDown={() => press("left", prevPage)}
                            style={{ cursor: "pointer" }}
                        />
                        {/* right */}
                        <rect 
                            x="114" y="222" width="34" height="34" rx="8" 
                            fill={pressed === "right" ? "#5a9ae6" : "#0e0e0f"}
                            onPointerDown={() => press("right", nextPage)}
                            style={{ cursor: "pointer" }}
                        />
                        {/* down */}
                        <rect
                            x="80" y="256" width="34" height="34" rx="8"
                            fill={pressed === "down" ? "#5a9ae6" : "#0e0e0f"}
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

                    <foreignObject x="223" y="54" width="554" height="372">
                        <div
                            ref={scrollRef}
                            className="switch-screen-scroll w-full h-full overflow-hidden text-[#cfcfd6]"
                            style={{ fontFamily: "'VT323', monospace", position: 'relative', width: '100%', height: '100%' }}
                        >
                            {page === 0 && (
                                <div className="w-full h-full flex flex-col justify-center items-start text-left p-6 animate-in fade-in duration-300">
                                    <h2
                                        className="text-white mb-6 tracking-wide"
                                        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "24px", lineHeight: "1.6" }}
                                    >
                                        {EVENT.heading}
                                    </h2>

                                    {EVENT.paragraphs.map((p, i) => (
                                        <p key={i} className="text-[20px] leading-relaxed mb-5 text-gray-300 max-w-[500px]">
                                            {p}
                                        </p>
                                    ))}

                                    <div 
                                        className="text-white animate-pulse flex items-center gap-2 cursor-pointer"
                                        onClick={() => press('right', nextPage)}
                                        style={{ position: 'absolute', bottom: '24px', right: '32px' }}
                                    >
                                        <span className="text-[22px]">NEXT</span>
                                        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "14px", marginTop: "4px" }}>&gt;</span>
                                    </div>
                                </div>
                            )}

                            {page === 1 && (
                                <div className="w-full h-full flex flex-col justify-center p-8 animate-in fade-in duration-300">
                                    <div className="border border-gray-600 rounded-lg px-6 py-6 bg-white/5 shadow-lg">
                                        <div
                                            className="text-white mb-6 text-center"
                                            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "16px" }}
                                        >
                                            {EVENT.tracksTitle}
                                        </div>
                                        <ul className="space-y-4">
                                            {EVENT.tracks.map((t) => (
                                                <li key={t.name} className="text-[19px] leading-snug text-gray-300">
                                                    <span className="text-white font-bold">{t.name}</span> — {t.desc}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <div 
                                        className="text-white animate-pulse flex items-center gap-2 cursor-pointer"
                                        onClick={() => press('left', prevPage)}
                                        style={{ position: 'absolute', bottom: '24px', left: '32px' }}
                                    >
                                        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "14px", marginTop: "4px" }}>&lt;</span>
                                        <span className="text-[22px]">BACK</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </foreignObject>

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
                        <circle cx="922" cy="182" r="19" fill="#0e0e0f" />
                        <text x="922" y="188">X</text>
                        <circle cx="968" cy="228" r="19" fill="#0e0e0f" />
                        <text x="968" y="234">A</text>
                        <circle cx="876" cy="228" r="19" fill="#0e0e0f" />
                        <text x="876" y="234">Y</text>
                        <circle cx="922" cy="274" r="19" fill="#0e0e0f" />
                        <text x="922" y="280">B</text>
                    </g>

                    {/* thumbstick */}
                    <circle cx="922" cy="366" r="40" fill="#0e0e0f" />
                    <circle cx="922" cy="366" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
                    <circle cx="922" cy="366" r="31" fill="#2c2c2e" />
                    <circle cx="922" cy="366" r="31" fill="url(#sheen)" opacity="0.5" />
                </g>
            </svg>

            <style>{`
        .switch-screen-scroll::-webkit-scrollbar { width: 5px; }
        .switch-screen-scroll::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
        .switch-screen-scroll::-webkit-scrollbar-track { background: transparent; }
      `}</style>
        </div>
    );
}