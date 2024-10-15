"use client";

import { useEffect, useState } from "react";
import TopNav from "@/components/topNav/topNav";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";

import { Listing } from "@/types/listings";
import { Booking } from "@/types/booking";

function MyBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [listings, setListings] = useState<{ [key: string]: Listing }>({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID not found in localStorage");
        }

        const response = await fetch("/api/booking");
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
              Sunny
            </span>
            <span className="text-teal-200 mx-7 cursor-pointer  hover:text-white hover:rounded-full hover:underline hover:underline-offset-4 hover:border-teal-200 transition duration-300">
              Snow
            </span>
            <span className="text-teal-200 mx-7 cursor-pointer  hover:text-white hover:rounded-full hover:underline hover:underline-offset-4 hover:border-teal-200 transition duration-300">
              Tropical
            </span>
            <span className="text-teal-200 mx-7 cursor-pointer  hover:text-white hover:rounded-full hover:underline hover:underline-offset-4 hover:border-teal-200 transition duration-300">
              Adventure
            </span>
            <span className="text-teal-200 mx-7 cursor-pointer  hover:text-white hover:rounded-full hover:underline hover:underline-offset-4 hover:border-teal-200 transition duration-300">
              <button
                className="border bg-teal-200 hover:bg-teal-300 text-black rounded-full px-4 py-2"
                onClick={() => router.push("/my-bookings")}
              >
                My Bookings
              </button>
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">My Bookings</h1>
            <Card>
              <div className="flex flex-col items-center justify-center">
                {bookings.map((booking) => {
                  const listing = listings[booking.listingId];
                  return (
                    <div key={booking.id}>
                      <h2 className="text-xl">
                        Check-In:{" "}
                        {new Date(booking.checkIn).toLocaleDateString()}
                      </h2>
                      <h2 className="text-xl">
                        Check-Out:{" "}
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </h2>
                      <h2 className="text-xl">
                        Total Price: ${booking.totalPrice}
                      </h2>
                      {listing && (
                        <>
                          <h2 className="text-xl">Title: {listing.title}</h2>
                          <h2 className="text-xl">City: {listing.city}</h2>
                          <h2 className="text-xl">Price: ${listing.price}</h2>
                          <img src={listing.image} alt={listing.title} />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyBookings;
