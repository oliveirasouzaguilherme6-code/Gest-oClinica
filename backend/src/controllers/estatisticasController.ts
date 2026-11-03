import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import { sequelize } from "../database/sequelize";
import { Usuario } from "../models/Usuario";

type CadastroPorDiaBanco = {
  data: string;
  quantidade: number | string;
};

export async function consultarCadastros(
  _request: Request,
  response: Response,
): Promise<void> {
  const [totalUsuarios, cadastrosBanco] = await Promise.all([
    Usuario.count(),
    sequelize.query<CadastroPorDiaBanco>(`
      SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS data, COUNT(*) AS quantidade
      FROM usuarios
      GROUP BY DATE(created_at)
      ORDER BY data ASC
    `, { type: QueryTypes.SELECT }),
  ]);

  response.setHeader("Cache-Control", "no-store");
  response.json({
    totalUsuarios,
    cadastrosPorDia: cadastrosBanco.map((item) => ({
      data: item.data,
      quantidade: Number(item.quantidade),
    })),
    atualizadoEm: new Date().toISOString(),
  });
}
