export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  image_url: string;
  role: "user" | "admin";
  verified: boolean,
  verifyToken: string
  Results: IResult[]
}

export interface IQuiz {
  id: number;
  userId: number;
  name: string;
  difficulty: "easy" | "medium" | "hard";
  quiz_img: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  Questions: IQuestion[]
}

export interface IQuestion {
  id: number;
  content: string;
  quizId: number;
  multiple_correct: boolean;
  Options: IOption[]
}

export interface IOption {
  id: number;
  content: string;
  isTrue: boolean;
  questionId: number;
}

export interface IResult {
  id: number;
  userId: number;
  quizId: number;
  correctSum: number;
  Quiz: IQuiz;
  ResultQuestions: IResultQuestion[]
  User: IUser
}

export interface IResultQuestion {
  id: number;
  resultId: number;
  questionId: number;
  optionId: number;
  isTrue: boolean;
  Question: IQuestion
}
