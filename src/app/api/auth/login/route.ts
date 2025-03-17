import { login } from "@/services/userService";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import { syncDatabase } from "@/app/db.ts/sequelize";

export async function POST(request: NextRequest) {
  await syncDatabase()
  const data = await request.json();

  if (data.username.length < 3) {
    return NextResponse.json(
      { message: "username length must be at least 3" },
      { status: 400 }
    );
  }
  if (data.password.length < 4) {
    return NextResponse.json(
      { message: "username password must be at least 4" },
      { status: 400 }
    );
  }

  try {
    const user = await login(data);
    const token = jwt.sign(user, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    const response = NextResponse.json(user);
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60,
    });
    
    return response
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      { message: err.errMessage || "something went wrong" },
      { status: err.statusCode || 500 }
    );
  }
}
