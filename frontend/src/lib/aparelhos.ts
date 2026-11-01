import { supabase } from "./supabase";
import { nomeDoAparelho, obterIdDispositivo } from "./dispositivo";

export interface Aparelho {
  id: string;
  nome: string | null;
  ultimo_acesso: string;
  atual: boolean;
}

export type ResultadoRegistro =
  | { ok: true }
  | { ok: false; limite: true }
  | { ok: false; limite: false; erro: string };

/** Registra este aparelho na conta. Retorna `limite: true` quando a conta já tem o máximo de aparelhos. */
export async function registrarAparelhoAtual(): Promise<ResultadoRegistro> {
  const id = obterIdDispositivo();
  const nome = nomeDoAparelho(navigator.userAgent);
  const { error } = await supabase.rpc("registrar_dispositivo", { p_device_id: id, p_nome: nome });
  if (!error) return { ok: true };
  if (/limite_dispositivos/.test(error.message)) return { ok: false, limite: true };
  return { ok: false, limite: false, erro: "Não foi possível registrar este aparelho. Tente de novo." };
}

export async function listarAparelhos(): Promise<Aparelho[]> {
  const atual = obterIdDispositivo();
  const { data, error } = await supabase
    .from("dispositivos")
    .select("id, nome, ultimo_acesso, device_id")
    .order("ultimo_acesso", { ascending: false });
  if (error || !data) return [];
  return data.map((d) => ({
    id: d.id,
    nome: d.nome,
    ultimo_acesso: d.ultimo_acesso,
    atual: d.device_id === atual
  }));
}

export async function removerAparelho(id: string): Promise<void> {
  await supabase.from("dispositivos").delete().eq("id", id);
}
