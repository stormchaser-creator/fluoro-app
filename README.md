# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Study coach

Open the study coach from the sign-in screen or Home, or use `/fluoro-app/?coach`. It runs without an account and stores progress separately in this browser. Export/import backups to move progress between devices.

- 21 teaching lessons with visual explanations, worked examples, teach-back prompts, and 160 original multiple-choice questions across the five ARRT categories; a 15-item baseline and adaptive daily practice. This is a limited formative bank, not comprehensive exam preparation or a pass predictor.
- Each question explains all four choices. A mistake/uncertainty queue links back to the relevant lesson. Timed practice offers 30 questions/40 minutes and 110 questions/120 minutes, with proportional category quotas and feedback deferred until submission. All practice items are graded; these are not official scaled scores.
- Unseen-only selection checks every category before starting and refuses insufficient pools. Displays and attempts are tracked locally; old backups cannot reconstruct unrecorded displays. Results separate new-at-session-start items from repeats. Timed answers and the original deadline survive a reload in this browser; live sessions are excluded from exported progress backups.
- The Coverage tab links course lessons to category targets and explicitly identifies gaps requiring outside study. The 160-item bank includes 12 earlier numerical variants and cannot supply multiple independent full-length exams.
- Incorrect answers return in 10 minutes; uncertain correct answers tomorrow; confident answers after 1, 3, 7, 14, then 30 days.
- The Sources tab links the published ARRT outline (effective January 2023), current candidate information, CDPH, FDA, IAEA, and ACR.
- The older 395-item bank remains self-graded recall. Its 75% practice target is unrelated to the official scaled passing score. New review records use the question’s stable domain-local position; old erroneous shuffled records cannot be reliably repaired.

Run `npm test` for study scheduling, selection, backup validation, review identity, lesson/practice transitions, distractor explanations, visual toggles, error repair, and timed answer navigation. Run `npm run build` for the full PWA. Run `npm run build:coach` to create `dist/fluoropath-study-coach.html`, a self-contained portable coach with no remote runtime dependencies. Open that HTML in a browser; local-file storage behavior varies, so export backups. Rebuild the portable file after source changes.

The clinical-content corrections cover metformin, renal contrast risk, fasting, and extravasation, checked against ACR’s 2026 manual. Other legacy statements still need a complete source audit. Email attachments, private email links, and application records are intentionally kept out of this repository.
