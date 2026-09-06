// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useGlobalContext } from "../context/globalContext";
// import { useRouter } from "next/navigation";
// import { IOption, IQuestion, IResponse } from "@/types/types";
// import { Button } from "@/components/ui/button";
// import { flag, next } from "@/utils/icons";
// import toast from "react-hot-toast";
// import axios from "axios";

// // Generic shuffle — hoisted function declaration, safe to reference anywhere
// function shuffleArray<T>(array: T[]) {
//   const result = [...array];
//   for (let i = result.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [result[i], result[j]] = [result[j], result[i]];
//   }
//   return result;
// }

// function Page() {
//   const {
//     selectedQuiz,
//     quizSetup,
//     setQuizSetup,
//     setQuizResponses,
//     filteredQuestions,
//   } = useGlobalContext();

//   const router = useRouter();

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [activeQuestion, setActiveQuestion] = useState<IOption | null>(null);
//   const [responses, setResponses] = useState<IResponse[]>([]);

//   useEffect(() => {
//     if (!selectedQuiz) {
//       router.push("/");
//     }
//   }, [selectedQuiz, router]);

//   // const filteredQuestions = useMemo(() => {
//   //   if (!selectedQuiz) return [];
//   //   return selectedQuiz.questions
//   //     .filter((q: IQuestion) => {
//   //       return (
//   //         !quizSetup?.difficulty ||
//   //         quizSetup?.difficulty === "unspecified" ||
//   //         q.difficulty === quizSetup?.difficulty
//   //       );
//   //     })
//   //     .slice(0, quizSetup?.questionCount);
//   // }, [selectedQuiz, quizSetup]);

//   const filteredQuestions = useMemo(() => {
//     const allQuestions = filteredQuestions.slice(0, quizSetup?.questionCount);
//     setShuffledOptions(shuffleArray([...allQuestions]));
//   }, [selectedQuiz, quizSetup]);

//   // Lazy initializer: runs exactly once, at mount — the correct place
//   // for a one-time impure computation, no effect needed.
//   const [shuffledQuestions, setShuffledQuestions] = useState<IQuestion[]>(() =>
//     shuffleArray(filteredQuestions),
//   );

//   const [shuffledOptions, setShuffledOptions] = useState<IOption[]>(() =>
//     shuffleArray(shuffledQuestions[0]?.options ?? []),
//   );

//   // Explicit action: called from your "Next question" button/handler
//   const goToQuestion = (index: number) => {
//     const question = shuffledQuestions[index];
//     if (!question) return;
//     setCurrentIndex(index);
//     setShuffledOptions(shuffleArray(question.options));
//     setActiveQuestion(null); // reset selection highlight for the new question
//   };

//   if (!selectedQuiz) {
//     return null;
//   }

//   const handleActiveQuestion = (option: IOption) => {
//     if (!shuffledQuestions[currentIndex]) return;

//     const response = {
//       questionId: shuffledQuestions[currentIndex].id,
//       optionId: option.id,
//       isCorrect: option.isCorrect,
//     };

//     setResponses((prev) => {
//       // check if the response already exists
//       const existingIndex = prev.findIndex((res) => {
//         return res.questionId === response.questionId;
//       });

//       // update the response if it exists

//       if (existingIndex !== -1) {
//         // update response
//         const updatedResponses = [...prev];
//         updatedResponses[existingIndex] = response;
//         return updatedResponses;
//       } else {
//         return [...prev, response];
//       }
//     });

//     // set the active question
//     setActiveQuestion(option);
//   };

//   const handleNextQuestion = () => {
//     console.log(
//       "[handleNextQuestion] currentIndex:",
//       currentIndex,
//       "of",
//       shuffledQuestions.length,
//     );
//     if (currentIndex < shuffledQuestions.length - 1) {
//       setCurrentIndex((prev) => prev + 1);
//       setActiveQuestion(null);
//     } else {
//       console.log("[handleNextQuestion] pushing to /results");
//       router.push("/results");
//     }
//   };

//   const handleFinishQuiz = async () => {
//     console.log("[handleFinishQuiz] called, responses:", responses);
//     setQuizResponses(responses);
//     const score = responses.filter((res) => res.isCorrect).length;
//     console.log("[handleFinishQuiz] score:", score);

//     try {
//       console.log("[handleFinishQuiz] posting to /api/user/quiz/finish");
//       const res = await axios.post("/api/user/quiz/finish", {
//         categoryId: selectedQuiz.categoryId,
//         quizId: selectedQuiz.id,
//         score,
//         responses,
//       });
//       console.log("[handleFinishQuiz] success:", res.data);
//     } catch (error) {
//       console.error("[handleFinishQuiz] axios error:", error);
//     }

//     console.log(
//       "[handleFinishQuiz] resetting quizSetup and pushing to /results",
//     );
//     setQuizSetup({
//       questionCount: 1,
//       category: null,
//       difficulty: null,
//     });
//     router.push("/results");
//     console.log("[handleFinishQuiz] router.push called");
//   };

