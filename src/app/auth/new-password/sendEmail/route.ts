import User from "@/app/db.ts/models/usersModel";
import { NextRequest, NextResponse } from "next/server";
import * as nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "emnacakanyan2018@gmail.com",
    pass: "ddwf puvw ddte twab",
  },
});



export async function POST(request: NextRequest) {
    console.log('ekav')
  const { email } = await request.json();

  const findedUserByEmail = await User.findOne({ where: { email } });
  if (!findedUserByEmail) {
    return NextResponse.json(
      { message: "No user with that email" },
      { status: 400 }
    );
  }

  const code = Math.floor(Math.random() * 1000)

  const mailOptions = {
    from: `Quizzes Platform`,
    to: email,
    subject: "Password recovery code",
    html: `
        <div>
            <h1>Your password recovery code </h1>
            <p>${code}<p>
        </div>
    `
  };

  transporter.sendMail(mailOptions)

  return NextResponse.json({code}, {status: 200})
}
