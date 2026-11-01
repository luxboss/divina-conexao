"""Gera os ícones do PWA: fundo azul-roxo com uma cruz dourada (PNG e SVG)."""
from pathlib import Path
from PIL import Image, ImageDraw

PASTA = Path(__file__).resolve().parent.parent / "public" / "icons"
PASTA.mkdir(parents=True, exist_ok=True)

OURO = (250, 204, 21, 255)
TOPO = (30, 58, 138)
BASE = (107, 33, 168)


def fundo(tam):
    img = Image.new("RGBA", (tam, tam))
    px = img.load()
    for y in range(tam):
        for x in range(tam):
            t = (x + y) / (2 * tam)
            px[x, y] = tuple(int(TOPO[i] + (BASE[i] - TOPO[i]) * t) for i in range(3)) + (255,)
    return img


def cruz(tam):
    img = fundo(tam)
    d = ImageDraw.Draw(img)
    cx = cy = tam // 2
    haste_l = tam * 0.09
    haste_c = tam * 0.28
    d.rounded_rectangle([cx - haste_l, cy - haste_c * 1.25, cx + haste_l, cy + haste_c * 0.85],
                        radius=haste_l * 0.6, fill=OURO)
    d.rounded_rectangle([cx - haste_c * 0.7, cy - haste_c * 0.45, cx + haste_c * 0.7, cy - haste_c * 0.45 + haste_l * 2],
                        radius=haste_l * 0.6, fill=OURO)
    return img


for tam, nome in [(192, "icon-192.png"), (512, "icon-512.png"), (180, "apple-touch-icon.png")]:
    cruz(tam).convert("RGB").save(PASTA / nome, "PNG", optimize=True)

svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1e3a8a"/>
      <stop offset="1" stop-color="#6b21a8"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#g)"/>
  <rect x="236" y="120" width="40" height="260" rx="20" fill="#facc15"/>
  <rect x="176" y="190" width="160" height="40" rx="20" fill="#facc15"/>
</svg>
"""
(PASTA / "icon.svg").write_text(svg, encoding="utf-8")
print("Ícones gerados em", PASTA)
