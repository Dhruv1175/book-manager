import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import User from "@/lib/models/User";
import dbConnect from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.toString().trim().toLowerCase();

    await dbConnect();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const user = await User.findOneAndUpdate(
      { email: { $regex: new RegExp(`^${cleanEmail}$`, "i") } },
      { $set: { otp: otp, otpExpiry: otpExpiry } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { message: "If an account exists, an OTP code has been sent." },
        { status: 200 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_SERVER_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"WordMark" <${process.env.EMAIL_SERVER_USER}>`,
      to: user.email,
      subject: "Your Password Reset OTP - WordMark",
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #15181C; color: #E8E6E0; border-radius: 12px;">
          <h2 style="color: #4A8FD6; margin-top: 0;">WordMark Verification Code</h2>
          <p>Hi ${user.name},</p>
          <p>Your one-time password (OTP) to reset your account password is:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #4A8FD6; margin: 20px 0; background: #0B0D10; padding: 12px; border-radius: 8px; text-align: center;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #888;">This code is valid for 10 minutes. Do not share this code with anyone.</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "OTP sent successfully to your email." },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}