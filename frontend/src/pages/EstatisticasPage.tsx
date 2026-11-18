import { useEffect, useState } from "react";
import { Carregando } from "../components/Carregando";
import { SistemaLayout } from "../components/SistemaLayout";
import { ApiError, obterEstatisticasCadastros } from "../services/api";
import type { EstatisticasCadastros } from "../services/api";

function formatarDia(data: string): string {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(`${data}T12:00:00`));
}

export function EstatisticasPage() {
  const [estatisticas, setEstatisticas] = useState<EstatisticasCadastros | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    obterEstatisticasCadastros()
      .then(setEstatisticas)
      .catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 401) {
          window.location.replace("/login");
          return;
        }

        setErro(error instanceof ApiError ? error.message : "Não foi possível carregar os dados.");
      });
  }, []);

  if (erro) {
    return (
      <section className="card compact-card not-found">
        <h1>Erro ao carregar</h1>
        <p className="description">{erro}</p>
        <a className="button-link" href="/sistema">Voltar</a>
      </section>
    );
  }

  if (!estatisticas) {
    return <Carregando />;
  }

  const maiorQuantidade = Math.max(
    ...estatisticas.cadastrosPorDia.map((item) => item.quantidade),
    1,
  );
  const resumoUsuarios = estatisticas.totalUsuarios === 1
    ? "Há 1 usuário cadastrado no sistema."
    : `Há ${estatisticas.totalUsuarios} usuários cadastrados no sistema.`;

  return (
    <SistemaLayout paginaAtiva="indicadores">
      <section className="stats-page">
        <div className="stats-heading">
          <span className="eyebrow">Probabilidade e Estatística</span>
          <h1>Análise de cadastros</h1>
          <p className="description">
            Quantidade de usuários que começaram a utilizar o sistema em cada dia.
          </p>
        </div>

        <section className="card stats-card">
          <div className="stats-overview">
            <div>
              <span className="section-label">Relatório</span>
              <h2>Cadastros por dia</h2>
              <p className="chart-objective">
                <strong>Objetivo:</strong> acompanhar a entrada de usuários no sistema.
              </p>
            </div>

            <div className="total-box">
              <span>Total de usuários</span>
              <strong>{estatisticas.totalUsuarios}</strong>
            </div>
          </div>

          <div className="chart-panel">
            <div className="bar-list" role="img" aria-label="Gráfico de barras com cadastros por dia">
              {estatisticas.cadastrosPorDia.map((item) => (
                <div className="bar-row" key={item.data}>
                  <span>{formatarDia(item.data)}</span>
                  <div className="bar-track">
                    <div
                      className="bar-value"
                      style={{ width: `${(item.quantidade / maiorQuantidade) * 100}%` }}
                    />
                  </div>
                  <strong>{item.quantidade}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="analysis-box">
            <h2>Conclusão</h2>
            <p>
              {resumoUsuarios} Os dados foram consultados diretamente no banco MySQL.
            </p>
          </div>
        </section>
      </section>
    </SistemaLayout>
  );
}

