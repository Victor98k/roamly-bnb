import { UserLoginData, UserRegistrationData } from "@/types/user";
import { PrismaClient, User } from "@prisma/client";
import { NextResponse } from "next/server";
import { userExists } from "@/utils/prisma";
import { userLoginValidator } from "@/app/validators/userValidator";
import { comparePassword } from "@/utils/bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body: Partial<UserLoginData> = await req.json();
  let [hasErrors, errors] = [false, {}];

  if (!body.email || !body.password) {
    hasErrors = true;
    errors = { message: "Email and password are required" };
  }

  if (hasErrors) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const { email, password } = body;

  if (hasErrors) {
    return NextResponse.json(
      { message: "Validation failed", errors },
      { status: 400 }
    );
  }

  const loginUser = await userExists(email as string, prisma);

  if (loginUser) {
    const passwordMatch = await comparePassword(
      password as string,
      loginUser.password as string
    );

    if (passwordMatch) {
      return NextResponse.json(
        { message: "Login successful", loginUser },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }
}