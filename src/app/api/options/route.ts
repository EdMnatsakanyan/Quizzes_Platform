import Option from "@/app/db.ts/models/optionsModel";
import { syncDatabase } from "@/app/db.ts/sequelize";
import { NextRequest, NextResponse } from "next/server";
import { roleCheck } from "../_helpers/roleMiddlewair";
import { IOption } from "@/app/db.ts/models/types";

export async function POST(request: NextRequest) {
  await syncDatabase();
  await roleCheck(request);
  const { questionId } = await request.json();
  if (
    !questionId ||
    isNaN(+questionId) ||
    +questionId !== Math.floor(+questionId)
  ) {
    return NextResponse.json(
      { message: "Wrong quizId format" },
      { status: 400 }
    );
  }

  try {
    const newOption = await Option.create({
      content: "",
      questionId,
    });
    return NextResponse.json(newOption, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({}, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  await syncDatabase();
  await roleCheck(request);

  const { options } = await request.json();
  if (!Array.isArray(options) || options.length === 0) {
    return NextResponse.json(
      { message: "No options provided" },
      { status: 400 }
    );
  }

  await Option.bulkCreate(
    options,
    {
      updateOnDuplicate: ["content", "isTrue"]
    }
  );

  return NextResponse.json({message: 'Updated successfully'}, {status: 200})
}
