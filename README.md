# AI Demo Video Generator

Create professional website demo videos with AI — scroll recordings, animated overlays, zoom effects, and AI-generated voiceover. Zero manual video editing.

## What It Produces

- Smooth browser scroll-through recordings with animated cursor
- Click interactions with visible cursor + ripple animation
- Google Earth-style zoom effects into specific elements
- Animated text overlays: intro titles, callout badges, section headers
- Branded outro card with CTA
- Sound effects (woosh, etc.)
- AI-generated voiceover synced to the visuals

## Architecture

| Layer | Tool | What it does |
|-------|------|-------------|
| Recording | Playwright | Headless browser scrolls the site with animated cursor |
| Composition | Remotion | React-based overlays: titles, callouts, zooms, sound effects |
| Voiceover | ElevenLabs | AI text-to-speech (free tier) |
| Config | video.config.js | Single file drives everything |

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [FFmpeg](https://ffmpeg.org/) — `brew install ffmpeg` on macOS
- [Claude Code](https://claude.ai/code) — guides the entire process
- [ElevenLabs](https://elevenlabs.io/) account (free tier works)

## Quick Start

```bash
git clone <repo-url>
cd ai-demo-video-generator
claude
```

Then tell Claude Code:
> I want to create a demo video for https://example.com

Claude Code handles everything: dependency setup, script writing, ElevenLabs guidance, config, capture, and rendering.

## Manual Usage

```bash
# 1. Install everything
npm run setup

# 2. Edit video.config.js (URL, phases, overlays, brand colors)

# 3. Generate voiceover on elevenlabs.io, save as voiceover.mp3

# 4. Record the browser scroll-through
npm run capture

# 5. Render final video with overlays
npm run render

# 6. Watch it
open remotion/out/DemoVideo.mp4
```

## Configuration

Everything lives in `video.config.js`:

### Phases (what the browser does)

| Action | Description | Properties |
|--------|-------------|------------|
| `scroll` | Smooth-scroll the page | `duration` (seconds), `scrollPercent` (0-100) |
| `click` | Cursor glides to element + clicks | `selector` (CSS), `text` (exact match) |
| `navigate` | Go to a new URL | `url`, `waitMs` (load wait) |

### Overlays (what Remotion adds on top)

| Type | Description | Key Properties |
|------|-------------|----------------|
| `intro` | Animated title card | `text`, `subtitle`, `fromFrame`, `durationInFrames` |
| `callout` | Slide-in badge | `text`, `position`, `fromFrame`, `durationInFrames` |
| `section-title` | Slide-in header | `text`, `fromFrame`, `durationInFrames` |
| `zoom` | Google Earth-style zoom | `targetX`, `targetY`, `scale`, `fromFrame`, `totalFrames` |
| `spotlight` | Screen dim with cutout | `fromFrame`, `durationInFrames` |
| `sound` | Sound effect | `file`, `volume`, `fromFrame`, `durationInFrames` |
| `outro` | Branded end card | `headline`, `cta`, `website`, `fromFrame`, `durationInFrames` |

### Brand Colors

```js
brand: {
  primary: '#5e0d8b',  // Callout backgrounds, accent bars
  accent: '#f4b334',   // Cursor glow, CTA buttons, dots
  dark: '#1a0530',     // Backgrounds, fades
  text: '#ffffff',     // Text color
}
```

## NPM Scripts

| Script | What it does |
|--------|-------------|
| `npm run setup` | Install all dependencies (Playwright + Remotion) |
| `npm run capture` | Record the browser scroll-through |
| `npm run render` | Render overlays onto recording |
| `npm run build` | Capture + render in one command |
| `npm run studio` | Open Remotion preview in browser (for timing tweaks) |

## Cost

| Component | Tool | Cost |
|-----------|------|------|
| Voiceover script | Claude Code | Free |
| Voice generation | ElevenLabs | Free tier (10k chars/mo) |
| Browser recording | Playwright | Free / open-source |
| Video composition | Remotion | Free for individuals and small teams |

## License

MIT
