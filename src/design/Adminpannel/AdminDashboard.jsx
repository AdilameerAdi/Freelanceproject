import React, { useState, useEffect } from "react";
import { eventService, staffService, supportService, updateService } from "../../services/supabase";

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

  // Support tickets state
  const [pendingTickets, setPendingTickets] = useState([]);
  const [resolvedTickets, setResolvedTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  // Updates state
  const [updates, setUpdates] = useState([]);
  const [updateForm, setUpdateForm] = useState({
    title: "",
    content: "",
    version: "",
    category: "general",
    priority: "medium",
    is_featured: false
  });
  const [editingUpdateId, setEditingUpdateId] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updatesLoading, setUpdatesLoading] = useState(false);

  useEffect(() => {
    if (activeSection === "pending") {
      loadTickets();
    } else if (activeSection === "updates") {
      loadUpdates();
    }
  }, [activeSection]);

  const loadTickets = async () => {
    try {
      setTicketsLoading(true);
      const [pending, resolved] = await Promise.all([
        supportService.getPendingTickets(),
        supportService.getResolvedTickets()
      ]);
      setPendingTickets(pending);
      setResolvedTickets(resolved);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setTicketsLoading(false);
    }
  };

  const handleResolveTicket = async (ticketId, adminResponse = null) => {
    try {
      await supportService.updateTicketStatus(ticketId, 'resolved', adminResponse, 'Admin');
      await loadTickets(); // Refresh tickets
      alert('Ticket resolved successfully!');
    } catch (error) {
      console.error('Error resolving ticket:', error);
      alert('Failed to resolve ticket. Please try again.');
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      try {
        await supportService.deleteTicket(ticketId);
        await loadTickets(); // Refresh tickets
        alert('Ticket deleted successfully!');
      } catch (error) {
        console.error('Error deleting ticket:', error);
        alert('Failed to delete ticket. Please try again.');
      }
    }
  };

  // Updates Management Functions
  const loadUpdates = async () => {
    try {
      setUpdatesLoading(true);
      const updatesData = await updateService.getAllUpdatesAdmin();
      setUpdates(updatesData);
    } catch (error) {
      console.error('Error loading updates:', error);
    } finally {
      setUpdatesLoading(false);
    }
  };

  const handleAddUpdate = async () => {
    if (updateForm.title && updateForm.content) {
      try {
        const updateData = {
          ...updateForm,
          author_id: 1, // This should be the current admin's ID
          author_name: "Admin" // This should be the current admin's name
        };
        
        await updateService.createUpdate(updateData);
        await loadUpdates();
        resetUpdateForm();
        alert("Update created successfully!");
      } catch (error) {
        console.error('Error creating update:', error);
        alert("Failed to create update. Please try again.");
      }
    }
  };

  const handleUpdateUpdate = async () => {
    try {
      await updateService.updateUpdate(editingUpdateId, updateForm);
      await loadUpdates();
      resetUpdateForm();
      alert("Update updated successfully!");
    } catch (error) {
      console.error('Error updating update:', error);
      alert("Failed to update update. Please try again.");
    }
  };

  const handleDeleteUpdate = async (id) => {
    if (window.confirm("Are you sure you want to delete this update?")) {
      try {
        await updateService.deleteUpdate(id);
        await loadUpdates();
        alert("Update deleted successfully!");
      } catch (error) {
        console.error('Error deleting update:', error);
        alert("Failed to delete update. Please try again.");
      }
    }
  };

  const handleEditUpdate = (update) => {
    setUpdateForm({
      title: update.title,
      content: update.content,
      version: update.version || "",
      category: update.category,
      priority: update.priority,
      is_featured: update.is_featured
    });
    setEditingUpdateId(update.id);
    setShowUpdateForm(true);
  };

  const resetUpdateForm = () => {
    setUpdateForm({
      title: "",
      content: "",
      version: "",
      category: "general",
      priority: "medium",
      is_featured: false
    });
    setEditingUpdateId(null);
    setShowUpdateForm(false);
  };

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
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Support Tickets Management</h2>
            <p className="text-gray-600 mb-6">
              View and manage support tickets submitted by users.
            </p>

            {ticketsLoading ? (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Loading tickets...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Pending Tickets */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-yellow-600 flex items-center gap-2">
                    ⚠️ Pending Tickets ({pendingTickets.length})
                  </h3>
                  {pendingTickets.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No pending tickets at the moment.</p>
                  ) : (
                    <div className="space-y-4">
                      {pendingTickets.map((ticket) => (
                        <div key={ticket.id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gray-800">{ticket.title}</h4>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span>👤 {ticket.user_name}</span>
                                <span>📧 {ticket.user_email}</span>
                                <span>🏷️ {ticket.category}</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                  ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                  ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {ticket.priority} priority
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => {
                                  const response = prompt("Enter admin response (optional):");
                                  handleResolveTicket(ticket.id, response);
                                }}
                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
                              >
                                ✅ Resolve
                              </button>
                              <button
                                onClick={() => handleDeleteTicket(ticket.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">{ticket.description}</p>
                          <p className="text-xs text-gray-500">
                            Submitted: {new Date(ticket.created_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Resolved Tickets */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-green-600 flex items-center gap-2">
                    ✅ Resolved Tickets ({resolvedTickets.length})
                  </h3>
                  {resolvedTickets.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No resolved tickets yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {resolvedTickets.map((ticket) => (
                        <div key={ticket.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gray-800">{ticket.title}</h4>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span>👤 {ticket.user_name}</span>
                                <span>📧 {ticket.user_email}</span>
                                <span>🏷️ {ticket.category}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteTicket(ticket.id)}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm ml-4"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                          <p className="text-gray-700 mb-3">{ticket.description}</p>
                          {ticket.admin_response && (
                            <div className="bg-green-100 border-l-4 border-green-400 p-3 mb-3">
                              <p className="text-sm font-semibold text-green-700">Admin Response:</p>
                              <p className="text-green-800">{ticket.admin_response}</p>
                            </div>
                          )}
                          <div className="text-xs text-gray-500 space-y-1">
                            <p>Submitted: {new Date(ticket.created_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</p>
                            <p>Resolved: {new Date(ticket.resolved_at || ticket.updated_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })} {ticket.resolved_by && `by ${ticket.resolved_by}`}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
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
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Updates Management</h2>
            <p className="text-gray-600 mb-6">
              Create and manage system updates, announcements, and version releases.
            </p>

            {/* Add/Edit Update Form */}
            {showUpdateForm && (
              <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">
                  {editingUpdateId ? "Edit Update" : "Create New Update"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Update Title</label>
                    <input
                      type="text"
                      value={updateForm.title}
                      onChange={(e) => setUpdateForm({...updateForm, title: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter update title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Version (Optional)</label>
                    <input
                      type="text"
                      value={updateForm.version}
                      onChange={(e) => setUpdateForm({...updateForm, version: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., v1.2.3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={updateForm.category}
                      onChange={(e) => setUpdateForm({...updateForm, category: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {updateService.getCategories().map(category => (
                        <option key={category} value={category}>
                          {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <select
                      value={updateForm.priority}
                      onChange={(e) => setUpdateForm({...updateForm, priority: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {updateService.getPriorities().map(priority => (
                        <option key={priority.value} value={priority.value}>{priority.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Update Content</label>
                    <textarea
                      value={updateForm.content}
                      onChange={(e) => setUpdateForm({...updateForm, content: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="6"
                      placeholder="Describe the update details, changes, and any important information..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={updateForm.is_featured}
                        onChange={(e) => setUpdateForm({...updateForm, is_featured: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">Featured Update (appears prominently on user side)</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={editingUpdateId ? handleUpdateUpdate : handleAddUpdate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {editingUpdateId ? "Update" : "Create"} Update
                  </button>
                  <button
                    onClick={resetUpdateForm}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Add New Update Button */}
            {!showUpdateForm && (
              <button
                onClick={() => setShowUpdateForm(true)}
                className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                + Create New Update
              </button>
            )}

            {/* Updates List */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">All Updates ({updates.length})</h3>
              {updatesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p>Loading updates...</p>
                </div>
              ) : updates.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No updates created yet. Click "Create New Update" to get started.</p>
              ) : (
                <div className="space-y-4">
                  {updates.map((update) => (
                    <div key={update.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold">{update.title}</h4>
                            {update.version && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                                {update.version}
                              </span>
                            )}
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                              update.priority === 'critical' ? 'bg-red-100 text-red-800' :
                              update.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              update.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {update.priority}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                              {update.category.replace('-', ' ')}
                            </span>
                            {update.is_featured && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                                ⭐ Featured
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">By {update.author_name}</p>
                          <p className="text-gray-700 mb-2">{update.content}</p>
                          <p className="text-xs text-gray-500">
                            Created: {new Date(update.created_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEditUpdate(update)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUpdate(update.id)}
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