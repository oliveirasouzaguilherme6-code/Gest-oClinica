import { Request, Response } from "express";
import { Op, UniqueConstraintError } from "sequelize";
import { Profissional } from "../models/Profissional";
import { validarProfissional } from "../validators/pessoaValidator";

function apresentarProfissional(profissional: Profissional) {
  return {
    id: profissional.id,
    nome: profissional.nome,
    cpf: profissional.cpf,
    registroProfissional: profissional.registroProfissional,
    especialidade: profissional.especialidade,
    telefone: profissional.telefone,
    email: profissional.email,
    ativo: profissional.ativo,
  };
}

function lerId(request: Request): number | null {
  const id = Number(request.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function listarProfissionais(_request: Request, response: Response): Promise<void> {
  const profissionais = await Profissional.findAll({ order: [["nome", "ASC"]] });
  response.json({ profissionais: profissionais.map(apresentarProfissional) });
}

export async function buscarProfissional(request: Request, response: Response): Promise<void> {
  const id = lerId(request);

  if (!id) {
    response.status(400).json({ mensagem: "Identificador inválido." });
    return;
  }

  const profissional = await Profissional.findByPk(id);

  if (!profissional) {
    response.status(404).json({ mensagem: "Profissional não encontrado." });
    return;
  }

  response.json({ profissional: apresentarProfissional(profissional) });
}

export async function cadastrarProfissional(request: Request, response: Response): Promise<void> {
  const resultado = validarProfissional(request.body);

  if (!resultado.valido) {
    response.status(400).json({ mensagem: "Dados inválidos.", erros: resultado.erros });
    return;
  }

  const [cpfEmUso, registroEmUso] = await Promise.all([
    Profissional.findOne({ where: { cpf: resultado.dados.cpf } }),
    Profissional.findOne({ where: { registroProfissional: resultado.dados.registroProfissional } }),
  ]);

  if (cpfEmUso || registroEmUso) {
    response.status(409).json({
      mensagem: cpfEmUso
        ? "Já existe um profissional com este CPF."
        : "Este registro profissional já está cadastrado.",
    });
    return;
  }

  try {
    const profissional = await Profissional.create(resultado.dados);
    response.status(201).json({
      mensagem: "Profissional cadastrado com sucesso.",
      profissional: apresentarProfissional(profissional),
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      response.status(409).json({ mensagem: "CPF ou registro profissional já cadastrado." });
      return;
    }

    throw error;
  }
}

export async function atualizarProfissional(request: Request, response: Response): Promise<void> {
  const id = lerId(request);

  if (!id) {
    response.status(400).json({ mensagem: "Identificador inválido." });
    return;
  }

  const resultado = validarProfissional(request.body);

  if (!resultado.valido) {
    response.status(400).json({ mensagem: "Dados inválidos.", erros: resultado.erros });
    return;
  }

  const profissional = await Profissional.findByPk(id);

  if (!profissional) {
    response.status(404).json({ mensagem: "Profissional não encontrado." });
    return;
  }

  const [cpfEmUso, registroEmUso] = await Promise.all([
    Profissional.findOne({ where: { cpf: resultado.dados.cpf, id: { [Op.ne]: id } } }),
    Profissional.findOne({
      where: { registroProfissional: resultado.dados.registroProfissional, id: { [Op.ne]: id } },
    }),
  ]);

  if (cpfEmUso || registroEmUso) {
    response.status(409).json({ mensagem: "CPF ou registro profissional já utilizado." });
    return;
  }

  profissional.set(resultado.dados);
  await profissional.save();

  response.json({
    mensagem: "Profissional atualizado com sucesso.",
    profissional: apresentarProfissional(profissional),
  });
}

export async function excluirProfissional(request: Request, response: Response): Promise<void> {
  const id = lerId(request);

  if (!id) {
    response.status(400).json({ mensagem: "Identificador inválido." });
    return;
  }

  const profissional = await Profissional.findByPk(id);

  if (!profissional) {
    response.status(404).json({ mensagem: "Profissional não encontrado." });
    return;
  }

  await profissional.destroy();
  response.status(204).send();
}
