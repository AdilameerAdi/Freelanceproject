import React, { useState, useEffect } from "react";
import { postService, imageUploadService } from "../../services/supabase";

export default function StaffPanel({ staffMember, onLogout }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    image_url: ""
  });
  const [postImageFile, setPostImageFile] = useState(null);
  const [postImagePreview, setPostImagePreview] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submittingPost, setSubmittingPost] = useState(false);
  const [postMessage, setPostMessage] = useState("");
  
  // Manage Posts state
  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    image_url: ""
  });

  const handlePostImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setPostMessage("Please select an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setPostMessage("Image size should be less than 5MB");
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

  const handleEditImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setPostMessage("Please select an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setPostMessage("Image size should be less than 5MB");
        return;
      }
      
      setEditImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.content.trim()) {
      setPostMessage("Please fill in both title and content.");
      return;
    }

    setSubmittingPost(true);
    setUploadingImage(true);
    setPostMessage("");

    try {
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
      
      await postService.createPost({...postForm, image_url: imageUrl}, staffMember);
      setPostForm({ title: "", content: "", excerpt: "", image_url: "" });
      setPostImageFile(null);
      setPostImagePreview("");
      setPostMessage("✅ Post created successfully! It will appear in the news section.");
      // Refresh posts if we're on the manage posts section
      if (activeSection === "managePosts") {
        loadUserPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setPostMessage("❌ Failed to create post. Please try again.");
    } finally {
      setSubmittingPost(false);
      setUploadingImage(false);
    }
  };

  // Load user's posts
  const loadUserPosts = async () => {
    try {
      setLoadingPosts(true);
      const posts = await postService.getPostsByAuthor(staffMember.id);
      setUserPosts(posts);
    } catch (error) {
      console.error('Error loading user posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  // Delete post
  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      await postService.deletePost(postId, staffMember.id);
      setPostMessage("✅ Post deleted successfully!");
      loadUserPosts(); // Refresh the posts list
    } catch (error) {
      console.error('Error deleting post:', error);
      setPostMessage("❌ Failed to delete post. Please try again.");
    }
  };

  // Start editing a post
  const startEditing = (post) => {
    setEditingPost(post.id);
    setEditForm({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || "",
      image_url: post.image_url || ""
    });
    setEditImageFile(null);
    setEditImagePreview(post.image_url || "");
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingPost(null);
    setEditForm({ title: "", content: "", excerpt: "", image_url: "" });
    setEditImageFile(null);
    setEditImagePreview("");
  };

  // Update post
  const handleUpdatePost = async (postId) => {
    if (!editForm.title.trim() || !editForm.content.trim()) {
      alert("Please fill in both title and content.");
      return;
    }

    setUploadingImage(true);

    try {
      // Upload new image if selected
      let imageUrl = editForm.image_url;
      if (editImageFile) {
        try {
          imageUrl = await imageUploadService.uploadImage(editImageFile);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          // Keep existing image if upload fails
        }
      }
      
      await postService.updatePost(postId, {...editForm, image_url: imageUrl});
      setPostMessage("✅ Post updated successfully!");
      setEditingPost(null);
      setEditForm({ title: "", content: "", excerpt: "", image_url: "" });
      setEditImageFile(null);
      setEditImagePreview("");
      loadUserPosts(); // Refresh the posts list
    } catch (error) {
      console.error('Error updating post:', error);
      setPostMessage("❌ Failed to update post. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Load user posts when entering managePosts section
  useEffect(() => {
    if (activeSection === "managePosts") {
      loadUserPosts();
    }
  }, [activeSection]);

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
                  <label className="block text-sm font-medium mb-2">Post Image (Optional)</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePostImageSelect}
                      className="hidden"
                      id="staff-post-image-upload"
                      disabled={submittingPost || uploadingImage}
                    />
                    <label
                      htmlFor="staff-post-image-upload"
                      className={`px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer transition ${
                        submittingPost || uploadingImage ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-600'
                      }`}
                    >
                      Choose Image
                    </label>
                    {postImageFile && (
                      <span className="text-sm text-gray-600">{postImageFile.name}</span>
                    )}
                    {postImageFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setPostImageFile(null);
                          setPostImagePreview("");
                        }}
                        className="text-red-500 hover:text-red-700"
                        disabled={submittingPost}
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
                    <p className="text-sm text-blue-600 mt-2">Uploading image...</p>
                  )}
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

      case "managePosts":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Manage My Posts</h2>
            <p className="text-gray-600 mb-6">
              View, edit, and delete your published posts.
            </p>

            {postMessage && (
              <div className={`mb-4 p-3 rounded-lg ${
                postMessage.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {postMessage}
              </div>
            )}

            {loadingPosts ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your posts...</p>
              </div>
            ) : userPosts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-gray-600 text-lg">You haven't created any posts yet.</p>
                <p className="text-gray-500 text-sm mt-2">Go to "Create Posts" to write your first post!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {userPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow-lg p-6">
                    {editingPost === post.id ? (
                      // Edit Mode
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Edit Post</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Title</label>
                            <input
                              type="text"
                              value={editForm.title}
                              onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Excerpt</label>
                            <input
                              type="text"
                              value={editForm.excerpt}
                              onChange={(e) => setEditForm({...editForm, excerpt: e.target.value})}
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Post Image (Optional)</label>
                            <div className="flex items-center space-x-4">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleEditImageSelect}
                                className="hidden"
                                id={`staff-edit-image-upload-${post.id}`}
                                disabled={uploadingImage}
                              />
                              <label
                                htmlFor={`staff-edit-image-upload-${post.id}`}
                                className={`px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer transition ${
                                  uploadingImage ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-600'
                                }`}
                              >
                                Change Image
                              </label>
                              {editImageFile && (
                                <span className="text-sm text-gray-600">{editImageFile.name}</span>
                              )}
                              {(editImageFile || editImagePreview) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditImageFile(null);
                                    setEditImagePreview("");
                                    setEditForm({...editForm, image_url: ""});
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            {editImagePreview && (
                              <div className="mt-2">
                                <img src={editImagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                              </div>
                            )}
                            {uploadingImage && (
                              <p className="text-sm text-blue-600 mt-2">Uploading image...</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Content</label>
                            <textarea
                              value={editForm.content}
                              onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows="8"
                            />
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleUpdatePost(post.id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <span>Created: {new Date(post.created_at).toLocaleDateString()}</span>
                              <span>👍 {post.likes_count || 0} likes</span>
                              {post.is_trending && (
                                <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                                  🔥 Trending
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => startEditing(post)}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 leading-relaxed">
                            {post.content.length > 300 ? post.content.substring(0, 300) + '...' : post.content}
                          </p>
                          {post.content.length > 300 && (
                            <p className="text-blue-600 text-sm mt-2">Click edit to see full content</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
                    activeSection === "managePosts"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveSection("managePosts")}
                >
                  📋 Manage Posts
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