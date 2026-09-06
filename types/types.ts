interface ICategory {
  id: string;
  name: string;
  description: string;
  image?: string;
  quizzes: IQuiz[];
}

interface IQuiz {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  categoryId: string;
  categoryName?: string; // added
  difficulty?: string | null;
  questions: IQuestion[];
}
interface IResponse {
  questionId: string;
  optionId: string;
  isCorrect: boolean;
}

interface IQuestion {
  id: string;
  text: string;
  difficulty?: string | null;
  options: IOption[];
}

interface IOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface ICategoryStats {
  attempts: number;
  averageScore: number | null;
  categoryId: string;
  completed: number;
  id: string;
  lastAttempt: Date;
  userId: string;
  category: ICategory;
}

export type { ICategory, IQuiz, IQuestion, IOption, IResponse, ICategoryStats };
