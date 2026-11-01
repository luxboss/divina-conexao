import { createClient } from "@supabase/supabase-js";

// Chave pública (publishable): feita para ficar no navegador. A segurança dos dados
// vem das regras de acesso (RLS) no banco, não desta chave.
const URL_PROJETO = "https://nrwkuoyesiyfnzsnvzij.supabase.co";
const CHAVE_PUBLICA = "sb_publishable_0lt5cB19O6kdX6tBAhnLwA_YxnHxXbu";

export const supabase = createClient(URL_PROJETO, CHAVE_PUBLICA, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});
