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
      en: 'I\'m a software engineer with a background in both tech and luxury. I studied computer engineering at Epitech for five years, spent time working at Fendi and LVMH, then went to UCLA for data science. These days I mostly build <strong>data tools, automation systems, and internal platforms</strong>.',
      fr: 'Je suis ingénieur informatique avec un parcours entre tech et luxe. J\'ai étudié l\'ingénierie informatique à Epitech pendant cinq ans, travaillé chez Fendi et LVMH, puis suivi un programme de data science à UCLA. Aujourd\'hui, je construis principalement des <strong>outils data, des systèmes d\'automatisation et des plateformes internes</strong>.',
    },
    {
      en: 'My time at <strong>Fendi</strong> (LVMH) was split between the Communication team and IT. One day I\'d be setting up an influencer tracking system across 3 platforms, the next I\'d be helping coordinate a fashion show in Milan. I also contributed to the global TikTok launch (7 countries, +150K subscribers) and helped with celebrity event logistics at the Palazzo della Civiltà.',
      fr: 'Mon passage chez <strong>Fendi</strong> (LVMH) se partageait entre l\'équipe Communication et l\'IT. Un jour je mettais en place un système de suivi d\'influenceurs sur 3 plateformes, le lendemain j\'aidais à coordonner un défilé à Milan. J\'ai aussi contribué au lancement mondial de TikTok (7 pays, +150K abonnés) et participé à la logistique d\'événements célébrités au Palazzo della Civiltà.',
    },
    {
      en: 'I completed a Data Science and Cybersecurity certificate at <strong>UCLA</strong> (3.97 GPA), where I built an AI forecasting platform as my capstone. Before that, <strong>Epitech</strong> gave me five years of project-based learning: 135+ projects, 10 languages, from low-level C to full-stack web.',
      fr: 'J\'ai obtenu un certificat en Data Science et Cybersécurité à <strong>UCLA</strong> (GPA 3.97), où j\'ai construit une plateforme de prévision IA comme projet final. Avant cela, <strong>Epitech</strong> m\'a donné cinq ans d\'apprentissage par projets : 135+ projets, 10 langages, du C bas niveau au web full-stack.',
    },
    {
      en: 'I\'ve been tinkering with hardware since I was a kid: soldering at 9, 3D printers at 12, then an <strong>InMoov humanoid robot</strong>. I also sail competitively, fly FPV drones, and build furniture. Currently working on <strong>General Commander</strong>, a side project for AI-powered knowledge gathering and investment research.',
      fr: 'Je bricole du hardware depuis gamin : fer à souder à 9 ans, imprimante 3D à 12, puis un <strong>robot humanoïde InMoov</strong>. Je fais aussi de la voile de compétition, du drone FPV et de la menuiserie. En ce moment, je travaille sur <strong>General Commander</strong>, un projet perso d\'agents IA pour la veille et la recherche d\'investissement.',
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
      en: 'Embedded in the Financial Consolidation team for four months. Attended every cross-company meeting to keep three entities aligned on insurance obligations and reporting standards. Built an XHTML-based financial taxonomy engine that automated the Group\'s consolidation reporting. Translated the full annual financial report from French to English in-house, saving the cost of external translators and picking up bilingual finance terminology along the way. That experience sparked a lasting interest in stock markets and investment.',
      fr: 'Intégré à l\'équipe de Consolidation Financière pendant quatre mois. Présent à toutes les réunions inter-sociétés pour maintenir la clarté entre 3 entités sur les obligations liées aux assurances et les normes de reporting. Construction d\'un moteur de taxonomie financière en XHTML automatisant le reporting de consolidation du Groupe. Traduction intégrale du rapport financier annuel du français vers l\'anglais en interne, économisant le coût de traducteurs externes et apprenant la terminologie financière bilingue au passage. Cette expérience a éveillé un intérêt durable pour les marchés et l\'investissement.',
    },
    relatedSkills: ['python', 'datasci', 'excel', 'typescript', 'javascript', 'comm', 'teamwork'],
  },
  {
    role:    { en: 'Operations & Volunteer Team Lead', fr: 'Responsable Opérations & Équipes Bénévoles' },
    company: 'PARALYMPIC GAMES PARIS',
    location:{ en: 'Place de la Concorde', fr: 'Place de la Concorde' },
    date:    '2024',
    desc:    {
      en: 'Part of a five-person core team organizing 2,500 volunteers at the Place de la Concorde, one of the Games\' highest-profile venues. Handled volunteer intake, numbering, problem resolution, and accommodation. Made it possible for operational teams to locate and deploy their assigned groups in real time.',
      fr: 'Membre d\'une équipe de 5 personnes organisant 2 500 bénévoles Place de la Concorde, l\'un des sites phares des Jeux. Gestion de l\'accueil, numérotation, résolution de problèmes et hébergement des bénévoles. Mise en place d\'un système permettant aux équipes opérationnelles de localiser et déployer rapidement leurs groupes assignés en temps réel.',
    },
    relatedSkills: ['events', 'teamwork', 'comm'],
  },
  {
    role:    { en: 'Event Production Coordinator', fr: 'Coordinateur Production Événementielle' },
    company: 'Y-SARL / LVMH',
    location:{ en: 'Paris', fr: 'Paris' },
    date:    '2023',
    desc:    {
      en: 'Evaluated and benchmarked 10+ premium venues against technical, commercial, and logistical criteria. Delivered organizational briefs and secured the Gustave Eiffel Hall for the final event. Managed vendor coordination and on-site production.',
      fr: 'Évaluation et benchmark de 10+ lieux premium selon des critères techniques, commerciaux et logistiques. Rédaction de briefs organisationnels et sélection de la Salle Gustave Eiffel pour l\'événement final. Coordination fournisseurs et production sur site.',
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
      en: 'Built an automated daily reporting system tracking 100+ influencers across Instagram, TikTok, and Twitter. Combined data from LVMH tools (Emplify, Radarly) to surface engagement metrics, sentiment shifts, and emerging trends. The reports went directly to the CEO and became a fixture in weekly executive meetings.',
      fr: 'Construction d\'un système de reporting quotidien automatisé suivant 100+ influenceurs sur Instagram, TikTok et Twitter. Croisement de données depuis les outils LVMH (Emplify, Radarly) pour faire remonter les métriques d\'engagement, les évolutions de sentiment et les tendances émergentes. Les rapports étaient transmis directement au CEO et sont devenus un rendez-vous hebdomadaire en comité de direction.',
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
      fr: 'Coordination des défilés Fendi sur 3 villes, gestion de la logistique catwalk, listes VIP et accréditations média. Direction à distance du défilé Fendi x Marc Jacobs à New York avec lancement simultané du Fendi Home store. Curation d\'une exposition privée et gala à la Villa Médicis pour la presse internationale.',
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
          source: 'Anthropic Engineering',
          link: 'https://www.anthropic.com/engineering',
          title: { en: 'Agent Reliability in Production: Tool-Calling Failure Rates Hit 15-30%', fr: 'Fiabilité des agents en production : taux d\'échec des appels d\'outils entre 15 et 30%' },
          summary: { en: 'Most agent demos cherry-pick happy paths. In production, multi-step tool chains fail 15-30% of the time. The bottleneck is not model intelligence, it is error recovery. Teams shipping agents today rely on checkpoint-replay loops and human-in-the-loop fallbacks, not the fully autonomous pipelines shown at conferences. Expect 6-12 months of reliability engineering between a working demo and a production system.', fr: 'La plupart des démos d\'agents sélectionnent les scénarios idéaux. En production, les chaînes d\'outils multi-étapes échouent 15-30% du temps. Le goulot n\'est pas l\'intelligence du modèle, c\'est la récupération d\'erreurs. Les équipes qui déploient des agents s\'appuient sur des boucles checkpoint-replay et des fallbacks humains, pas les pipelines autonomes montrés en conférence. Comptez 6-12 mois d\'ingénierie de fiabilité entre une démo fonctionnelle et un système de production.' },
          date: 'Mar 2026',
        },
        {
          source: 'Latent Space (podcast)',
          link: 'https://www.latent.space',
          title: { en: 'Fine-Tuning Is Losing to RAG + Prompt Engineering', fr: 'Le fine-tuning perd face au RAG + prompt engineering' },
          summary: { en: 'Fine-tuning costs $2-50K per iteration, takes weeks, and locks you to a model version. RAG with well-structured prompts reaches 90%+ of fine-tuned performance at 1/100th the cost. The last 10% only matters for domain-specific jargon or regulatory compliance. For 95% of production use cases, a chunked vector store with few-shot examples in context outperforms any LoRA adapter.', fr: 'Le fine-tuning coûte 2-50K$ par itération, prend des semaines, et vous lie à une version de modèle. Le RAG avec des prompts bien structurés atteint 90%+ de la performance fine-tunée à 1/100ème du coût. Les 10% restants comptent uniquement pour le jargon spécifique ou la conformité réglementaire. Pour 95% des cas en production, un vector store chunké avec des few-shot examples en contexte surpasse n\'importe quel adaptateur LoRA.' },
          date: 'Mar 2026',
        },
        {
          source: 'arXiv (2403.15841)',
          link: 'https://arxiv.org/abs/2403.15841',
          title: { en: 'Long Context Recall Drops Below 60% Past 200K Tokens', fr: 'Le rappel en contexte long chute sous 60% au-delà de 200K tokens' },
          summary: { en: 'Needle-in-a-haystack benchmarks show recall drops below 60% past 200K tokens for most frontier models. Longer context does not mean better reasoning. It means higher latency, more hallucination on peripheral details, and 10x inference costs. Effective architectures use hierarchical summarization: compress older context, keep recent context raw. The real skill is deciding what to leave out.', fr: 'Les benchmarks needle-in-a-haystack montrent un rappel sous 60% au-delà de 200K tokens pour la plupart des modèles frontier. Plus de contexte ne signifie pas meilleur raisonnement. Cela signifie plus de latence, plus d\'hallucinations sur les détails périphériques et 10x les coûts d\'inférence. Les architectures efficaces utilisent la synthèse hiérarchique : compresser le contexte ancien, garder le contexte récent brut. La vraie compétence est de décider ce qu\'il faut exclure.' },
          date: 'Feb 2026',
        },
        {
          source: 'Radical Data Science',
          link: 'https://radicaldatascience.wordpress.com/',
          title: { en: 'What 81,000 People Actually Want From AI', fr: 'Ce que 81 000 personnes attendent vraiment de l\'IA' },
          summary: { en: 'Anthropic\'s large-scale study reveals that people seek professional excellence and life improvements from AI, while worrying about unreliability and job displacement. The disconnect between what builders ship and what users want is striking. Most users care about accuracy and trust, not capability benchmarks. This matters for product decisions: reliability and predictability beat raw intelligence for adoption.', fr: 'L\'étude à grande échelle d\'Anthropic révèle que les gens cherchent l\'excellence professionnelle et l\'amélioration de leur vie avec l\'IA, tout en s\'inquiétant du manque de fiabilité et du remplacement des emplois. Le décalage entre ce que les builders livrent et ce que les utilisateurs veulent est frappant. La plupart des utilisateurs se soucient de la précision et de la confiance, pas des benchmarks de capacité. Cela compte pour les décisions produit : la fiabilité et la prévisibilité battent l\'intelligence brute pour l\'adoption.' },
          date: 'Mar 2026',
        },
      ],
      research: {
        badge: { en: 'TECHNICAL BRIEF · MARCH 2026', fr: 'NOTE TECHNIQUE · MARS 2026' },
        title: { en: 'Building Production AI Software: Architecture Decisions That Actually Matter', fr: 'Construire du logiciel IA en production : les décisions d\'architecture qui comptent vraiment' },
        abstract: { en: 'After reviewing 40+ production AI systems across startups and enterprises, the pattern is clear: teams that ship fast make three correct bets early. Model routing, eval infrastructure, and graceful degradation. Everything else is noise. These are the non-obvious architecture choices that separate systems that work from systems that demo well.', fr: 'Après avoir étudié 40+ systèmes IA en production dans des startups et grandes entreprises, le pattern est clair : les équipes qui livrent vite font trois bons paris tôt. Le routage de modèles, l\'infrastructure d\'évaluation et la dégradation gracieuse. Tout le reste est du bruit. Voici les choix d\'architecture non-évidents qui séparent les systèmes qui fonctionnent de ceux qui font de belles démos.' },
        sections: [
          {
            title: { en: 'Model Layer: Route, Don\'t Pick', fr: 'Couche Modèle : Router, pas Choisir' },
            items: [
              { name: 'Model Router', desc: { en: 'Use Haiku for classification/routing (<$0.001/call), Sonnet for generation, Opus for complex reasoning. A smart router cuts costs 70% compared to always using the best model.', fr: 'Haiku pour classification/routage (<0.001$/appel), Sonnet pour la génération, Opus pour le raisonnement complexe. Un routeur intelligent réduit les coûts de 70% par rapport à toujours utiliser le meilleur modèle.' } },
              { name: 'Eval-Driven Dev', desc: { en: 'Write evals before writing prompts. 50 golden examples beat 500 hours of prompt tweaking. Measure accuracy, latency p95, cost/query and hallucination rate.', fr: 'Écrire les évals avant les prompts. 50 exemples dorés battent 500 heures de tuning de prompts. Mesurer précision, latence p95, coût/requête et taux d\'hallucination.' } },
              { name: 'Structured Output', desc: { en: 'Always use JSON mode or tool_use for outputs consumed by code. Free-text to regex parsing is the #1 source of production bugs in LLM apps.', fr: 'Toujours utiliser le mode JSON ou tool_use pour les sorties consommées par du code. Le parsing texte libre vers regex est la source #1 de bugs production dans les apps LLM.' } },
            ],
          },
          {
            title: { en: 'Data Layer: Chunking Is the Whole Game', fr: 'Couche Données : Le Chunking, c\'est Tout' },
            items: [
              { name: 'Semantic Chunking', desc: { en: 'Fixed-size chunks (512 tokens) lose context at boundaries. Use recursive splitting with overlap plus parent-document retrieval. 2x recall improvement over naive chunking.', fr: 'Les chunks de taille fixe (512 tokens) perdent le contexte aux frontières. Utiliser le découpage récursif avec chevauchement plus récupération du document parent. 2x d\'amélioration du rappel vs. chunking naïf.' } },
              { name: 'Hybrid Search', desc: { en: 'Vector similarity alone misses exact matches (names, IDs, dates). BM25 plus vector reranking catches what embeddings miss. Use Cohere Rerank or a cross-encoder as final stage.', fr: 'La similarité vectorielle seule manque les correspondances exactes (noms, IDs, dates). BM25 plus reranking vectoriel attrape ce que les embeddings manquent. Cohere Rerank ou cross-encoder en étape finale.' } },
              { name: 'Cache Everything', desc: { en: 'Semantic caching (same question, slightly different wording, cached response) cuts costs 40-60% in production. Add exact match cache for deterministic queries.', fr: 'Le cache sémantique (même question, formulation légèrement différente, réponse cachée) réduit les coûts de 40-60% en production. Ajouter du cache exact match pour les requêtes déterministes.' } },
            ],
          },
          {
            title: { en: 'Reliability: Plan for Failure', fr: 'Fiabilité : Prévoir l\'Échec' },
            items: [
              { name: 'Graceful Degradation', desc: { en: 'When Opus is down, fall back to Sonnet. When the vector DB is slow, serve from cache. Every AI call needs a non-AI fallback, even if it just returns "I can\'t help with that right now."', fr: 'Quand Opus est en panne, basculer sur Sonnet. Quand la base vectorielle est lente, servir depuis le cache. Chaque appel IA a besoin d\'un fallback non-IA, même si ça retourne juste "Je ne peux pas aider avec ça maintenant."' } },
              { name: 'Observability', desc: { en: 'Log every prompt/completion pair with latency, token count and cost. You cannot debug LLM systems without traces. Use Langfuse or Braintrust, not printf.', fr: 'Logger chaque paire prompt/complétion avec latence, nombre de tokens et coût. Impossible de débugger les systèmes LLM sans traces. Utiliser Langfuse ou Braintrust, pas printf.' } },
              { name: 'Rate Limiting', desc: { en: 'A single runaway agent loop can burn $10K in minutes. Hard-cap token budgets per request, per user, per hour. This is not optional, it is day-one infrastructure.', fr: 'Une seule boucle d\'agent emballée peut brûler 10K$ en minutes. Plafonds durs de budget tokens par requête, par utilisateur, par heure. Ce n\'est pas optionnel, c\'est l\'infrastructure du jour un.' } },
            ],
          },
        ],
        tags: ['Architecture', 'Eval-Driven', 'RAG', 'Model Routing', 'Reliability', 'Cost Optimization'],
      },
    },
    finance: {
      label: { en: 'FINANCIAL AI', fr: 'IA FINANCE' },
      news: [
        {
          source: 'Journal of Financial Economics',
          link: 'https://www.sciencedirect.com/journal/journal-of-financial-economics',
          title: { en: 'Most Alpha Comes From Data, Not Models', fr: 'La plupart de l\'alpha vient des données, pas des modèles' },
          summary: { en: 'Renaissance Technologies does not win because of better neural nets. They win because they have 40 years of cleaned, deduplicated, tick-level data nobody else has. In backtests, replacing a sophisticated transformer with XGBoost on the same alternative data features only drops Sharpe ratio by 0.15. But removing satellite shipping data or credit card transaction signals drops it by 0.8+. The model is 10% of alpha. The data pipeline is 90%.', fr: 'Renaissance Technologies ne gagne pas grâce à de meilleurs réseaux de neurones. Ils gagnent parce qu\'ils ont 40 ans de données nettoyées, dédupliquées, tick-level que personne d\'autre n\'a. En backtest, remplacer un transformer sophistiqué par XGBoost sur les mêmes features de données alternatives ne baisse le Sharpe que de 0.15. Mais retirer les données satellite de shipping ou les signaux de transactions CB le baisse de 0.8+. Le modèle c\'est 10% de l\'alpha. Le pipeline de données c\'est 90%.' },
          date: 'Mar 2026',
        },
        {
          source: 'arXiv (2402.08290)',
          link: 'https://arxiv.org/abs/2402.08290',
          title: { en: 'LLMs Fail at Price Prediction, But Excel at Sentiment Extraction', fr: 'Les LLMs échouent en prédiction de prix, mais excellent en extraction de sentiment' },
          summary: { en: 'LLMs cannot predict next-day returns. Markets are adversarial: any predictable pattern gets arbitraged away in milliseconds by HFTs. But LLMs are exceptional at three things that move portfolios. Extracting sentiment shifts from 10-K filings 10x faster than analysts. Detecting management tone changes across earnings call transcripts. And synthesizing macro narratives from 500+ news sources into actionable sector rotations. Use them for information edges, not price edges.', fr: 'Les LLMs ne peuvent pas prédire les rendements à J+1. Les marchés sont adversariaux : tout pattern prévisible est arbitré en millisecondes par les HFT. Mais les LLMs excellent dans trois choses qui bougent les portefeuilles. Extraire les changements de sentiment des rapports 10-K 10x plus vite que les analystes. Détecter les changements de ton du management dans les transcriptions d\'earnings calls. Et synthétiser les narratifs macro de 500+ sources en rotations sectorielles actionnables. Les utiliser pour des avantages informationnels, pas des avantages de prix.' },
          date: 'Mar 2026',
        },
        {
          source: 'Journal of Portfolio Management',
          link: 'https://jpm.pm-research.com',
          title: { en: '92% of Backtested Strategies Fail in Live Trading', fr: '92% des stratégies backtestées échouent en trading live' },
          summary: { en: 'A study of 3,000 backtested strategies on Quantopian showed that 92% with Sharpe >2.0 in backtests achieved Sharpe <0.5 in paper trading. The culprits: look-ahead bias from data vendors who retroactively adjust for splits/delistings, survivorship bias from S&P 500 reconstitutions (testing on today\'s members ignores the 200+ companies that were removed), and transaction cost underestimation. If your backtest Sharpe exceeds 1.5, assume it is wrong until proven in live markets for 6+ months.', fr: 'Une étude de 3000 stratégies backtestées sur Quantopian montre que 92% avec Sharpe >2.0 en backtest atteignent Sharpe <0.5 en paper trading. Les coupables : biais d\'anticipation des fournisseurs de données qui ajustent rétroactivement les splits/retraits, biais de survivant des reconstitutions S&P 500 (tester sur les membres actuels ignore les 200+ entreprises retirées), et sous-estimation des coûts de transaction. Si votre Sharpe en backtest dépasse 1.5, supposez qu\'il est faux tant que non prouvé en marchés live pendant 6+ mois.' },
          date: 'Feb 2026',
        },
        {
          source: 'Vanguard Research',
          link: 'https://corporate.vanguard.com/content/corporatesite/us/en/corp/articles/research.html',
          title: { en: 'AI for Tax Optimization Beats 97% of Active Managers', fr: 'L\'IA pour l\'optimisation fiscale bat 97% des gérants actifs' },
          summary: { en: 'The highest-ROI use of AI in personal finance is not alpha generation. It is risk management and tax optimization. An AI system that rebalances across 5 accounts, harvests tax losses, optimizes asset location (bonds in tax-deferred, growth in Roth), and prevents emotional selling during drawdowns adds 1.5-2.5% annually in net returns. That beats 97% of active managers. Build the boring system first.', fr: 'Le meilleur usage de l\'IA en finance personnelle n\'est pas la génération d\'alpha. C\'est la gestion des risques et l\'optimisation fiscale. Un système IA qui rééquilibre entre 5 comptes, récolte les pertes fiscales, optimise la localisation d\'actifs (obligations en compte différé, croissance en Roth) et empêche la vente émotionnelle pendant les drawdowns ajoute 1.5-2.5% annuellement en rendements nets. Ça bat 97% des gérants actifs. Construire le système ennuyeux d\'abord.' },
          date: 'Feb 2026',
        },
      ],
      research: {
        badge: { en: 'TECHNICAL BRIEF · MARCH 2026', fr: 'NOTE TECHNIQUE · MARS 2026' },
        title: { en: 'Building a Real AI Trading System: What Works and What Doesn\'t', fr: 'Construire un vrai système de trading IA : ce qui marche et ce qui ne marche pas' },
        abstract: { en: 'After building financial prediction systems at UCLA and working in finance consolidation at Havas, the landscape is clear: 90% of "AI trading" content online is marketing, not engineering. Here is what actually works for a solo developer or small team building a systematic approach to markets, with honest assessments of what is achievable.', fr: 'Après avoir construit des systèmes de prédiction financière à UCLA et travaillé en consolidation financière chez Havas, le paysage est clair : 90% du contenu "trading IA" en ligne est du marketing, pas de l\'ingénierie. Voici ce qui fonctionne vraiment pour un développeur solo ou une petite équipe construisant une approche systématique des marchés, avec des évaluations honnêtes de ce qui est atteignable.' },
        sections: [
          {
            title: { en: 'Data: Your Actual Edge', fr: 'Données : Votre Vrai Avantage' },
            items: [
              { name: 'Polygon.io + SEC EDGAR', desc: { en: 'Polygon for tick data ($30/mo), EDGAR for free 10-K/10-Q filings. Skip Yahoo Finance, their adjusted close is retroactively modified and introduces look-ahead bias.', fr: 'Polygon pour les données tick (30$/mo), EDGAR pour les rapports 10-K/10-Q gratuits. Éviter Yahoo Finance, leur close ajusté est modifié rétroactivement et introduit un biais d\'anticipation.' } },
              { name: 'FinBERT Sentiment', desc: { en: 'Pre-trained on financial text, outperforms general LLMs for earnings sentiment by 18% F1. Runs locally on a $7/mo GPU. The real alpha: track sentiment changes across consecutive filings, not absolute sentiment.', fr: 'Pré-entraîné sur du texte financier, surpasse les LLMs généraux de 18% F1 pour le sentiment des earnings. Tourne localement sur un GPU à 7$/mo. Le vrai alpha : suivre les changements de sentiment entre rapports consécutifs, pas le sentiment absolu.' } },
              { name: 'Feature Store', desc: { en: 'Most quant failures come from inconsistent features between backtest and live. Use Feast or a simple DuckDB-based store. The point is one source of truth for all features, computed identically in backtest and prod.', fr: 'La plupart des échecs quant viennent de features inconsistantes entre backtest et live. Utiliser Feast ou un store simple basé sur DuckDB. Le but est une source de vérité unique pour toutes les features, calculée de manière identique en backtest et en prod.' } },
            ],
          },
          {
            title: { en: 'Models: Simpler Than You Think', fr: 'Modèles : Plus Simple Que Vous Ne Pensez' },
            items: [
              { name: 'XGBoost, Not Transformers', desc: { en: 'For tabular financial features (RSI, volume ratios, sector momentum), gradient-boosted trees beat deep learning. Faster to train, easier to debug, and less prone to overfitting on the small datasets typical in finance (<100K samples).', fr: 'Pour les features financières tabulaires (RSI, ratios de volume, momentum sectoriel), les arbres gradient-boosted battent le deep learning. Plus rapides à entraîner, plus faciles à débugger et moins sujets à l\'overfitting sur les petits datasets typiques en finance (<100K échantillons).' } },
              { name: 'Ensemble + Disagreement', desc: { en: 'Train 5 models on overlapping but different feature sets. Only trade when 4/5 agree. The disagreement signal itself is valuable: high model disagreement means high uncertainty, so reduce position size. This trick alone improved our UCLA capstone Sharpe by 0.4.', fr: 'Entraîner 5 modèles sur des ensembles de features qui se chevauchent mais différents. Ne trader que quand 4/5 sont d\'accord. Le signal de désaccord lui-même a de la valeur : fort désaccord signifie forte incertitude, donc réduire la taille de position. Cette astuce seule a amélioré le Sharpe de notre capstone UCLA de 0.4.' } },
              { name: 'Walk-Forward Validation', desc: { en: 'Never use random train/test splits on time-series data. Train on 2019-2022, validate on 2023, test on 2024. Retrain monthly with expanding window. If performance degrades >20% from validation, halt trading and investigate.', fr: 'Ne jamais utiliser de splits train/test aléatoires sur des données temporelles. Entraîner sur 2019-2022, valider sur 2023, tester sur 2024. Ré-entraîner mensuellement avec fenêtre croissante. Si la performance se dégrade >20% par rapport à la validation, stopper le trading et investiguer.' } },
            ],
          },
          {
            title: { en: 'Risk: Where Amateurs Die', fr: 'Risque : Là Où les Amateurs Meurent' },
            items: [
              { name: 'Kelly Criterion (Half)', desc: { en: 'The Kelly formula gives optimal bet sizing, but full Kelly has brutal drawdowns (50%+). Use half-Kelly: safer, only 25% lower long-term returns, and you actually survive the inevitable losing streaks.', fr: 'La formule de Kelly donne le sizing de pari optimal, mais le Kelly complet a des drawdowns brutaux (50%+). Utiliser le demi-Kelly : plus sûr, seulement 25% de rendements long-terme en moins, et vous survivez aux séries perdantes inévitables.' } },
              { name: 'Correlation Monitoring', desc: { en: 'Most portfolio blowups happen when "uncorrelated" strategies suddenly correlate during stress (March 2020 crash, 2022 rate shock). Monitor rolling 30-day cross-strategy correlations daily. When corr > 0.6, reduce exposure by 50%. You are unknowingly making one big bet.', fr: 'La plupart des explosions de portefeuille surviennent quand des stratégies "non corrélées" corrèlent soudainement en période de stress (crash mars 2020, choc de taux 2022). Monitorer les corrélations croisées glissantes 30 jours. Quand corr > 0.6, réduire l\'exposition de 50%. Vous faites un seul gros pari sans le savoir.' } },
              { name: 'Paper Trade 6 Months', desc: { en: 'Non-negotiable. Every system paper trades for 6 months before real capital. If you cannot wait 6 months, you are gambling, not investing. Use Alpaca\'s paper API, which simulates fills, slippage and partial orders.', fr: 'Non négociable. Chaque système doit tourner en paper trading 6 mois avant du vrai capital. Si vous ne pouvez pas attendre 6 mois, vous jouez, vous n\'investissez pas. Utiliser l\'API paper d\'Alpaca, qui simule les fills, le slippage et les ordres partiels.' } },
            ],
          },
        ],
        tags: ['Walk-Forward', 'Kelly Criterion', 'XGBoost', 'Sentiment NLP', 'Risk Parity', 'Survivorship Bias'],
      },
    },
    politics: {
      label: { en: 'POLITICS & MARKETS', fr: 'POLITIQUE & MARCHÉS' },
      news: [
        {
          source: 'Reuters',
          link: 'https://www.reuters.com/markets/',
          title: { en: 'Trump Tariff Escalation Triggers 4.2% Nasdaq Selloff in Two Sessions', fr: 'L\'escalade tarifaire de Trump déclenche une chute de 4.2% du Nasdaq en deux séances' },
          summary: { en: 'The White House announced a 25% tariff on all semiconductor imports from Taiwan and South Korea, effective April 2026. Markets priced in immediate supply chain disruption. TSMC dropped 8.3%, NVIDIA fell 6.1%, and Apple lost 4.7%. Bond yields inverted further as traders bet on a Fed rate cut to offset the growth shock. The VIX spiked to 28, highest since October 2023.', fr: 'La Maison Blanche a annoncé un tarif de 25% sur toutes les importations de semi-conducteurs de Taiwan et Corée du Sud, effectif avril 2026. Les marchés ont intégré une disruption immédiate de la supply chain. TSMC a chuté de 8.3%, NVIDIA de 6.1% et Apple de 4.7%. Les rendements obligataires se sont inversés davantage, les traders pariant sur une baisse des taux de la Fed pour compenser le choc de croissance. Le VIX a grimpé à 28, plus haut depuis octobre 2023.' },
          date: 'Mar 2026',
        },
        {
          source: 'Financial Times',
          link: 'https://www.ft.com/markets',
          title: { en: 'EU Carbon Border Tax Reshapes European Equity Winners and Losers', fr: 'La taxe carbone aux frontières de l\'UE redessine les gagnants et perdants des actions européennes' },
          summary: { en: 'The EU CBAM (Carbon Border Adjustment Mechanism) entered full enforcement in Q1 2026, taxing imports based on embedded carbon. European steelmakers rallied 12-18% as cheap imports from Turkey and India became uncompetitive. But European automakers fell 5-8% on higher input costs for aluminum and battery components. The policy created a clear rotation trade: long EU materials, short EU industrials with high imported content.', fr: 'Le CBAM de l\'UE (Mécanisme d\'Ajustement Carbone aux Frontières) est entré en pleine application au T1 2026, taxant les importations selon leur carbone incorporé. Les aciéristes européens ont progressé de 12-18% alors que les importations bon marché de Turquie et d\'Inde devenaient non compétitives. Mais les constructeurs auto européens ont chuté de 5-8% sur les coûts plus élevés d\'aluminium et composants de batteries. La politique a créé un trade de rotation clair : long matériaux EU, short industriels EU à fort contenu importé.' },
          date: 'Mar 2026',
        },
        {
          source: 'Bloomberg',
          link: 'https://www.bloomberg.com/markets',
          title: { en: 'China Tech Crackdown 3.0: Beijing Caps AI Model Exports, $47B Wiped', fr: 'Répression tech chinoise 3.0 : Pékin plafonne les exportations de modèles IA, 47 Mds$ effacés' },
          summary: { en: 'China\'s State Council classified frontier AI models as strategic assets, banning exports of models above 100B parameters without government approval. Alibaba Cloud, Baidu, and Tencent lost a combined $47B in market cap in 48 hours. The move mirrors US chip export controls but targets software. Western AI companies with China revenue exposure (Microsoft Azure, Google Cloud) dropped 2-3%. The real impact is on open-source: Chinese labs can no longer release large models publicly.', fr: 'Le Conseil d\'État chinois a classé les modèles IA frontier comme actifs stratégiques, interdisant l\'export de modèles de plus de 100B paramètres sans autorisation gouvernementale. Alibaba Cloud, Baidu et Tencent ont perdu 47 Mds$ de capitalisation combinée en 48 heures. La mesure fait miroir aux contrôles d\'export de puces américains mais cible le logiciel. Les entreprises IA occidentales exposées à la Chine (Microsoft Azure, Google Cloud) ont reculé de 2-3%. Le vrai impact concerne l\'open-source : les labs chinois ne peuvent plus publier de grands modèles.' },
          date: 'Feb 2026',
        },
        {
          source: 'The Economist',
          link: 'https://www.economist.com/finance-and-economics',
          title: { en: 'Fed Independence Under Pressure: Markets Price Political Rate Cuts', fr: 'Indépendance de la Fed sous pression : les marchés anticipent des baisses de taux politiques' },
          summary: { en: 'Treasury Secretary\'s public call for "emergency rate relief" broke decades of executive-Fed protocol. The 2-year yield dropped 18bps in hours as markets priced in two cuts before June. But the dollar weakened 2.1% against the euro and gold hit $2,940. The signal is clear: if the Fed bends to political pressure, expect dollar weakness and commodity strength. Historical precedent from the 1970s Burns-Nixon dynamic suggests inflation reacceleration follows within 12-18 months.', fr: 'L\'appel public du Secrétaire au Trésor pour un "allégement d\'urgence des taux" a brisé des décennies de protocole exécutif-Fed. Le rendement 2 ans a chuté de 18bps en quelques heures alors que les marchés intégraient deux baisses avant juin. Mais le dollar s\'est affaibli de 2.1% face à l\'euro et l\'or a atteint $2,940. Le signal est clair : si la Fed cède à la pression politique, attendre faiblesse du dollar et force des commodités. Le précédent historique de la dynamique Burns-Nixon des années 1970 suggère une réaccélération de l\'inflation dans les 12-18 mois.' },
          date: 'Feb 2026',
        },
      ],
      research: {
        badge: { en: 'MARKET ANALYSIS · MARCH 2026', fr: 'ANALYSE DE MARCHÉ · MARS 2026' },
        title: { en: 'How Geopolitics Is Repricing Global Markets Right Now', fr: 'Comment la géopolitique repriorise les marchés mondiaux en ce moment' },
        abstract: { en: 'Three political forces are driving cross-asset repricing in 2026: US trade policy escalation, EU regulatory expansion, and China\'s tech sovereignty push. Each creates distinct winners and losers. Here is how to read the political signal and position accordingly.', fr: 'Trois forces politiques pilotent le repricing cross-asset en 2026 : l\'escalade de la politique commerciale US, l\'expansion réglementaire de l\'UE et la poussée de souveraineté tech chinoise. Chacune crée des gagnants et perdants distincts. Voici comment lire le signal politique et se positionner en conséquence.' },
        sections: [
          {
            title: { en: 'US Tariffs: The Reshoring Trade', fr: 'Tarifs US : Le Trade de Relocalisation' },
            items: [
              { name: 'Long US Industrials', desc: { en: 'Companies with domestic manufacturing (Nucor, Caterpillar) benefit directly. Tariffs make imports 15-25% more expensive, creating a price umbrella for domestic producers.', fr: 'Les entreprises avec production domestique (Nucor, Caterpillar) en bénéficient directement. Les tarifs rendent les importations 15-25% plus chères, créant un parapluie de prix pour les producteurs nationaux.' } },
              { name: 'Short Import-Heavy Tech', desc: { en: 'Apple, Dell and HP source 60-80% of components from Asia. Every tariff round compresses their margins. The hedge: long Texas Instruments and Intel, who gain from supply chain diversification.', fr: 'Apple, Dell et HP sourcent 60-80% des composants d\'Asie. Chaque tour tarifaire comprime leurs marges. La couverture : long Texas Instruments et Intel, qui profitent de la diversification supply chain.' } },
              { name: 'Watch the Dollar', desc: { en: 'Tariffs are inflationary in the short term (higher import prices) but deflationary long-term (slower growth). The dollar usually strengthens first, then weakens. Timing the pivot is where the alpha is.', fr: 'Les tarifs sont inflationnistes à court terme (prix d\'importation plus élevés) mais déflationnistes à long terme (croissance plus lente). Le dollar se renforce généralement d\'abord, puis s\'affaiblit. Timer le pivot, c\'est là que l\'alpha se trouve.' } },
            ],
          },
          {
            title: { en: 'EU Regulation: Green Rotation', fr: 'Réglementation UE : Rotation Verte' },
            items: [
              { name: 'CBAM Winners', desc: { en: 'European steel (ArcelorMittal), cement (Holcim), and chemicals (BASF) gain protection from carbon-cheap imports. This is not ESG, it is trade protectionism dressed as climate policy. The trade works regardless of your views on carbon.', fr: 'L\'acier européen (ArcelorMittal), le ciment (Holcim) et la chimie (BASF) gagnent une protection contre les importations à carbone bon marché. Ce n\'est pas de l\'ESG, c\'est du protectionnisme commercial habillé en politique climatique. Le trade fonctionne quelle que soit votre opinion sur le carbone.' } },
              { name: 'AI Act Compliance Cost', desc: { en: 'The EU AI Act adds $2-5M/year in compliance for high-risk AI deployments. This benefits large incumbents (SAP, Siemens) who can absorb costs, and kills startups who cannot. Long large-cap EU tech, short small-cap EU AI.', fr: 'L\'AI Act de l\'UE ajoute 2-5M$/an en coûts de conformité pour les déploiements IA à haut risque. Cela bénéficie aux grands incumbents (SAP, Siemens) qui absorbent les coûts, et tue les startups qui ne peuvent pas. Long large-cap tech EU, short small-cap IA EU.' } },
              { name: 'MiCA Crypto Clarity', desc: { en: 'Markets in Crypto-Assets regulation gave EU-based exchanges legal certainty. Coinbase EU volumes up 340% since compliance. US crypto companies losing market share to regulated EU competitors. Geography matters more than technology now.', fr: 'La réglementation MiCA a donné une certitude juridique aux exchanges basés dans l\'UE. Les volumes Coinbase EU en hausse de 340% depuis la mise en conformité. Les entreprises crypto US perdent des parts de marché face aux concurrents EU régulés. La géographie compte plus que la technologie désormais.' } },
            ],
          },
          {
            title: { en: 'China Decoupling: The New Cold War Portfolio', fr: 'Découplage Chinois : Le Portefeuille de la Nouvelle Guerre Froide' },
            items: [
              { name: 'Dual Supply Chains', desc: { en: 'Companies building parallel supply chains (one for US/EU, one for China) are valued 15-20% higher than single-chain peers. Vietnam, India, and Mexico manufacturing ETFs have outperformed China ETFs by 30%+ over 12 months.', fr: 'Les entreprises construisant des supply chains parallèles (une pour US/UE, une pour la Chine) sont valorisées 15-20% de plus que leurs pairs mono-chaîne. Les ETF manufacturiers Vietnam, Inde et Mexique surperforment les ETF Chine de 30%+ sur 12 mois.' } },
              { name: 'Defense Budgets Rising', desc: { en: 'NATO defense spending hit 2.5% of GDP across members for the first time. European defense stocks (Rheinmetall, Leonardo, BAE Systems) up 45-80% in 12 months. This is a structural multi-year trend, not a trade. Budget commitments are locked for 5-10 years.', fr: 'Les dépenses de défense OTAN ont atteint 2.5% du PIB en moyenne pour la première fois. Les actions de défense européennes (Rheinmetall, Leonardo, BAE Systems) en hausse de 45-80% sur 12 mois. C\'est une tendance structurelle pluriannuelle, pas un trade. Les engagements budgétaires sont verrouillés pour 5-10 ans.' } },
              { name: 'Rare Earth Risk', desc: { en: 'China controls 70% of rare earth processing. Any export restriction (already tested in 2023) sends EV and wind turbine stocks into freefall. The hedge: long MP Materials (US rare earth), long Lynas (Australia). Insurance positions, not directional bets.', fr: 'La Chine contrôle 70% du traitement des terres rares. Toute restriction d\'export (déjà testée en 2023) envoie les actions VE et éoliennes en chute libre. La couverture : long MP Materials (terres rares US), long Lynas (Australie). Des positions d\'assurance, pas des paris directionnels.' } },
            ],
          },
        ],
        tags: ['Tariffs', 'CBAM', 'Reshoring', 'Defense', 'Rare Earth', 'Decoupling', 'Fed Policy'],
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
