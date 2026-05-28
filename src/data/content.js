// ============================================================
// ALL CONTENT - Bilingual (EN/FR)
// Edit this file to update any text on the site
// ============================================================

export const nav = {
  about:      { en: 'About Me',   fr: 'À Propos' },
  experience: { en: 'Experience', fr: 'Expérience' },
  skills:     { en: 'Skills',     fr: 'Compétences' },
  projects:   { en: 'Projects',   fr: 'Projets' },
  education:  { en: 'Education',  fr: 'Formation' },
  contact:    { en: 'Contact',    fr: 'Contact' },
};

export const hero = {
  subtitle: {
    en: 'Computer Engineering · Data Science · Communication',
    fr: 'Ingénierie Informatique · Data Science · Communication',
  },
  availability: {
    en: 'Available for hire · Worldwide',
    fr: 'Disponible · Monde entier',
  },
};

export const about = {
  paragraphs: [
    {
      en: 'I\'m a software engineer with a background in tech, finance, and marketing-communication. I studied computer engineering at Epitech for five years, spent time working at Fendi and LVMH, then completed a one-year data science and cybersecurity program at UCLA. These days I mostly build <strong>data management tools, automation systems, and internal solutions</strong>, aligning strategic development priorities with user and client journeys.',
      fr: 'Je suis ingénieur informatique avec un parcours entre tech, finances et marketing-communication. J\'ai étudié l\'ingénierie informatique à Epitech pendant cinq ans, travaillé chez Fendi et LVMH, puis suivi un programme d\'un an en data science et cybersécurité à UCLA. Aujourd\'hui, je construis principalement des <strong>outils de pilotage des data, des systèmes d\'automatisation et des solutions internes</strong>, en faisant coïncider priorités de développement stratégiques et parcours utilisateur/client.',
    },
    {
      en: 'My time at <strong>Fendi</strong> (LVMH) was split between the Communication team and IT. One day I\'d be setting up an influencer tracking system across 3 platforms, the next I\'d be helping coordinate a fashion show in Milan. I also participated in the global TikTok launch (7 countries, +150K subscribers) and helped with celebrity event logistics at the Palazzo della Civiltà.',
      fr: 'Mon passage chez <strong>Fendi</strong> (LVMH) se partageait entre l\'équipe Communication et l\'IT. Un jour, je mettais en place un système de suivi d\'influenceurs sur 3 plateformes, le lendemain j\'aidais à coordonner un défilé à Milan. J\'ai aussi participé au lancement mondial de TikTok (7 pays, +150K abonnés) et participé à la logistique d\'événements de célébrités au Palazzo della Civiltà.',
    },
    {
      en: 'I completed a Data Science and Cybersecurity certificate at <strong>UCLA</strong> (3.97 GPA), where I built an AI forecasting platform as my capstone. Before that, I spent 5 years at <strong>Epitech</strong> in a project-based organization: 135+ projects, 10 languages, from low-level C to full-stack web.',
      fr: 'J\'ai obtenu un certificat en Data Science et Cybersécurité à <strong>UCLA</strong> (GPA 3.97), où j\'ai construit une plateforme de prévision IA comme projet final. Avant cela, j\'ai passé 5 ans à <strong>Epitech</strong> dans une organisation par projets : 135+ projets, 10 langages, du C bas niveau au web full-stack.',
    },
    {
      en: 'I\'ve been passionate about hardware since childhood: soldering, building 3D printers and an <strong>InMoov humanoid robot</strong>. I also sail competitively, fly FPV drones, and build furniture. Currently working on <strong>General Commander</strong>, a personal project for AI-powered knowledge gathering and investment research.',
      fr: 'Je suis passionné de hardware depuis l\'enfance : soudure, fabrication d\'imprimante 3D et de <strong>robot humanoïde InMoov</strong>. Je fais aussi de la voile de compétition, du drone FPV et de la menuiserie. En ce moment, je travaille sur <strong>General Commander</strong>, un projet personnel d\'agents IA pour la veille et la recherche d\'investissement.',
    },
  ],
  stats: {
    industries: 3,
    experiences: 6,
    skills: '65+',
    projects: '135+',
  },
};

export const experiences = [
  {
    role:    { en: 'R&D / IS&T Engineer (Intern)', fr: 'Ingénieur R&D / IS&T (Stage)' },
    company: 'DLABS / SMODE',
    location:{ en: 'Paris', fr: 'Paris' },
    date:    '2025 - 2026',
    desc:    {
      en: 'Second developer at DLABS, the sister company of Smode (a live visual effects tool for TV sets). Built Python plugins for the After Effects and Cinema 4D pipeline, developed internal tools for the graphics team, and designed a structured NAS workflow balancing robustness with creative freedom. Deployed Zabbix monitoring on machines rebuilt from salvaged parts. Ran pipeline experiments with Airtable and QNAP/QFinder. Handled daily IT support for all graphists across studio and office.',
      fr: 'Second développeur chez DLABS, société s\u0153ur de Smode (outil d\'effets visuels live pour plateaux TV). Développement de plugins Python pour le pipeline After Effects et Cinema 4D, création d\'outils internes pour l\'équipe graphique, conception d\'un workflow NAS structuré alliant robustesse et liberté créative. Déploiement de monitoring Zabbix sur des machines reconstruites à partir de pièces récupérées. Expérimentations pipeline avec Airtable et QNAP/QFinder. Support IT quotidien pour tous les graphistes en studio et bureau.',
    },
    relatedSkills: ['python', 'linux', 'networking', 'systems', 'java', 'docker', 'aitools', 'git'],
  },
  {
    role:    { en: 'Financial Data Engineer (Intern)', fr: 'Ingénieur Data Finance (Stage)' },
    company: 'HAVAS SA',
    location:{ en: 'Paris', fr: 'Paris' },
    date:    '2025',
    desc:    {
      en: 'Embedded in the Financial Consolidation team for four months. Attended every cross-company meeting to keep three entities aligned on insurance obligations and reporting standards. Built an XHTML-based financial taxonomy engine that automated the Group\'s consolidation reporting. Translated the full annual financial report from French to English in-house, mastering bilingual finance terminology. That experience sparked a lasting interest in stock markets and investment.',
      fr: 'Intégré à l\'équipe de Consolidation Financière pendant quatre mois. Présent à toutes les réunions inter-sociétés pour maintenir la clarté entre 3 entités sur les obligations liées aux assurances et les normes de reporting. Construction d\'un moteur de taxonomie financière en XHTML automatisant le reporting de consolidation du Groupe. Traduction intégrale du rapport financier annuel du français vers l\'anglais en interne, et maîtrise de la terminologie financière. Cette expérience a éveillé un intérêt durable pour les marchés et l\'investissement.',
    },
    relatedSkills: ['python', 'datasci', 'excel', 'typescript', 'javascript', 'comm', 'teamwork'],
  },
  {
    role:    { en: 'Operations & Volunteer Team Lead', fr: 'Responsable Opérations & Équipes Bénévoles' },
    company: 'PARALYMPIC GAMES PARIS',
    location:{ en: 'Place de la Concorde', fr: 'Place de la Concorde' },
    date:    '2024',
    desc:    {
      en: 'Part of a five-person core team managing 2,500 volunteers at the Place de la Concorde, one of the Games\' highest-profile venues. Handled volunteer intake, numbering, problem resolution, and accommodation. Made it possible for operational teams to locate and deploy their assigned groups in real time.',
      fr: 'Membre d\'une équipe de 5 personnes pour gérer 2 500 bénévoles Place de la Concorde, l\'un des sites phares des Jeux. Gestion de l\'accueil, numérotation, résolution de problèmes et hébergement des bénévoles. Mise en place d\'un système permettant aux équipes opérationnelles de localiser et déployer rapidement leurs groupes assignés en temps réel.',
    },
    relatedSkills: ['events', 'teamwork', 'comm'],
  },
  {
    role:    { en: 'Event Production Coordinator', fr: 'Coordinateur Production Événementielle' },
    company: 'Y-SARL / LVMH',
    location:{ en: 'Paris', fr: 'Paris' },
    date:    '2023',
    desc:    {
      en: 'Evaluated and benchmarked 10+ premium venues against technical, commercial, and logistical criteria. Delivered organizational briefs. Managed vendor coordination and on-site production.',
      fr: 'Évaluation et benchmark de 10+ lieux premium selon des critères techniques, commerciaux et logistiques. Rédaction de briefs organisationnels, coordination fournisseurs et production sur site.',
    },
    relatedSkills: ['events', 'luxury', 'comm', 'teamwork', 'ppt'],
  },
  {
    role:    { en: 'Assistant to Chief Communication Officer / IS&T', fr: 'Assistant de la Directrice de la Communication Monde / IS&T' },
    company: 'FENDI',
    location:{ en: 'Rome, Italy', fr: 'Rome, Italie' },
    date:    '2022',
    desc:    {
      en: 'Dual role between Communication and IT, reporting to Cristiana Monfardini (CCO). Built an automated influencer analytics system tracking 100+ creators across 3 platforms, with daily reports used in CEO meetings. Helped coordinate Fendi\'s global TikTok launch across 7+ countries, growing the channel by +150K subscribers. Assisted on celebrity campaigns (Dybala, Benzema) for 25,000+ attendees with videomapping on the Palazzo della Civiltà. Audited Java and HTML/CSS codebases and worked with IS&T Milan on MLOps data pipelines. Also helped coordinate fashion shows across Milan, Paris, and New York.',
      fr: 'Rôle double entre Communication et IT, rattaché à Cristiana Monfardini (Directrice de la Communication Monde). Construction d\'un système analytique automatisé suivant 100+ créateurs sur 3 plateformes, avec des rapports quotidiens utilisés en comité de direction. Contribution au lancement mondial TikTok de Fendi dans 7+ pays, développant le canal de +150K abonnés. Assistance sur les campagnes célébrités (Dybala, Benzema) devant 25 000+ spectateurs avec vidéomapping sur le Palazzo della Civiltà. Audit de codebases Java et HTML/CSS, collaboration avec l\'IS&T Milan sur les pipelines MLOps. Aide à la coordination des défilés à Milan, Paris et New York.',
    },
    relatedSkills: ['python', 'java', 'mlops', 'datasci', 'social', 'comm', 'luxury', 'fashion', 'celebrity', 'videomapping', 'events', 'emplify', 'radarly', 'analytics', 'excel'],
  },
  {
    role:    { en: 'Metaverse Experience Room Coordinator', fr: 'Coordinateur Experience Room Métavers' },
    company: 'LVMH',
    location:{ en: 'Paris', fr: 'Paris' },
    date:    '2022',
    desc:    {
      en: 'Short-term engagement within an LVMH innovation think tank exploring metaverse applications for luxury. Managed the Experience Room, an immersive showcase space demonstrating Web3, VR, and spatial computing possibilities to C-level stakeholders and Maison directors.',
      fr: 'Mission courte au sein d\'un think tank innovation LVMH explorant les applications métavers pour le luxe. Gestion de l\'Experience Room, espace immersif démontrant les possibilités Web3, VR et spatial computing aux dirigeants C-level et directeurs de Maisons.',
    },
    relatedSkills: ['luxury', 'comm', 'events'],
  },
];

