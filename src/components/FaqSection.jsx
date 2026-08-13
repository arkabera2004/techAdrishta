import React, { useState } from 'react';
import { Ticket, User, Clock, MapPin, Users, Shield, MessageSquare, Lightbulb, Gamepad2, Plus, Minus } from 'lucide-react';

const ChamferBox = ({ children, className, style, innerClassName, innerStyle, borderColor = '#5c4331', borderSize = '2px', clipSize = '12px' }) => {
    const clipPath = `polygon(${clipSize} 0, calc(100% - ${clipSize}) 0, 100% ${clipSize}, 100% calc(100% - ${clipSize}), calc(100% - ${clipSize}) 100%, ${clipSize} 100%, 0 calc(100% - ${clipSize}), 0 ${clipSize})`;
    return (
        <div className={`relative flex flex-col ${className || ''}`} style={{ ...style, padding: borderSize, background: borderColor, clipPath }}>
            <div className={`flex flex-1 w-full h-full ${innerClassName || ''}`} style={{ ...innerStyle, background: innerStyle?.background || '#09090f', clipPath }}>
                {children}
            </div>
        </div>
    );
};

const faqData = [
    {
        id: 1,
        question: "HOW CAN I GET TICKETS?",
        answer: "Tickets will be available soon on our official website. Stay tuned for early bird offers and exciting discounts!",
        icon: Ticket,
        color: '#ef4444' // Red
    },
    {
        id: 2,
        question: "WHO CAN PARTICIPATE IN THE EVENTS?",
        answer: "Our events are open to everyone, whether you're a student, professional, or just an enthusiast. Some specific workshops may have prerequisites, which will be clearly mentioned.",
        icon: User,
        color: '#a855f7' // Purple
    },
    {
        id: 3,
        question: "WHAT ARE THE EVENT TIMINGS?",
        answer: "The events typically start at 9:00 AM and go on until 6:00 PM. Detailed schedules for individual activities will be shared closer to the date.",
        icon: Clock,
        color: '#3b82f6' // Blue
    },
    {
        id: 4,
        question: "WHERE IS THE VENUE LOCATED?",
        answer: "The main events will be held at the SMIT Campus in Sikkim. Detailed travel guides and maps will be provided to all registered participants.",
        icon: MapPin,
        color: '#22c55e' // Green
    },
    {
        id: 5,
        question: "WILL THERE BE ACCOMMODATION AVAILABLE?",
        answer: "Yes, we provide accommodation options within the campus for outstation participants on a first-come, first-served basis.",
        icon: Users,
        color: '#eab308' // Gold
    },
    {
        id: 6,
        question: "WHAT IS THE REFUND POLICY?",
        answer: "Tickets are non-refundable but can be transferred to another person up to 48 hours before the event starts. Please contact our support team to initiate a transfer.",
        icon: Shield,
        color: '#c084fc' // Light Purple
    },
    {
        id: 7,
        question: "HOW CAN I CONTACT THE TEAM?",
        answer: "You can reach out to us via the contact form on this website or email us directly at support@adrishta.com. We typically respond within 24 hours.",
        icon: MessageSquare,
        color: '#0ea5e9' // Light Blue
    }
];

