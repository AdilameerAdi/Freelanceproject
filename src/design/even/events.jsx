import React from "react";
import { Calendar, Clock, Star } from "lucide-react";
 // Import the text slider component
export default function Events() {
  const pastEvents = [
    { title: "🎉 Summer Festival", date: "June 2023", description: "A fun-filled summer event with rewards." },
    { title: "⚔️ PvP Tournament", date: "August 2023", description: "Competitive PvP battles with prizes." },
    { title: "🎃 Halloween Bash", date: "October 2023", description: "Spooky-themed quests and items." },
  ];

  const upcomingEvents = [
    { title: "❄️ Winter Wonderland", date: "December 2025", description: "Holiday event with special gifts." },
    { title: "⭐ Anniversary Celebration", date: "February 2026", description: "Celebrating another year with rewards." },
  ];

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-[#0a0f1f] via-[#0b132b] to-black text-white relative">
      {/* Neon Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.2),transparent_70%)]"></div>

      <h1 className="text-4xl font-extrabold text-center mb-10 tracking-wide 
        text-transparent bg-clip-text bg-gradient-to-r mt-10 from-purple-400 to-cyan-400">
        🚀 Game Events Hub
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative ">
        {/* Past Events */}
        <div className="bg-[#111a2c]/80 backdrop-blur-xl border border-purple-500/40 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-purple-400 flex items-center gap-2 mb-6">
            <Clock /> Past Events
          </h2>
          {pastEvents.length > 0 ? (
            <ul className="space-y-5">
              {pastEvents.map((event, idx) => (
                <li
                  key={idx}
                  className="p-4 bg-[#0d1324] rounded-xl border border-gray-700 hover:border-purple-400 transition shadow-md"
                >
                  <h3 className="font-bold text-lg text-gray-200">{event.title}</h3>
                  <p className="text-sm text-gray-400">{event.date}</p>
                  <p className="text-gray-300 mt-1">{event.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No past events available.</p>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="bg-[#111a2c]/80 backdrop-blur-xl border border-cyan-400/40 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2 mb-6">
            <Calendar /> Upcoming Events
          </h2>
          {upcomingEvents.length > 0 ? (
            <ul className="space-y-5">
              {upcomingEvents.map((event, idx) => (
                <li
                  key={idx}
                  className="p-4 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-xl border border-cyan-400/40 
                  hover:from-purple-500/30 hover:to-cyan-500/30 hover:scale-[1.02] transition transform shadow-lg"
                >
                  <h3 className="font-bold text-lg text-white">{event.title}</h3>
                  <p className="text-sm text-gray-300">{event.date}</p>
                  <p className="text-gray-200 mt-1">{event.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No upcoming events available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
