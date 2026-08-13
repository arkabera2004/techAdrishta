import React from 'react';

const ChamferBox = ({ children, className, style, innerClassName, innerStyle, borderColor = '#5c4331', borderSize = '2px', clipSize = '0.8cqi' }) => {
    const clipPath = `polygon(${clipSize} 0, calc(100% - ${clipSize}) 0, 100% ${clipSize}, 100% calc(100% - ${clipSize}), calc(100% - ${clipSize}) 100%, ${clipSize} 100%, 0 calc(100% - ${clipSize}), 0 ${clipSize})`;
    return (
        <div className={`relative flex flex-col ${className || ''}`} style={{ ...style, padding: borderSize, background: borderColor, clipPath }}>
            <div className={`flex flex-1 w-full h-full ${innerClassName || ''}`} style={{ ...innerStyle, background: innerStyle?.background || '#060a14', clipPath }}>
                {children}
            </div>
        </div>
    );
};

const TedTalk = ({ isVisible, opacity, blackFade, screenHeight, navbarHeight }) => {
    return (
        <div className="w-full flex-shrink-0 flex flex-col items-center animate-in fade-in duration-300 z-10" style={{ height: screenHeight && navbarHeight ? `${screenHeight - navbarHeight}px` : "36.7cqi", padding: '1.5cqi 2cqi 1cqi 2cqi', transition: 'opacity 0.25s ease', opacity: blackFade ? 0 : 1, display: isVisible ? 'flex' : 'none' }}>
            {/* Main Outlined Container */}
            <div
                className="w-full h-full flex flex-col shadow-lg"
                style={{
                    borderRadius: '0.8cqi',
                    backgroundColor: '#060a14',
                    border: '1px solid #1e293b',
                    padding: '2.5cqi 2.5cqi 1cqi 2.5cqi',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Top Header Row */}
                <div className="flex items-start justify-between w-full mb-[2cqi]">
                    <div className="flex items-end gap-[1cqi] whitespace-nowrap">
                        <img src="/ted-mic.png" alt="Microphone" style={{ width: '4.8cqi', height: '4.8cqi', imageRendering: 'pixelated' }} />
                        <h2 className="m-0 p-0 flex items-center gap-[0.5cqi]" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '3.2cqi', lineHeight: 1, paddingBottom: '0.2cqi' }}>
                            <span className="text-[#ef4444]">TED</span>
                            <span className="text-white">TALK</span>
                        </h2>
                        <span style={{ color: '#eab308', fontSize: '1.2cqi', marginLeft: '0.2cqi', transform: 'translateY(-2.5cqi)' }}>✨</span>
                    </div>
                    <div className="flex flex-col text-left font-mono" style={{ color: '#d1d5db', fontSize: '1.1cqi', lineHeight: '1.6' }}>
                        <p className="m-0">Great ideas. Real impact.</p>
                        <p className="m-0">Listen to thoughts that move the world forward.</p>
                    </div>
                </div>

                <div className="flex w-full gap-[2cqi] flex-1 mb-[3cqi] mt-[3cqi]">
                    {/* Left Column (Silhouette) */}
                    <div className="relative flex flex-col justify-start h-full" style={{ width: '40%' }}>
                        <div
                            className="w-full relative flex flex-col items-center justify-center rounded overflow-hidden"
                            style={{ backgroundColor: 'transparent', marginTop: '1.5cqi' }}
                        >
                            <img src="/ted-silhouette.png" alt="Silhouette" className="w-full h-auto object-contain block relative z-0" />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col flex-1" style={{ width: '60%', gap: '1.5cqi' }}>
                        {/* 3 Info Boxes Row */}
                        <div className="flex w-full justify-between gap-[1.2cqi]" style={{ marginTop: '2cqi' }}>
                            {/* Date */}
                            <ChamferBox className="flex-1" innerClassName="flex items-center p-[1cqi] gap-[1cqi]">
                                <img src="/ted-calendar.png" alt="Date" style={{ width: '2.5cqi', height: '2.5cqi', imageRendering: 'pixelated', marginLeft: '0.5cqi' }} />
                                <div className="flex flex-col font-mono text-[#0ea5e9]">
                                    <span style={{ fontSize: '0.9cqi', fontWeight: 'bold' }}>DATE</span>
                                    <span className="text-white mt-[0.5cqi]" style={{ fontSize: '0.8cqi' }}>12 - 13</span>
                                    <span className="text-white mt-[0.2cqi]" style={{ fontSize: '0.8cqi' }}>SEPTEMBER 2026</span>
                                </div>
                            </ChamferBox>
                            {/* Time */}
                            <ChamferBox className="flex-1" innerClassName="flex items-center p-[1cqi] gap-[1cqi]">
                                <img src="/ted-clock.png" alt="Time" style={{ width: '2.5cqi', height: '2.5cqi', imageRendering: 'pixelated', marginLeft: '0.5cqi' }} />
                                <div className="flex flex-col font-mono text-[#eab308]">
                                    <span style={{ fontSize: '0.9cqi', fontWeight: 'bold' }}>TIME</span>
                                    <span className="text-white mt-[0.5cqi]" style={{ fontSize: '0.8cqi' }}>10.30 AM</span>
                                    <span className="text-white mt-[0.2cqi]" style={{ fontSize: '0.8cqi' }}>ONWARDS</span>
                                </div>
                            </ChamferBox>
                            {/* Venue */}
                            <ChamferBox className="flex-1" innerClassName="flex items-center p-[1cqi] gap-[1cqi]">
                                <img src="/ted-pin.png" alt="Venue" style={{ width: '2cqi', height: '2.5cqi', imageRendering: 'pixelated', marginLeft: '0.5cqi' }} />
                                <div className="flex flex-col font-mono text-[#ef4444]">
                                    <span style={{ fontSize: '0.9cqi', fontWeight: 'bold' }}>VENUE</span>
                                    <span className="text-white mt-[0.5cqi]" style={{ fontSize: '0.8cqi' }}>SMIT CAMPUS,</span>
                                    <span className="text-white mt-[0.2cqi]" style={{ fontSize: '0.8cqi' }}>SIKKIM</span>
                                </div>
                            </ChamferBox>
                        </div>

                        {/* What to Expect */}
                        <ChamferBox className="w-full" innerClassName="flex flex-col w-full" innerStyle={{ padding: '2.2cqi' }}>
                            <h4 className="m-0 p-0 text-[#eab308] text-left" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '1cqi', letterSpacing: '0.5px' }}>
                                WHAT TO EXPECT <span style={{ marginLeft: '1cqi', letterSpacing: '-2px' }}>&lt;&lt;&lt;&lt;</span>
                            </h4>

                            <div className="grid grid-cols-4 w-full gap-[1cqi] mt-[3cqi]">
                                <div className="flex flex-col items-center gap-[1.5cqi]">
                                    <img src="/ted-bulb.png" alt="Inspiring Ideas" style={{ width: '4cqi', height: '4cqi', imageRendering: 'pixelated' }} />
                                    <span className="font-mono text-[#d1d5db] text-center" style={{ fontSize: '0.9cqi', lineHeight: '1.5' }}>Inspiring<br />Ideas</span>
                                </div>
                                <div className="flex flex-col items-center gap-[1.5cqi]">
                                    <img src="/ted-rocket.png" alt="Future Perspectives" style={{ width: '4cqi', height: '4cqi', imageRendering: 'pixelated' }} />
                                    <span className="font-mono text-[#d1d5db] text-center" style={{ fontSize: '0.9cqi', lineHeight: '1.5' }}>Future<br />Perspectives</span>
                                </div>
                                <div className="flex flex-col items-center gap-[1.5cqi]">
                                    <img src="/ted-people.png" alt="Thought Leadership" style={{ width: '4cqi', height: '4cqi', imageRendering: 'pixelated' }} />
                                    <span className="font-mono text-[#d1d5db] text-center" style={{ fontSize: '0.9cqi', lineHeight: '1.5' }}>Thought<br />Leadership</span>
                                </div>
                                <div className="flex flex-col items-center gap-[1.5cqi]">
                                    <img src="/ted-heart.png" alt="Real Impact" style={{ width: '4cqi', height: '4cqi', imageRendering: 'pixelated' }} />
                                    <span className="font-mono text-[#d1d5db] text-center" style={{ fontSize: '0.9cqi', lineHeight: '1.5' }}>Real<br />Impact</span>
                                </div>
                            </div>
                        </ChamferBox>
                    </div>
                </div>

                {/* Bottom Banner */}
                <ChamferBox
                    className="w-[97%] mx-auto mt-auto"
                    borderColor="#ef4444"
                    clipSize="0.6cqi"
                    innerClassName="flex items-center justify-between px-[2.5cqi] py-[1.2cqi]"
                    innerStyle={{ background: '#1a0505' }}
                >
                    <div className="flex items-center gap-[1.2cqi]">
                        <span style={{ color: '#eab308', fontSize: '1.4cqi', textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000' }}>★</span>
                        <span className="whitespace-nowrap" style={{ fontFamily: "'Press Start 2P', monospace", color: '#d1d5db', fontSize: '0.65cqi', letterSpacing: '0.5px', transform: 'translateY(0.2cqi)' }}>
                            Get ready for conversations that challenge minds and spark change.
                        </span>
                    </div>
                    <div className="flex items-center gap-[1cqi]">
                        <img src="/question_mark.png" alt="Block" style={{ width: '1.8cqi', height: '1.8cqi', imageRendering: 'pixelated' }} />
                        <span style={{ color: '#eab308', fontSize: '1.2cqi' }}>✨</span>
                    </div>
                </ChamferBox>

            </div>
        </div>
    );
};

export default TedTalk;
