import { NextRequest, NextResponse } from "next/server";
import authJwt from "../_helpers/authMiddlewair";
import { IUser } from "@/app/db.ts/models/types";
import Quiz from "@/app/db.ts/models/quizModel";
import { syncDatabase } from "@/app/db.ts/sequelize";
import uploadImage from "../_helpers/uploadImage";

export async function GET(request: NextRequest) {
  await syncDatabase()
  const user = await authJwt(request) as IUser

  try {
    const quizzes = await Quiz.findAll({where: {isPrivate: false}});
    return NextResponse.json({ quizzes }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = (await authJwt(request)) as IUser;
  if (user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  const form = await request.formData();

  const name = form.get("name") as string;
  const difficulty = form.get("difficulty") as string;
  const image = form.get("image") as File;

  const imagePath = await uploadImage(image);

  try {
    await syncDatabase();
    await Quiz.create({
      name,
      quiz_img: "/" + imagePath,
      difficulty,
      userId: user.id,
    });
    return NextResponse.json({ message: "added" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({}, { status: 500 });
  }
}
