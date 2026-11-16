import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ApiError, cadastrarUsuario } from "../services/api";
import {
  somenteNumeros,
  validarFormulario,
} from "../validacoes";
import type { ErrosFormulario, FormularioCadastro } from "../validacoes";

const formularioInicial: FormularioCadastro = {
  nome: "",
  email: "",
  cpf: "",
  senha: "",
  confirmacaoSenha: "",
};

export function CadastroPage() {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [erros, setErros] = useState<ErrosFormulario>({});
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const campo = event.target.name as keyof FormularioCadastro;
    const valor = event.target.value;

    setFormulario((estadoAtual) => ({
      ...estadoAtual,
      [campo]: valor,
    }));
    setErros((errosAtuais) => ({
      ...errosAtuais,
      [campo]: undefined,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensagem("");

    const errosEncontrados = validarFormulario(formulario);

    if (Object.keys(errosEncontrados).length > 0) {
      setErros(errosEncontrados);
      return;
    }

    setErros({});
    setEnviando(true);

    try {
      await cadastrarUsuario({
        nome: formulario.nome.trim(),
        email: formulario.email.trim().toLowerCase(),
        cpf: somenteNumeros(formulario.cpf),
        senha: formulario.senha,
      });

      setSucesso(true);
      setMensagem("Cadastro realizado! Redirecionando para o login...");
      window.setTimeout(() => window.location.assign("/login"), 900);
    } catch (error) {
      if (error instanceof ApiError) {
        setMensagem(error.message);
        setErros(error.erros);
      } else {
        setMensagem("Ocorreu um erro inesperado.");
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="card" aria-labelledby="titulo-cadastro">
      <h1 id="titulo-cadastro">Cadastro de usuário</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="nome">Nome completo</label>
          <input
            id="nome"
            name="nome"
            value={formulario.nome}
            onChange={handleChange}
            autoComplete="name"
            required
            aria-invalid={Boolean(erros.nome)}
            aria-describedby={erros.nome ? "erro-nome" : undefined}
          />
          {erros.nome && <small id="erro-nome" className="error">{erros.nome}</small>}
        </div>

        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formulario.email}
            onChange={handleChange}
            autoComplete="email"
            required
            aria-invalid={Boolean(erros.email)}
            aria-describedby={erros.email ? "erro-email" : undefined}
          />
          {erros.email && <small id="erro-email" className="error">{erros.email}</small>}
        </div>

        <div className="field">
          <label htmlFor="cpf">CPF</label>
          <input
            id="cpf"
            name="cpf"
            value={formulario.cpf}
            onChange={handleChange}
            inputMode="numeric"
            maxLength={14}
            placeholder="Somente números"
            required
            aria-invalid={Boolean(erros.cpf)}
            aria-describedby={erros.cpf ? "erro-cpf" : undefined}
          />
          {erros.cpf && <small id="erro-cpf" className="error">{erros.cpf}</small>}
        </div>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              name="senha"
              type="password"
              value={formulario.senha}
              onChange={handleChange}
              autoComplete="new-password"
              required
              aria-invalid={Boolean(erros.senha)}
              aria-describedby={erros.senha ? "erro-senha" : "ajuda-senha"}
            />
            {erros.senha
              ? <small id="erro-senha" className="error">{erros.senha}</small>
              : <small id="ajuda-senha" className="hint">8 caracteres, número, símbolo e letras.</small>}
          </div>

          <div className="field">
            <label htmlFor="confirmacaoSenha">Confirmar senha</label>
            <input
              id="confirmacaoSenha"
              name="confirmacaoSenha"
              type="password"
              value={formulario.confirmacaoSenha}
              onChange={handleChange}
              autoComplete="new-password"
              required
              aria-invalid={Boolean(erros.confirmacaoSenha)}
              aria-describedby={erros.confirmacaoSenha ? "erro-confirmacao" : undefined}
            />
            {erros.confirmacaoSenha && (
              <small id="erro-confirmacao" className="error">{erros.confirmacaoSenha}</small>
            )}
          </div>
        </div>

        {mensagem && (
          <p className={sucesso ? "feedback success" : "feedback error-box"} role="status">
            {mensagem}
          </p>
        )}

        <button type="submit" disabled={enviando}>
          {enviando ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>

      <p className="footer-text">Já possui cadastro? <a href="/login">Ir para o login</a></p>
    </section>
  );
}