export const skills = {
  // Cluster definitions for region rendering
  clusters: {
    engineering: { label: 'ENGINEERING', color: { h: 220, s: 50, l: 58 } },
    data:        { label: 'DATA & AI',   color: { h: 200, s: 55, l: 55 } },
    web:         { label: 'WEB & APPS',  color: { h: 270, s: 45, l: 60 } },
    security:    { label: 'SECURITY',    color: { h: 0,   s: 50, l: 55 } },
    tools:       { label: 'TOOLS',       color: { h: 160, s: 45, l: 50 } },
    business:    { label: 'BUSINESS',    color: { h: 42,  s: 55, l: 55 } },
    luxury:      { label: 'LUXURY',      color: { h: 320, s: 30, l: 60 } },
  },
  nodes: [
    // === ENGINEERING (core Epitech skills) ===
    { id: 'c',         label: 'C',            cluster: 'engineering', size: 1.0,  sub: '60 projects', description: { en: 'Core language across 5 years at Epitech. Memory management, system calls, and UNIX internals', fr: 'Langage principal sur 5 ans à Epitech. Gestion mémoire, appels système et internals UNIX' } },
    { id: 'cpp',       label: 'C++',          cluster: 'engineering', size: 0.85, sub: '20 projects', description: { en: 'OOP, templates, and game engine development with SFML', fr: 'POO, templates et développement moteur de jeu avec SFML' } },
    { id: 'systems',   label: 'Systems',      cluster: 'engineering', size: 0.75, sub: 'Shell, Threads', description: { en: 'Built custom shells, process schedulers, and thread pools from scratch', fr: 'Création de shells, ordonnanceurs de processus et pools de threads en partant de zéro' } },
    { id: 'networking', label: 'Networking',    cluster: 'engineering', size: 0.6,  sub: 'Sockets, TCP', description: { en: 'Socket programming, TCP/UDP protocols, client-server architectures', fr: 'Programmation socket, protocoles TCP/UDP, architectures client-serveur' } },
    { id: 'threads',   label: 'Concurrency',  cluster: 'engineering', size: 0.6,  sub: 'Mutex, Semaphores', description: { en: 'Multi-threaded programming with synchronization primitives', fr: 'Programmation multi-thread avec primitives de synchronisation' } },
    { id: 'asm',       label: 'Assembly',      cluster: 'engineering', size: 0.5,  sub: 'x86', description: { en: 'x86 assembly for low-level optimization and system understanding', fr: 'Assembleur x86 pour optimisation bas niveau et compréhension système' } },
    { id: 'haskell',   label: 'Haskell',       cluster: 'engineering', size: 0.55, sub: '6 projects', description: { en: 'Functional programming. Interpreters, parsers, and lambda calculus', fr: 'Programmation fonctionnelle. Interpréteurs, parseurs et lambda calcul' } },
    { id: 'gamedev',   label: 'Game Dev',      cluster: 'engineering', size: 0.6,  sub: 'CSFML, R-Type', description: { en: 'Multiplayer game engine (R-Type) with ECS architecture', fr: 'Moteur de jeu multijoueur (R-Type) avec architecture ECS' } },

    // === DATA & AI ===
    { id: 'python',    label: 'Python',        cluster: 'data', size: 0.95, sub: '15+ projects', description: { en: 'Primary language for data pipelines, ML models, and automation scripts', fr: 'Langage principal pour pipelines data, modèles ML et scripts d\'automatisation' } },
    { id: 'datasci',   label: 'Data Science',  cluster: 'data', size: 0.85, sub: 'UCLA Certificate', description: { en: 'UCLA top of class (3.97 GPA). Statistical modeling, feature engineering, and EDA', fr: 'Major de promo UCLA (GPA 3.97). Modélisation statistique, feature engineering et EDA' } },
    { id: 'ai',        label: 'AI / ML',       cluster: 'data', size: 0.8,  sub: 'NeuralProphet', description: { en: 'Time-series forecasting, neural networks, and predictive modeling', fr: 'Prévision de séries temporelles, réseaux de neurones et modélisation prédictive' } },
    { id: 'mlops',     label: 'MLOps',         cluster: 'data', size: 0.6,  sub: 'Fendi Pipeline', description: { en: 'Pipeline audit and optimization at Fendi IS&T Milan', fr: 'Audit et optimisation de pipelines chez Fendi IS&T Milan' } },
    { id: 'pandas',    label: 'Pandas',        cluster: 'data', size: 0.6,  sub: 'NumPy, SciPy', description: { en: 'Data wrangling and numerical computation across every data project', fr: 'Manipulation de données et calcul numérique sur tous les projets data' } },
    { id: 'sklearn',   label: 'scikit-learn',  cluster: 'data', size: 0.6,  sub: 'Regression, Classification', description: { en: 'Supervised and unsupervised learning. Model selection and evaluation', fr: 'Apprentissage supervisé et non-supervisé. Sélection et évaluation de modèles' } },
    { id: 'stats',     label: 'Statistics',    cluster: 'data', size: 0.65, sub: '19 math projects', description: { en: '19 math-intensive Epitech projects covering probability, linear algebra, and calculus', fr: '19 projets mathématiques Epitech couvrant probabilités, algèbre linéaire et calcul' } },
    { id: 'dataviz',   label: 'Data Viz',      cluster: 'data', size: 0.6,  sub: 'Bokeh, Tableau', description: { en: 'Interactive dashboards and visual storytelling for stakeholders', fr: 'Dashboards interactifs et storytelling visuel pour les stakeholders' } },
    { id: 'hadoop',    label: 'Big Data',      cluster: 'data', size: 0.5,  sub: 'Hadoop', description: { en: 'Distributed data processing fundamentals', fr: 'Fondamentaux du traitement de données distribué' } },

    // === WEB & APPS ===
    { id: 'java',      label: 'Java',          cluster: 'web', size: 0.55, sub: 'Fendi Code Review', description: { en: 'Code auditing and review for Fendi\'s internal systems', fr: 'Audit et revue de code pour les systèmes internes Fendi' } },
    { id: 'typescript', label: 'TypeScript',    cluster: 'web', size: 0.7,  sub: 'Next.js, React', description: { en: 'Full-stack typed development. Havas financial engine and portfolio projects', fr: 'Développement full-stack typé. Moteur financier Havas et projets portfolio' } },
    { id: 'javascript', label: 'JavaScript',    cluster: 'web', size: 0.65, sub: 'Express, Node', description: { en: 'Vanilla JS, Node.js backends, and Canvas 2D/WebGL visuals', fr: 'Vanilla JS, backends Node.js et visuels Canvas 2D/WebGL' } },
    { id: 'react',     label: 'React',         cluster: 'web', size: 0.6,  sub: 'Next.js', description: { en: 'Component-driven UIs with Next.js SSR/SSG', fr: 'Interfaces composant-driven avec SSR/SSG Next.js' } },
    { id: 'kotlin',    label: 'Kotlin',        cluster: 'web', size: 0.5,  sub: 'EIP Mobile', description: { en: 'Android mobile development for Epitech Innovation Project', fr: 'Développement mobile Android pour le Projet d\'Innovation Epitech' } },
    { id: 'swift',     label: 'Swift',         cluster: 'web', size: 0.5,  sub: 'iOS', description: { en: 'iOS application development', fr: 'Développement d\'applications iOS' } },

    // === SECURITY ===
    { id: 'cybersec',  label: 'Cybersecurity', cluster: 'security', size: 0.75, sub: 'UCLA + Epitech', description: { en: 'UCLA certificate and Epitech security projects. Threat analysis and secure architecture', fr: 'Certificat UCLA et projets sécurité Epitech. Analyse de menaces et architecture sécurisée' } },
    { id: 'offensive', label: 'Offensive',     cluster: 'security', size: 0.55, sub: 'Pentesting', description: { en: 'Penetration testing methodology and vulnerability assessment', fr: 'Méthodologie de test d\'intrusion et évaluation de vulnérabilités' } },
    { id: 'defensive', label: 'Defensive',     cluster: 'security', size: 0.55, sub: 'Hardening', description: { en: 'System hardening, monitoring, and incident response', fr: 'Durcissement système, monitoring et réponse aux incidents' } },
    { id: 'crypto',    label: 'Cryptography',  cluster: 'security', size: 0.55, sub: 'Algorithms', description: { en: 'Encryption algorithms, key exchange, and digital signatures', fr: 'Algorithmes de chiffrement, échange de clés et signatures numériques' } },

    // === TOOLS & DEVOPS ===
    { id: 'git',       label: 'Git',           cluster: 'tools', size: 0.7,  sub: 'GitHub', description: { en: 'Version control across 135+ projects. Branching strategies and code review', fr: 'Contrôle de version sur 135+ projets. Stratégies de branches et revue de code' } },
    { id: 'docker',    label: 'Docker',        cluster: 'tools', size: 0.6,  sub: 'Containers', description: { en: 'Containerized deployments and development environments', fr: 'Déploiements et environnements de développement conteneurisés' } },
    { id: 'linux',     label: 'Linux',         cluster: 'tools', size: 0.7,  sub: 'Terminal', description: { en: 'Daily driver for 5+ years. Scripting, sysadmin, and server management', fr: 'Usage quotidien depuis 5+ ans. Scripting, sysadmin et gestion serveur' } },
    { id: 'vscode',    label: 'VS Code',       cluster: 'tools', size: 0.55, description: { en: 'Primary editor with custom extensions and debugging workflows', fr: 'Éditeur principal avec extensions custom et workflows de débogage' } },
    { id: 'cicd',      label: 'CI/CD',         cluster: 'tools', size: 0.5,  sub: 'GitHub Actions', description: { en: 'Automated testing and deployment pipelines', fr: 'Pipelines de tests et déploiement automatisés' } },
    { id: 'aitools',   label: 'AI Tools',      cluster: 'tools', size: 0.6,  sub: 'Claude, ChatGPT', description: { en: 'AI-augmented development. Prompt engineering and code generation', fr: 'Développement augmenté par IA. Prompt engineering et génération de code' } },

    // === BUSINESS & COMMUNICATION ===
    { id: 'excel',     label: 'Excel',         cluster: 'business', size: 0.6,  sub: 'Advanced', description: { en: 'Advanced formulas, pivot tables, and financial modeling', fr: 'Formules avancées, tableaux croisés dynamiques et modélisation financière' } },
    { id: 'powerbi',   label: 'Power BI',      cluster: 'business', size: 0.55, sub: 'Dashboards', description: { en: 'Business intelligence dashboards and data modeling', fr: 'Dashboards de business intelligence et modélisation de données' } },
    { id: 'tableau',   label: 'Tableau',       cluster: 'business', size: 0.55, sub: 'Visualization', description: { en: 'Data visualization and interactive reporting', fr: 'Visualisation de données et reporting interactif' } },
    { id: 'figma',     label: 'Figma',         cluster: 'business', size: 0.5, description: { en: 'UI/UX prototyping and design systems', fr: 'Prototypage UI/UX et design systems' } },
    { id: 'ppt',       label: 'PowerPoint',    cluster: 'business', size: 0.5, description: { en: 'Executive presentations and pitch decks', fr: 'Présentations exécutives et pitch decks' } },
    { id: 'analytics', label: 'Google Analytics', cluster: 'business', size: 0.5, sub: 'Console', description: { en: 'Web analytics, traffic analysis, and conversion tracking', fr: 'Analytique web, analyse de trafic et suivi de conversion' } },
    { id: 'crm',       label: 'CRM',           cluster: 'business', size: 0.5, description: { en: 'Customer relationship management and data workflows', fr: 'Gestion de la relation client et workflows de données' } },
    { id: 'comm',      label: 'Communication', cluster: 'business', size: 0.75, sub: 'Fendi, LVMH', description: { en: 'Bridging tech and business. Executive reporting and stakeholder management', fr: 'Pont entre tech et business. Reporting exécutif et gestion des stakeholders' } },
    { id: 'events',    label: 'Events',        cluster: 'business', size: 0.6,  sub: 'Olympics, LVMH', description: { en: 'Large-scale event production. Paralympics, LVMH, and fashion shows', fr: 'Production événementielle grande échelle. Paralympiques, LVMH et défilés' } },
    { id: 'teamwork',  label: 'Team Work',     cluster: 'business', size: 0.6, description: { en: 'Cross-functional team leadership and agile collaboration', fr: 'Leadership d\'équipes transversales et collaboration agile' } },
    { id: 'emplify',   label: 'Emplify',       cluster: 'business', size: 0.5,  sub: 'LVMH Analytics', description: { en: 'LVMH\'s internal analytics platform for brand performance', fr: 'Plateforme analytique interne LVMH pour la performance des marques' } },
    { id: 'radarly',   label: 'Radarly',       cluster: 'business', size: 0.5,  sub: 'Sentiment Analysis', description: { en: 'Social listening and sentiment analysis for luxury brands', fr: 'Écoute sociale et analyse de sentiment pour marques de luxe' } },
    { id: 'social',    label: 'Social Media',  cluster: 'business', size: 0.6,  sub: 'IG, TikTok, LinkedIn', description: { en: 'Platform strategy. Grew Fendi TikTok to 150K+ subscribers globally', fr: 'Stratégie plateforme. Croissance TikTok Fendi à 150K+ abonnés mondial' } },

    // === LUXURY ===
    { id: 'luxury',    label: 'Luxury',        cluster: 'luxury', size: 0.75, sub: 'LVMH, Fendi', description: { en: 'Deep understanding of luxury codes, from Fendi\'s Palazzo to LVMH innovation labs', fr: 'Compréhension profonde des codes du luxe, du Palazzo Fendi aux labs innovation LVMH' } },
    { id: 'fashion',   label: 'Fashion Shows', cluster: 'luxury', size: 0.65, sub: 'Milan, Paris, NYC', description: { en: 'End-to-end show coordination across 3 fashion capitals', fr: 'Coordination de défilés de bout en bout dans 3 capitales de la mode' } },
    { id: 'celebrity', label: 'Celebrity Mgmt', cluster: 'luxury', size: 0.6, sub: 'Benzema, Dybala', description: { en: 'VIP campaign coordination. 25,000+ attendees at Palazzo events', fr: 'Coordination de campagnes VIP. 25 000+ spectateurs aux événements Palazzo' } },
    { id: 'videomapping', label: 'Videomapping', cluster: 'luxury', size: 0.5, sub: 'Palazzo 25K', description: { en: 'Architectural projection mapping on the Palazzo della Civiltà', fr: 'Mapping vidéo architectural sur le Palazzo della Civiltà' } },
  ],
  edges: [
    // Engineering internal
    ['c', 'cpp'], ['c', 'systems'], ['c', 'asm'], ['c', 'networking'], ['c', 'gamedev'],
    ['cpp', 'systems'], ['cpp', 'gamedev'], ['cpp', 'threads'],
    ['systems', 'networking'], ['systems', 'threads'], ['systems', 'linux'],
    ['haskell', 'systems'],
    // Data internal
    ['python', 'datasci'], ['python', 'ai'], ['python', 'pandas'], ['python', 'sklearn'],
    ['datasci', 'ai'], ['datasci', 'stats'], ['datasci', 'dataviz'],
    ['pandas', 'sklearn'], ['pandas', 'stats'],
    ['ai', 'sklearn'], ['ai', 'mlops'], ['dataviz', 'tableau'], ['dataviz', 'powerbi'],
    ['hadoop', 'datasci'], ['mlops', 'datasci'],
    // Web internal
    ['typescript', 'react'], ['typescript', 'javascript'],
    ['javascript', 'react'], ['kotlin', 'swift'],
    ['java', 'typescript'],
    // Security internal
    ['cybersec', 'offensive'], ['cybersec', 'defensive'], ['cybersec', 'crypto'],
    // Tools internal
    ['git', 'cicd'], ['docker', 'cicd'], ['docker', 'linux'],
    ['vscode', 'git'], ['linux', 'vscode'],
    // Business internal
    ['excel', 'powerbi'], ['excel', 'tableau'], ['excel', 'analytics'],
    ['comm', 'events'], ['comm', 'teamwork'], ['comm', 'ppt'],
    ['comm', 'social'], ['social', 'emplify'], ['social', 'radarly'],
    ['emplify', 'radarly'], ['analytics', 'social'],
    ['figma', 'ppt'], ['analytics', 'crm'],
    // Luxury internal
    ['luxury', 'fashion'], ['luxury', 'comm'], ['luxury', 'celebrity'],
    ['celebrity', 'comm'], ['celebrity', 'social'], ['celebrity', 'videomapping'],
    ['fashion', 'events'], ['videomapping', 'events'],
    // Cross-cluster bridges
    ['python', 'typescript'], ['python', 'cybersec'],
    ['datasci', 'cybersec'], ['datasci', 'comm'],
    ['ai', 'aitools'], ['dataviz', 'excel'],
    ['systems', 'cybersec'], ['systems', 'docker'],
    ['comm', 'luxury'], ['events', 'luxury'],
    ['fashion', 'comm'], ['analytics', 'datasci'],
    ['social', 'dataviz'], ['emplify', 'dataviz'],
    ['gamedev', 'ai'], ['mlops', 'java'], ['mlops', 'docker'], ['mlops', 'python'],
    ['python', 'dataviz'], ['cybersec', 'networking'], ['cybersec', 'linux'],
    ['docker', 'git'], ['typescript', 'figma'], ['kotlin', 'java'],
  ],
};

