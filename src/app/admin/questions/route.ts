import Option from "@/app/db.ts/models/optionsModel";
import Question from "@/app/db.ts/models/questionModel";
import { syncDatabase } from "@/app/db.ts/sequelize";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await syncDatabase()
  let { quizId, content, multiple_correct } = await request.json();
  quizId = +quizId
  if (!quizId) {
    return NextResponse.json({ message: "wrong data format" }, { status: 400 });
  }

  if (isNaN(quizId) || Math.floor(quizId) !== +quizId) {
    return NextResponse.json(
      { message: "quizId must be integer" },
      { status: 400 }
    );
  }

  try {
    const question = await Question.create({
      quizId,
      content: content || "",
    });
    const withOptions = await Question.findByPk(question.dataValues.id, {
        include: [
            {
                model: Option
            }
        ]
    })
    return NextResponse.json(withOptions!.dataValues, {status: 201})
  } catch (err) {
    console.log(err)
    return NextResponse.json({}, {status: 500})
  }
}
