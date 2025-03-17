import { useEffect } from "react";
import { IQuestion } from "../db.ts/models/types";
import { Options } from "./Options";
import * as Prism from "prismjs";
import "prismjs/components/prism-javascript.min.js";
import "prismjs/themes/prism-tomorrow.css"; 
import { ISubmit } from "./Quiz";

interface IProps {
  refetch: () => void;
  question: IQuestion;
  submitQuestion: (questionId: number, optionId: number) => void
  submits: ISubmit[]
}

export const Question = ({ refetch, question, submitQuestion, submits }: IProps) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [question]);

  return (
    <div className="mt-6 bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800">
      <h2 className="text-xl font-semibold text-gray-200 mb-3">Code Preview</h2>
      
      <div className="overflow-x-auto w-full rounded-xl bg-brown-800 p-5 shadow-md border border-gray-800">
        <pre className="w-full rounded-lg p-4 bg-gray-950 text-lg text-gray-300 font-mono whitespace-pre-wrap">
          <code className="language-js w-full block">{question.content}</code>
        </pre>
      </div>

      <Options refetch={refetch} options={question.Options} submitOption={submitQuestion.bind(null, question.id)} submittedId={(submits.find(elm => elm.questionId == question.id))?.optionId!}/>
    </div>
  );
};
