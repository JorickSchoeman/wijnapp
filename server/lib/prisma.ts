import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the SQLite database path
const dbPath = path.join(__dirname, '../prisma/dev.db');

// Create the Prisma adapter for better-sqlite3
const adapter = new PrismaBetterSqlite3({
  url: `file:${dbPath}`,
});

// Initialize and export the singleton PrismaClient instance
export const prisma = new PrismaClient({ adapter });
