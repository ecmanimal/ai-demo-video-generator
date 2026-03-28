/**
 * Video Configuration — Example Template
 *
 * Copy this file to video.config.js and fill in your project details.
 * video.config.js is gitignored so your site-specific config stays private.
 *
 *   cp video.config.example.js video.config.js
 */
module.exports = {
  url: 'https://example.com',
  viewport: { width: 1920, height: 1080 },
  voiceoverFile: 'voiceover.mp3',
  audioDuration: 76,
  outputFile: 'demo_video.mp4',
  fps: 30,

  // Background music (optional) — fades in/out automatically
  bgMusic: {
    file: 'background-track.mp3',
    volume: 0.06,
    fadeInFrames: 60,   // 2 seconds
    fadeOutFrames: 90,  // 3 seconds
  },

  brand: {
    primary: '#5e0d8b',
    accent: '#f4b334',
    dark: '#1a0530',
    text: '#ffffff',
  },

  // ── Recording phases ──────────────────────────────────────────────
  phases: [
    { action: 'scroll', duration: 28, scrollPercent: 95 },
    { action: 'click', selector: 'a', text: 'Get Started' },
    { action: 'navigate', url: 'https://example.com/signup', waitMs: 5000 },
    { action: 'scroll', duration: 30, scrollPercent: 5 },
  ],

  // ── Remotion overlays ────────────────────────────────────────────
  overlays: [
    // Section title
    { type: 'section-title', text: 'How It Works',
      fromFrame: 510, durationInFrames: 90 },

    // Callout badge
    { type: 'callout', text: 'Key message or testimonial here',
      position: 'bottom-left', fromFrame: 780, durationInFrames: 100 },

    // Click sound effect
    { type: 'sound', file: 'click.mp3', volume: 0.9,
      fromFrame: 1260, durationInFrames: 15 },

    // Gentle zoom on a key page
    { type: 'spotlight', fromFrame: 1620, durationInFrames: 90 },
    { type: 'zoom', targetX: 50, targetY: 50, scale: 1.8,
      fromFrame: 1620, holdFrames: 30, totalFrames: 120 },

    // Outro card with CTA
    { type: 'outro',
      headline: 'Ready to Get Started?',
      subheadline: 'Join thousands of customers.',
      cta: 'Sign Up Free',
      website: 'example.com',
      fromFrame: 1920, durationInFrames: 360 },
  ],

  voiceoverScript: '',
};
