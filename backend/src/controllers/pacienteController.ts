import { Request, Response } from "express";
import { Op, UniqueConstraintError } from "sequelize";
import { Paciente } from "../models/Paciente";
import { validarPaciente } from "../validators/pessoaValidator";

function apresentarPaciente(paciente: Paciente) {
  return {
    id: paciente.id,
    nome: paciente.nome,
    cpf: paciente.cpf,
    dataNascimento: paciente.dataNascimento,
    telefone: paciente.telefone,
    email: paciente.email,
  };
}

function lerId(request: Request): number | null {
  const id = Number(request.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function listarPacientes(_request: Request, response: Response): Promise<void> {
  const pacientes = await Paciente.findAll({ order: [["nome", "ASC"]] });
  response.json({ pacientes: pacientes.map(apresentarPaciente) });
}

export async function buscarPaciente(request: Request, response: Response): Promise<void> {
  const id = lerId(request);

  if (!id) {
    response.status(400).json({ mensagem: "Identificador inválido." });
    return;
  }

  const paciente = await Paciente.findByPk(id);

  if (!paciente) {
    response.status(404).json({ mensagem: "Paciente não encontrado." });
    return;
  }

  response.json({ paciente: apresentarPaciente(paciente) });
}

export async function cadastrarPaciente(request: Request, response: Response): Promise<void> {
  const resultado = validarPaciente(request.body);

  if (!resultado.valido) {
    response.status(400).json({ mensagem: "Dados inválidos.", erros: resultado.erros });
    return;
  }

  const pacienteExistente = await Paciente.findOne({ where: { cpf: resultado.dados.cpf } });

  if (pacienteExistente) {
    response.status(409).json({
      mensagem: "Já existe um paciente com este CPF.",
      erros: { cpf: "CPF já cadastrado." },
    });
    return;
  }

  try {
    const paciente = await Paciente.create(resultado.dados);
    response.status(201).json({
      mensagem: "Paciente cadastrado com sucesso.",
      paciente: apresentarPaciente(paciente),
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      response.status(409).json({ mensagem: "CPF já cadastrado." });
      return;
    }

    throw error;
  }
}

export async function atualizarPaciente(request: Request, response: Response): Promise<void> {
  const id = lerId(request);

  if (!id) {
    response.status(400).json({ mensagem: "Identificador inválido." });
    return;
  }

  const resultado = validarPaciente(request.body);

  if (!resultado.valido) {
    response.status(400).json({ mensagem: "Dados inválidos.", erros: resultado.erros });
    return;
  }

  const paciente = await Paciente.findByPk(id);

  if (!paciente) {
    response.status(404).json({ mensagem: "Paciente não encontrado." });
    return;
  }

  const cpfEmUso = await Paciente.findOne({
    where: { cpf: resultado.dados.cpf, id: { [Op.ne]: id } },
  });

  if (cpfEmUso) {
    response.status(409).json({ mensagem: "CPF já cadastrado em outro paciente." });
    return;
  }

  paciente.set(resultado.dados);
  await paciente.save();

  response.json({
    mensagem: "Paciente atualizado com sucesso.",
    paciente: apresentarPaciente(paciente),
  });
}

export async function excluirPaciente(request: Request, response: Response): Promise<void> {
  const id = lerId(request);

  if (!id) {
    response.status(400).json({ mensagem: "Identificador inválido." });
    return;
  }

  const paciente = await Paciente.findByPk(id);

  if (!paciente) {
    response.status(404).json({ mensagem: "Paciente não encontrado." });
    return;
  }

  await paciente.destroy();
  response.status(204).send();
}
