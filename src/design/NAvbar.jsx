import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for routing
import {  useNavigate } from "react-router-dom"; 
export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    "Play Game",
    "Staff",
    "Support",
    "News",
    "Updates",
    "Shop",
    "Information",
    "Events",
  ];
const navigate = useNavigate();
  const handleClick = (item) => {
    if (item === "Play Game") {
      window.open("https://nosdionisy.com/", "_blank"); // Open in new tab
    }
    else if (item === "News") {
      navigate("/blog"); // <- Navigate to BlogSection
    }
     else if (item === "Staff") {
      navigate("/staff"); // <- Navigate to staff
    }
    else if (item === "Events") {
      navigate("/events"); // <- Navigate to staff
    }
    else if (item === "Support") {
      navigate("/support"); // <- Navigate to staff
    }
    else if (item === "Updates") {
      navigate("/updates"); // <- Navigate to staff
    }
     else if (item === "Information") {
      navigate("/info"); // <- Navigate to staff
    }
  };

  return (
    <nav className="bg-[#FFDC00] shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Desktop Menu */}
          <ul className="hidden md:flex flex-1 justify-around items-center">
            {menuItems.map((item) => (
              <li
                key={item}
                onClick={() => handleClick(item)}
                className="text-[#001F3F] font-medium cursor-pointer hover:text-[#0320f8] hover:text-xl transition-colors"
              >
                {item}
              </li>
            ))}
          </ul>

          {/* Admin + Hamburger */}
          <div className="flex items-center w-full md:w-auto justify-between">
            {/* Admin Login button (route to /admin) */}
            <Link
              to="/admin"
              className="bg-[#2ECC40] text-[#001F3F] font-medium px-4 py-1 rounded hover:bg-[#7FDBFF] transition-colors"
            >
              Admin Login
            </Link>

            {/* Hamburger */}
            <div className="md:hidden ml-auto">
              <button
                className="text-[#001F3F] text-2xl focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <ul className="md:hidden bg-[#7FDBFF]">
            {menuItems.map((item) => (
              <li
                key={item}
                onClick={() => handleClick(item)}
                className="text-[#001F3F] px-4 py-2 hover:text-[#FFDC00] cursor-pointer transition-colors"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
