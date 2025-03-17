"use client";

import { PrivateQuestion } from "@/app/(components)/PrivateQuestion";
import { Axios } from "@/app/api/_helpers/Axios";
import { IQuestion, IQuiz } from "@/app/db.ts/models/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PrivateQuiz() {
  const router = useRouter();
  const { id } = useParams();

  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const [error, setError] = useState<string>("");

  const refetch = () => {
    Axios.get("api/quizzes/private-quizzes/" + id)
      .then((res) => {
        setError("");
        setQuiz(res.data.quiz);
      })
      .catch((err) => {
        if (err.response?.status === 403) return router.push("/main");
        if (err.response?.status === 400)
          return setError(err.response.data.message);
        setError("Something went wrong");
      });
  };

  useEffect(() => {
    refetch();
  }, []);

  const handleAdd = async () => {
    const newQuestion = (
      await Axios.post(`api/quizzes/private-quizzes/${id}/questions`)
    ).data.newQuestion as IQuestion;

    setQuiz({ ...quiz!, Questions: [...quiz!.Questions!, newQuestion] });
  };

  const makePublic = () => {
    Axios.post(`api/quizzes/private-quizzes/${id}/make-public`, {})
      .then((res) => {
        return router.push("/admin");
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setError(err.response.data.message);
        }
      });
  };

  const handleDelete = () => {
    Axios.delete("api/quizzes/private-quizzes/" + quiz!.id)
      .then((res) => router.push("/admin/private-quizzes"))
      .catch((err) => console.log(err));
  };

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-gray-900 text-gray-300">
        <p className="text-4xl font-bold animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-6 bg-gray-900 text-gray-300">
      <div className="w-full max-w-4xl bg-gray-800 p-10 rounded-xl shadow-lg">
        {quiz.quiz_img && (
          <img
            style={{ height: "430px" }}
            src={`http://localhost:3000/${quiz.quiz_img}`}
            alt={quiz.name}
            className="w-full h-64 object-cover rounded-xl mb-6 border border-gray-700 shadow-md"
          />
        )}
        <h1 className="text-4xl font-extrabold text-white text-center">
          {quiz.name}
        </h1>
        <p className="text-gray-400 text-center mt-4 text-lg">
          Difficulty:{" "}
          <strong className="text-indigo-400">{quiz.difficulty}</strong>
        </p>

        {error && (
          <p className="text-red-500 text-center mt-5 text-lg font-medium">
            {error}
          </p>
        )}

        <button
          onClick={handleDelete}
          className="mt-4 w-full py-3 bg-red-600 text-white text-lg font-bold rounded-lg hover:bg-indigo-500 transition-all shadow-md"
        >
          Delete Quiz
        </button>

        <button
          onClick={makePublic}
          className="mt-6 w-full py-3 bg-green-600 text-white text-lg font-bold rounded-lg hover:bg-green-500 transition-all shadow-md"
        >
          Make Public
        </button>

        <button
          onClick={handleAdd}
          className="mt-4 w-full py-3 bg-indigo-600 text-white text-lg font-bold rounded-lg hover:bg-indigo-500 transition-all shadow-md"
        >
          Add Question
        </button>

        <div className="mt-8 space-y-6">
          {quiz.Questions.map((question, i) => (
            <div
              key={question.id}
              className="bg-gray-700 p-5 rounded-lg shadow-md border border-gray-600"
            >
              <p className="text-indigo-300 font-semibold">Question {i + 1}</p>
              <PrivateQuestion
                iQuestion={question}
                id={id as string}
                refetch={refetch}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
