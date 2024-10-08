import React from "react";

const TopNav: React.FC = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-900 to-black-600">
      <div className="logo">
        <h1 className="text-3xl font-bold text-teal-200">Roamly</h1>
      </div>
      <ul className="flex space-x-4">
        <li>
          <a href="#link1" className="text-white hover:text-teal-200">
            <h2 className="text-xl font-bold">Home</h2>
          </a>
        </li>
        <li>
          <a href="#link2" className="text-white hover:text-teal-200">
            <h2 className="text-xl font-bold">About</h2>
          </a>
        </li>
        <li>
          <a href="#link3" className="text-white hover:text-teal-200">
            <h2 className="text-xl font-bold">Contact</h2>
          </a>
        </li>
      </ul>
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
        Sign In
      </button>
    </nav>
  );
};

export default TopNav;