import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, options: APIOptions) {
  const id = options.params.id;

  try {
    const listing = await prisma.listings.findUnique({
      where: { id: id.toString() },
    });

    if (!listing) {
      return NextResponse.json(
        {
          message: "Listing not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(listing);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, options: APIOptions) {
  const id = options.params.id;

  try {
    const listing = await prisma.listings.delete({
      where: { id: id.toString() },
    });

    return NextResponse.json(
      {
        message: "Listing deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Listing not found or internal server error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, options: APIOptions) {
  const id = options.params.id;

  try {
    const body = await request.json();
    const { title, description, city, price, image } = body;

    const updatedListing = await prisma.listings.update({
      where: { id: id.toString() },
      data: { title, description, city, price, image },
    });

    return NextResponse.json(updatedListing);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
