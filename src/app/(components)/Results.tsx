import { IResult } from "../db.ts/models/types";
import { ResultQuestion } from "./ResultQuestion";

interface IProps {
  result: IResult;
}

export const Results = ({ result }: IProps) => {
  const isHighScore = result.correctSum >= result.ResultQuestions.length;

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-2xl bg-gray-900 shadow-xl border border-gray-800">
      <img
        src={result.Quiz.quiz_img}
        className="w-full h-auto mx-auto rounded-lg shadow-md"
        alt="Quiz Image"
      />
      <h2 className="text-2xl font-semibold text-gray-200 text-center mt-4">Score</h2>
      <div className="flex justify-center mt-3">
        <div
          className={`w-24 h-24 flex items-center justify-center rounded-full shadow-lg text-4xl font-bold transition-all
            ${isHighScore ? "bg-green-500 text-white" : "bg-red-500 text-white"}
          `}
        >
          {result.correctSum}
        </div>
      </div>
      <div className="mt-4">
        {result.ResultQuestions.map((elm) => (
          <ResultQuestion key={elm.id} resultQuestion={elm} optionId={elm.optionId} />
        ))}
      </div>
    </div>
  );
};
