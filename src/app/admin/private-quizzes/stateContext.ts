import { IQuiz } from "@/app/db.ts/models/types";
import { createContext, useContext } from "react";

export interface IContext {
    quiz: IQuiz | null
    setQuiz: (quiz: IQuiz) => void
}

export const quizContext = createContext({});
export function useStateContext() {
  return useContext(quizContext);
}
