import React from "react";
import { Calendar, Clock, Star } from "lucide-react";

export default function Events({ events = [] }) {
  // Filter events by status
  const pastEvents = events.filter(event => event.status === "completed");
  const ongoingEvents = events.filter(event => event.status === "ongoing");
  const upcomingEvents = events.filter(event => event.status === "upcoming");

  return (
    <div className="p-3 sm:p-6 lg:p-8 min-h-screen bg-gradient-to-b from-[#0a0f1f] via-[#0b132b] to-black text-white relative">
      {/* Neon Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.2),transparent_70%)]"></div>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center mb-6 sm:mb-8 lg:mb-10 tracking-wide 
        text-transparent bg-clip-text bg-gradient-to-r mt-6 sm:mt-8 lg:mt-10 from-purple-400 to-cyan-400">
        🚀 Game Events Hub
      </h1>

      {/* Ongoing Events - Full Width */}
      {ongoingEvents.length > 0 && (
        <div className="mb-6 sm:mb-8 lg:mb-10 relative">
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-xl border border-green-400/40 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-green-400 flex items-center gap-2 mb-4 sm:mb-6">
              <Star className="animate-pulse" /> Ongoing Events
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {ongoingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 sm:p-4 bg-gradient-to-r from-green-600/30 to-emerald-600/30 rounded-xl border border-green-400/40 
                  hover:from-green-500/40 hover:to-emerald-500/40 hover:scale-[1.02] transition transform shadow-lg"
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-2xl sm:text-3xl flex-shrink-0">{event.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg text-white break-words">{event.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-300">📅 {event.date}</p>
                      <p className="text-gray-200 mt-1 text-sm">{event.description}</p>
                      <span className="inline-block mt-2 px-2 sm:px-3 py-1 text-xs bg-green-500/30 text-green-300 rounded-full font-semibold">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 relative">
        {/* Upcoming Events */}
        <div className="bg-[#111a2c]/80 backdrop-blur-xl border border-cyan-400/40 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-cyan-400 flex items-center gap-2 mb-4 sm:mb-6">
            <Calendar className="flex-shrink-0" /> Upcoming Events
          </h2>
          {upcomingEvents.length > 0 ? (
            <ul className="space-y-5">
              {upcomingEvents.map((event) => (
                <li
                  key={event.id}
                  className="p-3 sm:p-4 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-xl border border-cyan-400/40 
                  hover:from-purple-500/30 hover:to-cyan-500/30 hover:scale-[1.02] transition transform shadow-lg"
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl flex-shrink-0">{event.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg text-white break-words">{event.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-300">📅 {event.date}</p>
                      <p className="text-gray-200 mt-1 text-sm">{event.description}</p>
                      <span className="inline-block mt-2 px-2 sm:px-3 py-1 text-xs bg-cyan-500/30 text-cyan-300 rounded-full font-semibold">
                        UPCOMING
                      </span>
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
        <div className="bg-[#111a2c]/80 backdrop-blur-xl border border-purple-500/40 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-purple-400 flex items-center gap-2 mb-4 sm:mb-6">
            <Clock className="flex-shrink-0" /> Past Events
          </h2>
          {pastEvents.length > 0 ? (
            <ul className="space-y-5">
              {pastEvents.map((event) => (
                <li
                  key={event.id}
                  className="p-3 sm:p-4 bg-[#0d1324] rounded-xl border border-gray-700 hover:border-purple-400 transition shadow-md opacity-75"
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl grayscale flex-shrink-0">{event.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg text-gray-300 break-words">{event.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">📅 {event.date}</p>
                      <p className="text-gray-400 mt-1 text-sm">{event.description}</p>
                      <span className="inline-block mt-2 px-2 sm:px-3 py-1 text-xs bg-gray-700 text-gray-400 rounded-full font-semibold">
                        COMPLETED
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