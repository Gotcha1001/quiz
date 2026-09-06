import { db } from "../src/prisma/db";

async function addCategories() {
  const categories = [
    {
      name: "Science",
      description:
        "Science is the pursuit and application of knowledge and understanding of the natural and social world following a systematic methodology based on evidence.",
    },
    {
      name: "Technology",
      description: "Dive into the latest technological advancements.",
    },
    {
      name: "Programming",
      description: "Learn about coding and software development.",
    },
    {
      name: "Computer Science",
      description: "Understand the fundamentals of computers and algorithms.",
    },
    {
      name: "Mathematics",
      description: "Master the language of numbers and patterns.",
    },
    {
      name: "History",
      description: "Discover the events that shaped our world.",
    },
    {
      name: "Art",
      description: "Appreciate creativity through various forms of art.",
    },
    {
      name: "Geography",
      description: "Explore the physical features of our planet.",
    },
    {
      name: "Physics",
      description: "Unravel the laws governing the universe.",
    },
    { name: "Biology", description: "Study the science of living organisms." },
  ];

  console.log("Adding Categories...");

  for (const category of categories) {
    await db.orm.public.Category.create(category);
  }

  console.log("Categories Added Successfully!");
}

addCategories()
  .catch((e) => console.log("Error Adding Categories: ", e))
  .finally(async () => await db.close());
