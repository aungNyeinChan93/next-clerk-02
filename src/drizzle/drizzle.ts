import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/drizzle/schema'

const pg = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: pg, schema: { ...schema } });
