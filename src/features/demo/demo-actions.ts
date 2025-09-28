'use server'

import { auth, clerkClient } from "@clerk/nextjs/server"


export async function clerkTestDemo() {
    const { userId } = await auth();
    return userId;
};


export const clerkClientDemo = async () => {
    const clerk = await clerkClient();
    const [totaluser, userDetail] = await Promise.all([
        clerk.users?.getCount(),
        clerk.users?.getUser((await auth()).userId! as string)
    ])
    return { totaluser, userDetail }
}