export default function FaqSection({ isVisible, opacity, scrollContainerRef, isScrolling, blackFade, screenHeight, navbarHeight }) {
    const [expandedRow, setExpandedRow] = useState(1);

    const toggleRow = (id) => {
        setExpandedRow(prev => prev === id ? null : id);
    };

    const isBootMode = !isScrolling;
    const computedHeight = isBootMode && screenHeight && navbarHeight ? `${screenHeight - navbarHeight}px` : 'auto';

    return (
        <section
            className="w-full flex-shrink-0 flex flex-col items-center animate-in fade-in duration-300 z-10"
            style={{
                display: !isScrolling && !isVisible ? 'none' : 'flex',
                opacity: blackFade ? 0 : opacity,
                transition: 'opacity 0.25s ease',
                height: computedHeight,
                padding: '1.5cqi 2cqi 1cqi 2cqi'
            }}
        >
            {/* Main Outlined Container */}
            <div
                className="w-full h-full flex flex-col shadow-lg"
                style={{
                    borderRadius: '0.8cqi',
                    backgroundColor: '#060a14',
                    border: '1px solid #1e293b',
                    padding: '1.1cqi 1.5cqi 0.5cqi 1.5cqi',
                    position: 'relative',
                    overflowY: isBootMode ? 'auto' : 'visible'
                }}
            >
                <div className="w-full flex flex-col" style={{ gap: '1cqi' }}>

                    {/* Header Row (Sticky Navbar) */}
                    <div
                        className="flex justify-between items-start w-full mb-[1cqi]"
                        style={{
                            position: 'sticky',
                            top: '-1px',
                            zIndex: 10,
                            backgroundColor: '#060a14',
                            paddingTop: '0',
                            marginTop: '0',
                            paddingBottom: '0.5cqi',
                            borderBottom: '1px solid #1f2937',
                        }}
                    >
                        {/* Left: Titles */}
                        <div className="flex items-end" style={{ gap: '1cqi' }}>
                            <img src="/question_bubble.png" alt="FAQ" className="object-contain" style={{ width: '3cqi', height: '3cqi', imageRendering: 'pixelated' }} />
                            <div className="flex flex-col justify-end" style={{ paddingBottom: '0.2cqi' }}>
                                <h2 style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '2cqi', color: 'white', lineHeight: 1, margin: 0, paddingBottom: '0.3cqi' }}>
                                    FAQ
                                </h2>
                                <div className="flex items-center" style={{ gap: '0.8cqi' }}>
                                    <span style={{ fontFamily: '"VT323", monospace', fontSize: '1.4cqi', color: '#d1d5db' }}>
                                        Find answers to the most common questions.
                                    </span>
                                    {/* Small red sparkle */}
                                    <div style={{ width: '1cqi', height: '1cqi', backgroundColor: '#ef4444', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)' }} />
                                </div>
                            </div>
                        </div>

                        {/* Right: Callout Box */}
                        <ChamferBox
                            className="cursor-pointer hover:scale-[1.02] transition-transform"
                            borderColor="#ef4444"
                            borderSize="1px"
                            clipSize="0.8cqi"
                            innerClassName="flex items-center"
                            innerStyle={{ padding: '0.6cqi 0.8cqi', gap: '0.8cqi' }}
                            onClick={() => window.location.href = 'mailto:support@adrishta.com'}
                        >
                            <Lightbulb style={{ width: '1.8cqi', height: '1.8cqi' }} color="#eab308" strokeWidth={1.5} />
                            <div className="flex flex-col">
                                <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '0.65cqi', color: '#ef4444', marginBottom: '0.2cqi', lineHeight: '1.4' }}>
                                    CAN'T FIND YOUR ANSWER?
                                </span>
                                <span style={{ fontFamily: '"VT323", monospace', fontSize: '1.1cqi', color: '#d1d5db', lineHeight: '1.2' }}>
                                    Contact us and we'll<br />get back to you!
                                </span>
                            </div>
                            <span style={{ color: '#ef4444', marginLeft: '1cqi', fontSize: '2cqi' }}>→</span>
                        </ChamferBox>
                    </div>

                    {/* Decorative Sparkles between header and list */}
                    <div className="flex justify-end gap-12 pr-32 pb-0 opacity-70">
                        <div style={{ width: '4px', height: '4px', backgroundColor: '#ef4444' }} />
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', transform: 'translateY(-10px)' }} />
                        <div style={{ width: '6px', height: '6px', backgroundColor: '#ef4444', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', transform: 'translateY(15px)' }} />
                    </div>

                    {/* FAQ List */}
                    <div className="flex flex-col w-full" style={{ gap: '0.4cqi' }}>
                        {faqData.map((item) => {
                            const isActive = expandedRow === item.id;
                            const borderColor = isActive ? '#ef4444' : '#374151'; // Red when active, gray otherwise
                            const numColor = isActive ? '#ef4444' : '#d1d5db'; // Red when active, gray otherwise
                            const IconComponent = item.icon;

                            return (
                                <ChamferBox
                                    key={item.id}
                                    borderColor={borderColor}
                                    borderSize="1px"
                                    clipSize="8px"
                                    className="w-full cursor-pointer transition-all duration-300"
                                    innerClassName="flex flex-col w-full"
                                >
                                    {/* Clickable Row */}
                                    <div
                                        className="w-full grid items-center"
                                        style={{ gridTemplateColumns: '3cqi 3cqi 1fr 2.5cqi', gap: '1cqi', padding: '0.5cqi 1cqi' }}
                                        onClick={() => toggleRow(item.id)}
                                    >
                                        {/* Number */}
                                        <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '0.7cqi', color: numColor, paddingTop: '0.2cqi' }}>
                                            {item.id.toString().padStart(2, '0')}
                                        </span>

                                        {/* Icon Container */}
                                        <div className="flex items-center justify-center">
                                            <IconComponent size={24} style={{ width: '1.8cqi', height: '1.8cqi' }} color={isActive ? '#ef4444' : item.color} strokeWidth={1.5} />
                                        </div>

                                        {/* Question */}
                                        <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '0.75cqi', color: 'white', lineHeight: '1.2' }}>
                                            {item.question}
                                        </span>

                                        {/* Toggle */}
                                        <div className="flex items-center justify-end">
                                            {isActive ? (
                                                <Minus size={24} style={{ width: '1.8cqi', height: '1.8cqi' }} color="#ef4444" strokeWidth={2} />
                                            ) : (
                                                <Plus size={24} style={{ width: '1.8cqi', height: '1.8cqi' }} color="#ef4444" strokeWidth={2} />
                                            )}
                                        </div>
                                    </div>

                                    {/* Expanded Answer Content */}
                                    <div
                                        style={{
                                            height: isActive ? 'auto' : 0,
                                            opacity: isActive ? 1 : 0,
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease-in-out'
                                        }}
                                    >
                                        <div
                                            className="w-full grid"
                                            style={{ gridTemplateColumns: '3cqi 3cqi 1fr 2.5cqi', gap: '1cqi', padding: '0 1cqi 1cqi 1cqi' }}
                                        >
                                            <div /> {/* Empty col for Number */}
                                            <div /> {/* Empty col for Icon */}
                                            {/* Answer Text aligns perfectly with Question */}
                                            <div style={{ fontFamily: '"VT323", monospace', fontSize: '1.6cqi', color: '#9ca3af', lineHeight: '1.4' }}>
                                                {item.answer}
                                            </div>
                                            <div /> {/* Empty col for Toggle */}
                                        </div>
                                    </div>
                                </ChamferBox>
                            );
                        })}
                    </div>

                    {/* Footer Dotted Divider */}
                    <div className="flex items-center justify-center w-full gap-4 cursor-pointer hover:opacity-80 transition-opacity" style={{ marginTop: '1cqi' }}>
                        <div className="flex-1 h-[2px]" style={{ backgroundImage: 'linear-gradient(to right, #ef4444 20%, transparent 20%)', backgroundSize: '10px 100%' }} />
                        <div className="flex items-center gap-3">
                            {/* Star */}
                            <div style={{ width: '8px', height: '8px', backgroundColor: '#ef4444', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)' }} />
                            <span style={{ fontFamily: '"VT323", monospace', fontSize: '1.25rem', color: '#ef4444', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                STILL HAVE QUESTIONS?
                            </span>

                            <div className="border border-red-500 rounded p-1 mx-1" style={{ borderColor: '#ef4444' }}>
                                <Gamepad2 size={24} color="#ef4444" strokeWidth={1.5} />
                            </div>

                            <span style={{ fontFamily: '"VT323", monospace', fontSize: '1.25rem', color: '#ef4444', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                REACH OUT TO US!
                            </span>
                            {/* Star */}
                            <div style={{ width: '8px', height: '8px', backgroundColor: '#ef4444', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)' }} />
                        </div>
                        <div className="flex-1 h-[2px]" style={{ backgroundImage: 'linear-gradient(to right, #ef4444 20%, transparent 20%)', backgroundSize: '10px 100%' }} />
                    </div>

                </div>
            </div>
        </section>
    );
}
