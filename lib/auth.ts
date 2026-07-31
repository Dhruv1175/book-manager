import { SignJWT,jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET ;

if(!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}

const key = new TextEncoder().encode(JWT_SECRET);

export interface TokenPayload {
  userId: string;
  email: string;
  [key: string]: unknown;
}

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

export async function signToken(payload: TokenPayload): Promise<string> {
    return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("2h").sign(key);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
    try {
        const { payload } = await jwtVerify(token, key,{
            algorithms: ["HS256"],
        });
        return payload as TokenPayload;
    } catch {
        return null;
    }
}

