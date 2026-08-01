import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/lib/models/User";
import dbConnect from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
    }

    const cleanEmail = email.toString().trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    await dbConnect();

    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${cleanEmail}$`, "i") } 
    });

    if (!user) {
      return NextResponse.json({ message: "User account not found." }, { status: 400 });
    }

    if (!user.otp || !user.otpExpiry) {
      return NextResponse.json({ message: "No OTP request found for this email." }, { status: 400 });
    }

    if (user.otp.toString().trim() !== cleanOtp) {
      return NextResponse.json({ message: "Invalid OTP code." }, { status: 400 });
    }

    const now = new Date();
    if (new Date(user.otpExpiry).getTime() < now.getTime()) {
      return NextResponse.json({ message: "OTP code has expired. Please request a new one." }, { status: 400 });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    user.otp = null;
    user.otpExpiry = null;
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    return NextResponse.json(
      { message: "OTP verified successfully.", resetToken },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}