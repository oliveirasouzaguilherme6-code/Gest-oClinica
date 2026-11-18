import { useState } from "react";
import type { ReactNode } from "react";
import { ApiError, encerrarSessao } from "../services/api";

type SistemaLayoutProps = {
  children: ReactNode;
  paginaAtiva: "visao-geral" | "pacientes" | "profissionais" | "indicadores";
};

export function SistemaLayout({ children, paginaAtiva }: SistemaLayoutProps) {
  const [saindo, setSaindo] = useState(false);
  const [erroSaida, setErroSaida] = useState("");

  async function sair() {
    setSaindo(true);
    setErroSaida("");
    try {
      await encerrarSessao();
    } catch (error) {
      setErroSaida(error instanceof ApiError ? error.message : "Não foi possível sair do sistema.");
      setSaindo(false);
    }
  }

  return (
    <div className="system-page">
      <header className="system-header">
        <div className="system-header-inner">
          <div className="system-brand-block">
            <a className="simple-brand" href="/sistema">Gestão Clínica</a>
            <span>Painel administrativo</span>
          </div>

          <nav aria-label="Navegação do sistema">
            <a className={paginaAtiva === "visao-geral" ? "active" : ""} href="/sistema">
              Início
            </a>
            <a className={paginaAtiva === "pacientes" ? "active" : ""} href="/pacientes">
              Pacientes
            </a>
            <a className={paginaAtiva === "profissionais" ? "active" : ""} href="/profissionais">
              Profissionais
            </a>
            <a className={paginaAtiva === "indicadores" ? "active" : ""} href="/estatisticas">
              Estatísticas
            </a>
            <button className="logout-link" type="button" onClick={() => void sair()} disabled={saindo}>
              {saindo ? "Saindo..." : "Sair"}
            </button>
          </nav>
        </div>
      </header>

      <main className="system-main">
        {erroSaida && <p className="feedback error-box" role="alert">{erroSaida}</p>}
        {children}
      </main>
    </div>
  );
}
