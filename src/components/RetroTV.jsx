import { useEffect, useRef, useState, useCallback } from "react";

/**
 * RetroTV — Realistic vintage console TV in SVG.
 * - Wood-grain cabinet (SVG feTurbulence filter)
 * - Chrome-polished screen bezel with depth shadow
 * - CRT phosphor glow + scanline overlay + glass reflection
 * - 3D knobs with knurling and specular highlight
 * - Brushed-aluminium control plate
 * - Retro brand nameplate
 * Props: videos: [{ name, videoUrl }], initialIndex?
 */

const VB_W = 1000;
const VB_H = 680;

// ── Dial centers ──
const DIAL_CX = 835, DIAL_CY = 420, DIAL_R = 46;
const DIAL_MIN_ANGLE = -150;
const DIAL_MAX_ANGLE = 150;

// ── Volume knob ─────────────────────────────────────────────────────────────
const VOL_CX = 835, VOL_CY = 550, VOL_R = 42;
const VOL_MIN_ANGLE = -135;
const VOL_MAX_ANGLE = 135;

// ── Screen path — matches the black bezel rect (x=24,y=22,w=610,h=530) ─────
const SCREEN_PATH = `
  M 84,22
  Q 24,22 24,82
  L 24,492
  Q 24,552 84,552
  L 570,552
  Q 634,552 634,492
  L 634,82
  Q 634,22 570,22
  Z`;

function angleForIndex(i, n) {
  if (n <= 1) return 0;
  return DIAL_MIN_ANGLE + (i / (n - 1)) * (DIAL_MAX_ANGLE - DIAL_MIN_ANGLE);
}
function indexForAngle(angle, n) {
  if (n <= 1) return 0;
  const t = (angle - DIAL_MIN_ANGLE) / (DIAL_MAX_ANGLE - DIAL_MIN_ANGLE);
  return Math.min(n - 1, Math.max(0, Math.round(t * (n - 1))));
}
function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

