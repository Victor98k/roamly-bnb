import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Booking, Customer } from "@/types/booking";

const prisma = new PrismaClient();

// Assuming you have a function to create a customer and return its ID
async function createCustomer(customerData: Partial<Customer>) {
  const newCustomer = await prisma.customer.create({
    data: customerData,
  });
  return newCustomer.id;
}

export async function POST(req: Request) {
  try {
    const body: Partial<Booking> = await req.json();
    let [hasErrors, errors] = [false, {}];

    // Log the incoming request body for debugging
    console.log("Request body:", body);

    if (
      !body.checkIn ||
      !body.checkOut ||
      !body.customer ||
      !body.customer.firstName || // Ensure customer firstName is provided
      !body.customer.lastName || // Ensure customer lastName is provided
      !body.customer.phone || // Ensure customer phone is provided
      !body.customer.email || // Ensure customer email is provided
      !body.listingId || // Ensure listingId is provided
      body.totalPrice === undefined ||
      !body.userId // Ensure userId is provided
    ) {
      hasErrors = true;
      errors = { message: "Missing required fields" };
    }

    if (hasErrors) {
      console.error("Validation errors:", errors);
      return NextResponse.json({ errors }, { status: 400 });
    }

    const customerId = await createCustomer({
      firstName: body.customer.firstName,
      lastName: body.customer.lastName,
      phone: body.customer.phone,
      email: body.customer.email,
    });

    const newBooking = await prisma.booking.create({
      data: {
        checkIn: body.checkIn,
        checkOut: body.checkOut,
        totalPrice: body.totalPrice,
        createdAt: new Date().toISOString(), // Ensure createdAt is set
        listingId: body.listingId, // Ensure listingId is set
        userId: body.userId,
        customerId: customerId,
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

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany();
    return NextResponse.json(bookings, { status: 200 });
  } catch (error: any) {
    console.error("Error processing request:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
