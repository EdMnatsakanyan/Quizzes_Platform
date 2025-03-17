import { IOption } from "../db.ts/models/types";

interface IProps {
  refetch: () => void;
  options: IOption[];
  submitOption: (optionId: number) => void
  submittedId: number
}

export const Options = ({ refetch, options, submitOption, submittedId}: IProps) => {
  return (
    <div className="mt-5">
      <h3 className="text-lg font-semibold text-gray-300 mb-2">Options</h3>
      <div className="space-y-2">
        {options.map((option, i) => (
          <div
            onClick={() => submitOption(option.id)}
            key={option.id}
            className={`flex items-center gap-2 p-3 bg-gray-800 rounded-lg border ${submittedId == option.id ? "bg-indigo-700": "bg-gray-700"} border-gray-700 shadow-md hover:bg-indigo-400 hover:text-black transition`}
          >
            <span className="text-gray-400 font-semibold">{i + 1}.</span>
            <p className="text-gray-300">{option.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
