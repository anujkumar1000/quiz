# Quiz App

This is a simple React (Vite) Quiz App built to match the provided assignment requirements.

## Features implemented
- Loads questions from local JSON (`src/data/questions.json`)
- Shows one question at a time with 4 options
- Prevents moving forward without selecting (Skip not implemented)
- Tracks correct/incorrect answers and shows final score
- Results page showing summary of answers and selected vs correct
- Restart quiz to try again (resets state)
- Progress indicator (Question X of Y) and progress bar
- Timer per question (30 seconds) — auto-locks answer when time runs out
- Persistent high score stored in `localStorage`
- Responsive layout and basic accessibility (keyboard selection)
- React Router with `/` (home/quiz) and `/results` routes

## How to run locally
1. Ensure Node.js (v16+) is installed.
2. In the project folder, run:
   ```bash
   npm install
   npm run dev
   ```
3. Open the URL printed by Vite (usually http://localhost:5173).

## Notes
- The app uses local JSON so no external API needed. To use Open Trivia DB, replace the loader in `src/App.jsx`.
- Code is written with React functional components and hooks (useState, useEffect, useRef).

