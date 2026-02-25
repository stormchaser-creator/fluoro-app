# FluoroPath (fluoro-app) — Project Instructions

## What This Is

A Progressive Web App for California Fluoroscopy Exam preparation. Uses spaced retrieval, interleaving, and dual coding (SpeedReader) for evidence-based study.

## Tech Stack

- **Framework:** React 19.2.0 (JSX, not TypeScript)
- **Build:** Vite 7.3.1
- **PWA:** vite-plugin-pwa (ServiceWorker, offline support, auto-update)
- **Styling:** CSS with theme system (light/dark)
- **State:** Context API (AppContext, StudyContext, ThemeContext)
- **Storage:** localStorage (progress, theme, flags)

## Project Structure

```
src/
├── App.jsx                        # Main app with tab routing
├── main.jsx                       # Entry point
├── studyMaterial.js               # ~110KB structured curriculum
├── components/
│   ├── layout/                    # Header, BottomTabBar
│   ├── shared/                    # Button, Card, ProgressBar, ProgressRing
│   └── study/                     # SpeedReader, StudyIllustrations
├── tabs/                          # HomeTab, StudyTab, ReviewTab, ProgressTab, ProfileTab
├── context/                       # AppContext, StudyContext
├── data/
│   ├── domains.js                 # Study domains
│   ├── questions.js               # ~43KB question bank
│   ├── equipmentPhysicsStudyGuide.js  # ~64KB physics content
│   ├── phases.js, badges.js, confusables.js
├── hooks/useLocalStorage.js
└── theme/                         # ThemeContext, theme.js
```

## Key Commands

```bash
cd /Users/whit_1/Desktop/fluoro-app
npm run dev        # Vite dev server (port 5173)
npm run build      # Production build → dist/
npm run preview    # Preview production build
```

## Key Features

- Multi-tab interface (Home, Study, Review, Progress, Profile)
- Spaced retrieval quiz system with missed/flagged question tracking
- SpeedReader component for rapid text learning
- Badge system for progress gamification
- Light/dark theme with localStorage persistence
- PWA — installable, works offline, auto-updating service worker

## Related

- `/Users/whit_1/Desktop/Fluoro/` — Archive of study materials, PDFs, and legacy HTML prototype
- `studyMaterial.js` implements the curriculum from those source materials

## Conventions

- Data files (questions, study material) are large JS exports — edit carefully
- Tab components are the main page-level components
- Three contexts: App (global state), Study (study session), Theme (appearance)
- Adding new content: edit data files in `src/data/`, not components
