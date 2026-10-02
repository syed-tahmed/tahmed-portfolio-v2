/*
 * All website content lives here.
 * Images go in /public/images/ with the file names used below.
 * Resume goes in /public/resume.pdf
 */

export const site = {
  name: 'Syed Tahmed',
  fullName: 'Syed Tahmed Ahmed',
  role: 'Product Designer',
  email: 'syedtahmed369.uiux@gmail.com',
  location: 'Sylhet, Bangladesh',
  resume: '/resume.pdf',
}

/*
 * type 'route'   → goes to another page
 * type 'section' → scrolls to a section on the home page
 */
export const navLinks = [
  { label: 'Home', to: '/', type: 'route' },
  { label: 'Work', to: '/', sectionId: 'work', type: 'section' },
  { label: 'About', to: '/about', type: 'route' },
  { label: 'Contact', to: '/contact', type: 'route' },
]

export const socials = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/' },
  { label: 'Instagram', url: 'https://www.instagram.com/' },
  { label: 'Twitter', url: 'https://twitter.com/' },
]

export const hero = {
  greeting: 'Hello, there!',
  titleTop: 'I’m Tahmed',
  badge: 'Product',
  titleBottom: 'designer',
  intro:
    'I help forward-thinking brands build meaningful connections through clean, sophisticated, and user-centric design solutions.',
  image: '/images/profile-hero.png',
  imageAlt: 'Syed Tahmed Ahmed',
  stats: [
    { value: '4+', label: 'Years of experience' },
    { value: '50+', label: 'Completed projects' },
    { value: '45+', label: 'Happy clients' },
  ],
}

// Lines for the scroll-driven focus animation on the home page
export const focusLines = [
  'I believe great design is invisible — it just works, feels natural, and delights users.',
  'I deliver quality. Efficiently. With precision.',
  'Every decision backed by user needs and solid design thinking.',
  'Motion and type are my secret weapons for creating memorable experiences.',
]


// MY WORK section.
// caseStudyUrl opens your Behance / Dribbble case study in a new tab.
// Images go in /public/images/work/
export const workIntro = {
  badge: 'Selected work',
  label: 'MY WORK',
  viewAllUrl: 'https://www.behance.net/syedahmed51',
}

// caseStudyUrl opens the case study on Dribbble or Behance in a new tab.
// Images live in /public/images/work/
export const projects = [
  {
    title: 'Saas website for unique start-up brands',
    image: '/images/work/saas-website.jpg',
    caseStudyUrl: 'https://dribbble.com/shots/25407620-HR-Management-SaaS-Website-Design',
    tint: '#EFEDFD',
  },
  {
    title: 'Re-design admin dashboard to your brand',
    image: '/images/work/admin-dashboard.jpg',
    caseStudyUrl: 'https://dribbble.com/shots/24679806-Crypto-Wallet-Dashboard',
    tint: '#F1F0FB',
  },
  {
    title: 'Drivee website for ride sharing platfrom',
    image: '/images/work/drivee.jpg',
    caseStudyUrl: 'https://www.behance.net/gallery/169405303/UiUx-Case-Study-(Car-Bike-rent-and-sharing-platform)',
    tint: '#E4ECFC',
  },
  {
    title: 'Crypto Currency Mobile App Case Study',
    image: '/images/work/crypto-wallet.jpg',
    caseStudyUrl: 'https://www.behance.net/gallery/223575243/Crypto-Currency-Mobile-App-Case-Study',
    tint: '#FAEBF4',
  },
  {
    title: 'NFT mobile app design',
    image: '/images/work/nft-app.jpg',
    caseStudyUrl: 'https://dribbble.com/shots/26481813-Peter-NFT-Mobile-App',
    tint: '#E8F7EF',
  },
]


// My Services section. Images go in /public/images/
export const servicesIntro = {
  title: 'My Services',
  description:
    'Design, build and brand work for teams who want one person to take an idea all the way to launch.',
}

export const services = [
  {
    title: 'UI/UX Design',
    description: 'Creating intuitive, beautiful, and user-centered digital experiences.',
    icon: 'uiux',
    url: '/contact',
  },
  {
    title: 'Web Development',
    description: 'Building modern, responsive, and performant web applications.',
    icon: 'web',
    url: '/contact',
  },
  {
    title: 'Brand & AI',
    description:
      'Brand identity, marketing sites and pitch decks for products that need to look credible before anyone trusts them.',
    icon: 'brand',
    url: '/contact',
  },
]


