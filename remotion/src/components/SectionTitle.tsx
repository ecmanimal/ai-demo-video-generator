import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface SectionTitleProps {
  text: string;
  durationInFrames: number;
  brandColor: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  text,
  durationInFrames,
  brandColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({
    fps,
    frame,
    config: { damping: 14, mass: 0.5, stiffness: 120 },
  });
  const translateX = interpolate(slideIn, [0, 1], [-500, 0]);

  const barWidth = spring({
    fps,
    frame: frame - 5,
    config: { damping: 15, mass: 0.4, stiffness: 100 },
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 25, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        left: 0,
        opacity: fadeOut,
        transform: `translateX(${translateX}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <div
          style={{
            width: interpolate(barWidth, [0, 1], [0, 8]),
            height: 70,
            backgroundColor: brandColor,
            borderRadius: "0 4px 4px 0",
            marginRight: 20,
          }}
        />
        <div
          style={{
            fontFamily: "Karla, Arial, sans-serif",
            fontSize: 42,
            fontWeight: 700,
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "16px 40px 16px 24px",
            borderRadius: "0 12px 12px 0",
            backdropFilter: "blur(6px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};
