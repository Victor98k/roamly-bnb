import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, options: APIOptions) {
  // NextRequest contains the request details, APIOptions contains route parameters, including the dynamic id.

  //
  const id = options.params.id;
  // We extract the ID from the request PARAMS. Ex, /api/listings/123 where "123" is the ID

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

// Deleting a listing will remove all the bookings connected to that listing.
export async function DELETE(request: NextRequest, options: APIOptions) {
  const id = options.params.id;

  try {
    // We delete all the bookings connected to the listing.
    await prisma.booking.deleteMany({
      where: { listingId: id.toString() },
    });

    await prisma.listings.delete({
      where: { id: id.toString() },
    });

    return NextResponse.json(
      {
        message: "Listing deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting listing:", error);
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
    // LETS not specify the listing type bcuz the user might not change all fields.
    const { title, description, city, price, image } = body;

    // Ensure price is converted to a Float if it exists
    const updatedListing = await prisma.listings.update({
      where: { id: id.toString() },
      data: {
        title,
        description,
        city,
        price: price ? parseFloat(price) : undefined, // Convert price to a Float if it exists
        image,
      },
    });

    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error("Error updating listing:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
