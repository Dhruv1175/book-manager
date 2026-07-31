import {NextRequest, NextResponse} from "next/server";
import {verifyToken} from "@/lib/auth";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "");
    if(!token) {
        return NextResponse.json({success:false , message: "Unauthorized: Missing token" }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if(!payload) {
        return NextResponse.json({success:false, message: "Unauthorized: Invalid token" }, { status: 401 });
    }
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", payload.userId);
    requestHeaders.set("x-user-email", payload.email);
    return NextResponse.next({
        request:{
            headers: requestHeaders
        }
    });
}
export const config = {
    matcher: ["/api/books/:path*","/api/auth/me"],
}