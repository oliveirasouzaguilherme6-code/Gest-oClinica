import { Router } from "express";
import { consultarSessao, login, logout } from "../controllers/authController";
import { exigirAutenticacao } from "../middleware/autenticacao";

export const authRouter = Router();

authRouter.post("/login", login);
authRouter.get("/me", exigirAutenticacao, consultarSessao);
authRouter.post("/logout", exigirAutenticacao, logout);
