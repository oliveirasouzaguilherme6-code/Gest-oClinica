import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../database/sequelize";
import { Usuario } from "./Usuario";

export class Sessao extends Model<
  InferAttributes<Sessao>,
  InferCreationAttributes<Sessao>
> {
  declare id: CreationOptional<number>;
  declare tokenHash: string;
  declare usuarioId: number;
  declare expiraEm: Date;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Sessao.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tokenHash: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
    field: "token_hash",
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "usuario_id",
    references: {
      model: Usuario,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  expiraEm: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "expira_em",
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "created_at",
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "updated_at",
  },
}, {
  sequelize,
  tableName: "sessoes",
  modelName: "Sessao",
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ["usuario_id"] },
    { fields: ["expira_em"] },
  ],
});

Usuario.hasMany(Sessao, { foreignKey: "usuarioId", as: "sessoes" });
Sessao.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });
