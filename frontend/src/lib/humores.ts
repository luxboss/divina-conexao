/** Humores da tela inicial. Cada um leva a temas do banco de versículos. */
export interface Humor {
  id: string;
  emoji: string;
  rotulo: string;
  temas: string[];
}

export const HUMORES: Humor[] = [
  { id: "triste", emoji: "😔", rotulo: "Triste", temas: ["Tristeza", "Consolo"] },
  { id: "feliz", emoji: "😊", rotulo: "Feliz", temas: ["Alegria", "Gratidão"] },
  { id: "nervoso", emoji: "😰", rotulo: "Nervoso/a", temas: ["Paz", "Ansiedade"] },
  { id: "grato", emoji: "🙏", rotulo: "Grato/a", temas: ["Gratidão", "Fidelidade"] },
  { id: "ansioso", emoji: "😨", rotulo: "Ansioso/a", temas: ["Ansiedade", "Confiança", "Medo"] },
  { id: "solo", emoji: "😌", rotulo: "Confiante", temas: ["Consolo", "Família", "Amor"] }
];

export function temasDoHumor(id: string): string[] {
  return HUMORES.find((h) => h.id === id)?.temas ?? [];
}

export function rotuloDoHumor(id: string): string {
  return HUMORES.find((h) => h.id === id)?.rotulo ?? id;
}