export const projects = [
  {
    id: 'vision',
    title:  { en: 'Vision — Nodal Financial Analysis', fr: 'Vision — Analyse Financière Nodale' },
    desc:   {
      en: 'Composable node-graph tool for portfolio analysis. 23 typed node types, 14 demo pipelines. Backtest 4 strategies against buy & hold, stress test under 4 historical regimes (GFC 2008, COVID, Rates 2022, Dotcom 2000), project political scenarios, aggregate real news into a weighted sentiment that feeds a verdict. Each metric (Sharpe, Sortino, Calmar, VaR, CVaR, beta, alpha, HHI, PCR) ships with benchmarks, plain-language interpretations and formulas. Pure vanilla web, no framework.',
      fr: 'Outil composable d\'analyse de portefeuille en graphe nodal. 23 types de nodes typés, 14 pipelines de démo. Backtest de 4 stratégies vs buy & hold, stress test sous 4 régimes historiques (GFC 2008, COVID, Rates 2022, Dotcom 2000), projection de scénarios politiques, agrégation de l\'actu en sentiment pondéré qui alimente un verdict. Chaque métrique (Sharpe, Sortino, Calmar, VaR, CVaR, beta, alpha, HHI, PCR) livrée avec benchmarks, interprétations en clair et formule. Vanilla web pur, sans framework.',
    },
    tags: ['Vanilla JS', 'SVG Canvas', 'Chart.js', 'DAG', 'Finance', 'Composable'],
    link: '/vision/',
    linkLabel: { en: 'Try it live', fr: 'Essayer en live' },
    featured: true,
    relatedSkills: ['datasci', 'ai', 'python', 'stats', 'dataviz'],
    context: { en: 'POC · Live in browser', fr: 'POC · Live dans le navigateur' },
  },
  {
    id: 'finance-analysis',
    title:  { en: 'S&P 500 Analysis & AI Forecasting', fr: 'Analyse S&P 500 & Prévision IA' },
    desc:   {
      en: 'Built a full-stack financial analysis platform as my UCLA capstone. The 6-step automated pipeline handles data ingestion from Yahoo Finance, exploratory analysis, statistical modeling (stepwise regression, best subsets), and AI forecasting via NeuralProphet. Interactive dashboards with Panel and Bokeh make real-time market trends accessible at a glance.',
      fr: 'Construction d\'une plateforme d\'analyse financière full-stack comme projet final UCLA. Le pipeline automatisé en 6 étapes couvre l\'ingestion de données depuis Yahoo Finance, l\'analyse exploratoire, la modélisation statistique (régression pas à pas, meilleurs sous-ensembles) et la prévision IA via NeuralProphet. Les dashboards interactifs Panel et Bokeh rendent les tendances de marché accessibles en un coup d\'oeil.',
    },
    tags: ['Python', 'NeuralProphet', 'scikit-learn', 'Pandas', 'Bokeh', 'Panel'],
    link: null,
    featured: true,
    relatedSkills: ['datasci', 'ai', 'python', 'pandas', 'sklearn', 'dataviz', 'stats'],
    context: { en: 'UCLA Capstone · Top of Class', fr: 'Projet Final UCLA · Major de Promo' },
  },
  {
    id: 'influencer-dashboard',
    title:  { en: 'Influencer Analytics Engine', fr: 'Moteur Analytique Influenceurs' },
    desc:   {
      en: 'Built an automated daily reporting system tracking 100+ influencers across Instagram, TikTok, and Twitter. Combined data from LVMH tools (Emplify, Radarly) to surface engagement metrics, sentiment shifts, and emerging trends. Reports went directly to the CEO, delivered through educational materials I developed to support strategic decision-making.',
      fr: 'Construction d\'un système de reporting quotidien automatisé suivant 100+ influenceurs sur Instagram, TikTok et Twitter. Croisement de données depuis les outils LVMH (Emplify, Radarly) pour faire remonter les métriques d\'engagement, les évolutions de sentiment et les tendances émergentes. Les rapports étaient transmis directement au CEO, sur des supports pédagogiques que j\'ai développés pour l\'aide à la décision stratégique.',
    },
    tags: ['Emplify', 'Radarly', 'Google Analytics', 'Excel', 'Data Analysis'],
    link: null,
    relatedSkills: ['datasci', 'social', 'emplify', 'radarly', 'comm', 'analytics', 'excel'],
    context: { en: 'Fendi · Delivered to CEO', fr: 'Fendi · Livré au CEO' },
  },
  {
    id: 'tiktok-initiative',
    title:  { en: 'Global TikTok Launch · +150K Subscribers', fr: 'Lancement TikTok Mondial · +150K Abonnés' },
    desc:   {
      en: 'Led Fendi\'s global TikTok launch, coordinating 100+ international influencers across 7+ countries. Managed the full cycle: cross-platform tracking, influencer fittings, content synchronization, and billing. Grew the channel from zero to +150K subscribers. Trained at TikTok\'s luxury department in Milan on platform strategy and algorithm optimization.',
      fr: 'Pilotage du lancement mondial TikTok de Fendi, en coordonnant 100+ influenceurs internationaux dans 7+ pays. Gestion du cycle complet : suivi cross-plateforme, fittings influenceurs, synchronisation de contenu et facturation. Développement du canal de zéro à +150K abonnés. Formation au département luxe de TikTok à Milan sur la stratégie plateforme et l\'optimisation algorithmique.',
    },
    tags: ['TikTok', 'Social Media', 'Analytics', 'Project Management'],
    link: null,
    relatedSkills: ['social', 'comm', 'analytics', 'luxury', 'teamwork'],
    context: { en: 'Fendi · 7+ Countries', fr: 'Fendi · 7+ Pays' },
  },
  {
    id: 'fendi-celebrity-campaigns',
    title:  { en: 'Celebrity Campaigns · Dybala & Benzema', fr: 'Campagnes Célébrités · Dybala & Benzema' },
    desc:   {
      en: 'Helped coordinate two celebrity partnerships. Paulo Dybala / AS Roma: assisted with the arrival event in Rome, supporting logistics, PR, media analysis, and photo direction for 25,000 attendees with videomapping on the Palazzo della Civiltà. Karim Benzema / Fendi Faster: helped run the sneaker ambassadorship, including Instagram coordination, competitor benchmarking, and ROI tracking.',
      fr: 'Contribution à la coordination de deux partenariats célébrités. Paulo Dybala / AS Roma : assistance sur l\'événement d\'arrivée à Rome, support logistique, RP, analyse d\'impact médiatique et direction photo pour 25 000 spectateurs avec vidéomapping sur le Palazzo della Civiltà. Karim Benzema / Fendi Faster : participation à la gestion de l\'ambassadorship sneaker, coordination Instagram, benchmark concurrentiel et suivi ROI.',
    },
    tags: ['PR', 'Event Management', 'Videomapping', 'Media Analysis', 'Social Media'],
    link: null,
    relatedSkills: ['celebrity', 'comm', 'events', 'social', 'videomapping', 'luxury'],
    context: { en: 'Fendi · Communication', fr: 'Fendi · Communication' },
  },
  {
    id: 'fendi-fashion-shows',
    title:  { en: 'Fashion Shows · Milan, Paris, New York', fr: 'Défilés · Milan, Paris, New York' },
    desc:   {
      en: 'Coordinated Fendi fashion shows across 3 cities, managing catwalk logistics, VIP guest lists, and media accreditation. Remotely directed the Fendi x Marc Jacobs show in New York while simultaneously launching the Fendi Home store. Curated a private exposition and gala at Villa Medici for select international press.',
      fr: 'Coordination des défilés Fendi dans 3 villes, gestion de la logistique catwalk, listes VIP et accréditations média. Direction à distance du défilé Fendi x Marc Jacobs à New York avec lancement simultané du Fendi Home store. Curation d\'une exposition privée et gala à la Villa Médicis pour la presse internationale.',
    },
    tags: ['Fashion Shows', 'Event Management', 'Logistics', 'PR'],
    link: null,
    relatedSkills: ['events', 'fashion', 'luxury', 'comm', 'teamwork'],
    context: { en: 'Fendi · 3 Cities', fr: 'Fendi · 3 Villes' },
  },
  {
    id: 'fendi-mlops',
    title:  { en: 'MLOps Pipeline & Code Audit', fr: 'Pipeline MLOps & Audit de Code' },
    desc:   {
      en: 'Worked alongside IS&T Milan on Fendi\'s MLOps data pipeline, contributing to the full flow from raw data ingestion through cleaning, transformation, and insight extraction. Audited Java, HTML, and CSS codebases for the Heaven internal platform with the Qwentes development team.',
      fr: 'Collaboration avec l\'IS&T Milan sur le pipeline MLOps de Fendi, contribuant au flux complet de l\'ingestion de données brutes au nettoyage, transformation et extraction d\'insights. Audit des codebases Java, HTML et CSS de la plateforme interne Heaven avec l\'équipe Qwentes.',
    },
    tags: ['MLOps', 'Java', 'HTML/CSS', 'Data Pipeline', 'Code Review'],
    link: null,
    relatedSkills: ['mlops', 'datasci', 'ai', 'java', 'python'],
    context: { en: 'Fendi IS&T · Milan', fr: 'Fendi IS&T · Milan' },
  },
  {
    id: 'fendidi-app',
    title:  { en: 'FENDIDI App · Asian Market Launch', fr: 'App FENDIDI · Lancement Marché Asiatique' },
    desc:   {
      en: 'Led concept development and UX strategy for the FENDIDI mascot app targeting Asian markets. Coordinated cross-functional teams (design, dev, marketing) from production through go-to-market launch.',
      fr: 'Pilotage du développement concept et de la stratégie UX pour l\'app mascotte FENDIDI ciblant les marchés asiatiques. Coordination d\'équipes cross-fonctionnelles (design, dev, marketing) de la production au go-to-market.',
    },
    tags: ['App Launch', 'UX Strategy', 'Asian Market', 'Cross-functional'],
    link: null,
    relatedSkills: ['comm', 'fashion', 'luxury', 'figma', 'social'],
    context: { en: 'Fendi · Go-to-Market', fr: 'Fendi · Go-to-Market' },
  },
  {
    id: 'taxonomy-engine',
    title:  { en: 'Financial Taxonomy Engine', fr: 'Moteur de Taxonomie Financière' },
    desc:   {
      en: 'Built a proof of concept for an XHTML-based financial taxonomy engine, demonstrating the approach to stakeholders before it was greenlit. The final tool automated Havas Group\'s consolidation reporting, replacing a manual workflow used across the entire finance department.',
      fr: 'Construction d\'un proof of concept pour un moteur de taxonomie financière en XHTML, démontrant l\'approche aux décideurs avant validation. L\'outil final a automatisé le reporting de consolidation du Groupe Havas, remplaçant un workflow manuel utilisé par l\'ensemble de la direction financière.',
    },
    tags: ['XHTML', 'Finance', 'Automation', 'Data Processing'],
    link: null,
    relatedSkills: ['typescript', 'javascript', 'python', 'excel', 'datasci'],
    context: { en: 'Havas SA · Group Finance', fr: 'Havas SA · Finance Groupe' },
  },
  {
    id: 'security-plan',
    title:  { en: 'Infrastructure Security Plan', fr: 'Plan de Sécurité Infrastructure' },
    desc:   {
      en: 'Designed a full infrastructure security plan for a multi-site organization. Identified critical functions (database access, email, mobile VPN), mapped the baseline network topology, performed threat analysis across physical, network, and application layers, and defined security controls including firewall rules, IDS deployment, encryption policies, and incident response procedures.',
      fr: 'Conception d\'un plan de sécurité infrastructure complet pour une organisation multi-sites. Identification des fonctions critiques (accès base de données, email, VPN mobile), cartographie de la topologie réseau de base, analyse des menaces sur les couches physique, réseau et application, et définition des contrôles de sécurité incluant règles firewall, déploiement IDS, politiques de chiffrement et procédures de réponse aux incidents.',
    },
    tags: ['Threat Analysis', 'Network Security', 'IDS', 'VPN', 'Firewall', 'Risk Assessment'],
    link: null,
    relatedSkills: ['cybersec', 'defensive', 'networking', 'linux'],
    context: { en: 'UCLA Cybersecurity Final', fr: 'Projet Final Cybersécurité UCLA' },
  },
  {
    id: 'portfolio',
    title:  { en: 'This Portfolio', fr: 'Ce Portfolio' },
    desc:   {
      en: 'Designed and built this portfolio featuring a Clifford Strange Attractor background (Canvas 2D), a 3D WebGL skills constellation (Three.js), and a dual dark/light theme system. Bento-grid dashboard layout with full bilingual EN/FR support and GSAP scroll animations. No UI frameworks, just vanilla JavaScript.',
      fr: 'Conception et construction de ce portfolio avec un attracteur étrange de Clifford en arrière-plan (Canvas 2D), une constellation de compétences 3D WebGL (Three.js) et un système dual-thème sombre/clair. Layout dashboard bento-grid avec support bilingue complet EN/FR et animations GSAP. Aucun framework UI, uniquement du JavaScript vanilla.',
    },
    tags: ['Three.js', 'WebGL', 'Vanilla JS', 'Canvas 2D', 'GSAP'],
    link: null,
    relatedSkills: ['javascript', 'typescript', 'react', 'git', 'figma'],
  },
];

