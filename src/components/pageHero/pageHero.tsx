import Link from "next/link";
import ListingCards from "../listing-cards";

function PageHero() {
  return (
    <div className="flex min-h-screen mr-10 ml-10 mt-6 mb-2 bg-gradient-to-r from-gray-900 to-black-600 rounded-3xl border border-gray-800 overflow-hidden">
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
        <div className="flex justify-center items-center bg-gray-900 border rounded-full p-4 mb-2">
          <span className="text-teal-200 mx-7 cursor-pointer  hover:text-white hover:rounded-full hover:underline hover:underline-offset-4 hover:border-teal-200 transition duration-300">
            <Link href="/my-bookings">My Bookings</Link>
          </span>
          <span className="text-teal-200 mx-7 cursor-pointer  hover:text-white hover:rounded-full hover:underline hover:underline-offset-4 hover:border-teal-200 transition duration-300">
            <Link href="/my-listings">My Listings</Link>
          </span>
          <span className="text-teal-200 mx-7 cursor-pointer  hover:text-white hover:rounded-full hover:underline hover:underline-offset-4 hover:border-teal-200 transition duration-300">
            <Link href="/home">Home</Link>
          </span>
        </div>
        <ListingCards />
      </div>
    </div>
  );
}

export default PageHero;
