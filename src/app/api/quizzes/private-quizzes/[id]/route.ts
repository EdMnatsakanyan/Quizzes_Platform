import authJwt from "@/app/api/_helpers/authMiddlewair";
import { roleCheck } from "@/app/api/_helpers/roleMiddlewair";
import Option from "@/app/db.ts/models/optionsModel";
import Question from "@/app/db.ts/models/questionModel";
import Quiz from "@/app/db.ts/models/quizModel";
import { IUser } from "@/app/db.ts/models/types";
import { syncDatabase } from "@/app/db.ts/sequelize";
import { NextRequest, NextResponse } from "next/server";

interface IProps {
  params: {id: string}
}

export async function GET(request: NextRequest, { params }: IProps) {
  await syncDatabase();
  await roleCheck(request)
  const { id } = await params;

  const user = (await authJwt(request)) as IUser;

  const quiz = await Quiz.findOne({
    where: { id: id },
    include: [
      {
        model: Question,
        include: [{ model: Option }],
      },
    ],
  });
  if (!quiz) {
    return NextResponse.json(
      { message: "There is no such quiz !" },
      { status: 404 }
    );
  }

  if (quiz.userId != user.id) {
    return NextResponse.json({ message: "Forbidden!" }, { status: 403 });
  }

  return NextResponse.json({ quiz }, { status: 200 });
}

export async function DELETE(request: NextRequest, {params}: IProps){
  const {id} = await params
  const finded = await Quiz.findByPk(id)

  try {
    await finded?.destroy()
    await finded?.save
    return NextResponse.json({}, {status: 200})
  } catch(err){
    console.log(err)
    return NextResponse.json({message: 'Something went wrong'}, {status: 500})
  }
}