import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const latestNews = [
    {
      title: "New Dungeon Released!",
      date: "August 15, 2025",
      description:
        "The Dragon’s Lair is now live. Join forces with your guild and defeat the mighty beast for legendary loot.",
    },
    {
      title: "Server Maintenance",
      date: "August 10, 2025",
      description:
        "Servers will be down for scheduled maintenance on Aug 12 from 2:00 AM to 6:00 AM UTC.",
    },
    {
      title: "Summer Festival Event",
      date: "July 25, 2025",
      description:
        "Celebrate the season with exclusive quests, rewards, and limited-time items in the Summer Festival.",
    },
  ];

  const menuItems = [
    {
      label: "⬇️ Download Game",
      link: "https://nosdionisy.com/",
      external: true,
    },
    { label: "📰 News & Announcements", link: "/blog" },
    { label: "🎉 Events", link: "/events" },
    { label: "🎧 Support", link: "/support" },
    { label: "❓ FAQs", link: "/faqs" },
    { label: "⭐ Reviews", link: "/reviews" },
  ];

  const handleClick = (item) => {
    if (item.external) {
      window.open(item.link, "_blank");
    } else {
      navigate(item.link);
    }
  };

  return (
    <div className="p-6 min-h-screen text-white bg-gradient-to-br from-gray-950 via-black to-gray-900 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

      {/* Title */}
      <h1 className="text-5xl font-extrabold text-center mb-12 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 drop-shadow-lg">
        ⚔️ Welcome to NosDionisy ⚔️
      </h1>

      <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto relative ">
        {/* Left Column - Menu */}
        <div className="md:col-span-1 space-y-6">
          {menuItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleClick(item)}
              className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-5 rounded-2xl shadow-lg border border-gray-700 cursor-pointer 
              hover:shadow-xl hover:scale-105 hover:from-purple-800 hover:to-blue-900 transition transform duration-300 group"
            >
              <span className="text-lg font-bold tracking-wide bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent group-hover:from-pink-400 group-hover:to-yellow-400">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Right Column - Latest News */}
        <div className="md:col-span-2 space-y-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-lg mb-6">
            📰 Latest News
          </h2>
          {latestNews.map((news, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-2xl border border-gray-700 shadow-lg hover:shadow-yellow-500/30 hover:-translate-y-1 transition transform duration-300"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-2xl font-bold text-purple-300">
                  {news.title}
                </h3>
                <span className="text-sm text-gray-400 italic">
                  {news.date}
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed">{news.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
