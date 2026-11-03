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
        if (error instanceof ApiError && error.message.includes("sessão")) {
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
      <section className="card system-card">
        <span className="eyebrow">Área do sistema</span>
        <h1>Bem-vindo, {primeiroNome}</h1>
        <p className="description">Você entrou no sistema com sucesso.</p>

        <div className="user-details">
          <div>
            <span>Nome</span>
            <strong>{usuario.nome}</strong>
          </div>
          <div>
            <span>E-mail</span>
            <strong>{usuario.email}</strong>
          </div>
        </div>

        <a className="button-link secondary-button" href="/estatisticas">
          Ver estatísticas
        </a>
      </section>
    </SistemaLayout>
  );
}
