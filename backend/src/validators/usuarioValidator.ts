import { Cpf } from "../domain/Cpf";

export type CampoCadastro = "nome" | "email" | "cpf" | "senha";
export type ErrosCadastro = Partial<Record<CampoCadastro, string>>;

export type DadosCadastro = {
  nome: string;
  email: string;
  cpf: string;
  senha: string;
};

type ResultadoValidacao =
  | { valido: true; dados: DadosCadastro }
  | { valido: false; erros: ErrosCadastro };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHA_FORTE_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export function validarCadastro(body: unknown): ResultadoValidacao {
  if (!body || typeof body !== "object") {
    return {
      valido: false,
      erros: {
        nome: "Informe os dados do cadastro.",
      },
    };
  }

  const entrada = body as Record<string, unknown>;
  const nome = typeof entrada.nome === "string" ? entrada.nome.trim() : "";
  const email = typeof entrada.email === "string" ? entrada.email.trim().toLowerCase() : "";
  const senha = typeof entrada.senha === "string" ? entrada.senha : "";
  const cpfRecebido = typeof entrada.cpf === "string" ? entrada.cpf : "";
  const erros: ErrosCadastro = {};

  if (nome.length < 2 || nome.length > 100) {
    erros.nome = "O nome deve ter entre 2 e 100 caracteres.";
  }

  if (!EMAIL_REGEX.test(email) || email.length > 150) {
    erros.email = "Informe um e-mail válido.";
  }

  let cpf = "";

  try {
    cpf = new Cpf(cpfRecebido).valor;
  } catch {
    erros.cpf = "Informe um CPF válido.";
  }

  if (!SENHA_FORTE_REGEX.test(senha)) {
    erros.senha = "Use 8 caracteres com maiúscula, minúscula, número e símbolo.";
  }

  if (Object.keys(erros).length > 0) {
    return { valido: false, erros };
  }

  return {
    valido: true,
    dados: { nome, email, cpf, senha },
  };
}

