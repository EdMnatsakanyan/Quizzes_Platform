import User from "@/app/db.ts/models/usersModel";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import { IUser } from "@/app/db.ts/models/types";
import { syncDatabase } from "@/app/db.ts/sequelize";

export async function POST(request: NextRequest) {
  await syncDatabase();
  const { email, password } = await request.json();

  const finded = await User.findOne({ where: { email } });
  const hashedPassword = await bcrypt.hash(password, 10);

  if (!finded) {
    return NextResponse.json(
      { message: "no user with that email" },
      { status: 400 }
    );
  }
  finded.password = hashedPassword;
  finded.save();
  return NextResponse.json(
    { message: "Changed successfully!" },
    { status: 200 }
  );
}
