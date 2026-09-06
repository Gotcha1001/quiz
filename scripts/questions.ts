// import { db } from "../src/prisma/db";
// import questions from "../data/programmingQuestions";

// async function seedQuestions() {
//   console.log("Seeding questions...");

//   for (const question of questions) {
//     const createdQuestion = await db.orm.public.Question.create({
//       text: question.text,
//       quizId: "16b3af20-9106-448c-8b81-ac72f5e73fd2", // Replace with the actual quiz ID
//       difficulty: question.difficulty,
//       options: (opts) => opts.create(question.options),
//     });

//     console.log(`Created question: ${createdQuestion.text}`);
//   }

//   console.log("Seeding questions completed.");
// }

// seedQuestions()
//   .catch((e) => console.log("Error seeding questions: ", e))
//   .finally(async () => await db.close());

// scripts/questions.ts
import { db } from "../src/prisma/db";

// ────────────────────────────────────────────────────────────
// CHANGE THESE TWO LINES EACH TIME YOU RUN THIS SCRIPT
import questions from "../data/chemistryQuestions.js";
const QUIZ_ID = "b3b5e106-bbb5-4f48-9288-134a1f2eb835"; // <-- paste the FULL id from your table, not the truncated one shown in the UI
// ────────────────────────────────────────────────────────────

async function seedQuestions() {
  console.log(`Seeding questions into quiz ${QUIZ_ID}...`);

  // 1. Make sure the quiz actually exists before writing anything.
  const quiz = await db.orm.public.Quiz.where({ id: QUIZ_ID }).first();
  if (!quiz) {
    throw new Error(
      `No quiz found with id "${QUIZ_ID}". Copy the FULL id from your DB table — the grid view truncates it with "..."`,
    );
  }
  console.log(`Found quiz: "${quiz.title}"`);

  // 2. Guard against re-running this script twice for the same quiz,
  //    which would silently duplicate every question.
  const existing = await db.orm.public.Question.where({
    quizId: QUIZ_ID,
  }).all();
  if (existing.length > 0) {
    throw new Error(
      `Quiz "${quiz.title}" already has ${existing.length} question(s). ` +
        `Refusing to seed again to avoid duplicates. Delete them first if you want to reseed.`,
    );
  }

  // 3. Actually seed.
  for (const question of questions) {
    const createdQuestion = await db.orm.public.Question.create({
      text: question.text,
      quizId: QUIZ_ID,
      difficulty: question.difficulty,
      options: (opts) => opts.create(question.options),
    });
    console.log(`Created question: ${createdQuestion.text}`);
  }

  console.log(
    `Seeding completed: ${questions.length} question(s) added to "${quiz.title}".`,
  );
}

seedQuestions()
  .catch((e) => {
    console.error("Error seeding questions:", e.message ?? e);
    process.exitCode = 1;
  })
  .finally(async () => await db.close());