export default function RetroTV({ videos = [], initialIndex = 0 }) {
  const [selected, setSelected] = useState(clamp(initialIndex, 0, Math.max(0, videos.length - 1)));
  const [dialAngle, setDialAngle] = useState(angleForIndex(selected, videos.length));
  const [volAngle, setVolAngle] = useState(VOL_MIN_ANGLE + 0.6 * (VOL_MAX_ANGLE - VOL_MIN_ANGLE));

  const svgRef = useRef(null);
  const videoRef = useRef(null);
  const dragTargetRef = useRef(null);

  const current = videos[selected];

  useEffect(() => {
    if (videoRef.current)
      videoRef.current.volume = clamp((volAngle - VOL_MIN_ANGLE) / (VOL_MAX_ANGLE - VOL_MIN_ANGLE), 0, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toSvgPoint = (clientX, clientY) => {
    const r = svgRef.current.getBoundingClientRect();
    return { x: ((clientX - r.left) / r.width) * VB_W, y: ((clientY - r.top) / r.height) * VB_H };
  };

  const selectChannel = useCallback((i) => {
    setSelected(i);
    setDialAngle(angleForIndex(i, videos.length));
  }, [videos.length]);

  const handleDialDown = (e) => { dragTargetRef.current = "dial"; e.currentTarget.setPointerCapture(e.pointerId); };
  const handleVolDown = (e) => { dragTargetRef.current = "volume"; e.currentTarget.setPointerCapture(e.pointerId); };

  const handleMove = (e) => {
    if (!dragTargetRef.current) return;
    const pt = toSvgPoint(e.clientX, e.clientY);
    if (dragTargetRef.current === "dial") {
      let angle = (Math.atan2(pt.y - DIAL_CY, pt.x - DIAL_CX) * 180) / Math.PI + 90;
      if (angle > 180) angle -= 360;
      angle = clamp(angle, DIAL_MIN_ANGLE, DIAL_MAX_ANGLE);
      setDialAngle(angle);
      const idx = indexForAngle(angle, videos.length);
      if (idx !== selected) setSelected(idx);
    } else {
      let angle = (Math.atan2(pt.y - VOL_CY, pt.x - VOL_CX) * 180) / Math.PI + 90;
      if (angle > 180) angle -= 360;
      angle = clamp(angle, VOL_MIN_ANGLE, VOL_MAX_ANGLE);
      setVolAngle(angle);
      if (videoRef.current)
        videoRef.current.volume = clamp((angle - VOL_MIN_ANGLE) / (VOL_MAX_ANGLE - VOL_MIN_ANGLE), 0, 1);
    }
  };

  const handleUp = (e) => {
    if (dragTargetRef.current === "dial") setDialAngle(angleForIndex(selected, videos.length));
    dragTargetRef.current = null;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { }
  };

  const dialTicks = videos.map((_, i) => angleForIndex(i, videos.length));

  return (
    <div style={{ width: "100%", maxWidth: "960px", margin: "0 auto" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        style={{ width: "100%", height: "auto", display: "block", userSelect: "none" }}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
      >
        <defs>
          {/* ── Wood grain filter ── */}
          <filter id="tv-wood-grain" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.55" numOctaves="6" seed="9" result="noise" />
            <feColorMatrix in="noise" type="matrix"
              values="0.45 0 0 0 0.16
                      0.20 0 0 0 0.08
                      0.00 0 0 0 0.02
                      0    0 0 9 -1.4" result="woodTone" />
            <feComposite in="woodTone" in2="SourceGraphic" operator="in" />
          </filter>

          {/* ── Brushed-metal filter for control plate ── */}
          <filter id="tv-brushed" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0 0.65" numOctaves="2" seed="4" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" result="gray" />
            <feBlend in="SourceGraphic" in2="gray" mode="overlay" result="blended" />
            <feComponentTransfer in="blended">
              <feFuncR type="linear" slope="0.95" intercept="0.02" />
              <feFuncG type="linear" slope="0.95" intercept="0.02" />
              <feFuncB type="linear" slope="0.90" intercept="0.02" />
            </feComponentTransfer>
          </filter>

          {/* ── Drop shadow for whole cabinet ── */}
          <filter id="tv-shadow" x="-8%" y="-6%" width="120%" height="128%">
            <feDropShadow dx="0" dy="20" stdDeviation="22" floodColor="#000" floodOpacity="0.55" />
          </filter>

          {/* ── Screen inner-shadow (depth / recess) ── */}
          <filter id="tv-screen-depth" x="-10%" y="-10%" width="120%" height="120%">
            <feFlood floodColor="#000" result="color" />
            <feComposite in="color" in2="SourceGraphic" operator="in" result="inner" />
            <feGaussianBlur in="inner" stdDeviation="14" result="blur" />
            <feOffset dx="6" dy="8" result="offset" />
            <feComposite in="SourceGraphic" in2="offset" operator="over" />
          </filter>

          {/* ── Clip path for video ── */}
          <clipPath id="tv-screen-clip">
            <path d={SCREEN_PATH} />
          </clipPath>

          {/* ── Gradients ── */}
          <linearGradient id="gWoodBase" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4d3520" />
            <stop offset="40%" stopColor="#3a2516" />
            <stop offset="100%" stopColor="#271809" />
          </linearGradient>

          <linearGradient id="gWoodGloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.13)" />
            <stop offset="18%" stopColor="rgba(255,255,255,0.04)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
          </linearGradient>

          <linearGradient id="gChrome" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e4e4e0" />
            <stop offset="22%" stopColor="#adadaa" />
            <stop offset="50%" stopColor="#868682" />
            <stop offset="78%" stopColor="#b6b6b2" />
            <stop offset="100%" stopColor="#d8d8d4" />
          </linearGradient>

          <linearGradient id="gAluminium" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d6d3ca" />
            <stop offset="35%" stopColor="#c0bdb4" />
            <stop offset="70%" stopColor="#b4b1a8" />
            <stop offset="100%" stopColor="#c8c5bc" />
          </linearGradient>

          <radialGradient id="gKnob" cx="30%" cy="25%" r="72%">
            <stop offset="0%" stopColor="#484848" />
            <stop offset="40%" stopColor="#202022" />
            <stop offset="100%" stopColor="#060606" />
          </radialGradient>

          <radialGradient id="gKnobSpec" cx="28%" cy="22%" r="48%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>

          <radialGradient id="gVolKnob" cx="30%" cy="25%" r="72%">
            <stop offset="0%" stopColor="#3e3e3e" />
            <stop offset="38%" stopColor="#181818" />
            <stop offset="100%" stopColor="#040404" />
          </radialGradient>

          <radialGradient id="gPushBtn" cx="35%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#2c2c2e" />
            <stop offset="100%" stopColor="#080808" />
          </radialGradient>

          {/* Screen overlays */}
          <radialGradient id="gPhosphor" cx="50%" cy="50%" r="62%">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="72%" stopColor="rgba(0,22,8,0.18)" />
            <stop offset="100%" stopColor="rgba(0,40,14,0.55)" />
          </radialGradient>

          <linearGradient id="gScreenReflect" x1="0%" y1="0%" x2="55%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
            <stop offset="28%" stopColor="rgba(255,255,255,0.04)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          {/* Scanline pattern */}
          <pattern id="tv-scanlines" x="0" y="0" width="1" height="4" patternUnits="userSpaceOnUse">
            <rect width="1" height="1" fill="rgba(0,0,0,0.18)" />
          </pattern>

          {/* Cabinet clip — prevents any child from overflowing the rounded wood body */}
          <clipPath id="tv-cabinet-clip">
            <rect x="10" y="10" width="968" height="626" rx="30" />
          </clipPath>

          {/* Feet */}
          <linearGradient id="gFeet" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2e1c0d" />
            <stop offset="100%" stopColor="#130b04" />
          </linearGradient>

          {/* Display green-phosphor tint */}
          <linearGradient id="gDisplayTint" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0,180,60,0.07)" />
            <stop offset="100%" stopColor="rgba(0,120,40,0.03)" />
          </linearGradient>
        </defs>

        {/* ════════════════════════════════════════════════════════════
            CABINET + ALL ELEMENTS (inside drop-shadow group)
        ════════════════════════════════════════════════════════════ */}
        <g filter="url(#tv-shadow)">

          {/* ── Rubber feet — outside cabinet clip so they sit below the body ── */}
          {[90, 870].map((x) => (
            <g key={x}>
              <rect x={x} y={626} width={56} height={26} rx={10} fill="url(#gFeet)" />
              <rect x={x} y={626} width={56} height={5} rx={4} fill="rgba(255,255,255,0.06)" />
            </g>
          ))}

          {/* ── Everything below is clipped to the cabinet shape ── */}
          <g clipPath="url(#tv-cabinet-clip)">

            {/* ── Main wood cabinet — base fill ── */}
            <rect x="10" y="10" width="968" height="626" rx="30" fill="url(#gWoodBase)" />
            {/* Wood grain texture overlay */}
            <rect x="10" y="10" width="968" height="626" rx="30" fill="url(#gWoodBase)" filter="url(#tv-wood-grain)" opacity="0.85" />
            {/* Gloss coat */}
            <rect x="10" y="10" width="968" height="626" rx="30" fill="url(#gWoodGloss)" />
            {/* Top-edge highlight */}
            <path d="M 40,10 L 948,10 Q 978,10 978,40" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
            {/* Bottom-edge shadow */}
            <path d="M 40,636 L 948,636 Q 978,636 978,606" fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="3" />

            {/* ── Chrome bezel frame around screen area ── */}
            <rect x="14" y="14" width="646" height="574" rx="26" fill="url(#gChrome)" />
            <rect x="14" y="14" width="646" height="574" rx="26" fill="none" stroke="#9a9a96" strokeWidth="1.5" />
            {/* Bevel highlight top-left */}
            <path d="M 40,14 L 620,14 Q 660,14 660,54" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
            {/* Bevel shadow bottom-right */}
            <path d="M 40,588 L 620,588 Q 660,588 660,548" fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="2" />

            {/* ── Deep black recess behind screen ── */}
            <rect x="22" y="20" width="622" height="554" rx="22" fill="#080808" />
            {/* Recess inner shadow */}
            <rect x="22" y="20" width="622" height="554" rx="22"
              fill="none" stroke="rgba(0,0,0,0.9)" strokeWidth="8" />

            {/* ── Screen surface ── */}
            <path d={SCREEN_PATH} fill="#040408" stroke="#181818" strokeWidth="2" />

            {/* ── Video content ── */}
            <g clipPath="url(#tv-screen-clip)">
              <foreignObject x="24" y="22" width="610" height="530">
                <div style={{
                  width: "100%", height: "100%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#000",
                }}>
                  {current?.videoUrl ? (
                    <video
                      ref={videoRef}
                      key={current.videoUrl}
                      src={current.videoUrl}
                      controls
                      autoPlay
                      muted
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  ) : (
                    <div style={{ color: "#4a5568", fontSize: 13, fontFamily: "monospace", letterSpacing: "0.15em" }}>
                      ░ NO SIGNAL ░
                    </div>
                  )}
                </div>
              </foreignObject>
            </g>

            {/* Screen bezel chrome inner rim (structural bezel, not a filter) */}
            <path d={SCREEN_PATH} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2.5" pointerEvents="none" />

            {/* ════════════════════════════════════════════════════════
              RIGHT CONTROL COLUMN
          ════════════════════════════════════════════════════════ */}

            {/* Aluminium control column background */}
            <rect x="668" y="14" width="306" height="614" rx="14" fill="url(#gAluminium)" />
            <rect x="668" y="14" width="306" height="614" rx="14" fill="none" stroke="#a2a09a" strokeWidth="1" />
            {/* Brushed texture */}
            <rect x="668" y="14" width="306" height="614" rx="14" fill="url(#gAluminium)" filter="url(#tv-brushed)" opacity="0.5" />
            {/* Column top highlight */}
            <path d="M 684,14 L 960,14 Q 974,14 974,28" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />

            {/* ── Brand nameplate ── */}
            <rect x="678" y="22" width="288" height="48" rx="8" fill="#1c1c18" />
            <rect x="678" y="22" width="288" height="48" rx="8" fill="none" stroke="#3a3a36" strokeWidth="1" />
            {/* Nameplate engraved inner bevel */}
            <rect x="680" y="24" width="284" height="44" rx="7" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text x="822" y="53" textAnchor="middle" fontSize="20" fontWeight="700"
              fontFamily="'Georgia', 'Times New Roman', serif"
              fill="#c8a040" letterSpacing="5">ADRISHTA</text>

            {/* ── Channel playlist display ── */}
            <rect x="678" y="80" width="288" height="250" rx="6" fill="#0e100e" />
            <rect x="678" y="80" width="288" height="250" rx="6" fill="none" stroke="#2e3028" strokeWidth="1.5" />
            {/* Display phosphor tint */}
            <rect x="678" y="80" width="288" height="250" rx="6" fill="url(#gDisplayTint)" />
            {/* Green scanlines on display */}
            {Array.from({ length: 15 }).map((_, i) => (
              <line key={i} x1="678" y1={92 + i * 16} x2="966" y2={92 + i * 16}
                stroke="rgba(0,160,60,0.06)" strokeWidth="1" />
            ))}
            {/* Display header bar */}
            <rect x="678" y="80" width="288" height="24" rx="6" fill="#161a14" />
            <text x="692" y="97" fontSize="9" fontFamily="'Courier New', monospace"
              fill="#546a48" letterSpacing="2">CH  PROGRAMME</text>

            {/* Channel list */}
            <foreignObject x="678" y="104" width="288" height="226">
              <div style={{ fontFamily: "'Courier New', monospace", height: "100%", overflowY: "auto" }}>
                {videos.map((v, i) => (
                  <div
                    key={v.name + i}
                    onPointerDown={() => selectChannel(i)}
                    style={{
                      padding: "7px 12px",
                      cursor: "pointer",
                      borderBottom: "1px solid rgba(0,120,50,0.08)",
                      color: i === selected ? "#ffcf4d" : "#2ecc71",
                      background: i === selected ? "rgba(255,207,77,0.07)" : "transparent",
                      display: "flex", alignItems: "center", gap: "8px",
                      fontSize: "13px",
                    }}
                  >
                    <span style={{ color: i === selected ? "#ff7040" : "#2a4a30", minWidth: "14px", fontSize: "10px" }}>
                      {i === selected ? "▶" : "·"}
                    </span>
                    <span style={{ color: i === selected ? "#ffcf4d" : "#608050", minWidth: "20px" }}>{i + 1}</span>
                    <span style={{ color: "#304428", fontSize: "11px" }}>│</span>
                    <span>{v.name}</span>
                  </div>
                ))}
              </div>
            </foreignObject>

            {/* ── Control plate (lighter aluminium) ── */}
            <rect x="678" y="340" width="288" height="274" rx="8" fill="#ccc9c0" />
            <rect x="678" y="340" width="288" height="274" rx="8" fill="none" stroke="#a0a09a" strokeWidth="1" />
            <rect x="678" y="340" width="288" height="8" rx="4" fill="rgba(255,255,255,0.32)" />
            {/* Plate brushed texture */}
            {Array.from({ length: 34 }).map((_, i) => (
              <line key={i} x1="678" y1={348 + i * 8} x2="966" y2={348 + i * 8}
                stroke="rgba(0,0,0,0.035)" strokeWidth="1" />
            ))}

            {/* ── Decorative push buttons (left column) ── */}
            {["PULL ON", "AFC", "BRIGHT", "COLOR", "CONT"].map((label, i) => (
              <g key={label}>
                {/* Backing recess */}
                <circle cx="704" cy={362 + i * 28} r="12" fill="rgba(0,0,0,0.12)" />
                {/* Button body */}
                <circle cx="704" cy={361 + i * 28} r="10" fill="url(#gPushBtn)" stroke="#161616" strokeWidth="1.5" />
                {/* Specular */}
                <circle cx="701" cy={358 + i * 28} r="4" fill="rgba(255,255,255,0.1)" />
                {/* Label */}
                <text x="720" y={365 + i * 28} fontSize="8.5" fontFamily="sans-serif"
                  fill="#5a5852" letterSpacing="0.6">{label}</text>
              </g>
            ))}

            {/* ── Channel dial section ── */}
            {/* Section label */}
            <text x={DIAL_CX} y={DIAL_CY + DIAL_R + 28} textAnchor="middle" fontSize="9" fontFamily="sans-serif"
              fill="#6a6862" letterSpacing="1.5">CHANNEL</text>

            {/* Dial backing ring (recessed plate) */}
            <circle cx={DIAL_CX} cy={DIAL_CY} r={DIAL_R + 16} fill="#b0aea6" stroke="#989590" strokeWidth="1" />
            <circle cx={DIAL_CX} cy={DIAL_CY} r={DIAL_R + 16} fill="rgba(0,0,0,0.08)" />
            {/* Dial face */}
            <circle cx={DIAL_CX} cy={DIAL_CY} r={DIAL_R} fill="url(#gKnob)" stroke="#111" strokeWidth="2.5" />

            {/* Dial tick marks (outside the draggable group — static) */}
            {dialTicks.map((a, i) => {
              const rad = ((a - 90) * Math.PI) / 180;
              const r1 = DIAL_R + 12, r2 = DIAL_R + 6;
              return (
                <line key={i}
                  x1={DIAL_CX + r1 * Math.cos(rad)} y1={DIAL_CY + r1 * Math.sin(rad)}
                  x2={DIAL_CX + r2 * Math.cos(rad)} y2={DIAL_CY + r2 * Math.sin(rad)}
                  stroke={i === selected ? "#ffcf4d" : "#707068"}
                  strokeWidth={i === selected ? 2.5 : 1.5} />
              );
            })}

            {/* Dial knob — interactive / draggable */}
            <g onPointerDown={handleDialDown} style={{ cursor: "grab" }}
              transform={`translate(${DIAL_CX},${DIAL_CY}) rotate(${dialAngle})`}>
              {/* Hit-target */}
              <circle r={DIAL_R} fill="transparent" />
              {/* Knurling ridges */}
              {Array.from({ length: 14 }).map((_, i) => {
                const a = (i / 14) * Math.PI * 2;
                return <line key={i}
                  x1={(DIAL_R - 2) * Math.cos(a)} y1={(DIAL_R - 2) * Math.sin(a)}
                  x2={(DIAL_R - 9) * Math.cos(a)} y2={(DIAL_R - 9) * Math.sin(a)}
                  stroke="rgba(0,0,0,0.35)" strokeWidth="2.5" />;
              })}
              {/* Pointer */}
              <line x1="0" y1="7" x2="0" y2={-(DIAL_R - 11)} stroke="#ffcf4d" strokeWidth="2.5" strokeLinecap="round" />
              {/* Center cap */}
              <circle r="9" fill="#222224" stroke="#505050" strokeWidth="1" />
              <circle r="3.5" fill="#ffcf4d" />
              {/* Specular highlight */}
              <circle cx="-15" cy="-14" r="11" fill="url(#gKnobSpec)" />
            </g>

            {/* ── Volume knob section ── */}
            <text x={VOL_CX} y={VOL_CY + VOL_R + 28} textAnchor="middle" fontSize="9"
              fontFamily="sans-serif" fill="#6a6862" letterSpacing="1.5">VOLUME</text>

            {/* Volume backing ring */}
            <circle cx={VOL_CX} cy={VOL_CY} r={VOL_R + 14} fill="#b0aea6" stroke="#989590" strokeWidth="1" />
            {/* Volume knob body */}
            <circle cx={VOL_CX} cy={VOL_CY} r={VOL_R} fill="url(#gVolKnob)" stroke="#161616" strokeWidth="2.5" />

            {/* Volume knob edge knurling (static, decorative) */}
            {Array.from({ length: 26 }).map((_, i) => {
              const a = (i / 26) * Math.PI * 2;
              const r1 = VOL_R + 2, r2 = VOL_R - 5;
              return <line key={i}
                x1={VOL_CX + r1 * Math.sin(a)} y1={VOL_CY - r1 * Math.cos(a)}
                x2={VOL_CX + r2 * Math.sin(a)} y2={VOL_CY - r2 * Math.cos(a)}
                stroke="rgba(0,0,0,0.28)" strokeWidth="1.8" />;
            })}

            {/* Volume control — interactive */}
            <g onPointerDown={handleVolDown} style={{ cursor: "grab" }}
              transform={`translate(${VOL_CX},${VOL_CY}) rotate(${volAngle})`}>
              <circle r={VOL_R} fill="transparent" />
              {/* Pointer line */}
              <line x1="0" y1="-6" x2="0" y2={-(VOL_R - 10)} stroke="#e8e8e6" strokeWidth="3.5" strokeLinecap="round" />
              {/* Specular */}
              <circle cx="-16" cy="-15" r="13" fill="url(#gKnobSpec)" />
            </g>



          </g>{/* end cabinet clip group */}
        </g>{/* end cabinet shadow group */}
      </svg>
    </div>
  );
}