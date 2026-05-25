import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const dbUrl = new URL(process.env.DATABASE_URL!);

const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.replace(/^\//, ""),
  allowPublicKeyRetrieval: true,
});

const prisma = new PrismaClient({
  adapter,
  log: ["warn", "error"],
});

export { prisma };
