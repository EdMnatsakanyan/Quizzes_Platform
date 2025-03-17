import User from "@/app/db.ts/models/usersModel";
import { redirect, useParams } from "next/navigation";
import { NextResponse } from "next/server";

interface Props {
  params: { token: string };
}

export default async function Verify({ params }: Props) {
  const { token } = await params;

  const finded = await User.findOne({ where: { verifyToken: token } });
  if (!finded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
        <div className="bg-gray-900 p-10 rounded-xl shadow-xl text-center">
          <h1 className="text-3xl font-bold">Verification Failed</h1>
          <p className="mt-4 text-gray-400">We couldn't verify your account.</p>
          <p className="mt-5 text-sm text-red-500">Invalid or expired token.</p>
        </div>
      </div>
    );
  }

  finded.verified = true;
  await finded.save();

  redirect('http://localhost:3000/auth/login');


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      <div className="bg-gray-900 p-10 rounded-xl shadow-xl text-center">
        <h1 className="text-3xl font-bold">Verification Successful!</h1>
        <p className="mt-4 text-gray-400">Your account has been successfully verified.</p>
        <div className="mt-5">
          <div className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <p className="mt-5 text-sm text-gray-500">You will be redirected to the login page shortly.</p>
      </div>
    </div>
  );
}
