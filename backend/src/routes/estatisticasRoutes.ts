import { Router } from "express";
import { consultarCadastros } from "../controllers/estatisticasController";
import { exigirAutenticacao } from "../middleware/autenticacao";

export const estatisticasRouter = Router();

estatisticasRouter.get("/cadastros", exigirAutenticacao, consultarCadastros);
