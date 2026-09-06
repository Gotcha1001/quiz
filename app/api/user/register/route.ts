// import { auth } from "@clerk/nextjs/server";
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/src/prisma/db";

// export async function POST(req: NextRequest) {
//   try {
//     const { userId } = await auth();

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // check if the user exists in the db
//     let user = await db.orm.public.User.where({ clerkId: userId }).first();

//     // If user does not exist, create a new user
//     if (!user) {
//       user = await db.orm.public.User.create({
//         clerkId: userId,
//       });
//     } else {
//       return NextResponse.json(
//         { error: "User already exists" },
//         { status: 400 },
//       );
//     }
//     return NextResponse.json(user);
//   } catch (error) {
//     console.log("Error creating user:", error);
//     return NextResponse.json({ error: "Error creating user" }, { status: 500 });
//   }
// }

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/prisma/db";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let user = await db.orm.public.User.where({ clerkId: userId }).first();

    if (!user) {
      user = await db.orm.public.User.create({ clerkId: userId });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.log("Error creating user:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
