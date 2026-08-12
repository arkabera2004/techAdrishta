import { useEffect } from "react";
import { motion } from "framer-motion";

function useGoogleFonts() {
    useEffect(() => {
        const id = "fira-code-font";
        if (document.getElementById(id)) return;
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&display=swap";
        document.head.appendChild(link);
    }, []);
}

export default function TerminalAbout() {
  useGoogleFonts();

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 md:px-0" style={{ fontFamily: "'Fira Code', monospace" }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col md:flex-row bg-[#0b0b0e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Left vertical title */}
        <div className="md:w-[100px] bg-[#111115] border-b md:border-b-0 md:border-r border-white/5 flex items-center justify-center py-6 md:py-12">
          <h2 
            className="text-[#d87bff] text-2xl md:text-3xl font-bold tracking-[0.2em] uppercase max-md:rotate-0 md:[writing-mode:vertical-rl] md:rotate-180"
            style={{ 
              textShadow: '0 0 20px rgba(216, 123, 255, 0.4)'
            }}
          >
            About Adrishta
          </h2>
        </div>

        {/* Right content */}
        <div className="flex-1 p-6 md:p-12 text-[15px] md:text-[17px] leading-[1.8] text-[#a0a0ab]">
          
          {/* Mac window dots (optional terminal flavor) */}
          <div className="flex items-center gap-2 mb-8 opacity-40">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>

          <p className="mb-6">
            <span className="text-[#ff9e64] font-semibold">TECH ADRISHTA</span> started as a{' '}
            <span className="text-[#bb9af7]">dorm-room hackathon</span> and grew into the{' '}
            <span className="text-[#ff9e64]">largest independent tech fest</span> in the region. 
            <span className="text-[#7dcfff]"> Two days, four tracks</span>, and a single rule:{' '}
            <span className="text-[#f7768e] font-semibold">everything you present has to actually run.</span>
          </p>

          <p className="mb-8">
            Expect <span className="text-[#bb9af7]">engineers who ship at scale</span>,{' '}
            <span className="text-[#bb9af7]">founders mid-raise</span>, and{' '}
            <span className="text-[#bb9af7]">security researchers who break things on stage</span>. 
            <br className="hidden md:block" />
            <span className="text-[#565f89] italic">{'// No keynote fluff.'}</span>
          </p>

          {/* Tracks Code Block */}
          <div className="border border-white/10 rounded-xl bg-[#111115] p-5 md:p-6 overflow-x-auto shadow-inner text-sm md:text-[15px]">
            <div className="text-[#7dcfff] mb-4 font-semibold">export const <span className="text-[#7aa2f7]">tracks</span> = [</div>
            <ul className="pl-6 space-y-3 whitespace-nowrap">
              <li>
                <span className="text-[#89ddff]">{'{'}</span>{' '}
                <span className="text-[#f7768e]">name</span>: <span className="text-[#9ece6a]">'Build'</span>,{' '}
                <span className="text-[#f7768e]">desc</span>: <span className="text-[#9ece6a]">'36-hour hackathon with hardware and cloud credits.'</span>{' '}
                <span className="text-[#89ddff]">{'}'}</span>,
              </li>
              <li>
                <span className="text-[#89ddff]">{'{'}</span>{' '}
                <span className="text-[#f7768e]">name</span>: <span className="text-[#9ece6a]">'Learn'</span>,{' '}
                <span className="text-[#f7768e]">desc</span>: <span className="text-[#9ece6a]">'hands-on workshops capped at 60 seats.'</span>{' '}
                <span className="text-[#89ddff]">{'}'}</span>,
              </li>
              <li>
                <span className="text-[#89ddff]">{'{'}</span>{' '}
                <span className="text-[#f7768e]">name</span>: <span className="text-[#9ece6a]">'Listen'</span>,{' '}
                <span className="text-[#f7768e]">desc</span>: <span className="text-[#9ece6a]">'talks from people running production systems.'</span>{' '}
                <span className="text-[#89ddff]">{'}'}</span>,
              </li>
              <li>
                <span className="text-[#89ddff]">{'{'}</span>{' '}
                <span className="text-[#f7768e]">name</span>: <span className="text-[#9ece6a]">'Compete'</span>,{' '}
                <span className="text-[#f7768e]">desc</span>: <span className="text-[#9ece6a]">'CTF, pitch arena and the gaming bracket.'</span>{' '}
                <span className="text-[#89ddff]">{'}'}</span>
              </li>
            </ul>
            <div className="text-[#7dcfff] mt-4 font-semibold">];</div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
