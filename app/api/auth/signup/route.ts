import {NextRequest, NextResponse} from "next/server";
import User from "@/lib/models/User";
import dbConnect from "@/lib/db";
import {hashPassword,signToken} from "@/lib/auth";

export async function POST(req: NextRequest) {
    try{
        const {name, email, password , avatar } = await req.json();
        if(!name || !email || !password) {
            return NextResponse.json({ message: "Name, email and password are required" }, { status: 400 });
        }
        if(password.length < 8) {
            return NextResponse.json({ message: "Password must be at least 8 characters long" }, { status: 400 });
        }
        if(avatar && !["openBook","readingLamp","owl","bookMark"].includes(avatar)){
            return NextResponse.json({ message: "Invalid avatar" }, { status: 400 });
        }
        await dbConnect();
        const existingUser = await User.findOne({ email:email.toLowerCase() });
        if(existingUser) {
            return NextResponse.json({ message: "Email already exists" }, { status: 409 });
        }
        const hashedPassword = await hashPassword(password);
        const newUser = new User({ name, email, password: hashedPassword , avatar });
        await newUser.save();
        const sendUser = newUser.toObject();
        delete sendUser.password;
        const token = await signToken({ userId: newUser._id.toString(), email: newUser.email });
        const response = NextResponse.json({ message: "User created successfully" , user: sendUser }, { status: 201 });
        response.cookies.set("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/" , maxAge: 60 * 60 * 2 });
        return response;
    }catch(err){
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}