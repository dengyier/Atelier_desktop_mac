"""Generate original Atelier Desktop assets from a simple letterform."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

BUILD = Path(__file__).resolve().parents[1] / 'build'
FONT = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
GREEN = '#234a39'
CREAM = '#f3f5ef'


def mark(size: int, background: str, foreground: str) -> Image.Image:
    image = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    margin = round(size * 0.09)
    draw.rounded_rectangle((margin, margin, size - margin, size - margin),
                           radius=round(size * 0.21), fill=background)
    font = ImageFont.truetype(FONT, round(size * 0.66))
    box = draw.textbbox((0, 0), 'a', font=font)
    x = (size - (box[2] - box[0])) / 2 - box[0]
    y = (size - (box[3] - box[1])) / 2 - box[1] - size * 0.035
    draw.text((x, y), 'a', fill=foreground, font=font)
    return image


mark(1024, GREEN, CREAM).save(BUILD / 'app-icon.png')
mark(1254, GREEN, CREAM).save(BUILD / 'icon.png')
for suffix, background, foreground in [
    ('light', GREEN, CREAM), ('dark', CREAM, GREEN)
]:
    canvas = Image.new('RGBA', (336, 192), (0, 0, 0, 0))
    canvas.alpha_composite(mark(192, background, foreground), (72, 0))
    canvas.save(BUILD / f'logo-{suffix}.png')
