import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Define unprotected routes
    const unprotectedRoutes = ["/auth/login", "/auth/signup", "/auth/signout"];

    // Check if the current route is unprotected
    const isUnprotectedRoute = unprotectedRoutes.some((route) =>
        req.nextUrl.pathname.startsWith(route)
    );

    // Prevent loop: Allow access to unprotected routes even if not authenticated
    if (isUnprotectedRoute) {
        return NextResponse.next();
    }

    // Redirect unauthenticated users trying to access protected routes
    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Allow authenticated requests
    return NextResponse.next();
}

// Apply middleware to specific routes, excluding static files and API routes
export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|images|fonts|robots.txt|sitemap.xml).*)",
    ],
};
