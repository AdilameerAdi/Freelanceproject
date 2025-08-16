import  { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // icons

export default function Staff() {
  const [activeRole, setActiveRole] = useState(null);

  const roles = [
    { name: "Leader", members: 1, color: "bg-yellow-500", details: "The leader of the server. Full permissions." },
    { name: "Developer", members: 1, color: "bg-red-500", details: "Responsible for coding and maintaining features." },
    { name: "Administrator", members: 2, color: "bg-orange-500", details: "Helps manage the server and staff team." },
    { name: "Community Manager", members: 1, color: "bg-green-500", details: "Keeps the community active and engaged." },
    { name: "Game Master", members: 0, color: "bg-blue-500", details: "Hosts in-game events and activities." },
    { name: "God of Balance", members: 1, color: "bg-yellow-400", details: "Ensures fairness across the game." },
    { name: "PvP Balance", members: 1, color: "bg-red-400", details: "Manages balance for PvP combat." },
    { name: "PvE Balance", members: 1, color: "bg-green-400", details: "Manages balance for PvE encounters." },
    { name: "Moderator", members: 0, color: "bg-cyan-500", details: "Helps keep chats safe and fun." },
    { name: "Moderator Jr", members: 12, color: "bg-cyan-400", details: "Junior moderators assisting staff." },
    { name: "VIP", members: 0, color: "bg-purple-500", details: "Special VIP members with perks." },
  ];

  const toggleRole = (index) => {
    setActiveRole(activeRole === index ? null : index);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Server Roles</h1>
      <div className="space-y-4">
        {roles.map((role, index) => (
          <div key={index} className="rounded-xl bg-gray-800 shadow">
            {/* Role row */}
            <div
              onClick={() => toggleRole(index)}
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-700 transition"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full ${role.color}`}></div>
                <span className="font-medium">{role.name}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">
                  {role.members} Member{role.members !== 1 ? "s" : ""}
                </span>
                {activeRole === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Dropdown details */}
            {activeRole === index && (
              <div className="p-4 bg-gray-700 text-center border-t border-gray-600">
                <h2 className="font-semibold mb-2">{role.name} Details</h2>
                <p className="text-gray-300">{role.details}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
