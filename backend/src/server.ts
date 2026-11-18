
import express, { NextFunction, Request, Response } from "express";
import { connectToDatabase } from "./database/sequelize";
import { authRouter } from "./routes/authRoutes";
import { estatisticasRouter } from "./routes/estatisticasRoutes";
import { pacienteRouter } from "./routes/pacienteRoutes";
import { profissionalRouter } from "./routes/profissionalRoutes";
import { usuarioRouter } from "./routes/usuarioRoutes";
import { obterSegredoJwt } from "./services/sessaoService";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));
app.use("/api/usuarios", usuarioRouter);
app.use("/api/auth", authRouter);
app.use("/api/estatisticas", estatisticasRouter);
app.use("/api/pacientes", pacienteRouter);
app.use("/api/profissionais", profissionalRouter);

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use((_request, response) => {
  response.status(404).json({ mensagem: "Rota não encontrada." });
});

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof SyntaxError) {
    response.status(400).json({ mensagem: "JSON inválido." });
    return;
  }

  console.error("Erro não tratado:", error);
  response.status(500).json({ mensagem: "Erro interno do servidor." });
});

async function startServer(): Promise<void> {
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("A porta da aplicação é inválida.");
  }

  obterSegredoJwt();
  await connectToDatabase();

  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}

startServer().catch((error: unknown) => {
  console.error("Não foi possível iniciar a aplicação:", error);
  process.exitCode = 1;
});
