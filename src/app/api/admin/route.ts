import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server";


export async function isAdmin(userId: string) {
    const clerk = await clerkClient();
    const { role } = (await clerk.users?.getUser(userId)).publicMetadata
    return role === 'admin' ? true : false
};


export async function GET() {
    const res = await isAdmin((await auth()).userId as string)
    return NextResponse.json({
        isAdmin: res ? 'isAdmin' : 'not'
    })
}