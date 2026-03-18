# HANDOFF PROMPT — Portfolio Website Content Enrichment

> **CRITICAL INSTRUCTION**: You are updating a live portfolio website for Louis Desgrée. You MUST edit `src/data/content.js` directly. Do NOT create new files, do NOT refactor, do NOT touch any JS/CSS/HTML besides `content.js`. You are a content writer with access to code. Act like it.

---

## YOUR MISSION

You will update `src/data/content.js` with enriched, accurate data extracted from Louis's Google Drive files. Everything you need is below. You have ONE job: make every section of this portfolio richer, more specific, and more impressive — using REAL data, not fluff.

**RULES — READ THESE OR FAIL:**

1. **ONLY edit `src/data/content.js`** — touch nothing else
2. **Every field is bilingual `{ en: '...', fr: '...' }`** — you MUST provide both languages for every string you write
3. **Do NOT remove existing data** — only ADD or ENHANCE
4. **Do NOT invent metrics or achievements** — only use data from the extracted files below
5. **Do NOT add comments or explanations in the code** — just clean data
6. **Match the existing code style exactly** — single quotes, same indentation, trailing commas
7. **Test that your JS is valid** — no syntax errors, all brackets closed, all quotes matched
8. **The file uses ES module exports** — `export const varName = ...`
9. **Every experience needs `relatedSkills: [...]`** referencing valid skill node IDs from the `skills.nodes` array
10. **Every project needs `relatedSkills: [...]`** referencing valid skill node IDs

---

## FILE STRUCTURE

