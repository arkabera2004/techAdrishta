import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const TRACES_DATA = (() => {
    const traces = [];
    const center = 400;
    const half = 110;
    const pinsPerSide = 10;
    const spacing = (half * 2 - 40) / (pinsPerSide - 1);
    
    const seededRandom = (seed) => {
        const x = Math.sin(seed * 9301 + 49297) * 233280;
        return x - Math.floor(x);
    };
    
    const sides = [
        { name: 'top', dx: 0, dy: -1 },
        { name: 'right', dx: 1, dy: 0 },
        { name: 'bottom', dx: 0, dy: 1 },
        { name: 'left', dx: -1, dy: 0 },
    ];
    
    let index = 0;
    sides.forEach(side => {
        for (let i = 0; i < pinsPerSide; i++) {
            let px = center;
            let py = center;
            const offset = -half + 20 + i * spacing;
            
            if (side.name === 'top') {
                px = center + offset;
                py = center - half;
            } else if (side.name === 'bottom') {
                px = center + offset;
                py = center + half;
            } else if (side.name === 'left') {
                px = center - half;
                py = center + offset;
            } else if (side.name === 'right') {
                px = center + half;
                py = center + offset;
            }
            
            const path = [];
            path.push(`M ${px} ${py}`);
            
            // t goes from -1 (first pin) to +1 (last pin)
            const t = (i - (pinsPerSide - 1) / 2) / ((pinsPerSide - 1) / 2);
            const absT = Math.abs(t);
            const signT = Math.sign(t) || 1;
            
            // Tangent vectors for orthogonal spread
            const tx = (side.dx === 0) ? 1 : 0;
            const ty = (side.dy === 0) ? 1 : 0;
            
            let cx = px;
            let cy = py;
            
            // Segment 1 (straight outward) - outer pins turn earlier to prevent overlaps
            const dist1 = 15 + (1 - absT) * 20 + seededRandom(index) * 5;
            cx += side.dx * dist1;
            cy += side.dy * dist1;
            path.push(`L ${cx} ${cy}`);
            
            // Segment 2 (diagonal spread) - outer pins spread further
            const dist2 = 10 + absT * 40 + seededRandom(index + 100) * 10;
            cx += (side.dx + signT * tx) * dist2;
            cy += (side.dy + signT * ty) * dist2;
            path.push(`L ${cx} ${cy}`);
            
            // Segment 3 (straight outward again)
            const dist3 = 30 + seededRandom(index + 200) * 40;
            cx += side.dx * dist3;
            cy += side.dy * dist3;
            path.push(`L ${cx} ${cy}`);
            
            // Segment 4 (optional extra bend for organic complexity)
            if (index % 3 === 0 && absT > 0.3) {
                const dist4 = 15 + seededRandom(index + 300) * 15;
                cx += (side.dx + signT * tx) * dist4;
                cy += (side.dy + signT * ty) * dist4;
                path.push(`L ${cx} ${cy}`);
                
                const dist5 = 20 + seededRandom(index + 400) * 20;
                cx += side.dx * dist5;
                cy += side.dy * dist5;
                path.push(`L ${cx} ${cy}`);
            }
            
            traces.push({
                id: index,
                px, py,
                d: path.join(' '),
                endX: cx,
                endY: cy,
                side: side.name
            });
            index++;
        }
    });
    return traces;
})();

