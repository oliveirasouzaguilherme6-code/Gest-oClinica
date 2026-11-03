import { Request, Response } from "express";
import { UniqueConstraintError } from "sequelize";
import { Usuario } from "../models/Usuario";
import { criarSenhaHash } from "../services/senhaService";
import { ErrosCadastro, validarCadastro } from "../validators/usuarioValidator";

export async function cadastrarUsuario(request: Request, response: Response): Promise<void> {
  const resultado = validarCadastro(request.body);

  if (!resultado.valido) {
    response.status(400).json({
      mensagem: "Dados inválidos.",
      erros: resultado.erros,
    });
    return;
  }

  const { nome, email, cpf, senha } = resultado.dados;

  try {
    const [usuarioComEmail, usuarioComCpf] = await Promise.all([
      Usuario.findOne({ where: { email } }),
      Usuario.findOne({ where: { cpf } }),
    ]);
    const erros: ErrosCadastro = {};

    if (usuarioComEmail) {
      erros.email = "Este e-mail já está cadastrado.";
    }

    if (usuarioComCpf) {
      erros.cpf = "Este CPF já está cadastrado.";
    }

    if (Object.keys(erros).length > 0) {
      response.status(409).json({
        mensagem: "Usuário já cadastrado.",
        erros,
      });
      return;
    }

    const senhaHash = await criarSenhaHash(senha);
    const usuario = await Usuario.create({ nome, email, cpf, senhaHash });

    response.status(201).json({
      mensagem: "Usuário cadastrado com sucesso.",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      response.status(409).json({
        mensagem: "E-mail ou CPF já cadastrado.",
      });
      return;
    }

    console.error("Erro ao cadastrar usuário:", error);
    response.status(500).json({
      mensagem: "Erro interno do servidor.",
    });
  }
}


