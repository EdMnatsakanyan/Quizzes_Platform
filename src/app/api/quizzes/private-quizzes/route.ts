import { NextRequest, NextResponse } from "next/server";
import authJwt from "../../_helpers/authMiddlewair";
import Quiz from "@/app/db.ts/models/quizModel";
import { IUser } from "@/app/db.ts/models/types";
import { syncDatabase } from "@/app/db.ts/sequelize";
import { roleCheck } from "../../_helpers/roleMiddlewair";

export async function GET(request: NextRequest) {
  await syncDatabase();
  await roleCheck(request)
  try {
    const user = (await authJwt(request)) as IUser;
    const finded = await Quiz.findAll({ where: { userId: user.id, isPrivate: true } });

    if (user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(finded, { status: 200 });
  } catch (err) {
    return NextResponse.json({}, { status: 500 });
  }
}