The file exports these objects (in order):
- `nav` — section labels (don't touch)
- `hero` — subtitle + availability
- `about` — paragraphs + stats
- `experiences` — array of work experiences
- `skills` — clusters, nodes, edges
- `projects` — array of portfolio projects
- `personal` — interests + current project
- `education` — array of education entries
- `contact` — email, phone, location
- `languages` — array of language proficiencies

---

## CURRENT SKILL NODE IDs (for relatedSkills references)

**Engineering:** `c`, `cpp`, `systems`, `networking`, `threads`, `asm`, `haskell`, `gamedev`
**Data & AI:** `python`, `datasci`, `ai`, `mlops`, `pandas`, `sklearn`, `stats`, `dataviz`, `hadoop`
**Web & Apps:** `java`, `typescript`, `javascript`, `react`, `kotlin`, `swift`
**Security:** `cybersec`, `offensive`, `defensive`, `crypto`
**Tools:** `git`, `docker`, `linux`, `vscode`, `cicd`, `aitools`
**Business:** `excel`, `powerbi`, `tableau`, `figma`, `ppt`, `analytics`, `crm`, `comm`, `events`, `teamwork`, `emplify`, `radarly`, `social`
**Luxury:** `luxury`, `fashion`, `celebrity`, `videomapping`

---

## EXTRACTED DATA FROM GOOGLE DRIVE — USE THIS

### FENDI INTERNSHIP (6 months, Rome, 2022)

The current description is already long. ENHANCE it with these missing details:

**TikTok numbers are WRONG in current site** — the real numbers from his internship report:
- **350+ million views** across TikTok campaigns (current site only says 150K subscribers)
- **80 individual influencers** mobilized worldwide (current site says 100+, the report says 75-80)
- Partnered with **K-pop star Zico** from Korea for the campaign
- Coordinated influencer **fittings and billing** end-to-end

**Dybala event correction:**
- **15,000 fans** at Fendi HQ (current site says 25,000 — use the number from the internship report: 15,000)
- AS Roma collaboration
- Ballon d'Or ceremony coverage for Benzema

**Missing from current description:**
- **Blockchain & Metaverse**: Collaborated with LVMH "Aura" team on NFT/crypto/sustainable traceability projects
- **Video production**: Collaborated with 3D artists, optimized video formats for Facebook, TikTok, Instagram, Twitter, Douyin, LinkedIn
- **Tools used**: Outlook, Teams, Zoom, ICOM, KeePass, VPN, Canva, Adobe Suite
- **Internal website "Heaven"**: Reviewed code with Qwentes dev team in Milan — employee portal for item prices, availability, brand activity

**Fendi company context** (for expanded tile, not the short description):
- Founded 1925 by Adele & Edoardo Fendi in Rome
- HQ: Palazzo della Civilta Italiana, EUR district
- Annual revenue: €80M, 3,000-3,500 employees
- Karl Lagerfeld joined 1965, Kim Jones current designer since 2020

### DLABS / SMODE (2025-2026)

Current description is good. Add to relatedSkills: `'java'` is already there but also consider adding `'cicd'` since he worked on pipeline tools.

### HAVAS SA (2025)

Current description is good. No changes needed.

### PARALYMPIC GAMES (2024)

Current description is good. No changes needed.

### LVMH / Y-SARL (2023)

Enhance: Selected the **Gustave Eiffel Hall** specifically. Contacted commercial teams for venue specifications. Prepared organizational documentation. This was for LVMH leadership.

### LVMH METAVERSE (2022)

Enhance: He **designed the metaverse experience room** and personally **explained metaverse functionality to LVMH group leadership**. This role directly led to his Fendi internship recruitment.

---

## NEW PROJECTS TO ADD

### 1. UCLA Cybersecurity Lab Portfolio (NEW PROJECT)

```js
{
  id: 'ucla-cyber-labs',
  title: { en: 'UCLA Cybersecurity Lab Portfolio', fr: 'Portfolio Labs Cybersécurité UCLA' },
  desc: {
    en: 'Completed 15+ hands-on security labs across offensive and defensive domains: penetration testing with Metasploit against Metasploitable 2, SQL injection and XSS exploitation in DVWA, Wi-Fi cracking with Aircrack-ng, USB keystroke injection with Rubber Ducky, NFC wallet security testing with Flipper Zero, IDS deployment with Snort 3, firewall configuration with SmoothWall, and incident response planning. Built a full virtualized security environment with 5+ VMs including Kali Linux router, DVWA web server, and Snort IDS.',
    fr: 'Réalisation de 15+ labs pratiques en sécurité offensive et défensive : tests d\'intrusion avec Metasploit contre Metasploitable 2, injection SQL et exploitation XSS dans DVWA, cracking Wi-Fi avec Aircrack-ng, injection de frappes USB avec Rubber Ducky, test sécurité NFC avec Flipper Zero, déploiement IDS avec Snort 3, configuration firewall SmoothWall, et planification de réponse aux incidents. Construction d\'un environnement de sécurité virtualisé complet avec 5+ VMs incluant routeur Kali Linux, serveur web DVWA et IDS Snort.',
  },
  tags: ['Metasploit', 'Nmap', 'Nikto', 'DVWA', 'Aircrack-ng', 'Flipper Zero', 'Snort', 'Kali Linux'],
  link: null,
  relatedSkills: ['cybersec', 'offensive', 'defensive', 'linux', 'networking', 'python'],
  context: { en: 'UCLA · 15+ Labs', fr: 'UCLA · 15+ Labs' },
}
```

### 2. Penetration Testing Report (NEW PROJECT)

```js
{
  id: 'pentest-report',
  title: { en: 'Enterprise Penetration Testing Report', fr: 'Rapport de Test d\'Intrusion Entreprise' },
  desc: {
    en: 'Authored a comprehensive penetration test report covering full attack lifecycle: reconnaissance of target infrastructure (1,347 IPv4 prefixes, 8 data centers), vulnerability scanning with Nmap and Nikto, exploitation via VSFTPD backdoor for root access, XSS and SQL injection attacks, and social engineering with SET credential harvester. Included risk assessment matrices and remediation roadmap.',
    fr: 'Rédaction d\'un rapport complet de test d\'intrusion couvrant le cycle d\'attaque complet : reconnaissance d\'infrastructure cible (1 347 préfixes IPv4, 8 datacenters), scan de vulnérabilités avec Nmap et Nikto, exploitation via backdoor VSFTPD pour accès root, attaques XSS et injection SQL, et ingénierie sociale avec SET. Incluant matrices d\'évaluation des risques et feuille de route de remédiation.',
  },
  tags: ['Nmap', 'Nikto', 'Metasploit', 'SET', 'OSINT', 'Kali Linux'],
  link: null,
  relatedSkills: ['cybersec', 'offensive', 'networking', 'linux'],
  context: { en: 'UCLA · Full Attack Lifecycle', fr: 'UCLA · Cycle d\'Attaque Complet' },
}
```

### 3. AssistPaper — EIP Innovation Project (NEW PROJECT)

```js
{
  id: 'assistpaper',
  title: { en: 'AssistPaper · iOS Administrative Assistant', fr: 'AssistPaper · Assistant Administratif iOS' },
  desc: {
    en: 'Led development of an iOS app simplifying French administrative procedures through guided questionnaires and automated PDF form generation. Built with Swift, Firebase hosting, Google/Apple/Facebook OAuth. Designed beta test plans, security architecture, and social media growth strategy. Epitech 5-year Innovation Project (EIP).',
    fr: 'Direction du développement d\'une app iOS simplifiant les démarches administratives françaises via questionnaires guidés et génération automatique de formulaires PDF. Développé en Swift, hébergement Firebase, OAuth Google/Apple/Facebook. Conception des plans de test beta, architecture sécurité et stratégie de croissance réseaux sociaux. Projet d\'Innovation Epitech 5 ans (EIP).',
  },
  tags: ['Swift', 'Firebase', 'OAuth', 'iOS', 'PDF Generation', 'UX'],
  link: null,
  relatedSkills: ['swift', 'kotlin', 'figma', 'comm', 'teamwork'],
  context: { en: 'Epitech EIP · 5-Year Project', fr: 'Epitech EIP · Projet 5 Ans' },
}
```

### 4. Financial Bot / Investment Platform (NEW PROJECT)

```js
{
  id: 'financial-bot',
  title: { en: 'Financial Bot · Gamified Investment Learning', fr: 'Bot Financier · Apprentissage Investissement Gamifié' },
  desc: {
    en: 'Designed a gamified investment learning platform with a battle-pass model (free tier) aimed at making finance accessible to retail investors. Focused on reducing the knowledge gap between institutional and individual investors through interactive challenges and real-time market data.',
    fr: 'Conception d\'une plateforme gamifiée d\'apprentissage de l\'investissement avec modèle battle-pass (gratuit) visant à rendre la finance accessible aux investisseurs particuliers. Réduction de l\'écart de connaissances entre investisseurs institutionnels et individuels via challenges interactifs et données de marché en temps réel.',
  },
  tags: ['Finance', 'Gamification', 'UX Design', 'Investment'],
  link: null,
  relatedSkills: ['python', 'datasci', 'figma', 'comm'],
  context: { en: 'Personal Project', fr: 'Projet Personnel' },
}
```

---

## SKILLS — NEW NODES TO ADD

Add these to `skills.nodes` array:

```js
{ id: 'metasploit', label: 'Metasploit', cluster: 'security', size: 0.6, sub: 'Exploitation', description: { en: 'Exploitation framework — VSFTPD backdoor, Meterpreter sessions, post-exploitation', fr: 'Framework d\'exploitation — backdoor VSFTPD, sessions Meterpreter, post-exploitation' } },
{ id: 'nmap', label: 'Nmap', cluster: 'security', size: 0.55, sub: 'Scanning', description: { en: 'Network scanning and service enumeration across enterprise infrastructure', fr: 'Scan réseau et énumération de services sur infrastructure entreprise' } },
{ id: 'snort', label: 'Snort IDS', cluster: 'security', size: 0.5, sub: 'Detection', description: { en: 'Intrusion detection system deployment and rule configuration', fr: 'Déploiement de système de détection d\'intrusion et configuration de règles' } },
{ id: 'aircrack', label: 'Aircrack-ng', cluster: 'security', size: 0.5, sub: 'Wi-Fi', description: { en: 'Wireless security auditing — WPA2 handshake capture and cracking', fr: 'Audit sécurité sans fil — capture et cracking de handshake WPA2' } },
```

Add these edges:
```js
['metasploit', 'cybersec'], ['metasploit', 'offensive'], ['nmap', 'cybersec'], ['nmap', 'offensive'],
['snort', 'defensive'], ['snort', 'cybersec'], ['aircrack', 'offensive'], ['aircrack', 'cybersec'],
['metasploit', 'nmap'], ['snort', 'linux'],
```

---

## EDUCATION — ENHANCE UCLA ENTRY

The UCLA entry should mention the cybersecurity concentration more prominently. Add these course topics if there's a `highlight.streams` array:
- Penetration Testing (Metasploit, Nmap, Nikto)
- Web Application Security (SQL Injection, XSS, DVWA)
- Network Security (Firewalls, IDS, Wireless)
- Incident Response & Disaster Recovery
- Digital Forensics & OSINT

---

## ABOUT SECTION — UPDATE STATS

Update `about.stats`:
- Change `projects: '135+'` → keep as is (Epitech count is separate)
- The TikTok number should reference **350M+ views** somewhere in paragraphs if not already

Update paragraph 2 (Fendi paragraph) to include **350+ million views** instead of just subscribers:
```
...spearheaded a global TikTok launch reaching 350M+ views and +150K subscribers across 7 countries...
```

---

## PERSONAL SECTION — ADD TO currentProject

If `General Commander` is still the current project, keep it. But also consider updating the description to reflect it's an **AI agent platform** — the Drive files show Louis is building investment automation tools.

---

## WHAT SUCCESS LOOKS LIKE

When you're done, `content.js` should:
1. Have 4 NEW projects (ucla-cyber-labs, pentest-report, assistpaper, financial-bot)
2. Have 4 NEW skill nodes (metasploit, nmap, snort, aircrack) with edges
3. Have ENHANCED Fendi description with corrected TikTok numbers (350M+ views)
4. Have ENHANCED LVMH Metaverse description
5. Have ENHANCED about paragraphs with updated metrics
6. Have UPDATED education with cybersecurity course details
7. ALL bilingual (en + fr)
8. ALL relatedSkills referencing valid node IDs
9. ZERO syntax errors — valid JavaScript that can be imported

**DO NOT:**
- Add projects that don't exist (no hallucinated work)
- Change the file structure or exports
- Touch any other file
- Add TODO comments or placeholder text
- Skip the French translations
- Forget trailing commas in arrays/objects

**START by reading the current `src/data/content.js` file in full, then make your edits.**
