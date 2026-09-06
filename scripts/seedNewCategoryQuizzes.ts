// scripts/seedNewCategoryQuizzes.ts
import { db } from "../src/prisma/db";
import technologyQuestions from "../data/technologyQuestions.js";
import mathematicsQuestions from "../data/mathematicsQuestions.js";
import historyQuestions from "../data/historyQuestions.js";
import artQuestions from "../data/artQuestions.js";
import geographyQuestions from "../data/geographyQuestions.js";

const NEW_QUIZZES = [
  {
    title: "Technology Essentials",
    description: "Dive into the latest technological advancements.",
    categoryName: "Technology",
    questions: technologyQuestions,
  },
  {
    title: "Mathematics Fundamentals",
    description: "Master the language of numbers and patterns.",
    categoryName: "Mathematics",
    questions: mathematicsQuestions,
  },
  {
    title: "World History",
    description: "Discover the events that shaped our world.",
    categoryName: "History",
    questions: historyQuestions,
  },
  {
    title: "Art Through the Ages",
    description: "Appreciate creativity through various forms of art.",
    categoryName: "Art",
    questions: artQuestions,
  },
  {
    title: "World Geography",
    description: "Explore the physical features of our planet.",
    categoryName: "Geography",
    questions: geographyQuestions,
  },
];

async function seedNewCategoryQuizzes() {
  const categories = await db.orm.public.Category.all();
  const byName = new Map(categories.map((c) => [c.name, c.id]));

  for (const entry of NEW_QUIZZES) {
    const categoryId = byName.get(entry.categoryName);
    if (!categoryId) {
      console.warn(
        `No category named "${entry.categoryName}" found — skipping "${entry.title}"`,
      );
      continue;
    }

    // Idempotency: skip if a quiz with this title already exists
    let quiz = await db.orm.public.Quiz.where({ title: entry.title }).first();

    if (!quiz) {
      quiz = await db.orm.public.Quiz.create({
        title: entry.title,
        description: entry.description,
        categoryId,
      });
      console.log(`Created quiz "${quiz.title}" (${quiz.id})`);
    } else {
      console.log(`Quiz "${quiz.title}" already exists (${quiz.id})`);
    }

    const existingQuestions = await db.orm.public.Question.where({
      quizId: quiz.id,
    }).all();

    if (existingQuestions.length > 0) {
      console.log(
        `  -> already has ${existingQuestions.length} question(s), skipping question seed`,
      );
      continue;
    }

    for (const question of entry.questions) {
      const created = await db.orm.public.Question.create({
        text: question.text,
        quizId: quiz.id,
        difficulty: question.difficulty,
        options: (opts: any) => opts.create(question.options),
      });
      console.log(`  -> created question: ${created.text}`);
    }
  }

  console.log("Done.");
}

seedNewCategoryQuizzes()
  .catch((e) => console.error("Error seeding new category quizzes:", e))
  .finally(async () => await db.close());
