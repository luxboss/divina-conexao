import { quebrarLinhas, textoDoVersiculo } from "./compartilhar";
import type { VersiculoValido } from "./versiculos";

const LARGURA = 1080;
const ALTURA = 1350;

/**
 * Desenha o versículo como cartão 1080×1350 (formato de post vertical) e devolve um PNG.
 * Usa a mesma paleta do app: azul-roxo de fundo, texto branco e destaque amarelo.
 */
export async function gerarImagemCartao(v: VersiculoValido): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = LARGURA;
  canvas.height = ALTURA;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponível neste navegador.");

  const fundo = ctx.createLinearGradient(0, 0, LARGURA, ALTURA);
  fundo.addColorStop(0, "#1e3a8a");
  fundo.addColorStop(0.55, "#6b21a8");
  fundo.addColorStop(1, "#2e1065");
  ctx.fillStyle = fundo;
  ctx.fillRect(0, 0, LARGURA, ALTURA);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "#facc15";
  ctx.fillRect(LARGURA / 2 - 60, 190, 120, 6);

  const linhas = quebrarLinhas(v.texto, 34);
  const altura = 68;
  const inicio = ALTURA / 2 - ((linhas.length - 1) * altura) / 2 - 40;
  ctx.fillStyle = "#ffffff";
  ctx.font = `46px Georgia, "Times New Roman", serif`;
  linhas.forEach((linha, i) => ctx.fillText(`“${linha}${i === linhas.length - 1 ? "”" : ""}`, LARGURA / 2, inicio + i * altura));

  ctx.fillStyle = "#facc15";
  ctx.font = "bold 40px system-ui, sans-serif";
  ctx.fillText(v.referencia, LARGURA / 2, ALTURA - 220);

  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "30px system-ui, sans-serif";
  ctx.fillText("ALTAR DIÁRIO", LARGURA / 2, ALTURA - 140);

  return new Promise((resolver, rejeitar) => {
    canvas.toBlob((blob) => (blob ? resolver(blob) : rejeitar(new Error("Falha ao gerar a imagem."))), "image/png");
  });
}

/** Compartilha a imagem pelo menu nativo do aparelho; sem suporte, baixa o arquivo. */
export async function compartilharImagem(v: VersiculoValido): Promise<"compartilhado" | "baixado"> {
  const blob = await gerarImagemCartao(v);
  const arquivo = new File([blob], "versiculo-altar-diario.png", { type: "image/png" });
  const nav = navigator as Navigator & { canShare?: (dados: ShareData) => boolean };
  if (nav.share && nav.canShare?.({ files: [arquivo] })) {
    await nav.share({ files: [arquivo], text: textoDoVersiculo(v) });
    return "compartilhado";
  }
  baixarArquivo(blob, arquivo.name);
  return "baixado";
}

export function baixarArquivo(conteudo: Blob, nome: string): void {
  const url = URL.createObjectURL(conteudo);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
