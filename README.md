<div align="center">
  <img src="icons/icon-192.png" width="96" height="96" alt="Shahenshah Flap icon" />
  <h1>Shahenshah Flap</h1>
  <p>Flappy meme edition. Dodge the blazing fire pillars, chase a high score, and unlock meme ranks.</p>
</div>

## Play

https://ahmedali786166.github.io/meme-game-/

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

## Deploy to GitHub Pages

1. Open the repository on GitHub and go to **Settings → Pages**
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**
3. Choose branch **main** and folder **/ (root)**, then click **Save**

All paths are relative, so the game works from the `/meme-game-/` project subpath. `.nojekyll`
disables Jekyll processing so files are served exactly as committed.

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
