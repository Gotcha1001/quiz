import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/prisma/db";
import "temporal-polyfill/global";

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  const { categoryId } = await req.json();

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await db.orm.public.User.where({ clerkId }).first();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user.id;

    let stat = await db.orm.public.CategoryStat.where({
      userId,
      categoryId,
    }).first();

    if (!stat) {
      stat = await db.orm.public.CategoryStat.create({
        userId,
        categoryId,
        attempts: 1,
        lastAttempt: Temporal.Now.instant(),
      });
    } else {
      stat = await db.orm.public.CategoryStat.where({
        userId,
        categoryId,
      }).update({
        attempts: stat.attempts + 1,
        lastAttempt: Temporal.Now.instant(),
      });
    }

    return NextResponse.json(stat);
  } catch (error) {
    console.log("Error starting quiz:", error);
    return NextResponse.json({ error: "Error starting quiz" }, { status: 500 });
  }
}
