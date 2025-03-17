import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import { syncDatabase } from "@/app/db.ts/sequelize";
import User from "@/app/db.ts/models/usersModel";
import { IUser } from "@/app/db.ts/models/types";

export default async function authJwt(request: Partial<NextRequest>) {
  await syncDatabase();
  const token = request.cookies?.get("token")?.value;
  if (!token) {
    return NextResponse.json(
      { message: "authentication failed (" },
      { status: 401 }
    );
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string) as IUser;
    if (!user) {
      return NextResponse.json(
        { message: "authentication failed (" },
        { status: 401 }
      );
    }
    const finded = await User.findOne({ where: { id: user.id } });

    if (!finded) {
      return NextResponse.json(
        { message: "authentication failed (" },
        { status: 401 }
      );
    }
    return user;
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "authentication failed (" },
      { status: 401 }
    );
  }
}
