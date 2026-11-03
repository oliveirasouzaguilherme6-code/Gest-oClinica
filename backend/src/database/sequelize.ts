import { Sequelize } from "sequelize";

function readPort(value: string | undefined, fallback: number): number {
  const port = Number(value ?? fallback);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("A porta do banco de dados é inválida.");
  }

  return port;
}

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST ?? "127.0.0.1",
  port: readPort(process.env.DB_PORT, 3306),
  database: process.env.DB_NAME ?? "gestao_clinica",
  username: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  logging: false,
});

export async function connectToDatabase(): Promise<void> {
  await sequelize.authenticate();
  await sequelize.sync();
  console.log("Banco de dados conectado.");
}

