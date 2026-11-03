import { createHash, randomBytes } from "node:crypto";
import { Request, Response } from "express";
import { Op } from "sequelize";
import { Sessao } from "../models/Sessao";
import { Usuario } from "../models/Usuario";

const COOKIE_SESSAO = "gestao_clinica_sessao";
const DURACAO_SESSAO_MS = 8 * 60 * 60 * 1000;

export type Autenticacao = {
  usuario: Usuario;
  sessao: Sessao;
};

function gerarTokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function obterTokenDoCookie(request: Request): string | null {
  const cookies = request.headers.cookie?.split(";") ?? [];

  for (const cookie of cookies) {
    const [nome, ...partesValor] = cookie.trim().split("=");

    if (nome === COOKIE_SESSAO) {
      return decodeURIComponent(partesValor.join("="));
    }
  }

  return null;
}

export async function criarSessao(usuarioId: number): Promise<{
  token: string;
  expiraEm: Date;
}> {
  await Sessao.destroy({ where: { expiraEm: { [Op.lt]: new Date() } } });

  const token = randomBytes(32).toString("hex");
  const expiraEm = new Date(Date.now() + DURACAO_SESSAO_MS);

  await Sessao.create({
    tokenHash: gerarTokenHash(token),
    usuarioId,
    expiraEm,
  });

  return { token, expiraEm };
}

export async function obterAutenticacao(request: Request): Promise<Autenticacao | null> {
  const token = obterTokenDoCookie(request);

  if (!token) {
    return null;
  }

  const sessao = await Sessao.findOne({
    where: {
      tokenHash: gerarTokenHash(token),
      expiraEm: { [Op.gt]: new Date() },
    },
  });

  if (!sessao) {
    return null;
  }

  const usuario = await Usuario.findByPk(sessao.usuarioId);

  if (!usuario) {
    await sessao.destroy();
    return null;
  }

  return { usuario, sessao };
}

export async function encerrarSessao(request: Request): Promise<void> {
  const token = obterTokenDoCookie(request);

  if (token) {
    await Sessao.destroy({ where: { tokenHash: gerarTokenHash(token) } });
  }
}

export function definirCookieSessao(response: Response, token: string): void {
  response.cookie(COOKIE_SESSAO, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: DURACAO_SESSAO_MS,
    path: "/",
  });
}

export function removerCookieSessao(response: Response): void {
  response.clearCookie(COOKIE_SESSAO, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}
