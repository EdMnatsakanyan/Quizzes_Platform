"use client";

import { Axios } from "@/app/api/_helpers/Axios";
import { IUser } from "@/app/db.ts/models/types";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<IUser>>();

  const [response, setResponse] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (data: Partial<IUser>) => {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", data);
      
      // Редирект в зависимости от роли пользователя
      res.data.role === "admin" ? router.push("/admin") : router.push("/main");
    } catch (err: any) {
      setResponse(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  useEffect(() => {
    Axios.get("api/auth/authenticate")
      .then((res) => {
        res.data.role === "admin" ? router.push("/admin") : router.push("/main");
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <div className="bg-gray-900 text-gray-300 p-10 rounded-xl shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-white mb-5">Login</h1>

        {/* Сообщение об ошибке */}
        {response && <p className="text-red-400 text-center">{response}</p>}

        <form className="space-y-5" onSubmit={handleSubmit(handleLogin)}>
          {/* Username */}
          <div>
            <input
              placeholder="Username"
              {...register("username", {
                required: "Username is required",
                minLength: { value: 3, message: "Username must be at least 3 characters" },
              })}
              className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            {errors.username && <p className="text-red-400">{errors.username.message}</p>}
          </div>

          {/* Password */}
          <div>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
                validate: {
                  hasUpperCase: (value) => /[A-Z]/.test(value!) || "Must contain at least one uppercase letter",
                  hasLowerCase: (value) => /[a-z]/.test(value!) || "Must contain at least one lowercase letter",
                  hasNumber: (value) => /\d/.test(value!) || "Must contain at least one number",
                },
              })}
              placeholder="Password"
              type="password"
              className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            {errors.password && <p className="text-red-400">{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <button className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition">
            Login
          </button>

          {/* Register Link */}
          <p className="text-center">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-indigo-400 hover:underline">
              Register
            </Link>
          </p>

          {/* Forgot Password */}
          <p className="text-center mt-3">
            <Link href="/auth/new-password" className="text-indigo-400 hover:underline">
              Forgot your password?
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
