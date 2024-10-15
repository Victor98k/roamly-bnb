import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Booking, Customer } from "@/types/booking";

const prisma = new PrismaClient();

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

    if (
      !body.checkIn ||
      !body.checkOut ||
      !body.customer ||
      !body.customer.firstName ||
      !body.customer.lastName ||
      !body.customer.phone ||
      !body.customer.email ||
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

    const customerId = await createCustomer({
      // @ts-ignore
      firstName: body.customer.firstName,
      // @ts-ignore
      lastName: body.customer.lastName,
      // @ts-ignore
      phone: body.customer.phone,
      // @ts-ignore
      email: body.customer.email,
    });

    const newBooking = await prisma.booking.create({
      data: {
        checkIn: body.checkIn || new Date().toISOString(),
        checkOut: body.checkOut || new Date().toISOString(),
        totalPrice: body.totalPrice ?? 0, // Provide a default value if undefined
        createdAt: new Date().toISOString(),
        listingId: body.listingId,
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
