import { db } from "@/drizzle/drizzle";
import { todosTable } from "@/drizzle/schema";
import { auth } from "@clerk/nextjs/server"
import { eq, ilike } from "drizzle-orm";
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

        const user = await db.query.usersTable.findFirst({
            columns: { id: true },
            where: (table, fns) => fns.eq(table.clerk_id, userId),
        })

        const body: Todo = await request.json();

        const newTodo = user && await db.insert(todosTable).values({
            author_id: user?.id,
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

// GET ALLTODOS BY USER
export async function GET(request: NextRequest) {
    try {
        const search = new URL(request.nextUrl).searchParams.get('search') as string || '';
        const limit = new URL(request.nextUrl).searchParams.get('limit') as string || '10';
        const page = new URL(request.nextUrl).searchParams.get('page') as string || '1';
        const skip = (Number(page) - 1) * Number(limit) as number;

        const { userId } = await auth();
        const user = userId && await db.query.usersTable.findFirst({
            where: (table, fns) => fns.eq(table.clerk_id, userId),
            columns: { id: true },
            with: {
                todos: {
                    where: (table, { ilike }) => (
                        search ? ilike(table.task, `%${search}%`) : undefined
                    ),
                }
            }
        });

        if (!user) {
            throw new Error('User not found!')
        }

        let todos;
        if (!search) {
            todos = user && await db.query.todosTable.findMany({
                where: eq(todosTable.author_id, user.id),
                limit: Number(limit),
                offset: skip,
            });
        } else {
            todos = user && await db.query.todosTable.findMany({
                where: (table, { eq, and, ilike }) => and(eq(table.author_id, user.id), ilike(table.task, `%${search}%`)),
                limit: Number(limit),
                offset: skip,
            })
        }

        const totalTodos = todos && Number(todos?.length);
        const totalPages = totalTodos && Math.ceil((totalTodos as number / Number(limit)))

        return NextResponse.json({ todos, totalTodos, totalPages, currentPage: Number(page), user }, { status: 200 })
    } catch (error) {
        console.error(error instanceof Error ? error?.message : 'todo fail ')
        return NextResponse.json({
            error: error instanceof Error ? error?.message : 'todo fail '
        }, { status: 400 })
    }

}