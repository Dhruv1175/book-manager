import {NextRequest, NextResponse} from "next/server";
import User from "@/lib/models/User";
import dbConnect from "@/lib/db";
import {comparePasswords,signToken} from "@/lib/auth";

export async function POST(req: NextRequest) {
    try{
        const {email, password} = await req.json();
        if(!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }
        await dbConnect();
        const user = await User.findOne({ email: email.toLowerCase() });
        if(!user) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }
        const isPasswordValid = await comparePasswords(password, user.password);
        if(!isPasswordValid) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }
        const token = await signToken({ userId: user._id.toString(), email: user.email });
        const sendUser = user.toObject();
        delete sendUser.password;
        const response = NextResponse.json({ message: "Login successful", user: sendUser }, { status: 200 });
        response.cookies.set("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/" , maxAge: 60 * 60 * 2 });
        return response;
        
    }catch(err){
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}