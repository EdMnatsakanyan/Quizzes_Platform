import User from "@/app/db.ts/models/usersModel";
import { syncDatabase } from "@/app/db.ts/sequelize";
import * as bcrypt from "bcrypt";
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
  await syncDatabase()
  const { email } = await request.json();

  const findedUserByEmail = await User.findOne({ where: { email } });
  if (!findedUserByEmail) {
    return NextResponse.json(
      { message: "No user with that email" },
      { status: 400 }
    );
  }

  let code = Math.floor(1000 + Math.random() * 9000);

  const mailOptions = {
    from: "Quizzes Platform",
    to: email,
    subject: "Password Recovery Code",
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
        background-color: #1e293b;
        color: #e2e8f0;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
      ">
        <h1 style="color: #60a5fa; font-size: 24px;">Password Recovery Code</h1>
        <p style="font-size: 16px; margin-bottom: 20px;">
          Use the code below to reset your password:
        </p>
        <div style="
          font-size: 28px;
          font-weight: bold;
          background: #3b82f6;
          color: white;
          display: inline-block;
          padding: 10px 20px;
          border-radius: 8px;
          letter-spacing: 3px;
        ">
          ${code}
        </div>
        <p style="font-size: 14px; margin-top: 20px; color: #94a3b8;">
          If you did not request this, please ignore this email.
        </p>
        <p style="font-size: 12px; color: #64748b; margin-top: 10px;">
          &copy; 2025 Quizzes Platform. All rights reserved.
        </p>
      </div>
    `,
  };
  

  transporter.sendMail(mailOptions)

  const hashedCode = await bcrypt.hash(String(code), 10)
  return NextResponse.json({code: hashedCode}, {status: 200})
}
