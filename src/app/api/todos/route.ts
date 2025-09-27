import { db } from "@/drizzle/drizzle";
import { todosTable } from "@/drizzle/schema";
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


interface Todo {
    id?: string | number;
    task?: string;
    author_id?: string | number;
    isCompleted?: boolean
}

// create todos
export async function POST(request: NextRequest) {
    try {
        const { userId, isAuthenticated } = await auth();


        if (!userId || !isAuthenticated) {
            throw new Error('user is not authenticated')
        };

        const author_id = await db.query.usersTable.findFirst({
            columns: { id: true },
            where: (table, fns) => fns.eq(table.clerk_id, userId)
        })

        const body: Todo = await request.json();

        const newTodo = await db.insert(todosTable).values({
            author_id: author_id?.id!,
            task: body?.task as string,
        });

        return NextResponse.json({ newTodo }, { status: 201 })

    } catch (error) {
        console.error(error instanceof Error ? error?.message : 'todo create fail ')
        return NextResponse.json({
            error: error instanceof Error ? error?.message : 'todo create fail '
        }, { status: 400 })
    }
};



export async function GET() {
    try {
        const { userId } = await auth();

        const user = userId && await db.query.usersTable.findFirst({
            where: (table, fns) => fns.eq(table.clerk_id, userId),
            columns: { id: true }
        });


        const todo = user && await db.query.todosTable.findFirst({
            where: eq(todosTable.author_id, user.id),
        });

        return NextResponse.json({ todo }, { status: 200 })
    } catch (error) {
        console.error(error instanceof Error ? error?.message : 'todo fail ')
        return NextResponse.json({
            error: error instanceof Error ? error?.message : 'todo fail '
        }, { status: 400 })
    }

}