// app/utils/cookies.js
import { parse } from "cookie";

export function getCookie(name, req = null) {
    let cookies = '';

    if (typeof window !== 'undefined') {
        // Client-side: Read cookies from document.cookie
        cookies = document.cookie;
    } else if (req && req.headers.cookie) {
        // Server-side: Read cookies from the request headers
        cookies = req.headers.cookie;
    }

    if (cookies) {
        const parsedCookies = parse(cookies);
        return parsedCookies[name] || null;
    }

    return null;
}
