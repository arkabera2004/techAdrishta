import React from 'react';

const TedTalk = ({ isVisible, opacity, blackFade, screenHeight, navbarHeight }) => {
    return (
        <div className="w-full flex-shrink-0 flex flex-col items-center animate-in fade-in duration-300 z-10" style={{ height: screenHeight && navbarHeight ? `${screenHeight - navbarHeight}px` : "36.7cqi", padding: '1.2cqi 3cqi 1.5cqi 3cqi', transition: 'opacity 0.25s ease', opacity: blackFade ? 0 : 1, display: isVisible ? 'flex' : 'none' }}>
            {/* Main Outlined Container */}
            <div
                className="w-full h-full flex flex-col shadow-lg"
                style={{
                    borderRadius: '0.8cqi',
                    backgroundColor: '#060a14',
                    border: '1px solid #1e293b',
                    padding: '2.5cqi',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Decorative border corners (yellow) on main container */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '0.6cqi', height: '0.6cqi', borderTop: '2px solid #eab308', borderLeft: '2px solid #eab308', zIndex: 5 }} />
                <div style={{ position: 'absolute', top: 0, right: 0, width: '0.6cqi', height: '0.6cqi', borderTop: '2px solid #eab308', borderRight: '2px solid #eab308', zIndex: 5 }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '0.6cqi', height: '0.6cqi', borderBottom: '2px solid #eab308', borderLeft: '2px solid #eab308', zIndex: 5 }} />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '0.6cqi', height: '0.6cqi', borderBottom: '2px solid #eab308', borderRight: '2px solid #eab308', zIndex: 5 }} />

                {/* Top Header Row */}
                <div className="flex items-start justify-between w-full mb-[2cqi]">
                    <div className="flex items-center gap-[1cqi]">
                        <img src="/ted-mic.png" alt="Microphone" style={{ width: '3cqi', height: '3cqi', imageRendering: 'pixelated' }} />
                        <h2 className="m-0 p-0 text-[#ef4444]" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '3.8cqi', lineHeight: 1 }}>TED TALK</h2>
                        <span style={{ color: '#eab308', fontSize: '1.2cqi', marginLeft: '0.5cqi', transform: 'translateY(-1.5cqi)' }}>✨</span>
                    </div>
                    <div className="flex flex-col text-left font-mono" style={{ color: '#d1d5db', fontSize: '1.1cqi', lineHeight: '1.6' }}>
                        <p className="m-0">Great ideas. Real impact.</p>
                        <p className="m-0">Listen to thoughts that move the world forward.</p>
                    </div>
                </div>

                <div className="flex w-full gap-[2cqi] flex-1">
                    {/* Left Column (Silhouette) */}
                    <div className="relative flex flex-col h-full" style={{ width: '40%' }}>
                        <div
                            className="flex-1 w-full relative flex items-center justify-center rounded overflow-hidden"
                            style={{ border: '2px solid #ef4444', backgroundColor: '#500000' }}
                        >
                            <img src="/ted-silhouette.png" alt="Silhouette" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                            {/* Inner Gold Star intersecting top border */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[50%] z-10">
                                <span style={{ color: '#eab308', fontSize: '1.5cqi', textShadow: '0 0 5px #000' }}>⭐</span>
                            </div>

                            {/* Text Box Over Silhouette */}

                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col flex-1 gap-[2.5cqi] h-full justify-between">
                        {/* Top Info Boxes */}
                        <div className="flex gap-[1.5cqi]" style={{ height: '35%' }}>
                            <div className="flex-1 border border-[#334155] rounded flex items-center p-[1cqi] gap-[0.8cqi] bg-transparent">
                                <img src="/ted-calendar.png" alt="Date" style={{ width: '2cqi', height: '2cqi', imageRendering: 'pixelated' }} />
                                <div className="flex flex-col font-mono text-[#0ea5e9]">
                                    <span style={{ fontSize: '0.9cqi', fontWeight: 'bold' }}>DATE</span>
                                    <span className="text-white mt-[0.2cqi]" style={{ fontSize: '0.8cqi' }}>12 - 13</span>
                                    <span className="text-white" style={{ fontSize: '0.8cqi' }}>SEPTEMBER 2026</span>
                                </div>
                            </div>
                            <div className="flex-1 border border-[#334155] rounded flex items-center p-[1cqi] gap-[0.8cqi] bg-transparent">
                                <img src="/ted-clock.png" alt="Time" style={{ width: '2cqi', height: '2cqi', imageRendering: 'pixelated' }} />
                                <div className="flex flex-col font-mono text-[#eab308]">
                                    <span style={{ fontSize: '0.9cqi', fontWeight: 'bold' }}>TIME</span>
                                    <span className="text-white mt-[0.2cqi]" style={{ fontSize: '0.8cqi' }}>10.30 AM</span>
                                    <span className="text-white" style={{ fontSize: '0.8cqi' }}>ONWARDS</span>
                                </div>
                            </div>
                            <div className="flex-1 border border-[#334155] rounded flex items-center p-[1cqi] gap-[0.8cqi] bg-transparent">
                                <img src="/ted-pin.png" alt="Venue" style={{ width: '1.5cqi', height: '2cqi', imageRendering: 'pixelated' }} />
                                <div className="flex flex-col font-mono text-[#ef4444]">
                                    <span style={{ fontSize: '0.9cqi', fontWeight: 'bold' }}>VENUE</span>
                                    <span className="text-white mt-[0.2cqi]" style={{ fontSize: '0.8cqi' }}>SMIT CAMPUS,</span>
                                    <span className="text-white" style={{ fontSize: '0.8cqi' }}>SIKKIM</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Info Box */}
                        <div className="flex-1 border border-[#334155] rounded flex flex-col p-[1.5cqi] justify-center">
                            <h4 className="m-0 p-0 text-[#eab308] mb-[2.5cqi]" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '1.2cqi' }}>WHAT TO EXPECT &lt;&lt;&lt;&lt;</h4>
                            <div className="flex justify-between items-start flex-1 px-[1cqi]">
                                <div className="flex flex-col items-center gap-[0.8cqi]">
                                    <img src="/ted-bulb.png" alt="Inspiring Ideas" style={{ width: '2.5cqi', height: '2.5cqi', imageRendering: 'pixelated' }} />
                                    <span className="font-mono text-[#94a3b8] text-center" style={{ fontSize: '0.85cqi' }}>Inspiring<br />Ideas</span>
                                </div>
                                <div className="flex flex-col items-center gap-[0.8cqi]">
                                    <img src="/ted-rocket.png" alt="Future Perspectives" style={{ width: '2.5cqi', height: '2.5cqi', imageRendering: 'pixelated' }} />
                                    <span className="font-mono text-[#94a3b8] text-center" style={{ fontSize: '0.85cqi' }}>Future<br />Perspectives</span>
                                </div>
                                <div className="flex flex-col items-center gap-[0.8cqi]">
                                    <img src="/ted-people.png" alt="Thought Leadership" style={{ width: '2.5cqi', height: '2.5cqi', imageRendering: 'pixelated' }} />
                                    <span className="font-mono text-[#94a3b8] text-center" style={{ fontSize: '0.85cqi' }}>Thought<br />Leadership</span>
                                </div>
                                <div className="flex flex-col items-center gap-[0.8cqi]">
                                    <img src="/ted-heart.png" alt="Real Impact" style={{ width: '2.5cqi', height: '2.5cqi', imageRendering: 'pixelated' }} />
                                    <span className="font-mono text-[#94a3b8] text-center" style={{ fontSize: '0.85cqi' }}>Real<br />Impact</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Banner */}
                <div className="w-full mt-[2.5cqi] border border-[#ef4444] rounded flex items-center justify-between px-[2cqi] py-[1.2cqi]" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                    <div className="flex items-center gap-[1cqi]">
                        <img src="/ted-star.png" alt="Star" style={{ width: '1.2cqi', height: '1.2cqi', imageRendering: 'pixelated' }} />
                        <span className="font-mono text-[#d1d5db]" style={{ fontSize: '0.9cqi', letterSpacing: '0.5px' }}>Get ready for conversations that challenge minds and spark change.</span>
                    </div>
                    <div className="flex items-center gap-[0.5cqi]">
                        <img src="/question_mark.png" alt="Block" style={{ width: '1.5cqi', height: '1.5cqi', imageRendering: 'pixelated' }} />
                        <span style={{ color: '#eab308', fontSize: '1cqi' }}>✨</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TedTalk;
