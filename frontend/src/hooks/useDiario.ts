import { useCallback, useEffect, useState } from "react";
import { lerDiario, Registro, salvarDiario } from "../lib/diario";

export function useDiario() {
  const [registros, setRegistros] = useState<Registro[]>(() => lerDiario());

  useEffect(() => {
    salvarDiario(registros);
  }, [registros]);

  const adicionar = useCallback((r: Registro) => {
    setRegistros((atual) => [...atual, r]);
  }, []);

  const remover = useCallback((id: string) => {
    setRegistros((atual) => atual.filter((r) => r.id !== id));
  }, []);

  const anotar = useCallback((id: string, nota: string) => {
    const limpa = nota.trim().slice(0, 1000);
    setRegistros((atual) =>
      atual.map((r) => {
        if (r.id !== id) return r;
        const { nota: _antiga, ...semNota } = r;
        return limpa ? { ...semNota, nota: limpa } : semNota;
      })
    );
  }, []);

  return { registros, adicionar, remover, anotar };
}
