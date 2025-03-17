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
      .then((res) => {
        console.log(res.data);
        setResults(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!results) {
    return (
      <div className="w-150 flex justify-center items-center min-h-screen bg-gray-900">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-250 bg-gray-900 text-gray-100 p-10">
      <h1 className="text-4xl font-extrabold text-white text-center mb-10">Results</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {results.map((result) => (
          <div
            key={result.id}
            onClick={() => router.push("/admin/results/" + result.id)}
            className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-lg border border-gray-700 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <img
              src={result.Quiz.quiz_img}
              alt={result.Quiz.name}
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
            <h3 className="mt-4 text-lg font-semibold text-indigo-400">{result.User.username}</h3>
            <h2 className="text-xl font-bold text-white">{result.Quiz.name}</h2>
            <div className="mt-3 border-t border-gray-600 pt-3">
              <strong className="text-green-400 text-lg">Correct: {result.correctSum}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
