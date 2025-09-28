import { db } from "@/drizzle/drizzle"

export const getUserDetail = async (id: string) => {
    const user = id && await db.query.usersTable.findFirst({
        where: (table, { eq }) => eq(table.clerk_id, id),
        with: {
            todos: true
        }
    })
    return user
};


export const getAllUsers = async () => {
    const users = await db.query.usersTable.findMany({
        columns: { name: true, email: true },
    })
    return users
}