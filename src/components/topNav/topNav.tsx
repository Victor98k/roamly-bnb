import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TopNav: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear local storage
    localStorage.clear();
    // Redirect to home page
    router.push("/");
  };
  return (
    <nav className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-900 to-black-600">
      <div className="logo">
        <Link href="/home">
          <h1 className="text-3xl font-bold text-teal-200">Roamly</h1>
        </Link>
      </div>

      <div className="flex space-x-2">
        <button className="px-4 py-2 bg-teal-300 text-black rounded hover:bg-teal-400">
          <Link href="/my-bookings">My Bookings</Link>
        </button>
        <button className="px-4 py-2 bg-teal-300 text-black rounded hover:bg-teal-400">
          <Link href="/my-listings">My Listings</Link>
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-teal-300 text-black rounded hover:bg-teal-400"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default TopNav;
