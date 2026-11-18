import { Cpf } from "../domain/Cpf";

type Erros = Record<string, string>;

type ResultadoValidacao<T> =
  | { valido: true; dados: T }
  | { valido: false; erros: Erros };

export type DadosPaciente = {
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  email: string | null;
};

export type DadosProfissional = {
  nome: string;
  cpf: string;
  registroProfissional: string;
  especialidade: string;
  telefone: string;
  email: string;
  ativo: boolean;
};

function lerTexto(entrada: Record<string, unknown>, campo: string): string {
  return typeof entrada[campo] === "string" ? entrada[campo].trim() : "";
}

function validarNome(nome: string, erros: Erros): void {
  if (nome.length < 2 || nome.length > 100) {
    erros.nome = "Informe um nome entre 2 e 100 caracteres.";
  }
}

function validarCpf(cpfInformado: string, erros: Erros): string {
  try {
    return new Cpf(cpfInformado).valor;
  } catch {
    erros.cpf = "Informe um CPF válido.";
    return cpfInformado.replace(/\D/g, "");
  }
}

function validarTelefone(telefoneInformado: string, erros: Erros): string {
  const telefone = telefoneInformado.replace(/\D/g, "");

  if (telefone.length < 10 || telefone.length > 11) {
    erros.telefone = "Informe um telefone com DDD.";
  }

  return telefone;
}

function emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 150;
}

function dataValida(data: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return false;
  }

  const [ano, mes, dia] = data.split("-").map(Number);
  const dataCriada = new Date(Date.UTC(ano ?? 0, (mes ?? 0) - 1, dia));

  return dataCriada.getUTCFullYear() === ano
    && dataCriada.getUTCMonth() === (mes ?? 0) - 1
    && dataCriada.getUTCDate() === dia;
}

export function validarPaciente(body: unknown): ResultadoValidacao<DadosPaciente> {
  const entrada = body && typeof body === "object"
    ? body as Record<string, unknown>
    : {};
  const erros: Erros = {};
  const nome = lerTexto(entrada, "nome");
  const cpf = validarCpf(lerTexto(entrada, "cpf"), erros);
  const dataNascimento = lerTexto(entrada, "dataNascimento");
  const telefone = validarTelefone(lerTexto(entrada, "telefone"), erros);
  const emailInformado = lerTexto(entrada, "email").toLowerCase();
  const email = emailInformado || null;

  validarNome(nome, erros);

  if (!dataValida(dataNascimento)) {
    erros.dataNascimento = "Informe uma data de nascimento válida.";
  } else if (dataNascimento > new Date().toISOString().slice(0, 10)) {
    erros.dataNascimento = "A data de nascimento não pode estar no futuro.";
  }

  if (email && !emailValido(email)) {
    erros.email = "Informe um e-mail válido.";
  }

  if (Object.keys(erros).length > 0) {
    return { valido: false, erros };
  }

  return {
    valido: true,
    dados: { nome, cpf, dataNascimento, telefone, email },
  };
}

export function validarProfissional(body: unknown): ResultadoValidacao<DadosProfissional> {
  const entrada = body && typeof body === "object"
    ? body as Record<string, unknown>
    : {};
  const erros: Erros = {};
  const nome = lerTexto(entrada, "nome");
  const cpf = validarCpf(lerTexto(entrada, "cpf"), erros);
  const registroProfissional = lerTexto(entrada, "registroProfissional").toUpperCase();
  const especialidade = lerTexto(entrada, "especialidade");
  const telefone = validarTelefone(lerTexto(entrada, "telefone"), erros);
  const email = lerTexto(entrada, "email").toLowerCase();
  const ativo = typeof entrada.ativo === "boolean" ? entrada.ativo : true;

  validarNome(nome, erros);

  if (registroProfissional.length < 3 || registroProfissional.length > 30) {
    erros.registroProfissional = "Informe o registro profissional.";
  }

  if (especialidade.length < 2 || especialidade.length > 100) {
    erros.especialidade = "Informe a especialidade.";
  }

  if (!emailValido(email)) {
    erros.email = "Informe um e-mail válido.";
  }

  if (Object.keys(erros).length > 0) {
    return { valido: false, erros };
  }

  return {
    valido: true,
    dados: {
      nome,
      cpf,
      registroProfissional,
      especialidade,
      telefone,
      email,
      ativo,
    },
  };
}
