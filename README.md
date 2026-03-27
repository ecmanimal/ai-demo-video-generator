# AI Demo Video Generator

Create professional website demo videos with AI-generated voiceover — zero manual video editing required.

**What it does:** Records a smooth scroll-through of any website with simulated click interactions, then overlays an AI-generated voiceover to produce a polished demo video.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [FFmpeg](https://ffmpeg.org/) — `brew install ffmpeg` on macOS
- [Claude Code](https://claude.ai/code) — the AI assistant that guides the whole process
- [ElevenLabs](https://elevenlabs.io/) account (free tier works)

## Quick Start

1. **Clone this repo and open it in Claude Code:**
   ```bash
   git clone <repo-url>
   cd ai-demo-video-generator
   claude
   ```

2. **Tell Claude Code what you want:**
   ```
   I want to create a demo video for https://example.com
   ```

3. **Claude Code will guide you through:**
   - Installing dependencies
   - Writing a voiceover script
   - Generating the AI voice on ElevenLabs
   - Configuring the video (scroll, click interactions, timing)
   - Recording and composing the final video

That's it. The final video lands in your project directory.

## Manual Usage (without Claude Code)

```bash
# 1. Install dependencies
npm run setup

# 2. Edit video.config.js with your URL, phases, and script

# 3. Generate voiceover on elevenlabs.io, save as voiceover.mp3

# 4. Record the browser scroll-through
npm run capture

# 5. Compose final video (speed-adjusts + adds audio + fades)
npm run compose

# 6. Watch it
open demo_video_final.mp4
```

## How It Works

| Component | Tool | Cost |
|-----------|------|------|
| Voiceover script | Claude Code | Free |
| Voice generation | ElevenLabs | Free tier (10k chars/mo) |
| Browser recording | Playwright | Free / open-source |
| Video composition | FFmpeg | Free / open-source |

## Video Configuration

Edit `video.config.js` to define what the video shows:

```js
module.exports = {
  url: 'https://example.com',
  phases: [
    { action: 'scroll', duration: 20, scrollPercent: 60 },
    { action: 'click', selector: 'a', text: 'About Us' },
    { action: 'navigate', url: 'https://example.com/about', waitMs: 4000 },
    { action: 'scroll', duration: 20, scrollPercent: 100 },
  ],
};
```

### Phase Types

| Action | Description | Properties |
|--------|-------------|------------|
| `scroll` | Smooth-scroll the current page | `duration` (seconds), `scrollPercent` (0-100) |
| `click` | Animate cursor to element + click | `selector` (CSS), `text` (exact match) |
| `navigate` | Go to a new URL | `url`, `waitMs` (load wait) |

## License

MIT
