import { Router } from "express";
import {
  atualizarProfissional,
  buscarProfissional,
  cadastrarProfissional,
  excluirProfissional,
  listarProfissionais,
} from "../controllers/profissionalController";
import { exigirAutenticacao } from "../middleware/autenticacao";

export const profissionalRouter = Router();

profissionalRouter.use(exigirAutenticacao);
profissionalRouter.get("/", listarProfissionais);
profissionalRouter.get("/:id", buscarProfissional);
profissionalRouter.post("/", cadastrarProfissional);
profissionalRouter.put("/:id", atualizarProfissional);
profissionalRouter.delete("/:id", excluirProfissional);
