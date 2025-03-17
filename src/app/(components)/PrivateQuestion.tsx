"use client";

import { IOption, IQuestion } from "../db.ts/models/types";
import { useEffect, useState } from "react";
import "prismjs/themes/prism-okaidia.css";
import * as Prism from "prismjs";
import debounce from "lodash.debounce";
import "prismjs/components/prism-javascript.min.js";
import { Axios } from "../api/_helpers/Axios";
import { PrivateOptions } from "./PrivateOption";
import { useRouter } from "next/navigation";

interface IProps {
  iQuestion: IQuestion;
  id: string;
  refetch: () => void;
}

export const PrivateQuestion = ({ iQuestion, id, refetch }: IProps) => {
  const [question, setQuestion] = useState<IQuestion | null>(iQuestion);
  const router = useRouter();
  const [options, setOptions] = useState<IOption[]>(question?.Options || []);

  useEffect(() => {
    if (question?.content) {
      Prism.highlightAll();
    }
  }, [question?.content]);

  const saveQuestion = debounce(
    (updatedQuestion: IQuestion, qId: string) => {
      Axios.put(`api/quizzes/private-quizzes/${qId}/questions`, { question: updatedQuestion })
        .then(() => refetch())
        .catch(console.log);
    },
    1000,
    { leading: false, trailing: true }
  );

  useEffect(() => {
    if (question) {
      saveQuestion(question, id);
    }
    return () => {
      saveQuestion.cancel();
    };
  }, [question, id]);

  const handleDelete = () => {
    Axios.delete(`api/quizzes/private-quizzes/${id}/questions/${question!.id}`)
      .then(() => {
        setQuestion(null);
        refetch();
      })
      .catch(console.log);
  };

  const handleAdd = async () => {
    await Axios.post("api/options", { questionId: question!.id })
      .then((res) => {
        setOptions((prevOptions) => [...prevOptions, res.data]);
      })
      .catch((err) => {
        if (err.response.status === 403) {
          router.push("/main");
        }
      });
  };

  if (!question) return null;

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-8 rounded-3xl shadow-lg text-gray-300 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Question</h2>
        <button
          onClick={handleDelete}
          className="px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-500 transition-all duration-200 shadow-md focus:outline-none"
        >
          Delete
        </button>
      </div>

      <textarea
        value={question.content ?? ""}
        onChange={(e) => setQuestion({ ...question, content: e.target.value })}
        className="w-full bg-gray-800 text-white p-5 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
        rows={3}
        placeholder="Type your question content here..."
      />

      <div className="mt-6 bg-gray-900 p-5 rounded-xl overflow-x-auto">
        <pre className="rounded-lg p-4 bg-gray-900 text-lg text-gray-300">
          <code className="language-js">{question.content}</code>
        </pre>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Options</h3>
        <button
          onClick={handleAdd}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all shadow-md focus:outline-none"
        >
          Add Option
        </button>
        <PrivateOptions iOptions={options} setOptions={setOptions} refetch={refetch} />
      </div>
    </div>
  );
};
