"use client";

import { Axios } from "@/app/api/_helpers/Axios";
import { IQuiz } from "@/app/db.ts/models/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PrivateQuizzes() {
  const [quizzes, setQuizzes] = useState<IQuiz[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    Axios.get("/api/quizzes/private-quizzes")
      .then((res) => setQuizzes(res.data))
      .catch((err) => {
        if (err.response?.status === 401) router.push("/auth/login");
        else if (err.response?.status === 403) router.push("/main");
      });
  }, []);

  return (
    <div className="min-h-screen w-250 bg-gray-900 text-gray-100 p-10">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-white">
        Private Quizzes
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {quizzes?.map((quiz) => (
          <div
            onClick={() => router.push("private-quizzes/" + quiz.id)}
            key={quiz.id}
            className="bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer border border-gray-700"
          >
            {quiz.quiz_img && (
              <img
                src={"../" + quiz.quiz_img}
                alt={quiz.name}
                className="w-full h-48 object-cover rounded-xl mb-4 border border-gray-700"
              />
            )}
            <h2 className="text-2xl font-semibold text-white mb-2">
              {quiz.name}
            </h2>
            <span className="inline-block bg-indigo-600 text-white text-sm px-4 py-1 rounded-full font-medium">
              {quiz.difficulty}
            </span>
            <p className="text-gray-400 text-sm mt-3">
              Created:{" "}
              <span className="font-medium text-gray-200">
                {quiz.createdAt.split("T")[0]}
              </span>
            </p>
            <p className="text-gray-400 text-sm">
              Last Update:{" "}
              <span className="font-medium text-gray-200">
                {quiz.updatedAt.split("T")[0]}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