//   return (
//     <div className="py-[2.5rem]">
//       {shuffledQuestions[currentIndex] ? (
//         <div className="space-y-6">
//           <div className="flex flex-col gap-6">
//             <p className="py-3 px-6 border-2 text-3xl font-bold self-end rounded-lg shadow-[0_.3rem_0_0_rgba(0,0,0,0.2)]">
//               Question: <span className="text-3xl">{currentIndex + 1}</span> /{" "}
//               <span className="text-3xl">{shuffledQuestions.length}</span>
//             </p>
//             <h1 className="mt-4 px-10 text-5xl font-bold text-center">
//               {shuffledQuestions[currentIndex].text}
//             </h1>
//           </div>
//           <div className="pt-14 space-y-4">
//             {shuffledOptions.map((option, index) => (
//               <button
//                 onClick={() => handleActiveQuestion(option)}
//                 key={index}
//                 className={`relative group py-3 w-full text-center border-2 rounded-xl shadow-[0_.3rem_0_0_rgba(0,0,0,0.2)] text-3xl font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_.5rem_0_0_rgba(0,0,0,0.2)] hover:bg-black hover:text-white ${
//                   option.id === activeQuestion?.id
//                     ? "bg-green-100 border-green-500 shadow-[0_.3rem_0_0_#51bf22] hover:bg-green-100 hover:border-green-500"
//                     : "shadow-[0.3rem_0_0_rgba(0,0,0,0.2)]"
//                 }`}
//               >
//                 {option.text}
//               </button>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <p className="text-lg">No questions found for this quiz</p>
//       )}
//       <div className="w-full py-16 bottom-0 left-0 border-t-2 flex items-center justify-center">
//         <Button
//           onClick={() => {
//             if (currentIndex < shuffledQuestions.length - 1) {
//               if (activeQuestion?.id) {
//                 handleNextQuestion();
//               } else {
//                 const sound = new Audio("/sounds/error.mp3");
//                 sound
//                   .play()
//                   .catch((err) => console.error("Sound failed to play:", err));
//                 toast.error("Please select an option to continue");
//               }
//             } else {
//               if (activeQuestion?.id) {
//                 handleFinishQuiz();
//               } else {
//                 const sound = new Audio("/sounds/error.mp3");
//                 sound.play();
//                 toast.error("Please select an option to continue");
//               }
//             }
//           }}
//           variant="green"
//           className="px-10 py-6 font-bold text-white text-xl rounded-xl"
//         >
//           {currentIndex < shuffledQuestions.length - 1 ? (
//             <span className="flex items-center gap-2">{next} Next</span>
//           ) : (
//             <span className="flex items-center gap-2">{flag} Finish</span>
//           )}
//         </Button>
//       </div>
//     </div>
//   );
// }

// export default Page;

"use client";

import { useMemo, useState } from "react";
import { useGlobalContext } from "../context/globalContext";
import { useRouter } from "next/navigation";
import { IOption, IQuestion, IResponse } from "@/types/types";
import { Button } from "@/components/ui/button";
import { flag, next } from "@/utils/icons";
import toast from "react-hot-toast";
import axios from "axios";
import { useEffect } from "react";

