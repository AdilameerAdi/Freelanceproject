import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { staffService } from "../../services/supabase";

export default function Staff() {
  const [activeRole, setActiveRole] = useState(null);
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getRoleColor = (role) => {
    const colors = {
      Leader: "bg-yellow-500",
      Developer: "bg-red-500",
      Administrator: "bg-orange-500",
      "Community Manager": "bg-green-500",
      "Game Master": "bg-blue-500",
      "God of Balance": "bg-yellow-400",
      "PvP Balance": "bg-red-400",
      "PvE Balance": "bg-green-400",
      Moderator: "bg-cyan-500",
      "Moderator Jr": "bg-cyan-400",
      VIP: "bg-purple-500",
    };
    return colors[role] || "bg-gray-500";
  };

  useEffect(() => {
    loadStaffMembers();
  }, []);

  const loadStaffMembers = async () => {
    try {
      const staff = await staffService.getAllStaff();
      setStaffMembers(staff);
    } catch (error) {
      console.error("Error loading staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = (role) => {
    setActiveRole(activeRole === role ? null : role);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading staff members...</p>
        </div>
      </div>
    );
  }

  // Group members by role
  const roles = [...new Set(staffMembers.map((s) => s.role))];
  const membersByRole = {};
  roles.forEach((role) => {
    membersByRole[role] = staffMembers.filter((s) => s.role === role);
  });

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Server Roles</h1>

      {roles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No staff members found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {roles.map((role) => (
            <div
              key={role}
              className="rounded-lg bg-gray-800 border border-gray-700 overflow-hidden"
            >
              {/* Role Header */}
              <div
                onClick={() => toggleRole(role)}
                className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-700 transition"
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`w-6 h-6 inline-block rounded-full ${getRoleColor(
                      role
                    )}`}
                  ></span>
                  <span className="font-medium text-white">{role}</span>
                </div>
                {activeRole === role ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {/* Expanded Members */}
              {activeRole === role && (
  <div className="bg-gray-900/70 border-t border-gray-700 p-4 space-y-3">
    {membersByRole[role].map((member) => (
      <div
        key={member.id}
        className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 bg-gray-800 rounded-lg space-y-2 md:space-y-0"
      >
        {/* Left: Avatar + Name + Role + Language */}
        <div className="flex items-center space-x-3">
          <img
            src={member.avatar || "https://i.pravatar.cc/100?img=1"}
            alt={member.name}
            className="w-12 h-12 rounded-full border-2 border-gray-700"
          />
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">{member.name}</span>
              <span
                className={`px-2 py-1 text-xs rounded ${getRoleColor(
                  member.role
                )}`}
              >
                {member.role}
              </span>
              {member.languages && (
                <span className="bg-gray-700 text-xs px-1 rounded">
                  {member.languages.join("/")}
                </span>
              )}
            </div>
            <div className="text-gray-400 text-sm">
              Member since: {member.joined}
            </div>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="flex space-x-4 mt-2 md:mt-0 text-gray-400 text-sm">
          <span>Posts: {member.posts}</span>
          <span>Likes: {member.likes}</span>
          <span>Points: {member.points}</span>
          <span>Profile Hits: {member.profileHits}</span>
        </div>

        {/* Optional: Private Profile Message */}
        {member.private && (
          <p className="text-center text-gray-500 text-xs mt-2 md:mt-0">
            This member limits who may view their full profile.
          </p>
        )}
      </div>
    ))}
  </div>
)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