// Sticky process timeline on the home page
export const process = {
  label: 'Process',
  title: 'How the process flows with clarity',
  description:
    'A clear and collaborative workflow that moves each project from first idea to polished final result.',
  steps: [
    {
      title: 'Discovery',
      icon: 'discovery',
      detail:
        'We start by understanding your goals, audience, brand needs, and the direction your project should take.',
    },
    {
      title: 'Strategy',
      icon: 'strategy',
      detail:
        'I define the structure, message, and creative approach before moving into the visual design stage.',
    },
    {
      title: 'Direction',
      icon: 'direction',
      detail:
        'A clear visual direction is shaped through mood, layout ideas, typography, and overall design language.',
    },
    {
      title: 'Design',
      icon: 'design',
      detail:
        'The main layouts, brand elements, and digital experiences are crafted with careful attention to detail.',
    },
    {
      title: 'Development',
      icon: 'development',
      detail:
        'Designs are turned into responsive, polished pages with smooth interactions and clean structure.',
    },
    {
      title: 'Delivery',
      icon: 'delivery',
      detail:
        'Final assets, pages, and guidelines are prepared clearly so everything is ready to launch.',
    },
  ],
}


// Collaboration call-to-action near the bottom of the home page
export const collaboration = {
  title: 'Let me know if you want to talk about a potential collaboration.',
  highlight: 'I am available for freelance work.',
  buttonLabel: 'Contact me',
  buttonUrl: '/contact',
  image: '/images/profile-collab.jpg',
  imageAlt: 'Syed Tahmed Ahmed',
}


// Collaboration call-to-action near the bottom of the home page


// Marquee strip and footer
export const marquee = {
  items: ['Available for Work', 'Get In Touch'],
  ringText: 'GET IN TOUCH * THANKS FOR SCROLLING * ',
}

export const footer = {
  prompt: 'Interested in working together?',
  pages: [
    { label: 'Home', to: '/' },
    { label: 'Work', to: '/', sectionId: 'work', type: 'section' },
    { label: 'About', to: '/about' },
  ],
  credit: 'Copyright \u00a9 Tahmed | Designed By Tahmed Ahmed',
}


// Contact page
export const contactPage = {
  backLabel: 'Back To Home',
  pageTitle: 'Contact Us',
  heading: 'Let us talk about your next project',
  subheading:
    'Have a brand, website or product idea in mind? Share a few details and I will get back to you soon.',
  projectTypes: ['Brand identity', 'Website design', 'Product / app design', 'Design + development'],
  budgets: ['Under $1k', '$1k to $5k', '$5k to $10k', '$10k and above'],
  card: {
    status: 'Available for selected projects',
    note: 'Currently accepting new projects',
    responseTime: 'Within 24 hours',
  },
}


// About page
export const about = {
  title: 'Good design starts with clear thinking.',
  image: '/images/profile-about.jpg',
  imageName: 'Syed Tahmed Ahmed',
  imageRole: 'Product Designer',
  paragraphs: [
    'I am an independent digital product designer creating refined identities, websites, and product experiences shaped by strategy, clarity, and thoughtful execution.',
    'Based in Sylhet, Bangladesh. Four years turning ambiguous briefs into products people actually use. Most recently I led the design team at Digital Way Business Ltd., setting direction for startups including floopyinn , Saltani , Gliranflax and ShiperAir. A platform redesign I owned start to finish grew active users 70% in two months.',
    'Systems over screens. Research before pixels. Partnership with engineering, so intent survives all the way to launch.',
  ],
  links: [
    { label: 'Dribbble', url: 'https://dribbble.com/Syed_tahmed99' },
    { label: 'Behance', url: 'https://www.behance.net/syedahmed51' },
    { label: 'Github', url: 'https://github.com/syed-tahmed' },
  ],
}

export const education = [
  {
    period: '2024 to 2027',
    title: 'Metropolitan University, Sylhet, Bangladesh',
    subtitle: 'Department of Computer Science and Engineering (CSE)',
    detail:
      'Studying toward a Bachelor of Science in Computer Science and Engineering, with coursework and independent projects focused on artificial intelligence and machine learning.',
  },
]

