import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { staffService } from "../../services/supabase";

export default function Staff() {
  const [activeRole, setActiveRole] = useState(null);
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getRoleColor = (role) => {
    const colors = {
      'Leader': 'bg-yellow-500',
      'Developer': 'bg-red-500',
      'Administrator': 'bg-orange-500',
      'Community Manager': 'bg-green-500',
      'Game Master': 'bg-blue-500',
      'God of Balance': 'bg-yellow-400',
      'PvP Balance': 'bg-red-400',
      'PvE Balance': 'bg-green-400',
      'Moderator': 'bg-cyan-500',
      'Moderator Jr': 'bg-cyan-400',
      'VIP': 'bg-purple-500'
    };
    return colors[role] || 'bg-gray-500';
  };

  const getRoleDetails = (role) => {
    const details = {
      'Leader': 'The leader of the server. Full permissions.',
      'Developer': 'Responsible for coding and maintaining features.',
      'Administrator': 'Helps manage the server and staff team.',
      'Community Manager': 'Keeps the community active and engaged.',
      'Game Master': 'Hosts in-game events and activities.',
      'God of Balance': 'Ensures fairness across the game.',
      'PvP Balance': 'Manages balance for PvP combat.',
      'PvE Balance': 'Manages balance for PvE encounters.',
      'Moderator': 'Helps keep chats safe and fun.',
      'Moderator Jr': 'Junior moderators assisting staff.',
      'VIP': 'Special VIP members with perks.'
    };
    return details[role] || 'Staff member helping to maintain the server.';
  };

  useEffect(() => {
    loadStaffMembers();
  }, []);

  const loadStaffMembers = async () => {
    try {
      const staff = await staffService.getAllStaff();
      setStaffMembers(staff);
    } catch (error) {
      console.error('Error loading staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = (index) => {
    setActiveRole(activeRole === index ? null : index);
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

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Server Staff</h1>
      
      {staffMembers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No staff members found.</p>
          <p className="text-gray-500 text-sm mt-2">Staff members will appear here once they are added by administrators.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {staffMembers.map((staff, index) => (
            <div key={staff.id} className="rounded-xl bg-gray-800 shadow-lg overflow-hidden">
              {/* Banner */}
              <div className="h-24 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700" />

              {/* Profile Row */}
              <div className="flex items-center -mt-12 px-6 relative">
                <img
                  src={staff.avatar || 'https://i.pravatar.cc/100?img=1'}
                  alt={staff.name}
                  className="w-20 h-20 rounded-full border-4 border-gray-800"
                />
                <div className="ml-4">
                  <h2 className="text-lg font-bold">{staff.name}</h2>
                  <span className={`px-2 py-1 text-xs rounded-lg ${getRoleColor(staff.role)}`}>
                    {staff.role}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="px-6 py-3 text-sm text-gray-300 border-t border-gray-700">
                <p>Member since {staff.joined}</p>
                <p>
                  Posts: {staff.posts}, Likes: {staff.likes}, Points: {staff.points}, Profile Hits: {staff.hits}
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
                  <p className="text-gray-300">{getRoleDetails(staff.role)}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
