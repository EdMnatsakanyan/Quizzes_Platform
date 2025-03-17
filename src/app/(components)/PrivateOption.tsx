import { useEffect, useState } from "react";
import { IOption } from "../db.ts/models/types";
import debounce from "lodash.debounce";
import { Axios } from "../api/_helpers/Axios";
import { useRouter } from "next/navigation";

interface IProps {
  iOptions: IOption[];
  refetch: () => void;
  setOptions: any;
}

export const PrivateOptions = ({ iOptions: options, setOptions, refetch }: IProps) => {
  const router = useRouter();

  useEffect(() => {
    saveOptions(options);
    return () => saveOptions.cancel();
  }, [options]);

  const saveOptions = debounce(
    (options) => {
      Axios.put("api/options", { options })
        .then(() => refetch())
        .catch((err) => {
          if (err.response.status === 403) {
            return router.push("/main");
          }
        });
    },
    1000,
    { leading: false, trailing: true }
  );

  const handleDelete = (id: number) => {
    Axios.delete(`api/options/${id}`)
      .then(() => {
        setOptions((options: IOption[]) => options.filter(op => op.id !== id));
        refetch();
      })
      .catch((err) => {
        if (err.response.status === 403) {
          return router.push("/main");
        }
      });
  };

  return (
    <div className="mt-4 space-y-3">
      {options.map((option) => (
        <div key={option.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg shadow-md">
          <input
            className={`w-full p-2 rounded-md focus:outline-none focus:ring-2 transition-all ${option.isTrue ? "bg-green-500 text-black" : "bg-gray-700 text-white"}`}
            placeholder="Content"
            defaultValue={option.content}
            onChange={(e) => {
              setOptions((options: IOption[]) =>
                options.map((op) =>
                  op.id === option.id ? { ...op, content: e.target.value } : op
                )
              );
            }}
            onDoubleClick={() =>
              setOptions((options: IOption[]) =>
                options.map((op) =>
                  op.id === option.id ? { ...op, isTrue: !op.isTrue } : { ...op, isTrue: false }
                )
              )
            }
          />
          <button 
            onClick={() => handleDelete(option.id)}
            className="px-3 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-400 transition-all shadow-md"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};