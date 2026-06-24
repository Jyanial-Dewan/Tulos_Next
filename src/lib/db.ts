import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const poolConfig = {
  connectionString: process.env.DATABASE_URLL,
  ssl: { rejectUnauthorized: false },
};

export const prisma = new PrismaClient({ adapter: new PrismaPg(poolConfig) });
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}
