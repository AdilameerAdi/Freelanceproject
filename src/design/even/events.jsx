import React from "react";
import { Calendar, Clock, Star } from "lucide-react";

export default function Events({ events = [] }) {
  // Filter events by status
  const pastEvents = events.filter(event => event.status === "completed");
  const ongoingEvents = events.filter(event => event.status === "ongoing");
  const upcomingEvents = events.filter(event => event.status === "upcoming");

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-[#0a0f1f] via-[#0b132b] to-black text-white relative">
      {/* Neon Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.2),transparent_70%)]"></div>

      <h1 className="text-4xl font-extrabold text-center mb-10 tracking-wide 
        text-transparent bg-clip-text bg-gradient-to-r mt-10 from-purple-400 to-cyan-400">
        🚀 Game Events Hub
      </h1>

      {/* Ongoing Events - Full Width */}
      {ongoingEvents.length > 0 && (
        <div className="mb-10 relative">
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-xl border border-green-400/40 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2 mb-6">
              <Star className="animate-pulse" /> Ongoing Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ongoingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 bg-gradient-to-r from-green-600/30 to-emerald-600/30 rounded-xl border border-green-400/40 
                  hover:from-green-500/40 hover:to-emerald-500/40 hover:scale-[1.02] transition transform shadow-lg"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{event.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-white">{event.title}</h3>
                      <p className="text-sm text-gray-300">📅 {event.date}</p>
                      <p className="text-gray-200 mt-1">{event.description}</p>
                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-500/30 text-green-300 rounded-full">
                        LIVE NOW
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative">
        {/* Upcoming Events */}
        <div className="bg-[#111a2c]/80 backdrop-blur-xl border border-cyan-400/40 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2 mb-6">
            <Calendar /> Upcoming Events
          </h2>
          {upcomingEvents.length > 0 ? (
            <ul className="space-y-5">
              {upcomingEvents.map((event) => (
                <li
                  key={event.id}
                  className="p-4 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-xl border border-cyan-400/40 
                  hover:from-purple-500/30 hover:to-cyan-500/30 hover:scale-[1.02] transition transform shadow-lg"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{event.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-white">{event.title}</h3>
                      <p className="text-sm text-gray-300">📅 {event.date}</p>
                      <p className="text-gray-200 mt-1">{event.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic text-center py-8">No upcoming events available.</p>
          )}
        </div>

        {/* Past Events */}
        <div className="bg-[#111a2c]/80 backdrop-blur-xl border border-purple-500/40 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-purple-400 flex items-center gap-2 mb-6">
            <Clock /> Past Events
          </h2>
          {pastEvents.length > 0 ? (
            <ul className="space-y-5">
              {pastEvents.map((event) => (
                <li
                  key={event.id}
                  className="p-4 bg-[#0d1324] rounded-xl border border-gray-700 hover:border-purple-400 transition shadow-md opacity-75"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl grayscale">{event.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-300">{event.title}</h3>
                      <p className="text-sm text-gray-500">📅 {event.date}</p>
                      <p className="text-gray-400 mt-1">{event.description}</p>
                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-700 text-gray-400 rounded-full">
                        ENDED
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic text-center py-8">No past events available.</p>
          )}
        </div>
      </div>
    </div>
  );
}