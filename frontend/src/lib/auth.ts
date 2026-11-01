export const MINIMO_SENHA = 8;

export function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Mensagens de erro para a nova senha (com confirmação). Vazia = válida. */
export function validarNovaSenha(senha: string, confirmacao: string): string[] {
  const erros: string[] = [];
  if (senha.length < MINIMO_SENHA) {
    erros.push(`A senha precisa ter pelo menos ${MINIMO_SENHA} caracteres.`);
  }
  if (senha !== confirmacao) erros.push("As duas senhas não são iguais.");
  return erros;
}

/** Lista de mensagens de erro do formulário de cadastro. Vazia = válido. */
export function validarCadastro(dados: { email: string; senha: string }): string[] {
  const erros: string[] = [];
  if (!validarEmail(dados.email)) erros.push("Informe um e-mail válido.");
  if (dados.senha.length < MINIMO_SENHA) {
    erros.push(`A senha precisa ter pelo menos ${MINIMO_SENHA} caracteres.`);
  }
  return erros;
}
