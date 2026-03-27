import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface IntroTitleProps {
  text: string;
  subtitle?: string;
  accentColor: string;
}

export const IntroTitle: React.FC<IntroTitleProps> = ({
  text,
  subtitle,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 15], [0, 0.7], {
    extrapolateRight: "clamp",
  });

  const titleScale = spring({
    fps,
    frame: frame - 10,
    config: { damping: 12, mass: 0.8, stiffness: 80 },
  });

  const subtitleOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [70, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: `rgba(0, 0, 0, ${bgOpacity})`,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          transform: `scale(${titleScale})`,
          textAlign: "center",
          padding: "0 100px",
        }}
      >
        <div
          style={{
            width: 60,
            height: 4,
            backgroundColor: accentColor,
            margin: "0 auto 30px",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            fontFamily: "Karla, Arial, sans-serif",
            fontSize: 64,
            fontWeight: 700,
            color: "white",
            lineHeight: 1.2,
            textShadow: "0 2px 20px rgba(0,0,0,0.5)",
          }}
        >
          {text}
        </div>
        {subtitle && (
          <div
            style={{
              fontFamily: "Karla, Arial, sans-serif",
              fontSize: 28,
              fontWeight: 400,
              color: "rgba(255,255,255,0.85)",
              marginTop: 20,
              opacity: subtitleOpacity,
              textShadow: "0 1px 10px rgba(0,0,0,0.5)",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
