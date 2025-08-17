import React, { useState } from "react";
import { postService } from "../../services/supabase";

export default function StaffPanel({ staffMember, onLogout }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    excerpt: ""
  });
  const [submittingPost, setSubmittingPost] = useState(false);
  const [postMessage, setPostMessage] = useState("");

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.content.trim()) {
      setPostMessage("Please fill in both title and content.");
      return;
    }

    setSubmittingPost(true);
    setPostMessage("");

    try {
      await postService.createPost(postForm, staffMember);
      setPostForm({ title: "", content: "", excerpt: "" });
      setPostMessage("✅ Post created successfully! It will appear in the news section.");
    } catch (error) {
      console.error('Error creating post:', error);
      setPostMessage("❌ Failed to create post. Please try again.");
    } finally {
      setSubmittingPost(false);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Staff Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Stats Cards */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    📝
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold">{staffMember.posts}</h3>
                    <p className="text-gray-600">Total Posts</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    ❤️
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold">{staffMember.likes}</h3>
                    <p className="text-gray-600">Total Likes</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    ⭐
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold">{staffMember.points}</h3>
                    <p className="text-gray-600">Total Points</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    👁️
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold">{staffMember.hits}</h3>
                    <p className="text-gray-600">Profile Hits</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Welcome back, {staffMember.name}!</h3>
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={staffMember.avatar || 'https://i.pravatar.cc/100?img=1'}
                  alt={staffMember.name}
                  className="w-16 h-16 rounded-full border-4 border-blue-500"
                />
                <div>
                  <h4 className="text-lg font-semibold">{staffMember.name}</h4>
                  <p className="text-gray-600">{staffMember.role}</p>
                  <p className="text-sm text-gray-500">Member since {staffMember.joined}</p>
                </div>
              </div>
              <p className="text-gray-700">
                You are logged in as a <strong>{staffMember.role}</strong>. Use the navigation menu to access your staff tools and manage your responsibilities.
              </p>
            </div>
          </div>
        );

      case "profile":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h2>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-6 mb-6">
                <img
                  src={staffMember.avatar || 'https://i.pravatar.cc/100?img=1'}
                  alt={staffMember.name}
                  className="w-24 h-24 rounded-full border-4 border-blue-500"
                />
                <div>
                  <h3 className="text-2xl font-bold">{staffMember.name}</h3>
                  <p className="text-lg text-gray-600">{staffMember.role}</p>
                  <p className="text-sm text-gray-500">@{staffMember.username}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Account Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Username:</span> {staffMember.username}</p>
                    <p><span className="font-medium">Role:</span> {staffMember.role}</p>
                    <p><span className="font-medium">Joined:</span> {staffMember.joined}</p>
                    <p><span className="font-medium">Status:</span> <span className="text-green-600">Active</span></p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Activity Statistics</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Posts:</span> {staffMember.posts}</p>
                    <p><span className="font-medium">Likes Received:</span> {staffMember.likes}</p>
                    <p><span className="font-medium">Points:</span> {staffMember.points}</p>
                    <p><span className="font-medium">Profile Views:</span> {staffMember.hits}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "posts":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Create News Post</h2>
            <p className="text-gray-600 mb-6">
              Create posts that will appear in the news section for all users to see.
            </p>

            {/* Create Post Form */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Write New Post</h3>
              
              {postMessage && (
                <div className={`mb-4 p-3 rounded-lg ${
                  postMessage.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {postMessage}
                </div>
              )}

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Post Title</label>
                  <input
                    type="text"
                    value={postForm.title}
                    onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter an engaging title for your post"
                    disabled={submittingPost}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Excerpt (Optional)</label>
                  <input
                    type="text"
                    value={postForm.excerpt}
                    onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description (auto-generated if left empty)"
                    disabled={submittingPost}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Post Content</label>
                  <textarea
                    value={postForm.content}
                    onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="8"
                    placeholder="Write your post content here..."
                    disabled={submittingPost}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submittingPost}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingPost ? 'Publishing...' : 'Publish Post'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setPostForm({ title: "", content: "", excerpt: "" });
                      setPostMessage("");
                    }}
                    disabled={submittingPost}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>

            {/* Post Guidelines */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-2">📝 Posting Guidelines</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Posts will appear immediately in the news section</li>
                <li>• Users can like your posts, which increases your likes count</li>
                <li>• Posts with 5+ likes become "trending" posts</li>
                <li>• Write engaging content that the community will enjoy</li>
                <li>• Your name and avatar will be displayed as the author</li>
              </ul>
            </div>
          </div>
        );

      case "tools":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Staff Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition">
                    📢 Send Announcement
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition">
                    👥 View Online Users
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition">
                    ⚠️ Report Issue
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition">
                    📊 View Statistics
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Role-Specific Tools</h3>
                <p className="text-gray-600 mb-4">Tools available for: <strong>{staffMember.role}</strong></p>
                <div className="space-y-2">
                  {staffMember.role === 'Developer' && (
                    <>
                      <button className="w-full text-left p-3 rounded-lg bg-red-50 hover:bg-red-100 transition">
                        🔧 Development Console
                      </button>
                      <button className="w-full text-left p-3 rounded-lg bg-red-50 hover:bg-red-100 transition">
                        🐛 Bug Tracker
                      </button>
                    </>
                  )}
                  {staffMember.role === 'Moderator' && (
                    <>
                      <button className="w-full text-left p-3 rounded-lg bg-cyan-50 hover:bg-cyan-100 transition">
                        🛡️ Moderation Panel
                      </button>
                      <button className="w-full text-left p-3 rounded-lg bg-cyan-50 hover:bg-cyan-100 transition">
                        📝 User Reports
                      </button>
                    </>
                  )}
                  {(staffMember.role === 'Administrator' || staffMember.role === 'Leader') && (
                    <>
                      <button className="w-full text-left p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition">
                        ⚙️ Server Settings
                      </button>
                      <button className="w-full text-left p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition">
                        👥 User Management
                      </button>
                    </>
                  )}
                  {staffMember.role.includes('Balance') && (
                    <button className="w-full text-left p-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition">
                      ⚖️ Balance Tools
                    </button>
                  )}
                  {staffMember.role === 'Community Manager' && (
                    <>
                      <button className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition">
                        🎉 Event Manager
                      </button>
                      <button className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition">
                        💬 Community Hub
                      </button>
                    </>
                  )}
                </div>
              </div>
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
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              👤 Staff Panel
            </h1>
            <p className="text-purple-100 mt-1">
              Welcome, {staffMember.name} ({staffMember.role})
            </p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
          >
            Logout
          </button>
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
                    activeSection === "dashboard"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveSection("dashboard")}
                >
                  🏠 Dashboard
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-3 rounded-lg transition ${
                    activeSection === "profile"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveSection("profile")}
                >
                  👤 My Profile
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-3 rounded-lg transition ${
                    activeSection === "posts"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveSection("posts")}
                >
                  📝 Create Posts
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-3 rounded-lg transition ${
                    activeSection === "tools"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveSection("tools")}
                >
                  🔧 Staff Tools
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