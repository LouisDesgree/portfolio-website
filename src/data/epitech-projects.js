// ============================================================
// EPITECH PROJECT MAP - Parsed from EpitechPromo2026 GitHub
// 130+ projects across 5 years (2021-2025)
// ============================================================

export const epitechProjects = {
  // Year 5 - Berlin (2023-2024) - Master level
  year5: {
    label: 'Year 5 · Berlin',
    period: '2023-2024',
    projects: [
      { name: 'R-Type', code: 'B-CPP-500', lang: 'C++', category: 'gamedev', desc: { en: 'Networked multiplayer game engine', fr: 'Moteur de jeu multijoueur en réseau' } },
      { name: 'AREA', code: 'B-DEV-500', lang: 'TypeScript', category: 'web', team: true, desc: { en: 'Automation platform (IFTTT-like)', fr: 'Plateforme d\'automatisation (type IFTTT)' } },
      { name: 'Neural Network', code: 'B-CNA-500', lang: 'Python', category: 'ai', desc: { en: 'Neural network from scratch', fr: 'Réseau de neurones from scratch' } },
      { name: 'Cryptography', code: 'B-CNA-500', lang: 'Python', category: 'security', starred: true, desc: { en: 'Cryptographic algorithms implementation', fr: 'Implémentation d\'algorithmes cryptographiques' } },
      { name: 'Gomoku', code: 'B-AIA-500', lang: 'Python', category: 'ai', desc: { en: 'AI game player (minimax)', fr: 'IA de jeu (minimax)' } },
      { name: 'Graph Analysis', code: 'B-CNA-500', lang: 'Python', category: 'algorithms', desc: { en: 'Graph theory algorithms', fr: 'Algorithmes de théorie des graphes' } },
      { name: 'Survivor', code: 'B-SVR-500', lang: 'JavaScript', category: 'web', desc: { en: 'Server-side web application', fr: 'Application web côté serveur' } },
    ],
  },

  // Year 4 - Berlin (2022-2023) - Expert level
  year4: {
    label: 'Year 4 · Berlin',
    period: '2022-2023',
    projects: [
      { name: 'Zappy', code: 'B-YEP-400', lang: 'C', category: 'systems', team: true, desc: { en: 'Multiplayer network game with AI', fr: 'Jeu réseau multijoueur avec IA' } },
      { name: 'Raytracer', code: 'B-OOP-400', lang: 'C++', category: 'graphics', team: true, desc: { en: '3D ray tracing engine', fr: 'Moteur de ray tracing 3D' } },
      { name: 'Arcade', code: 'B-OOP-400', lang: 'C++', category: 'gamedev', desc: { en: 'Multi-library arcade system', fr: 'Système arcade multi-bibliothèques' } },
      { name: 'TekSpice', code: 'B-OOP-400', lang: 'C++', category: 'simulation', desc: { en: 'Logic circuit simulator', fr: 'Simulateur de circuits logiques' } },
      { name: 'The Plazza', code: 'B-CCP-400', lang: 'C++', category: 'concurrent', desc: { en: 'Concurrent kitchen simulation', fr: 'Simulation de cuisine concurrente' } },
      { name: 'Panoramix', code: 'B-CCP-400', lang: 'C', category: 'concurrent', desc: { en: 'Thread synchronization', fr: 'Synchronisation de threads' } },
      { name: 'Compressor', code: 'B-FUN-400', lang: 'Haskell', category: 'functional', desc: { en: 'Image compressor (K-means)', fr: 'Compresseur d\'images (K-means)' } },
      { name: 'Wolfram', code: 'B-FUN-400', lang: 'Haskell', category: 'functional', desc: { en: 'Cellular automata', fr: 'Automates cellulaires' } },
      { name: 'Hydra', code: 'B-SEC-400', lang: 'C', category: 'security', desc: { en: 'Security tool', fr: 'Outil de sécurité' } },
      { name: 'ASM MiniLibC', code: 'B-ASM-400', lang: 'Assembly', category: 'lowlevel', desc: { en: 'Standard C library in x86 Assembly', fr: 'Bibliothèque C standard en assembleur x86' } },
      { name: 'Math 201-209', code: 'B-MAT-400', lang: 'Python', category: 'math', count: 9, desc: { en: '9 statistical computing projects', fr: '9 projets de calcul statistique' } },
    ],
  },

  // Year 3 - Berlin (2022-2023) - Piscine Django
  year3: {
    label: 'Year 3 · Berlin',
    period: '2023 (Jan)',
    projects: [
      { name: 'Piscine C++/Haskell', code: 'B-PDG-300', lang: 'C++/Haskell', category: 'intensive', count: 13, desc: { en: '13-day coding intensive', fr: 'Intensive de code de 13 jours' } },
    ],
  },

  // Year 2 - Paris (2021-2022) - Core curriculum
  year2: {
    label: 'Year 2 · Paris',
    period: '2021-2022',
    projects: [
      { name: '42sh', code: 'B-PSU-210', lang: 'C', category: 'systems', desc: { en: 'POSIX-compliant shell', fr: 'Shell conforme POSIX' } },
      { name: 'Minishell 2', code: 'B-PSU-210', lang: 'C', category: 'systems', desc: { en: 'Advanced shell with pipes & redirects', fr: 'Shell avancé avec pipes et redirections' } },
      { name: 'Corewar', code: 'B-CPE-201', lang: 'C', category: 'vm', team: true, desc: { en: 'Virtual machine & assembler', fr: 'Machine virtuelle et assembleur' } },
      { name: 'My RPG', code: 'B-MUL-200', lang: 'C', category: 'gamedev', team: true, desc: { en: 'Full RPG with CSFML', fr: 'RPG complet avec CSFML' } },
      { name: 'My Defender', code: 'B-MUL-200', lang: 'C', category: 'gamedev', team: true, desc: { en: 'Tower defense game', fr: 'Jeu de tower defense' } },
      { name: 'Tetris', code: 'B-PSU-200', lang: 'C', category: 'gamedev', desc: { en: 'Terminal Tetris with ncurses', fr: 'Tetris en terminal avec ncurses' } },
      { name: 'Sokoban', code: 'B-PSU-200', lang: 'C', category: 'gamedev', desc: { en: 'Puzzle game', fr: 'Jeu de puzzle' } },
      { name: 'Epytodo', code: 'B-WEB-200', lang: 'JavaScript', category: 'web', desc: { en: 'REST API with Express & MySQL', fr: 'API REST avec Express et MySQL' } },
      { name: 'N4S', code: 'B-AIA-200', lang: 'C', category: 'ai', team: true, desc: { en: 'AI for autonomous driving', fr: 'IA pour conduite autonome' } },
      { name: 'Dante', code: 'B-CPE-200', lang: 'C', category: 'algorithms', desc: { en: 'Maze generation & solving', fr: 'Génération et résolution de labyrinthes' } },
      { name: 'Burp Suite', code: 'B-SEC-200', lang: 'C', category: 'security', desc: { en: 'HTTP proxy security tool', fr: 'Outil de sécurité proxy HTTP' } },
      { name: 'Popeye', code: 'B-DOP-200', lang: 'Docker', category: 'devops', desc: { en: 'Docker containerization', fr: 'Conteneurisation Docker' } },
      { name: 'Chocolatine', code: 'B-DOP-200', lang: 'CI/CD', category: 'devops', desc: { en: 'GitHub Actions CI/CD pipeline', fr: 'Pipeline CI/CD GitHub Actions' } },
      { name: 'Math 106-110', code: 'B-MAT-200', lang: 'C', category: 'math', count: 5, desc: { en: '5 numerical computing projects', fr: '5 projets de calcul numérique' } },
    ],
  },

  // Year 1 - Paris (2021) - Foundations
  year1: {
    label: 'Year 1 · Paris',
    period: '2021',
    projects: [
      { name: 'Bistromatic', code: 'B-CPE-101', lang: 'C', category: 'algorithms', team: true, desc: { en: 'Arbitrary precision calculator', fr: 'Calculatrice en précision arbitraire' } },
      { name: 'My Printf', code: 'B-PSU-100', lang: 'C', category: 'systems', desc: { en: 'Printf reimplementation', fr: 'Réimplémentation de printf' } },
      { name: 'My LS', code: 'B-PSU-100', lang: 'C', category: 'systems', desc: { en: 'LS command reimplementation', fr: 'Réimplémentation de la commande ls' } },
      { name: 'Minishell 1', code: 'B-PSU-101', lang: 'C', category: 'systems', desc: { en: 'Basic Unix shell', fr: 'Shell Unix basique' } },
      { name: 'Navy', code: 'B-PSU-101', lang: 'C', category: 'systems', team: true, desc: { en: 'Battleship with Unix signals', fr: 'Bataille navale avec signaux Unix' } },
      { name: 'Push Swap', code: 'B-CPE-110', lang: 'C', category: 'algorithms', desc: { en: 'Sorting algorithm optimization', fr: 'Optimisation d\'algorithme de tri' } },
      { name: 'BSQ', code: 'B-CPE-110', lang: 'C', category: 'algorithms', desc: { en: 'Biggest square finder', fr: 'Recherche du plus grand carré' } },
      { name: 'My Hunter', code: 'B-MUL-100', lang: 'C', category: 'gamedev', desc: { en: 'Duck Hunt clone with CSFML', fr: 'Clone de Duck Hunt avec CSFML' } },
      { name: 'My Runner', code: 'B-MUL-100', lang: 'C', category: 'gamedev', desc: { en: 'Infinite runner game', fr: 'Jeu de runner infini' } },
      { name: 'C Pool', code: 'B-CPE-100', lang: 'C', category: 'intensive', count: 13, desc: { en: '13-day C coding bootcamp', fr: 'Bootcamp C de 13 jours' } },
      { name: 'Math 101-105', code: 'B-MAT-100', lang: 'C', category: 'math', count: 5, desc: { en: '5 math & geometry projects', fr: '5 projets de maths et géométrie' } },
    ],
  },

  // Year 6 - Current (2024-2025)
  year6: {
    label: 'Year 5 · Current',
    period: '2024-2025',
    projects: [
      { name: 'EIP', code: 'G-EIP-700', lang: 'Kotlin / Swift', category: 'mobile', team: true, desc: { en: 'Innovative end-of-study project (mobile app)', fr: 'Projet innovant de fin d\'études (app mobile)' } },
    ],
  },
};

