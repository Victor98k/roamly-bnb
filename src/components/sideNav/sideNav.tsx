"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "antd";
import Link from "next/link";
import { DollarCircleFilled } from "@ant-design/icons"; // Import the icon
import { IoHomeOutline } from "react-icons/io5";
import { IoStatsChartOutline } from "react-icons/io5";
import { AiOutlineCheckSquare } from "react-icons/ai";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineLeft } from "react-icons/ai";
import { AiOutlineLogout } from "react-icons/ai";
import { AiOutlineMenu } from "react-icons/ai"; // Import the hamburger icon

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("acessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("STORAGE_TOKEN_KEY");
    router.push("/");
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
  };

  return (
    <div>
      <button
        className="fixed top-0 left-0 m-4 p-2 bg-gray-800 text-white rounded-md md:hidden z-50"
        onClick={toggleMenu}
      >
        <AiOutlineMenu />
      </button>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black-800 text-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 z-50 overflow-y-auto border-r border-gray-700`} // Add border to the right
      >
        <div className="flex items-center justify-between ml-12 h-20 px-4">
          <h1 className="text-2xl font-bold">Roamly BNB</h1>
          <button className="text-white md:hidden" onClick={toggleMenu}>
            ✕
          </button>
        </div>

        <nav className="mt-4 ml-12">
          <ul>
            <li className="flex items-center px-4 py-3 hover:bg-gray-700 mb-5 text-lg">
              <Link href="/home" className="flex items-center w-full">
                <span>Home</span>
                <IoHomeOutline className="ml-2 text-blue-500" />
              </Link>
            </li>

            <li className="flex items-center px-4 py-3 hover:bg-gray-700 mb-5 text-lg">
              <Link href="/my-bets" className="flex items-center w-full">
                <span>Listings</span>
                <DollarCircleFilled className="ml-2 text-yellow-500" />
              </Link>
            </li>
            <li className="flex items-center px-4 py-3 hover:bg-gray-700 mb-5 text-lg">
              <Link href="/my-stats" className="flex items-center w-full">
                <span>My bookings</span>
                <IoStatsChartOutline className="ml-2 text-green-500" />
              </Link>
            </li>
            <li className="flex items-center px-4 py-3 hover:bg-gray-700 mb-5 text-lg">
              <Link href="/leagues" className="flex items-center w-full">
                <span>Explore</span>
                <AiOutlineCheckSquare className="ml-2 text-red-orange-500" />
              </Link>
            </li>

            <li className="flex items-center px-4 py-3 hover:bg-gray-700 mb-8 text-lg">
              <Link href="/profilePage" className="flex items-center w-full">
                <span>Profile</span>
                <AiOutlineUser className="ml-2 text-blue-500" />
              </Link>
            </li>

            <li
              className="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer mb-8 text-lg"
              onClick={handleLogout}
            >
              <span>Logout</span>
              <AiOutlineLogout className="ml-2 text-red-500" />
            </li>
          </ul>
        </nav>
        <div className="flex items-center px-4 py-2 ml-12 ">
          <Avatar
            className="mr-2"
            size="large"
            style={{ backgroundColor: stringToColor(username) }}
          >
            {getInitials(username)}
          </Avatar>
          <span className="text-lg font-semibold">{username}</span>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
