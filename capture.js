const { chromium } = require('playwright');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const config = require('./video.config');

(async () => {
  // --- Validate config ---
  if (!config.url) {
    console.error('ERROR: No URL set in video.config.js. Run Claude Code to configure.');
    process.exit(1);
  }
  if (!config.phases || config.phases.length === 0) {
    console.error('ERROR: No phases defined in video.config.js. Run Claude Code to configure.');
    process.exit(1);
  }

  // --- Auto-detect audio duration if not set ---
  let audioDuration = config.audioDuration;
  if (audioDuration === 0 && fs.existsSync(config.voiceoverFile)) {
    try {
      const raw = execSync(
        `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${config.voiceoverFile}"`,
        { encoding: 'utf-8' }
      ).trim();
      audioDuration = Math.ceil(parseFloat(raw));
      console.log(`Auto-detected audio duration: ${audioDuration}s`);
    } catch (e) {
      console.error('WARNING: Could not detect audio duration. Set audioDuration in config.');
    }
  }

  // --- Distribute duration across scroll phases if not explicitly set ---
  const scrollPhases = config.phases.filter((p) => p.action === 'scroll');
  const nonScrollTime = config.phases.reduce((sum, p) => {
    if (p.action === 'click') return sum + 3;
    if (p.action === 'navigate') return sum + ((p.waitMs || 4000) / 1000);
    return sum;
  }, 0);

  const totalScrollDuration = audioDuration - nonScrollTime;
  const totalExplicitScrollTime = scrollPhases.reduce((s, p) => s + (p.duration || 0), 0);

  if (totalExplicitScrollTime === 0 && scrollPhases.length > 0) {
    const perPhase = totalScrollDuration / scrollPhases.length;
    scrollPhases.forEach((p) => (p.duration = Math.floor(perPhase)));
  }

  const VIEWPORT = config.viewport || { width: 1920, height: 1080 };
  const brandAccent = (config.brand && config.brand.accent) || '#f4b334';
  const RECORDINGS_DIR = path.join(__dirname, 'recordings');

  // Clean recordings dir
  if (fs.existsSync(RECORDINGS_DIR)) fs.rmSync(RECORDINGS_DIR, { recursive: true });
  fs.mkdirSync(RECORDINGS_DIR, { recursive: true });

  // --- Launch browser with video recording ---
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: RECORDINGS_DIR, size: VIEWPORT },
  });
  const page = await context.newPage();

  // --- Helper: inject overlays ---
  async function injectOverlays() {
    await page.addStyleTag({
      content: `
        html { scroll-behavior: smooth !important; }
        #ai-cursor {
          position: fixed; top: -50px; left: -50px; z-index: 999999;
          pointer-events: none;
          filter: drop-shadow(1px 2px 2px rgba(0,0,0,0.3));
          transition: top 0.8s cubic-bezier(0.25, 0.1, 0.25, 1),
                      left 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        @keyframes cursorRipple {
          0% { width: 0; height: 0; opacity: 1; }
          100% { width: 70px; height: 70px; opacity: 0; }
        }
        @keyframes cursorGlow {
          0%, 100% { opacity: 0.4; transform: translate(-8px,-8px) scale(1); }
          50% { opacity: 0.8; transform: translate(-8px,-8px) scale(1.2); }
        }
      `,
    });
    await page.evaluate((accent) => {
      const old = document.getElementById('ai-cursor');
      if (old) old.remove();
      const cursor = document.createElement('div');
      cursor.id = 'ai-cursor';
      cursor.innerHTML = `
        <div style="position:relative;">
          <div style="position:absolute;top:0;left:0;width:48px;height:48px;border-radius:50%;
            background:${accent}4D;border:2px solid ${accent}99;
            transform:translate(-8px,-8px);animation:cursorGlow 1.5s ease-in-out infinite;"></div>
          <svg width="48" height="48" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 2L13 25L16 15L26 12L3 2Z" fill="white" stroke="black" stroke-width="2" stroke-linejoin="round"/>
          </svg>
        </div>
      `;
      document.body.appendChild(cursor);
    }, brandAccent);
  }

  async function moveCursor(x, y) {
    await page.evaluate(({ x, y }) => {
      const c = document.getElementById('ai-cursor');
      if (c) { c.style.left = x + 'px'; c.style.top = y + 'px'; }
    }, { x, y });
  }

  async function showClickRipple(x, y) {
    await page.evaluate(({ x, y, accent }) => {
      const r = document.createElement('div');
      r.style.cssText = `position:fixed;z-index:999998;pointer-events:none;left:${x}px;top:${y}px;
        width:0;height:0;border-radius:50%;border:4px solid ${accent}E6;
        transform:translate(-50%,-50%);animation:cursorRipple 0.6s ease-out forwards;`;
      document.body.appendChild(r);
      setTimeout(() => r.remove(), 700);
    }, { x, y, accent: brandAccent });
  }

  async function smoothScroll(totalPixels, durationMs) {
    const steps = Math.ceil(durationMs / 16);
    const pxPerStep = totalPixels / steps;
    const msPerStep = durationMs / steps;
    for (let i = 0; i < steps; i++) {
      await page.evaluate((px) => window.scrollBy(0, px), pxPerStep);
      await page.waitForTimeout(msPerStep);
    }
  }

  // --- Load initial page ---
  console.log(`Loading ${config.url}...`);
  await page.goto(config.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(6000);
  await injectOverlays();

  // Dismiss popups
  try { await page.click('[class*="close"]', { timeout: 2000 }); } catch (e) {}

  // --- Execute phases ---
  for (let i = 0; i < config.phases.length; i++) {
    const phase = config.phases[i];
    console.log(`Phase ${i + 1}: ${phase.action}${phase.text ? ' → ' + phase.text : ''}`);

    if (phase.action === 'scroll') {
      const pageHeight = await page.evaluate(() => document.body.scrollHeight - window.innerHeight);
      const scrollPx = Math.round(pageHeight * ((phase.scrollPercent || 100) / 100));
      const durationMs = (phase.duration || 10) * 1000;
      await smoothScroll(scrollPx, durationMs);

    } else if (phase.action === 'click') {
      // Scroll to top first
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
      await page.waitForTimeout(1200);

      // Find element
      const linkBox = await page.evaluate(({ selector, text }) => {
        const els = Array.from(document.querySelectorAll(selector || 'a'));
        const el = text ? els.find((e) => e.textContent.trim() === text) : els[0];
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
      }, { selector: phase.selector, text: phase.text });

      if (!linkBox) {
        console.warn(`  WARNING: Could not find element "${phase.text || phase.selector}"`);
        continue;
      }

      // Animate cursor
      await moveCursor(VIEWPORT.width / 2, VIEWPORT.height * 0.5);
      await page.waitForTimeout(100);
      await moveCursor(linkBox.x, linkBox.y);
      await page.waitForTimeout(1000);
      await page.waitForTimeout(300);
      await showClickRipple(linkBox.x, linkBox.y);
      await page.waitForTimeout(400);

    } else if (phase.action === 'navigate') {
      await page.goto(phase.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(phase.waitMs || 4000);
      await injectOverlays();
      await moveCursor(-50, -50);
    }
  }

  // Small pause at end
  await page.waitForTimeout(500);

  // --- Finalize ---
  console.log('Finalizing video...');
  const videoPath = await page.video().path();
  await context.close();
  await browser.close();

  // Copy recording to Remotion public dir for rendering
  const remotionPublic = path.join(__dirname, 'remotion', 'public');
  if (fs.existsSync(remotionPublic)) {
    fs.copyFileSync(videoPath, path.join(remotionPublic, 'recording.webm'));
    // Also copy voiceover
    if (fs.existsSync(config.voiceoverFile)) {
      fs.copyFileSync(config.voiceoverFile, path.join(remotionPublic, 'voiceover.mp3'));
    }
    console.log('Assets copied to remotion/public/');
  }

  console.log(`Recording saved: ${videoPath}`);
})();
