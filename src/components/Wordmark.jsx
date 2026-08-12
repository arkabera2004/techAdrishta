import React from 'react';

export default function Wordmark({ className = "", style = {}, width = "100%", height = "100%" }) {
  return (
    <svg
      className={className}
      style={{ ...style, display: 'block', overflow: 'visible' }}
      viewBox="0 0 500 80"
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="0"
        y="60"
        fontFamily="var(--font-heading)"
        fontSize="56"
        fontWeight="800"
        fill="var(--signature-gold)"
        letterSpacing="0.02em"
      >
        TECH ADRISHTA
      </text>
      
      {/* 
        Circuit node overlay over the last 'A'.
        This assumes 'Space Grotesk' at 56px size. 
        'TECH ADRISHT' is roughly 425px wide.
        The crossbar of 'A' is around y=44.
      */}
      <g transform="translate(444, 42)">
        {/* Background patch to hide the real crossbar (optional, but color matching the background helps) */}
        <rect x="-4" y="-4" width="28" height="8" fill="var(--bg)" />
        {/* Circuit trace */}
        <line x1="-2" y1="0" x2="18" y2="0" stroke="var(--signature-gold-light)" strokeWidth="3" />
        {/* Terminating node */}
        <circle cx="18" cy="0" r="4" fill="var(--signature-gold-light)" />
      </g>
    </svg>
  );
}
