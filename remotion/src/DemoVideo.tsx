import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  OffthreadVideo,
  interpolate,
  useCurrentFrame,
  Easing,
} from "remotion";
import { IntroTitle } from "./components/IntroTitle";
import { Callout } from "./components/Callout";
import { SectionTitle } from "./components/SectionTitle";
import { OutroCard } from "./components/OutroCard";
import { Spotlight } from "./components/Spotlight";

// Load config at build time — Remotion bundles this via webpack
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require("../../video.config");

const brand = config.brand || {
  primary: "#5e0d8b",
  accent: "#f4b334",
  dark: "#1a0530",
  text: "#ffffff",
};

export const DemoVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const overlays: any[] = config.overlays || [];

  // Fade from black at the very start
  const introFade = interpolate(frame, [0, 20], [1, 0], {
    extrapolateRight: "clamp",
  });

  // === ZOOM EFFECTS (from config overlays) ===
  const zoomOverlays = overlays.filter((o: any) => o.type === "zoom");

  let totalZoom = 1;
  let originX = 50;
  let originY = 50;

  for (const z of zoomOverlays) {
    const start = z.fromFrame;
    const peakStart = start + Math.round(z.totalFrames * 0.3);
    const peakEnd = peakStart + (z.holdFrames || 40);
    const end = start + z.totalFrames;

    const zoomVal = interpolate(
      frame,
      [start, peakStart, peakEnd, end],
      [1, z.scale || 3.5, z.scale || 3.5, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.ease),
      }
    );
    totalZoom *= zoomVal;

    // Shift transform origin toward zoom target
    const ox = interpolate(
      frame,
      [start, peakStart, end, end + 10],
      [50, z.targetX || 50, z.targetX || 50, 50],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    const oy = interpolate(
      frame,
      [start, peakStart, end, end + 10],
      [50, z.targetY || 50, z.targetY || 50, 50],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Apply (only one zoom should be active at a time)
    if (frame >= start && frame <= end + 10) {
      originX = ox;
      originY = oy;
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: brand.dark }}>
      {/* Layer 1: Base scroll recording with zoom/pan */}
      <AbsoluteFill
        style={{
          transform: `scale(${totalZoom})`,
          transformOrigin: `${originX}% ${originY}%`,
        }}
      >
        <OffthreadVideo
          src={staticFile("recording.webm")}
          style={{ width: "100%", height: "100%" }}
        />
      </AbsoluteFill>

      {/* Layer 2: Voiceover audio */}
      <Audio src={staticFile("voiceover.mp3")} />

      {/* Layer 3: Config-driven overlays */}
      {overlays.map((overlay: any, i: number) => {
        if (overlay.type === "intro") {
          return (
            <Sequence
              key={`overlay-${i}`}
              from={overlay.fromFrame}
              durationInFrames={overlay.durationInFrames}
            >
              <IntroTitle
                text={overlay.text}
                subtitle={overlay.subtitle}
                accentColor={brand.accent}
              />
            </Sequence>
          );
        }

        if (overlay.type === "callout") {
          return (
            <Sequence
              key={`overlay-${i}`}
              from={overlay.fromFrame}
              durationInFrames={overlay.durationInFrames}
            >
              <Callout
                text={overlay.text}
                position={overlay.position || "bottom-left"}
                durationInFrames={overlay.durationInFrames}
                brandColor={brand.primary}
              />
            </Sequence>
          );
        }

        if (overlay.type === "section-title") {
          return (
            <Sequence
              key={`overlay-${i}`}
              from={overlay.fromFrame}
              durationInFrames={overlay.durationInFrames}
            >
              <SectionTitle
                text={overlay.text}
                durationInFrames={overlay.durationInFrames}
                brandColor={brand.primary}
              />
            </Sequence>
          );
        }

        if (overlay.type === "spotlight") {
          return (
            <Sequence
              key={`overlay-${i}`}
              from={overlay.fromFrame}
              durationInFrames={overlay.durationInFrames}
            >
              <Spotlight />
            </Sequence>
          );
        }

        if (overlay.type === "sound") {
          return (
            <Sequence
              key={`overlay-${i}`}
              from={overlay.fromFrame}
              durationInFrames={overlay.durationInFrames}
            >
              <Audio
                src={staticFile(overlay.file)}
                volume={overlay.volume ?? 0.7}
              />
            </Sequence>
          );
        }

        if (overlay.type === "outro") {
          return (
            <Sequence
              key={`overlay-${i}`}
              from={overlay.fromFrame}
              durationInFrames={overlay.durationInFrames}
            >
              <OutroCard
                headline={overlay.headline}
                subheadline={overlay.subheadline}
                cta={overlay.cta}
                website={overlay.website}
                brandPrimary={brand.primary}
                brandAccent={brand.accent}
                brandDark={brand.dark}
              />
            </Sequence>
          );
        }

        // zoom and unknown types are handled above or ignored
        return null;
      })}

      {/* Fade from black overlay at the very start */}
      <AbsoluteFill
        style={{
          backgroundColor: brand.dark,
          opacity: introFade,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
