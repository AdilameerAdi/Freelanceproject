import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Staff() {
  const [activeRole, setActiveRole] = useState(null);

  const roles = [
    { 
      name: "Leader",
      color: "bg-yellow-500",
      details: "The leader of the server. Full permissions.",
      avatar: "https://i.pravatar.cc/100?img=1",
      joined: "Dec 12th 2023",
      posts: 621,
      likes: 59,
      points: 5484,
      hits: 284
    },
    { 
      name: "Developer",
      color: "bg-red-500",
      details: "Responsible for coding and maintaining features.",
      avatar: "https://i.pravatar.cc/100?img=2",
      joined: "Jan 5th 2024",
      posts: 410,
      likes: 120,
      points: 4780,
      hits: 652
    },
    { 
      name: "Administrator",
      color: "bg-orange-500",
      details: "Helps manage the server and staff team.",
      avatar: "https://i.pravatar.cc/100?img=3",
      joined: "Feb 2nd 2024",
      posts: 295,
      likes: 88,
      points: 3300,
      hits: 502
    },
    { 
      name: "Community Manager",
      color: "bg-green-500",
      details: "Keeps the community active and engaged.",
      avatar: "https://i.pravatar.cc/100?img=4",
      joined: "Mar 18th 2024",
      posts: 500,
      likes: 220,
      points: 6100,
      hits: 890
    },
    { 
      name: "Game Master",
      color: "bg-blue-500",
      details: "Hosts in-game events and activities.",
      avatar: "https://i.pravatar.cc/100?img=5",
      joined: "Apr 10th 2024",
      posts: 0,
      likes: 0,
      points: 0,
      hits: 0
    },
    { 
      name: "God of Balance",
      color: "bg-yellow-400",
      details: "Ensures fairness across the game.",
      avatar: "https://i.pravatar.cc/100?img=6",
      joined: "May 15th 2024",
      posts: 102,
      likes: 45,
      points: 2200,
      hits: 330
    },
    { 
      name: "PvP Balance",
      color: "bg-red-400",
      details: "Manages balance for PvP combat.",
      avatar: "https://i.pravatar.cc/100?img=7",
      joined: "Jun 1st 2024",
      posts: 150,
      likes: 50,
      points: 2500,
      hits: 400
    },
    { 
      name: "PvE Balance",
      color: "bg-green-400",
      details: "Manages balance for PvE encounters.",
      avatar: "https://i.pravatar.cc/100?img=8",
      joined: "Jul 20th 2024",
      posts: 210,
      likes: 70,
      points: 3200,
      hits: 520
    },
    { 
      name: "Moderator",
      color: "bg-cyan-500",
      details: "Helps keep chats safe and fun.",
      avatar: "https://i.pravatar.cc/100?img=9",
      joined: "Aug 5th 2024",
      posts: 0,
      likes: 0,
      points: 0,
      hits: 0
    },
    { 
      name: "Moderator Jr",
      color: "bg-cyan-400",
      details: "Junior moderators assisting staff.",
      avatar: "https://i.pravatar.cc/100?img=10",
      joined: "Sep 9th 2024",
      posts: 180,
      likes: 60,
      points: 2000,
      hits: 390
    },
    { 
      name: "VIP",
      color: "bg-purple-500",
      details: "Special VIP members with perks.",
      avatar: "https://i.pravatar.cc/100?img=11",
      joined: "Oct 1st 2024",
      posts: 0,
      likes: 0,
      points: 0,
      hits: 0
    }
  ];

  const toggleRole = (index) => {
    setActiveRole(activeRole === index ? null : index);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Server Staff</h1>

      <div className="space-y-6">
        {roles.map((role, index) => (
          <div key={index} className="rounded-xl bg-gray-800 shadow-lg overflow-hidden">
            {/* Banner */}
            <div className="h-24 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700" />

            {/* Profile Row */}
            <div className="flex items-center -mt-12 px-6 relative">
              <img
                src={role.avatar}
                alt={role.name}
                className="w-20 h-20 rounded-full border-4 border-gray-800"
              />
              <div className="ml-4">
                <h2 className="text-lg font-bold">{role.name}</h2>
                <span className={`px-2 py-1 text-xs rounded-lg ${role.color}`}>
                  {role.name}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="px-6 py-3 text-sm text-gray-300 border-t border-gray-700">
              <p>Member since {role.joined}</p>
              <p>
                Posts: {role.posts}, Likes: {role.likes}, Points: {role.points}, Profile Hits: {role.hits}
              </p>
            </div>

            {/* Toggle */}
            <div
              onClick={() => toggleRole(index)}
              className="flex justify-between items-center px-6 py-3 cursor-pointer hover:bg-gray-700 border-t border-gray-700 transition"
            >
              <span className="text-gray-400 text-sm">More Details</span>
              {activeRole === index ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {/* Details */}
            {activeRole === index && (
              <div className="px-6 py-4 bg-gray-700 border-t border-gray-600 text-center">
                <p className="text-gray-300">{role.details}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
