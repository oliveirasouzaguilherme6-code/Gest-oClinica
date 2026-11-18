import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../database/sequelize";

export class Profissional extends Model<
  InferAttributes<Profissional>,
  InferCreationAttributes<Profissional>
> {
  declare id: CreationOptional<number>;
  declare nome: string;
  declare cpf: string;
  declare registroProfissional: string;
  declare especialidade: string;
  declare telefone: string;
  declare email: string;
  declare ativo: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Profissional.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING(11),
    allowNull: false,
    unique: true,
  },
  registroProfissional: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
    field: "registro_profissional",
  },
  especialidade: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  telefone: {
    type: DataTypes.STRING(11),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
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
  tableName: "profissionais",
  modelName: "Profissional",
  timestamps: true,
  underscored: true,
});
