import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { schedule, scheduleColors } from '../data/schedule';
import './TimelineSchedule.css';

function TimelineNode({ event, index }) {
  const ref = useRef(null);
  
  // Use inView to trigger animations when the card reaches the middle of the screen
  const isInView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  // For the entry animation, trigger when it enters the bottom of the viewport
  const isEntered = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  const color = scheduleColors[event.category] || '#22d3ee';
  const isLeft = index % 2 === 0;

  return (
    <div 
      ref={ref}
      className={`timeline-item ${isLeft ? 'left' : 'right'}`}
    >
      {/* The dot on the central line */}
      <motion.div 
        className="timeline-node"
        animate={{
          backgroundColor: isInView ? color : '#000',
          borderColor: isInView ? color : 'rgba(255,255,255,0.2)',
          scale: isInView ? 1.2 : 1,
          boxShadow: isInView ? `0 0 15px ${color}` : 'none'
        }}
        transition={{ duration: 0.3 }}
      />

      <div className="timeline-card-wrapper">
        {/* Connector line */}
        <motion.div 
          className="timeline-connector"
          animate={{
            backgroundColor: isInView ? color : 'rgba(255,255,255,0.1)',
            opacity: isInView ? 1 : 0.5
          }}
        />

        {/* The Card */}
        <motion.div 
          className={`timeline-card ${isInView ? 'active' : ''}`}
          style={{ '--glow-color': color }}
          initial={{ opacity: 0, y: 30, x: isLeft ? -10 : 10 }}
          animate={{ 
            opacity: isEntered ? 1 : 0, 
            y: isEntered ? 0 : 30,
            x: isEntered ? 0 : (isLeft ? -10 : 10)
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="timeline-card-inner">
            <span className="timeline-category-tag" style={{ color: color }}>
              {event.category}
            </span>
            <span className="timeline-time" style={{ color: color, fontFamily: 'var(--font-mono)' }}>{event.time}</span>
            <h3 className="timeline-title">{event.title}</h3>
            <span className="timeline-venue">{event.venue}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function TimelineSchedule({ schedDay, setSchedDay }) {
  const containerRef = useRef(null);
  
  // Track scroll progress of the entire timeline container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Smooth the scroll progress for the central glowing line
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="w-full">
      {/* Tabs */}
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '0.5rem', width: 'max-content', marginBottom: '4rem' }}>
        {[
          { key: 'day1', label: 'Day 1 · 12 Sept' },
          { key: 'day2', label: 'Day 2 · 13 Sept' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setSchedDay(tab.key)}
            style={{
              padding: '6px 16px',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
              transition: 'all 0.2s',
              background: schedDay === tab.key ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: schedDay === tab.key ? '#fff' : 'rgba(255,255,255,0.5)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="timeline-container" ref={containerRef}>
        
        {/* Central inactive line */}
        <div className="timeline-line-wrapper">
          {/* Animated active fill line */}
          <motion.div 
            className="timeline-line-fill"
            style={{ scaleY }}
          />
        </div>

        {/* Render Event Nodes */}
        {schedule[schedDay].map((event, i) => (
          <TimelineNode key={`${schedDay}-${i}`} event={event} index={i} />
        ))}
        
      </div>
    </div>
  );
}
