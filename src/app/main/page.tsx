"use client"

import { useEffect, useState } from "react"
import { IQuiz } from "../db.ts/models/types"
import { Axios } from "../api/_helpers/Axios"
import { useRouter } from "next/navigation"

export default function Main() {
    const [quizzes, setQuizzes] = useState<IQuiz[] | null>(null)
    const router = useRouter()

    useEffect(() => {
        Axios.get('api/quizzes')
            .then(res => setQuizzes(res.data.quizzes))
            .catch(err => {
                console.log(err)
            })
    }, [])

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-10">
          <h1 className="text-4xl font-extrabold text-center mb-10 text-white">
            Quizzes
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizzes?.map((quiz) => (
              <div
                onClick={() => router.push("main/" + quiz.id)}
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