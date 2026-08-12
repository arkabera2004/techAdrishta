// src/data/schedule.js
export const schedule = {
  day1: [
    { time: '09:00 AM', title: 'Neon Nights Hackathon',               venue: 'Main Arena, Block A',  category: 'hackathon'   },
    { time: '10:00 AM', title: 'Opening Keynote & Registration',        venue: 'Auditorium 1',         category: 'general'     },
    { time: '11:30 AM', title: 'Scaling LLMs Without Losing Your Mind', venue: 'Auditorium 1',         category: 'techtalk'    },
    { time: '01:00 PM', title: 'Lunch Break & Networking',              venue: 'Foyer',                category: 'break'       },
    { time: '02:00 PM', title: 'Web3 in Practice: Build a Wallet',      venue: 'Lab 204',              category: 'workshop'    },
    { time: '03:30 PM', title: 'Sustainable Tech: Building for the Planet', venue: 'Auditorium 1',    category: 'techtalk'    },
    { time: '05:00 PM', title: 'Hackathon Checkpoint #1',               venue: 'Main Arena, Block A',  category: 'hackathon'   },
    { time: '07:00 PM', title: 'Community Dinner & Mixer',              venue: 'Terrace',              category: 'break'       },
  ],
  day2: [
    { time: '09:00 AM', title: 'Morning Stand-up & Coffee',            venue: 'Foyer',                category: 'break'       },
    { time: '10:00 AM', title: 'Capture The Flag: Red Zone',           venue: 'Cyber Lab, Block B',   category: 'competition' },
    { time: '11:00 AM', title: 'Robotics Rapid Prototype Sprint',       venue: 'Lab 301',              category: 'workshop'    },
    { time: '12:30 PM', title: 'Hackathon Final Submissions',           venue: 'Main Arena, Block A',  category: 'hackathon'   },
    { time: '01:00 PM', title: 'Lunch Break',                           venue: 'Foyer',                category: 'break'       },
    { time: '02:00 PM', title: 'AI at the Edge: From Cloud to Device',  venue: 'Auditorium 1',         category: 'techtalk'    },
    { time: '03:30 PM', title: 'Hackathon Judging & Demos',             venue: 'Main Arena, Block A',  category: 'hackathon'   },
    { time: '04:00 PM', title: 'Startup Pitch Arena',                   venue: 'Main Arena, Block A',  category: 'competition' },
    { time: '06:00 PM', title: 'Awards Ceremony & Closing',             venue: 'Auditorium 1',         category: 'general'     },
  ],
};

export const scheduleColors = {
  hackathon:   '#C97A3D',
  techtalk:    '#8C2F39',
  workshop:    '#8A7A4E',
  competition: '#8A7A4E',
  general:     '#D4AF37',
  break:       '#9A9488',
};
