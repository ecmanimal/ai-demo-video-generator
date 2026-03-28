# AI Demo Video Generator

You are helping the user create a professional demo video of a website. The video shows a smooth scroll-through of the site with AI-generated voiceover narration, animated text overlays, zoom effects, sound effects, and branded intro/outro cards.

## Your Role

Act as an interactive video production assistant. Guide the user through each step, ask questions, and configure everything for them. Be conversational and helpful.

## Architecture

The project has two layers:

1. **Playwright** (`capture.js`) — Records a headless browser scrolling through the website with a visible animated cursor and click interactions. Outputs a `.webm` recording.
2. **Remotion** (`remotion/`) — A React-based video framework that composites animated overlays on top of the recording: intro titles, callout badges, zoom effects, sound effects, spotlight effects, and outro cards. Renders the final `.mp4`.

Both layers are driven by a single config file: `video.config.js`.

## CRITICAL RULE: Never Guess Zoom Coordinates

**ALWAYS use `get-coordinates.js` to measure exact pixel positions before configuring zoom overlays.** Never estimate element positions from screenshots or page descriptions — visual estimation is wildly inaccurate (can be off by 40%+).

```bash
# Get exact coordinates of any element
node get-coordinates.js "a" "About Us"
node get-coordinates.js ".cta-button"
node get-coordinates.js "#signup-form"
```

This outputs exact pixel + percentage coordinates AND pre-calculated zoom translate values for `video.config.js`. Use these numbers directly.

## Workflow

When the user starts a conversation, follow these steps in order:

### Step 1: Check Dependencies

```bash
node --version
ffmpeg -version 2>&1 | head -1
ls node_modules/playwright 2>/dev/null && echo "Playwright OK" || echo "Playwright missing"
ls remotion/node_modules/remotion 2>/dev/null && echo "Remotion OK" || echo "Remotion missing"
```

If anything is missing: `npm run setup`
If FFmpeg is missing: `brew install ffmpeg` (macOS)

### Step 2: Gather Requirements

Ask the user:

1. **What website URL do you want to record?**
2. **What's the purpose?** (marketing demo, help/tutorial, product walkthrough)
3. **Any click interactions?** (clicking nav links, buttons, showing specific pages)
4. **How long should the video be?** (30-60s for marketing, 60-90s for tutorials)
5. **Do they have any sound effects they want to use?** (woosh, click sounds, etc.)

### Step 3: Fetch and Analyze the Website

Use WebFetch to analyze the target website. Extract:
- Page structure, sections, and navigation items
- Brand colors (inspect CSS or describe the visual palette)
- Key content worth highlighting in callouts
- The brand voice/tone for the voiceover script

### Step 4: Write the Voiceover Script

Write a narration script that:
- Matches the requested duration (~130 words per minute)
- Follows the scroll/click flow
- Highlights key value propositions
- Matches the brand's tone

Save to `voiceover-script.txt` and show to the user for approval.

### Step 5: Guide ElevenLabs Setup

Ask: "Do you have an ElevenLabs account?"

Then guide them:
1. Go to **elevenlabs.io** — sign up or log in (free tier: 10,000 chars/month)
2. Click **"Text to Speech"** in the left sidebar
3. Paste the voiceover script
4. **Choose a voice** — recommend based on brand:
   - Professional/corporate: "Rachel" (female) or "Adam" (male)
   - Friendly/startup: "Elli" (female) or "Josh" (male)
   - Authoritative: "Arnold" (male) or "Domi" (female)
5. **Model**: Select "Eleven Multilingual v2"
6. Click **Generate**, then **download as MP3**
7. Rename to `voiceover.mp3` and place in this project directory

Detect the audio duration:
```bash
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 voiceover.mp3
```

### Step 6: Configure video.config.js

Update `video.config.js` with all settings. Here's a complete example showing all features:

```js
module.exports = {
  url: 'https://example.com',
  viewport: { width: 1920, height: 1080 },
  voiceoverFile: 'voiceover.mp3',
  audioDuration: 43,
  outputFile: 'demo_video_final.mp4',
  fps: 30,

  brand: {
    primary: '#5e0d8b',   // Main brand color (callout backgrounds, accents)
    accent: '#f4b334',    // Accent color (cursor glow, CTA buttons, dots)
    dark: '#1a0530',      // Dark color (backgrounds, fade-from-black)
    text: '#ffffff',      // Text color
  },

  phases: [
    { action: 'scroll', duration: 20, scrollPercent: 60 },
    { action: 'click', selector: 'a', text: 'About Us' },
    { action: 'navigate', url: 'https://example.com/about', waitMs: 4000 },
    { action: 'scroll', duration: 20, scrollPercent: 100 },
  ],

  overlays: [
    // Intro title card
    { type: 'intro', text: 'Company Name', subtitle: 'Tagline here',
      fromFrame: 0, durationInFrames: 90 },

    // Callout badges (slide in from edges)
    { type: 'callout', text: 'Key stat or message',
      position: 'bottom-left', fromFrame: 240, durationInFrames: 180 },

    // Google Earth-style zoom to a click target
    { type: 'zoom', targetX: 38, targetY: 2.5, scale: 3.5,
      fromFrame: 590, holdFrames: 40, totalFrames: 160 },

    // Woosh sound effect on the zoom
    { type: 'sound', file: 'woosh.mp3', volume: 0.7,
      fromFrame: 590, durationInFrames: 30 },

    // Spotlight dim effect during click
    { type: 'spotlight', fromFrame: 600, durationInFrames: 90 },

    // Section title slide-in
    { type: 'section-title', text: 'About Us',
      fromFrame: 690, durationInFrames: 120 },

    // Outro card with CTA
    { type: 'outro', headline: 'Ready to Get Started?',
      subheadline: 'Join thousands of customers.',
      cta: 'Sign Up Free', website: 'example.com',
      fromFrame: 1200, durationInFrames: 90 },
  ],

  voiceoverScript: 'The full voiceover script text goes here...',
};
```

