import { CadastroPage } from "./pages/CadastroPage";
import { EstatisticasPage } from "./pages/EstatisticasPage";
import { LoginPage } from "./pages/LoginPage";
import { SistemaPage } from "./pages/SistemaPage";

function PublicLayout({ pagina }: { pagina: "cadastro" | "login" }) {
  return (
    <div className="page">
      <header className="simple-header">
        <a className="simple-brand" href="/login">Gestão Clínica</a>
        <nav aria-label="Navegação principal">
          <a href="/login">Login</a>
          <a href="/cadastro">Cadastro</a>
        </nav>
      </header>

      <main className="auth-main">
        {pagina === "login" ? <LoginPage /> : <CadastroPage />}
      </main>

      <footer className="simple-footer">Projeto acadêmico — Sprint 1</footer>
    </div>
  );
}

function PaginaNaoEncontrada() {
  return (
    <section className="card compact-card not-found">
      <h1>Página não encontrada</h1>
      <p className="description">O endereço informado não existe.</p>
      <a className="button-link" href="/login">Voltar ao login</a>
    </section>
  );
}

function App() {
  const path = window.location.pathname;

  if (path === "/" || path === "/login") {
    return <PublicLayout pagina="login" />;
  }

  if (path === "/cadastro") {
    return <PublicLayout pagina="cadastro" />;
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
