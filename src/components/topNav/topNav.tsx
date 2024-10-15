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
        <h1 className="text-3xl font-bold text-teal-200">Roamly</h1>
      </div>
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="text-gray-300 hover:text-teal-200">
            <h2 className="text-xl font-bold">Home</h2>
          </Link>
        </li>
        <li>
          <a href="#link2" className="text-gray-300 hover:text-teal-200">
            <h2 className="text-xl font-bold">About</h2>
          </a>
        </li>
        <li>
          <a href="#link3" className="text-gray-300 hover:text-teal-200">
            <h2 className="text-xl font-bold">Contact</h2>
          </a>
        </li>
      </ul>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-teal-300 text-black rounded hover:bg-teal-400"
      >
        Sign Out
      </button>
    </nav>
  );
};

export default TopNav;
