import { UserLoginData } from "@/types/user";
import { comparePassword } from "@/utils/bcrypt";
import { signJWT } from "@/utils/jwt";
import { userLoginValidator } from "@/utils/validators/userValidator";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body: UserLoginData = await request.json();
    const [hasErrors, errors] = userLoginValidator(body);
    if (hasErrors) {
      return NextResponse.json(
        {
          errors,
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: body.email.toLowerCase(),
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "user matching credentials not found",
        },
        { status: 400 }
      );
    }
    const passwordIsSame = await comparePassword(body.password, user.password);
    if (!passwordIsSame) {
      throw new Error("Password missmatch");
    }
    const token = await signJWT({
      userId: user.id,
    });
    return NextResponse.json({
      token: token,
    });
  } catch (error: any) {
    console.log("Error: failed to login", error.message);
    return NextResponse.json(
      {
        message: "user matching credentials not found",
      },
      { status: 400 }
    );
  }
}
