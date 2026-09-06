import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/prisma/db";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //find the user in the db
    const user = await db.orm.public.User.where({ clerkId: userId }).first();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.log("Error getting the user:", error);
    return NextResponse.json(
      { error: "Error getting the user" },
      { status: 500 },
    );
  }
}
