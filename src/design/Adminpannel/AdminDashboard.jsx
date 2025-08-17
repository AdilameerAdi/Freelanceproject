import React, { useState, useEffect } from "react";
import { eventService, staffService, supportService, updateService, postService, imageUploadService } from "../../services/supabase";

export default function AdminDashboard({ staffMembers, setStaffMembers, events, setEvents, loadEvents, loadStaff }) {
  const [activeSection, setActiveSection] = useState("events");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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

  // News/Posts state
  const [posts, setPosts] = useState([]);
  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    image_url: ""
  });
  const [postImageFile, setPostImageFile] = useState(null);
  const [postImagePreview, setPostImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);

  useEffect(() => {
    if (activeSection === "pending") {
      loadTickets();
    } else if (activeSection === "updates") {
      loadUpdates();
    } else if (activeSection === "news") {
      loadPosts();
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

  // News/Posts Management Functions
  const loadPosts = async () => {
    try {
      setPostsLoading(true);
      const allPosts = await postService.getAllPosts();
      // Filter to show admin posts in admin panel
      const adminPosts = allPosts.filter(post => post.author_type === 'admin');
      setPosts(adminPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleAddPost = async () => {
    if (!postForm.title.trim()) {
      alert("Please enter a post title.");
      return;
    }
    if (!postForm.content.trim()) {
      alert("Please enter post content.");
      return;
    }

    try {
      setUploadingImage(true);
      
      // Upload image if selected
      let imageUrl = postForm.image_url;
      if (postImageFile) {
        try {
          imageUrl = await imageUploadService.uploadImage(postImageFile);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          // Continue without image if upload fails
          imageUrl = "";
        }
      }
      
      const authorData = {
        id: null, // Admin posts don't need staff table reference
        name: "Admin", // This should be the current admin's name
        avatar: "https://i.pravatar.cc/100?img=admin" // Admin avatar
      };
      
      await postService.createPost({...postForm, image_url: imageUrl}, authorData, 'admin');
      await loadPosts();
      resetPostForm();
      alert("News post created successfully!");
    } catch (error) {
      console.error('Error creating post:', error);
      console.error('Error details:', error.message);
      alert(`Failed to create post: ${error.message || 'Please try again.'}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdatePost = async () => {
    try {
      // Note: We would need to add an updatePost function to postService
      // For now, we'll show an alert
      alert("Post update functionality coming soon!");
      resetPostForm();
    } catch (error) {
      console.error('Error updating post:', error);
      alert("Failed to update post. Please try again.");
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postService.deletePost(id, 1); // Admin ID
        await loadPosts();
        alert("Post deleted successfully!");
      } catch (error) {
        console.error('Error deleting post:', error);
        alert("Failed to delete post. Please try again.");
      }
    }
  };

  const handleEditPost = (post) => {
    setPostForm({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || ""
    });
    setEditingPostId(post.id);
    setShowPostForm(true);
  };

  const handlePostImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setPostImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetPostForm = () => {
    setPostForm({
      title: "",
      content: "",
      excerpt: "",
      image_url: ""
    });
    setPostImageFile(null);
    setPostImagePreview("");
    setEditingPostId(null);
    setShowPostForm(false);
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">Event Management</h2>
            <p className="text-gray-300 mb-6">
              Manage all events that appear on the website. These events will be displayed on the homepage slider and events page.
            </p>

            {/* Add/Edit Event Form */}
            {showEventForm && (
              <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg mb-4 sm:mb-6 border border-gray-700">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">
                  {editingEventId ? "Edit Event" : "Add New Event"}
                </h3>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 min-w-0">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-200">Event Title</label>
                    <input
                      type="text"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      placeholder="Enter event title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-200">Event Date</label>
                    <input
                      type="text"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      placeholder="e.g., August 25, 2025"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-200">Icon/Emoji</label>
                    <input
                      type="text"
                      value={eventForm.icon}
                      onChange={(e) => setEventForm({...eventForm, icon: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      placeholder="e.g., 🔥"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-200">Status</label>
                    <select
                      value={eventForm.status}
                      onChange={(e) => setEventForm({...eventForm, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-gray-200">Description</label>
                    <textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      rows="3"
                      placeholder="Enter event description"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4 flex-wrap">
                  <button
                    onClick={editingEventId ? handleUpdateEvent : handleAddEvent}
                    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition"
                  >
                    {editingEventId ? "Update Event" : "Add Event"}
                  </button>
                  <button
                    onClick={resetEventForm}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
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
                className="mb-6 w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition"
              >
                + Add New Event
              </button>
            )}

            {/* Events List */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-white">Current Events ({events.length})</h3>
              {events.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No events created yet. Click "Add New Event" to get started.</p>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="border border-gray-600 bg-gray-700 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{event.icon}</span>
                            <h4 className="text-lg font-semibold text-white break-words line-clamp-2">{event.title}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                              event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {event.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mb-1">📅 {event.date}</p>
                          <p className="text-gray-200 break-words">{event.description}</p>
                        </div>
                        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="px-2 sm:px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs sm:text-sm whitespace-nowrap"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="px-2 sm:px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-xs sm:text-sm whitespace-nowrap"
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">Staff Management</h2>
            <p className="text-gray-300 mb-6">
              Add new staff members, manage their roles and credentials, and update their profiles.
            </p>

            {/* Add/Edit Staff Form */}
            {showStaffForm && (
              <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg mb-4 sm:mb-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">
                  {editingStaffId ? "Edit Staff Member" : "Add New Staff Member"}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-200">Full Name</label>
                    <input
                      type="text"
                      value={staffForm.name}
                      onChange={(e) => setStaffForm({...staffForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-200">Username</label>
                    <input
                      type="text"
                      value={staffForm.username}
                      onChange={(e) => setStaffForm({...staffForm, username: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      placeholder="Enter username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-200">Password</label>
                    <input
                      type="text"
                      value={staffForm.password}
                      onChange={(e) => setStaffForm({...staffForm, password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      placeholder="Enter password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-200">Role</label>
                    <select
                      value={staffForm.role}
                      onChange={(e) => setStaffForm({...staffForm, role: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                    >
                      {staffService.getAvailableRoles().map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-gray-200">Avatar URL (Optional)</label>
                    <input
                      type="url"
                      value={staffForm.avatar}
                      onChange={(e) => setStaffForm({...staffForm, avatar: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4 flex-wrap">
                  <button
                    onClick={editingStaffId ? handleUpdateStaff : handleAddStaff}
                    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition"
                  >
                    {editingStaffId ? "Update Staff" : "Add Staff"}
                  </button>
                  <button
                    onClick={resetStaffForm}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
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
                className="mb-6 w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition"
              >
                + Add New Staff Member
              </button>
            )}

            <div className="grid gap-4 sm:gap-6 xl:grid-cols-2">
              {staffMembers.map((staff) => (
                <div
                  key={staff.id}
                  className="bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-700"
                >
                  {/* Banner */}
                  <div className="h-20 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-700" />

                  {/* Profile Row */}
                  <div className="flex items-center -mt-10 px-4 sm:px-6 relative">
                    <img
                      src={staff.avatar}
                      alt={staff.name}
                      className="w-16 h-16 rounded-full border-4 border-gray-700 cursor-pointer hover:opacity-80"
                      onClick={() => updateStaffStat(staff.id, "hits")}
                    />
                    <div className="ml-3 sm:ml-4">
                      <h3 className="text-base sm:text-lg font-bold text-white">{staff.name}</h3>
                      <span className="text-xs sm:text-sm text-gray-300">{staff.role}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-gray-200 border-t border-gray-600">
                    <p>Member since {staff.joined}</p>
                    <div className="grid grid-cols-2 gap-1 sm:gap-2 mt-2">
                      <span>📝 Posts: {staff.posts}</span>
                      <span>❤️ Likes: {staff.likes}</span>
                      <span>⭐ Points: {staff.points}</span>
                      <span>👁️ Profile Hits: {staff.hits}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="px-4 sm:px-6 py-3 flex flex-wrap gap-2 border-t border-gray-600">
                    <button
                      onClick={() => {
                        const newUrl = prompt("Enter new avatar URL:", staff.avatar);
                        if (newUrl && newUrl.trim() !== "") {
                          changeAvatar(staff.id, newUrl.trim());
                        }
                      }}
                      className="px-2 sm:px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition text-xs sm:text-sm whitespace-nowrap"
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
                      className="px-2 sm:px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-xs sm:text-sm whitespace-nowrap"
                    >
                      Change Join Date
                    </button>
                    <button
                      onClick={() => handleEditStaff(staff)}
                      className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs sm:text-sm whitespace-nowrap"
                    >
                      Edit Details
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(staff.id)}
                      className="px-2 sm:px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs sm:text-sm whitespace-nowrap"
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">Support Tickets Management</h2>
            <p className="text-gray-300 mb-6">
              View and manage support tickets submitted by users.
            </p>

            {ticketsLoading ? (
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center border border-gray-700">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-200">Loading tickets...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Pending Tickets */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-700">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4 text-yellow-400 flex items-center gap-2">
                    ⚠️ Pending Tickets ({pendingTickets.length})
                  </h3>
                  {pendingTickets.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No pending tickets at the moment.</p>
                  ) : (
                    <div className="space-y-4">
                      {pendingTickets.map((ticket) => (
                        <div key={ticket.id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                          <div className="flex justify-between items-start mb-3 gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-lg font-semibold text-gray-800 break-words line-clamp-2">{ticket.title}</h4>
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
                            <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                              <button
                                onClick={() => {
                                  const response = prompt("Enter admin response (optional):");
                                  handleResolveTicket(ticket.id, response);
                                }}
                                className="px-2 sm:px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-xs sm:text-sm whitespace-nowrap"
                              >
                                ✅ Resolve
                              </button>
                              <button
                                onClick={() => handleDeleteTicket(ticket.id)}
                                className="px-2 sm:px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs sm:text-sm whitespace-nowrap"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3 break-words">{ticket.description}</p>
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
                <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-700">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4 text-green-400 flex items-center gap-2">
                    ✅ Resolved Tickets ({resolvedTickets.length})
                  </h3>
                  {resolvedTickets.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No resolved tickets yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {resolvedTickets.map((ticket) => (
                        <div key={ticket.id} className="border border-green-600 rounded-lg p-4 bg-green-900/20">
                          <div className="flex justify-between items-start mb-3 gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-lg font-semibold text-gray-800 break-words line-clamp-2">{ticket.title}</h4>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span>👤 {ticket.user_name}</span>
                                <span>📧 {ticket.user_email}</span>
                                <span>🏷️ {ticket.category}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteTicket(ticket.id)}
                              className="px-2 sm:px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-xs sm:text-sm whitespace-nowrap"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                          <p className="text-gray-200 mb-3">{ticket.description}</p>
                          {ticket.admin_response && (
                            <div className="bg-green-900/30 border-l-4 border-green-400 p-3 mb-3">
                              <p className="text-sm font-semibold text-green-300">Admin Response:</p>
                              <p className="text-green-200">{ticket.admin_response}</p>
                            </div>
                          )}
                          <div className="text-xs text-gray-400 space-y-1">
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">News Management</h2>
            <p className="text-gray-300 mb-6">
              Create and manage official admin news posts that appear on the website.
            </p>

            {/* Add/Edit Post Form */}
            {showPostForm && (
              <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg mb-4 sm:mb-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">
                  {editingPostId ? "Edit News Post" : "Create New News Post"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-200">Post Title</label>
                    <input
                      type="text"
                      value={postForm.title}
                      onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      placeholder="Enter news post title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-200">Excerpt (Optional)</label>
                    <input
                      type="text"
                      value={postForm.excerpt}
                      onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      placeholder="Brief description (auto-generated if left empty)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Post Image (Optional)</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePostImageSelect}
                        className="hidden"
                        id="admin-post-image-upload"
                        disabled={uploadingImage}
                      />
                      <label
                        htmlFor="admin-post-image-upload"
                        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition"
                      >
                        Choose Image
                      </label>
                      {postImageFile && (
                        <span className="text-sm text-gray-300">{postImageFile.name}</span>
                      )}
                      {postImageFile && (
                        <button
                          type="button"
                          onClick={() => {
                            setPostImageFile(null);
                            setPostImagePreview("");
                          }}
                          className="text-red-400 hover:text-red-500"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    {postImagePreview && (
                      <div className="mt-2">
                        <img src={postImagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                      </div>
                    )}
                    {uploadingImage && (
                      <p className="text-sm text-blue-400 mt-2">Uploading image...</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-200">Post Content</label>
                    <textarea
                      value={postForm.content}
                      onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      rows="8"
                      placeholder="Write your news post content here..."
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4 flex-wrap">
                  <button
                    onClick={editingPostId ? handleUpdatePost : handleAddPost}
                    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition"
                  >
                    {editingPostId ? "Update" : "Create"} Post
                  </button>
                  <button
                    onClick={resetPostForm}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Add New Post Button */}
            {!showPostForm && (
              <button
                onClick={() => setShowPostForm(true)}
                className="mb-6 w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition"
              >
                + Create New News Post
              </button>
            )}

            {/* Posts List */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-white">Admin News Posts ({posts.length})</h3>
              {postsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-gray-200">Loading posts...</p>
                </div>
              ) : posts.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No news posts created yet. Click "Create New News Post" to get started.</p>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="border border-gray-600 bg-gray-700 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-white">{post.title}</h4>
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                              👑 ADMIN POST
                            </span>
                            {post.is_trending && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                                🔥 Trending
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-300 mb-2">By {post.author_name}</p>
                          <p className="text-gray-200 mb-2 line-clamp-2">{post.content}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>👍 {post.likes_count || 0} likes</span>
                            <span>
                              Created: {new Date(post.created_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs sm:text-sm whitespace-nowrap"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="px-2 sm:px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs sm:text-sm whitespace-nowrap"
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

      case "updates":
        return (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">Updates Management</h2>
            <p className="text-gray-300 mb-6">
              Create and manage system updates, announcements, and version releases.
            </p>

            {/* Add/Edit Update Form */}
            {showUpdateForm && (
              <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg mb-4 sm:mb-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">
                  {editingUpdateId ? "Edit Update" : "Create New Update"}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-200">Update Title</label>
                    <input
                      type="text"
                      value={updateForm.title}
                      onChange={(e) => setUpdateForm({...updateForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      placeholder="Enter update title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-200">Version (Optional)</label>
                    <input
                      type="text"
                      value={updateForm.version}
                      onChange={(e) => setUpdateForm({...updateForm, version: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      placeholder="e.g., v1.2.3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-200">Category</label>
                    <select
                      value={updateForm.category}
                      onChange={(e) => setUpdateForm({...updateForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                    >
                      {updateService.getCategories().map(category => (
                        <option key={category} value={category}>
                          {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-200">Priority</label>
                    <select
                      value={updateForm.priority}
                      onChange={(e) => setUpdateForm({...updateForm, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                    >
                      {updateService.getPriorities().map(priority => (
                        <option key={priority.value} value={priority.value}>{priority.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-gray-200">Update Content</label>
                    <textarea
                      value={updateForm.content}
                      onChange={(e) => setUpdateForm({...updateForm, content: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
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
                      <span className="text-sm font-medium text-gray-200">Featured Update (appears prominently on user side)</span>
                    </label>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4 flex-wrap">
                  <button
                    onClick={editingUpdateId ? handleUpdateUpdate : handleAddUpdate}
                    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition"
                  >
                    {editingUpdateId ? "Update" : "Create"} Update
                  </button>
                  <button
                    onClick={resetUpdateForm}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
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
                className="mb-6 w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition"
              >
                + Create New Update
              </button>
            )}

            {/* Updates List */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-white">All Updates ({updates.length})</h3>
              {updatesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-gray-200">Loading updates...</p>
                </div>
              ) : updates.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No updates created yet. Click "Create New Update" to get started.</p>
              ) : (
                <div className="space-y-4">
                  {updates.map((update) => (
                    <div key={update.id} className="border border-gray-600 bg-gray-700 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-white">{update.title}</h4>
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
                          <p className="text-sm text-gray-300 mb-2">By {update.author_name}</p>
                          <p className="text-gray-200 mb-2">{update.content}</p>
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
                        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleEditUpdate(update)}
                            className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs sm:text-sm whitespace-nowrap"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUpdate(update.id)}
                            className="px-2 sm:px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs sm:text-sm whitespace-nowrap"
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">Information & Notices</h2>
            <p className="text-gray-300 mb-6">
              Post important notices and information for users.
            </p>
            <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-700">
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition">
                + Create Notice
              </button>
              <p className="text-gray-400 text-center py-8 mt-4">Information management coming soon...</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 sm:p-6 shadow-lg relative z-30">
        <div className="max-w-7xl mx-auto">
          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors z-50"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${isSidebarOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${isSidebarOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${isSidebarOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>
          
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center pl-12">
            🎮 NosDionisy Admin Dashboard
          </h1>
          <p className="text-center mt-2 text-blue-100 text-sm sm:text-base">
            Manage events, staff, and content from one place
          </p>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full
        bg-gray-800 shadow-xl border-r border-gray-700 z-50
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        w-64
      `}>
        <div className="h-full overflow-y-auto">
          <nav className="p-4 pt-20">
            <ul className="space-y-2">
              <li>
                <button
                  className={`w-full text-left p-3 rounded-lg transition ${
                    activeSection === "events"
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-700 text-gray-300"
                  }`}
                  onClick={() => {
                    setActiveSection("events");
                    setIsSidebarOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🎉</span>
                    <span>Events</span>
                  </div>
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-3 rounded-lg transition ${
                    activeSection === "staff"
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-700 text-gray-300"
                  }`}
                  onClick={() => {
                    setActiveSection("staff");
                    setIsSidebarOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">👥</span>
                    <span>Staff Management</span>
                  </div>
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-3 rounded-lg transition ${
                    activeSection === "pending"
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-700 text-gray-300"
                  }`}
                  onClick={() => {
                    setActiveSection("pending");
                    setIsSidebarOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">⚠️</span>
                    <span>Pending Problems</span>
                  </div>
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-3 rounded-lg transition ${
                    activeSection === "news"
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-700 text-gray-300"
                  }`}
                  onClick={() => {
                    setActiveSection("news");
                    setIsSidebarOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">📰</span>
                    <span>Latest News</span>
                  </div>
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-3 rounded-lg transition ${
                    activeSection === "updates"
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-700 text-gray-300"
                  }`}
                  onClick={() => {
                    setActiveSection("updates");
                    setIsSidebarOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🔄</span>
                    <span>Updates</span>
                  </div>
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-3 rounded-lg transition ${
                    activeSection === "info"
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-700 text-gray-300"
                  }`}
                  onClick={() => {
                    setActiveSection("info");
                    setIsSidebarOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">ℹ️</span>
                    <span>Information</span>
                  </div>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}