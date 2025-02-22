import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

// Explicitly load environment variables
dotenv.config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL;

console.log(databaseUrl);


if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined in .env.local');
}
const client = postgres(databaseUrl);

export const db = drizzle(client);
