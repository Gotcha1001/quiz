"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../context/globalContext";
import { Button } from "@/components/ui/button";
import { play } from "@/utils/icons";

function Page() {
  const router = useRouter();

  const { quizResponses, selectedQuiz } = useGlobalContext();

  const hasNoResponses = !quizResponses || quizResponses.length === 0;

  // Redirect as a side effect, not during render — router.push touches
  // browser APIs (location) that don't exist during server/static
  // rendering, which is what caused the build-time crash.
  useEffect(() => {
    if (hasNoResponses) {
      router.push("/");
    }
  }, [hasNoResponses, router]);

  if (hasNoResponses) {
    return null; // render nothing while the redirect effect runs
  }

  // calculate the score
  const correctAnswers = quizResponses.filter(
    (res: { isCorrect: boolean }) => res.isCorrect,
  ).length;

  const totalQuestions = quizResponses.length;
  const scorePercentage = (correctAnswers / totalQuestions) * 100;

  // show message for the score
  let message = "";

  if (scorePercentage < 25) {
    message = "You need to try harder!";
  } else if (scorePercentage >= 25 && scorePercentage < 50) {
    message = "Your getting there! Keep practicing!";
  } else if (scorePercentage >= 50 && scorePercentage < 75) {
    message = "Great job!";
  } else if (scorePercentage >= 75 && scorePercentage <= 100) {
    message = "Excellent work!";
  } else if (scorePercentage === 100) {
    message = "Perfect score! You're a genius!";
  }

  return (
    <div className="py-20 flex flex-col gap-4">
      <h1 className="text-4xl font-bold text-center">Quiz Results</h1>
      <p className="text-2xl text-center mt-4 font-semibold">
        You scored <span className="font-bold">{correctAnswers}</span> out of{" "}
        <span className="font-bold">{totalQuestions}</span>
      </p>
      <span className="text-blue-400 font-bold text-center text-4xl mt-2">
        {scorePercentage.toFixed()}%
      </span>

      <p className="text-2xl text-center mt-2 font-semibold">{message}</p>

      <div className="flex justify-center mt-8">
        <Button
          variant="green"
          className="px-10 py-6 font-bold text-white text-xl rounded-xl"
          onClick={() => router.push("/quiz/setup/" + `${selectedQuiz?.id}`)}
        >
          {play} Play Again
        </Button>
      </div>
    </div>
  );
}

export default Page;
