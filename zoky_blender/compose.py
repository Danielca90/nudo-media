"""Compone la hoja de vistas (frente, lateral, trasera, superior + 3/4) sobre fondo gris.
Uso: python3 -I compose.py <carpeta con los PNG>"""
import sys, os
from PIL import Image, ImageDraw, ImageFont

d = sys.argv[1]
BG = (218, 218, 218)


def load(n):
    im = Image.open(os.path.join(d, n + ".png")).convert("RGBA")
    bg = Image.new("RGBA", im.size, BG + (255,))
    bg.alpha_composite(im)
    return bg.convert("RGB")


try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 22)
except Exception:
    font = ImageFont.load_default()

views = [("VISTA FRONTAL", "frente"), ("VISTA LATERAL", "lateral"), ("VISTA TRASERA", "trasera"), ("VISTA SUPERIOR", "superior")]
w, h = 700, 900
sheet = Image.new("RGB", (w * 4, h + 60), BG)
dr = ImageDraw.Draw(sheet)
for i, (lab, n) in enumerate(views):
    im = load(n)
    if n == "superior":
        im = im.resize((w, w))
        sheet.paste(im, (i * w, (h - w) // 2))
    else:
        sheet.paste(im, (i * w, 0))
    tw = dr.textlength(lab, font=font)
    dr.text((i * w + (w - tw) / 2, h + 12), lab, fill=(40, 40, 50), font=font)
sheet.save(os.path.join(d, "hoja_vistas.png"))
load("tres_cuartos").save(os.path.join(d, "tres_cuartos_fondo.png"))
print("ok")
