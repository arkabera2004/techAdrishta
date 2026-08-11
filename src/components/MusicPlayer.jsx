import { useEffect, useRef, useState } from "react";

/**
 * MusicPlayer
 * A vinyl-turntable-styled audio player.
 *
 * HOW IT WORKS
 * - Drag the white tonearm (grab the headshell tip) onto the record to play.
 *   Drag it back off to pause. It snaps to "on" or "off" on release, and the
 *   record spins up / winds down gradually like a real turntable.
 * - Drag the gray thumb on the right-hand vertical track to change volume.
 *
 * SETUP
 * - Put your audio file in your `public/` folder (e.g. public/audio/track.mp3)
 *   and update AUDIO_SRC below.
 * - Requires Tailwind CSS to already be configured in your project.
 */

// ---- 1. Replace this with your actual track path ----
const AUDIO_SRC = "/audiotrack.mp3";

// ---- Geometry constants (SVG viewBox is 400 x 430, height cropped to exclude bottom slider area) ----
const VB_W = 400;
const VB_H = 430;

const RECORD = { cx: 170, cy: 235, r: 158 };
const LABEL_R = 52;

const PIVOT = { x: 330, y: 88 };
const ELBOW = { x: 258, y: 148 };
const HEAD0 = { x: 142, y: 298 }; // headshell tip position when arm is "on record" (drawn pose)

const OFF_ANGLE_ABS = 92; // absolute angle (deg) of the rest/off position, measured from pivot
const ON_ANGLE_ABS =
    (Math.atan2(HEAD0.y - PIVOT.y, HEAD0.x - PIVOT.x) * 180) / Math.PI;
const REST_ROTATION = OFF_ANGLE_ABS - ON_ANGLE_ABS; // rotation delta that parks the arm off-record
const MIN_ROT = Math.min(0, REST_ROTATION);
const MAX_ROT = Math.max(0, REST_ROTATION);

const VOL_TRACK = { x: 344, y: 255, w: 32, h: 150 };

const MAX_SPIN_SPEED = 3.3; // degrees per animation frame at full playback speed
const SPIN_EASE = 0.04; // how quickly spin speed ramps up/down

