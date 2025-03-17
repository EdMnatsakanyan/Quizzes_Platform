import { NextRequest, NextResponse } from "next/server";
import { IUser } from "@/app/db.ts/models/types";
import Quiz from "@/app/db.ts/models/quizModel";
import { syncDatabase } from "@/app/db.ts/sequelize";
import authJwt from "../../../api/_helpers/authMiddlewair";

export async function GET(request: NextRequest) {
  await syncDatabase();
  const user = (await authJwt(request)) as IUser;
  if (user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const quizzes = await Quiz.findAll({
      where: { isPrivate: false, userId: user.id },
    });
    return NextResponse.json({ quizzes }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({}, { status: 500 });
  }
}
