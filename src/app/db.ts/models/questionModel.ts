import { DataTypes, Model } from "sequelize";
import { IOption, IQuestion } from "./types";

class Question extends Model implements IQuestion {
  id!: number;
  content!: string;
  quizId!: number;
  multiple_correct!: boolean;
  Options!: IOption[];
  static initTable(sequelize: any) {
    Question.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: true,
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
        multiple_correct: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
      },
      {
        sequelize,
        tableName: "questions",
        modelName: "Question",
      }
    );
  }
}

export default Question;
