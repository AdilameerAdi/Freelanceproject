import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for routing
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    "Play Game",
    "Home",
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
    if (item === "Home") {
      navigate("/"); // Go to homepage
    } else if (item === "Play Game") {
      window.open("https://nosdionisy.com/", "_blank"); // Open in new tab
    } else if (item === "News") {
      navigate("/blog"); // <- Navigate to BlogSection
    } else if (item === "Staff") {
      navigate("/staff"); // <- Navigate to staff
    } else if (item === "Events") {
      navigate("/events"); // <- Navigate to events
    } else if (item === "Support") {
      navigate("/support"); // <- Navigate to support
    } else if (item === "Updates") {
      navigate("/updates"); // <- Navigate to updates
    } else if (item === "Information") {
      navigate("/info"); // <- Navigate to info
    }
  };

  return (
    <nav className="bg-gradient-to-r from-yellow-400 via-orange-500 to-green-400 shadow-lg fixed top-0 left-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Desktop Menu */}
          <ul className="hidden md:flex flex-1 justify-around items-center">
            {menuItems.map((item) => (
              <li
                key={item}
                onClick={() => handleClick(item)}
                className="text-white font-medium cursor-pointer hover:text-yellow-300 transition-colors"
              >
                {item}
              </li>
            ))}
          </ul>

          {/* Admin + Staff + Hamburger */}
          <div className="flex items-center w-full md:w-auto justify-between">
            <div className="flex space-x-2">
              {/* Admin Login button */}
              <Link
                to="/admin"
                className="bg-green-500 text-white font-medium px-4 py-1 rounded hover:bg-green-600 transition-colors"
              >
                Admin Login
              </Link>

              {/* Staff Login button */}
              <Link
                to="/staff-panel"
                className="bg-orange-500 text-white font-medium px-4 py-1 rounded hover:bg-orange-600 transition-colors"
              >
                Staff Login
              </Link>
            </div>

            {/* Hamburger */}
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
          <ul className="md:hidden bg-gray-900">
            {menuItems.map((item) => (
              <li
                key={item}
                onClick={() => {
                  handleClick(item);
                  setIsMobileMenuOpen(false); // Auto close menu after click
                }}
                className="text-white px-4 py-2 hover:text-yellow-300 cursor-pointer transition-colors"
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
