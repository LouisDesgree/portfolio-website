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
    en: 'Software Engineer · Data Scientist · Tech in Service of the Message',
    fr: 'Ingénieur Logiciel · Data Scientist · La Tech au Service du Message',
  },
  availability: {
    en: 'Open to opportunities · March 2026',
    fr: 'Ouvert aux opportunités · Mars 2026',
  },
};

export const about = {
  paragraphs: [
    {
      en: 'Engineer who speaks luxury. I build <strong>data-driven tools and systems</strong> at the intersection of technology, fashion, and finance — translating complex engineering into solutions that non-technical teams can leverage immediately.',
      fr: 'Ingénieur qui parle le langage du luxe. Je conçois des <strong>outils et systèmes data-driven</strong> à l\'intersection de la technologie, de la mode et de la finance — transformant l\'ingénierie complexe en solutions immédiatement exploitables par des équipes non-techniques.',
    },
    {
      en: 'At <strong>Fendi</strong> (LVMH), I engineered an automated analytics system tracking 100+ influencers across 3 platforms, spearheaded a global TikTok launch reaching +150K subscribers in 7 countries, and orchestrated celebrity campaigns for 25,000+ attendees — all while auditing MLOps pipelines with the IS&T team in Milan.',
      fr: 'Chez <strong>Fendi</strong> (LVMH), j\'ai conçu un système analytique automatisé suivant 100+ influenceurs sur 3 plateformes, piloté un lancement TikTok mondial atteignant +150K abonnés dans 7 pays, et orchestré des campagnes célébrités pour 25 000+ spectateurs — tout en auditant les pipelines MLOps avec l\'équipe IS&T à Milan.',
    },
    {
      en: 'At <strong>UCLA</strong>, I graduated top of my class (3.97 GPA, with Distinction) in Data Science & Cybersecurity, shipping a full-stack AI forecasting platform as my capstone. With <strong>135+ projects</strong> across 5 years at Epitech and 10 programming languages, I bring deep technical depth with the communication skills to make it count.',
      fr: 'À <strong>UCLA</strong>, j\'ai été major de promotion (GPA 3.97, mention Distinction) en Data Science & Cybersécurité, livrant une plateforme de prévision IA full-stack comme projet final. Avec <strong>135+ projets</strong> sur 5 ans à Epitech et 10 langages de programmation, j\'apporte une profondeur technique solide avec les compétences de communication pour la valoriser.',
    },
    {
      en: 'Self-taught hardware builder since age 9 — from soldering circuits to constructing an <strong>InMoov humanoid robot</strong> and 3D printers. Competitive sailor, FPV drone pilot, and woodworker. Currently architecting <strong>General Commander</strong>, an AI agent platform that automates knowledge gathering and investment strategy.',
      fr: 'Autodidacte en hardware depuis 9 ans — de la soudure de circuits à la construction d\'un <strong>robot humanoïde InMoov</strong> et d\'imprimantes 3D. Régatier, pilote de drone FPV et menuisier. Je développe actuellement <strong>General Commander</strong>, une plateforme d\'agents IA automatisant la veille et la stratégie d\'investissement.',
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
      en: 'Second developer at DLABS (sister company of Smode, a live visual effects tool for TV sets). Built Python plugins for the After Effects and Cinema 4D pipeline, developed internal tools for the graphics team, and architected a structured NAS workflow balancing robustness with creative freedom. Deployed Zabbix monitoring on machines rebuilt from salvaged parts. Managed pipeline experiments with Airtable and QNAP/QFinder. Daily IT support for all graphists across studio and office environments.',
      fr: 'Second développeur chez DLABS (société sœur de Smode, outil d\'effets visuels live pour plateaux TV). Développement de plugins Python pour le pipeline After Effects et Cinema 4D, création d\'outils internes pour l\'équipe graphique, architecture d\'un workflow NAS structuré alliant robustesse et liberté créative. Déploiement de monitoring Zabbix sur des machines reconstruites à partir de pièces récupérées. Expérimentations pipeline avec Airtable et QNAP/QFinder. Support IT quotidien pour tous les graphistes en studio et bureau.',
    },
    relatedSkills: ['python', 'linux', 'networking', 'systems', 'java', 'docker', 'aitools', 'git'],
  },
  {
    role:    { en: 'Financial Data Engineer (Intern)', fr: 'Ingénieur Data Finance (Stage)' },
    company: 'HAVAS SA',
    location:{ en: 'Paris', fr: 'Paris' },
    date:    '2025',
    desc:    {
      en: 'Embedded in the Financial Consolidation team for 4 months, attending all cross-company meetings to ensure clarity between 3 entities on insurance-related obligations and reporting standards. Architected an XHTML-based financial taxonomy engine automating the Group\'s consolidation reporting. Co-translated the full annual financial report to English, mastering bilingual finance terminology from scratch — an experience that sparked a lasting interest in stock markets and investment.',
      fr: 'Intégré à l\'équipe de Consolidation Financière pendant 4 mois, présent à toutes les réunions inter-sociétés pour garantir la clarté entre 3 entités sur les obligations liées aux assurances et les normes de reporting. Architecture d\'un moteur de taxonomie financière en XHTML automatisant le reporting de consolidation du Groupe. Co-traduction intégrale du rapport financier annuel en anglais, maîtrisant la terminologie financière bilingue from scratch — une expérience qui a éveillé un intérêt durable pour les marchés et l\'investissement.',
    },
    relatedSkills: ['python', 'datasci', 'excel', 'typescript', 'javascript', 'comm', 'teamwork'],
  },
  {
    role:    { en: 'Operations & Volunteer Team Lead', fr: 'Responsable Opérations & Équipes Bénévoles' },
    company: 'PARALYMPIC GAMES PARIS',
    location:{ en: 'Place de la Concorde', fr: 'Place de la Concorde' },
    date:    '2024',
    desc:    {
      en: 'Part of a 5-person core team organizing 2,500 volunteers at the Place de la Concorde — one of the Games\' highest-profile venues. Managed volunteer intake, numbering, problem resolution, and accommodation. Enabled operational teams to quickly locate and deploy their assigned groups in real time.',
      fr: 'Membre d\'une équipe de 5 personnes organisant 2 500 bénévoles Place de la Concorde — l\'un des sites phares des Jeux. Gestion de l\'accueil, numérotation, résolution de problèmes et hébergement des bénévoles. Facilitation pour les équipes opérationnelles afin de localiser et déployer rapidement leurs groupes assignés en temps réel.',
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
      en: 'Dual-function role bridging Communication and Technology, reporting directly to Cristiana Monfardini (CCO). Engineered an automated influencer analytics system tracking 100+ creators across 3 platforms, delivering daily reports used in CEO executive meetings. Spearheaded Fendi\'s global TikTok launch across 7+ countries, growing the channel by +150K subscribers. Orchestrated celebrity campaigns (Dybala, Benzema) reaching 25,000+ live attendees with videomapping on the Palazzo della Civiltà. Audited Java and HTML/CSS codebases and collaborated with IS&T Milan on MLOps data pipelines. Coordinated fashion shows across Milan, Paris, and New York.',
      fr: 'Rôle double entre Communication et Technologie, reportant directement à Cristiana Monfardini (Directrice de la Communication Monde). Conception d\'un système analytique automatisé suivant 100+ créateurs sur 3 plateformes, livrant des rapports quotidiens utilisés en comité de direction CEO. Pilotage du lancement mondial TikTok de Fendi dans 7+ pays, développant le canal de +150K abonnés. Orchestration de campagnes célébrités (Dybala, Benzema) devant 25 000+ spectateurs avec vidéomapping sur le Palazzo della Civiltà. Audit de codebases Java et HTML/CSS, collaboration avec l\'IS&T Milan sur les pipelines MLOps. Coordination des défilés à Milan, Paris et New York.',
    },
    relatedSkills: ['python', 'java', 'mlops', 'datasci', 'social', 'comm', 'luxury', 'fashion', 'celebrity', 'videomapping', 'events', 'emplify', 'radarly', 'analytics', 'excel'],
  },
  {
    role:    { en: 'Metaverse Experience Room Coordinator', fr: 'Coordinateur Experience Room Métavers' },
    company: 'LVMH',
    location:{ en: 'Paris', fr: 'Paris' },
    date:    '2022',
    desc:    {
      en: 'Short-term engagement within an LVMH innovation think tank exploring metaverse applications for luxury. Managed the Experience Room — an immersive showcase space demonstrating Web3, VR, and spatial computing possibilities to C-level stakeholders and Maison directors.',
      fr: 'Mission courte au sein d\'un think tank innovation LVMH explorant les applications métavers pour le luxe. Gestion de l\'Experience Room — espace immersif démontrant les possibilités Web3, VR et spatial computing aux dirigeants C-level et directeurs de Maisons.',
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
    { id: 'c',         label: 'C',            cluster: 'engineering', size: 1.0,  sub: '60 projects', description: { en: 'Core language across 5 years at Epitech — memory management, system calls, UNIX internals', fr: 'Langage principal sur 5 ans à Epitech — gestion mémoire, appels système, internals UNIX' } },
    { id: 'cpp',       label: 'C++',          cluster: 'engineering', size: 0.85, sub: '20 projects', description: { en: 'OOP, templates, and game engine development with SFML', fr: 'POO, templates et développement moteur de jeu avec SFML' } },
    { id: 'systems',   label: 'Systems',      cluster: 'engineering', size: 0.75, sub: 'Shell, Threads', description: { en: 'Built custom shells, process schedulers, and thread pools from scratch', fr: 'Création de shells, ordonnanceurs de processus et pools de threads from scratch' } },
    { id: 'networking', label: 'Networking',    cluster: 'engineering', size: 0.6,  sub: 'Sockets, TCP', description: { en: 'Socket programming, TCP/UDP protocols, client-server architectures', fr: 'Programmation socket, protocoles TCP/UDP, architectures client-serveur' } },
    { id: 'threads',   label: 'Concurrency',  cluster: 'engineering', size: 0.6,  sub: 'Mutex, Semaphores', description: { en: 'Multi-threaded programming with synchronization primitives', fr: 'Programmation multi-thread avec primitives de synchronisation' } },
    { id: 'asm',       label: 'Assembly',      cluster: 'engineering', size: 0.5,  sub: 'x86', description: { en: 'x86 assembly for low-level optimization and system understanding', fr: 'Assembleur x86 pour optimisation bas niveau et compréhension système' } },
    { id: 'haskell',   label: 'Haskell',       cluster: 'engineering', size: 0.55, sub: '6 projects', description: { en: 'Functional programming — interpreters, parsers, and lambda calculus', fr: 'Programmation fonctionnelle — interpréteurs, parseurs et lambda calcul' } },
    { id: 'gamedev',   label: 'Game Dev',      cluster: 'engineering', size: 0.6,  sub: 'CSFML, R-Type', description: { en: 'Multiplayer game engine (R-Type) with ECS architecture', fr: 'Moteur de jeu multijoueur (R-Type) avec architecture ECS' } },

    // === DATA & AI ===
    { id: 'python',    label: 'Python',        cluster: 'data', size: 0.95, sub: '15+ projects', description: { en: 'Primary language for data pipelines, ML models, and automation scripts', fr: 'Langage principal pour pipelines data, modèles ML et scripts d\'automatisation' } },
    { id: 'datasci',   label: 'Data Science',  cluster: 'data', size: 0.85, sub: 'UCLA Certificate', description: { en: 'UCLA top of class (3.97 GPA) — statistical modeling, feature engineering, EDA', fr: 'Major de promo UCLA (GPA 3.97) — modélisation statistique, feature engineering, EDA' } },
    { id: 'ai',        label: 'AI / ML',       cluster: 'data', size: 0.8,  sub: 'NeuralProphet', description: { en: 'Time-series forecasting, neural networks, and predictive modeling', fr: 'Prévision de séries temporelles, réseaux de neurones et modélisation prédictive' } },
    { id: 'mlops',     label: 'MLOps',         cluster: 'data', size: 0.6,  sub: 'Fendi Pipeline', description: { en: 'Pipeline audit and optimization at Fendi IS&T Milan', fr: 'Audit et optimisation de pipelines chez Fendi IS&T Milan' } },
    { id: 'pandas',    label: 'Pandas',        cluster: 'data', size: 0.6,  sub: 'NumPy, SciPy', description: { en: 'Data wrangling and numerical computation across every data project', fr: 'Manipulation de données et calcul numérique sur tous les projets data' } },
    { id: 'sklearn',   label: 'scikit-learn',  cluster: 'data', size: 0.6,  sub: 'Regression, Classification', description: { en: 'Supervised and unsupervised learning — model selection and evaluation', fr: 'Apprentissage supervisé et non-supervisé — sélection et évaluation de modèles' } },
    { id: 'stats',     label: 'Statistics',    cluster: 'data', size: 0.65, sub: '19 math projects', description: { en: '19 math-intensive Epitech projects — probability, linear algebra, calculus', fr: '19 projets mathématiques Epitech — probabilités, algèbre linéaire, calcul' } },
    { id: 'dataviz',   label: 'Data Viz',      cluster: 'data', size: 0.6,  sub: 'Bokeh, Tableau', description: { en: 'Interactive dashboards and visual storytelling for stakeholders', fr: 'Dashboards interactifs et storytelling visuel pour les stakeholders' } },
    { id: 'hadoop',    label: 'Big Data',      cluster: 'data', size: 0.5,  sub: 'Hadoop', description: { en: 'Distributed data processing fundamentals', fr: 'Fondamentaux du traitement de données distribué' } },

    // === WEB & APPS ===
    { id: 'java',      label: 'Java',          cluster: 'web', size: 0.55, sub: 'Fendi Code Review', description: { en: 'Code auditing and review for Fendi\'s internal systems', fr: 'Audit et revue de code pour les systèmes internes Fendi' } },
    { id: 'typescript', label: 'TypeScript',    cluster: 'web', size: 0.7,  sub: 'Next.js, React', description: { en: 'Full-stack typed development — Havas financial engine, portfolio', fr: 'Développement full-stack typé — moteur financier Havas, portfolio' } },
    { id: 'javascript', label: 'JavaScript',    cluster: 'web', size: 0.65, sub: 'Express, Node', description: { en: 'Vanilla JS, Node.js backends, and Canvas 2D/WebGL visuals', fr: 'Vanilla JS, backends Node.js et visuels Canvas 2D/WebGL' } },
    { id: 'react',     label: 'React',         cluster: 'web', size: 0.6,  sub: 'Next.js', description: { en: 'Component-driven UIs with Next.js SSR/SSG', fr: 'Interfaces composant-driven avec SSR/SSG Next.js' } },
    { id: 'kotlin',    label: 'Kotlin',        cluster: 'web', size: 0.5,  sub: 'EIP Mobile', description: { en: 'Android mobile development for Epitech Innovation Project', fr: 'Développement mobile Android pour le Projet d\'Innovation Epitech' } },
    { id: 'swift',     label: 'Swift',         cluster: 'web', size: 0.5,  sub: 'iOS', description: { en: 'iOS application development', fr: 'Développement d\'applications iOS' } },

    // === SECURITY ===
    { id: 'cybersec',  label: 'Cybersecurity', cluster: 'security', size: 0.75, sub: 'UCLA + Epitech', description: { en: 'UCLA certificate + Epitech security projects — threat analysis, secure architecture', fr: 'Certificat UCLA + projets sécurité Epitech — analyse de menaces, architecture sécurisée' } },
    { id: 'offensive', label: 'Offensive',     cluster: 'security', size: 0.55, sub: 'Pentesting', description: { en: 'Penetration testing methodology and vulnerability assessment', fr: 'Méthodologie de test d\'intrusion et évaluation de vulnérabilités' } },
    { id: 'defensive', label: 'Defensive',     cluster: 'security', size: 0.55, sub: 'Hardening', description: { en: 'System hardening, monitoring, and incident response', fr: 'Durcissement système, monitoring et réponse aux incidents' } },
    { id: 'crypto',    label: 'Cryptography',  cluster: 'security', size: 0.55, sub: 'Algorithms', description: { en: 'Encryption algorithms, key exchange, and digital signatures', fr: 'Algorithmes de chiffrement, échange de clés et signatures numériques' } },

    // === TOOLS & DEVOPS ===
    { id: 'git',       label: 'Git',           cluster: 'tools', size: 0.7,  sub: 'GitHub', description: { en: 'Version control across 135+ projects — branching strategies, code review', fr: 'Contrôle de version sur 135+ projets — stratégies de branches, revue de code' } },
    { id: 'docker',    label: 'Docker',        cluster: 'tools', size: 0.6,  sub: 'Containers', description: { en: 'Containerized deployments and development environments', fr: 'Déploiements et environnements de développement conteneurisés' } },
    { id: 'linux',     label: 'Linux',         cluster: 'tools', size: 0.7,  sub: 'Terminal', description: { en: 'Daily driver for 5+ years — scripting, sysadmin, server management', fr: 'Usage quotidien depuis 5+ ans — scripting, sysadmin, gestion serveur' } },
    { id: 'vscode',    label: 'VS Code',       cluster: 'tools', size: 0.55, description: { en: 'Primary editor with custom extensions and debugging workflows', fr: 'Éditeur principal avec extensions custom et workflows de débogage' } },
    { id: 'cicd',      label: 'CI/CD',         cluster: 'tools', size: 0.5,  sub: 'GitHub Actions', description: { en: 'Automated testing and deployment pipelines', fr: 'Pipelines de tests et déploiement automatisés' } },
    { id: 'aitools',   label: 'AI Tools',      cluster: 'tools', size: 0.6,  sub: 'Claude, ChatGPT', description: { en: 'AI-augmented development — prompt engineering, code generation', fr: 'Développement augmenté par IA — prompt engineering, génération de code' } },

    // === BUSINESS & COMMUNICATION ===
    { id: 'excel',     label: 'Excel',         cluster: 'business', size: 0.6,  sub: 'Advanced', description: { en: 'Advanced formulas, pivot tables, and financial modeling', fr: 'Formules avancées, tableaux croisés dynamiques et modélisation financière' } },
    { id: 'powerbi',   label: 'Power BI',      cluster: 'business', size: 0.55, sub: 'Dashboards', description: { en: 'Business intelligence dashboards and data modeling', fr: 'Dashboards de business intelligence et modélisation de données' } },
    { id: 'tableau',   label: 'Tableau',       cluster: 'business', size: 0.55, sub: 'Visualization', description: { en: 'Data visualization and interactive reporting', fr: 'Visualisation de données et reporting interactif' } },
    { id: 'figma',     label: 'Figma',         cluster: 'business', size: 0.5, description: { en: 'UI/UX prototyping and design systems', fr: 'Prototypage UI/UX et design systems' } },
    { id: 'ppt',       label: 'PowerPoint',    cluster: 'business', size: 0.5, description: { en: 'Executive presentations and pitch decks', fr: 'Présentations exécutives et pitch decks' } },
    { id: 'analytics', label: 'Google Analytics', cluster: 'business', size: 0.5, sub: 'Console', description: { en: 'Web analytics, traffic analysis, and conversion tracking', fr: 'Analytique web, analyse de trafic et suivi de conversion' } },
    { id: 'crm',       label: 'CRM',           cluster: 'business', size: 0.5, description: { en: 'Customer relationship management and data workflows', fr: 'Gestion de la relation client et workflows de données' } },
    { id: 'comm',      label: 'Communication', cluster: 'business', size: 0.75, sub: 'Fendi, LVMH', description: { en: 'Bridging tech and business — exec reporting, stakeholder management', fr: 'Pont entre tech et business — reporting exécutif, gestion des stakeholders' } },
    { id: 'events',    label: 'Events',        cluster: 'business', size: 0.6,  sub: 'Olympics, LVMH', description: { en: 'Large-scale event production — Paralympics, LVMH, fashion shows', fr: 'Production événementielle grande échelle — Paralympiques, LVMH, défilés' } },
    { id: 'teamwork',  label: 'Team Work',     cluster: 'business', size: 0.6, description: { en: 'Cross-functional team leadership and agile collaboration', fr: 'Leadership d\'équipes transversales et collaboration agile' } },
    { id: 'emplify',   label: 'Emplify',       cluster: 'business', size: 0.5,  sub: 'LVMH Analytics', description: { en: 'LVMH\'s internal analytics platform for brand performance', fr: 'Plateforme analytique interne LVMH pour la performance des marques' } },
    { id: 'radarly',   label: 'Radarly',       cluster: 'business', size: 0.5,  sub: 'Sentiment Analysis', description: { en: 'Social listening and sentiment analysis for luxury brands', fr: 'Écoute sociale et analyse de sentiment pour marques de luxe' } },
    { id: 'social',    label: 'Social Media',  cluster: 'business', size: 0.6,  sub: 'IG, TikTok, LinkedIn', description: { en: 'Platform strategy — grew Fendi TikTok to 150K+ subscribers globally', fr: 'Stratégie plateforme — croissance TikTok Fendi à 150K+ abonnés mondial' } },

    // === LUXURY ===
    { id: 'luxury',    label: 'Luxury',        cluster: 'luxury', size: 0.75, sub: 'LVMH, Fendi', description: { en: 'Deep understanding of luxury codes — from Fendi\'s Palazzo to LVMH innovation labs', fr: 'Compréhension profonde des codes du luxe — du Palazzo Fendi aux labs innovation LVMH' } },
    { id: 'fashion',   label: 'Fashion Shows', cluster: 'luxury', size: 0.65, sub: 'Milan, Paris, NYC', description: { en: 'End-to-end show coordination across 3 fashion capitals', fr: 'Coordination de défilés de bout en bout dans 3 capitales de la mode' } },
    { id: 'celebrity', label: 'Celebrity Mgmt', cluster: 'luxury', size: 0.6, sub: 'Benzema, Dybala', description: { en: 'VIP campaign orchestration — 25,000+ attendees at Palazzo events', fr: 'Orchestration de campagnes VIP — 25 000+ spectateurs aux événements Palazzo' } },
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
      en: 'Engineered a full-stack financial analysis platform with a 6-step automated pipeline: data ingestion from Yahoo Finance, EDA, statistical modeling (stepwise regression, best subsets), and AI forecasting via NeuralProphet. Delivered interactive dashboards with Panel and Bokeh for real-time market insight.',
      fr: 'Conception d\'une plateforme d\'analyse financière full-stack avec un pipeline automatisé en 6 étapes : ingestion depuis Yahoo Finance, EDA, modélisation statistique (régression pas à pas, meilleurs sous-ensembles) et prévision IA via NeuralProphet. Livraison de dashboards interactifs Panel et Bokeh pour l\'analyse de marché en temps réel.',
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
      en: 'Architected an automated daily reporting system tracking 100+ influencers across Instagram, TikTok, and Twitter. Leveraged LVMH tools (Emplify, Radarly) for engagement metrics, sentiment analysis, and trend detection. Reports delivered directly to the CEO and used in weekly executive meetings.',
      fr: 'Architecture d\'un système de reporting quotidien automatisé suivant 100+ influenceurs sur Instagram, TikTok et Twitter. Exploitation des outils LVMH (Emplify, Radarly) pour les métriques d\'engagement, l\'analyse de sentiment et la détection de tendances. Rapports livrés directement au CEO et utilisés en comités de direction hebdomadaires.',
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
      en: 'Spearheaded Fendi\'s global TikTok launch, coordinating 100+ international influencers across 7+ countries. Managed end-to-end: cross-platform tracking, influencer fittings, content synchronization, and billing. Grew the channel from zero to +150K subscribers. Trained at TikTok\'s luxury department in Milan on platform strategy and algorithm optimization.',
      fr: 'Pilotage du lancement mondial TikTok de Fendi, coordonnant 100+ influenceurs internationaux dans 7+ pays. Gestion end-to-end : suivi cross-plateforme, fittings influenceurs, synchronisation de contenu et facturation. Développement du canal de zéro à +150K abonnés. Formation au département luxe de TikTok à Milan sur la stratégie plateforme et l\'optimisation algorithmique.',
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
      en: 'Orchestrated two high-profile celebrity partnerships. Paulo Dybala / AS Roma: directed the arrival event in Rome — logistics, PR, media impact analysis, and photo direction for 25,000 attendees with videomapping on the Palazzo della Civiltà. Karim Benzema / Fendi Faster: managed the sneaker ambassadorship end-to-end, including Instagram coordination, competitor benchmarking, and ROI tracking.',
      fr: 'Orchestration de deux partenariats célébrités de premier plan. Paulo Dybala / AS Roma : direction de l\'événement d\'arrivée à Rome — logistique, RP, analyse d\'impact médiatique et direction photo pour 25 000 spectateurs avec vidéomapping sur le Palazzo della Civiltà. Karim Benzema / Fendi Faster : gestion end-to-end de l\'ambassadorship sneaker, coordination Instagram, benchmark concurrentiel et suivi ROI.',
    },
    tags: ['PR', 'Event Management', 'Videomapping', 'Media Analysis', 'Social Media'],
    link: null,
    relatedSkills: ['celebrity', 'comm', 'events', 'social', 'videomapping', 'luxury'],
    context: { en: 'Fendi · 25K Live Audience', fr: 'Fendi · 25K Spectateurs' },
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
      en: 'Collaborated with IS&T Milan on Fendi\'s MLOps data pipeline, engineering the full flow from raw data ingestion through cleaning, transformation, and actionable insights extraction. Audited Java, HTML, and CSS codebases for the Heaven internal platform alongside the Qwentes development team.',
      fr: 'Collaboration avec l\'IS&T Milan sur le pipeline MLOps de Fendi, engineering du flux complet de l\'ingestion de données brutes au nettoyage, transformation et extraction d\'insights actionnables. Audit des codebases Java, HTML et CSS de la plateforme interne Heaven avec l\'équipe Qwentes.',
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
      en: 'Drove concept development and UX strategy for the FENDIDI mascot app targeting Asian markets. Coordinated cross-functional teams (design, dev, marketing) through production to go-to-market launch.',
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
      en: 'Architected an XHTML-based financial taxonomy engine automating Havas Group\'s consolidation reporting process, replacing a manual workflow used across the finance department.',
      fr: 'Architecture d\'un moteur de taxonomie financière en XHTML automatisant le processus de reporting de consolidation du Groupe Havas, remplaçant un workflow manuel utilisé par la direction financière.',
    },
    tags: ['XHTML', 'Finance', 'Automation', 'Data Processing'],
    link: null,
    relatedSkills: ['typescript', 'javascript', 'python', 'excel', 'datasci'],
    context: { en: 'Havas SA · Group Finance', fr: 'Havas SA · Finance Groupe' },
  },
  {
    id: 'portfolio',
    title:  { en: 'This Portfolio', fr: 'Ce Portfolio' },
    desc:   {
      en: 'Engineered a bento-grid portfolio with a 3D WebGL skills graph (Three.js), Hermès-inspired dual theme system, and interactive data visualizations. Zero frameworks — pure vanilla JS, Canvas 2D, and Three.js demonstrating engineering craft.',
      fr: 'Conception d\'un portfolio bento-grid avec graphe de compétences 3D WebGL (Three.js), système dual-thème inspiré Hermès et visualisations de données interactives. Zéro framework — JS vanilla pur, Canvas 2D et Three.js démontrant le savoir-faire technique.',
    },
    tags: ['Three.js', 'WebGL', 'Vanilla JS', 'Canvas 2D', 'GSAP'],
    link: null,
    relatedSkills: ['javascript', 'typescript', 'react', 'git', 'figma'],
  },
];

