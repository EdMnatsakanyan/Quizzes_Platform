"use client";

import { Axios } from "@/app/api/_helpers/Axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import bcrypt from "bcryptjs";

export default function NewPassword() {
  const [email, setEmail] = useState("");
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  const router = useRouter();

  const handleSend = () => {
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return;
    }

    Axios.post("/api/auth/new-password/sendEmail", { email })
      .then((res) => {
        setActive(true);
        setError("");
        setVerifyCode(res.data.code);
      })
      .catch((error) => {
        if (error.response?.status === 400) {
          setError("No account with that email");
        }
      });
  };

  const handleVerify = async () => {
    if (!code) {
      setError("Verification code is required");
      return;
    }

    const isMatch = await bcrypt.compare(code, verifyCode);
    if (!isMatch) {
      setError("Wrong verification code");
      setTimeout(() => router.push("/auth/login"), 2000);
    } else {
      setVerified(true);
    }
  };

  const handleChangePassword = () => {
    if (!passwordRegex.test(newPassword)) {
      setNewPasswordError("Password must be at least 6 characters long and contain both uppercase and lowercase letters");
      return;
    }

    Axios.post("/api/auth/new-password", { email, password: newPassword })
      .then(() => router.push("/auth/login"))
      .catch(() => setNewPasswordError("Error changing password"));
  };

  if (verified)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
        <div className="bg-gray-900 text-gray-300 p-10 rounded-xl shadow-xl max-w-md w-full">
          <h1 className="text-3xl font-bold text-center text-white mb-5">Change Password</h1>
          {newPasswordError && <p className="text-red-400 text-center mb-3">{newPasswordError}</p>}
          <input
            type="password"
            placeholder="New Password"
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <button onClick={handleChangePassword} className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition">
            Change Password
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <div className="bg-gray-900 text-gray-300 p-10 rounded-xl shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-white mb-5">Reset Password</h1>
        {error && <p className="text-red-400 text-center mb-3">{error}</p>}
        <input
          type="email"
          placeholder="Your email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
        />
        <button onClick={handleSend} className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition">
          Send Verification Code
        </button>
        {active && (
          <div className="mt-5">
            <input
              maxLength={4}
              type="text"
              placeholder="Verification Code"
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            <button onClick={handleVerify} className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-500 transition">
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
