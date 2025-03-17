import { NextRequest, NextResponse } from "next/server";
import authJwt from "../_helpers/authMiddlewair";
import Result from "@/app/db.ts/models/resultsModel";
import { IUser } from "@/app/db.ts/models/types";
import Quiz from "@/app/db.ts/models/quizModel";
import ResultQuestion from "@/app/db.ts/models/resultQuestionsModel";
import Question from "@/app/db.ts/models/questionModel";
import Option from "@/app/db.ts/models/optionsModel";
import User from "@/app/db.ts/models/usersModel";

export async function GET(request: NextRequest) {
  const user = (await authJwt(request)) as IUser;

  const findedResult = await Result.findAll({
    include: [
      { model: User },
      {
        model: Quiz,
      },
      {
        model: ResultQuestion,
        include: [
          {
            model: Question,
            include: [{ model: Option }],
          },
        ],
      },
    ],
  });

  return NextResponse.json(
    user.role == "admin"
      ? findedResult
      : findedResult.filter((f) => f.userId == user.id),
    { status: 200 }
  );
}
