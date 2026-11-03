export type FormularioCadastro = {
  nome: string;
  email: string;
  cpf: string;
  senha: string;
  confirmacaoSenha: string;
};

export type ErrosFormulario = Partial<Record<keyof FormularioCadastro, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHA_FORTE_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export function somenteNumeros(valor: string): string {
  return valor.replace(/\D/g, "");
}

export function validarFormulario(dados: FormularioCadastro): ErrosFormulario {
  const erros: ErrosFormulario = {};

  if (dados.nome.trim().length < 2) {
    erros.nome = "Informe seu nome completo.";
  }

  if (!EMAIL_REGEX.test(dados.email.trim())) {
    erros.email = "Informe um e-mail válido.";
  }

  if (!cpfEhValido(dados.cpf)) {
    erros.cpf = "Informe um CPF válido.";
  }

  if (!SENHA_FORTE_REGEX.test(dados.senha)) {
    erros.senha = "Use 8 caracteres com maiúscula, minúscula, número e símbolo.";
  }

  if (dados.confirmacaoSenha !== dados.senha) {
    erros.confirmacaoSenha = "As senhas não são iguais.";
  }

  return erros;
}

function cpfEhValido(cpf: string): boolean {
  const numeros = somenteNumeros(cpf);

  if (numeros.length !== 11 || /^(\d)\1{10}$/.test(numeros)) {
    return false;
  }

  const primeiroDigito = calcularDigito(numeros.slice(0, 9), 10);
  const segundoDigito = calcularDigito(numeros.slice(0, 10), 11);

  return primeiroDigito === Number(numeros[9])
    && segundoDigito === Number(numeros[10]);
}

function calcularDigito(base: string, pesoInicial: number): number {
  const soma = [...base].reduce(
    (total, numero, indice) => total + Number(numero) * (pesoInicial - indice),
    0,
  );
  const resto = (soma * 10) % 11;

  return resto === 10 ? 0 : resto;
}

