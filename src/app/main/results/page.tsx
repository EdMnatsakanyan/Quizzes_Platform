"use client";

import { Axios } from "@/app/api/_helpers/Axios";
import { IResult } from "@/app/db.ts/models/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Results() {
  const [results, setResults] = useState<IResult[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    Axios.get("api/results")
      .then((res) => setResults(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (!results) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if(results.length == 0) return <div className="min-h-screen bg-gray-900 text-gray-100 p-10">
      <h2 className="text-4xl font-extrabold text-center mb-10 text-white">
        Your Results
      </h2>
      <p className="font-extrabold text-center mb-10 text-white">No quizzes passed yet</p>
    </div>

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-10">
      <h2 className="text-4xl font-extrabold text-center mb-10 text-white">
        Your Results
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {results.map((result) => (
          <div
            key={result.id}
            onClick={() => router.push("/main/" + result.quizId)}
            className="bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer border border-gray-700"
          >
            <img
              src={result.Quiz.quiz_img}
              alt={result.Quiz.name}
              className="w-full h-48 object-cover rounded-xl mb-4 border border-gray-700"
            />
            <h3 className="text-2xl font-semibold text-white mb-2">
              {result.Quiz.name}
            </h3>
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm">
                Total Questions: {result.ResultQuestions.length}
              </p>
              <strong
                className={`${
                  result.correctSum > result.correctSum / 2
                    ? "bg-green-500"
                    : "bg-red-500"
                } text-white text-sm px-4 py-1 rounded-full font-medium`}
              >
                {result.correctSum}/{result.ResultQuestions.length}
              </strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
