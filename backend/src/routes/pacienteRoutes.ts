import { Router } from "express";
import {
  atualizarPaciente,
  buscarPaciente,
  cadastrarPaciente,
  excluirPaciente,
  listarPacientes,
} from "../controllers/pacienteController";
import { exigirAutenticacao } from "../middleware/autenticacao";

export const pacienteRouter = Router();

pacienteRouter.use(exigirAutenticacao);
pacienteRouter.get("/", listarPacientes);
pacienteRouter.get("/:id", buscarPaciente);
pacienteRouter.post("/", cadastrarPaciente);
pacienteRouter.put("/:id", atualizarPaciente);
pacienteRouter.delete("/:id", excluirPaciente);
