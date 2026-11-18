import { ApiError } from "./api";

export type Paciente = {
  id: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  email: string | null;
};

export type DadosPaciente = Omit<Paciente, "id" | "email"> & {
  email: string;
};

export type Profissional = {
  id: number;
  nome: string;
  cpf: string;
  registroProfissional: string;
  especialidade: string;
  telefone: string;
  email: string;
  ativo: boolean;
};

export type DadosProfissional = Omit<Profissional, "id">;

type RespostaErro = {
  mensagem?: string;
  erros?: Record<string, string>;
};

async function requisicao<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, {
      ...init,
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError("Não foi possível conectar com a API.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const body = await response.json().catch(() => ({})) as T & RespostaErro;

  if (!response.ok) {
    const primeiroErro = body.erros ? Object.values(body.erros)[0] : undefined;
    throw new ApiError(primeiroErro ?? body.mensagem ?? "Não foi possível concluir a operação.");
  }

  return body;
}

export async function listarPacientes(): Promise<Paciente[]> {
  const resposta = await requisicao<{ pacientes: Paciente[] }>("/api/pacientes");
  return resposta.pacientes;
}

export async function salvarPaciente(dados: DadosPaciente, id?: number): Promise<void> {
  await requisicao(id ? `/api/pacientes/${id}` : "/api/pacientes", {
    method: id ? "PUT" : "POST",
    body: JSON.stringify(dados),
  });
}

export function excluirPaciente(id: number): Promise<void> {
  return requisicao<void>(`/api/pacientes/${id}`, { method: "DELETE" });
}

export async function listarProfissionais(): Promise<Profissional[]> {
  const resposta = await requisicao<{ profissionais: Profissional[] }>("/api/profissionais");
  return resposta.profissionais;
}

export async function salvarProfissional(
  dados: DadosProfissional,
  id?: number,
): Promise<void> {
  await requisicao(id ? `/api/profissionais/${id}` : "/api/profissionais", {
    method: id ? "PUT" : "POST",
    body: JSON.stringify(dados),
  });
}

export function excluirProfissional(id: number): Promise<void> {
  return requisicao<void>(`/api/profissionais/${id}`, { method: "DELETE" });
}
