import Option from "@/app/db.ts/models/optionsModel";
import Question from "@/app/db.ts/models/questionModel";
import Quiz from "@/app/db.ts/models/quizModel";
import { syncDatabase } from "@/app/db.ts/sequelize";
import { NextRequest, NextResponse } from "next/server";
import { useState } from "react";
import authJwt from "../../_helpers/authMiddlewair";
import { IUser } from "@/app/db.ts/models/types";

interface IProps {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: IProps) {
  await syncDatabase();
  const user = await authJwt(request) as IUser
  const { id } = await params;

  const finded = (
    await Quiz.findOne({
      where: {
        id,
        isPrivate: false
      },
      include: [
        {
          model: Question,
          include: [
            {
              model: Option,
              attributes: { exclude: user.role == 'admin' ? []: ["isTrue"] },
            },
          ],
        },
      ],
    })
  )?.dataValues;
  
  if(!finded) {
    return NextResponse.json({message: 'No such quiz'}, {status: 400})
  }
  return NextResponse.json(finded, { status: 200 });
}

