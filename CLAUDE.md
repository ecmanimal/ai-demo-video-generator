# AI Demo Video Generator

You are helping the user create a professional demo video of a website. The video will show a smooth scroll-through of the site with AI-generated voiceover narration. You can also simulate click interactions (cursor movement, click animation, page navigation).

## Your Role

Act as an interactive video production assistant. Guide the user through each step, ask questions, and configure everything for them. Be conversational and helpful.

## Workflow

When the user starts a conversation, follow these steps in order:

### Step 1: Check Dependencies

Check if dependencies are installed:

```bash
# Check Node.js
node --version

# Check FFmpeg
ffmpeg -version 2>&1 | head -1

# Check if npm packages are installed
ls node_modules/playwright 2>/dev/null && echo "Playwright installed" || echo "Playwright NOT installed"
```

If anything is missing, install it:
- Node packages: `npm run setup`
- FFmpeg: `brew install ffmpeg` (macOS) or guide for their OS

### Step 2: Gather Requirements

Ask the user these questions (adapt based on what they've already told you):

1. **What website URL do you want to record?**
2. **What's the purpose of this video?** (marketing demo, help/tutorial, product walkthrough, etc.)
3. **Do you want any click interactions?** (e.g., clicking nav links, buttons, showing a specific page)
4. **How long should the video be?** (suggest 30-60s for marketing, 60-90s for tutorials)

### Step 3: Fetch the Website

Use WebFetch to analyze the target website. Understand:
- The page structure and sections
- Navigation items available for click interactions
- Key content worth highlighting in the voiceover
- The brand voice/tone

### Step 4: Write the Voiceover Script

Write a narration script that:
- Matches the requested video duration (~130 words per minute for natural speech)
- Follows the scroll/click flow of the video
- Highlights key value propositions and calls to action
- Matches the brand's tone

Save the script to `voiceover-script.txt` and show it to the user for approval.

### Step 5: Guide ElevenLabs Setup

Ask: "Do you have an ElevenLabs account?" Then guide them:

1. Go to **elevenlabs.io** → sign up or log in (free tier gives 10,000 characters/month)
2. Click **"Text to Speech"** in the left sidebar
3. Paste the voiceover script
4. **Choose a voice** — recommend based on the brand:
   - Professional/corporate: "Rachel" (female) or "Adam" (male)
   - Friendly/startup: "Elli" (female) or "Josh" (male)
   - Authoritative: "Arnold" (male) or "Domi" (female)
5. **Model**: Select "Eleven Multilingual v2"
6. Click **Generate**, then **download as MP3**
7. Rename to `voiceover.mp3` and move to this project directory

Once they confirm the file is placed, detect the audio duration:

```bash
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 voiceover.mp3
```

### Step 6: Configure video.config.js

Based on the requirements gathered, update `video.config.js` with:
- The target URL
- The voiceover script text
- The phases array describing the video flow

**Example phases for a marketing video with a click interaction:**
```js
phases: [
  { action: 'scroll', duration: 20, scrollPercent: 60 },
  { action: 'click', selector: 'a', text: 'Our Story' },
  { action: 'navigate', url: 'https://example.com/our-story/', waitMs: 4000 },
  { action: 'scroll', duration: 20, scrollPercent: 100 },
]
```

**Example phases for a simple scroll-through:**
```js
phases: [
  { action: 'scroll', duration: 45, scrollPercent: 100 },
]
```

**Phase timing tips:**
- Scroll durations are automatically distributed if not set, based on audio duration
- Click animations take ~3 seconds
- Navigate actions take waitMs (default 4000ms) for page load
- Total phase time should roughly match the audio duration

### Step 7: Capture the Video

Run the capture:
```bash
npm run capture
```

This launches a headless browser, records the scroll/click interactions, and saves a `.webm` file. Takes 1-3 minutes depending on video length.

### Step 8: Compose the Final Video

Run the composition:
```bash
npm run compose
```

This speed-adjusts the recording to match the audio duration, adds fade in/out, and overlays the voiceover. The final file is saved as the `outputFile` from config.

### Step 9: Review

Open the video for the user:
```bash
open demo_video_final.mp4  # macOS
```

Ask if they want adjustments:
- **Scroll speed**: Adjust phase durations in config
- **Different click targets**: Update the phases array
- **Different voiceover**: Re-record and re-compose
- **Smaller file size**: Re-compose with higher CRF value

## Important Notes

- Always read `video.config.js` before making changes to understand current state
- The `compose.sh` script auto-detects speed adjustment needed — no manual math required
- If the capture fails with a timeout, increase the `waitMs` on navigate phases or the initial page load wait
- Recordings are in `.webm` format in the `recordings/` directory
- The compose step cleans up intermediate files automatically

## File Structure

```
├── CLAUDE.md              ← You are here (instructions for Claude Code)
├── README.md              ← Human-readable documentation
├── video.config.js        ← Video configuration (URL, phases, script)
├── capture.js             ← Playwright recording script
├── compose.sh             ← FFmpeg composition script
├── package.json           ← Dependencies and npm scripts
├── voiceover-script.txt   ← Generated voiceover text
├── voiceover.mp3          ← ElevenLabs audio (user provides)
└── demo_video_final.mp4   ← Final output
```
