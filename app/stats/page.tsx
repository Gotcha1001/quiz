import "temporal-polyfill/global";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/src/prisma/db";
import UserStats from "../components/UserStats";

interface CategoryStatWithCategory {
  id: string;
  attempts: number;
  averageScore: number | null;
  categoryId: string;
  completed: number;
  lastAttempt: Temporal.Instant | null;
  userId: string;
  category: {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
  };
}

async function Page() {
  const { userId } = await auth();

  if (!userId) {
    return <div>You need to be logged in to view this page</div>;
  }

  const user = await db.orm.public.User.where({ clerkId: userId })
    .include("categoryStats", (cs) =>
      cs
        .select(
          "id",
          "attempts",
          "averageScore",
          "categoryId",
          "completed",
          "lastAttempt",
          "userId",
        )
        .include("category"),
    )
    .first();

  if (!user) {
    return <div>User not found</div>;
  }

  const serializedUser = {
    ...user,
    categoryStats: user.categoryStats.map((stat) => ({
      ...stat,
      lastAttempt: stat.lastAttempt?.toString() ?? null, // handle the null case
    })),
  };

  return (
    <div>
      <UserStats userStats={serializedUser} />
    </div>
  );
}

export default Page;
