"use client";
import { useGlobalContext } from "@/app/context/globalContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { play } from "@/utils/icons";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { IQuestion } from "@/types/types";
import toast from "react-hot-toast";

function Page() {
  const router = useRouter();
  const { quizSetup, setQuizSetup, selectedQuiz, setFilteredQuestions } =
    useGlobalContext();

  useEffect(() => {
    if (!selectedQuiz) {
      router.push("/");
    }
  }, [selectedQuiz, router]);

  useEffect(() => {
    const filteredQuestions =
      selectedQuiz?.questions.filter((q) => {
        return (
          !quizSetup?.difficulty ||
          quizSetup?.difficulty === "unspecified" ||
          q?.difficulty?.toLowerCase() === quizSetup?.difficulty?.toLowerCase()
        );
      }) ?? [];
    setFilteredQuestions(filteredQuestions);
  }, [quizSetup, selectedQuiz]);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    const maxQuestions = selectedQuiz?.questions.length || 1;

    const newCount =
      isNaN(value) || value < 1 ? 1 : Math.min(value, maxQuestions);
    setQuizSetup((prev) => ({ ...prev, questionCount: newCount }));
  };

  const handleDifficultyChange = (difficulty: string | null) => {
    setQuizSetup((prev) => ({ ...prev, difficulty }));

    console.log("Difficulty:", difficulty);
  };

  const startQuiz = async () => {
    const selectedQuestions = selectedQuiz?.questions
      .slice(0, quizSetup?.questionCount)
      .filter((q: IQuestion) => {
        if (!quizSetup?.difficulty || quizSetup.difficulty === "unspecified") {
          return true; // no filter applied
        }
        return (
          q.difficulty?.toLowerCase() === quizSetup.difficulty?.toLowerCase()
        );
      });
    if (selectedQuestions!.length > 0) {
      //update the db for quiz attempt start

      try {
        await axios.post("/api/user/quiz/start", {
          categoryId: selectedQuiz?.categoryId,
          quizId: selectedQuiz?.id,
        });
      } catch (error) {
        console.log("Error starting quiz:", error);
      }

      // push to the quiz page
      router.push("/quiz");
    } else {
      toast.error("No questions found for the selected criteria");
    }
  };

  return (
    <div>
      <div className="py-[6rem] w-[50%] fixed left-1/2 top-[45%] translate-x-[-50%] translate-y-[-50%] p-6 border-2 rounded-xl shadow-[0_.5rem_0_0_rgba(0,0,0,0.1)] mx-auto">
        <h1 className="text-4xl font-bold mb-4">Quiz Setup</h1>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="questionCount">Number of Questions</Label>
            <Input
              type="number"
              min={1}
              id="questionCount"
              value={quizSetup?.questionCount ?? ""}
              onChange={handleQuestionChange}
              max={selectedQuiz?.questions.length}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-lg">
              Category
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Knowledge</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="history">History</SelectItem>
                <SelectItem value="geography">Geography</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="difficulty" className="text-lg">
              Difficulty
            </Label>
            <Select
              defaultValue="unspecified"
              onValueChange={(value) => handleDifficultyChange(value)}
            >
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unspecified">Unspecified</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="w-full py-16 flex items-center justify-center fixed bottom-0 left-0 bg-white border-t-2">
        <Button
          onClick={startQuiz}
          variant={"blue"}
          className="px-10 py-6 font-bold text-white text-xl rounded-xl"
        >
          <span className="flex items-center gap-2">{play} Start</span>
        </Button>
      </div>
    </div>
  );
}

export default Page;
