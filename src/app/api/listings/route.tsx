import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Listing } from "@/types/listings";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    const listings = await prisma.listings.findMany({
      where: userId ? { userId: userId } : {}, // Ensure userId is not null
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, city, price, image, userId } = body;

    const newListing = await prisma.listings.create({
      data: {
        title,
        description,
        city,
        price: parseFloat(price),
        image,
        available: true,
        userId,
      },
    });

    return NextResponse.json(newListing, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
