import { NextFunction, Request, Response } from "express";
import { obterAutenticacao } from "../services/sessaoService";

export async function exigirAutenticacao(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const autenticacao = await obterAutenticacao(request);

    if (!autenticacao) {
      response.status(401).json({ mensagem: "Sua sessão expirou. Entre novamente." });
      return;
    }

    response.locals.autenticacao = autenticacao;
    next();
  } catch (error) {
    next(error);
  }
}
