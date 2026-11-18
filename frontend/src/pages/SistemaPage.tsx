import { useEffect, useState } from "react";
import { Carregando } from "../components/Carregando";
import { SistemaLayout } from "../components/SistemaLayout";
import { ApiError, obterSessao } from "../services/api";
import type { SessaoAtual } from "../services/api";

export function SistemaPage() {
  const [autenticacao, setAutenticacao] = useState<SessaoAtual | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    obterSessao()
      .then(setAutenticacao)
      .catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 401) {
          window.location.replace("/login");
          return;
        }

        setErro(error instanceof ApiError ? error.message : "Não foi possível abrir o sistema.");
      });
  }, []);

  if (erro) {
    return (
      <section className="card compact-card not-found">
        <h1>Erro ao carregar</h1>
        <p className="description">{erro}</p>
        <a className="button-link" href="/login">Voltar ao login</a>
      </section>
    );
  }

  if (!autenticacao) {
    return <Carregando />;
  }

  const usuario = autenticacao.usuario;
  const primeiroNome = usuario.nome.split(" ")[0] ?? usuario.nome;

  return (
    <SistemaLayout paginaAtiva="visao-geral">
      <section className="dashboard-heading">
        <span className="eyebrow">Área do sistema</span>
        <h1>Bem-vindo, {primeiroNome}</h1>
        <p className="description">Acesse os cadastros e as informações da clínica.</p>
      </section>

      <div className="dashboard-layout">
        <section className="card dashboard-section" aria-labelledby="titulo-cadastros">
          <div className="dashboard-section-heading">
            <div>
              <span className="section-label">Cadastros</span>
              <h2 id="titulo-cadastros">Organização da clínica</h2>
            </div>
            <span className="section-count">2 módulos</span>
          </div>

          <div className="module-list">
            <a className="module-row" href="/pacientes">
              <div>
                <h3>Pacientes</h3>
                <p>Dados pessoais e informações de contato.</p>
              </div>
              <strong>Abrir</strong>
            </a>

            <a className="module-row" href="/profissionais">
              <div>
                <h3>Profissionais</h3>
                <p>Registros, especialidades e situação da equipe.</p>
              </div>
              <strong>Abrir</strong>
            </a>
          </div>
        </section>

        <div className="dashboard-side">
          <section className="card dashboard-section compact-section">
            <span className="section-label">Relatórios</span>
            <h2>Estatísticas</h2>
            <p>Acompanhe os usuários cadastrados no sistema.</p>
            <a className="text-link" href="/estatisticas">Ver análise</a>
          </section>

          <section className="account-summary">
            <span>Usuário conectado</span>
            <strong>{usuario.nome}</strong>
            <small>{usuario.email}</small>
          </section>
        </div>
      </div>
    </SistemaLayout>
  );
}
