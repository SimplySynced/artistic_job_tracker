import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const unprotectedRoutes = ["/auth/login", "/auth/signup", "/auth/signout"];
    const isUnprotectedRoute = unprotectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

    if (!token && !isUnprotectedRoute) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next|favicon.ico).*)"],
};
