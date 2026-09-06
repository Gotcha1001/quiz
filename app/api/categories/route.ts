import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/connect";

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.orm.public.Category.all();
    return NextResponse.json(categories);
  } catch (error) {
    console.log("There was an error getting Categories:", error);
    return NextResponse.json(
      { error: "There was an error getting Categories" },
      {
        status: 500,
      },
    );
  }
}