export default function ChipPreloader({ onComplete, onTriggerZoomOut = () => {} }) {
    const overlayRef = useRef(null);
    const chipRef = useRef(null);
    const tracesRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const traceEls = gsap.utils.toArray('.trace-path');
            const dotEls = gsap.utils.toArray('.trace-dot');

            const tl = gsap.timeline({
                onComplete: () => {
                    if (onComplete) onComplete();
                }
            });

            // Initial states
            gsap.set(chipRef.current, { opacity: 1, filter: 'drop-shadow(0px 0px 20px rgba(255,170,0,0.6))' });
            gsap.set(tracesRef.current, { opacity: 1 });
            
            // Set exact lengths and initial dot positions with a buffer for SVG rounding
            traceEls.forEach((pathEl, i) => {
                const len = pathEl.getTotalLength();
                pathEl.dataset.len = len;
                // +5 buffer ensures stroke-linecap="round" doesn't render a tiny dot at 0 length
                gsap.set(pathEl, { strokeDasharray: len + 5, strokeDashoffset: len + 5 });
                
                const startPoint = pathEl.getPointAtLength(0);
                gsap.set(dotEls[i], { attr: { cx: startPoint.x, cy: startPoint.y }, opacity: 1 });
            });

            const syncDots = () => {
                traceEls.forEach((pathEl, i) => {
                    const len = parseFloat(pathEl.dataset.len);
                    const offset = parseFloat(gsap.getProperty(pathEl, 'strokeDashoffset'));
                    const drawnLength = Math.max(0, Math.min(len, len - offset));
                    const point = pathEl.getPointAtLength(drawnLength);
                    gsap.set(dotEls[i], { attr: { cx: point.x, cy: point.y } });
                });
            };

            // 0.0s - 0.2s: Glow gently intensifies
            tl.to(chipRef.current, { 
                filter: 'drop-shadow(0px 0px 45px rgba(255,170,0,1))', 
                duration: 0.2,
                ease: "power2.inOut"
            }, 0);

            // 0.1s - 0.8s: Traces draw outward smoothly and fluidly
            tl.to(traceEls, { 
                strokeDashoffset: 0, 
                duration: 0.7, 
                ease: "power2.inOut",
                onUpdate: syncDots
            }, 0.1);

            // 1.0s - 1.4s: Pause briefly at full spread, then retract smoothly
            tl.to(traceEls, { 
                strokeDashoffset: (i, el) => parseFloat(el.dataset.len) + 5,
                duration: 0.4, 
                ease: "power2.inOut",
                onUpdate: syncDots
            }, 1.0);

            // Hide the dots right as they hit the chip to prevent lingering
            tl.to(dotEls, {
                opacity: 0,
                duration: 0.1,
                ease: "power2.in"
            }, 1.3);

            // Trigger zoom out right before chip fades out
            tl.call(onTriggerZoomOut, null, 1.2);

            // Fade preloader background so the zoom out is visible
            tl.to(overlayRef.current, {
                backgroundColor: 'rgba(10,10,12,0)',
                duration: 0.2,
                ease: "power2.inOut"
            }, 1.2);

            // 1.4s - 1.6s: Chip and traces gracefully fade out
            tl.to([chipRef.current, tracesRef.current], { 
                opacity: 0, 
                duration: 0.2, 
                ease: "power2.in" 
            }, 1.4);

            // Wait a moment after chip fades before completing
            tl.to({}, { duration: 0.1 }, 1.6);

        }, overlayRef);

        return () => ctx.revert();
    }, []);

    return (
        <div 
            ref={overlayRef} 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: '#0a0a0c',
                zIndex: 9999,
                margin: 0,
                padding: 0
            }}
        >
            <svg 
                viewBox="0 0 800 800" 
                style={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '240px', 
                    height: '240px', 
                    overflow: 'visible',
                    display: 'block'
                }}
                className="drop-shadow-2xl"
            >
                <defs>
                    <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="0" stdDeviation="15" floodColor="#ffaa00" floodOpacity="0.8" />
                    </filter>
                    <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ffaa00" floodOpacity="1" />
                    </filter>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f9d976" />
                        <stop offset="50%" stopColor="#e9b64c" />
                        <stop offset="100%" stopColor="#b38728" />
                    </linearGradient>
                    <linearGradient id="goldBevel" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8a611c" />
                        <stop offset="50%" stopColor="#dfb14a" />
                        <stop offset="100%" stopColor="#ffebb3" />
                    </linearGradient>
                    <linearGradient id="substrateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#222" />
                        <stop offset="100%" stopColor="#0a0a0c" />
                    </linearGradient>
                    <filter id="dropShadowInner" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.6" />
                    </filter>
                </defs>

                {/* Traces Group */}
                <g ref={tracesRef} style={{ opacity: 0 }}>
                    {TRACES_DATA.map((t) => (
                        <g key={`trace-${t.id}`}>
                            <path
                                className="trace-path"
                                d={t.d}
                                fill="none"
                                stroke="url(#goldGradient)"
                                strokeWidth="6"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                            />
                            <circle
                                className="trace-dot"
                                r="5"
                                fill="#111"
                                stroke="#ffaa00"
                                strokeWidth="3"
                                filter="url(#dotGlow)"
                            />
                        </g>
                    ))}
                </g>

                {/* Chip Group */}
                <g ref={chipRef} className="origin-center" style={{ transformOrigin: '400px 400px' }}>
                    {/* Pins */}
                    {TRACES_DATA.map((t) => (
                        <rect
                            key={`pin-${t.id}`}
                            x={t.side === 'left' ? t.px - 12 : t.side === 'right' ? t.px : t.px - 4}
                            y={t.side === 'top' ? t.py - 12 : t.side === 'bottom' ? t.py : t.py - 4}
                            width={t.side === 'top' || t.side === 'bottom' ? 8 : 12}
                            height={t.side === 'left' || t.side === 'right' ? 8 : 12}
                            fill="url(#goldGradient)"
                            rx="2"
                        />
                    ))}

                    {/* Substrate */}
                    <rect x="290" y="290" width="220" height="220" rx="16" fill="url(#substrateGrad)" stroke="#111" strokeWidth="8" />
                    <rect x="294" y="294" width="212" height="212" rx="14" fill="none" stroke="#2a2a2c" strokeWidth="2" />

                    {/* Gold Plate */}
                    <rect x="305" y="305" width="190" height="190" rx="12" fill="url(#goldBevel)" />
                    <rect x="310" y="310" width="180" height="180" rx="10" fill="url(#goldGradient)" filter="url(#dropShadowInner)" />

                    {/* Notch / Details */}
                    <circle cx="330" cy="330" r="8" fill="#ca9d39" stroke="#b38728" strokeWidth="1" />
                    <circle cx="330" cy="330" r="4" fill="#a87a20" />

                    <circle cx="470" cy="330" r="2.5" fill="#333" />
                    <circle cx="470" cy="330" r="4" fill="none" stroke="#b38728" />

                    <circle cx="470" cy="470" r="6" fill="url(#goldBevel)" />
                    <circle cx="470" cy="470" r="2" fill="#333" />

                    <circle cx="330" cy="470" r="2.5" fill="#a87a20" />
                    <circle cx="338" cy="470" r="2.5" fill="#a87a20" />
                    <circle cx="346" cy="470" r="2.5" fill="#a87a20" />

                    {/* Etched outlines */}
                    <path d="M 345 380 L 380 345 L 420 345 L 455 380 L 455 420 L 420 455 L 380 455 L 345 420 Z" fill="none" stroke="#997022" strokeWidth="4" />
                    <path d="M 346 381 L 380 347 L 420 347 L 454 381 L 454 419 L 420 453 L 380 453 L 346 419 Z" fill="none" stroke="#ffd770" strokeWidth="2" opacity="0.5" />

                    {/* Inner etch details */}
                    <path d="M 345 390 L 335 390 M 345 395 L 335 395 M 345 400 L 335 400 M 345 405 L 335 405 M 345 410 L 335 410" stroke="#997022" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 455 390 L 465 390 M 455 395 L 465 395 M 455 400 L 465 400 M 455 405 L 465 405 M 455 410 L 465 410" stroke="#997022" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 390 455 L 390 465 M 395 455 L 395 465 M 400 455 L 400 465 M 405 455 L 405 465 M 410 455 L 410 465" stroke="#997022" strokeWidth="3" strokeLinecap="round" />

                    {/* Circuit-like small circles on the top plate */}
                    <circle cx="360" cy="360" r="3" fill="#a87a20" />
                    <circle cx="440" cy="360" r="3" fill="#a87a20" />
                    <circle cx="440" cy="440" r="3" fill="#a87a20" />
                    <circle cx="360" cy="440" r="3" fill="#a87a20" />

                    {/* Central square etched */}
                    <rect x="365" y="365" width="70" height="70" rx="4" fill="none" stroke="#a87a20" strokeWidth="3" />
                    <rect x="366" y="366" width="68" height="68" rx="3" fill="none" stroke="#ffe599" strokeWidth="1" opacity="0.6" />
                </g>
            </svg>
        </div>
    );
}
