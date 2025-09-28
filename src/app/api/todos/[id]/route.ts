import { db } from "@/drizzle/drizzle";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!id) {
            throw new Error('Todo id is not found!')
        };

        const todo = id && await db.query.todosTable.findFirst({
            where: (table, { eq }) => eq(table.id, id),
            columns: { author_id: true, task: true, isCompleted: true },
            with: {
                user: {
                    columns: { clerk_id: true, name: true }
                }
            }
        })

        return NextResponse.json({ todo })
    } catch (error) {
        console.error(error instanceof Error ? error?.message : ' fail ')
        return NextResponse.json({
            error: error instanceof Error ? error?.message : ' fail '
        }, { status: 400 })
    }
}