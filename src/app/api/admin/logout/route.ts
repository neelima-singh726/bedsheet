// app/api/admin/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "admin_session";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", { expires: new Date(0) });
  return NextResponse.redirect(
    new URL("/admin/sign-in", "http://localhost:3000")
  ); // Adjust URL if needed
}
