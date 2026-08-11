import { BadgeCheck, Mic } from 'lucide-react';
import { events } from '../data/events';
import MusicPlayer from './MusicPlayer';

const Linkedin = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Instagram = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Twitter = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Github = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function SpeakerCard({ speaker }) {
  // Attempt to find the event this speaker is giving to show date/time
  const relatedEvent = events.find(e => e.speaker?.name === speaker.name);

  return (
    <div 
      className="relative w-full flex flex-col md:block md:aspect-[1600/872] bg-cover bg-center bg-[#0a0d14]"
      style={{ backgroundImage: "url('/speakerbackground.png')" }}
    >
      {/* Left side: MusicPlayer (hidden on mobile) */}
      <div className="hidden md:block absolute left-[4%] top-1/2 -translate-y-1/2 w-[17%] z-10">
        <MusicPlayer />
      </div>

      {/* Center text block */}
      <div className="relative md:absolute md:left-[24%] md:top-[16%] w-full md:w-[38%] z-10 p-8 md:p-0 order-1 text-left font-['Inter',sans-serif]">
        <p className="text-[0.75rem] md:text-sm font-bold tracking-[0.2em] uppercase text-[#d4af37] mb-2 opacity-90">
          Featured Speaker
        </p>
        <h3 className="flex items-center gap-3 text-4xl md:text-[3.5rem] font-bold text-white m-0 font-serif leading-tight">
          {speaker.name}
        </h3>
        <p className="mt-4 text-base md:text-xl font-medium text-slate-100 m-0">
          {speaker.role} at {speaker.company}
        </p>
        <p className="mt-2 text-sm md:text-lg text-slate-300 leading-relaxed font-serif italic">
          "{speaker.talk}"
        </p>
        <p className="mt-4 text-sm md:text-base text-slate-400 leading-relaxed max-w-lg line-clamp-3 md:line-clamp-none">
          {speaker.bio}
        </p>
        
        {/* Socials */}
        <div className="mt-8 flex items-center gap-3">
          {speaker.socials?.linkedin && (
            <a href={speaker.socials.linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-center w-11 h-11 rounded-full border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors">
              <Linkedin size={18} />
            </a>
          )}
          {speaker.socials?.instagram && (
            <a href={speaker.socials.instagram} target="_blank" rel="noreferrer" className="flex items-center justify-center w-11 h-11 rounded-full border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors">
              <Instagram size={18} />
            </a>
          )}
          {speaker.socials?.twitter && !speaker.socials?.instagram && (
            <a href={speaker.socials.twitter} target="_blank" rel="noreferrer" className="flex items-center justify-center w-11 h-11 rounded-full border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors">
              <Twitter size={18} />
            </a>
          )}
          {speaker.socials?.github && !speaker.socials?.instagram && (
            <a href={speaker.socials.github} target="_blank" rel="noreferrer" className="flex items-center justify-center w-11 h-11 rounded-full border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors">
              <Github size={18} />
            </a>
          )}
        </div>
      </div>

      {/* Podium + person stack */}
      <div className="relative md:absolute md:right-[6%] md:bottom-0 w-full h-[400px] md:w-[26%] md:h-[88%] order-2 mt-8 md:mt-0 overflow-visible pointer-events-none">
        {/* IMPORTANT: The bottom-[44%] offset below is tuned specifically to podium.png's proportions 
            so the speaker clears the solid desk panel. If podium.png is changed, this offset must be re-tuned. */}
        <img 
          src={speaker.image} 
          alt={speaker.name}
          className="absolute left-1/2 -translate-x-1/2 bottom-[44%] w-[60%] md:w-[98%] z-[1] drop-shadow-2xl object-contain pointer-events-auto"
        />
        <img 
          src="/podium.png" 
          alt="Podium"
          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[70%] md:w-full z-[2] drop-shadow-2xl object-contain pointer-events-auto"
        />
      </div>
    </div>
  );
}
