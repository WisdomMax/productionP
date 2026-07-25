from pathlib import Path
import subprocess
import sys

import cv2
import numpy as np
import torch
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForDepthEstimation


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/videos/00-hero-depth/web/hero-production-p-web.mp4"
OUTPUT = ROOT / "public/videos/00-hero-depth/depth/hero-depth-v2.mp4"
MODEL_ID = "depth-anything/Depth-Anything-V2-Small-hf"
DEPTH_WIDTH = 350
DEPTH_HEIGHT = 196
BATCH_SIZE = 4


def normalize_depth(depth: np.ndarray) -> np.ndarray:
    low, high = np.percentile(depth, (2.0, 98.0))
    normalized = np.clip((depth - low) / max(high - low, 1e-6), 0.0, 1.0)
    return normalized


def main() -> None:
    processor = AutoImageProcessor.from_pretrained(MODEL_ID, local_files_only=True)
    model = AutoModelForDepthEstimation.from_pretrained(
        MODEL_ID, local_files_only=True
    ).eval()

    capture = cv2.VideoCapture(str(SOURCE))
    fps = capture.get(cv2.CAP_PROP_FPS)
    frame_count = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))
    if not capture.isOpened() or not fps or not frame_count:
        raise RuntimeError(f"Could not read {SOURCE}")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    command = [
        "ffmpeg",
        "-loglevel",
        "error",
        "-y",
        "-f",
        "rawvideo",
        "-pixel_format",
        "gray",
        "-video_size",
        f"{DEPTH_WIDTH}x{DEPTH_HEIGHT}",
        "-framerate",
        f"{fps:.6f}",
        "-i",
        "-",
        "-an",
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "18",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        str(OUTPUT),
    ]
    encoder = subprocess.Popen(command, stdin=subprocess.PIPE)
    if encoder.stdin is None:
        raise RuntimeError("Could not open ffmpeg input pipe")

    processed = 0
    previous: np.ndarray | None = None

    try:
        while True:
            images: list[Image.Image] = []
            for _ in range(BATCH_SIZE):
                ok, frame = capture.read()
                if not ok:
                    break
                rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                images.append(Image.fromarray(rgb))
            if not images:
                break

            inputs = processor(
                images=images,
                return_tensors="pt",
                size={"height": DEPTH_HEIGHT, "width": DEPTH_WIDTH},
            )
            with torch.inference_mode():
                predictions = model(**inputs).predicted_depth.cpu().numpy()

            for prediction in predictions:
                normalized = normalize_depth(prediction)
                if previous is not None:
                    normalized = previous * 0.58 + normalized * 0.42
                previous = normalized
                frame = np.round(normalized * 255.0).astype(np.uint8)
                encoder.stdin.write(frame.tobytes())
                processed += 1

            if processed % 96 == 0 or processed == frame_count:
                print(
                    f"depth {processed}/{frame_count} "
                    f"({processed / frame_count * 100:.1f}%)",
                    flush=True,
                )
    finally:
        capture.release()
        encoder.stdin.close()
        return_code = encoder.wait()

    if return_code != 0:
        raise RuntimeError(f"ffmpeg exited with code {return_code}")
    print(f"created {OUTPUT.relative_to(ROOT)}", flush=True)


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(error, file=sys.stderr)
        raise
