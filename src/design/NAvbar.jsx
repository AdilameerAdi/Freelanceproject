import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSocialOpen, setIsSocialOpen] = useState(false); // For dropdown

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
    "Social Media", // <-- Added dropdown menu
  ];

  const socialLinks = [
    { name: "Epvp", url: "https://www.elitepvpers.com/forum/nostale-pserver-advertising/5309923-nosdionisy-your-next-adventure-begins-official-thread.html" },
    { name: "Inforge", url: "https://www.inforge.net/forum/threads/nosdionisy-your-next-adventure-begins-–-official-thread.622697" },
    { name: "Website", url: "https://nosdionisy.com" },
    { name: "Discord", url: "https://discord.gg/nosdionisy" },
  ];

  const navigate = useNavigate();

  const handleClick = (item) => {
    if (item === "Home") {
      navigate("/");
    } else if (item === "Play Game") {
      window.open("https://nosdionisy.com/", "_blank");
    } else if (item === "News") {
      navigate("/blog");
    } else if (item === "Staff") {
      navigate("/staff");
    } else if (item === "Events") {
      navigate("/events");
    } else if (item === "Support") {
      navigate("/support");
    } else if (item === "Updates") {
      navigate("/updates");
    } else if (item === "Information") {
      navigate("/info");
    } else if (item === "Social Media") {
      setIsSocialOpen(!isSocialOpen); // Toggle dropdown
    }
  };

  return (
    <nav className="bg-gradient-to-r from-yellow-400 via-orange-500 to-green-400 shadow-lg fixed top-0 left-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Desktop Menu */}
          <ul className="hidden md:flex flex-1 justify-around items-center relative">
            {menuItems.map((item) => (
              <li
                key={item}
                onClick={() => handleClick(item)}
                className="text-white font-medium cursor-pointer hover:text-yellow-300 transition-colors relative"
              >
                {item}

                {/* Dropdown for Social Media */}
                {item === "Social Media" && isSocialOpen && (
                  <ul className="absolute top-full left-0 mt-2 bg-gray-900 rounded shadow-lg w-48">
                    {socialLinks.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-white hover:bg-gray-700"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Admin + Staff + Hamburger */}
          <div className="flex items-center w-full md:w-auto justify-between">
            <div className="flex space-x-2">
              <Link
                to="/admin"
                className="bg-green-500 text-white font-medium px-4 py-1 rounded hover:bg-green-600 transition-colors"
              >
                Admin Login
              </Link>

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
                  if (item !== "Social Media") {
                    setIsMobileMenuOpen(false); 
                  }
                }}
                className="text-white px-4 py-2 hover:text-yellow-300 cursor-pointer transition-colors relative"
              >
                {item}

                {/* Mobile Dropdown */}
                {item === "Social Media" && isSocialOpen && (
                  <ul className="bg-gray-800 rounded mt-2">
                    {socialLinks.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-white hover:bg-gray-600"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
