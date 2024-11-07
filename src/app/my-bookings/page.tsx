"use client";

import { useEffect, useState } from "react";
import TopNav from "@/components/topNav/topNav";
import { useRouter } from "next/navigation";
import { Popconfirm, notification, message } from "antd";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Listing } from "@/types/listings";
import { Booking, UserBooking } from "@/types/booking";
import Link from "next/link";

function MyBookings() {
  const router = useRouter();
  const [messageApi] = message.useMessage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [listings, setListings] = useState<{ [key: string]: Listing }>({});

  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = localStorage.getItem("userId");
        // console.log("Retrieved userId:", userId);
        if (!userId) {
          throw new Error("User ID not found in localStorage");
        }

        const response = await fetch(`/api/booking?userId=${userId}`);
        if (!response.ok) {
          throw new Error(`Error fetching bookings: ${response.statusText}`);
        }
        const data = await response.json();

        // Filter bookings by userId
        const userBookings = data.filter(
          (booking: Booking) => booking.userId === userId
        );
        setBookings(userBookings);

        // Fetch listing details for each booking
        userBookings.forEach(async (booking: Booking) => {
          if (!listings[booking.listingId]) {
            try {
              const listingResponse = await fetch(
                `/api/listings/${booking.listingId}`
              );
              if (!listingResponse.ok) {
                throw new Error(
                  `Error fetching listing: ${listingResponse.statusText}`
                );
              }
              const listingData = await listingResponse.json();
              setListings((prevListings) => ({
                ...prevListings,
                [booking.listingId]: listingData,
              }));
            } catch (error) {
              console.error(
                `Failed to fetch listing for ID ${booking.listingId}:`,
                error
              );
            }
          }
        });
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };

    fetchBookings();
  }, [listings]);

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/booking/${bookingId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Error deleting booking: ${response.statusText}`);
      }
      // remove the deleted booking from the bookings state
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== bookingId)
      );
      api.success({
        message: "Booking Deleted",
        description: "Booking has been deleted successfully.",
      });
      notification.success({
        message: "Booking Canceled",
        description: "Your booking has been successfully canceled.",
      });
    } catch (error) {
      console.error("Failed to delete booking:", error);
      api.error({
        message: "Booking Error",
        description: "Booking could not be deleted.",
      });
    }
  };

  return (
    <>
      <TopNav />
      <div className="flex min-h-screen mr-10 ml-10 mt-10 mb-10 bg-gradient-to-r from-gray-900 to-black-600 rounded-3xl border border-gray-800 overflow-hidden">
        <div className="flex-1 flex flex-col items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 mx-4 sm:mx-8 lg:mx-12 lg:mb-12 lg:mt-1">
            {/* Mobile */}
            <span className="block sm:hidden text-5xl text-white">
              Discover <span className="text-teal-200">Roamly</span>
            </span>
            {/* Desktop */}
            <div className="text-center">
              <span className="block text-teal-200">Roamly</span>
              <span className="block text-white">Where will you go next?</span>
            </div>
          </h1>
          {/* Category Navigation */}
          <div className="flex justify-center items-center bg-gray-900 border rounded-full p-4 mb-8">
            <span className="text-teal-200 mx-7 cursor-pointer  hover:text-white hover:rounded-full hover:underline hover:underline-offset-4 hover:border-teal-200 transition duration-300">
              <Link href="/home">Home</Link>
            </span>

            <span className="text-teal-200 mx-7 cursor-pointer  hover:text-white hover:rounded-full hover:underline hover:underline-offset-4 hover:border-teal-200 transition duration-300">
              <Link href="/my-listings">My Listings</Link>
            </span>
          </div>
          <div className="flex flex-col items-center justify-center w-full">
            <h1 className="text-3xl font-bold mb-6 text-white">My Bookings</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {bookings.map((booking) => {
                const listing = listings[booking.listingId];
                return (
                  <Card
                    key={booking.id}
                    className="w-full bg-gray-800 text-white"
                  >
                    <CardHeader>
                      {listing && (
                        <>
                          <CardTitle className="text-2xl text-teal-200">
                            {listing.title}
                          </CardTitle>
                          <CardDescription className="text-lg text-gray-300">
                            {listing.city}
                          </CardDescription>
                        </>
                      )}
                    </CardHeader>
                    <CardContent>
                      {listing && (
                        <>
                          <img
                            src={listing.image}
                            alt={listing.title}
                            className="w-full h-48 object-cover rounded-md mb-4"
                          />
                          <div className="space-y-2">
                            <p className="text-xl font-semibold">
                              Price:{" "}
                              <span className="text-teal-200">
                                ${listing.price}/night
                              </span>
                            </p>
                            <p>
                              Check-In Date:
                              <span className="font-semibold">
                                {new Date(booking.checkIn).toLocaleDateString()}
                                {/* Convert the checkIn date to a string */}
                              </span>
                            </p>
                            <p>
                              Check-Out Date:
                              <span className="font-semibold">
                                {new Date(
                                  booking.checkOut
                                ).toLocaleDateString()}
                                {/* Convert the checkOut date to a string */}
                              </span>
                            </p>
                            <p className="text-lg font-semibold">
                              Total Price:{" "}
                              <span className="text-teal-200">
                                ${booking.totalPrice}
                              </span>
                            </p>
                            {booking.createdBy && (
                              <div className="mt-4">
                                <p>
                                  Booked for:{" "}
                                  {(booking.createdBy as UserBooking).firstName}{" "}
                                  {(booking.createdBy as UserBooking).lastName}
                                </p>
                                <p>
                                  Contact:{" "}
                                  {(booking.createdBy as UserBooking).email}
                                </p>
                                <p>
                                  Phone:{" "}
                                  {(booking.createdBy as UserBooking).phone}
                                </p>
                              </div>
                            )}
                            <div>
                              <button className="bg-teal-200 text-black rounded-full px-4 py-2 pl-6 pr-6 hover:bg-teal-300 ">
                                Booking Details
                              </button>
                            </div>

                            <Popconfirm
                              title="Are you sure you want to delete this booking?"
                              description="This action cannot be undone."
                              onConfirm={() => handleDeleteBooking(booking.id)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <button className="bg-red-500 text-black rounded-full px-4 py-2 pl-6 pr-6 hover:bg-teal-300 ">
                                Delete Booking
                              </button>
                            </Popconfirm>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyBookings;
