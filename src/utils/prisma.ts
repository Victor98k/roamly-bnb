import { PrismaClient } from "@prisma/client";

export async function userExists(
  email: string,
  client: PrismaClient
): Promise<boolean> {
  const user = await client.user.findFirst({
    where: {
      email,
    },
  });

  return !!user;
}
