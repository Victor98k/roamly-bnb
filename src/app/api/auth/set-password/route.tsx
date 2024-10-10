import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { comparePassword, hashPassword } from "@/utils/bcrypt";
import { v4 as uuidv4 } from "uuid";
import { UserResetPasswordData } from "@/types/user";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  //TODO: take in email old password and new password uuid
  const body: UserResetPasswordData = await request.json();

  //TODO: validate old password is same
  const user = await prisma.user.update({
    where: {
      email: body.email,
      passwordResetUUID: body.uuid,
    },
    data: {
      password: await hashPassword(body.newPassword),
      passwordResetUUID: null,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const passwordMatch = await comparePassword(body.newPassword, user.password);

  if (!passwordMatch) {
    return NextResponse.json(
      { message: "Invalid old password" },
      { status: 401 }
    );
  }

  //TODO: hash new password
  const hashedNewPassword = await hashPassword(body.newPassword);

  //TODO: update user object with new password
  await prisma.user.update({
    where: {
      email: body.email,
    },
    data: {
      password: hashedNewPassword,
      passwordResetUUID: null,
    },
  });
  //TODO: return message "Password has been set"
  return NextResponse.json(
    { message: "Password has been set" },
    { status: 200 }
  );
}
