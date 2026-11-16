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

  return (
    <SistemaLayout paginaAtiva="indicadores">
      <section className="card stats-card">
        <h1>Cadastros por dia</h1>
        <p className="description">Total de usuários cadastrados <strong>{estatisticas.totalUsuarios}</strong></p>

        <ul className="bar-list" aria-label="Gráfico de cadastros por dia">
          {estatisticas.cadastrosPorDia.map((item) => (
            <li className="bar-row" key={item.data}>
              <span>{formatarDia(item.data)}</span>
              <div className="bar-track" aria-hidden="true">
                <div
                  className="bar-value"
                  style={{ width: `${(item.quantidade / maiorQuantidade) * 100}%` }}
                />
              </div>
              <strong>{item.quantidade}</strong>
            </li>
          ))}
        </ul>
      </section>
    </SistemaLayout>
  );
}

