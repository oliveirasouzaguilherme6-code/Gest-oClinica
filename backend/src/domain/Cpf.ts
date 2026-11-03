export class Cpf {
  #valor: string;

  constructor(valor: string) {
    const cpfNormalizado = valor.replace(/\D/g, "");

    if (!Cpf.ehValido(cpfNormalizado)) {
      throw new Error("CPF inválido.");
    }

    this.#valor = cpfNormalizado;
  }

  get valor(): string {
    return this.#valor;
  }

  static ehValido(cpf: string): boolean {
    const somenteNumeros = cpf.replace(/\D/g, "");

    if (somenteNumeros.length !== 11 || /^(\d)\1{10}$/.test(somenteNumeros)) {
      return false;
    }

    const primeiroDigito = Cpf.calcularDigito(somenteNumeros.slice(0, 9), 10);
    const segundoDigito = Cpf.calcularDigito(somenteNumeros.slice(0, 10), 11);

    return primeiroDigito === Number(somenteNumeros[9])
      && segundoDigito === Number(somenteNumeros[10]);
  }

  private static calcularDigito(base: string, pesoInicial: number): number {
    const soma = [...base].reduce(
      (total, numero, indice) => total + Number(numero) * (pesoInicial - indice),
      0,
    );
    const resto = (soma * 10) % 11;

    return resto === 10 ? 0 : resto;
  }
}

