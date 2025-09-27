import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/drizzle/drizzle";
import { usersTable } from "@/drizzle/schema";


export async function POST(request: NextRequest) {
    try {
        const wh_secret = process.env.CLERK_WEBHOOK_SECRET! || ''
        if (!wh_secret) throw new Error('please check webhook secret in env file!');


        const nextHeader = await headers();
        const svix_id = nextHeader.get('svix-id');
        const svix_timestamp = nextHeader.get('svix-timestamp');
        const svix_signature = nextHeader.get('svix-signature');
        if (!svix_id || !svix_signature || !svix_timestamp) {
            throw new Error('some svix-header necessary in header payload!')
        };

        const payload = await request.json();
        const wh = new Webhook(wh_secret);
        const evt: WebhookEvent = payload && wh.verify(JSON.stringify(payload), {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });

        if (!evt) throw new Error('Webhook event is missing!')

        const evt_type = evt.type;

        if (evt_type !== 'user.created') {
            throw new Error('This Webhook event must be user.creaded.Something was wrong, please check again!!!')
        };

        const { email_addresses, id, username } = evt.data;

        const isUserExist = !!(await db.query.usersTable.findFirst({
            where: (table, fns) => fns.eq(table.email, email_addresses[0].email_address as string)
        }));

        if (isUserExist) {
            throw new Error('User is already exist in register!')
        };

        const newUser = await db.insert(usersTable).values({
            clerk_id: id,
            email: email_addresses[0].email_address as string,
            name: username ?? '',
        }).returning({
            id: usersTable?.id,
            email: usersTable?.email
        });

        return new NextResponse(JSON.stringify(newUser), { status: 200 })

    } catch (error) {
        console.error(error instanceof Error ? error?.message : 'some error');
        return NextResponse.json({
            error: error instanceof Error ? error?.message : 'unknow error!'
        }, { status: 400 })
    }
}