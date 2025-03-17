import { DataTypes, Model } from "sequelize";
import { IQuiz, IResult, IResultQuestion, IUser } from "./types";

class Result extends Model implements IResult {
  id!: number;
  userId!: number;
  quizId!: number;
  correctSum!: number;
  ResultQuestions!: IResultQuestion[]
  Quiz!: IQuiz;
  User!: IUser;
  static initTable(sequelize: any) {
    Result.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        correctSum: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        quizId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "quizzes",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
      {
        sequelize,
        tableName: "results",
        modelName: "Result",
      }
    );
  }
}

export default Result;
