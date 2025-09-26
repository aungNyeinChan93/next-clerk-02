import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { usersTable } from '../schema/user-schema';
import * as schema from '@/drizzle/schema'

const pg = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: pg, schema: { ...schema } });



export async function userSeeder() {
    const newUser = await db.insert(usersTable)
        .values({
            name: "chan",
            email: 'chan@gmail.com',
        })
        .returning({
            id: usersTable.id,
            email: usersTable.email
        });

    console.log(newUser);
};

userSeeder();
