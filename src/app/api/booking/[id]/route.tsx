import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Missing booking ID" },
        { status: 400 }
      );
    }

    // Check if the booking exists before attempting to delete
    const existingBooking = await prisma.booking.findUnique({
      where: { id }, // Use id as per Prisma schema
    });

    if (!existingBooking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    const deletedBooking = await prisma.booking.delete({
      where: { id }, // Use id as per Prisma schema
    });

    return NextResponse.json(deletedBooking, { status: 200 });
  } catch (error: any) {
    console.error("Error processing request:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
