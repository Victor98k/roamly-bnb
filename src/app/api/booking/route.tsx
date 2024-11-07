import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Booking } from "@/types/booking";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body: Booking = await req.json();
    // Using the Booking type as body to avoid erros.
    let [hasErrors, errors] = [false, {}];

    if (
      !body.checkIn ||
      !body.checkOut ||
      // !body.numberofpeople ||
      !body.listingId ||
      !body.totalPrice ||
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
      // Using the Booking type as body to avoid erros.
      data: {
        checkIn: body.checkIn,
        checkOut: body.checkOut,
        totalPrice: body.totalPrice ?? 0,
        createdBy: body.createdBy,
        createdAt: new Date().toISOString(),
        listingId: body.listingId!, // Adding ! to make sure it's not undefined.
        userId: body.userId!, // Adding ! to make sure it's not undefined,
      },
      // FOR RESPONSE WE INCLUDE THE USER AND LISTING
      include: {
        user: true, // Include user data in the response .
        listing: true, // Include the listing data in the response.
      },
    });

    // Log the response,
    // console.log(
    //   "Created booking with nested data:",
    //   JSON.stringify(newBooking, null, 2)
    // );

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error: any) {
    console.error("Error processing request:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Get booking for a specific user
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    // This creates an object from the request URL.,
    // Extract the userId fro the url
    const userId = url.searchParams.get("userId");
    // This checks if the userId is present in the URL.
    // If the user ID is not present we log an error. BAD request
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }
    // This finds all the bookings for a specific user.
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
