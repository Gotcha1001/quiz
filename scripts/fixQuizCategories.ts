// scripts/fixQuizCategories.ts
import { db } from "../src/prisma/db";

const FIXES: Record<string, string> = {
  Physics: "3114b17a-2dec-4f45-9b25-a03e418409d0",
  Biology: "04e01585-5310-4ad8-b165-eb6d88b6ff16",
};

async function fixQuizCategories() {
  for (const [quizTitle, categoryId] of Object.entries(FIXES)) {
    const quiz = await db.orm.public.Quiz.where({ title: quizTitle }).first();
    if (!quiz) {
      console.warn(`No quiz titled "${quizTitle}" found — skipping`);
      continue;
    }
    if (quiz.categoryId === categoryId) {
      console.log(`"${quizTitle}" already correct`);
      continue;
    }
    await db.orm.public.Quiz.where({ id: quiz.id }).update({ categoryId });
    console.log(`Fixed "${quizTitle}" -> ${categoryId}`);
  }
  console.log("Done.");
}

fixQuizCategories()
  .catch((e) => console.error("Error:", e))
  .finally(async () => await db.close());
