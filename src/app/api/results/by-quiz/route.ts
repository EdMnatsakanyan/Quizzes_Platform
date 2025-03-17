import { syncDatabase } from "@/app/db.ts/sequelize";
import { NextRequest, NextResponse } from "next/server";
import authJwt from "../../_helpers/authMiddlewair";
import Result from "@/app/db.ts/models/resultsModel";
import { IUser } from "@/app/db.ts/models/types";
import Quiz from "@/app/db.ts/models/quizModel";
import ResultQuestion from "@/app/db.ts/models/resultQuestionsModel";
import Question from "@/app/db.ts/models/questionModel";
import Option from "@/app/db.ts/models/optionsModel";

export async function POST(request: NextRequest) {
  await syncDatabase();

  const { id } = await request.json();
  const user = (await authJwt(request)) as IUser;

  const finded = await Result.findOne({
    where: { userId: user.id, quizId: id },
    include: [
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

  if (!finded) {
    return NextResponse.json({ message: "No such result" }, {status: 400});
  }
  return NextResponse.json(finded, { status: 200 });
}
