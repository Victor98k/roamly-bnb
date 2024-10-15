"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import TopNav from "@/components/topNav/topNav";

import ListingCards from "@/components/listingCards/listingCards";

export default function Home() {
  const router = useRouter();

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
                className="text-teal-200 mx-7 cursor-pointer  hover:text-white hover:rounded-full hover:underline hover:underline-offset-4 hover:border-teal-200 transition duration-300"
                onClick={() => router.push("/my-bookings")}
              >
                My Bookings
              </button>
              {/* <button
                className="border bg-teal-200 hover:bg-teal-300 text-black rounded-full px-4 py-2"
                onClick={() => router.push("/my-bookings")}
              >
                My Bookings
              </button> */}
            </span>
          </div>
          <ListingCards />
        </div>
      </div>
    </>
  );
}
