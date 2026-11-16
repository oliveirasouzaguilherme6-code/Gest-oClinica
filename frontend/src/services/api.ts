export type DadosCadastroApi = {
  nome: string;
  email: string;
  cpf: string;
  senha: string;
};

export type ErrosApi = Partial<Record<keyof DadosCadastroApi, string>>;

const CHAVE_TOKEN = "gestao_clinica_token";

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
    public readonly status?: number,
  ) {
    super(mensagem);
    this.name = "ApiError";
  }
}

async function requisitar(
  url: string,
  mensagemPadrao: string,
  { autenticado, ...opcoes }: RequestInit & { autenticado?: boolean } = {},
): Promise<Response> {
  const token = autenticado ? localStorage.getItem(CHAVE_TOKEN) : null;
  if (autenticado && !token) {
    throw new ApiError("Entre para acessar o sistema.", {}, 401);
  }

  const headers = new Headers(opcoes.headers);
  headers.set("Accept", "application/json");
  if (opcoes.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(url, { ...opcoes, headers });
  } catch {
    throw new ApiError("Não foi possível conectar com a API.");
  }

  if (!response.ok) {
    if (response.status === 401 && token && localStorage.getItem(CHAVE_TOKEN) === token) {
      localStorage.removeItem(CHAVE_TOKEN);
    }
    const body = await response.json().catch(() => null) as RespostaApi | null;
    throw new ApiError(body?.mensagem ?? mensagemPadrao, body?.erros, response.status);
  }
  return response;
}

export async function cadastrarUsuario(dados: DadosCadastroApi): Promise<void> {
  await requisitar("/api/usuarios", "Não foi possível realizar o cadastro.", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export async function loginUsuario(email: string, senha: string): Promise<void> {
  const response = await requisitar("/api/auth/login", "Não foi possível realizar o login.", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });

  const body = await response.json().catch(() => null) as { token?: unknown } | null;
  if (typeof body?.token !== "string" || !body.token) {
    throw new ApiError("A API não retornou o token de acesso.");
  }
  localStorage.setItem(CHAVE_TOKEN, body.token);
}

export async function obterSessao(): Promise<SessaoAtual> {
  const response = await requisitar("/api/auth/me", "Não foi possível abrir o sistema.", {
    autenticado: true,
  });
  return response.json();
}

export async function obterEstatisticasCadastros(): Promise<EstatisticasCadastros> {
  const response = await requisitar("/api/estatisticas/cadastros", "Não foi possível carregar os dados.", {
    autenticado: true,
  });
  return response.json();
}

export async function encerrarSessao(): Promise<void> {
  const token = localStorage.getItem(CHAVE_TOKEN);
  try {
    await requisitar("/api/auth/logout", "Não foi possível encerrar a sessão. Tente novamente.", {
      method: "POST",
      autenticado: true,
    });
  } catch (error) {
    if (!(error instanceof ApiError && error.status === 401)) {
      throw error;
    }
  }
  if (localStorage.getItem(CHAVE_TOKEN) === token) {
    localStorage.removeItem(CHAVE_TOKEN);
  }
  window.location.replace("/login");
}
