import Option from "./models/optionsModel";
import Question from "./models/questionModel";
import Quiz from "./models/quizModel";
import ResultQuestion from "./models/resultQuestionsModel";
import Result from "./models/resultsModel";
import User from "./models/usersModel";
import { sequelize } from "./sequelize";

const initTables = () => {
  User.initTable(sequelize);
  Quiz.initTable(sequelize);
  Question.initTable(sequelize);
  Option.initTable(sequelize);
  Result.initTable(sequelize);
  ResultQuestion.initTable(sequelize);
};

export default initTables;
