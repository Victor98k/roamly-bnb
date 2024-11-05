import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { User } from "@/types/user";
import { hashPassword } from "@/utils/bcrypt";
import { signJWT } from "@/utils/jwt";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body: Partial<User> = await req.json();
    let [hasErros, errors] = [false, {}];

    if (
      !body.firstName ||
      !body.lastName ||
      !body.email ||
      !body.password ||
      body.isAdmin === undefined
    ) {
      hasErros = true;
      errors = { message: "Missing required fields" };
    }

    if (hasErros) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        firstName: body.firstName as string,
        lastName: body.lastName as string,
        email: body.email as string,
        password: await hashPassword(body.password as string),
        isAdmin: body.isAdmin as boolean,
      },
    });

    const token = await signJWT({
      userId: newUser.id,
    });
    return NextResponse.json(
      {
        token,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error processing request:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