export const personal = {
  interests: [
    { icon: '\u{1F527}', label: { en: 'Electronics & Robotics', fr: 'Électronique & Robotique' }, detail: { en: 'Soldering iron at 9, Arduino, 3D printer at 12, InMoov humanoid robot', fr: 'Fer à souder à 9 ans, Arduino, imprimante 3D à 12 ans, robot InMoov' } },
    { icon: '\u{1F5A5}', label: { en: 'Custom PC Building', fr: 'PC Sur Mesure' }, detail: { en: 'Crypto mining rigs and gaming builds', fr: 'Rigs mining crypto et builds gaming' } },
    { icon: '\u26F5', label: { en: 'Competitive Sailing', fr: 'Voile de Compétition' }, detail: { en: 'CVEC, Laser discipline', fr: 'CVEC, discipline Laser' } },
    { icon: '\u{1F681}', label: { en: 'Drones & FPV', fr: 'Drones & FPV' }, detail: { en: 'Aerial photography to freestyle FPV', fr: 'Photo aérienne au freestyle FPV' } },
    { icon: '\u{1FAB5}', label: { en: 'Woodworking', fr: 'Travail du Bois' }, detail: { en: 'Building a workshop in my basement', fr: 'Construction d\'un atelier au sous-sol' } },
    { icon: '\u{1F3B8}', label: { en: 'Guitar & Electronics', fr: 'Guitare & Électronique' }, detail: { en: 'Building custom tone modification circuits', fr: 'Construction de circuits de modification tonale' } },
  ],
  currentProject: {
    name: 'General Commander',
    desc: { en: 'AI-powered automation for knowledge gathering, investment strategy, and portfolio analysis. Driven by AI agents that create tasks from emails and platforms.', fr: 'Automatisation IA pour la veille, la stratégie d\'investissement et l\'analyse de portefeuille. Piloté par des agents IA créant des tâches depuis emails et plateformes.' },
    tags: ['AI Agents', 'Python', 'Finance'],
  },
};

export const education = [
  {
    school: 'Epitech Paris - Berlin',
    degree: { en: 'Master\'s Degree in Computer Engineering (5th Year)', fr: 'Master en Ingénierie Informatique (5ème année)' },
    years:  '2021 - 2026',
    detail: {
      en: 'Dual-campus program (Paris & Berlin). Completed 135+ projects across systems programming, software engineering, and infrastructure. Peer-learning methodology producing industry-ready engineers.',
      fr: 'Programme bi-campus (Paris & Berlin). 135+ projets réalisés en programmation système, génie logiciel et infrastructure. Méthodologie pair-à-pair formant des ingénieurs opérationnels dès la sortie.',
    },
    techStack: ['C', 'C++', 'Python', 'Linux', 'Docker', 'Git'],
  },
  {
    school: 'UCLA Extension',
    degree: { en: 'Certificate in Data Science with Concentration in Cybersecurity', fr: 'Certificat en Data Science avec spécialisation en Cybersécurité' },
    years:  { en: 'Oct 2024 - June 2025', fr: 'Oct 2024 - Juin 2025' },
    detail: {
      en: '9-course program covering the full data science and cybersecurity pipeline, from data ingestion and EDA through ML modeling to offensive and defensive security labs. Graduated top of class.',
      fr: 'Programme de 9 cours couvrant le pipeline complet data science et cybersécurité, de l\'ingestion de données et EDA à la modélisation ML jusqu\'aux labs sécurité offensive et défensive. Major de promotion.',
    },
    techStack: ['Python', 'Pandas', 'NumPy', 'scikit-learn', 'NeuralProphet', 'statsmodels', 'Bokeh'],
    highlight: {
      gpa: '3.97',
      distinction: { en: 'Earned with Distinction', fr: 'Obtenu avec Distinction' },
      achievement: { en: 'Top of class', fr: 'Major de promotion' },
      featuredProjects: ['finance-analysis', 'security-plan'],
      streams: [
        {
          name: { en: 'Data Science', fr: 'Data Science' },
          courses: [
            'Introduction to Data Science',
            'Exploratory Data Analysis and Visualization',
            'Big Data Management',
          ],
        },
        {
          name: { en: 'Cybersecurity', fr: 'Cybersécurité' },
          courses: [
            'Fundamentals of Cybersecurity',
            'Information Systems Infrastructure Security',
            'Network, OS and Database Security',
            'Cybersecurity Lab (Defensive Tools)',
            'Cybersecurity Lab (Offensive Tools)',
          ],
        },
        {
          name: { en: 'Machine Learning', fr: 'Machine Learning' },
          courses: ['Machine Learning Using Python'],
        },
      ],
    },
  },
  {
    school: 'Hattemer',
    degree: { en: 'French Scientific Baccalaureate (Baccalauréat S)', fr: 'Baccalauréat Scientifique (Bac S)' },
    years:  '',
  },
];

