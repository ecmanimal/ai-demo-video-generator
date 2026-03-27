import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const Spotlight: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 15, 75, 90], [0, 0.5, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        background:
          "radial-gradient(circle 200px at 50% 5%, transparent 0%, rgba(0,0,0,0.7) 100%)",
      }}
    />
  );
};
