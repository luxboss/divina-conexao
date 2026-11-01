import { chaveDoDia } from "./versiculoDoDia";

export interface Registro {
  id: string;
  /** Dia do registro no formato AAAA-MM-DD (horário local). */
  data: string;
  humor: string;
  tema: string;
  referencia: string;
  texto: string;
  nota?: string;
}

export type Periodo = "semana" | "mes" | "ano";

export const CHAVE_DIARIO = "divina-conexao:diario";

export function criarRegistro(
  dados: Omit<Registro, "id" | "data">,
  agora: Date = new Date()
): Registro {
  const data = chaveDoDia(agora);
  return { ...dados, data, id: `${data}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}` };
}

function diaAnterior(chave: string): string {
  const [a, m, d] = chave.split("-").map(Number);
  return chaveDoDia(new Date(a, m - 1, d - 1));
}

/** Quantos dias seguidos há registros, contando de hoje (ou de ontem, se hoje ainda não tem). */
export function diasSeguidos(registros: Registro[], hoje: Date = new Date()): number {
  const dias = new Set(registros.map((r) => r.data));
  let cursor = chaveDoDia(hoje);
  if (!dias.has(cursor)) cursor = diaAnterior(cursor);
  let total = 0;
  while (dias.has(cursor)) {
    total++;
    cursor = diaAnterior(cursor);
  }
  return total;
}

export interface Barra {
  rotulo: string;
  total: number;
}

const NOMES_DIA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const NOMES_MES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** Monta as barras do gráfico de evolução para o período escolhido. */
export function agruparEvolucao(registros: Registro[], periodo: Periodo, hoje: Date = new Date()): Barra[] {
  const contagem = new Map<string, number>();
  for (const r of registros) contagem.set(r.data, (contagem.get(r.data) ?? 0) + 1);

  if (periodo === "semana") {
    const barras: Barra[] = [];
    for (let i = 6; i >= 0; i--) {
      const dia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - i);
      barras.push({ rotulo: NOMES_DIA[dia.getDay()], total: contagem.get(chaveDoDia(dia)) ?? 0 });
    }
    return barras;
  }

  if (periodo === "mes") {
    const ano = hoje.getFullYear();
    return NOMES_MES.map((rotulo, mes) => {
      const total = registros.filter((r) => {
        const [a, m] = r.data.split("-").map(Number);
        return a === ano && m - 1 === mes;
      }).length;
      return { rotulo, total };
    });
  }

  const anoAtual = hoje.getFullYear();
  const barras: Barra[] = [];
  for (let ano = anoAtual - 4; ano <= anoAtual; ano++) {
    const total = registros.filter((r) => Number(r.data.slice(0, 4)) === ano).length;
    barras.push({ rotulo: String(ano), total });
  }
  return barras;
}

export interface ResumoEvolucao {
  total: number;
  diasUnicos: number;
  humorMaisFrequente: string | null;
}

export function resumoEvolucao(registros: Registro[]): ResumoEvolucao {
  if (registros.length === 0) return { total: 0, diasUnicos: 0, humorMaisFrequente: null };
  const porHumor = new Map<string, number>();
  for (const r of registros) porHumor.set(r.humor, (porHumor.get(r.humor) ?? 0) + 1);
  let melhor: string | null = null;
  let melhorTotal = 0;
  for (const [humor, total] of porHumor) {
    if (total > melhorTotal) {
      melhor = humor;
      melhorTotal = total;
    }
  }
  return {
    total: registros.length,
    diasUnicos: new Set(registros.map((r) => r.data)).size,
    humorMaisFrequente: melhor
  };
}

/** Lê o diário salvo; dados inválidos viram lista vazia. */
export function lerDiario(armazenamento: Storage = localStorage): Registro[] {
  try {
    const bruto = armazenamento.getItem(CHAVE_DIARIO);
    if (!bruto) return [];
    const lista = JSON.parse(bruto);
    if (!Array.isArray(lista)) return [];
    return lista.filter(
      (r) =>
        typeof r?.id === "string" && typeof r?.data === "string" && typeof r?.humor === "string" &&
        typeof r?.tema === "string" && typeof r?.referencia === "string" && typeof r?.texto === "string"
    );
  } catch {
    return [];
  }
}

export function salvarDiario(registros: Registro[], armazenamento: Storage = localStorage): void {
  armazenamento.setItem(CHAVE_DIARIO, JSON.stringify(registros));
}
