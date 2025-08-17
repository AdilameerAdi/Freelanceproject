import React, { useState } from "react";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("events");

  // Staff Members State (starts with empty stats)
  const [staffMembers, setStaffMembers] = useState([
    {
      id: 1,
      name: "Leader",
      role: "Leader",
      avatar: "https://i.pravatar.cc/100?img=1",
      joined: "Dec 12th 2023",
      posts: 0,
      likes: 0,
      points: 0,
      hits: 0,
    },
    {
      id: 2,
      name: "Community Manager",
      role: "Community Manager",
      avatar: "https://i.pravatar.cc/100?img=2",
      joined: "Dec 12th 2023",
      posts: 0,
      likes: 0,
      points: 0,
      hits: 0,
    },
  ]);

  // Update staff stats (posts, likes, hits)
  const updateStaffStat = (id, field) => {
    setStaffMembers((prev) =>
      prev.map((staff) =>
        staff.id === id ? { ...staff, [field]: staff[field] + 1 } : staff
      )
    );
  };

  // Change profile photo
  const changePhoto = (id, newUrl) => {
    setStaffMembers((prev) =>
      prev.map((staff) =>
        staff.id === id ? { ...staff, avatar: newUrl } : staff
      )
    );
  };

  // Change join date
  const changeJoinDate = (id, newDate) => {
    setStaffMembers((prev) =>
      prev.map((staff) =>
        staff.id === id ? { ...staff, joined: newDate } : staff
      )
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case "events":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Events</h2>
            <p className="text-gray-600 mb-4">
              Add, update, or remove events displayed on the slider/banner.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Existing Events:</h3>
              <ul className="list-disc list-inside mb-4">
                <li>
                  Event 1
                  <button className="ml-2 px-2 py-1 bg-red-500 text-white rounded">
                    Delete
                  </button>
                </li>
                <li>
                  Event 2
                  <button className="ml-2 px-2 py-1 bg-red-500 text-white rounded">
                    Delete
                  </button>
                </li>
              </ul>
              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                Add New Event
              </button>
            </div>
          </div>
        );

      case "staff":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Staff Management</h2>
            <p className="text-gray-600 mb-4">
              View and manage staff members, assign roles, and update profiles.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {staffMembers.map((staff) => (
                <div
                  key={staff.id}
                  className="bg-white shadow-lg rounded-xl overflow-hidden"
                >
                  {/* Banner */}
                  <div className="h-20 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700" />

                  {/* Profile Row */}
                  <div className="flex items-center -mt-10 px-6 relative">
                    <img
                      src={staff.avatar}
                      alt={staff.name}
                      className="w-16 h-16 rounded-full border-4 border-white cursor-pointer"
                      onClick={() => updateStaffStat(staff.id, "hits")}
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-bold">{staff.name}</h3>
                      <span className="text-sm text-gray-500">{staff.role}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="px-6 py-3 text-sm text-gray-700 border-t">
                    <p>Member since {staff.joined}</p>
                    <p>
                      Posts: {staff.posts}, Likes: {staff.likes}, Points:{" "}
                      {staff.points}, Profile Hits: {staff.hits}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="px-6 py-3 flex gap-2 border-t">
                    <button
                      onClick={() => updateStaffStat(staff.id, "posts")}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      + Post
                    </button>
                    <button
                      onClick={() => updateStaffStat(staff.id, "likes")}
                      className="px-3 py-1 bg-green-500 text-white rounded"
                    >
                      + Like
                    </button>
                    <button
                      onClick={() =>
                        changePhoto(
                          staff.id,
                          prompt("Enter new photo URL:", staff.avatar)
                        )
                      }
                      className="px-3 py-1 bg-purple-500 text-white rounded"
                    >
                      Change Photo
                    </button>
                    <button
                      onClick={() =>
                        changeJoinDate(
                          staff.id,
                          prompt("Enter new join date:", staff.joined)
                        )
                      }
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Change Date
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "pending":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Pending Problems</h2>
            <p className="text-gray-600 mb-4">
              View pending problems submitted by users. Respond, resolve, or
              assign them to staff.
            </p>
          </div>
        );

      case "news":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Latest News</h2>
            <p className="text-gray-600 mb-4">
              Create and manage news posts for users.
            </p>
          </div>
        );

      case "updates":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Updates</h2>
            <p className="text-gray-600 mb-4">
              Post updates related to system or user activities.
            </p>
          </div>
        );

      case "info":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Information / Notices
            </h2>
            <p className="text-gray-600 mb-4">
              Post important notices or upcoming events for users.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Heading */}
      <header className="bg-blue-600 text-white p-6">
        <h1 className="text-3xl font-bold text-center">
          Manage Everything Through This Admin Panel
        </h1>
      </header>

      {/* Main layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-1/4 bg-gray-200 p-4 min-h-screen">
          <ul className="space-y-2">
            <li
              className={`p-2 rounded cursor-pointer ${
                activeSection === "events"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-300"
              }`}
              onClick={() => setActiveSection("events")}
            >
              Events
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${
                activeSection === "staff"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-300"
              }`}
              onClick={() => setActiveSection("staff")}
            >
              Staff Management
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${
                activeSection === "pending"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-300"
              }`}
              onClick={() => setActiveSection("pending")}
            >
              Pending Problems
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${
                activeSection === "news"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-300"
              }`}
              onClick={() => setActiveSection("news")}
            >
              Latest News
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${
                activeSection === "updates"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-300"
              }`}
              onClick={() => setActiveSection("updates")}
            >
              Updates
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${
                activeSection === "info"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-300"
              }`}
              onClick={() => setActiveSection("info")}
            >
              Information / Notices
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{renderSection()}</main>
      </div>
    </div>
  );
}
