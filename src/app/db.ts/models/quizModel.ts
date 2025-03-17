import { DataTypes, Model, Sequelize } from "sequelize";
import { IQuestion, IQuiz } from "./types";

class Quiz extends Model implements IQuiz {
  id!: number;
  userId!: number;
  name!: string;
  difficulty!: "easy" | "medium" | "hard";
  quiz_img!: string;
  isPrivate!: boolean;
  createdAt!: string;
  updatedAt!: string;
  Questions!: IQuestion[];
  
  static initTable(sequelize: Sequelize) {
    Quiz.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        difficulty: {
          type: DataTypes.ENUM("easy", "medium", "hard"),
          allowNull: false,
        },
        isPrivate: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        quiz_img: {
          type: DataTypes.STRING,
          allowNull: true
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
      },
      {
        sequelize,
        tableName: "quizzes",
        modelName: "Quiz",
      }
    );
  }
}

export default Quiz;
