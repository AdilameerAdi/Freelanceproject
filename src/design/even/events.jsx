import React from "react";

export default function Events() {
  const pastEvents = [
    { title: "Summer Festival", date: "June 2023", description: "A fun-filled summer event with rewards." },
    { title: "PvP Tournament", date: "August 2023", description: "Competitive PvP battles with prizes." },
    { title: "Halloween Bash", date: "October 2023", description: "Spooky-themed quests and items." },
  ];

  const upcomingEvents = [
    { title: "Winter Wonderland", date: "December 2025", description: "Holiday event with special gifts." },
    { title: "Anniversary Celebration", date: "February 2026", description: "Celebrating another year with rewards." },
  ];

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Past Events */}
        <div className="bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">
            Past Events
          </h2>
          {pastEvents.length > 0 ? (
            <ul className="space-y-4">
              {pastEvents.map((event, idx) => (
                <li key={idx} className="p-3 bg-gray-700 rounded-lg">
                  <h3 className="font-bold">{event.title}</h3>
                  <p className="text-sm text-gray-400">{event.date}</p>
                  <p className="text-gray-300">{event.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No past events available.</p>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">
            Upcoming Events
          </h2>
          {upcomingEvents.length > 0 ? (
            <ul className="space-y-4">
              {upcomingEvents.map((event, idx) => (
                <li key={idx} className="p-3 bg-gray-700 rounded-lg">
                  <h3 className="font-bold">{event.title}</h3>
                  <p className="text-sm text-gray-400">{event.date}</p>
                  <p className="text-gray-300">{event.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No upcoming events available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
