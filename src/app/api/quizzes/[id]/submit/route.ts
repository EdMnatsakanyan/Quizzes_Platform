import authJwt from "@/app/api/_helpers/authMiddlewair";
import Option from "@/app/db.ts/models/optionsModel";
import Question from "@/app/db.ts/models/questionModel";
import Quiz from "@/app/db.ts/models/quizModel";
import ResultQuestion from "@/app/db.ts/models/resultQuestionsModel";
import { IQuiz, IUser } from "@/app/db.ts/models/types";
import { sequelize, syncDatabase } from "@/app/db.ts/sequelize";
import Result from "@/app/db.ts/models/resultsModel";
import { NextRequest, NextResponse } from "next/server";

interface IProps {
  params: {
    id: string;
  };
}

interface ISubmit {
  questionId: number;
  optionId: number;
}

export async function POST(request: NextRequest, { params }: IProps) {
  await syncDatabase();
  const { id } = await params;
  const user = (await authJwt(request)) as IUser;
  const submits = (await request.json()).submits as ISubmit[];

  const quiz = await Quiz.findByPk(id, {
    include: {
      model: Question,
      attributes: ["id"],
      include: [
        {
          model: Option,
          where: {
            isTrue: true,
          },
        },
      ],
    },
  });

  if (submits.length !== quiz?.Questions.length) {
    return NextResponse.json(
      { message: "Wrong submits count" },
      { status: 400 }
    );
  }

  const trueSubmitArray: ISubmit[] = [];
  for (let i = 0; i < quiz!.Questions.length; ++i) {
    const obj = {
      questionId: quiz!.Questions[i].id,
      optionId: quiz!.Questions[i].Options[0].id,
    };
    trueSubmitArray.push(obj);
  }

  let trueCount = 0;
  submits.forEach((submit) => {
    const finded = trueSubmitArray.find(
      (elm) => elm.questionId === submit.questionId
    );
    if (finded?.optionId == submit.optionId) {
      trueCount++;
    }
  });

  const t = await sequelize.transaction();

  try {
    const result = await Result.create({
      userId: user.id,
      quizId: id,
      correctSum: trueCount,
    });
    const arrOfQueries = [];
    for (let i = 0; i < submits.length; ++i) {
      arrOfQueries.push(
        ResultQuestion.create({
          resultId: result.id,
          questionId: submits[i].questionId,
          optionId: submits[i].optionId,
          isTrue: false,
        })
      );
    }

    await Promise.all(arrOfQueries);

    const resultWithOptions = await Result.findByPk(result.id, {
      include: [
        {
          model: Quiz
        },
        {
          model: ResultQuestion,
          include: [{
            model: Question,
            include: [{model: Option}]
          }]
        },
      ],
    });

    t.commit();
    return NextResponse.json({ result: resultWithOptions }, { status: 201 });
  } catch (err) {
    console.log(err);
    t.rollback();
    return NextResponse.json({}, { status: 500 });
  }
}
