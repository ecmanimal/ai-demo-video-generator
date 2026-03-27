/**
 * Video Configuration
 *
 * This file defines what the demo video will show.
 * Claude Code will help you fill this out — you generally don't need to edit it by hand.
 */
module.exports = {
  // Target website URL
  url: '',

  // Viewport size (default: 1920x1080 for full HD)
  viewport: { width: 1920, height: 1080 },

  // Path to your voiceover MP3 file (placed in this project directory)
  voiceoverFile: 'voiceover.mp3',

  // Total audio duration in seconds (auto-detected from MP3 if left at 0)
  audioDuration: 0,

  // Output filename
  outputFile: 'demo_video_final.mp4',

  // Frames per second for the Remotion composition
  fps: 30,

  // Brand colors (used by Remotion overlays — Claude Code will set these from the website)
  brand: {
    primary: '#5e0d8b',
    accent: '#f4b334',
    dark: '#1a0530',
    text: '#ffffff',
  },

  // Video phases — an ordered list of actions the recording will perform.
  // Claude Code will build this array for you based on your description.
  //
  // Phase types:
  //   { action: 'scroll', duration: 20, scrollPercent: 60 }
  //       Smoothly scroll a percentage of the current page over N seconds.
  //
  //   { action: 'click', selector: 'a', text: 'Our Story' }
  //       Move a visible cursor to the element and click it. Automatically
  //       scrolls to top first, shows a ripple animation, then navigates.
  //
  //   { action: 'navigate', url: 'https://...', waitMs: 4000 }
  //       Navigate to a URL and wait for it to load.
  //
  //   { action: 'scroll', duration: 20, scrollPercent: 100 }
  //       Scroll the rest of the new page.
  //
  phases: [],

  // Remotion overlays — timed animations layered on top of the recording.
  // Claude Code will build this array based on the website content and user preferences.
  //
  // Overlay types:
  //
  //   { type: 'intro', text: 'Main Title', subtitle: 'Subtitle text',
  //     fromFrame: 0, durationInFrames: 90 }
  //       Animated intro title card with spring animation and accent bar.
  //
  //   { type: 'callout', text: 'Key stat or message',
  //     position: 'bottom-left', fromFrame: 240, durationInFrames: 180 }
  //       Slide-in badge with brand-colored background.
  //       Positions: 'bottom-left', 'bottom-right', 'top-left', 'top-right'
  //
  //   { type: 'section-title', text: 'Section Name',
  //     fromFrame: 690, durationInFrames: 120 }
  //       Slide-in section title with accent bar.
  //
  //   { type: 'zoom', targetX: 38, targetY: 2.5, scale: 3.5,
  //     fromFrame: 590, holdFrames: 40, totalFrames: 160 }
  //       Google Earth-style zoom to a specific point on the video.
  //       targetX/targetY are percentages (0-100) of the viewport.
  //       The zoom eases in, holds, then eases back out.
  //
  //   { type: 'spotlight', fromFrame: 600, durationInFrames: 90 }
  //       Dims the screen with a radial spotlight cutout — great during click moments.
  //
  //   { type: 'sound', file: 'woosh.mp3', volume: 0.7,
  //     fromFrame: 590, durationInFrames: 30 }
  //       Play a sound effect at a specific time. Place audio files in remotion/public/.
  //
  //   { type: 'outro', headline: 'Transform Your Career.',
  //     subheadline: 'Change Your Life.', cta: 'Book a Call Today',
  //     website: 'example.com', fromFrame: 1200, durationInFrames: 90 }
  //       Branded outro card with animated CTA.
  //
  overlays: [],

  // Voiceover script text (for reference / ElevenLabs generation)
  voiceoverScript: '',
};
