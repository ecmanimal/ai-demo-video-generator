import React from "react";
import { Composition } from "remotion";
import { DemoVideo } from "./DemoVideo";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require("../../video.config");

const fps = config.fps || 30;
const audioDuration = config.audioDuration || 45;
const durationInFrames = Math.ceil(audioDuration * fps);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DemoVideo"
        component={DemoVideo}
        durationInFrames={durationInFrames}
        fps={fps}
        width={(config.viewport && config.viewport.width) || 1920}
        height={(config.viewport && config.viewport.height) || 1080}
      />
    </>
  );
};
