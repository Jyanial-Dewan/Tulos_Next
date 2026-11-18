import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// SSL parameters in the connection string (e.g. `sslmode=require`) are parsed by
// `pg` and override the `ssl` option below. Recent `pg` versions treat
// `sslmode=require` as `verify-full`, which rejects Aiven's self-signed CA with
// "self-signed certificate in certificate chain". Strip them so the explicit
// `ssl` config below is what actually applies.
function buildConnectionString(raw: string | undefined): string | undefined {
  if (!raw) return raw;
  try {
    const url = new URL(raw);
    for (const param of [
      "sslmode",
      "sslcert",
      "sslkey",
      "sslrootcert",
      "uselibpqcompat",
    ]) {
      url.searchParams.delete(param);
    }
    return url.toString();
  } catch {
    return raw;
  }
}

const poolConfig = {
  connectionString: buildConnectionString(process.env.DATABASE_URLL),
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
