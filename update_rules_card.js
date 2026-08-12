const fs = require('fs');
const path = './src/components/SwitchRulesCard.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/export default function SwitchEventCard/, 'export default function SwitchRulesCard');
content = content.replace(/const EVENT = {[\s\S]*?};/, `const RULES = [
    [
        "Accommodation will be provided strictly on a first-come, first-served basis upon prior booking.",
        "Advance payment must be completed for accommodation.",
        "A screenshot or proof of payment must be shared with the overall coordinators."
    ],
    [
        "Participants must adhere to hostel rules, including: Curfew timings, Cleanliness, and Proper conduct.",
        "Any damage to hostel property will result in fines and/or disqualification."
    ],
    [
        "Participants must vacate the accommodation within the stipulated time after KAALRAV, i.e. latest by 12:00 pm of 9th March 2026."
    ]
];`);
content = content.replace(/const nextPage = \(\) => setPage\(\(p\) => Math\.min\(p \+ 1, 1\)\);/, 'const nextPage = () => setPage((p) => Math.min(p + 1, 2));');

const renderContent = `{RULES[page].map((p, i) => (
                                    <p key={i} className="leading-relaxed text-gray-300 w-full" style={{ fontSize: '2.1cqi', marginBottom: '1.6cqi' }}>
                                        - {p}
                                    </p>
                                ))}

                                <div style={{ position: 'absolute', bottom: '2.4cqi', width: '90%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {page > 0 ? (
                                        <div 
                                            className="text-white flex items-center cursor-pointer"
                                            onClick={() => press('left', prevPage)}
                                            style={{ gap: '0.8cqi' }}
                                        >
                                            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "1.4cqi", marginTop: "0.4cqi" }}>&lt;</span>
                                            <span className="animate-pulse" style={{ fontSize: '2.2cqi' }}>BACK</span>
                                        </div>
                                    ) : <div></div>}
                                    
                                    {page < 2 ? (
                                        <div 
                                            className="text-white flex items-center cursor-pointer"
                                            onClick={() => press('right', nextPage)}
                                            style={{ gap: '0.8cqi' }}
                                        >
                                            <span className="animate-pulse" style={{ fontSize: '2.2cqi' }}>NEXT</span>
                                            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "1.4cqi", marginTop: "0.4cqi" }}>&gt;</span>
                                        </div>
                                    ) : <div></div>}
                                </div>`;

content = content.replace(/\{page === 0 && \([\s\S]*?\}\)/, `{
                            <div className="w-full h-full flex flex-col justify-center items-start text-left animate-in fade-in duration-300" style={{ padding: '2.4cqi' }}>
                                <h2
                                    className="text-white tracking-wide"
                                    style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "2.4cqi", lineHeight: "1.6", marginBottom: '1.6cqi' }}
                                >
                                    Hostel Rules
                                </h2>
                                ${renderContent}
                            </div>
                        }`);
content = content.replace(/\{page === 1 && \([\s\S]*?\}\)/, ''); // Remove page 1 rendering

fs.writeFileSync(path, content, 'utf8');
