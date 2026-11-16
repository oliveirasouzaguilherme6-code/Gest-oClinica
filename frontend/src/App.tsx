import type { ReactNode } from "react";
import { CadastroPage } from "./pages/CadastroPage";
import { EstatisticasPage } from "./pages/EstatisticasPage";
import { InicioPage } from "./pages/InicioPage";
import { LoginPage } from "./pages/LoginPage";
import { SistemaPage } from "./pages/SistemaPage";

type PublicLayoutProps = {
  pagina: "inicio" | "cadastro" | "login";
  children: ReactNode;
};

function PublicLayout({ pagina, children }: PublicLayoutProps) {
  return (
    <div className="page">
      <header className="simple-header">
        <a className="simple-brand" href="/" aria-current={pagina === "inicio" ? "page" : undefined}>
          Gestão Clínica
        </a>
        <nav aria-label="Navegação principal">
          {pagina === "inicio" && <a href="#sobre">Sobre</a>}
          <a href="/login" aria-current={pagina === "login" ? "page" : undefined}>Entrar</a>
          <a href="/cadastro" aria-current={pagina === "cadastro" ? "page" : undefined}>Cadastro</a>
        </nav>
      </header>

      <main className={pagina === "inicio" ? "institutional-main" : "auth-main"}>{children}</main>

      <footer className="simple-footer">Projeto acadêmico</footer>
    </div>
  );
}

function PaginaNaoEncontrada() {
  return (
    <section className="card compact-card not-found">
      <h1>Página não encontrada</h1>
      <p className="description">O endereço informado não existe.</p>
      <a className="button-link" href="/">Voltar ao início</a>
    </section>
  );
}

function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  if (path === "/") {
    return <PublicLayout pagina="inicio"><InicioPage /></PublicLayout>;
  }

  if (path === "/login") {
    return <PublicLayout pagina="login"><LoginPage /></PublicLayout>;
  }

  if (path === "/cadastro") {
    return <PublicLayout pagina="cadastro"><CadastroPage /></PublicLayout>;
  }

  if (path === "/sistema") {
    return <SistemaPage />;
  }

  if (path === "/estatisticas") {
    return <EstatisticasPage />;
  }

  return <PaginaNaoEncontrada />;
}

export default App;
