import { useCallback, useEffect, useState } from "react";
import {
  alternarFavorito,
  definirNota,
  estaFavoritado,
  Favorito,
  lerFavoritos,
  salvarFavoritos
} from "../lib/favoritos";

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<Favorito[]>(() => lerFavoritos());

  useEffect(() => {
    salvarFavoritos(favoritos);
  }, [favoritos]);

  const alternar = useCallback((novo: Favorito) => {
    setFavoritos((atual) => alternarFavorito(atual, novo));
  }, []);

  const remover = useCallback((tema: string, referencia: string) => {
    setFavoritos((atual) => atual.filter((f) => !(f.tema === tema && f.referencia === referencia)));
  }, []);

  const anotar = useCallback((tema: string, referencia: string, nota: string) => {
    setFavoritos((atual) => definirNota(atual, tema, referencia, nota));
  }, []);

  const substituir = useCallback((lista: Favorito[]) => {
    setFavoritos(lista);
  }, []);

  const verificar = useCallback(
    (tema: string, referencia: string) => estaFavoritado(favoritos, tema, referencia),
    [favoritos]
  );

  return { favoritos, alternar, remover, anotar, substituir, verificar };
}