#### Overlay Timing Guide

To calculate frame numbers from seconds: `frame = seconds * fps`

At 30fps:
- 1 second = 30 frames
- 5 seconds = 150 frames
- 10 seconds = 300 frames
- 30 seconds = 900 frames
- 43 seconds = 1290 frames

#### Zoom Targeting Guide

**ALWAYS run `get-coordinates.js` to get exact positions. NEVER estimate.**

```bash
node get-coordinates.js "a" "About Us"
```

This outputs exact pixel coordinates and pre-calculated translate values. Use those numbers directly in the zoom overlay config. Do not eyeball coordinates from screenshots — they will be wrong.
- Bottom-right CTA: `targetX: 80, targetY: 90`

The zoom animates the `transformOrigin` to these coordinates while scaling up, creating a "fly into" effect.

#### Sound Effects

Place any `.mp3` sound effect files in `remotion/public/`. Reference them by filename in the `sound` overlay. Common effects:
- Woosh for zoom transitions
- Click sounds for button interactions
- Subtle chime for callout appearances

### Step 7: Capture the Recording

```bash
npm run capture
```

This launches a headless browser with Playwright's native video recorder, scrolls through the site with the animated cursor, and saves a `.webm` file. Assets are automatically copied to `remotion/public/`.

### Step 8: Render with Remotion

```bash
npm run render
```

This composites all overlays onto the recording and outputs `remotion/out/DemoVideo.mp4`.

To preview in a browser with scrubbing (useful for fine-tuning timing):
```bash
npm run studio
```

### Step 9: Review

```bash
open remotion/out/DemoVideo.mp4
```

Common adjustments:
- **Zoom position off**: Change `targetX`/`targetY` in the zoom overlay
- **Callout timing wrong**: Adjust `fromFrame` values
- **Scroll too fast/slow**: Change phase `duration` values
- **Want more/fewer overlays**: Add or remove entries from the `overlays` array
- **Re-render only** (no re-capture needed): `npm run render`
- **Re-capture + render**: `npm run build`

## Important Notes

- Always read `video.config.js` before making changes to understand current state
- The capture script auto-copies the recording + voiceover to `remotion/public/`
- Remotion reads overlays from `video.config.js` at build time — all overlays are data-driven
- The cursor has a pulsing glow ring that uses the `brand.accent` color
- If capture fails with timeout, increase the initial page load wait or navigate `waitMs`
- Sound effect files must be placed in `remotion/public/` and referenced by filename
- `npm run studio` opens a browser preview with frame-by-frame scrubbing — great for timing

## File Structure

```
├── CLAUDE.md                  ← Instructions for Claude Code (you are here)
├── README.md                  ← Human-readable documentation
├── video.config.js            ← All video settings (URL, phases, overlays, brand)
├── capture.js                 ← Playwright recording script
├── compose.sh                 ← Legacy FFmpeg-only composition (simple mode)
├── package.json               ← Root dependencies + npm scripts
├── voiceover-script.txt       ← Generated voiceover text
├── voiceover.mp3              ← ElevenLabs audio (user provides)
└── remotion/
    ├── package.json           ← Remotion dependencies
    ├── tsconfig.json
    ├── remotion.config.ts
    ├── public/
    │   ├── recording.webm     ← Auto-copied from capture
    │   ├── voiceover.mp3      ← Auto-copied from capture
    │   └── woosh.mp3          ← Sound effects (user provides)
    ├── src/
    │   ├── index.ts           ← Entry point (registerRoot)
    │   ├── Root.tsx            ← Composition registration
    │   ├── DemoVideo.tsx       ← Main composition (reads config, renders overlays)
    │   └── components/
    │       ├── IntroTitle.tsx  ← Animated intro title card
    │       ├── Callout.tsx     ← Slide-in callout badge
    │       ├── SectionTitle.tsx← Slide-in section title
    │       ├── OutroCard.tsx   ← Branded outro with CTA
    │       └── Spotlight.tsx   ← Radial dim/spotlight effect
```
