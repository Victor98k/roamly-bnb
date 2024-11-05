import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Listing } from "@/types/listings";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    const listings = await prisma.listings.findMany({
      where: userId ? { userId: userId } : {},
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (
      !body.title ||
      !body.description ||
      !body.price ||
      !body.userId ||
      !body.city
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newListing = await prisma.listings.create({
      data: {
        title: body.title,
        description: body.description,
        city: body.city,
        price: body.price,
        available: true,
        image: body.image || "",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: body.userId,
      },
    });

    return NextResponse.json(newListing, { status: 201 });
  } catch (error: any) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
