import { useMemo, useState } from "react";
import { useDiario } from "../hooks/useDiario";
import { agruparEvolucao, diasSeguidos, resumoEvolucao, type Periodo } from "../lib/diario";
import { rotuloDoHumor } from "../lib/humores";

const PERIODOS: { id: Periodo; rotulo: string }[] = [
  { id: "semana", rotulo: "Semana" },
  { id: "mes", rotulo: "Mês" },
  { id: "ano", rotulo: "Ano" }
];

export default function Evolucao() {
  const { registros } = useDiario();
  const [periodo, setPeriodo] = useState<Periodo>("semana");
  const hoje = useMemo(() => new Date(), []);
  const barras = useMemo(() => agruparEvolucao(registros, periodo, hoje), [registros, periodo, hoje]);
  const resumo = useMemo(() => resumoEvolucao(registros), [registros]);
  const sequencia = useMemo(() => diasSeguidos(registros, hoje), [registros, hoje]);
  const maximo = Math.max(1, ...barras.map((b) => b.total));

  return (
    <section className="pagina">
      <header className="cabecalho">
        <h1>Minha evolução</h1>
        <p className="subtitulo">Acompanhe seu crescimento espiritual</p>
      </header>

      <div className="abas" role="tablist" aria-label="Período">
        {PERIODOS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={periodo === p.id}
            className={periodo === p.id ? "aba ativa" : "aba"}
            onClick={() => setPeriodo(p.id)}
          >
            {p.rotulo}
          </button>
        ))}
      </div>

      {registros.length === 0 ? (
        <div className="cartao-vazio">
          <p>Nenhum registro encontrado.</p>
          <p>Seus momentos aparecem aqui conforme você usa o app.</p>
        </div>
      ) : (
        <>
          <div className="resumo-evolucao">
            <div><strong>{sequencia}</strong><span>dias seguidos</span></div>
            <div><strong>{resumo.total}</strong><span>registros</span></div>
            <div><strong>{resumo.diasUnicos}</strong><span>dias com registro</span></div>
          </div>
          {resumo.humorMaisFrequente && (
            <p className="subtitulo centro">Humor mais frequente: {rotuloDoHumor(resumo.humorMaisFrequente)}</p>
          )}
          <div className="grafico" role="img" aria-label={`Registros por ${periodo}`}>
            {barras.map((b, i) => (
              <div key={`${b.rotulo}-${i}`} className="coluna">
                <div className="barra" style={{ height: `${Math.round((b.total / maximo) * 100)}%` }} title={`${b.total}`} />
                <span className="rotulo-barra">{b.rotulo}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
