import type { ReactNode } from "react";
import { CadastroPage } from "./pages/CadastroPage";
import { EstatisticasPage } from "./pages/EstatisticasPage";
import { LoginPage } from "./pages/LoginPage";
import { PacientesPage } from "./pages/PacientesPage";
import { ProfissionaisPage } from "./pages/ProfissionaisPage";
import { SitePage } from "./pages/SitePage";
import { SistemaPage } from "./pages/SistemaPage";

type PublicLayoutProps = {
  pagina: "cadastro" | "login";
  children: ReactNode;
};

function PublicLayout({ pagina, children }: PublicLayoutProps) {
  return (
    <div className="page">
      <header className="simple-header">
        <a className="simple-brand" href="/">Clínica Vida</a>
        <nav aria-label="Navegação principal">
          <a href="/">Site da clínica</a>
          <a href="/login" aria-current={pagina === "login" ? "page" : undefined}>Login</a>
          <a href="/cadastro" aria-current={pagina === "cadastro" ? "page" : undefined}>Cadastro</a>
        </nav>
      </header>

      <main className="auth-main">{children}</main>

      <footer className="simple-footer">Clínica Vida - Projeto acadêmico</footer>
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
    return <SitePage />;
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

  if (path === "/pacientes") {
    return <PacientesPage />;
  }

  if (path === "/profissionais") {
    return <ProfissionaisPage />;
  }

  if (path === "/estatisticas") {
    return <EstatisticasPage />;
  }

  return <PaginaNaoEncontrada />;
}

export default App;
