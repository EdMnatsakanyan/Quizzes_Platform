"use client";

import { IUser } from "@/app/db.ts/models/types";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function Registration() {
  const [currentImg, setCurrentImg] = useState<string | null>(null);
  const img = useRef<HTMLInputElement>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [photoImage, setPhotoImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<IUser>>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const image = event.target.files?.[0] as File;
    if (!image) return;
    setPhotoImage(image);
    setCurrentImg(URL.createObjectURL(image));
  };

  const router = useRouter();

  const handleAdd = async (user: Partial<IUser>) => {
    const form = new FormData();
    form.append("username", user.username || "");
    form.append("email", user.email || "");
    form.append("password", user.password || "");
    if (photoImage) {
      form.append("image", photoImage);
    }

    try {
      await axios.post("http://localhost:3000/api/auth/register", form);
      router.push("./login");
    } catch (err: any) {
      setResponse(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <div className="bg-gray-900 text-gray-300 p-10 rounded-xl shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-white mb-5">
          Register
        </h1>
        {response && <p className="text-red-400 text-center">{response}</p>}
        <form className="space-y-5" onSubmit={handleSubmit(handleAdd)}>
          {/* Username */}
          <div>
            <input
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
              })}
              placeholder="Username"
              className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            {errors.username && <p className="text-red-400">{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email format",
                },
              })}
              placeholder="Email"
              className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            {errors.email && <p className="text-red-400">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
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

          {/* Upload Image */}
          <div className="flex flex-col items-center space-y-4">
            <button
              type="button"
              onClick={() => img?.current?.click()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition"
            >
              Upload Image
            </button>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={img}
              onChange={handleChange}
            />
            {currentImg && (
              <img
                src={currentImg}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover shadow-md"
              />
            )}
          </div>

          {/* Submit Button */}
          <button className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition">
            Register
          </button>

          {/* Login Link */}
          <p className="text-center">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-indigo-400 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
