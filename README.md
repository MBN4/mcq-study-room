# MCQ Study Room

An animated React study app for exam prep: read a study guide for each group, then practise one question at a time with instant feedback.

**800 questions across three subjects**

| Subject | Questions | Groups |
| --- | --- | --- |
| Midterm MCQs (Bayes, K-means, metrics, statistics) | 200 | 4 |
| Research Methodology | 500 | 10 |
| Machine Learning | 100 | 2 |

## Features

- Study guide before each group of 50 questions, with formula callouts
- Instant feedback: correct answers pop with confetti, wrong answers shake
- Reveal answer plus an explanation for every question (detailed explanations for the Midterm set)
- Question map showing correct, wrong and open questions; click any number to jump to it
- Streak counter, animated progress bars and a score ring at the end of each group
- Optional shuffling of answer options, stable per question
- Dark "Aurora Dusk" and light "Daybreak" themes
- Progress is saved in `localStorage`
- Keyboard shortcuts: `1–4` / `A–D` answer · `←` `→` navigate · `R` reveal · `G` guide · `Enter` start
- Respects `prefers-reduced-motion`

## Tech

React 19 · Vite · Framer Motion · canvas-confetti. No backend.

## Run locally

```bash
npm install
npm run dev
```

Production build: `npm run build` (output in `dist/`, served from a relative base so any static host works).

## Deploy

`.github/workflows/deploy.yml` publishes to GitHub Pages on every push to `main`.
Enable it once under **Settings → Pages → Source: GitHub Actions**.

## Editing questions

Question banks live in `src/data/` as compact rows:

```js
["Question text", "Option A", "Option B", "Option C", "Option D", "B"]
```

Study guides and subject metadata are in `src/data/index.js`. Midterm explanations are in `src/data/midtermExtras.js`.