export const personal = {
  interests: [
    { icon: '🔧', label: { en: 'Electronics & Robotics', fr: 'Électronique & Robotique' }, detail: { en: 'Soldering iron at 9, Arduino, 3D printer at 12, InMoov humanoid robot', fr: 'Fer à souder à 9 ans, Arduino, imprimante 3D à 12 ans, robot InMoov' } },
    { icon: '🖥', label: { en: 'Custom PC Building', fr: 'PC Sur Mesure' }, detail: { en: 'Crypto mining rigs and gaming builds', fr: 'Rigs mining crypto et builds gaming' } },
    { icon: '⛵', label: { en: 'Competitive Sailing', fr: 'Voile de Compétition' }, detail: { en: 'CVEC, Laser discipline', fr: 'CVEC, discipline Laser' } },
    { icon: '🚁', label: { en: 'Drones & FPV', fr: 'Drones & FPV' }, detail: { en: 'Aerial photography to freestyle FPV', fr: 'Photo aérienne au freestyle FPV' } },
    { icon: '🪵', label: { en: 'Woodworking', fr: 'Travail du Bois' }, detail: { en: 'Building a workshop in my basement', fr: 'Construction d\'un atelier au sous-sol' } },
    { icon: '🎸', label: { en: 'Guitar & Electronics', fr: 'Guitare & Électronique' }, detail: { en: 'Building custom tone modification circuits', fr: 'Construction de circuits de modification tonale' } },
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
      en: '9-course accelerated program covering the full data science and cybersecurity pipeline — from data ingestion and EDA through ML modeling to offensive/defensive security labs. Graduated top of class.',
      fr: 'Programme accéléré de 9 cours couvrant le pipeline complet data science et cybersécurité — de l\'ingestion de données et EDA à la modélisation ML jusqu\'aux labs sécurité offensive/défensive. Major de promotion.',
    },
    techStack: ['Python', 'Pandas', 'NumPy', 'scikit-learn', 'NeuralProphet', 'statsmodels', 'Bokeh'],
    highlight: {
      gpa: '3.97',
      distinction: { en: 'Earned with Distinction', fr: 'Obtenu avec Distinction' },
      achievement: { en: 'Top of class', fr: 'Major de promotion' },
      featuredProject: 'finance-analysis',
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
