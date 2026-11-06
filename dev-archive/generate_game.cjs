const fs = require('fs');

const assets = JSON.parse(fs.readFileSync('assets-base64.json', 'utf8'));

const template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <title>Shahenshah Flap</title>
  <meta name="description" content="A high-octane Flappy Bird game featuring the legendary Bollywood meme character dodging animated fire pillars with custom voice lines and physics." />
  <meta property="og:title" content="Shahenshah Flap" />
  <meta property="og:description" content="A high-octane Flappy Bird game featuring the legendary Bollywood meme character dodging animated fire pillars with custom voice lines and physics." />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Rajdhani:wght@600;700&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      touch-action: manipulation;
    }
    body, html {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #090306;
      font-family: "Rajdhani", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #game-wrapper {
      position: relative;
      width: 100vw;
      height: 100vh;
      max-width: 480px;
      max-height: 860px;
      overflow: hidden;
      background: #110408;
      box-shadow: 0 0 50px rgba(255, 69, 0, 0.4), 0 0 30px rgba(0, 0, 0, 0.95);
      border-radius: 16px;
      border: 1px solid rgba(255, 100, 0, 0.3);
    }
    @media (max-width: 480px), (max-height: 860px) {
      #game-wrapper {
        max-width: 100vw;
        max-height: 100vh;
        border-radius: 0;
        box-shadow: none;
        border: none;
      }
    }
    canvas#game-canvas {
      display: block;
      width: 100%;
      height: 100%;
      background: #0d0408;
    }

    /* Top HUD */
    #hud {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      pointer-events: none;
      z-index: 10;
    }
    .hud-left {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .best-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(20, 5, 10, 0.75);
      border: 1px solid rgba(255, 170, 0, 0.5);
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      color: #ffcc00;
      backdrop-filter: blur(6px);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    }
    .hud-score-container {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .hud-score {
      font-family: "Cinzel", Georgia, serif;
      font-size: 52px;
      font-weight: 900;
      line-height: 1;
      color: #ffffff;
      text-shadow: 0 0 12px #ff5500, 0 0 24px #ff2200, 0 3px 8px rgba(0, 0, 0, 0.95);
      letter-spacing: 2px;
      transition: transform 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .score-pulse {
      transform: scale(1.35);
      color: #ffe600;
      text-shadow: 0 0 18px #ffaa00, 0 0 35px #ff4500;
    }
    .hud-controls {
      display: flex;
      gap: 8px;
      pointer-events: auto;
    }
    .hud-btn {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      border: 1px solid rgba(255, 170, 0, 0.5);
      background: rgba(30, 8, 12, 0.8);
      backdrop-filter: blur(8px);
      color: #ffcc00;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 19px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.5);
      transition: all 0.2s;
    }
    .hud-btn:hover {
      background: rgba(255, 69, 0, 0.4);
      border-color: #ffaa00;
      transform: scale(1.05);
    }
    .hud-btn:active {
      transform: scale(0.92);
      background: rgba(255, 80, 0, 0.6);
    }

    /* Screen overlays */
    .screen-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 20px;
      background: radial-gradient(circle at center, rgba(32, 8, 16, 0.88) 0%, rgba(10, 2, 5, 0.97) 100%);
      backdrop-filter: blur(6px);
      z-index: 20;
      text-align: center;
      transition: opacity 0.3s ease;
    }
    .hidden {
      display: none !important;
      opacity: 0;
      pointer-events: none;
    }

    /* Start screen styling */
    .game-logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 18px;
    }
    .logo-flame {
      font-size: 46px;
      filter: drop-shadow(0 0 16px #ff4500);
      animation: flameWiggle 1.6s infinite ease-in-out;
    }
    .logo-title {
      font-family: "Cinzel", Georgia, serif;
      font-size: 40px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 3px;
      background: linear-gradient(180deg, #ffffff 0%, #ffdf00 35%, #ff5500 75%, #b30000 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 0 18px rgba(255, 85, 0, 0.85));
      margin-top: -6px;
      line-height: 1.1;
    }
    .logo-subtitle {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 4px;
      color: #ff9955;
      text-transform: uppercase;
      margin-top: 4px;
    }

    .character-avatar-preview {
      width: 135px;
      height: 110px;
      position: relative;
      margin: 10px 0 22px;
      animation: floatBob 2.2s infinite ease-in-out;
      background: transparent;
    }
    .character-avatar-preview img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 8px 18px rgba(255, 69, 0, 0.7));
      background: transparent;
    }

    .btn-main {
      appearance: none;
      border: none;
      outline: none;
      cursor: pointer;
      font-family: "Cinzel", Georgia, serif;
      font-size: 21px;
      font-weight: 900;
      letter-spacing: 2px;
      padding: 16px 38px;
      border-radius: 40px;
      color: #ffffff;
      background: linear-gradient(135deg, #ff9900 0%, #ff2600 55%, #990000 100%);
      box-shadow: 0 0 28px rgba(255, 60, 0, 0.75), 0 5px 16px rgba(0, 0, 0, 0.85), inset 0 2px 3px rgba(255, 255, 255, 0.5);
      transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
      display: inline-flex;
      align-items: center;
      gap: 12px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
      animation: buttonPulse 1.9s infinite ease-in-out;
    }
    .btn-main:hover {
      transform: translateY(-2px) scale(1.04);
      box-shadow: 0 0 40px rgba(255, 80, 0, 0.95), 0 8px 20px rgba(0, 0, 0, 0.9);
    }
    .btn-main:active {
      transform: translateY(2px) scale(0.96);
    }

    .instructions-card {
      margin-top: 22px;
      background: rgba(30, 8, 15, 0.7);
      border: 1px solid rgba(255, 136, 0, 0.35);
      border-radius: 14px;
      padding: 12px 20px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 13px;
      color: #ffbb88;
      backdrop-filter: blur(6px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    }
    .instruction-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .key-badge {
      display: inline-block;
      background: #2b0b14;
      border: 1px solid #ff7700;
      color: #ffffff;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 11px;
    }

    /* Game Over styling */
    .gameover-title {
      font-family: "Cinzel", Georgia, serif;
      font-size: 40px;
      font-weight: 900;
      color: #ff3300;
      text-transform: uppercase;
      letter-spacing: 2px;
      text-shadow: 0 0 16px #ff0000, 0 0 32px #990000;
      animation: shakeTitle 0.6s ease;
      line-height: 1.1;
    }
    .gameover-quote {
      font-size: 15px;
      font-weight: 700;
      font-style: italic;
      color: #ffcc00;
      margin: 8px 0 18px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
      max-width: 320px;
      line-height: 1.3;
    }
    .scorecard {
      width: 100%;
      max-width: 310px;
      background: rgba(25, 6, 12, 0.88);
      border: 2px solid rgba(255, 102, 0, 0.5);
      border-radius: 16px;
      padding: 18px 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8), inset 0 0 25px rgba(255, 51, 0, 0.2);
      margin-bottom: 22px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .scorecard-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 8px;
      border-bottom: 1px dashed rgba(255, 120, 0, 0.3);
    }
    .scorecard-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .scorecard-label {
      font-size: 14px;
      font-weight: 700;
      color: #ffa366;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .scorecard-val {
      font-family: "Cinzel", Georgia, serif;
      font-size: 30px;
      font-weight: 900;
      color: #ffffff;
      text-shadow: 0 0 10px rgba(255, 200, 0, 0.7);
    }
    .scorecard-val.highlight {
      color: #ffcc00;
      text-shadow: 0 0 14px #ff8800;
    }
    .scorecard-rank {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px 14px;
      background: linear-gradient(90deg, rgba(255, 100, 0, 0.25), rgba(255, 50, 0, 0.45), rgba(255, 100, 0, 0.25));
      border-radius: 20px;
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
      border: 1px solid rgba(255, 150, 0, 0.45);
      text-shadow: 0 1px 3px rgba(0,0,0,0.8);
    }

    @keyframes flameWiggle {
      0%, 100% { transform: scale(1) rotate(-3deg); }
      50% { transform: scale(1.18) rotate(3deg); }
    }
    @keyframes floatBob {
      0%, 100% { transform: translateY(0px) rotate(-3deg); }
      50% { transform: translateY(-14px) rotate(3deg); }
    }
    @keyframes buttonPulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 24px rgba(255, 60, 0, 0.65); }
      50% { transform: scale(1.04); box-shadow: 0 0 38px rgba(255, 100, 0, 0.95); }
    }
    @keyframes shakeTitle {
      0%, 100% { transform: translate(0, 0); }
      20% { transform: translate(-5px, 2px); }
      40% { transform: translate(5px, -2px); }
      60% { transform: translate(-4px, -2px); }
      80% { transform: translate(4px, 2px); }
    }
  </style>
