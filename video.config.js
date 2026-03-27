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

  // Voiceover script text (for reference / ElevenLabs generation)
  voiceoverScript: '',
};