export const newsAI = {
  modes: {
    aidev: {
      label: { en: 'AI DEVELOPMENT', fr: 'DÉV. IA' },
      news: [
        {
          source: 'Anthropic / Futurism',
          link: 'https://futurism.com/artificial-intelligence/anthropic-step-change-new-model-claude-mythos',
          title: { en: 'Anthropic Accidentally Leaks Claude Mythos: A "Step Change" in AI Performance', fr: 'Anthropic laisse fuiter Claude Mythos par accident : un "saut qualitatif" en performance IA' },
          summary: { en: 'A security lapse in Anthropic\'s public-facing CMS accidentally revealed their next model: Claude Mythos, described internally as a "step change" in AI proficiencies and "the most capable we\'ve built to date." The leak also exposed a new tier called Capybara, whose relationship to existing tiers (Opus, Sonnet, Haiku) remains unclear. Anthropic\'s revenue hit $14B run-rate, growing 10x annually for three consecutive years. Claude Code alone generates over $2.5B in run-rate revenue and now authors 4% of all public GitHub commits.', fr: 'Une faille de sécurité dans le CMS public d\'Anthropic a accidentellement révélé leur prochain modèle : Claude Mythos, décrit en interne comme un "saut qualitatif" en compétences IA et "le plus capable jamais construit." La fuite a aussi exposé un nouveau tier appelé Capybara, dont la relation avec les tiers existants (Opus, Sonnet, Haiku) reste floue. Le chiffre d\'affaires d\'Anthropic atteint 14 Mds$ en run-rate, avec une croissance de 10x annuelle pendant trois ans consécutifs. Claude Code seul génère plus de 2.5 Mds$ en run-rate et est l\'auteur de 4% de tous les commits publics GitHub.' },
          date: 'Mar 2026',
        },
        {
          source: 'TechCrunch',
          link: 'https://techcrunch.com/2026/03/05/openai-launches-gpt-5-4-with-pro-and-thinking-versions/',
          title: { en: 'OpenAI Launches GPT-5.4 with 1M Token Context and 33% Fewer Errors', fr: 'OpenAI lance GPT-5.4 avec 1M de tokens de contexte et 33% d\'erreurs en moins' },
          summary: { en: 'OpenAI released GPT-5.4 in three variants: standard, Thinking (reasoning), and Pro (high performance). The API supports a 1 million token context window, the largest from OpenAI. GPT-5.4 is 33% less likely to make errors on individual claims vs GPT-5.2, scored 83% on GDPval (knowledge work benchmark), and set records on OSWorld and WebArena for computer use. A new Tool Search system lets models look up tool definitions on demand instead of loading all upfront, cutting costs. Mini and Nano variants followed on March 17 for edge and mobile use cases.', fr: 'OpenAI a lancé GPT-5.4 en trois variantes : standard, Thinking (raisonnement) et Pro (haute performance). L\'API supporte une fenêtre de contexte d\'1 million de tokens, la plus grande d\'OpenAI. GPT-5.4 fait 33% moins d\'erreurs par assertion vs GPT-5.2, obtient 83% sur GDPval (benchmark de travail intellectuel) et bat les records sur OSWorld et WebArena pour l\'utilisation d\'ordinateur. Un nouveau système Tool Search permet aux modèles de chercher les définitions d\'outils à la demande au lieu de tout charger, réduisant les coûts. Les variantes Mini et Nano ont suivi le 17 mars pour l\'edge et le mobile.' },
          date: 'Mar 2026',
        },
        {
          source: 'The New Stack / Linux Foundation',
          link: 'https://thenewstack.io/model-context-protocol-roadmap-2026/',
          title: { en: 'MCP Hits 97M Monthly SDK Downloads, but Perplexity Walks Away', fr: 'MCP atteint 97M de téléchargements SDK/mois, mais Perplexity s\'en éloigne' },
          summary: { en: 'The Model Context Protocol, originally built by Anthropic and donated to the Linux Foundation\'s Agentic AI Foundation in December 2025, now logs 97 million monthly SDK downloads across Python and TypeScript. OpenAI, Google, AWS, Microsoft, and Cloudflare are all supporting members. But cracks are showing: at the Ask 2026 conference, Perplexity CTO Denis Yarats announced they are moving away from MCP internally, citing that a full MCP setup consumed 143K of 200K context tokens (72%). The 2026 roadmap focuses on transport scalability, SSO-integrated auth, and gateway behavior for enterprise readiness.', fr: 'Le Model Context Protocol, créé par Anthropic et donné à l\'Agentic AI Foundation de la Linux Foundation en décembre 2025, enregistre désormais 97 millions de téléchargements SDK mensuels en Python et TypeScript. OpenAI, Google, AWS, Microsoft et Cloudflare sont tous membres. Mais des fissures apparaissent : à la conférence Ask 2026, le CTO de Perplexity Denis Yarats a annoncé qu\'ils abandonnent MCP en interne, citant qu\'un setup MCP complet consommait 143K sur 200K tokens de contexte (72%). La roadmap 2026 se concentre sur la scalabilité du transport, l\'auth SSO et le comportement gateway pour l\'entreprise.' },
          date: 'Mar 2026',
        },
        {
          source: 'LangChain',
          link: 'https://www.langchain.com/state-of-agent-engineering',
          title: { en: 'State of AI Agents: 57% in Production, Quality Is the #1 Killer', fr: 'État des agents IA : 57% en production, la qualité est le problème #1' },
          summary: { en: '57.3% of surveyed organizations now have agents running in production, up from 51% last year. But fewer than one in four have successfully scaled them. The biggest barrier shifted: 32% cite quality as the top blocker (not cost). 89% have implemented observability for their agents, but only 52% run systematic evals. The field is going through its microservices moment: single all-purpose agents are being replaced by orchestrated teams of specialized agents. Gartner predicts 40% of enterprise apps will incorporate task-specific agents by end of 2026.', fr: '57.3% des organisations interrogées ont maintenant des agents en production, contre 51% l\'an dernier. Mais moins d\'une sur quatre les a scalés avec succès. La barrière principale a changé : 32% citent la qualité comme premier bloqueur (pas le coût). 89% ont implémenté l\'observabilité pour leurs agents, mais seulement 52% font des évals systématiques. Le domaine vit son moment microservices : les agents tout-en-un sont remplacés par des équipes orchestrées d\'agents spécialisés. Gartner prédit que 40% des apps entreprise intégreront des agents spécialisés fin 2026.' },
          date: 'Mar 2026',
        },
      ],
      research: {
        badge: { en: 'TECHNICAL BRIEF · MARCH 2026', fr: 'NOTE TECHNIQUE · MARS 2026' },
        title: { en: 'The Multi-Model Architecture: How Production AI Systems Are Actually Built in 2026', fr: 'L\'architecture multi-modèles : comment les systèmes IA de production sont vraiment construits en 2026' },
        abstract: { en: 'The explosion of frontier models (Opus 4.6, GPT-5.4, Gemini) has made single-model architectures obsolete. Production systems in 2026 route between models, orchestrate tool access via MCP, and fight reliability at scale. After studying the latest industry reports and building agent systems firsthand, here are the three architecture bets that separate systems that ship from systems that demo.', fr: 'L\'explosion des modèles frontier (Opus 4.6, GPT-5.4, Gemini) a rendu les architectures mono-modèle obsolètes. Les systèmes de production en 2026 routent entre les modèles, orchestrent l\'accès aux outils via MCP et combattent la fiabilité à l\'échelle. Après avoir étudié les derniers rapports de l\'industrie et construit des systèmes d\'agents, voici les trois paris d\'architecture qui séparent les systèmes qui livrent de ceux qui font des démos.' },
        sections: [
          {
            title: { en: 'Model Routing 2.0: The Cost-Intelligence Frontier', fr: 'Routage de Modèles 2.0 : La Frontière Coût-Intelligence' },
            items: [
              { name: 'Tiered Routing', desc: { en: 'Haiku 4.5 for classification/triage (<$0.001/call), Sonnet 4.6 for generation, Opus 4.6 or GPT-5.4 Pro for complex reasoning. Smart routers cut costs 70%. Anthropic\'s new Compaction API enables infinite conversations by server-side context summarization.', fr: 'Haiku 4.5 pour classification/triage (<0.001$/appel), Sonnet 4.6 pour la génération, Opus 4.6 ou GPT-5.4 Pro pour le raisonnement complexe. Les routeurs intelligents réduisent les coûts de 70%. La nouvelle Compaction API d\'Anthropic permet des conversations infinies par synthèse de contexte côté serveur.' } },
              { name: '1M Context Race', desc: { en: 'Both Opus 4.6 and GPT-5.4 now offer 1M token context windows. But Perplexity\'s MCP experience shows that bigger context does not mean better: 72% of tokens consumed by tool definitions alone. The real skill is deciding what to leave out, not what to include.', fr: 'Opus 4.6 et GPT-5.4 offrent désormais des fenêtres de contexte d\'1M tokens. Mais l\'expérience MCP de Perplexity montre que plus de contexte ne veut pas dire mieux : 72% des tokens consommés par les définitions d\'outils seules. La vraie compétence est de décider quoi exclure, pas quoi inclure.' } },
              { name: 'Tool Search vs MCP', desc: { en: 'OpenAI\'s Tool Search loads tool definitions on-demand instead of upfront. MCP loads everything into context. Hybrid architectures combining both approaches are emerging as the pragmatic solution for production systems with 50+ tools.', fr: 'Le Tool Search d\'OpenAI charge les définitions d\'outils à la demande au lieu de tout charger. MCP charge tout dans le contexte. Des architectures hybrides combinant les deux approches émergent comme solution pragmatique pour les systèmes de production avec 50+ outils.' } },
            ],
          },
          {
            title: { en: 'MCP & Tool Orchestration: The New Integration Layer', fr: 'MCP & Orchestration d\'Outils : La Nouvelle Couche d\'Intégration' },
            items: [
              { name: 'MCP as Standard', desc: { en: '97M monthly SDK downloads, donated to the Linux Foundation, backed by OpenAI + Google + AWS + Microsoft. MCP is the USB of AI. But token overhead is real: plan your tool schema budgets carefully or context windows fill up before the actual work begins.', fr: '97M de téléchargements SDK mensuels, donné à la Linux Foundation, soutenu par OpenAI + Google + AWS + Microsoft. MCP est l\'USB de l\'IA. Mais le surcoût en tokens est réel : planifiez vos budgets de schémas d\'outils soigneusement ou les fenêtres de contexte se remplissent avant que le vrai travail commence.' } },
              { name: 'Security Surface', desc: { en: 'MCP introduces an entirely new attack surface. Rapid adoption with little oversight mirrors ChatGPT\'s early days. SurePath AI now offers real-time MCP policy controls. Every production MCP deployment needs audit trails, SSO-integrated auth, and gateway behavior monitoring.', fr: 'MCP introduit une surface d\'attaque entièrement nouvelle. L\'adoption rapide sans supervision ressemble aux débuts de ChatGPT. SurePath AI propose désormais des contrôles de politique MCP en temps réel. Chaque déploiement MCP en production nécessite des traces d\'audit, une auth SSO intégrée et du monitoring de comportement gateway.' } },
              { name: 'Multi-Agent Systems', desc: { en: 'Gartner reports a 1,445% surge in multi-agent system inquiries from Q1 2024 to Q2 2025. The pattern: single all-purpose agents are being replaced by orchestrated teams of specialized agents. Think microservices, but for AI. Coordination protocols and failure isolation are the hard problems.', fr: 'Gartner rapporte une hausse de 1445% des requêtes sur les systèmes multi-agents du T1 2024 au T2 2025. Le pattern : les agents tout-en-un sont remplacés par des équipes orchestrées d\'agents spécialisés. Pensez microservices, mais pour l\'IA. Les protocoles de coordination et l\'isolation des pannes sont les vrais problèmes.' } },
            ],
          },
          {
            title: { en: 'Agent Reliability at Scale: The Production Gap', fr: 'Fiabilité des Agents à l\'Échelle : Le Fossé Production' },
            items: [
              { name: 'The 57% Illusion', desc: { en: '57% have agents in production, but fewer than 25% have scaled them. Quality is the #1 killer at 32%, replacing cost as the top concern. Hallucination rates are dropping faster than expected, but multi-step tool chains still fail frequently enough to require checkpoint-replay loops.', fr: '57% ont des agents en production, mais moins de 25% les ont scalés. La qualité est le problème #1 à 32%, remplaçant le coût comme préoccupation principale. Les taux d\'hallucination baissent plus vite que prévu, mais les chaînes d\'outils multi-étapes échouent encore assez souvent pour nécessiter des boucles checkpoint-replay.' } },
              { name: 'Observability > Evals', desc: { en: '89% have implemented observability (Langfuse, Braintrust), but only 52% run systematic evals. This is backwards: you cannot improve what you do not measure. Write evals before prompts. 50 golden examples beat 500 hours of prompt tweaking.', fr: '89% ont implémenté l\'observabilité (Langfuse, Braintrust), mais seulement 52% font des évals systématiques. C\'est à l\'envers : on ne peut pas améliorer ce qu\'on ne mesure pas. Écrire les évals avant les prompts. 50 exemples dorés battent 500 heures de tuning de prompts.' } },
              { name: 'Computer Use Shift', desc: { en: 'The ability for models to operate computers directly — navigating UIs, clicking through software, filling forms — is the shift that will matter most to developers in 2026. GPT-5.4 set records on OSWorld and WebArena benchmarks. This changes the build-vs-integrate calculus for every enterprise workflow.', fr: 'La capacité des modèles à opérer directement des ordinateurs — naviguer dans les interfaces, cliquer dans les logiciels, remplir des formulaires — est le changement qui comptera le plus pour les développeurs en 2026. GPT-5.4 a battu les records sur les benchmarks OSWorld et WebArena. Cela change le calcul build-vs-integrate pour chaque workflow entreprise.' } },
            ],
          },
        ],
        tags: ['Multi-Model', 'MCP', 'Agent Orchestration', 'Compaction', 'Tool Search', 'Observability'],
      },
    },
    finance: {
      label: { en: 'FINANCIAL AI', fr: 'IA FINANCE' },
      news: [
        {
          source: 'Bloomberg',
          link: 'https://www.bloomberg.com/news/articles/2026-02-27/wall-street-s-quant-playbook-is-upended-as-ai-reorders-market',
          title: { en: 'AI Disrupts Wall Street: $100K/Year Quant Tools Now Cost $20/Month', fr: 'L\'IA bouleverse Wall Street : les outils quant à 100K$/an coûtent maintenant 20$/mois' },
          summary: { en: 'LLMs like Claude and GPT are democratizing sophisticated trading tools previously accessible only to elite firms. Generating trading algorithms, backtesting and risk management through simple prompts is challenging the quant establishment. Traditional quant research infrastructure exceeds hundreds of thousands annually, now accessible for $20/month. Meanwhile, a dystopian research paper from Citrini imagining AI wiping out white-collar jobs sent IBM to its worst day in 25 years and pushed software stocks to fresh lows.', fr: 'Les LLMs comme Claude et GPT démocratisent des outils de trading sophistiqués auparavant réservés aux firmes d\'élite. Générer des algorithmes de trading, du backtesting et de la gestion de risque via de simples prompts remet en question l\'establishment quant. L\'infrastructure de recherche quant traditionnelle dépasse les centaines de milliers par an, désormais accessible pour 20$/mois. Parallèlement, un paper dystopique de Citrini imaginant l\'IA éliminant les emplois de cols blancs a provoqué la pire journée d\'IBM en 25 ans et poussé les valeurs logicielles à de nouveaux planchers.' },
          date: 'Feb 2026',
        },
        {
          source: 'Pictet Asset Management',
          link: 'https://am.pictet.com/hk/en/intermediaries/investment-views/active-equity/2026/evolving-ai-model',
          title: { en: 'Quantitative AI Uncovers Invisible Patterns in Financial Markets', fr: 'L\'IA quantitative révèle des patterns invisibles sur les marchés financiers' },
          summary: { en: 'Pictet\'s Quest AI strategy has outpaced its benchmark since launch in July 2023 by generating insights into what underlies stock prices using patterns no human analyst could detect. AI is uncovering previously invisible market patterns that drive investment performance. The challenge: it takes enormous effort to keep up with the latest advances. Investors considering quantitative AI-powered equity strategies need dedicated research teams just to evaluate which models are still state-of-the-art.', fr: 'La stratégie Quest AI de Pictet surperforme son benchmark depuis son lancement en juillet 2023 en générant des insights sur ce qui sous-tend les prix des actions grâce à des patterns qu\'aucun analyste humain ne pourrait détecter. L\'IA révèle des patterns de marché auparavant invisibles. Le défi : il faut un effort énorme pour suivre les dernières avancées. Les investisseurs qui considèrent des stratégies quantitatives IA ont besoin d\'équipes de recherche dédiées juste pour évaluer quels modèles sont encore à la pointe.' },
          date: 'Mar 2026',
        },
        {
          source: 'CNBC / Bloomberg',
          link: 'https://www.cnbc.com/2026/03/26/stock-market-today-live-updates.html',
          title: { en: 'Nasdaq and Dow Enter Correction: Five Straight Weeks of Losses', fr: 'Le Nasdaq et le Dow entrent en correction : cinq semaines de baisse consécutives' },
          summary: { en: 'The S&P 500 closed at 6,368 after its fifth straight weekly drop, the longest since 2022. The Nasdaq 100 entered correction territory (down 10%+ from October peak), the Dow fell 793 points in a single session. Brent crude topped $110 after Strait of Hormuz incidents. The US-Iran conflict pushed oil above $100/barrel for the first time since 2022. Stagflation fears are mounting: the probability of a Fed rate hike by end of 2026 crossed 50% for the first time.', fr: 'Le S&P 500 a clôturé à 6,368 après sa cinquième semaine de baisse consécutive, la plus longue série depuis 2022. Le Nasdaq 100 est entré en correction (-10%+ du pic d\'octobre), le Dow a perdu 793 points en une seule séance. Le Brent a dépassé 110$ après des incidents dans le détroit d\'Ormuz. Le conflit US-Iran a poussé le pétrole au-dessus de 100$/baril pour la première fois depuis 2022. Les craintes de stagflation montent : la probabilité d\'une hausse de taux de la Fed d\'ici fin 2026 a franchi 50% pour la première fois.' },
          date: 'Mar 2026',
        },
        {
          source: 'Goldman Sachs / Moody\'s',
          link: 'https://fortune.com/2026/03/27/trump-taco-iran-war-brent-crude-wti-nasdaq-stock-market-correction/',
          title: { en: 'Bear Case: S&P at 5,400 If Oil Stays Elevated, CAPE Ratio at Historic 39', fr: 'Scénario baissier : S&P à 5 400 si le pétrole reste élevé, ratio CAPE à un historique de 39' },
          summary: { en: 'The Shiller CAPE ratio sits at 39, the second-highest in history after the 2000 dot-com peak. Buffett Indicator at 219%. Moody\'s chief economist puts recession odds at 49% before the Iran escalation. Goldman warns S&P could fall to 5,400 (-22% from January peak) if oil disruptions persist. But Morgan Stanley offers a contrarian view: 40%+ of S&P 500 stocks are already down 20% from 52-week highs, and earnings are growing at 13% and accelerating. The correction may be "mature in time and price."', fr: 'Le ratio CAPE de Shiller est à 39, le deuxième plus haut de l\'histoire après le pic dot-com de 2000. Indicateur Buffett à 219%. L\'économiste en chef de Moody\'s estime les chances de récession à 49% avant l\'escalade iranienne. Goldman avertit que le S&P pourrait tomber à 5,400 (-22% du pic de janvier) si les perturbations pétrolières persistent. Mais Morgan Stanley offre une vue contrariante : 40%+ des actions du S&P 500 sont déjà en baisse de 20% par rapport à leurs plus hauts 52 semaines, et les bénéfices croissent de 13% en accélérant. La correction serait "mature en temps et en prix."' },
          date: 'Mar 2026',
        },
      ],
      research: {
        badge: { en: 'MARKET ANALYSIS · MARCH 2026', fr: 'ANALYSE DE MARCHÉ · MARS 2026' },
        title: { en: 'March 2026 Market Correction: What the Data Actually Says', fr: 'Correction de mars 2026 : ce que les données disent vraiment' },
        abstract: { en: 'Three simultaneous shocks are driving cross-asset repricing: an energy crisis from the US-Iran conflict, tariff policy chaos after the Supreme Court struck down IEEPA tariffs, and a government shutdown. Here is what the data says about whether this is a buying opportunity or the start of something worse, with an honest look at what AI-related trade flows tell us.', fr: 'Trois chocs simultanés provoquent un repricing cross-asset : une crise énergétique liée au conflit US-Iran, le chaos des tarifs douaniers après l\'invalidation des tarifs IEEPA par la Cour Suprême, et un shutdown gouvernemental. Voici ce que les données disent sur la question de savoir si c\'est une opportunité d\'achat ou le début de quelque chose de pire, avec un regard honnête sur ce que les flux commerciaux liés à l\'IA nous apprennent.' },
        sections: [
          {
            title: { en: 'The Triple Shock: Oil, Tariffs, Shutdown', fr: 'Le Triple Choc : Pétrole, Tarifs, Shutdown' },
            items: [
              { name: 'Energy Crisis', desc: { en: 'Brent crude above $110 after Strait of Hormuz incidents. US-Iran conflict pushed oil past $100/barrel for the first time since 2022. Every $10 increase in oil reduces S&P 500 earnings by ~1.5%. TSA officers working without pay during government shutdown adds domestic instability.', fr: 'Le Brent au-dessus de 110$ après les incidents du détroit d\'Ormuz. Le conflit US-Iran a poussé le pétrole au-dessus de 100$/baril pour la première fois depuis 2022. Chaque hausse de 10$ du pétrole réduit les bénéfices du S&P 500 d\'environ 1.5%. Les agents TSA travaillant sans salaire pendant le shutdown ajoute de l\'instabilité intérieure.' } },
              { name: 'Tariff Whiplash', desc: { en: 'The Supreme Court struck down IEEPA tariffs ($166B collected from 330K+ businesses). Trump replaced them with a 10% Section 122 tariff for 150 days. New Section 301 investigations against 16 countries could reimpose higher tariffs. The effective tariff rate was 13.7% in February, still historically elevated despite the legal reset.', fr: 'La Cour Suprême a invalidé les tarifs IEEPA (166 Mds$ collectés auprès de 330K+ entreprises). Trump les a remplacés par un tarif Section 122 de 10% pour 150 jours. De nouvelles enquêtes Section 301 contre 16 pays pourraient réimposer des tarifs plus élevés. Le taux tarifaire effectif était de 13.7% en février, encore historiquement élevé malgré le reset juridique.' } },
              { name: 'Rate Hike Risk', desc: { en: 'Stagflation scenario is now priced in: surging energy prices plus rising import costs. The probability of a Fed rate hike by year-end crossed 50% for the first time. This is the opposite of what markets expected three months ago. If the Fed hikes, mortgage rates, corporate borrowing, and VC funding all tighten further.', fr: 'Le scénario de stagflation est désormais pricé : flambée des prix de l\'énergie plus hausse des coûts d\'importation. La probabilité d\'une hausse de taux de la Fed d\'ici fin d\'année a franchi 50% pour la première fois. C\'est l\'opposé de ce que les marchés anticipaient il y a trois mois. Si la Fed monte les taux, les taux hypothécaires, l\'emprunt corporate et le financement VC se resserrent davantage.' } },
            ],
          },
          {
            title: { en: 'Valuation Reality Check', fr: 'Réalité des Valorisations' },
            items: [
              { name: 'CAPE at 39', desc: { en: 'The Shiller CAPE ratio at 39 is the second-highest reading in history, behind only 2000. The Buffett Indicator at 219% is also near records. 50% of all Russell 3000 stocks are down 20%+ from 52-week highs, and among S&P 500 members the figure exceeds 40%. The breadth of the decline suggests this is not just a tech correction.', fr: 'Le ratio CAPE de Shiller à 39 est la deuxième plus haute lecture de l\'histoire, derrière 2000. L\'indicateur Buffett à 219% est aussi près des records. 50% de toutes les actions du Russell 3000 sont en baisse de 20%+ par rapport à leurs plus hauts 52 semaines, et parmi les membres du S&P 500 le chiffre dépasse 40%. L\'ampleur de la baisse suggère que ce n\'est pas qu\'une correction tech.' } },
              { name: 'Earnings Still Growing', desc: { en: 'Contrarian signal: S&P 500 earnings are growing at +13% and accelerating, the opposite of deteriorating earnings that accompanied prior oil-shock recessions. Morgan Stanley\'s Mike Wilson calls this correction "mature in time and price." Historical context: average intra-year decline since 1990 is ~14%, and long-term returns have remained positive.', fr: 'Signal contrariant : les bénéfices du S&P 500 croissent de +13% et accélèrent, l\'opposé de la détérioration des bénéfices qui accompagnait les récessions de chocs pétroliers précédents. Mike Wilson de Morgan Stanley qualifie cette correction de "mature en temps et en prix." Contexte historique : la baisse intra-annuelle moyenne depuis 1990 est d\'environ 14%, et les rendements long-terme sont restés positifs.' } },
              { name: 'Recession Odds', desc: { en: 'Moody\'s machine learning model puts recession probability at 49% before the Iran escalation. Goldman Sachs warns S&P could fall to 5,400 in a severe oil disruption scenario — a 22% decline from January peak, which would constitute a bear market. But the average bear market since 1929 lasts 286 days while the average bull market lasts 1,000+ days.', fr: 'Le modèle de machine learning de Moody\'s estime la probabilité de récession à 49% avant l\'escalade iranienne. Goldman Sachs avertit que le S&P pourrait tomber à 5,400 en cas de perturbation pétrolière sévère — une baisse de 22% du pic de janvier, ce qui constituerait un bear market. Mais le bear market moyen depuis 1929 dure 286 jours tandis que le bull market moyen dure plus de 1,000 jours.' } },
            ],
          },
          {
            title: { en: 'The AI Hedge: What\'s Still Growing', fr: 'La Couverture IA : Ce Qui Croît Encore' },
            items: [
              { name: 'AI Trade Flows', desc: { en: 'AI-related trade — semiconductor and data-center equipment exports — accounted for one-third of global trade growth in 2025 according to McKinsey. Even as US-China trade fell 30%, AI infrastructure demand continued accelerating. This is the one sector decoupled from the tariff chaos.', fr: 'Le commerce lié à l\'IA — exportations de semi-conducteurs et d\'équipements de data centers — a représenté un tiers de la croissance du commerce mondial en 2025 selon McKinsey. Même avec la chute de 30% du commerce US-Chine, la demande en infrastructure IA a continué d\'accélérer. C\'est le seul secteur découplé du chaos tarifaire.' } },
              { name: 'Quant Democratization', desc: { en: 'Bloomberg reports that AI is upending Wall Street\'s quant playbook. Tools that cost $100K+/year are now accessible for $20/month via LLMs. Pictet\'s AI strategy outperforms its benchmark since 2023. The alpha is shifting from having better models to having better data pipelines and faster integration of alternative data sources.', fr: 'Bloomberg rapporte que l\'IA bouleverse le playbook quant de Wall Street. Des outils qui coûtaient 100K+$/an sont maintenant accessibles pour 20$/mois via les LLMs. La stratégie IA de Pictet surperforme son benchmark depuis 2023. L\'alpha se déplace de meilleurs modèles vers de meilleurs pipelines de données et une intégration plus rapide de sources de données alternatives.' } },
              { name: 'Long AI Infra, Short Cyclicals', desc: { en: 'The current market structure favors a barbell: long AI infrastructure (NVIDIA, TSMC, cloud providers) which benefits from secular demand regardless of cycle, short cyclical industrials exposed to tariff whiplash and energy costs. Railway just raised $100M to build AI-native cloud. The buildout continues regardless of macro.', fr: 'La structure de marché actuelle favorise un barbell : long infrastructure IA (NVIDIA, TSMC, cloud providers) qui bénéficie d\'une demande séculaire indépendante du cycle, short cycliques industriels exposés au chaos tarifaire et aux coûts énergétiques. Railway vient de lever 100M$ pour construire du cloud AI-native. La construction continue indépendamment du macro.' } },
            ],
          },
        ],
        tags: ['Correction', 'Stagflation', 'Brent Crude', 'CAPE Ratio', 'Rate Hike', 'AI Infrastructure'],
      },
    },
    politics: {
      label: { en: 'POLITICS & MARKETS', fr: 'POLITIQUE & MARCHÉS' },
      news: [
        {
          source: 'Tax Foundation',
          link: 'https://taxfoundation.org/research/all/federal/trump-tariffs-trade-war/',
          title: { en: 'Supreme Court Strikes Down IEEPA Tariffs: $166B in Refunds Pending', fr: 'La Cour Suprême invalide les tarifs IEEPA : 166 Mds$ de remboursements en attente' },
          summary: { en: 'In Learning Resources, Inc. v. Trump, the Supreme Court ruled IEEPA tariffs unconstitutional. The government collected $166 billion from over 330,000 businesses, and US Customs is now processing refunds. Trump immediately replaced them with a 10% global tariff under Section 122 of the Trade Act of 1974, valid for 150 days until July 24, 2026. The Trump tariffs represent the largest US tax increase as a percent of GDP since 1993, averaging $1,500 per household in 2026. The effective tariff rate after all changes stands at 13.7%.', fr: 'Dans l\'affaire Learning Resources, Inc. v. Trump, la Cour Suprême a jugé les tarifs IEEPA inconstitutionnels. Le gouvernement avait collecté 166 milliards de dollars auprès de plus de 330 000 entreprises, et les douanes américaines traitent maintenant les remboursements. Trump les a immédiatement remplacés par un tarif global de 10% sous la Section 122 du Trade Act de 1974, valable 150 jours jusqu\'au 24 juillet 2026. Les tarifs Trump représentent la plus grande hausse d\'impôts US en % du PIB depuis 1993, soit 1 500$ par ménage en moyenne en 2026. Le taux tarifaire effectif après tous les changements est de 13.7%.' },
          date: 'Feb 2026',
        },
        {
          source: 'Trade Compliance Resource Hub',
          link: 'https://www.tradecomplianceresourcehub.com/2026/03/24/trump-2-0-tariff-tracker/',
          title: { en: 'USTR Launches Section 301 Investigations Against 16 Countries', fr: 'L\'USTR lance des enquêtes Section 301 contre 16 pays' },
          summary: { en: 'On March 11, USTR initiated new Section 301 investigations into "structural excess capacity and production in manufacturing sectors" targeting China, EU, Singapore, Switzerland, Norway, Indonesia, Malaysia, Cambodia, Thailand, Korea, Vietnam, Taiwan, Bangladesh, Mexico, Japan, and India. The investigations could pave the way to reimpose higher tariffs after the Supreme Court struck down IEEPA. Meanwhile, tariffs on pharmaceuticals could rise toward 200% by mid-to-late 2026. The world has shifted from a unipolar system to a fragmented one where the US no longer plays a leadership role.', fr: 'Le 11 mars, l\'USTR a initié de nouvelles enquêtes Section 301 sur la "surcapacité structurelle et la production dans les secteurs manufacturiers" ciblant la Chine, l\'UE, Singapour, la Suisse, la Norvège, l\'Indonésie, la Malaisie, le Cambodge, la Thaïlande, la Corée, le Vietnam, Taiwan, le Bangladesh, le Mexique, le Japon et l\'Inde. Ces enquêtes pourraient préparer la réimposition de tarifs plus élevés après l\'invalidation de l\'IEEPA par la Cour Suprême. Les tarifs sur les produits pharmaceutiques pourraient atteindre 200% d\'ici mi-2026. Le monde est passé d\'un système unipolaire à un système fragmenté où les US ne jouent plus un rôle de leadership.' },
          date: 'Mar 2026',
        },
        {
          source: 'European Parliament',
          link: 'https://epthinktank.eu/2026/03/18/enforcement-of-the-ai-act/',
          title: { en: 'EU AI Act: Only 8 of 27 Member States Ready for August Enforcement', fr: 'EU AI Act : seulement 8 des 27 États membres prêts pour l\'application en août' },
          summary: { en: 'The August 2, 2026 deadline for high-risk AI system compliance is approaching, but only 8 out of 27 EU member states have designated enforcement authorities. Penalties exceed even GDPR: up to 35 million euros or 7% of global annual turnover for the most serious violations. Finland became the first state with full enforcement powers. The Digital Omnibus proposes delaying high-risk obligations to December 2027 for standalone systems and August 2028 for embedded products, but the core enforcement date has not moved. Compliance costs estimated at $2-5M/year for high-risk deployments.', fr: 'La deadline du 2 août 2026 pour la conformité des systèmes IA à haut risque approche, mais seuls 8 des 27 États membres de l\'UE ont désigné des autorités d\'application. Les sanctions dépassent même le RGPD : jusqu\'à 35 millions d\'euros ou 7% du chiffre d\'affaires annuel mondial pour les violations les plus graves. La Finlande est le premier État avec des pouvoirs d\'application complets. Le Digital Omnibus propose de reporter les obligations high-risk à décembre 2027 pour les systèmes autonomes et août 2028 pour les produits embarqués, mais la date d\'application principale n\'a pas bougé. Coûts de conformité estimés à 2-5M$/an pour les déploiements high-risk.' },
          date: 'Mar 2026',
        },
        {
          source: 'Fortune / Bloomberg',
          link: 'https://fortune.com/2026/03/27/trump-taco-iran-war-brent-crude-wti-nasdaq-stock-market-correction/',
          title: { en: 'US-Iran Conflict Pushes Brent Above $110, Strait of Hormuz Under Threat', fr: 'Le conflit US-Iran pousse le Brent au-dessus de 110$, le détroit d\'Ormuz menacé' },
          summary: { en: 'The US-Iran war has driven Brent crude above $100/barrel for the first time since 2022, topping $110 after incidents in the Strait of Hormuz exacerbated supply concerns. Moody\'s chief economist warns recession is "difficult to avoid" if oil prices remain elevated for weeks, citing a machine learning model that put recession odds at 49% before the escalation. The government shutdown compounds instability, with TSA officers working without pay. Goldman Sachs warns of an S&P 500 at 5,400 in a severe disruption scenario, while the EU parliament is reconsidering the US trade deal ratification.', fr: 'La guerre US-Iran a poussé le Brent au-dessus de 100$/baril pour la première fois depuis 2022, dépassant 110$ après des incidents dans le détroit d\'Ormuz qui ont exacerbé les inquiétudes d\'approvisionnement. L\'économiste en chef de Moody\'s avertit que la récession est "difficile à éviter" si les prix du pétrole restent élevés pendant des semaines, citant un modèle de machine learning donnant 49% de chances de récession avant l\'escalade. Le shutdown gouvernemental aggrave l\'instabilité, les agents TSA travaillant sans salaire. Goldman Sachs prévient d\'un S&P 500 à 5,400 en scénario de perturbation sévère, tandis que le parlement européen reconsidère la ratification de l\'accord commercial US.' },
          date: 'Mar 2026',
        },
      ],
      research: {
        badge: { en: 'GEOPOLITICAL ANALYSIS · MARCH 2026', fr: 'ANALYSE GÉOPOLITIQUE · MARS 2026' },
        title: { en: 'Trade Policy Chaos: How Courts, Tariffs and War Are Reshaping Markets in 2026', fr: 'Chaos des politiques commerciales : comment les tribunaux, les tarifs et la guerre redessinent les marchés en 2026' },
        abstract: { en: 'An unprecedented combination of constitutional crisis (SCOTUS striking down tariffs), military escalation (US-Iran), and regulatory divergence (EU AI Act vs US chip controls) is creating the most complex geopolitical landscape for markets in decades. Three forces, three timescales, three investment implications.', fr: 'Une combinaison sans précédent de crise constitutionnelle (la Cour Suprême invalidant les tarifs), d\'escalade militaire (US-Iran) et de divergence réglementaire (EU AI Act vs contrôles de puces US) crée le paysage géopolitique le plus complexe pour les marchés depuis des décennies. Trois forces, trois échelles de temps, trois implications d\'investissement.' },
        sections: [
          {
            title: { en: 'The Legal Reset: Tariffs in Constitutional Crisis', fr: 'Le Reset Juridique : Les Tarifs en Crise Constitutionnelle' },
            items: [
              { name: 'SCOTUS Fallout', desc: { en: 'The Supreme Court declared IEEPA tariffs unconstitutional, forcing $166B in refunds to 330K+ businesses. Trump pivoted to Section 122 (10% for 150 days) as a stopgap. New Section 301 investigations against 16 countries are the long-term play to reimpose tariffs on firmer legal ground. The effective rate at 13.7% remains historically elevated.', fr: 'La Cour Suprême a déclaré les tarifs IEEPA inconstitutionnels, forçant 166 Mds$ de remboursements à 330K+ entreprises. Trump a pivoté sur la Section 122 (10% pour 150 jours) comme solution temporaire. Les nouvelles enquêtes Section 301 contre 16 pays sont la stratégie long-terme pour réimposer des tarifs sur une base juridique plus solide. Le taux effectif à 13.7% reste historiquement élevé.' } },
              { name: 'Trade Rebalancing', desc: { en: 'US-China trade fell 30% but the US replaced two-thirds of the gap with imports from other sellers. Chinese exporters cut prices to find buyers in new markets. Vietnam, India, and Mexico are the main beneficiaries. Trade grew faster than the global economy in 2025, despite the tariff chaos — suggesting the global trading system is more resilient than expected.', fr: 'Le commerce US-Chine a chuté de 30% mais les US ont remplacé deux tiers du gap avec des importations d\'autres vendeurs. Les exportateurs chinois ont baissé les prix pour trouver des acheteurs sur de nouveaux marchés. Le Vietnam, l\'Inde et le Mexique sont les principaux bénéficiaires. Le commerce a crû plus vite que l\'économie mondiale en 2025 malgré le chaos tarifaire — suggérant que le système commercial mondial est plus résilient que prévu.' } },
              { name: 'Pharma Tariffs Next', desc: { en: 'The Trump administration has signaled pharmaceutical tariffs could rise toward 200% by mid-to-late 2026. This would be the most disruptive tariff action yet, affecting drug pricing for every American. Pharma stocks are already pricing in uncertainty. The largest US tax increase as % of GDP since 1993 could get significantly larger.', fr: 'L\'administration Trump a signalé que les tarifs pharmaceutiques pourraient atteindre 200% d\'ici mi-2026. Ce serait l\'action tarifaire la plus perturbante à ce jour, affectant le prix des médicaments pour chaque Américain. Les actions pharma pricent déjà l\'incertitude. La plus grande hausse d\'impôts US en % du PIB depuis 1993 pourrait devenir significativement plus importante.' } },
            ],
          },
          {
            title: { en: 'The Energy Shock: Iran, Hormuz, and Stagflation Risk', fr: 'Le Choc Énergétique : Iran, Ormuz et Risque de Stagflation' },
            items: [
              { name: 'Oil at $110+', desc: { en: 'Brent crude above $110 after Strait of Hormuz incidents. The US-Iran conflict is the first major oil supply shock since 2022. Every $10 increase reduces S&P 500 earnings by ~1.5%. Combined with tariff-driven import cost inflation, this creates a textbook stagflation setup: rising prices with slowing growth.', fr: 'Le Brent au-dessus de 110$ après les incidents du détroit d\'Ormuz. Le conflit US-Iran est le premier choc d\'offre pétrolier majeur depuis 2022. Chaque hausse de 10$ réduit les bénéfices du S&P 500 d\'environ 1.5%. Combiné avec l\'inflation des coûts d\'importation liée aux tarifs, cela crée un scénario de stagflation classique : prix en hausse avec croissance en ralentissement.' } },
              { name: 'Fed Rate Hike Risk', desc: { en: 'The probability of a Fed rate hike by end of 2026 crossed 50% for the first time. Three months ago, markets expected cuts. This is the most dramatic pivot in rate expectations since 2022. If the Fed hikes, mortgage rates, corporate borrowing, and startup funding all tighten. The government shutdown compounds the economic uncertainty.', fr: 'La probabilité d\'une hausse de taux de la Fed d\'ici fin 2026 a franchi 50% pour la première fois. Il y a trois mois, les marchés anticipaient des baisses. C\'est le pivot le plus dramatique des anticipations de taux depuis 2022. Si la Fed monte les taux, les taux hypothécaires, l\'emprunt corporate et le financement startup se resserrent tous. Le shutdown gouvernemental aggrave l\'incertitude économique.' } },
              { name: 'EU Trade Deal in Limbo', desc: { en: 'The EU parliament halted US trade deal ratification after the SCOTUS tariff ruling and Trump\'s Greenland threats. EU votes are now resuming but the relationship is strained. Countries are seeking markets other than the US and forming new alliances. The shift from unipolar to fragmented global trade makes geographic diversification more important than ever.', fr: 'Le parlement européen a suspendu la ratification de l\'accord commercial US après la décision de la Cour Suprême sur les tarifs et les menaces de Trump sur le Groenland. Les votes reprennent mais la relation est tendue. Les pays cherchent des marchés hors des US et forment de nouvelles alliances. Le passage du commerce mondial unipolaire à fragmenté rend la diversification géographique plus importante que jamais.' } },
            ],
          },
          {
            title: { en: 'The Regulatory Divergence: Three Blocs, Three Approaches', fr: 'La Divergence Réglementaire : Trois Blocs, Trois Approches' },
            items: [
              { name: 'EU: Regulate First', desc: { en: 'The EU AI Act brings penalties up to 7% of global turnover, exceeding GDPR. But only 8/27 states are ready. Harmonized standards missed their 2025 deadline. The Digital Omnibus may delay high-risk obligations to 2027-2028. For companies building AI, compliance costs of $2-5M/year create a moat for large incumbents and kill small competitors.', fr: 'L\'EU AI Act apporte des sanctions jusqu\'à 7% du CA mondial, dépassant le RGPD. Mais seuls 8/27 États sont prêts. Les standards harmonisés ont manqué leur deadline 2025. Le Digital Omnibus pourrait reporter les obligations high-risk à 2027-2028. Pour les entreprises construisant de l\'IA, les coûts de conformité de 2-5M$/an créent un avantage pour les grands groupes et tuent les petits concurrents.' } },
              { name: 'US: Relax Controls', desc: { en: 'The Trump administration loosened chip export policy in January 2026: case-by-case review for H200 exports to China instead of presumption of denial. But added a 25% tariff on the same chips. DOJ\'s Operation Gatekeeper disrupted $160M+ in illegal chip exports. The policy is strategically incoherent: relaxing controls while raising tariffs sends mixed signals to allies and industry.', fr: 'L\'administration Trump a assoupli la politique d\'export de puces en janvier 2026 : examen au cas par cas pour les exports de H200 vers la Chine au lieu d\'une présomption de refus. Mais a ajouté un tarif de 25% sur les mêmes puces. L\'Operation Gatekeeper du DOJ a perturbé 160M$+ d\'exports illégaux de puces. La politique est stratégiquement incohérente : assouplir les contrôles tout en augmentant les tarifs envoie des signaux contradictoires aux alliés et à l\'industrie.' } },
              { name: 'China: Build Domestic', desc: { en: 'China domestically produces only 1-2% of the AI chips that US companies produce, but Beijing has doubled down on domestic fabrication, software optimization, and alternative AI strategies. Rather than freezing China\'s progress, restrictions have encouraged parallel supply chains. The US holds a 21-49x advantage in 2026-produced AI compute, but the gap is narrowing as China optimizes for efficiency over raw power.', fr: 'La Chine ne produit domestiquement que 1-2% des puces IA que les entreprises US produisent, mais Pékin a doublé la mise sur la fabrication domestique, l\'optimisation logicielle et les stratégies IA alternatives. Plutôt que de geler les progrès de la Chine, les restrictions ont encouragé des supply chains parallèles. Les US gardent un avantage de 21-49x en compute IA produit en 2026, mais l\'écart se réduit alors que la Chine optimise pour l\'efficience plutôt que la puissance brute.' } },
            ],
          },
        ],
        tags: ['SCOTUS', 'Section 122', 'Iran', 'Brent Crude', 'AI Act', 'Chip Controls', 'Trade Diversion'],
      },
    },
  },
};

export const contact = {
  email:       'l.desgree@gmail.com',
  phone:       '+33 6 81 46 79 29',
  location:    { en: 'Paris, France', fr: 'Paris, France' },
  nationality: { en: 'French / Belgian', fr: 'Français / Belge' },
};

export const languages = [
  { name: { en: 'French', fr: 'Français' },  level: { en: 'Native', fr: 'Natif' } },
  { name: { en: 'English', fr: 'Anglais' },  level: 'C2' },
  { name: { en: 'Spanish', fr: 'Espagnol' }, level: 'B1' },
  { name: { en: 'Italian', fr: 'Italien' },  level: 'A2' },
];
