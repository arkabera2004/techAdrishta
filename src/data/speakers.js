// src/data/speakers.js
export const speakers = [
  {
    id: 'ananya',
    name: 'Ananya Rao',
    verified: true,
    role: 'Staff Engineer',
    company: 'Nebula Labs',
    bio: 'Staff Engineer at Nebula Labs, hackathon judge for 6 years.',
    image: '/speaker1.jpeg',
    experience: '9 years in distributed systems and open-source infra. Previously at Stripe and Cloudflare.',
    talk: 'Open-source as a growth strategy: from 0 to 12k GitHub stars in 18 months.',
    socials: { github: '#', linkedin: '#', twitter: '#' },
  },
  {
    id: 'dev',
    name: 'Dev Menon',
    verified: true,
    role: 'Founder',
    company: 'Cortexa',
    bio: 'Founder, Cortexa. Previously ML infra at a large search company.',
    image: '/speaker2.jpg',
    experience: '12 years in ML infrastructure. Built ranking systems serving 200M daily users.',
    talk: 'Scaling LLMs Without Losing Your Mind — running inference at 40M requests/day.',
    socials: { github: '#', linkedin: '#', twitter: '#' },
  },

];
