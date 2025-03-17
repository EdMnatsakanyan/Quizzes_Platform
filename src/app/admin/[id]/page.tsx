"use client";

import { Axios } from "@/app/api/_helpers/Axios";
import { IQuiz } from "@/app/db.ts/models/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Prism from "prismjs";
import "prismjs/components/prism-javascript.min.js";
import "prismjs/themes/prism-tomorrow.css";

export default function AdminQuiz() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const router = useRouter();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    Axios.get(`api/quizzes/${id}`)
      .then((res) => {
        console.log(res.data);
        setQuiz(res.data);
      })
      .catch((err) => {
        console.log(err);
        router.push("/admin");
      });
  }, [id]);

  useEffect(() => {
    if (quiz) {
      Prism.highlightAll();
    }
  }, [quiz]);

  const makePrivate = () => {
    Axios.put(`api/quizzes/${id}/make-private`)
      .then((res) => {
        console.log(res);
        router.push("/admin/private-quizzes");
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 403) {
          router.push("/main");
        }
      });
  };

  if (!quiz) {
    return (
      <div className="w-150 flex items-center justify-center min-h-screen w-full bg-gray-900 text-gray-300">
        <p className="text-4xl font-bold animate-pulse">Loading...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen w-250 bg-gray-900 text-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-700">
        <img
          src={quiz.quiz_img}
          alt={quiz.name}
          className="w-full h-90 object-cover"
        />
        <div className="p-6">
          <h1 className="text-4xl font-extrabold text-white">{quiz.name}</h1>
          <p className="text-lg text-gray-400 mt-3">
            Difficulty:{" "}
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-indigo-600 text-white">
              {quiz.difficulty}
            </span>
          </p>
          <p className="text-gray-300 mt-2">
            Total Questions: {quiz.Questions.length}
          </p>
          <button
            onClick={makePrivate}
            className="w-40 mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
          >
            Make Private
          </button>
        </div>
      </div>

      <div className="mt-10 space-y-8">
        {quiz.Questions.map((question) => (
          <div
            key={question.id}
            className="p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              Question {question.id}
            </h2>
            <div className="overflow-x-auto w-full rounded-xl bg-gray-900 p-5 shadow-md border border-gray-700">
              <pre className="w-full rounded-lg p-4 bg-gray-950 text-lg text-gray-300 font-mono whitespace-pre-wrap">
                <code className="language-js w-full block">
                  {question.content}
                </code>
              </pre>
            </div>

            <div className="mt-4 space-y-3">
              {question.Options.map((option) => (
                <div
                  key={option.id}
                  className={`p-3 rounded-lg font-medium ${
                    option.isTrue
                      ? "bg-green-600 text-white border border-green-500 shadow-lg"
                      : "bg-gray-700 text-gray-300 border border-gray-600"
                  }`}
                >
                  {option.content}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
