import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface OutroCardProps {
  headline: string;
  subheadline?: string;
  cta: string;
  website?: string;
  brandPrimary: string;
  brandAccent: string;
  brandDark: string;
}

export const OutroCard: React.FC<OutroCardProps> = ({
  headline,
  subheadline,
  cta,
  website,
  brandPrimary,
  brandAccent,
  brandDark,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const headlineScale = spring({
    fps,
    frame: frame - 10,
    config: { damping: 12, mass: 0.8, stiffness: 80 },
  });

  const ctaOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ctaScale = interpolate(frame % 30, [0, 15, 30], [1, 1.03, 1]);

  const urlOpacity = interpolate(frame, [35, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const displayText = subheadline
    ? `${headline}\n${subheadline}`
    : headline;

  return (
    <AbsoluteFill
      style={{
        opacity: bgOpacity,
        background: `linear-gradient(135deg, ${brandPrimary} 0%, ${brandDark} 50%, ${brandDark} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: `linear-gradient(90deg, ${brandAccent}, ${brandPrimary}, #235af3)`,
        }}
      />

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            transform: `scale(${headlineScale})`,
            fontFamily: "Karla, Arial, sans-serif",
            fontSize: 58,
            fontWeight: 700,
            color: "white",
            lineHeight: 1.3,
            marginBottom: 40,
            whiteSpace: "pre-line",
          }}
        >
          {displayText}
        </div>

        <div style={{ opacity: ctaOpacity, transform: `scale(${ctaScale})` }}>
          <div
            style={{
              display: "inline-block",
              fontFamily: "Karla, Arial, sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: brandDark,
              backgroundColor: brandAccent,
              padding: "18px 50px",
              borderRadius: 50,
              boxShadow: `0 4px 30px ${brandAccent}66`,
            }}
          >
            {cta}
          </div>
        </div>

        {website && (
          <div
            style={{
              opacity: urlOpacity,
              fontFamily: "Karla, Arial, sans-serif",
              fontSize: 24,
              color: "rgba(255,255,255,0.7)",
              marginTop: 30,
              letterSpacing: 1,
            }}
          >
            {website}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
