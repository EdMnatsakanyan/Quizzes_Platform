import { DataTypes, Model } from "sequelize";
import { IQuestion, IResultQuestion } from "./types";

class ResultQuestion extends Model implements IResultQuestion {
  id!: number;
  resultId!: number;
  questionId!: number;
  optionId!: number;
  isTrue!: boolean;
  Question!: IQuestion;
  static initTable(sequelize: any) {
    ResultQuestion.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        resultId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "results",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
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
        optionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "options",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        isTrue: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "resultQuestions",
        modelName: "ResultQuestion",
      }
    );
  }
}

export default ResultQuestion;