// Generic shuffle — hoisted function declaration, safe to reference anywhere
function shuffleArray<T>(array: T[]) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function Page() {
  const {
    selectedQuiz,
    quizSetup,
    setQuizSetup,
    setQuizResponses,
    filteredQuestions,
  } = useGlobalContext();

  const router = useRouter();

  // Redirect away if there's no quiz selected — this IS a legitimate
  // effect: it's a side effect (navigation) reacting to state, not a
  // derivation of state.
  useEffect(() => {
    if (!selectedQuiz) {
      router.push("/");
    }
  }, [selectedQuiz, router]);

  // A key that identifies "this particular run" of the quiz. Whenever it
  // changes, we know we need a fresh shuffle and a reset back to question 0.
  const quizKey = `${selectedQuiz?.id ?? ""}-${quizSetup?.difficulty ?? ""}-${
    quizSetup?.questionCount ?? ""
  }`;

  const [prevQuizKey, setPrevQuizKey] = useState(quizKey);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState<IOption | null>(null);
  const [responses, setResponses] = useState<IResponse[]>([]);

  const [shuffledQuestions, setShuffledQuestions] = useState<IQuestion[]>(() =>
    shuffleArray(filteredQuestions.slice(0, quizSetup?.questionCount)),
  );

  // React-recommended pattern: adjust state *during render* in response to
  // a changed input, rather than in an effect. This runs synchronously as
  // part of this render pass (React re-renders immediately with the new
  // state before committing), so it does NOT cause the cascading-render
  // effect warning.
  if (quizKey !== prevQuizKey) {
    setPrevQuizKey(quizKey);
    setShuffledQuestions(
      shuffleArray(filteredQuestions.slice(0, quizSetup?.questionCount)),
    );
    setCurrentIndex(0);
    setActiveQuestion(null);
  }

  // Purely derived from shuffledQuestions + currentIndex — a textbook
  // useMemo case, no state or effect needed at all.
  const shuffledOptions = useMemo(
    () => shuffleArray(shuffledQuestions[currentIndex]?.options ?? []),
    [shuffledQuestions, currentIndex],
  );

  // Explicit action: called from a "jump to question" UI element, if wired up
  const goToQuestion = (index: number) => {
    if (!shuffledQuestions[index]) return;
    setCurrentIndex(index);
    setActiveQuestion(null); // reset selection highlight for the new question
  };

  if (!selectedQuiz) {
    return null;
  }

  const handleActiveQuestion = (option: IOption) => {
    if (!shuffledQuestions[currentIndex]) return;

    const response = {
      questionId: shuffledQuestions[currentIndex].id,
      optionId: option.id,
      isCorrect: option.isCorrect,
    };

    setResponses((prev) => {
      // check if the response already exists
      const existingIndex = prev.findIndex((res) => {
        return res.questionId === response.questionId;
      });

      // update the response if it exists

      if (existingIndex !== -1) {
        // update response
        const updatedResponses = [...prev];
        updatedResponses[existingIndex] = response;
        return updatedResponses;
      } else {
        return [...prev, response];
      }
    });

    // set the active question
    setActiveQuestion(option);
  };

  const handleNextQuestion = () => {
    console.log(
      "[handleNextQuestion] currentIndex:",
      currentIndex,
      "of",
      shuffledQuestions.length,
    );
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setActiveQuestion(null);
    } else {
      console.log("[handleNextQuestion] pushing to /results");
      router.push("/results");
    }
  };

  const handleFinishQuiz = async () => {
    console.log("[handleFinishQuiz] called, responses:", responses);
    setQuizResponses(responses);
    const score = responses.filter((res) => res.isCorrect).length;
    console.log("[handleFinishQuiz] score:", score);

    try {
      console.log("[handleFinishQuiz] posting to /api/user/quiz/finish");
      const res = await axios.post("/api/user/quiz/finish", {
        categoryId: selectedQuiz.categoryId,
        quizId: selectedQuiz.id,
        score,
        responses,
      });
      console.log("[handleFinishQuiz] success:", res.data);
    } catch (error) {
      console.error("[handleFinishQuiz] axios error:", error);
    }

    console.log(
      "[handleFinishQuiz] resetting quizSetup and pushing to /results",
    );
    setQuizSetup({
      questionCount: 1,
      category: null,
      difficulty: null,
    });
    router.push("/results");
    console.log("[handleFinishQuiz] router.push called");
  };

  return (
    <div className="py-[2.5rem]">
      {shuffledQuestions[currentIndex] ? (
        <div className="space-y-6">
          <div className="flex flex-col gap-6">
            <p className="py-3 px-6 border-2 text-3xl font-bold self-end rounded-lg shadow-[0_.3rem_0_0_rgba(0,0,0,0.2)]">
              Question: <span className="text-3xl">{currentIndex + 1}</span> /{" "}
              <span className="text-3xl">{shuffledQuestions.length}</span>
            </p>
            <h1 className="mt-4 px-10 text-5xl font-bold text-center">
              {shuffledQuestions[currentIndex].text}
            </h1>
          </div>
          <div className="pt-14 space-y-4">
            {shuffledOptions.map((option, index) => (
              <button
                onClick={() => handleActiveQuestion(option)}
                key={index}
                className={`relative group py-3 w-full text-center border-2 rounded-xl shadow-[0_.3rem_0_0_rgba(0,0,0,0.2)] text-3xl font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_.5rem_0_0_rgba(0,0,0,0.2)] hover:bg-black hover:text-white ${
                  option.id === activeQuestion?.id
                    ? "bg-green-100 border-green-500 shadow-[0_.3rem_0_0_#51bf22] hover:bg-green-100 hover:border-green-500"
                    : "shadow-[0.3rem_0_0_rgba(0,0,0,0.2)]"
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-lg">No questions found for this quiz</p>
      )}
      <div className="w-full py-16 bottom-0 left-0 border-t-2 flex items-center justify-center">
        <Button
          onClick={() => {
            if (currentIndex < shuffledQuestions.length - 1) {
              if (activeQuestion?.id) {
                handleNextQuestion();
              } else {
                const sound = new Audio("/sounds/error.mp3");
                sound
                  .play()
                  .catch((err) => console.error("Sound failed to play:", err));
                toast.error("Please select an option to continue");
              }
            } else {
              if (activeQuestion?.id) {
                handleFinishQuiz();
              } else {
                const sound = new Audio("/sounds/error.mp3");
                sound.play();
                toast.error("Please select an option to continue");
              }
            }
          }}
          variant="green"
          className="px-10 py-6 font-bold text-white text-xl rounded-xl"
        >
          {currentIndex < shuffledQuestions.length - 1 ? (
            <span className="flex items-center gap-2">{next} Next</span>
          ) : (
            <span className="flex items-center gap-2">{flag} Finish</span>
          )}
        </Button>
      </div>
    </div>
  );
}

export default Page;
