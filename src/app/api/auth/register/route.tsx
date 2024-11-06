import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { User } from "@/types/user";
import { hashPassword } from "@/utils/bcrypt";
import { signJWT } from "@/utils/jwt";
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, isAdmin } = body;

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        isAdmin,
      },
    });

    const token = await signJWT({
      userId: user.id,
    });

    return NextResponse.json(
      {
        token,
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
