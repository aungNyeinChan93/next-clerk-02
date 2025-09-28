import { db } from "@/drizzle/drizzle";
import { usersTable } from "@/drizzle/schema";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


// One Month subscription
export async function POST(request: NextRequest) {
    try {
        const { userId, isAuthenticated } = await auth();

        if (!isAuthenticated) {
            throw new Error("Subscription service is for authenticate user only");
        };

        if (!userId) {
            throw new Error("User ID is required for subscription update.");
        };

        let subscriptionEnd = new Date();
        subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1)

        const updateId = await db.update(usersTable)
            .set({ isSubscribed: true, subscriptionEnd })
            .where(eq(usersTable.clerk_id, userId as string))
            .returning({
                id: usersTable.id
            });

        return NextResponse.json({
            message: `user <${updateId && updateId[0]?.id as string}> : subscription update success!`
        })


    } catch (error) {
        console.error(error instanceof Error ? error?.message : 'subscription error')
        return NextResponse.json({
            error: error instanceof Error ? error?.message : 'subscription error'
        }, { status: 400 })
    }

};


// Subscription  Detail
export async function GET(requset: NextRequest) {
    try {
        const { userId, isAuthenticated } = await auth()

        if (!userId || !isAuthenticated) {
            throw new Error('User is not authenticate')
        };

        const [userData] = await db.query.usersTable.findMany({
            columns: { name: true, email: true, isSubscribed: true, subscriptionEnd: true },
            orderBy: desc(usersTable.id),
            where: (table, fns) => fns.eq(table.clerk_id, userId)
        });

        return NextResponse.json({
            userData: { ...userData, subscriptionEnd: userData.subscriptionEnd?.toLocaleDateString() },
            message: 'success'
        })
    } catch (error) {
        console.error(error instanceof Error ? error?.message : 'get subscription fail')
        return NextResponse.json({
            error: error instanceof Error ? error?.message : 'fail'
        }, { status: 400 })
    }
}