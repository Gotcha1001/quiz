"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import useCategories from "./useCategories";
import { ICategory, IQuestion, IQuiz } from "@/types/types"; // fix path if you rename the file
import { useUser } from "@clerk/nextjs";
import axios from "axios";

interface IQuizSetup {
  questionCount: number;
  category: string | null; // categoryId
  difficulty: string | null;
}

interface IQuizResponse {
  questionId: string;
  optionId: string;
  isCorrect: boolean;
}

interface GlobalContextType {
  loading: boolean;
  categories: ICategory[];
  quizSetup: IQuizSetup;
  setQuizSetup: Dispatch<SetStateAction<IQuizSetup>>;
  selectedQuiz: IQuiz | null;
  setSelectedQuiz: Dispatch<SetStateAction<IQuiz | null>>;
  quizResponses: IQuizResponse[];
  setQuizResponses: Dispatch<SetStateAction<IQuizResponse[]>>;
  filteredQuestions: IQuestion[];
  setFilteredQuestions: Dispatch<SetStateAction<IQuestion[]>>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { loading, categories } = useCategories();
  const { user, isLoaded } = useUser();

  const [quizSetup, setQuizSetup] = useState<IQuizSetup>({
    questionCount: 1,
    category: null,
    difficulty: null,
  });

  const [selectedQuiz, setSelectedQuiz] = useState<IQuiz | null>(null);
  const [quizResponses, setQuizResponses] = useState<IQuizResponse[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<IQuestion[]>([]);

  useEffect(() => {
    if (!isLoaded || !user?.emailAddresses[0]?.emailAddress) return;

    const registerUser = async () => {
      try {
        await axios.post("/api/user/register");
        console.log("User registered successfully!");
      } catch (error) {
        console.error("Error registering user:", error);
      }
    };

    if (user?.emailAddresses[0]?.emailAddress) {
      registerUser();
    }
  }, [user, isLoaded]);

  console.log("Filtered Questions:", filteredQuestions);

  return (
    <GlobalContext.Provider
      value={{
        loading,
        categories,
        quizSetup,
        setQuizSetup,
        selectedQuiz,
        setSelectedQuiz,
        quizResponses,
        setQuizResponses,
        filteredQuestions,
        setFilteredQuestions,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider",
    );
  }
  return context;
};
