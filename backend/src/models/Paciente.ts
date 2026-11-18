import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../database/sequelize";

export class Paciente extends Model<
  InferAttributes<Paciente>,
  InferCreationAttributes<Paciente>
> {
  declare id: CreationOptional<number>;
  declare nome: string;
  declare cpf: string;
  declare dataNascimento: string;
  declare telefone: string;
  declare email: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Paciente.init({
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
  dataNascimento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: "data_nascimento",
  },
  telefone: {
    type: DataTypes.STRING(11),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: true,
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
  tableName: "pacientes",
  modelName: "Paciente",
  timestamps: true,
  underscored: true,
});
