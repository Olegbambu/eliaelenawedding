# Elia & Elena wedding site

Single-page wedding website. React 19 + Vite 8 + Tailwind CSS 4, animations with GSAP, smooth scroll with Lenis, Three.js for 3D effects, icons from lucide-react. Plain JavaScript (JSX), no TypeScript. UI copy is in Italian.

## Commands

- `npm run dev` — dev server on http://localhost:5173
- `npm run build` — production build to `dist/`
- `npm run lint` — ESLint
- `npm run preview` — serve the production build

Node >= 22.12 required.

## Layout

- `src/App.jsx` — composes the sections
- `src/components/` — one file per section (Hero, Story, Details, Rsvp, Gifts, Footer, Navbar) plus decorative pieces (ButterflyBackground, WeddingLogo)
- `src/assets/` — photos and images, imported from components
- `public/` — static files served as-is

## Environment

- `.env.development` (used by `npm run dev`) and `.env.production` (used by `npm run build`) are gitignored. `.env.example` lists the variables.
- `VITE_WEB3FORMS_ACCESS_KEY` — Web3Forms key used by the RSVP form (`src/components/Rsvp.jsx`). Only `VITE_`-prefixed variables reach the browser.
- Claude may read and edit the `.env.*` files.

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) builds on push to `main` and deploys to GitHub Pages. CI has no `.env` files: the key comes from the repository secret `WEB3FORMS_ACCESS_KEY`. `vite.config.js` uses `base: './'` for Pages.

## Conventions

- Test visual changes on mobile and desktop widths; the hero and scroll animations are sensitive to viewport size.
- Keep commits small, one change each, with an imperative subject line.
