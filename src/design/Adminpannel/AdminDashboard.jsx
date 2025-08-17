import React, { useState } from "react";
import { eventService, staffService } from "../../services/supabase";

export default function AdminDashboard({ staffMembers, setStaffMembers, events, setEvents, loadEvents, loadStaff }) {
  const [activeSection, setActiveSection] = useState("events");
  
  // Event Management State
  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    description: "",
    icon: "🎮",
    status: "upcoming"
  });
  const [editingEventId, setEditingEventId] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);

  // Staff Management State
  const [staffForm, setStaffForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "Moderator",
    avatar: ""
  });
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [showStaffForm, setShowStaffForm] = useState(false);

  // Event Management Functions
  const handleAddEvent = async () => {
    if (eventForm.title && eventForm.date && eventForm.description) {
      try {
        await eventService.createEvent(eventForm);
        await loadEvents(); // Refresh the events list
        resetEventForm();
        alert("Event created successfully!");
      } catch (error) {
        console.error('Error creating event:', error);
        alert("Failed to create event. Please try again.");
      }
    }
  };

  const handleUpdateEvent = async () => {
    try {
      await eventService.updateEvent(editingEventId, eventForm);
      await loadEvents(); // Refresh the events list
      resetEventForm();
      alert("Event updated successfully!");
    } catch (error) {
      console.error('Error updating event:', error);
      alert("Failed to update event. Please try again.");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await eventService.deleteEvent(id);
        await loadEvents(); // Refresh the events list
        alert("Event deleted successfully!");
      } catch (error) {
        console.error('Error deleting event:', error);
        alert("Failed to delete event. Please try again.");
      }
    }
  };

  const handleEditEvent = (event) => {
    setEventForm({
      title: event.title,
      date: event.date,
      description: event.description,
      icon: event.icon,
      status: event.status
    });
    setEditingEventId(event.id);
    setShowEventForm(true);
  };

  const resetEventForm = () => {
    setEventForm({
      title: "",
      date: "",
      description: "",
      icon: "🎮",
      status: "upcoming"
    });
    setEditingEventId(null);
    setShowEventForm(false);
  };

  // Staff Management Functions
  const handleAddStaff = async () => {
    if (staffForm.name && staffForm.username && staffForm.password && staffForm.role) {
      try {
        await staffService.createStaff(staffForm);
        await loadStaff(); // Refresh staff list
        resetStaffForm();
        alert("Staff member created successfully!");
      } catch (error) {
        console.error('Error creating staff:', error);
        alert("Failed to create staff member. Username might already exist.");
      }
    }
  };

  const handleUpdateStaff = async () => {
    try {
      await staffService.updateStaff(editingStaffId, staffForm);
      await loadStaff(); // Refresh staff list
      resetStaffForm();
      alert("Staff member updated successfully!");
    } catch (error) {
      console.error('Error updating staff:', error);
      alert("Failed to update staff member.");
    }
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm("Are you sure you want to remove this staff member?")) {
      try {
        await staffService.deleteStaff(id);
        await loadStaff(); // Refresh staff list
        alert("Staff member removed successfully!");
      } catch (error) {
        console.error('Error deleting staff:', error);
        alert("Failed to remove staff member.");
      }
    }
  };

  const handleEditStaff = (staff) => {
    setStaffForm({
      name: staff.name,
      username: staff.username,
      password: staff.password,
      role: staff.role,
      avatar: staff.avatar
    });
    setEditingStaffId(staff.id);
    setShowStaffForm(true);
  };

  const resetStaffForm = () => {
    setStaffForm({
      name: "",
      username: "",
      password: "",
      role: "Moderator",
      avatar: ""
    });
    setEditingStaffId(null);
    setShowStaffForm(false);
  };

  const changeAvatar = async (id, newUrl) => {
    try {
      await staffService.updateStaff(id, { avatar: newUrl });
      await loadStaff(); // Refresh staff list
      alert("Avatar updated successfully!");
    } catch (error) {
      console.error('Error updating avatar:', error);
      alert("Failed to update avatar. Please try again.");
    }
  };

  const changeJoinDate = async (id, newDate) => {
    try {
      await staffService.updateStaff(id, { joined: newDate });
      await loadStaff(); // Refresh staff list
      alert("Join date updated successfully!");
    } catch (error) {
      console.error('Error updating join date:', error);
      alert("Failed to update join date. Please try again.");
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "events":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Event Management</h2>
            <p className="text-gray-600 mb-6">
              Manage all events that appear on the website. These events will be displayed on the homepage slider and events page.
            </p>

            {/* Add/Edit Event Form */}
            {showEventForm && (
              <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">
                  {editingEventId ? "Edit Event" : "Add New Event"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Event Title</label>
                    <input
                      type="text"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter event title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Event Date</label>
                    <input
                      type="text"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., August 25, 2025"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Icon/Emoji</label>
                    <input
                      type="text"
                      value={eventForm.icon}
                      onChange={(e) => setEventForm({...eventForm, icon: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 🔥"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={eventForm.status}
                      onChange={(e) => setEventForm({...eventForm, status: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Enter event description"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={editingEventId ? handleUpdateEvent : handleAddEvent}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {editingEventId ? "Update Event" : "Add Event"}
                  </button>
                  <button
                    onClick={resetEventForm}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Add New Event Button */}
            {!showEventForm && (
              <button
                onClick={() => setShowEventForm(true)}
                className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                + Add New Event
              </button>
            )}

            {/* Events List */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Current Events ({events.length})</h3>
              {events.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No events created yet. Click "Add New Event" to get started.</p>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{event.icon}</span>
                            <h4 className="text-lg font-semibold">{event.title}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                              event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {event.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">📅 {event.date}</p>
                          <p className="text-gray-700">{event.description}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "staff":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Staff Management</h2>
            <p className="text-gray-600 mb-6">
              Add new staff members, manage their roles and credentials, and update their profiles.
            </p>

            {/* Add/Edit Staff Form */}
            {showStaffForm && (
              <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">
                  {editingStaffId ? "Edit Staff Member" : "Add New Staff Member"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      value={staffForm.name}
                      onChange={(e) => setStaffForm({...staffForm, name: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input
                      type="text"
                      value={staffForm.username}
                      onChange={(e) => setStaffForm({...staffForm, username: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                      type="text"
                      value={staffForm.password}
                      onChange={(e) => setStaffForm({...staffForm, password: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select
                      value={staffForm.role}
                      onChange={(e) => setStaffForm({...staffForm, role: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {staffService.getAvailableRoles().map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Avatar URL (Optional)</label>
                    <input
                      type="url"
                      value={staffForm.avatar}
                      onChange={(e) => setStaffForm({...staffForm, avatar: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={editingStaffId ? handleUpdateStaff : handleAddStaff}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {editingStaffId ? "Update Staff" : "Add Staff"}
                  </button>
                  <button
                    onClick={resetStaffForm}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Add New Staff Button */}
            {!showStaffForm && (
              <button
                onClick={() => setShowStaffForm(true)}
                className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                + Add New Staff Member
              </button>
            )}

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
                      className="w-16 h-16 rounded-full border-4 border-white cursor-pointer hover:opacity-80"
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
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <span>📝 Posts: {staff.posts}</span>
                      <span>❤️ Likes: {staff.likes}</span>
                      <span>⭐ Points: {staff.points}</span>
                      <span>👁️ Profile Hits: {staff.hits}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="px-6 py-3 flex flex-wrap gap-2 border-t">
                    <button
                      onClick={() => {
                        const newUrl = prompt("Enter new avatar URL:", staff.avatar);
                        if (newUrl && newUrl.trim() !== "") {
                          changeAvatar(staff.id, newUrl.trim());
                        }
                      }}
                      className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
                    >
                      Change Avatar
                    </button>
                    <button
                      onClick={() => {
                        const newDate = prompt("Enter new join date (e.g., Jan 15th 2024):", staff.joined);
                        if (newDate && newDate.trim() !== "") {
                          changeJoinDate(staff.id, newDate.trim());
                        }
                      }}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      Change Join Date
                    </button>
                    <button
                      onClick={() => handleEditStaff(staff)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      Edit Details
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(staff.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Remove
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
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Pending Problems</h2>
            <p className="text-gray-600 mb-6">
              View and manage pending problems submitted by users.
            </p>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-gray-500 text-center py-8">No pending problems at the moment.</p>
            </div>
          </div>
        );

      case "news":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">News Management</h2>
            <p className="text-gray-600 mb-6">
              Create and manage news posts for the website.
            </p>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                + Create News Post
              </button>
              <p className="text-gray-500 text-center py-8 mt-4">News management coming soon...</p>
            </div>
          </div>
        );

      case "updates":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Updates</h2>
            <p className="text-gray-600 mb-6">
              Post system updates and announcements.
            </p>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                + Post Update
              </button>
              <p className="text-gray-500 text-center py-8 mt-4">Updates management coming soon...</p>
            </div>
          </div>
        );

      case "info":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Information & Notices</h2>
            <p className="text-gray-600 mb-6">
              Post important notices and information for users.
            </p>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                + Create Notice
              </button>
              <p className="text-gray-500 text-center py-8 mt-4">Information management coming soon...</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center">
            🎮 NosDionisy Admin Dashboard
          </h1>
          <p className="text-center mt-2 text-blue-100">
            Manage events, staff, and content from one place
          </p>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  className={`w-full text-left p-3 rounded-lg transition ${
                    activeSection === "events"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveSection("events")}
                >
                  🎉 Events
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-3 rounded-lg transition ${
                    activeSection === "staff"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveSection("staff")}
                >
                  👥 Staff Management
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-3 rounded-lg transition ${
                    activeSection === "pending"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveSection("pending")}
                >
                  ⚠️ Pending Problems
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-3 rounded-lg transition ${
                    activeSection === "news"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveSection("news")}
                >
                  📰 Latest News
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-3 rounded-lg transition ${
                    activeSection === "updates"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveSection("updates")}
                >
                  🔄 Updates
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-3 rounded-lg transition ${
                    activeSection === "info"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveSection("info")}
                >
                  ℹ️ Information
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{renderSection()}</main>
      </div>
    </div>
  );
}