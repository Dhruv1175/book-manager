import {NextRequest, NextResponse} from "next/server";
import User from "@/lib/models/User";
import dbConnect from "@/lib/db";
import {publicUser} from "@/types";

export async function GET(req: NextRequest) {
    try{
        const userId = req.headers.get("x-user-id");
        const userEmail = req.headers.get("x-user-email");
        
        if (!userId || !userEmail) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await dbConnect();
        const userExists = await User.findOne({ _id: userId, email: userEmail }).select("name avatar");
        if(!userExists) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        const name = userExists.name;
        const avatar = userExists.avatar;
        const user:publicUser = {
            userId:userId,
            email:userEmail,
            name:name,
            avatar:avatar
        }
        return NextResponse.json({ message: "User fetched successfully", user }, { status: 200 });
    }catch(err){
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { avatar } = await req.json();
    if (!["openBook", "readingLamp", "owl", "bookMark"].includes(avatar)) {
      return NextResponse.json({ message: "Invalid avatar selection" }, { status: 400 });
    }

    await dbConnect();
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true }
    ).select("name avatar email");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Avatar updated successfully", avatar: updatedUser.avatar },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}