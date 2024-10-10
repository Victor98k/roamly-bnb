import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { User } from "@/types/user";
const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users, { status: 200 });
}
