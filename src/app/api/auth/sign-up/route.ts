import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const user = await createUser(email, password, fullName || "");

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      userId: user.id,
    });
  } catch (error: any) {
    console.error("Sign up error:", error);

    // Check for duplicate email error
    if (error.code === "23505") {
      // PostgreSQL unique violation code
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
