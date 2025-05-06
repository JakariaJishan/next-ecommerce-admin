//middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
    const token = request.cookies.get("token");

    // Authentication check for public routes
    if (token && (request.nextUrl.pathname === "/auth/signin" || request.nextUrl.pathname === "/auth/signup")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Authentication check for protected routes
    if (!token && !["/auth/signin", "/auth/signup"].includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/order/:path*",
        "/categories/:path*",
        "/product/:path*",
        "/admin/:path*",
        "/general/:path*",
        "/auth/signin",
        "/auth/signup",
        "/category/:path*",
        "/subcategory/:path*",
        "/profile/:path*",
    ],
};
