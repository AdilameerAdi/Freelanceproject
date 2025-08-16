import React, { useState } from "react";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  const menuItems = [
    "Staff",
    "Support",
    "News",
    "Updates",
    "Shop",
    "Information",
    "Support",
    "Events",
    "Community",
  ];

  return (
    <nav className="bg-[#0D1B2A] shadow-lg">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex justify-between items-center h-16 w-full">
      {/* Desktop Menu */}
      <ul className="hidden md:flex flex-1 justify-around items-center">
        {menuItems.map((item) =>
          item === "Community" ? (
            <li
              key="Community"
              className="relative text-white font-medium cursor-pointer hover:text-[#00BFFF] transition-colors flex items-center gap-1"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              Community 
              <span className="text-sm relative top-1">&#9662;</span>
              <ul
                className={`absolute top-full left-0 mt-1 w-48 bg-[#1B263B] border border-gray-700 shadow-lg ${
                  isDropdownOpen ? "block" : "hidden"
                }`}
              >
                <li className="px-4 py-2 hover:bg-[#00BFFF] hover:text-[#0D1B2A] cursor-pointer">
                  International
                </li>
              </ul>
            </li>
          ) : (
            <li
              key={item}
              className="text-white font-medium cursor-pointer hover:text-[#00BFFF] transition-colors"
            >
              {item}
            </li>
          )
        )}
      </ul>

      {/* Admin + Hamburger */}
      <div className="flex items-center w-full md:w-auto justify-between">
        {/* Admin Login button - left on mobile */}
        <button
          onClick={() => setIsAdminLoginOpen(true)}
          className="bg-[#00BFFF] text-[#0D1B2A] font-medium px-4 py-1 rounded hover:bg-[#009ACD] transition-colors"
        >
          Admin Login
        </button>

        {/* Hamburger - right on mobile */}
        <div className="md:hidden ml-auto">
          <button
            className="text-white text-2xl focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </div>

    {/* Mobile Menu */}
    {isMobileMenuOpen && (
      <ul className="md:hidden bg-[#0D1B2A]">
        {menuItems.map((item) =>
          item === "Community" ? (
            <li key={item} className="text-white px-4 py-2">
              {item}
              <ul className="bg-[#1B263B] mt-1">
                <li className="px-4 py-2 hover:bg-[#00BFFF] hover:text-[#0D1B2A] cursor-pointer">
                  International
                </li>
              </ul>
            </li>
          ) : (
            <li
              key={item}
              className="text-white px-4 py-2 hover:text-[#00BFFF] cursor-pointer transition-colors"
            >
              {item}
            </li>
          )
        )}
      </ul>
    )}

    {/* Admin Login Modal */}
    {isAdminLoginOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-80 relative">
          <h2 className="text-xl font-bold mb-4">Admin Login</h2>
          <input
            type="text"
            placeholder="Username"
            className="w-full border border-gray-300 px-3 py-2 mb-3 rounded focus:outline-none focus:border-[#00BFFF]"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 px-3 py-2 mb-4 rounded focus:outline-none focus:border-[#00BFFF]"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAdminLoginOpen(false)}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => alert("Logged in!")}
              className="px-4 py-2 rounded bg-[#00BFFF] text-white hover:bg-[#009ACD] transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
</nav>

  );
}
