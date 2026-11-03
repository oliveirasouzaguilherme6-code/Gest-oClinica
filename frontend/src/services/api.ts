export type DadosCadastroApi = {
  nome: string;
  email: string;
  cpf: string;
  senha: string;
};

export type ErrosApi = Partial<Record<keyof DadosCadastroApi, string>>;

type RespostaApi = {
  mensagem?: string;
  erros?: ErrosApi;
};

export type UsuarioSessao = {
  id: number;
  nome: string;
  email: string;
};

export type SessaoAtual = {
  usuario: UsuarioSessao;
};

export type EstatisticasCadastros = {
  totalUsuarios: number;
  cadastrosPorDia: Array<{
    data: string;
    quantidade: number;
  }>;
  atualizadoEm: string;
};

export class ApiError extends Error {
  constructor(
    mensagem: string,
    public readonly erros: ErrosApi = {},
  ) {
    super(mensagem);
    this.name = "ApiError";
  }
}

export async function cadastrarUsuario(dados: DadosCadastroApi): Promise<void> {
  let response: Response;

  try {
    response = await fetch("/api/usuarios", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });
  } catch {
    throw new ApiError("Não foi possível conectar com a API.");
  }

  const body = await response.json().catch(() => ({})) as RespostaApi;

  if (!response.ok) {
    throw new ApiError(body.mensagem ?? "Não foi possível realizar o cadastro.", body.erros);
  }
}

export async function loginUsuario(email: string, senha: string): Promise<void> {
  let response: Response;

  try {
    response = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    });
  } catch {
    throw new ApiError("Não foi possível conectar com a API.");
  }

  const body = await response.json().catch(() => ({})) as RespostaApi;

  if (!response.ok) {
    throw new ApiError(body.mensagem ?? "Não foi possível realizar o login.");
  }
}

async function obterJson<T>(url: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new ApiError("Não foi possível conectar com a API.");
  }

  const body = await response.json().catch(() => ({})) as T & { mensagem?: string };

  if (!response.ok) {
    throw new ApiError(body.mensagem ?? "Não foi possível carregar os dados.");
  }

  return body;
}

export function obterSessao(): Promise<SessaoAtual> {
  return obterJson<SessaoAtual>("/api/auth/me");
}

export function obterEstatisticasCadastros(): Promise<EstatisticasCadastros> {
  return obterJson<EstatisticasCadastros>("/api/estatisticas/cadastros");
}

export async function encerrarSessao(): Promise<void> {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } finally {
    window.location.assign("/login");
  }
}

