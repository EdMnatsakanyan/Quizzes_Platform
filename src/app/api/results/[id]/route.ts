import { NextRequest, NextResponse } from "next/server";
import authJwt from "../../_helpers/authMiddlewair";
import { IUser } from "@/app/db.ts/models/types";
import Result from "@/app/db.ts/models/resultsModel";
import { syncDatabase } from "@/app/db.ts/sequelize";
import Quiz from "@/app/db.ts/models/quizModel";
import ResultQuestion from "@/app/db.ts/models/resultQuestionsModel";
import Question from "@/app/db.ts/models/questionModel";
import Option from "@/app/db.ts/models/optionsModel";
import User from "@/app/db.ts/models/usersModel";

interface IProps {
  params: {
    id: number;
  };
}

export async function GET(request: NextRequest, { params }: IProps) {
  await syncDatabase();
  const { id } = await params;
  const user = (await authJwt(request)) as IUser;

  const finded = await Result.findByPk(id, {
    include: [
      {
        model: User,
      },
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
    return NextResponse.json({ message: "No such result" });
  }
  return NextResponse.json(finded, { status: 200 });
}
