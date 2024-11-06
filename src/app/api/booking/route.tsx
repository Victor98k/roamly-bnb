import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Booking } from "@/types/booking";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body: Partial<Booking> = await req.json();
    let [hasErrors, errors] = [false, {}];

    if (
      !body.checkIn ||
      !body.checkOut ||
      !body.listingId ||
      body.totalPrice === undefined ||
      !body.userId ||
      !body.createdBy
    ) {
      hasErrors = true;
      errors = { message: "Missing required fields" };
    }

    if (hasErrors) {
      console.error("Validation errors:", errors);
      return NextResponse.json({ errors }, { status: 400 });
    }

    const newBooking = await prisma.booking.create({
      data: {
        checkIn: body.checkIn || new Date().toISOString(),
        checkOut: body.checkOut || new Date().toISOString(),
        totalPrice: body.totalPrice ?? 0,
        createdBy: body.createdBy as any,
        createdAt: new Date().toISOString(),
        listingId: body.listingId!, // Add ! to assert it's not undefined
        userId: body.userId!, // Add ! to assert it's not undefined
      },
      include: {
        user: true, // Include user data in the response .
        listing: true, // Include the listing data in the response.
      },
    });

    console.log(
      "Created booking with nested data:",
      JSON.stringify(newBooking, null, 2)
    ); // Pretty print the result

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error: any) {
    console.error("Error processing request:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: userId },
    });
    return NextResponse.json(bookings, { status: 200 });
  } catch (error: any) {
    console.error("Error processing request:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
