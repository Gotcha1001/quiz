// import { auth } from "@clerk/nextjs/server";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const { userId: clerkId } = await auth();

//     if (!clerkId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { categoryId, quizId, score, responses } = await req.json();

//     // validate the fields
//     if (!categoryId || !quizId || !score || !Array.isArray(responses)) {
//       return NextResponse.json({ error: "Invalid request" }, { status: 400 });
//     }

//     const user = await prisma.user.findUnique({ where: { clerkId } });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // fetch or create a categoryStat entry
//     let stat = await prisma.categoryStat.findUnique({
//       where: {
//         userId_categoryId: {
//           userId: user.id,
//           categoryId,
//         },
//       },
//     });

//     // if the stat does not exist, create a new one
//     if (stat) {
//       // calculate the average score
//       const totalScore = (stat.averageScore || 0) * stat.completed + score;
//       const newAverageScore = totalScore / (stat.completed + 1);

//       // update the categoryStat entry
//       stat = await prisma.categoryStat.update({
//         where: { id: stat.id },
//         data: {
//           completed: stat.completed + 1,
//           averageScore: newAverageScore,
//           lastAttempt: new Date(),
//         },
//       });
//     } else {
//       // create a new categoryStat entry
//       stat = await prisma.categoryStat.create({
//         data: {
//           userId: user.id,
//           categoryId,
//           attempts: 1,
//           completed: 1,
//           averageScore: score,
//           lastAttempt: new Date(),
//         },
//       });
//     }
//     return NextResponse.json(stat);
//   } catch (error) {
//     console.error("Error finishing quiz:", error);
//     return NextResponse.json(
//       { error: "Error finishing quiz" },
//       { status: 500 },
//     );
//   }
// }

import { db } from "@/src/prisma/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import "temporal-polyfill/global"; // ensure Temporal is available in this route too

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { categoryId, quizId, score, responses } = await req.json();

    if (
      !categoryId ||
      !quizId ||
      score === undefined ||
      score === null ||
      !Array.isArray(responses)
    ) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const user = await db.orm.public.User.where({ clerkId }).first();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const stat = await db.transaction(async (tx) => {
      const existingStat = await tx.orm.public.CategoryStat.where({
        userId: user.id,
        categoryId,
      }).first();

      if (existingStat) {
        const totalScore =
          (existingStat.averageScore || 0) * existingStat.completed + score;
        const newAverageScore = totalScore / (existingStat.completed + 1);

        return tx.orm.public.CategoryStat.where({ id: existingStat.id }).update(
          {
            completed: existingStat.completed + 1,
            averageScore: newAverageScore,
            lastAttempt: Temporal.Now.instant(), // was: new Date()
          },
        );
      }

      return tx.orm.public.CategoryStat.create({
        userId: user.id,
        categoryId,
        attempts: 1,
        completed: 1,
        averageScore: score,
        lastAttempt: Temporal.Now.instant(), // was: new Date()
      });
    });

    return NextResponse.json(stat);
  } catch (error) {
    console.error("Error finishing quiz:", error);
    return NextResponse.json(
      { error: "Error finishing quiz" },
      { status: 500 },
    );
  }
}
