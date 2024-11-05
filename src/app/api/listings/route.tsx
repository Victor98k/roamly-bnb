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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.title || !body.price || !body.userId || !body.createdBy) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newListing = await prisma.listing.create({
      data: {
        title: body.title,
        description: body.description || "",
        price: body.price,
        createdAt: new Date().toISOString(),
        createdBy: body.createdBy,
        userId: body.userId,
        // ... any other fields
      },
    });

    return NextResponse.json(newListing, { status: 201 });
  } catch (error: any) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
