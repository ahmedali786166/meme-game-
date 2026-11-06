<div align="center">
  <img src="icons/icon-192.png" width="96" height="96" alt="Shahenshah Flap icon" />
  <h1>Shahenshah Flap</h1>
  <p>Flappy meme edition. Dodge the blazing fire pillars, chase a high score, and unlock meme ranks.</p>
</div>

## Play

https://shahenshah-meme-game.vercel.app/

## Features

- Flappy Bird gameplay with animated fire pillars, sparks, screen shake, meme quotes, and score ranks
- Installable PWA with `manifest.json`, service worker offline support, and app icons
- Settings gear on the start screen with a saved mute/unmute toggle for all game sounds
- Invite a Friend buttons on the start and game-over screens (native Web Share API, clipboard fallback)
- Responsive overlays with safe-area support for phones, tablets, and desktop

## Run locally

The game is a static site with no build step. Serve the folder over HTTP; service workers require
`localhost` or HTTPS.

```bash
npx serve .
```

Then open the printed local URL. You can also use any static server, for example:

```bash
python -m http.server 8080
```

## Deploy

The game is live on Vercel at https://shahenshah-meme-game.vercel.app/

To redeploy after changes:

```bash
npx vercel --prod
```

The same folder also works on GitHub Pages: **Settings → Pages → Deploy from a branch**,
branch **main**, folder **/ (root)**. All paths are relative, so it runs from either the
Vercel root or the GitHub Pages `/meme-game-/` subpath.

## Project structure

```text
index.html              Self-contained game (HTML, CSS, JS, embedded assets)
manifest.json           PWA metadata and icons
sw.js                   Service worker: offline shell and asset caching
icons/                  PWA, maskable, Apple touch, and favicon images
.nojekyll               GitHub Pages static hosting marker
dev-archive/            Original AI Studio scaffold, generator, and raw assets (unused at runtime)
```

## Notes

- High score is stored in `localStorage` under `shahenshah_best_score`.
- The sound preference is stored under `shahenshah_muted`.
- The native install prompt only appears in supported browsers after page engagement. The
  **Install App** button uses that prompt when available and otherwise shows the correct
  browser or iOS "Add to Home Screen" instructions.
