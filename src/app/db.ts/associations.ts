import Option from "./models/optionsModel";
import Question from "./models/questionModel";
import Quiz from "./models/quizModel";
import ResultQuestion from "./models/resultQuestionsModel";
import Result from "./models/resultsModel";
import User from "./models/usersModel";

const associateTables = () => {
  User.hasMany(Quiz, { foreignKey: "userId" });
  Quiz.belongsTo(User, { foreignKey: "userId" });

  Quiz.hasMany(Question, { foreignKey: "quizId" });
  Question.belongsTo(Quiz, { foreignKey: "quizId" });

  Question.hasMany(Option, { foreignKey: "questionId" });
  Option.belongsTo(Question, { foreignKey: "questionId" });

  User.hasMany(Result, { foreignKey: "userId" });
  Result.belongsTo(User, { foreignKey: "userId" });

  Quiz.hasMany(Result, { foreignKey: "quizId" });
  Result.belongsTo(Quiz, { foreignKey: "quizId" });

  Result.hasMany(ResultQuestion, {
    foreignKey: "resultId",
  });
  ResultQuestion.belongsTo(Result, { foreignKey: "resultId" });
  Result.hasMany(ResultQuestion, {foreignKey: "resultId"})

  ResultQuestion.belongsTo(Question, { foreignKey: "questionId" });
  Question.hasMany(ResultQuestion, {foreignKey: "questionId"})

  ResultQuestion.belongsTo(Option, { foreignKey: "optionId" });
  Option.hasMany(ResultQuestion, {foreignKey: "optionId"})
};

export default associateTables;
