import { Router } from "express";
import { cadastrarUsuario } from "../controllers/usuarioController";

export const usuarioRouter = Router();

usuarioRouter.post("/", cadastrarUsuario);

