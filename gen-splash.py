#!/usr/bin/env python3
import subprocess, io, os
from PIL import Image

SIZES = [
    (750,  1334, "splash-750x1334.png"),    # iPhone SE
    (1125, 2436, "splash-1125x2436.png"),   # iPhone X/XS/11 Pro/12 mini
    (828,  1792, "splash-828x1792.png"),    # iPhone XR/11
    (1242, 2688, "splash-1242x2688.png"),   # iPhone XS Max/11 Pro Max
    (1170, 2532, "splash-1170x2532.png"),   # iPhone 12/13/14/15/16
    (1284, 2778, "splash-1284x2778.png"),   # iPhone 12/13 Pro Max, 14 Plus
    (1179, 2556, "splash-1179x2556.png"),   # iPhone 14 Pro/15 Pro
    (1290, 2796, "splash-1290x2796.png"),   # iPhone 14 Pro Max/15 Plus/15 Pro Max
    (1320, 2868, "splash-1320x2868.png"),   # iPhone 16 Plus
]

SVG_PATH = os.path.join(os.path.dirname(__file__), "logo.svg")
OUT_DIR  = os.path.join(os.path.dirname(__file__), "splash")
BG       = (10, 10, 10)  # #0a0a0a

for w, h, filename in SIZES:
    logo_w = int(w * 0.20)
    result = subprocess.run(["rsvg-convert", "-w", str(logo_w), SVG_PATH], capture_output=True)
    logo = Image.open(io.BytesIO(result.stdout)).convert("RGBA")
    bg = Image.new("RGB", (w, h), BG)
    x = (w - logo.width) // 2
    y = (h - logo.height) // 2
    bg.paste(logo, (x, y), logo)
    bg.save(os.path.join(OUT_DIR, filename))
    print(f"  {filename} ({w}×{h})")

print("Done.")
