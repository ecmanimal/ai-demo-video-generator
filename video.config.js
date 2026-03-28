module.exports = {
  url: 'https://google.com',
  viewport: { width: 1920, height: 1080 },
  voiceoverFile: 'voiceover2.mp3',
  audioDuration: 76,
  outputFile: 'site_demo.mp4',
  fps: 30,

  brand: {
    primary: '#141414',
    accent: '#fafafa',
    dark: '#0a0a0a',
    text: '#fafafa',
  },

  // ── Recording phases (76s audio) ──────────────────────────────────
  // ~8s load + 28s scroll + 3s click + 6s navigate + 30s quiz = ~75s
  phases: [
    { action: 'scroll', duration: 28, scrollPercent: 95 },
    { action: 'click', selector: 'a', text: 'Take the test drive' },
    { action: 'navigate', url: 'https://google.com/quiz', waitMs: 5000 },
    { action: 'scroll', duration: 30, scrollPercent: 5 },
  ],

  // ── Remotion overlays (76s × 30fps = 2280 frames) ────────────────
  //
  // Scroll timeline (28s for 95%, starting ~8s):
  //   Problem/stats:    ~12-17s  (frames 360-510)
  //   Framework:        ~17-24s  (frames 510-720)
  //   Testimonial:      ~24-30s  (frames 720-900)
  //   Pricing:          ~30-36s  (frames 900-1080)
  //   Click phase:      ~36-39s  (frames 1080-1170)
  //   Quiz visible:     ~45s     (frame 1350)
  //
  overlays: [

    // ▸ SECTION TITLE — framework (~17s)
    { type: 'section-title', text: 'The Framework',
      fromFrame: 510, durationInFrames: 90 },

    // ▸ CALLOUT — testimonial (~26s)
    { type: 'callout', text: '"Questions nobody else thought to ask." — Beta user, 28',
      position: 'bottom-left', fromFrame: 780, durationInFrames: 100 },

    // ▸ CLICK SOUND — when cursor clicks "Take the test drive" (42s)
    { type: 'sound', file: 'click.mp3', volume: 0.9,
      fromFrame: 1260, durationInFrames: 15 },

    // ▸ SECTION TITLE — quiz page (~46s)
    { type: 'section-title', text: 'The Test Drive',
      fromFrame: 1380, durationInFrames: 100 },

    // ▸ CALLOUT — quiz value prop (~49s)
    { type: 'callout', text: '2 minutes. No fluff.',
      position: 'bottom-right', fromFrame: 1470, durationInFrames: 100 },

    // ▸ ZOOM — gentle zoom on quiz page (~54s)
    { type: 'spotlight', fromFrame: 1620, durationInFrames: 90 },
    { type: 'zoom', targetX: 50, targetY: 50, scale: 1.8,
      fromFrame: 1620, holdFrames: 30, totalFrames: 120 },
    { type: 'sound', file: 'whoosh-large.mp3', volume: 0.7,
      fromFrame: 1620, durationInFrames: 30 },

    // ▸ OUTRO CARD (~64s, runs 12s to end)
    { type: 'outro',
      headline: 'The final CTA.',
      subheadline: 'Subheadlining to CTA',
      cta: 'Take the Test Drive',
      website: 'google.com',
      fromFrame: 1920, durationInFrames: 360 },
  ],

  voiceoverScript: '',
};
