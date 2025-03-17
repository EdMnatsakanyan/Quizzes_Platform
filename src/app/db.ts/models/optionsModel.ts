import { DataTypes, Model } from "sequelize";
import { IOption, IQuestion } from "./types";

class Option extends Model implements IOption {
  id!: number;
  content!: string;
  questionId!: number;
  isTrue!: boolean;
  static initTable(sequelize: any) {
    Option.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        isTrue: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        questionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "questions",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
      {
        sequelize,
        tableName: "options",
        modelName: "Option",
      }
    );
  }
}

export default Option;
