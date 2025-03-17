"use client";

import ToastNotification from "@/app/(components)/ToastContainer";
import { Axios } from "@/app/api/_helpers/Axios";
import { IQuiz, IUser } from "@/app/db.ts/models/types";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function AddQuiz() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Partial<IQuiz>>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const img = event.target.files?.[0];
    if (!img) {
      return;
    }
    setImage(img);
    setPreview(URL.createObjectURL(img));
  };

  const handleAdd = (data: Partial<IQuiz>) => {
    const formData = new FormData();
    formData.append("name", data.name || "");
    formData.append("difficulty", data.difficulty || "");
    formData.append("image", image!);

    Axios.post("/api/quizzes", formData)
      .then((res) => {
        console.log(res);
        toast.success('Quiz created successfully !')
        router.push("/admin/private-quizzes");
      })
      .catch((err) => {
        console.log(err)
        if(err.response.status === 403){
          router.push('/quizzes')
        }
      });
  };

  return (
    <div className="min-h-screen w-250 bg-gray-900 text-white flex flex-col items-center py-12">
      {/* Main container */}
      <ToastNotification/>
      <div className="w-240 max-w-3xl bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-indigo-500">
          Add a New Quiz
        </h2>

        <form onSubmit={handleSubmit(handleAdd)} className="space-y-6">
          {/* Image upload section */}
          <div className="flex flex-col items-center">
            <label
              htmlFor="image"
              className="text-lg font-medium text-gray-300 mb-4"
            >
              Quiz Image
            </label>
            <button
              type="button"
              onClick={() => ref.current?.click()}
              className="px-6 py-2 bg-indigo-600 rounded-md hover:bg-indigo-500 text-white transition duration-200"
            >
              Upload Image
            </button>
            {preview && (
              <img
                src={preview as string}
                alt="Preview"
                className="mt-4 w-192 h-64 rounded-lg shadow-md object-cover"
              />
            )}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={ref}
              onChange={handleChange}
            />
          </div>

          {/* Quiz Name */}
          <div className="flex flex-col">
            <label
              htmlFor="quizName"
              className="text-lg font-medium text-gray-300 mb-2"
            >
              Quiz Name
            </label>
            <input
              type="text"
              id="quizName"
              className="px-6 py-3 bg-gray-700 text-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              placeholder="Enter quiz name"
              {...register("name", { required: "Quiz name is required" })}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Difficulty Selection */}
          <div className="flex flex-col">
            <label
              htmlFor="difficulty"
              className="text-lg font-medium text-gray-300 mb-2"
            >
              Difficulty
            </label>
            <select
              id="difficulty"
              className="px-6 py-3 bg-gray-700 text-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              {...register("difficulty", {
                required: "Please select difficulty",
              })}
            >
              <option value="">Select difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            {errors.difficulty && (
              <span className="text-red-500 text-sm">
                {errors.difficulty.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition duration-200">
              Add Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
