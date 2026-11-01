/** Folga em pixels para ignorar tremores de rolagem. */
export const FOLGA_ROLAGEM = 8;
/** Abaixo desta posição (topo da página) a barra fica sempre visível. */
export const TOPO_ROLAGEM = 40;

/**
 * Decide se a barra inferior aparece: some ao descer a página e volta ao subir.
 */
export function decidirVisibilidade(args: { anterior: number; atual: number; visivel: boolean }): boolean {
  const { anterior, atual, visivel } = args;
  if (atual <= TOPO_ROLAGEM) return true;
  if (atual - anterior > FOLGA_ROLAGEM) return false;
  if (anterior - atual > FOLGA_ROLAGEM) return true;
  return visivel;
}
