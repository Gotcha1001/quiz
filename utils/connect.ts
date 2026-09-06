// import { PrismaClient } from "@prisma/client";

// let prisma: PrismaClient;

// if (process.env.NODE_ENV === "production") {
//   prisma = new PrismaClient();
// } else {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }

//   prisma = global.prisma;
// }

// export default prisma;

import { db as dbClient } from "../src/prisma/db"; // adjust path to your actual db.ts location

declare global {
  // eslint-disable-next-line no-var
  var db: typeof dbClient | undefined;
}

let db: typeof dbClient;

if (process.env.NODE_ENV === "production") {
  db = dbClient;
} else {
  if (!global.db) {
    global.db = dbClient;
  }

  db = global.db;
}

export default db;
