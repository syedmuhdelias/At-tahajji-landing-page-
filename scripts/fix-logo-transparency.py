"""Remove baked-in checkerboard background from logo.png and save true transparency."""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
LOGO = ROOT / "image" / "logo.png"
BACKUP = ROOT / "image" / "logo-original.png"


def is_background(r: int, g: int, b: int) -> bool:
    return abs(r - g) < 12 and abs(g - b) < 12 and abs(r - b) < 12 and r > 180


def main() -> None:
    img = Image.open(LOGO).convert("RGBA")
    if not BACKUP.exists():
        img.save(BACKUP)

    width, height = img.size
    pixels = img.load()

    min_x = min_y = width
    max_x = max_y = 0

    for y in range(height):
        for x in range(width):
            r, g, b, _ = pixels[x, y]
            if is_background(r, g, b):
                pixels[x, y] = (0, 0, 0, 0)
            else:
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)

    if min_x <= max_x and min_y <= max_y:
        cx = (min_x + max_x) / 2
        cy = (min_y + max_y) / 2
        radius = min(max_x - min_x, max_y - min_y) / 2 - 1

        for y in range(height):
            for x in range(width):
                if pixels[x, y][3] == 0:
                    continue
                if math.hypot(x - cx, y - cy) > radius:
                    pixels[x, y] = (0, 0, 0, 0)

        img = img.crop((min_x, min_y, max_x + 1, max_y + 1))

    img.save(LOGO, "PNG")
    print(f"Updated {LOGO} ({img.size[0]}x{img.size[1]}) with real transparency.")
    print(f"Original backup: {BACKUP}")


if __name__ == "__main__":
    main()
