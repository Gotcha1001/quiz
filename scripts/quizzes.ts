// import { db } from "../src/prisma/db";

// let quizzesPrisma: any;

// const quizzes = [
//   {
//     title: "Computer Science Basics",
//     description: "A quiz about fundamental computer science concepts.",
//     categoryId: "676482a0a9fd4923c30ff2d7", // Replace with the actual category ID
//   },
//   {
//     title: "Programming Fundamentals",
//     description: "Test your knowledge of basic programming concepts.",
//     categoryId: "6764829fa9fd4923c30ff2d6",
//   },
//   {
//     title: "Data Structures",
//     description: "Assess your understanding of data structures.",
//     categoryId: "676482a0a9fd4923c30ff2d7",
//   },
//   {
//     title: "Physics",
//     description: "Test your knowledge of physics",
//     categoryId: "6764829fa9fd4923c30ff2d4",
//   },
//   {
//     title: "Biology",
//     description: "Test your knowledge of physics",
//     categoryId: "6764829fa9fd4923c30ff2d4",
//   },
//   {
//     title: "Chemistry",
//     description: "Test your knowledge of physics",
//     categoryId: "6764829fa9fd4923c30ff2d4",
//   },
// ];

// async function seedQuizzes() {
//   quizzesPrisma = new PrismaClient();

//   console.log("Seeding quizzes...");

//   for (const quiz of quizzes) {
//     const craetedQuiz = await quizzesPrisma.quiz.create({
//       data: quiz,
//     });

//     console.log("Created quiz: ", `${craetedQuiz.title}`);
//   }

//   console.log("Seeding quizzes completed.");
// }

// seedQuizzes()
//   .catch((e) => {
//     console.log("Error seeding quizzes: ", e);
//   })
//   .finally(async () => {
//     await quizzesPrisma.$disconnect();
//   });

import { db } from "../src/prisma/db";

const quizzes = [
  {
    title: "Computer Science Basics",
    description: "A quiz about fundamental computer science concepts.",
    categoryId: "d1816535-1738-4765-832f-df3e2b38865a", // Replace with the actual category ID
  },
  {
    title: "Programming Fundamentals",
    description: "Test your knowledge of basic programming concepts.",
    categoryId: "387b028a-e6e5-4dac-b7cc-37237026e5ea",
  },
  {
    title: "Data Structures",
    description: "Assess your understanding of data structures.",
    categoryId: "d1816535-1738-4765-832f-df3e2b38865a",
  },
  {
    title: "Physics",
    description: "Test your knowledge of physics",
    categoryId: "bceee2d0-752a-42a8-8c3d-9ab9f1d59e41",
  },
  {
    title: "Biology",
    description: "Test your knowledge of physics",
    categoryId: "bceee2d0-752a-42a8-8c3d-9ab9f1d59e41",
  },
  {
    title: "Chemistry",
    description: "Test your knowledge of physics",
    categoryId: "bceee2d0-752a-42a8-8c3d-9ab9f1d59e41",
  },
];

async function seedQuizzes() {
  console.log("Seeding quizzes...");

  for (const quiz of quizzes) {
    const createdQuiz = await db.orm.public.Quiz.create(quiz);
    console.log("Created quiz: ", createdQuiz.title);
  }

  console.log("Seeding quizzes completed.");
}

seedQuizzes()
  .catch((e) => console.log("Error seeding quizzes: ", e))
  .finally(async () => await db.close());
