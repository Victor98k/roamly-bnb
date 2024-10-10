import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Listing } from "@/types/listings";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body: Partial<Listing> = await req.json();
    let [hasErrors, errors] = [false, {}];

    if (
      !body.title ||
      !body.description ||
      !body.price ||
      !body.city ||
      !body.image
    ) {
      hasErrors = true;
      errors = { message: "Missing required fields" };
    }

    if (hasErrors) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const newListing = await prisma.listings.create({
      data: {
        title: body.title,
        description: body.description,
        price: body.price,
        city: body.city,
        available: body.available,
        image: body.image,
      },
    });

    return NextResponse.json(newListing, { status: 201 });
  } catch (error: any) {
    console.error("Error processing request:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const listings = await prisma.listings.findMany();
    return NextResponse.json(listings, { status: 200 });
  } catch (error: any) {
    console.error("Error processing request:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
