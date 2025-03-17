import { useEffect } from "react";
import { IResultQuestion } from "../db.ts/models/types";
import "prismjs/themes/prism-tomorrow.css";
import * as Prism from "prismjs";

interface IProps {
  resultQuestion: IResultQuestion;
  optionId: number;
}

export const ResultQuestion = ({ resultQuestion, optionId }: IProps) => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800">
      <h2 className="text-2xl font-semibold text-gray-200 mb-4">Result</h2>

      {/* Вопрос с Prism.js */}
      <div className="overflow-x-auto w-full rounded-xl bg-gray-800 p-5 shadow-md border border-gray-700">
        <pre className="w-full rounded-lg p-4 bg-gray-950 text-lg text-gray-300 font-mono whitespace-pre-wrap">
          <code className="language-js w-full block">
            {resultQuestion.Question.content}
          </code>
        </pre>
      </div>

      {/* Варианты ответа */}
      <div className="mt-6 space-y-4">
        {resultQuestion.Question.Options.map((option) => {
          const isSelected = option.id === optionId;
          const isCorrect = option.isTrue;

          return (
            <div
              key={option.id}
              className={`flex items-center gap-4 p-4 rounded-lg border border-gray-700 shadow-md transition-all text-gray-300
                ${
                  isCorrect
                    ? "bg-green-500 hover:bg-green-400"
                    : isSelected
                    ? "bg-red-500 hover:bg-red-400"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
            >
              {/* Кружок-индикатор */}
              <span
                className={`w-6 h-6 flex items-center justify-center rounded-full border-2
                  ${
                    isCorrect
                      ? "border-green-300 bg-green-300"
                      : isSelected
                      ? "border-red-400 bg-red-400"
                      : "border-gray-500 bg-transparent"
                  }`}
              >
                {isSelected && (
                  <span className="w-3 h-3 bg-white rounded-full"></span>
                )}
              </span>

              <p className="text-lg">{option.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
