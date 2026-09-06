// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { auth } from "@clerk/nextjs/server";
// import prisma from "@/utils/connect";
// import { IQuiz } from "@/types/types";
// import QuizCard from "@/app/components/quiz/QuizCard";
// import { aj } from "@/lib/arcjet";
// import { request } from "@arcjet/next";
// import Countdown from "@/app/components/Countdown";

// // Pulled out of the component so the impure Date.now() call doesn't
// // happen inside "render" — this is a plain utility function.
// function getSecondsUntil(resetTime: Date): number {
//   const currentTime = Date.now();
//   const resetTimestamp = new Date(resetTime).getTime();
//   return Math.max(Math.ceil((resetTimestamp - currentTime) / 1000), 0);
// }

// async function Page({ params }: any) {
//   const { categoryId } = await params;
//   if (!categoryId) {
//     return null;
//   }

//   const { userId } = await auth();
//   const req = await request();

//   const decision = await aj.protect(req, {
//     userId: userId ?? "",
//     requested: 5,
//   });

//   if (decision.reason.isRateLimit()) {
//     const resetTime = decision.reason?.resetTime;

//     if (!resetTime) {
//       return (
//         <div className="flex flex-col items-center gap-2">
//           <h1 className="text-4xl font-bold text-center text-red-400">
//             Rate limit exceeded
//           </h1>
//           <p>You have exceeded the rate limit for this request.</p>
//         </div>
//       );
//     }

//     const timeLeft = getSecondsUntil(resetTime);

//     return (
//       <div className="flex flex-col items-center gap-2">
//         <h1 className="text-4xl font-bold text-center text-red-400">
//           Too many request...🤪
//         </h1>
//         <p>You have exceeded the rate limit for this request</p>
//         <Countdown initialTimeleft={timeLeft} />
//       </div>
//     );
//   }

//   if (decision.isDenied()) {
//     return (
//       <div className="flex flex-col items-center gap-2">
//         <h1 className="text-4xl font-bold text-center text-red-400">
//           Access denied
//         </h1>
//         <p>This request could not be completed. Please try again later.</p>
//       </div>
//     );
//   }

//   const category = await prisma.orm.public.Category.where({
//     id: categoryId,
//   }).first();

//   const quizzes = await prisma.orm.public.Quiz.where({ categoryId })
//     .orderBy((q) => q.id.asc())
//     .include("questions", (question) =>
//       question
//         .select("id", "text", "difficulty")
//         .include("options", (option) =>
//           option.select("id", "text", "isCorrect"),
//         ),
//     )
//     .all();

//   const quizzesWithCategory = quizzes.map((quiz) => ({
//     ...quiz,
//     categoryName: category?.name,
//   }));

//   return (
//     <div>
//       <h1 className="mb-6 text-4xl font-bold">All Quizzes</h1>
//       {quizzesWithCategory.length > 0 ? (
//         <div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6">
//           {quizzesWithCategory.map((quiz: IQuiz) => (
//             <QuizCard key={quiz.id} quiz={quiz} />
//           ))}
//         </div>
//       ) : (
//         <h1 className="text-2xl text-center mt-4">
//           No quizzes found for this Category
//         </h1>
//       )}
//     </div>
//   );
// }

// export default Page;

// app/categories/[categoryId]/page.tsx
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { auth } from "@clerk/nextjs/server";
// import prisma from "@/utils/connect";
// import { IQuiz } from "@/types/types";
// import QuizCard from "@/app/components/quiz/QuizCard";
// import { aj } from "@/lib/arcjet";
// import { request } from "@arcjet/next";
// import Countdown from "@/app/components/Countdown";

// async function Page({ params }: any) {
//   const { categoryId } = await params;
//   if (!categoryId) {
//     return null;
//   }

//   const { userId } = await auth();
//   const req = await request();

//   const decision = await aj.protect(req, {
//     userId: userId ?? "",
//     requested: 5,
//   });

//   console.log("Arcjet decision:", JSON.stringify(decision, null, 2));

//   if (decision.reason.isRateLimit()) {
//     // `reset` is the number of seconds until the bucket's next refill tick —
//     // no need to derive it from remaining/refillRate math, and it stays
//     // correct automatically if the rule's numbers ever change.
//     const timeLeft = (decision.reason as any).reset ?? 10;

//     return (
//       <div className="flex flex-col items-center gap-2">
//         <h1 className="text-4xl font-bold text-center text-red-400">
//           Too many request...🤪
//         </h1>
//         <p>You have exceeded the rate limit for this request</p>
//         <Countdown initialTimeleft={timeLeft} />
//       </div>
//     );
//   }

//   if (decision.isDenied()) {
//     return (
//       <div className="flex flex-col items-center gap-2">
//         <h1 className="text-4xl font-bold text-center text-red-400">
//           Access denied
//         </h1>
//         <p>This request could not be completed. Please try again later.</p>
//       </div>
//     );
//   }

//   const category = await prisma.orm.public.Category.where({
//     id: categoryId,
//   }).first();

//   const quizzes = await prisma.orm.public.Quiz.where({ categoryId })
//     .orderBy((q) => q.id.asc())
//     .include("questions", (question) =>
//       question
//         .select("id", "text", "difficulty")
//         .include("options", (option) =>
//           option.select("id", "text", "isCorrect"),
//         ),
//     )
//     .all();

//   const quizzesWithCategory = quizzes.map((quiz) => ({
//     ...quiz,
//     categoryName: category?.name,
//   }));

//   return (
//     <div>
//       <h1 className="mb-6 text-4xl font-bold">All Quizzes</h1>
//       {quizzesWithCategory.length > 0 ? (
//         <div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6">
//           {quizzesWithCategory.map((quiz: IQuiz) => (
//             <QuizCard key={quiz.id} quiz={quiz} />
//           ))}
//         </div>
//       ) : (
//         <h1 className="text-2xl text-center mt-4">
//           No quizzes found for this Category
//         </h1>
//       )}
//     </div>
//   );
// }

// export default Page;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@clerk/nextjs/server";
import prisma from "@/utils/connect";
import { IQuiz } from "@/types/types";
import QuizCard from "@/app/components/quiz/QuizCard";

async function Page({ params }: any) {
  const { categoryId } = await params;
  if (!categoryId) {
    return null;
  }

  const { userId } = await auth();

  const category = await prisma.orm.public.Category.where({
    id: categoryId,
  }).first();

  const quizzes = await prisma.orm.public.Quiz.where({ categoryId })
    .orderBy((q) => q.id.asc())
    .include("questions", (question) =>
      question
        .select("id", "text", "difficulty")
        .include("options", (option) =>
          option.select("id", "text", "isCorrect"),
        ),
    )
    .all();

  const quizzesWithCategory = quizzes.map((quiz) => ({
    ...quiz,
    categoryName: category?.name,
  }));

  return (
    <div>
      <h1 className="mb-6 text-4xl font-bold">All Quizzes</h1>
      {quizzesWithCategory.length > 0 ? (
        <div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6">
          {quizzesWithCategory.map((quiz: IQuiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      ) : (
        <h1 className="text-2xl text-center mt-4">
          No quizzes found for this Category
        </h1>
      )}
    </div>
  );
}

export default Page;
