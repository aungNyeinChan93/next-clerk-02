import { clerkClient, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';


const isPublicRoutes = createRouteMatcher([
    '/', '/register(.*)', '/login(.*)', '/api/webhook/register',
])

const isAdminOnlyRoutes = createRouteMatcher(['/admin-dashboard(.*)'])


export default clerkMiddleware(async (auth, req) => {

    const { isAuthenticated, has, userId } = await auth();

    const client = await clerkClient();

    const user = userId && isAuthenticated && await client.users.getUser(userId as string);

    if (!isPublicRoutes(req) && !isAuthenticated) await auth.protect();

    if (isAuthenticated && isPublicRoutes(req)) {
        return NextResponse.rewrite(new URL('/', req.nextUrl))
    }

    if (isAdminOnlyRoutes(req) && user && user?.publicMetadata?.role !== 'admin') {
        return NextResponse.rewrite(new URL('/', req.nextUrl))
    }

});



export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};