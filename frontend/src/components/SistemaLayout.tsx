import type { ReactNode } from "react";
import { encerrarSessao } from "../services/api";

type SistemaLayoutProps = {
  children: ReactNode;
  paginaAtiva: "visao-geral" | "indicadores";
};

export function SistemaLayout({ children, paginaAtiva }: SistemaLayoutProps) {
  return (
    <div className="system-page">
      <header className="system-header">
        <a className="simple-brand" href="/sistema">Gestão Clínica</a>

        <nav aria-label="Navegação do sistema">
          <a className={paginaAtiva === "visao-geral" ? "active" : ""} href="/sistema">
            Início
          </a>
          <a className={paginaAtiva === "indicadores" ? "active" : ""} href="/estatisticas">
            Estatísticas
          </a>
          <button className="logout-link" type="button" onClick={() => void encerrarSessao()}>
            Sair
          </button>
        </nav>
      </header>

      <main className="system-main">{children}</main>
    </div>
  );
}
