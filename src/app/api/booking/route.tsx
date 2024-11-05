import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Booking } from "@/types/booking";

const prisma = new PrismaClient();

// async function createCustomer(customerData: Partial<Customer>) {
//   const newCustomer = await prisma.customer.create({
//     data: customerData,
//   });
//   return newCustomer.id;
// }

export async function POST(req: Request) {
  try {
    const body: Partial<Booking> = await req.json();
    let [hasErrors, errors] = [false, {}];

    if (
      !body.checkIn ||
      !body.checkOut ||
      !body.listingId ||
      body.totalPrice === undefined ||
      !body.userId
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
        createdAt: new Date().toISOString(),

        listingId: body.listingId,
        userId: body.userId,
      },
    });

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

// export async function DELETE(req: Request) {
//   try {
//     const body: Partial<Booking> = await req.json();
//     const { id } = body;

//     if (!id) {
//       return NextResponse.json(
//         { message: "Missing booking ID" },
//         { status: 400 }
//       );
//     }

//     // Check if the booking exists before attempting to delete
//     const existingBooking = await prisma.booking.findUnique({
//       where: { id: _id },
//     });

//     if (!existingBooking) {
//       return NextResponse.json(
//         { message: "Booking not found" },
//         { status: 404 }
//       );
//     }

//     const deletedBooking = await prisma.booking.delete({
//       where: { id: _id },
//     });

//     return NextResponse.json(deletedBooking, { status: 200 });
//   } catch (error: any) {
//     console.error("Error processing request:", error.message);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