export default function MusicPlayer() {
    const [rotation, setRotation] = useState(REST_ROTATION); // tonearm rotation, starts OFF the record
    const [isPlaying, setIsPlaying] = useState(false);
    const [isDraggingArm, setIsDraggingArm] = useState(false);
    const [volume, setVolume] = useState(0.7);
    const [isDraggingVolume, setIsDraggingVolume] = useState(false);

    const svgRef = useRef(null);
    const audioRef = useRef(null);
    const recordGroupRef = useRef(null);

    const isPlayingRef = useRef(isPlaying);
    const spinState = useRef({ angle: 0, speed: 0 });
    const rafId = useRef(null);

    // Convert a pointer client position into SVG viewBox coordinates
    const toSvgPoint = (clientX, clientY) => {
        const rect = svgRef.current.getBoundingClientRect();
        const scaleX = VB_W / rect.width;
        const scaleY = VB_H / rect.height;
        return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
    };

    // ---- Tonearm dragging ----
    const handleArmPointerDown = (e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setIsDraggingArm(true);
    };

    const handleArmPointerMove = (e) => {
        if (!isDraggingArm) return;
        const pt = toSvgPoint(e.clientX, e.clientY);
        const pointerAngle =
            (Math.atan2(pt.y - PIVOT.y, pt.x - PIVOT.x) * 180) / Math.PI;
        let next = pointerAngle - ON_ANGLE_ABS;
        next = Math.min(MAX_ROT, Math.max(MIN_ROT, next));
        setRotation(next);
    };

    const handleArmPointerUp = (e) => {
        if (!isDraggingArm) return;
        e.currentTarget.releasePointerCapture(e.pointerId);
        setIsDraggingArm(false);

        const distToOn = Math.abs(rotation - 0);
        const distToOff = Math.abs(rotation - REST_ROTATION);
        if (distToOn < distToOff) {
            setRotation(0);
            setIsPlaying(true);
        } else {
            setRotation(REST_ROTATION);
            setIsPlaying(false);
        }
    };

    // ---- Volume dragging ----
    const handleVolumePointerDown = (e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setIsDraggingVolume(true);
        updateVolumeFromPointer(e.clientX, e.clientY);
    };

    const handleVolumePointerMove = (e) => {
        if (!isDraggingVolume) return;
        updateVolumeFromPointer(e.clientX, e.clientY);
    };

    const handleVolumePointerUp = (e) => {
        if (!isDraggingVolume) return;
        e.currentTarget.releasePointerCapture(e.pointerId);
        setIsDraggingVolume(false);
    };

    const updateVolumeFromPointer = (clientX, clientY) => {
        const pt = toSvgPoint(clientX, clientY);
        const fraction = 1 - (pt.y - VOL_TRACK.y) / VOL_TRACK.h;
        setVolume(Math.min(1, Math.max(0, fraction)));
    };

    // ---- Keep audio element in sync ----
    useEffect(() => {
        isPlayingRef.current = isPlaying;
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.play().catch(() => { });
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    // ---- Record spin animation loop (runs continuously, eases speed toward target) ----
    useEffect(() => {
        const tick = () => {
            const target = isPlayingRef.current ? MAX_SPIN_SPEED : 0;
            const s = spinState.current;
            s.speed += (target - s.speed) * SPIN_EASE;
            s.angle = (s.angle + s.speed) % 360;

            if (recordGroupRef.current) {
                recordGroupRef.current.style.transform = `rotate(${s.angle}deg)`;
            }
            rafId.current = requestAnimationFrame(tick);
        };
        rafId.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId.current);
    }, []);

    const thumbY = VOL_TRACK.y + (1 - volume) * VOL_TRACK.h;

    // We can use an SVG filter for the drop shadow of the headshell/arm
    return (
        <div className="mx-auto select-none" style={{ width: '100%', maxWidth: '350px', aspectRatio: `${VB_W} / ${VB_H}` }}>
            <svg
                ref={svgRef}
                viewBox={`0 0 ${VB_W} ${VB_H}`}
                className="w-full h-full touch-none"
                onPointerMove={(e) => {
                    handleArmPointerMove(e);
                    handleVolumePointerMove(e);
                }}
                onPointerUp={(e) => {
                    handleArmPointerUp(e);
                    handleVolumePointerUp(e);
                }}
                onPointerLeave={(e) => {
                    handleArmPointerUp(e);
                    handleVolumePointerUp(e);
                }}
            >
                <defs>
                    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8b1a1a" />
                        <stop offset="100%" stopColor="#5c0f0f" />
                    </linearGradient>
                    <radialGradient id="recordGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#2a2a2a" />
                        <stop offset="100%" stopColor="#111" />
                    </radialGradient>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.4" />
                    </filter>
                    {/* The cutout for the gears */}
                    <clipPath id="gearClip">
                        <circle cx={RECORD.cx} cy={RECORD.cy} r={LABEL_R} />
                    </clipPath>
                </defs>

                {/* Panel background */}
                <rect x="0" y="0" width={VB_W} height={VB_H} rx="24" fill="url(#bgGrad)" />

                {/* --- Record + label (this whole group spins) --- */}
                <g
                    ref={recordGroupRef}
                    style={{ transformOrigin: `${RECORD.cx}px ${RECORD.cy}px` }}
                >
                    <circle cx={RECORD.cx} cy={RECORD.cy} r={RECORD.r} fill="url(#recordGrad)" />
                    {/* Grooves */}
                    {[0.35, 0.5, 0.65, 0.8, 0.95].map((f, i) => (
                        <circle
                            key={i}
                            cx={RECORD.cx}
                            cy={RECORD.cy}
                            r={RECORD.r * f}
                            fill="none"
                            stroke="rgba(255,255,255,0.04)"
                            strokeWidth="2"
                        />
                    ))}

                    {/* Outer label ring (Yellow background for gears) */}
                    <circle cx={RECORD.cx} cy={RECORD.cy} r={LABEL_R} fill="#e5db27" />

                    {/* The actual label (light green/yellow) with a gear cutout in the center */}
                    <path
                        fill="#d9e681"
                        fillRule="evenodd"
                        d={`M ${RECORD.cx - LABEL_R} ${RECORD.cy} 
                            A ${LABEL_R} ${LABEL_R} 0 1 1 ${RECORD.cx + LABEL_R} ${RECORD.cy}
                            A ${LABEL_R} ${LABEL_R} 0 1 1 ${RECORD.cx - LABEL_R} ${RECORD.cy}
                            Z
                            M ${RECORD.cx} ${RECORD.cy - 12}
                            A 12 12 0 1 0 ${RECORD.cx} ${RECORD.cy + 12}
                            A 12 12 0 1 0 ${RECORD.cx} ${RECORD.cy - 12}
                            Z
                            M ${RECORD.cx - 15} ${RECORD.cy + 5}
                            A 10 10 0 1 0 ${RECORD.cx - 15} ${RECORD.cy + 25}
                            A 10 10 0 1 0 ${RECORD.cx - 15} ${RECORD.cy + 5}
                            Z`}
                    />

                    {/* Abstract gears to match the image inside the yellow background */}
                    <g fill="#444">
                        <circle cx={RECORD.cx} cy={RECORD.cy} r="3" />
                        <circle cx={RECORD.cx - 15} cy={RECORD.cy + 15} r="2" />
                    </g>

                    {/* Gear teeth rough representation around the cutouts */}
                    <path
                        d={`M ${RECORD.cx - 4} ${RECORD.cy - 16} L ${RECORD.cx + 4} ${RECORD.cy - 16} L ${RECORD.cx + 3} ${RECORD.cy - 11} L ${RECORD.cx - 3} ${RECORD.cy - 11} Z
                            M ${RECORD.cx + 11} ${RECORD.cy - 3} L ${RECORD.cx + 16} ${RECORD.cy - 4} L ${RECORD.cx + 15} ${RECORD.cy + 3} L ${RECORD.cx + 10} ${RECORD.cy + 2} Z
                            M ${RECORD.cx - 10} ${RECORD.cy - 2} L ${RECORD.cx - 15} ${RECORD.cy - 3} L ${RECORD.cx - 16} ${RECORD.cy + 4} L ${RECORD.cx - 11} ${RECORD.cy + 3} Z
                            M ${RECORD.cx - 5} ${RECORD.cy + 11} L ${RECORD.cx + 5} ${RECORD.cy + 11} L ${RECORD.cx + 3} ${RECORD.cy + 15} L ${RECORD.cx - 3} ${RECORD.cy + 15} Z
                            
                            M ${RECORD.cx - 22} ${RECORD.cy + 15} L ${RECORD.cx - 26} ${RECORD.cy + 13} L ${RECORD.cx - 24} ${RECORD.cy + 9} L ${RECORD.cx - 20} ${RECORD.cy + 11} Z
                            M ${RECORD.cx - 15} ${RECORD.cy + 22} L ${RECORD.cx - 13} ${RECORD.cy + 26} L ${RECORD.cx - 9} ${RECORD.cy + 24} L ${RECORD.cx - 11} ${RECORD.cy + 20} Z`}
                        fill="#d9e681"
                    />

                    {/* Spindle hole */}
                    <circle cx={RECORD.cx} cy={RECORD.cy} r="4" fill="#222" />
                </g>

                {/* Pivot base (Black circle with red ring) */}
                <circle cx={PIVOT.x} cy={PIVOT.y} r="36" fill="#1f1f1f" stroke="#ff4d4d" strokeWidth="4" />

                {/* --- Tonearm (draggable) --- */}
                <g
                    style={{
                        transformOrigin: `${PIVOT.x}px ${PIVOT.y}px`,
                        transform: `rotate(${rotation}deg)`,
                        transition: isDraggingArm ? "none" : "transform 0.35s cubic-bezier(.3,1.2,.4,1)",
                        cursor: isDraggingArm ? "grabbing" : "grab"
                    }}
                    filter="url(#shadow)"
                    onPointerDown={handleArmPointerDown}
                >
                    {/* Invisible thicker path to make grabbing the thin rod much easier */}
                    <path
                        d={`M ${PIVOT.x} ${PIVOT.y} L ${ELBOW.x} ${ELBOW.y} L ${HEAD0.x} ${HEAD0.y}`}
                        stroke="transparent"
                        strokeWidth="30"
                        strokeLinejoin="round"
                        fill="none"
                    />

                    {/* The visible arm bars */}
                    <path
                        d={`M ${PIVOT.x} ${PIVOT.y} L ${ELBOW.x} ${ELBOW.y} L ${HEAD0.x} ${HEAD0.y}`}
                        stroke="#ffffff"
                        strokeWidth="10"
                        strokeLinejoin="miter"
                        fill="none"
                        pointerEvents="none"
                    />

                    {/* Headshell (Dark gray elongated block) */}
                    <rect
                        x={HEAD0.x - 10}
                        y={HEAD0.y - 26}
                        width="20"
                        height="52"
                        rx="6"
                        fill="#2a2a2a"
                        pointerEvents="none"
                    />
                </g>

                {/* Pivot white block — STATIC (outside rotating group so it doesn't drift) */}
                <rect
                    x={PIVOT.x - 14}
                    y={PIVOT.y - 22}
                    width="28"
                    height="38"
                    rx="4"
                    fill="#ffffff"
                    pointerEvents="none"
                />

                <circle cx={PIVOT.x} cy={PIVOT.y} r="8" fill="#111" />

                {/* --- Volume slider --- */}
                <rect
                    x={VOL_TRACK.x}
                    y={VOL_TRACK.y}
                    width={VOL_TRACK.w}
                    height={VOL_TRACK.h}
                    rx="6"
                    fill="#333333"
                />
                <rect
                    x={VOL_TRACK.x + (VOL_TRACK.w / 2) - 1.5}
                    y={VOL_TRACK.y + 10}
                    width="3"
                    height={VOL_TRACK.h - 20}
                    rx="1"
                    fill="#111"
                />

                {/* Volume Thumb */}
                <rect
                    x={VOL_TRACK.x + 2}
                    y={thumbY - 10}
                    width={VOL_TRACK.w - 4}
                    height="20"
                    rx="4"
                    fill="#8c8c8c"
                    filter="url(#shadow)"
                    onPointerDown={handleVolumePointerDown}
                    style={{ cursor: isDraggingVolume ? "grabbing" : "grab" }}
                />

            </svg>

            <audio ref={audioRef} src={AUDIO_SRC} loop preload="auto" />
        </div>
    );
}