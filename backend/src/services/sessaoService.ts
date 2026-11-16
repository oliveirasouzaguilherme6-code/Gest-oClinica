import { createHash, randomUUID } from "node:crypto";
import type { Request } from "express";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { Sessao } from "../models/Sessao";
import { Usuario } from "../models/Usuario";

const EMISSOR = "gestao-clinica";
const DURACAO_SESSAO_SEGUNDOS = 8 * 60 * 60;

export type Autenticacao = {
  usuario: Usuario;
  sessao: Sessao;
};

function gerarTokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function obterSegredoJwt(): string {
  const segredo = process.env.JWT_SECRET?.trim() ?? "";
  if (Buffer.byteLength(segredo, "utf8") < 32) {
    throw new Error("Configure JWT_SECRET no backend/.env com uma chave aleatória de pelo menos 32 bytes.");
  }
  return segredo;
}

export async function criarSessao(usuarioId: number): Promise<string> {
  const agora = new Date();
  await Sessao.destroy({ where: { expiraEm: { [Op.lte]: agora } } });

  const emitidoEm = Math.floor(Date.now() / 1000);
  const token = jwt.sign({ iat: emitidoEm }, obterSegredoJwt(), {
    algorithm: "HS256",
    issuer: EMISSOR,
    subject: String(usuarioId),
    jwtid: randomUUID(),
    expiresIn: DURACAO_SESSAO_SEGUNDOS,
  });

  await Sessao.create({
    tokenHash: gerarTokenHash(token),
    usuarioId,
    expiraEm: new Date((emitidoEm + DURACAO_SESSAO_SEGUNDOS) * 1000),
  });

  return token;
}

export async function obterAutenticacao(request: Request): Promise<Autenticacao | null> {
  const token = /^Bearer\s+(\S+)$/i.exec(request.headers.authorization ?? "")?.[1];

  if (!token) {
    return null;
  }

  const segredo = obterSegredoJwt();
  let payload: string | jwt.JwtPayload;
  try {
    payload = jwt.verify(token, segredo, { algorithms: ["HS256"], issuer: EMISSOR });
  } catch {
    return null;
  }

  if (typeof payload === "string" || !payload.sub || typeof payload.exp !== "number") {
    return null;
  }

  const sessao = await Sessao.findOne({
    where: {
      tokenHash: gerarTokenHash(token),
      expiraEm: { [Op.gt]: new Date() },
    },
  });

  if (!sessao || String(sessao.usuarioId) !== payload.sub) {
    return null;
  }

  const usuario = await Usuario.findByPk(sessao.usuarioId);

  if (!usuario) {
    await sessao.destroy();
    return null;
  }

  return { usuario, sessao };
}
