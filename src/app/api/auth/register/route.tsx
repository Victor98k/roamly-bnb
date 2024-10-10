import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { User } from "@/types/user";
import { hashPassword } from "@/utils/bcrypt";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body: Partial<User> = await req.json();
    let [hasErros, errors] = [false, {}];

    if (!body.firstName || !body.lastName || !body.email || !body.password) {
      hasErros = true;
      errors = { message: "Missing required fields" };
    }

    if (hasErros) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // IsAdmin is set defult to false.
    // To create an admin user do so with postman.
    const newUser = await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: await hashPassword(body.password as string),
        isAdmin: body.isAdmin,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error("Error processing request:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
