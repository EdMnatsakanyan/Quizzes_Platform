import { syncDatabase } from "@/app/db.ts/sequelize";
import { register } from "@/services/userService";
import { useRouter } from "next/router";
import { NextRequest, NextResponse } from "next/server";
import uploadImage from "../../_helpers/uploadImage";
import * as crypto from "crypto";
import * as nodemailer from "nodemailer";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  await syncDatabase();
  const form = await request.formData();

  const username = form.get("username") as string;
  const email = form.get("email") as string;
  const password = form.get("password") as string;
  const image = form.get("image") as File;

  const imagePath = await uploadImage(image);

  
  try {
    const verifyToken = crypto.randomBytes(32).toString("hex");
      
    await register({
      username,
      email,
      password,
      image_url: imagePath,
      verifyToken,
    });


    return NextResponse.json(
      { message: "added successfully" },
      { status: 201 }
    );
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      { message: err.errMessage || "something went wrong" },
      { status: err.statusCode || 500 }
    );
  }
}
