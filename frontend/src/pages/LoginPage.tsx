import { useState } from "react";
import type { FormEvent } from "react";
import { ApiError, loginUsuario } from "../services/api";
import { emailEhValido } from "../validacoes";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensagem("");
    const emailNormalizado = email.trim().toLowerCase();

    if (!emailNormalizado || !senha) {
      setMensagem("Preencha o e-mail e a senha.");
      return;
    }
    if (!emailEhValido(emailNormalizado)) {
      setMensagem("Informe um e-mail válido.");
      return;
    }

    setEnviando(true);

    try {
      await loginUsuario(emailNormalizado, senha);
      window.location.assign("/sistema");
    } catch (error) {
      setMensagem(error instanceof ApiError ? error.message : "Ocorreu um erro inesperado.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="card compact-card" aria-labelledby="titulo-login">
      <h1 id="titulo-login">Entrar no sistema</h1>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="field text-left">
          <label htmlFor="login-email">E-mail</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="field text-left">
          <label htmlFor="login-senha">Senha</label>
          <input
            id="login-senha"
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {mensagem && <p className="feedback error-box" role="alert">{mensagem}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="footer-text">Ainda não possui conta? <a href="/cadastro">Cadastre-se</a></p>
    </section>
  );
}

