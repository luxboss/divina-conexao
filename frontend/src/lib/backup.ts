import { LIMITE_NOTA, type Favorito } from "./favoritos";

export const VERSAO_BACKUP = 1;

/** Confere só os campos obrigatórios; a nota é tratada depois, sem descartar o favorito. */
function temCamposObrigatorios(
  f: unknown
): f is { tema: string; referencia: string; texto: string; nota?: unknown } {
  if (typeof f !== "object" || f === null) return false;
  const o = f as Record<string, unknown>;
  return typeof o.tema === "string" && typeof o.referencia === "string" && typeof o.texto === "string";
}

export const NOME_ARQUIVO_BACKUP = (data: Date = new Date()): string => {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `altar-diario-backup-${ano}-${mes}-${dia}.json`;
};

/** Gera o conteúdo do arquivo de backup. */
export function exportarBackup(favoritos: Favorito[], agora: Date = new Date()): string {
  return JSON.stringify(
    { versao: VERSAO_BACKUP, exportadoEm: agora.toISOString(), favoritos },
    null,
    2
  );
}

export type ResultadoImportacao =
  | { ok: true; favoritos: Favorito[] }
  | { ok: false; erro: string };

/** Lê um backup. Entradas inválidas são descartadas; a nota, se inválida, é removida. */
export function importarBackup(bruto: string): ResultadoImportacao {
  let obj: unknown;
  try {
    obj = JSON.parse(bruto);
  } catch {
    return { ok: false, erro: "O arquivo não é um backup válido (JSON inválido)." };
  }
  if (typeof obj !== "object" || obj === null) {
    return { ok: false, erro: "O arquivo não tem o formato esperado." };
  }
  const o = obj as Record<string, unknown>;
  if (o.versao !== VERSAO_BACKUP) {
    return { ok: false, erro: "Versão de backup não reconhecida." };
  }
  if (!Array.isArray(o.favoritos)) {
    return { ok: false, erro: "O backup não contém a lista de favoritos." };
  }
  const favoritos: Favorito[] = o.favoritos
    .filter(temCamposObrigatorios)
    .map((f) => {
      const base = { tema: f.tema, referencia: f.referencia, texto: f.texto };
      if (typeof f.nota !== "string") return base;
      const nota = f.nota.trim().slice(0, LIMITE_NOTA);
      return nota ? { ...base, nota } : base;
    });
  return { ok: true, favoritos };
}
