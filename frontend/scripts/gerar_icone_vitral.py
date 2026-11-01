"""Ícone do app: cruz dourada sobre mosaico de vitral (azul, vermelho e dourado)."""
import random
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

PASTA = Path(__file__).resolve().parent.parent / "public" / "icons"
PASTA.mkdir(parents=True, exist_ok=True)
random.seed(7)

AZUIS = [(30, 58, 138), (37, 99, 235), (14, 116, 144), (49, 46, 129), (59, 130, 246)]
VERMELHOS = [(153, 27, 27), (185, 28, 28), (127, 29, 29)]
DOURADOS = [(202, 138, 4), (234, 179, 8), (250, 204, 21)]
CHUMBO = (20, 14, 30)


def vitral(tam):
    img = Image.new("RGB", (tam, tam), CHUMBO)
    d = ImageDraw.Draw(img)
    celula = tam // 8
    for y in range(0, tam, celula):
        for x in range(0, tam, celula):
            r = random.random()
            cor = random.choice(AZUIS) if r < 0.6 else random.choice(VERMELHOS) if r < 0.85 else random.choice(DOURADOS)
            pad = max(3, tam // 120)
            d.rounded_rectangle([x + pad, y + pad, x + celula - pad, y + celula - pad], radius=pad * 2, fill=cor)
    # brilho suave no centro, como luz atravessando o vidro
    luz = Image.new("RGB", (tam, tam), (0, 0, 0))
    ld = ImageDraw.Draw(luz)
    ld.ellipse([tam * 0.2, tam * 0.1, tam * 0.8, tam * 0.7], fill=(60, 50, 10))
    luz = luz.filter(ImageFilter.GaussianBlur(tam // 6))
    img = Image.blend(img, Image.eval(img, lambda v: v), 0)
    from PIL import ImageChops
    img = ImageChops.add(img, luz)
    return img


def cruz(img):
    tam = img.width
    glow = Image.new("RGB", img.size, (0, 0, 0))
    gd = ImageDraw.Draw(glow)
    cx, cy = tam / 2, tam / 2
    haste, larg = tam * 0.11, tam * 0.36
    gd.rounded_rectangle([cx - haste * 1.6, cy - larg * 0.95, cx + haste * 1.6, cy + larg * 0.95], radius=haste, fill=(120, 90, 10))
    gd.rounded_rectangle([cx - larg * 0.7, cy - larg * 0.35, cx + larg * 0.7, cy - larg * 0.35 + haste * 2.4], radius=haste, fill=(120, 90, 10))
    glow = glow.filter(ImageFilter.GaussianBlur(tam // 14))
    from PIL import ImageChops
    img = ImageChops.add(img, glow)
    d = ImageDraw.Draw(img)
    borda = max(4, tam // 60)
    d.rounded_rectangle([cx - haste * 1.6 - borda, cy - larg * 0.95 - borda, cx + haste * 1.6 + borda, cy + larg * 0.95 + borda], radius=haste, fill=CHUMBO)
    d.rounded_rectangle([cx - haste * 1.6, cy - larg * 0.95, cx + haste * 1.6, cy + larg * 0.95], radius=haste, fill=(250, 204, 21))
    d.rounded_rectangle([cx - larg * 0.7 - borda, cy - larg * 0.35 - borda, cx + larg * 0.7 + borda, cy - larg * 0.35 + haste * 2.4 + borda], radius=haste, fill=CHUMBO)
    d.rounded_rectangle([cx - larg * 0.7, cy - larg * 0.35, cx + larg * 0.7, cy - larg * 0.35 + haste * 2.4], radius=haste, fill=(250, 204, 21))
    return img


base = cruz(vitral(1024))
for tam, nome in [(512, "icon-512.png"), (192, "icon-192.png"), (180, "apple-touch-icon.png")]:
    base.resize((tam, tam), Image.LANCZOS).save(PASTA / nome, "PNG", optimize=True)
print("Ícones de vitral gerados em", PASTA)
