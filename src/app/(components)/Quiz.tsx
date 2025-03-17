"use client";
import { useEffect, useState } from "react";
import { IQuiz, IResult } from "../db.ts/models/types";
import { Axios } from "../api/_helpers/Axios";
import { useRouter } from "next/navigation";
import { Question } from "./Question";
import { Results } from "./Results";

interface IProps {
  id: number;
}
export interface ISubmit {
  questionId: number;
  optionId: number | null;
}

export const Quiz = ({ id }: IProps) => {
  const [isSubmited, setIsSubmited] = useState<boolean>(false);
  const [result, setResult] = useState<IResult | null>(null)
  const [error, setError] = useState<string>("");
  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const router = useRouter();
  const [submits, setSubmits] = useState<ISubmit[]>([]);

  const submitQuestion = (questionId: number, optionId: number) => {
    setSubmits([
      ...submits.filter((elm) => elm.questionId !== questionId),
      { questionId, optionId },
    ]);
  };

  const refetch = async () => {
    Axios.get("api/quizzes/" + id)
      .then((res) => {
        console.log(res.data);
        setQuiz(res.data);
      })
      .catch((err) => {
        console.log(err);
        router.push("");
      });
  };

  useEffect(() => {
    Axios.post('/api/results/by-quiz/', {id})
      .then((res) => {
        setResult(res.data)
      })
      .then(() => setIsSubmited(true))
      .catch(err => {})
    refetch();
  }, [id]);

  const handleSubmit = () => {
    if (submits.length < quiz!.Questions.length) {
      setError("Every question must have a submitted option!");
      return;
    }
    setError("");
    Axios.post(`api/quizzes/${quiz!.id}/submit`, { submits })
      .then((res) => {
        setIsSubmited(true)
        setResult(res.data.result)
      })
      .catch((err) => console.log(err));
  };

  if (!quiz) {
    return (
      <h1 className="text-center text-gray-300 text-2xl mt-10">Loading...</h1>
    );
  }

  if(isSubmited){
    return <>
      <Results result={result!}/>
    </>
  }

  return (
    <div className="max-w-6xl mx-auto bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800">
      <img src={quiz.quiz_img} alt="" className="w-4/4 h-auto mx-auto" />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-white">{quiz.name}</h1>
        <strong className="text-lg text-gray-400">
          Difficulty: {quiz.difficulty}
        </strong>
      </div>

      <div className="flex flex-col gap-8 space-y-6">
        {quiz.Questions.map((question) => (
          <Question
            key={question.id}
            refetch={refetch}
            question={question}
            submitQuestion={submitQuestion}
            submits={submits}
          />
        ))}

        {error && <p className="text-red-500 text-lg font-semibold">{error}</p>}

        <button
          onClick={handleSubmit}
          className="mt-4 py-3 px-6 bg-indigo-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all"
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
};