// Aggregated tech stack from all Epitech projects
export const epitechTechStack = {
  languages: [
    { name: 'C', projects: 60, level: 'expert' },
    { name: 'C++', projects: 20, level: 'advanced' },
    { name: 'Python', projects: 15, level: 'advanced' },
    { name: 'Haskell', projects: 6, level: 'intermediate' },
    { name: 'JavaScript', projects: 3, level: 'intermediate' },
    { name: 'TypeScript', projects: 2, level: 'intermediate' },
    { name: 'Assembly', projects: 1, level: 'basic' },
    { name: 'Kotlin', projects: 1, level: 'basic' },
    { name: 'Swift', projects: 1, level: 'basic' },
    { name: 'Shell', projects: 3, level: 'intermediate' },
  ],
  categories: [
    { name: { en: 'Systems Programming', fr: 'Programmation Système' }, id: 'systems', count: 12 },
    { name: { en: 'Game Development', fr: 'Développement de Jeux' }, id: 'gamedev', count: 10 },
    { name: { en: 'Algorithms & Data Structures', fr: 'Algorithmes & Structures de Données' }, id: 'algorithms', count: 8 },
    { name: { en: 'Mathematics & Statistics', fr: 'Mathématiques & Statistiques' }, id: 'math', count: 19 },
    { name: { en: 'AI & Machine Learning', fr: 'IA & Machine Learning' }, id: 'ai', count: 4 },
    { name: { en: 'Object-Oriented / C++', fr: 'Orienté Objet / C++' }, id: 'graphics', count: 5 },
    { name: { en: 'Functional Programming', fr: 'Programmation Fonctionnelle' }, id: 'functional', count: 6 },
    { name: { en: 'Security & Crypto', fr: 'Sécurité & Crypto' }, id: 'security', count: 4 },
    { name: { en: 'Web & APIs', fr: 'Web & APIs' }, id: 'web', count: 3 },
    { name: { en: 'DevOps & CI/CD', fr: 'DevOps & CI/CD' }, id: 'devops', count: 2 },
    { name: { en: 'Concurrent Programming', fr: 'Programmation Concurrente' }, id: 'concurrent', count: 2 },
    { name: { en: 'Low-Level / Assembly', fr: 'Bas Niveau / Assembleur' }, id: 'lowlevel', count: 1 },
  ],
  totalProjects: 130,
  totalYears: 5,
};