</head>
<body>
  <div id="game-wrapper">
    <canvas id="game-canvas"></canvas>

    <!-- Top HUD -->
    <div id="hud">
      <div class="hud-left">
        <div class="best-badge">
          <span>🏆 BEST:</span>
          <span id="hud-best-score">0</span>
        </div>
      </div>
      <div class="hud-score-container">
        <div id="hud-current-score" class="hud-score">0</div>
      </div>
      <div class="hud-controls">
        <button id="btn-sound-toggle" class="hud-btn" aria-label="Toggle Sound">🔊</button>
      </div>
    </div>

    <!-- Start Screen Overlay -->
    <div id="start-screen" class="screen-overlay">
      <div class="game-logo">
        <div class="logo-flame">🔥</div>
        <h1 class="logo-title">SHAHENSHAH</h1>
        <div class="logo-subtitle">FLAPPY MEME EDITION</div>
      </div>

      <div class="character-avatar-preview">
        <img id="preview-avatar-img" alt="Flying Character" />
      </div>

      <button id="btn-start" class="btn-main">
        <span>▶</span>
        <span>TAP TO PLAY</span>
      </button>

      <div class="instructions-card">
        <div class="instruction-row">
          <span class="key-badge">TAP SCREEN</span> or <span class="key-badge">SPACEBAR</span> to Jump
        </div>
        <div class="instruction-row">
          <span>Dodge the blazing fire pillars!</span>
        </div>
      </div>
    </div>

    <!-- Game Over Screen Overlay -->
    <div id="game-over-screen" class="screen-overlay hidden">
      <h2 class="gameover-title">SAMAY SAMAPT!</h2>
      <div id="gameover-quote" class="gameover-quote">"Rishte me toh hum tumhare baap lagte hain!"</div>

      <div class="scorecard">
        <div class="scorecard-item">
          <span class="scorecard-label">SCORE</span>
          <span id="gameover-score" class="scorecard-val">0</span>
        </div>
        <div class="scorecard-item">
          <span class="scorecard-label">BEST RECORD</span>
          <span id="gameover-best" class="scorecard-val highlight">0</span>
        </div>
        <div class="scorecard-rank">
          <span>👑 RANK:</span>
          <span id="gameover-rank">Shahenshah</span>
        </div>
      </div>

      <button id="btn-restart" class="btn-main">
        <span>🔄</span>
        <span>PLAY AGAIN</span>
      </button>
    </div>
  </div>

  <script>
    // Embedded Base64 Assets: Transparent Character Sprite + 3 Audio Files (Start, Jump, Hit/Game Over)
    const ASSETS = {
      playerImg: "DATA_PLAYER_IMG",
      startAudio: "DATA_START_AUDIO",
      jumpAudio: "DATA_JUMP_AUDIO",
      hitAudio: "DATA_HIT_AUDIO"
    };

    // DOM Elements
    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");
    const wrapper = document.getElementById("game-wrapper");
    const startScreen = document.getElementById("start-screen");
    const gameOverScreen = document.getElementById("game-over-screen");
    const hudScore = document.getElementById("hud-current-score");
    const hudBest = document.getElementById("hud-best-score");
    const btnStart = document.getElementById("btn-start");
    const btnRestart = document.getElementById("btn-restart");
    const btnSound = document.getElementById("btn-sound-toggle");
    const previewAvatar = document.getElementById("preview-avatar-img");
    const gameOverScoreEl = document.getElementById("gameover-score");
    const gameOverBestEl = document.getElementById("gameover-best");
    const gameOverQuoteEl = document.getElementById("gameover-quote");
    const gameOverRankEl = document.getElementById("gameover-rank");

    // Display transparent preview avatar
    previewAvatar.src = ASSETS.playerImg;

    // Advanced Hybrid Audio Engine: Web Audio API (instant 0ms response) + HTML5 Audio fallback
    class SoundEngine {
      constructor() {
        this.muted = localStorage.getItem("shahenshah_muted") === "true";
        this.updateButtonUI();

        // Web Audio Context initialization
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = AudioCtx ? new AudioCtx() : null;
        this.buffers = {};
        this.activeSources = [];

        // HTML5 Audio fallbacks
        this.htmlAudios = {
          start: new Audio(ASSETS.startAudio),
          jump: [
            new Audio(ASSETS.jumpAudio),
            new Audio(ASSETS.jumpAudio),
            new Audio(ASSETS.jumpAudio),
            new Audio(ASSETS.jumpAudio)
          ],
          hit: new Audio(ASSETS.hitAudio)
        };
        this.jumpIdx = 0;

        // Decode Base64 data URIs into Web Audio Buffers for lag-free instant playback
        if (this.ctx) {
          this.decodeAudioData("start", ASSETS.startAudio);
          this.decodeAudioData("jump", ASSETS.jumpAudio);
          this.decodeAudioData("hit", ASSETS.hitAudio);
        }

        // Global unlock on any first user gesture
        const unlock = () => {
          if (this.ctx && this.ctx.state === "suspended") {
            this.ctx.resume();
          }
          window.removeEventListener("pointerdown", unlock);
          window.removeEventListener("keydown", unlock);
          window.removeEventListener("touchstart", unlock);
        };
        window.addEventListener("pointerdown", unlock);
        window.addEventListener("keydown", unlock);
        window.addEventListener("touchstart", unlock);
      }

      base64ToArrayBuffer(base64DataUri) {
        const parts = base64DataUri.split(",");
        const raw = window.atob(parts[1]);
        const len = raw.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = raw.charCodeAt(i);
        }
        return bytes.buffer;
      }

      decodeAudioData(key, dataUri) {
        try {
          const ab = this.base64ToArrayBuffer(dataUri);
          this.ctx.decodeAudioData(
            ab,
            (buffer) => {
              this.buffers[key] = buffer;
            },
            (err) => {
              // Silently fallback to HTML5 Audio if decode fails
            }
          );
        } catch (e) {}
      }

      playBuffer(key) {
        if (!this.ctx || !this.buffers[key]) return false;
        try {
          if (this.ctx.state === "suspended") {
            this.ctx.resume();
          }
          const src = this.ctx.createBufferSource();
          src.buffer = this.buffers[key];
          src.connect(this.ctx.destination);
          src.start(0);
          this.activeSources.push(src);
          src.onended = () => {
            const idx = this.activeSources.indexOf(src);
            if (idx > -1) this.activeSources.splice(idx, 1);
          };
          return true;
        } catch (e) {
          return false;
        }
      }

      toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem("shahenshah_muted", this.muted ? "true" : "false");
        this.updateButtonUI();
        if (this.muted) {
          this.stopAll();
        }
      }

      updateButtonUI() {
        if (btnSound) {
          btnSound.textContent = this.muted ? "🔇" : "🔊";
        }
      }

      playStart() {
        if (this.muted) return;
        this.stopAll();

        // Try Web Audio first
        const played = this.playBuffer("start");
        if (!played) {
          try {
            this.htmlAudios.start.currentTime = 0;
            const p = this.htmlAudios.start.play();
            if (p !== undefined) p.catch(() => {});
          } catch (e) {}
        }
      }

      playJump() {
        if (this.muted) return;

        // Try Web Audio first (immediate 0ms response)
        const played = this.playBuffer("jump");
        if (!played) {
          try {
            const audio = this.htmlAudios.jump[this.jumpIdx];
            this.jumpIdx = (this.jumpIdx + 1) % this.htmlAudios.jump.length;
            audio.currentTime = 0;
            const p = audio.play();
            if (p !== undefined) p.catch(() => {});
          } catch (e) {}
        }
      }

      playHit() {
        if (this.muted) return;
        this.stopAll();

        // Try Web Audio first
        const played = this.playBuffer("hit");
        if (!played) {
          try {
            this.htmlAudios.hit.currentTime = 0;
            const p = this.htmlAudios.hit.play();
            if (p !== undefined) p.catch(() => {});
          } catch (e) {}
        }
      }

      stopAll() {
        try {
          this.activeSources.forEach(s => {
            try { s.stop(); } catch (e) {}
          });
          this.activeSources = [];
          this.htmlAudios.start.pause();
          this.htmlAudios.hit.pause();
          this.htmlAudios.jump.forEach(a => a.pause());
        } catch (e) {}
      }
    }

    const soundEngine = new SoundEngine();

    // Smooth, Playable Physics & Balancing
    const GRAVITY = 0.22;             // Significantly reduced for smooth buoyant floating
    const JUMP_FORCE = -6.2;          // Responsive, pleasant upward flap
    const MAX_FALL_SPEED = 5.8;       // Caps downward speed so player never drops uncontrollably
    const PIPE_SPEED = 2.2;           // Comfortable horizontal scrolling speed
    const PIPE_SPAWN_INTERVAL = 125;  // Spacing between obstacles
    const PIPE_GAP = 175;             // Fair vertical gap between top and bottom fire pillars
    const PIPE_WIDTH = 66;

    // Game State
    let gameState = "START"; // "START", "PLAYING", "GAMEOVER"
    let score = 0;
    let bestScore = parseInt(localStorage.getItem("shahenshah_best_score") || "0", 10);
    hudBest.textContent = bestScore;

    // Responsive Canvas Resizing with Retina DPR
    let viewWidth = 400;
    let viewHeight = 700;
    let dpr = window.devicePixelRatio || 1;

    function resizeCanvas() {
      const rect = wrapper.getBoundingClientRect();
      viewWidth = rect.width;
      viewHeight = rect.height;
      dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(viewWidth * dpr);
      canvas.height = Math.floor(viewHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Load Clean Transparent Character Image
    const playerImg = new Image();
    playerImg.src = ASSETS.playerImg;

    // Player Object
    const player = {
      x: 80,
      y: 250,
      width: 65,
      height: 56,                     // Scaled to match cropped sprite proportions
      vy: 0,
      rotation: 0,
      hitboxRadius: 17,                // Tight, forgiving circle centered on character torso
      trailTimer: 0,

      reset() {
        this.x = Math.max(65, viewWidth * 0.24);
        this.y = viewHeight * 0.44;
        this.vy = 0;
        this.rotation = 0;
        this.trailTimer = 0;
      },

      jump() {
        this.vy = JUMP_FORCE;
        soundEngine.playJump();

        // Burst of fiery sparks on jump
        for (let i = 0; i < 8; i++) {
          particles.push(new Particle(
            this.x - 12,
            this.y + 12,
            (Math.random() - 0.7) * 3.5 - 1.5,
            (Math.random() - 0.5) * 3.5 + 1.2,
            Math.random() * 3.5 + 1.5,
            Math.random() > 0.5 ? "#ffaa00" : "#ff3300",
            28
          ));
        }
      },

      update() {
        this.vy += GRAVITY;
        this.vy = Math.min(this.vy, MAX_FALL_SPEED);
        this.y += this.vy;

        // Fluid, gentle rotation based on vertical speed
        const targetRot = Math.max(-0.35, Math.min(0.65, this.vy * 0.09));
        this.rotation += (targetRot - this.rotation) * 0.18;

        // Flight sparks trailing behind feet
        this.trailTimer++;
        if (this.trailTimer % 3 === 0) {
          particles.push(new Particle(
            this.x - 18,
            this.y + 14 + (Math.random() - 0.5) * 6,
            -PIPE_SPEED * 0.7 - Math.random() * 1.2,
            (Math.random() - 0.5) * 1.2,
            Math.random() * 3 + 1.2,
            Math.random() > 0.6 ? "#ffdd44" : "#ff4500",
            22
          ));
        }
      },

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        if (playerImg.complete && playerImg.naturalWidth > 0) {
          // Draw character with 100% preserved PNG transparency (zero background fill)
          ctx.drawImage(
            playerImg,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
          );
        } else {
          ctx.fillStyle = "#ffcc00";
          ctx.beginPath();
          ctx.arc(0, 0, 18, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    };

    // Particle System
    class Particle {
      constructor(x, y, vx, vy, size, color, maxLife) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
        this.color = color;
        this.life = maxLife;
        this.maxLife = maxLife;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.size *= 0.96;
      }

      draw() {
        const alpha = Math.max(0, this.life / this.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0.5, this.size), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    let particles = [];
    let ambientEmbers = [];

    // Background Ambient Embers
    for (let i = 0; i < 32; i++) {
      ambientEmbers.push({
        x: Math.random() * 500,
        y: Math.random() * 800,
        vx: (Math.random() - 0.5) * 0.8 - 0.4,
        vy: -Math.random() * 0.8 - 0.3,
        size: Math.random() * 2 + 0.8,
        color: Math.random() > 0.4 ? "#ff6600" : "#ffcc00",
        alpha: Math.random() * 0.6 + 0.2
      });
    }

    // Fire Obstacle Class
    class FirePillar {
      constructor(x, topHeight, gap) {
        this.x = x;
        this.width = PIPE_WIDTH;
        this.topHeight = topHeight;
        this.gap = gap;
        this.bottomY = topHeight + gap;
        this.passed = false;
        this.flameOffset = Math.random() * 100;
      }

      update() {
        this.x -= PIPE_SPEED;
      }

      draw(time) {
        // Top Fire Pillar (hanging downwards)
        this.drawPillar(this.x, 0, this.width, this.topHeight, true, time);

        // Bottom Fire Pillar (shooting upwards)
        const bottomHeight = viewHeight - this.bottomY;
        this.drawPillar(this.x, this.bottomY, this.width, bottomHeight, false, time);
      }

      drawPillar(x, y, w, h, isTop, time) {
        if (h <= 0) return;

        ctx.save();

        // Fiery Core Gradient
        const grad = ctx.createLinearGradient(x, y, x + w, y);
        grad.addColorStop(0, "#7a0000");     // dark crimson outer edge
        grad.addColorStop(0.2, "#ff4500");   // orange flame
        grad.addColorStop(0.5, "#fff066");   // bright yellow center heat
        grad.addColorStop(0.8, "#ff4500");
        grad.addColorStop(1, "#7a0000");

        // Base Pillar Body
        ctx.fillStyle = grad;
        ctx.shadowColor = "rgba(255, 69, 0, 0.8)";
        ctx.shadowBlur = 18;
        ctx.fillRect(x, y, w, h);

        // Inner white-hot heat core beam
        const coreGrad = ctx.createLinearGradient(x + w * 0.25, y, x + w * 0.75, y);
        coreGrad.addColorStop(0, "rgba(255, 120, 0, 0)");
        coreGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.85)");
        coreGrad.addColorStop(1, "rgba(255, 120, 0, 0)");
        ctx.fillStyle = coreGrad;
        ctx.fillRect(x + w * 0.25, y, w * 0.5, h);

        // Scorched Stone Collar Frame
        ctx.fillStyle = "#1a0608";
        ctx.strokeStyle = "#ff5500";
        ctx.lineWidth = 2;
        const collarH = 14;
        const collarY = isTop ? 0 : viewHeight - collarH;
        ctx.fillRect(x - 4, collarY, w + 8, collarH);
        ctx.strokeRect(x - 4, collarY, w + 8, collarH);

        // Dynamic Flickering Flame Tongues at pillar tip
        const tipY = isTop ? y + h : y;
        const flameDir = isTop ? 1 : -1;
        const tongueCount = 5;
        const tongueWidth = w / tongueCount;

        for (let i = 0; i < tongueCount; i++) {
          const tX = x + i * tongueWidth + tongueWidth / 2;
          const osc1 = Math.sin((time * 0.007) + i * 1.5 + this.flameOffset);
          const osc2 = Math.cos((time * 0.011) + i * 0.8 + this.flameOffset);
          const flameLength = 18 + osc1 * 8 + osc2 * 6;

          // Outer orange flame tongue
          ctx.beginPath();
          ctx.fillStyle = (i % 2 === 0) ? "#ff3700" : "#ff7700";
          ctx.moveTo(tX - tongueWidth / 2, tipY);
          ctx.quadraticCurveTo(
            tX + osc2 * 4,
            tipY + (flameLength * 0.6 * flameDir),
            tX + osc1 * 3,
            tipY + (flameLength * flameDir)
          );
          ctx.quadraticCurveTo(
            tX + tongueWidth / 2,
            tipY + (flameLength * 0.6 * flameDir),
            tX + tongueWidth / 2,
            tipY
          );
          ctx.closePath();
          ctx.fill();

          // Inner bright yellow flame core
          ctx.beginPath();
          ctx.fillStyle = "#ffff55";
          ctx.moveTo(tX - tongueWidth * 0.25, tipY);
          ctx.quadraticCurveTo(
            tX,
            tipY + (flameLength * 0.45 * flameDir),
            tX + osc1 * 2,
            tipY + (flameLength * 0.65 * flameDir)
          );
          ctx.quadraticCurveTo(
            tX + tongueWidth * 0.25,
            tipY + (flameLength * 0.45 * flameDir),
            tX + tongueWidth * 0.25,
            tipY
          );
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }

      checkCollision(p) {
        const r = p.hitboxRadius;
        const px = p.x;
        const py = p.y;

        // Check Top Pillar collision
        if (px + r > this.x && px - r < this.x + this.width) {
          if (py - r < this.topHeight) {
            return true;
          }
        }

        // Check Bottom Pillar collision
        if (px + r > this.x && px - r < this.x + this.width) {
          if (py + r > this.bottomY) {
            return true;
          }
        }

        return false;
      }
    }

    let pillars = [];
    let frameCount = 0;
    let screenShake = 0;

    // Meme Dialogue Quotes for Game Over
    const MEME_QUOTES = [
      '\\\"Rishte me toh hum tumhare baap lagte hain!\\\"',
      '\\\"Samay Samapt! Aag se mat khelo babumoshai!\\\"',
      '\\\"Shahenshah kabhie haar nahi maanta!\\\"',
      '\\\"Hain! Aag lag gayi bhaiya!\\\"',
      '\\\"Babumoshai, zindagi lambi honi chahiye, badi nahi!\\\"'
    ];

    function getRank(sc) {
      if (sc >= 30) return "🔥 ASLI SHAHENSHAH 🔥";
      if (sc >= 20) return "⚡ DON OF FLAP ⚡";
      if (sc >= 10) return "⭐ KHILADI ⭐";
      if (sc >= 5)  return "⚔️ FIGHTER ⚔️";
      return "🌱 NAU-SIKHIA";
    }

    // Game Actions
    function startGame() {
      // Play Start audio dialogue
      soundEngine.playStart();

      gameState = "PLAYING";
      score = 0;
      frameCount = 0;
      screenShake = 0;
      hudScore.textContent = "0";
      hudScore.classList.remove("score-pulse");
      pillars = [];
      particles = [];
      player.reset();

      startScreen.classList.add("hidden");
      gameOverScreen.classList.add("hidden");
    }

    function triggerGameOver() {
      if (gameState === "GAMEOVER") return;
      gameState = "GAMEOVER";

      // Play Touch Fire / Game Over dialogue audio
      soundEngine.playHit();
      screenShake = 18;

      // Burst of sparks and fire on collision
      for (let i = 0; i < 45; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 8 + 2;
        particles.push(new Particle(
          player.x,
          player.y,
          Math.cos(angle) * spd,
          Math.sin(angle) * spd,
          Math.random() * 6 + 2,
          Math.random() > 0.5 ? "#ff3300" : (Math.random() > 0.5 ? "#ffaa00" : "#ffffff"),
          45
        ));
      }

      // Update High Score
      if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("shahenshah_best_score", bestScore.toString());
        hudBest.textContent = bestScore;
      }

      // Populate Game Over screen
      gameOverScoreEl.textContent = score;
      gameOverBestEl.textContent = bestScore;
      gameOverRankEl.textContent = getRank(score);
      const randomQuote = MEME_QUOTES[Math.floor(Math.random() * MEME_QUOTES.length)];
      gameOverQuoteEl.textContent = randomQuote;

      setTimeout(() => {
        gameOverScreen.classList.remove("hidden");
      }, 350);
    }

    function handleAction() {
      if (gameState === "START") {
        startGame();
      } else if (gameState === "PLAYING") {
        player.jump();
      } else if (gameState === "GAMEOVER") {
        if (!gameOverScreen.classList.contains("hidden")) {
          startGame();
        }
      }
    }

    // Input Listeners: Keyboard & Pointer
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        handleAction();
      }
    });

    wrapper.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".hud-controls") || e.target.closest(".btn-main")) {
        return;
      }
      e.preventDefault();
      handleAction();
    });

    btnStart.addEventListener("click", (e) => {
      e.stopPropagation();
      startGame();
    });

    btnRestart.addEventListener("click", (e) => {
      e.stopPropagation();
      startGame();
    });

    btnSound.addEventListener("click", (e) => {
      e.stopPropagation();
      soundEngine.toggleMute();
    });

    // Score Animation
    function addScore() {
      score++;
      hudScore.textContent = score;
      hudScore.classList.add("score-pulse");
      setTimeout(() => {
        hudScore.classList.remove("score-pulse");
      }, 150);

      for (let i = 0; i < 12; i++) {
        particles.push(new Particle(
          player.x,
          player.y - 10,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5 - 2,
          Math.random() * 4 + 2,
          "#ffea00",
          35
        ));
      }
    }

    // Drawing Background
    function drawBackground(time) {
      // Atmospheric Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, viewHeight);
      skyGrad.addColorStop(0, "#080205");
      skyGrad.addColorStop(0.5, "#1f0610");
      skyGrad.addColorStop(0.85, "#420d18");
      skyGrad.addColorStop(1, "#66141c");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, viewWidth, viewHeight);

      // Distant Volcanic Silhouettes
      ctx.fillStyle = "rgba(18, 4, 8, 0.75)";
      ctx.beginPath();
      ctx.moveTo(0, viewHeight * 0.85);
      for (let x = 0; x <= viewWidth + 40; x += 40) {
        const peak = Math.sin(x * 0.015) * 35 + Math.cos(x * 0.03) * 15;
        ctx.lineTo(x, viewHeight * 0.78 + peak);
      }
      ctx.lineTo(viewWidth, viewHeight);
      ctx.lineTo(0, viewHeight);
      ctx.closePath();
      ctx.fill();

      // Ambient Floating Ash / Embers
      ambientEmbers.forEach(e => {
        e.y += e.vy;
        e.x += e.vx;
        if (e.y < -10) e.y = viewHeight + 10;
        if (e.x < -10) e.x = viewWidth + 10;
        if (e.x > viewWidth + 10) e.x = -10;

        ctx.save();
        ctx.globalAlpha = e.alpha;
        ctx.fillStyle = e.color;
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Molten Magma Floor at bottom
      const groundH = 22;
      const groundY = viewHeight - groundH;
      const lavaGrad = ctx.createLinearGradient(0, groundY, 0, viewHeight);
      lavaGrad.addColorStop(0, "#ff4500");
      lavaGrad.addColorStop(0.3, "#ffcc00");
      lavaGrad.addColorStop(1, "#8b0000");
      ctx.fillStyle = lavaGrad;
      ctx.fillRect(0, groundY, viewWidth, groundH);

      // Pulsing glow line over ground
      ctx.strokeStyle = "rgba(255, 255, 200, 0.8)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(viewWidth, groundY);
      ctx.stroke();
    }

    // Main Game Loop
    let lastTime = performance.now();

    function gameLoop(currentTime) {
      requestAnimationFrame(gameLoop);

      const dt = currentTime - lastTime;
      lastTime = currentTime;

      // Handle Screen Shake
      ctx.save();
      if (screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * screenShake;
        const shakeY = (Math.random() - 0.5) * screenShake;
        ctx.translate(shakeX, shakeY);
        screenShake *= 0.88;
        if (screenShake < 0.5) screenShake = 0;
      }

      // 1. Draw Background
      drawBackground(currentTime);

      // 2. State Logic
      if (gameState === "PLAYING") {
        frameCount++;

        // Spawn fire pillars
        if (frameCount % PIPE_SPAWN_INTERVAL === 0) {
          const minPillar = 60;
          const maxPillar = viewHeight - PIPE_GAP - minPillar - 30;
          const topH = Math.floor(Math.random() * (maxPillar - minPillar) + minPillar);
          pillars.push(new FirePillar(viewWidth + 20, topH, PIPE_GAP));
        }

        // Update player physics
        player.update();

        // Check ceiling and ground collision
        if (player.y - player.hitboxRadius < 0 || player.y + player.hitboxRadius > viewHeight - 20) {
          triggerGameOver();
        }

        // Update pillars
        for (let i = pillars.length - 1; i >= 0; i--) {
          const p = pillars[i];
          p.update();

          // Check passing score
          if (!p.passed && p.x + p.width < player.x) {
            p.passed = true;
            addScore();
          }

          // Check fire obstacle collision
          if (p.checkCollision(player)) {
            triggerGameOver();
          }

          // Remove offscreen pillars
          if (p.x + p.width < -30) {
            pillars.splice(i, 1);
          }
        }
      } else if (gameState === "START") {
        // Idle gentle hover on start screen
        player.y = viewHeight * 0.44 + Math.sin(currentTime * 0.0035) * 8;
        player.rotation = Math.sin(currentTime * 0.0025) * 0.06;
      }

      // 3. Draw Fire Pillars
      pillars.forEach(p => p.draw(currentTime));

      // 4. Update & Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.update();
        pt.draw();
        if (pt.life <= 0 || pt.size <= 0.4) {
          particles.splice(i, 1);
        }
      }

      // 5. Draw Player with 100% transparent PNG
      player.draw();

      ctx.restore();
    }

    // Start Game Loop
    player.reset();
    requestAnimationFrame(gameLoop);
  </script>
</body>
</html>`;

const finalHtml = template
  .replace('DATA_PLAYER_IMG', assets.img)
  .replace('DATA_START_AUDIO', assets.startAudio)
  .replace('DATA_JUMP_AUDIO', assets.jumpAudio)
  .replace('DATA_HIT_AUDIO', assets.hitAudio);

fs.writeFileSync('index.html', finalHtml);
console.log('Successfully regenerated index.html with transparent player image, tuned physics, and robust audio system!');
