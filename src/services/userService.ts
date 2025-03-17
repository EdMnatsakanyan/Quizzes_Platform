import { IUser } from "@/app/db.ts/models/types";
import User from "@/app/db.ts/models/usersModel";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { redirect } from "next/dist/server/api-utils";
import * as nodemailer from "nodemailer";

export async function register(user: Partial<IUser>) {
  const findedByUsername = await User.findOne({
    where: { username: user.username },
  });
  const findedByEmail = await User.findOne({
    where: { email: user.email },
  });

  if (findedByUsername) {
    throw {
      errMessage: "User with that username already exists",
      statusCode: 400,
    };
  } else if (findedByEmail) {
    throw {
      errMessage: "User with that email already exists",
      statusCode: 400,
    };
  }

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "emnacakanyan2018@gmail.com",
      pass: "ddwf puvw ddte twab",
    },
  });

  const mailOptions = {
    from: `Quizzes Platform`,
    to: user.email,
    subject: "Verify Your Email",
    html: `
    <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f9f9f9; border-radius: 8px; text-align: center; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #2d89ff;">Verify Your Email</h2>
      <p style="color: #555;">Thank you for signing up for <strong>Quizzes Platform</strong>! Please verify your email to activate your account.</p>
      
      <a href="http://localhost:3000/verify/${user.verifyToken}"
         style="display: inline-block; padding: 12px 24px; margin: 20px 0; font-size: 16px; color: #ffffff; background-color: #2d89ff; border-radius: 6px; text-decoration: none; font-weight: bold;">
         ✅ Verify Your Email
      </a>

      <p style="color: #666; font-size: 14px;">If you didn’t create an account, you can safely ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #999; font-size: 12px;">© 2025 Quizzes Platform. All rights reserved.</p>
    </div>
  `,
  };

  await transporter.sendMail(mailOptions);

  const hashedPassword = await bcrypt.hash(user.password as string, 10);

  return await User.create({ ...user, password: hashedPassword });
}

export const login = async (user: Partial<IUser>) => {
  let finded = await User.findOne({ where: { username: user.username } });
  finded = finded?.dataValues;
  if (!finded) {
    throw {
      errMessage: "wrong data",
      statusCode: 400,
    };
  }
  if(!finded?.verified){
    throw {
      errMessage: 'Not verified',
      statusCode: 401
    }
  }
  const match = await bcrypt.compare(user.password as string, finded.password);

  if (!match) {
    throw {
      errMessage: "wrong data",
      statusCode: 400,
    };
  }

  return { ...finded, password: null };
};
