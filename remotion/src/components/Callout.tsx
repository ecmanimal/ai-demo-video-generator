import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Position = "bottom-left" | "bottom-right" | "top-left" | "top-right";

interface CalloutProps {
  text: string;
  position?: Position;
  durationInFrames: number;
  brandColor: string;
}

const positionStyles: Record<Position, React.CSSProperties> = {
  "bottom-left": { bottom: 80, left: 60 },
  "bottom-right": { bottom: 80, right: 60 },
  "top-left": { top: 80, left: 60 },
  "top-right": { top: 80, right: 60 },
};

const slideDirection: Record<Position, "left" | "right"> = {
  "bottom-left": "left",
  "bottom-right": "right",
  "top-left": "left",
  "top-right": "right",
};

export const Callout: React.FC<CalloutProps> = ({
  text,
  position = "bottom-left",
  durationInFrames,
  brandColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({
    fps,
    frame,
    config: { damping: 14, mass: 0.6, stiffness: 100 },
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const dir = slideDirection[position];
  const translateX =
    dir === "left"
      ? interpolate(slideIn, [0, 1], [-300, 0])
      : interpolate(slideIn, [0, 1], [300, 0]);

  return (
    <div
      style={{
        position: "absolute",
        ...positionStyles[position],
        transform: `translateX(${translateX}px)`,
        opacity: fadeOut,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: brandColor,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          fontFamily: "Karla, Arial, sans-serif",
          fontSize: 26,
          fontWeight: 600,
          color: "white",
          backgroundColor: `${brandColor}D9`,
          padding: "14px 28px",
          borderRadius: 12,
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};
