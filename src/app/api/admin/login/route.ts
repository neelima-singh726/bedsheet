// app/api/admin/login/route.ts
import { sign } from "@/lib/jwt"; // <-- Corrected relative path
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
const COOKIE_NAME = "admin_session";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // In a real app, you'd look up the admin user. Here, we'll hardcode it.
    // IMPORTANT: Store these in your .env.local file for security!
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password123";

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // If credentials are correct, create a session payload
    const payload = { sub: email, aud: "admin" };
    const secret =
      process.env.ADMIN_COOKIE_SECRET || "dev-secret-key-that-is-long";

    // Sign the token
    const token = await sign(payload, secret);

    // Set the cookie
    (await cookies()).set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
