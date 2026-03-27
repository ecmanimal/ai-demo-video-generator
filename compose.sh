#!/bin/bash
set -e
cd "$(dirname "$0")"

# --- Read config values ---
VOICEOVER=$(node -e "console.log(require('./video.config').voiceoverFile || 'voiceover.mp3')")
OUTPUT=$(node -e "console.log(require('./video.config').outputFile || 'demo_video_final.mp4')")
RECORDING=$(ls -t recordings/*.webm 2>/dev/null | head -1)

if [ -z "$RECORDING" ]; then
  echo "ERROR: No recording found. Run 'node capture.js' first."
  exit 1
fi

if [ ! -f "$VOICEOVER" ]; then
  echo "ERROR: $VOICEOVER not found. Download it from ElevenLabs and place it in this directory."
  exit 1
fi

# --- Get durations ---
AUDIO_DUR=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$VOICEOVER")
VIDEO_DUR=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$RECORDING")
SPEED=$(echo "scale=6; $VIDEO_DUR / $AUDIO_DUR" | bc)
FADE_OUT=$(echo "$AUDIO_DUR - 2" | bc)

echo "=== Video Composition ==="
echo "  Recording: $RECORDING (${VIDEO_DUR}s)"
echo "  Voiceover: $VOICEOVER (${AUDIO_DUR}s)"
echo "  Speed adjustment: ${SPEED}x"
echo ""

echo "Step 1/2: Speed-adjusting video + adding fades..."
ffmpeg -y -i "$RECORDING" \
  -filter:v "setpts=PTS/${SPEED},fade=in:0:30,fade=out:st=${FADE_OUT}:d=2" \
  -r 24 -c:v libx264 -pix_fmt yuv420p -crf 18 \
  -an \
  _scroll_smooth.mp4 2>&1 | grep -E "^(frame|Input|Output|Stream)" || true

echo ""
echo "Step 2/2: Adding voiceover audio..."
ffmpeg -y -i _scroll_smooth.mp4 -i "$VOICEOVER" \
  -c:v copy -c:a aac -map 0:v -map 1:a \
  -shortest \
  "$OUTPUT" 2>&1 | grep -E "^(frame|Input|Output|Stream)" || true

# Cleanup temp file
rm -f _scroll_smooth.mp4

echo ""
echo "=== DONE ==="
echo "Output: $OUTPUT"
ls -lh "$OUTPUT"
echo ""
echo "Run: open $OUTPUT"
