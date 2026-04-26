// 앱에서 DB에 접근할 때 쓰는 공용 연결 파일

import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/prisma/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
}; // prisma 저장 전역 객체

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
}); // SQLite 어댑터

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
} // prisma 생성 or 재사용