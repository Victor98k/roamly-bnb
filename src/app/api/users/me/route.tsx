// import { PrismaClient } from "@prisma/client";
// import { NextRequest, NextResponse } from "next/server";

// const prisma = new PrismaClient();

// export async function GET(request: NextRequest) {
//   try {
//     const userId = request.headers.get("userId");
//     if (!userId) {
//       throw new Error("Failed to retrieve userId from headers");
//     }

//     const user = await prisma.user.findUniqueOrThrow({
//       where: {
//         id: userId,
//       },
//     });

//     const safeUsesr = {
//       ...user,
//       password: undefined,
//       passwordResetUUID: undefined,
//     };

//     return NextResponse.json(user);
//   } catch (error: any) {
//     console.warn("Error: Failed to get user from request", error.message);
//     return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
//   }
// }