export const experience = [
  {
    period: '2025',
    title: 'Product Designer',
    subtitle: 'Digital Way Business Ltd',
    detail:
      'Partnered with stakeholders across project management, design, user research and product thinking to align product decisions with business objectives.',
  },
  {
    period: '2023 to 2024',
    title: 'UI/UX Designer',
    subtitle: 'Esolution Digital Agency',
    detail:
      'Collaborated with the founder and development team to identify and resolve UX problems, contributing to a 65 percent increase in active users within two months.',
  },
  {
    period: '2022 to 2024',
    title: 'UI Designer',
    subtitle: 'Floopyinn Digital Agency',
    detail: 'Designed user interfaces for digital products based on client and business requirements.',
  },
]

export const expertise = {
  title: 'My Expertise',
  intro:
    'A design practice grounded in research, paired with enough engineering to build the intelligent parts myself.',
  groups: [
    {
      title: 'Design & Research',
      note: 'End-to-end product design, from framing the problem with users to shipping the interface.',
      columns: [
        ['Interface Design', 'Visual Design', 'Interaction Design', 'Product Strategy'],
        ['Human-Centered Design', 'User Research', 'Prototyping', 'Usability Testing'],
      ],
    },
    {
      title: 'AI & Engineering',
      note: 'Building with models, not just designing around them.',
      columns: [['AI Programming With Python', 'Machine Learning', 'Deep Learning', 'GenAI & Agentic AI']],
    },
  ],
}

// Tools strip on the about page
export const tools = {
  title: 'Tools powering my work',
  items: [
    { label: 'Figma', logo: 'figma' },
    { label: 'Framer', logo: 'framer' },
    { label: 'Webflow', logo: 'webflow' },
    { label: 'Notion', logo: 'notion' },
    { label: 'Slack', logo: 'slack' },
    { label: 'Trello', logo: 'trello' },
    { label: 'Behance', logo: 'behance' },
    { label: 'Cursor', logo: 'cursor' },
    { label: 'Claude', logo: 'claude' },
  ],
}


// Answers the footer robot gives. It matches the visitor's words
// against each entry's keywords and replies with the first hit.
export const robotBrain = {
  greeting: 'Hi, I am Tahmed\u2019s little assistant. Ask me anything about him.',
  fallback:
    'I do not know that one yet. Try asking about his tools, his projects, availability, or where he is based.',
  suggestions: ['Which tool do you use most?', 'Your best project?', 'Available for work?'],
  answers: [
    {
      keywords: ['tool', 'software', 'figma', 'design with', 'use most'],
      reply: 'Figma, every day. Framer and Webflow for building, and Notion to keep it all organised.',
    },
    {
      keywords: ['project', 'best work', 'favourite', 'favorite', 'drivee', 'valuable'],
      reply:
        'Drivee, the car and bike sharing platform. It is the one he is most proud of. You can read the case study in the Work section.',
    },
    {
      keywords: ['available', 'hire', 'freelance', 'free', 'work with', 'open'],
      reply: 'Yes. He is available for freelance and full-time work right now.',
    },
    {
      keywords: ['where', 'based', 'location', 'live', 'country', 'remote'],
      reply: 'Sylhet, Bangladesh, and he works with clients remotely.',
    },
    {
      keywords: ['experience', 'how long', 'years'],
      reply: 'Four years of design work, most recently leading the design team at Digital Way Business Ltd.',
    },
    {
      keywords: ['skill', 'do you do', 'service', 'what can'],
      reply:
        'Product and UI/UX design, web development, and brand work. He also builds with AI, from Python to machine learning.',
    },
    {
      keywords: ['study', 'education', 'university', 'degree'],
      reply: 'Computer Science and Engineering at Metropolitan University, Sylhet, through to 2027.',
    },
    {
      keywords: ['contact', 'email', 'reach', 'talk', 'message'],
      reply: 'Use the Copy Email button just beside me, or head to the Contact page and send a message.',
    },
    {
      keywords: ['resume', 'cv'],
      reply: 'The Resume button is on the home page, in the circle beside his photo. One click and it downloads.',
    },
    {
      keywords: ['ai', 'machine learning', 'python'],
      reply: 'He builds with models rather than just designing around them: Python, machine learning, deep learning and agentic AI.',
    },
    {
      keywords: ['hello', 'hi', 'hey', 'who are you'],
      reply: 'Hello. I am the little robot in the corner. Ask me about Tahmed and I will do my best.',
    },
  ],
}
