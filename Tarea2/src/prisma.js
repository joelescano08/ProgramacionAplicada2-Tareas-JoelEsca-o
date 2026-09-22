import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Configuración del driver adapter para PostgreSQL
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("ADVERTENCIA: No se encontró DATABASE_URL en las variables de entorno.");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
