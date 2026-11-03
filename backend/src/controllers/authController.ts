import { Request, Response } from "express";
import { Usuario } from "../models/Usuario";
import {
  Autenticacao,
  criarSessao,
  definirCookieSessao,
  encerrarSessao,
  removerCookieSessao,
} from "../services/sessaoService";
import { verificarSenha } from "../services/senhaService";

function apresentarAutenticacao(autenticacao: Autenticacao) {
  return {
    usuario: {
      id: autenticacao.usuario.id,
      nome: autenticacao.usuario.nome,
      email: autenticacao.usuario.email,
    },
  };
}

export async function login(request: Request, response: Response): Promise<void> {
  const body = request.body as Record<string, unknown> | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const senha = typeof body?.senha === "string" ? body.senha : "";

  if (!email || !senha) {
    response.status(400).json({ mensagem: "Informe o e-mail e a senha." });
    return;
  }

  const usuario = await Usuario.findOne({ where: { email } });

  if (!usuario || !(await verificarSenha(senha, usuario.senhaHash))) {
    response.status(401).json({ mensagem: "E-mail ou senha inválidos." });
    return;
  }

  const sessaoCriada = await criarSessao(usuario.id);
  definirCookieSessao(response, sessaoCriada.token);

  response.json({
    mensagem: "Login realizado com sucesso.",
  });
}

export function consultarSessao(_request: Request, response: Response): void {
  const autenticacao = response.locals.autenticacao as Autenticacao;
  response.setHeader("Cache-Control", "no-store");
  response.json(apresentarAutenticacao(autenticacao));
}

export async function logout(request: Request, response: Response): Promise<void> {
  await encerrarSessao(request);
  removerCookieSessao(response);
  response.status(204).send();
}
