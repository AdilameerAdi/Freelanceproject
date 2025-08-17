import React, { useState, useEffect } from "react";
import { postService, imageUploadService } from "../../services/supabase";

export default function StaffPanel({ staffMember, onLogout }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
            <h2 className="text-3xl font-bold mb-6 text-white">Staff Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Stats Cards */}
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-800 text-blue-200">
                    📝
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold">{staffMember.posts}</h3>
                    <p className="text-gray-300">Total Posts</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-800 text-green-200">
                    ❤️
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold">{staffMember.likes}</h3>
                    <p className="text-gray-300">Total Likes</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-800 text-blue-200">
                    ⭐
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold">{staffMember.points}</h3>
                    <p className="text-gray-300">Total Points</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-800 text-purple-200">
                    👁️
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold">{staffMember.hits}</h3>
                    <p className="text-gray-300">Profile Hits</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Welcome Section */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-white">Welcome back, {staffMember.name}!</h3>
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={staffMember.avatar || 'https://i.pravatar.cc/100?img=1'}
                  alt={staffMember.name}
                  className="w-16 h-16 rounded-full border-4 border-blue-500"
                />
                <div>
                  <h4 className="text-lg font-semibold text-white">{staffMember.name}</h4>
                  <p className="text-gray-300">{staffMember.role}</p>
                  <p className="text-sm text-gray-400">Member since {staffMember.joined}</p>
                </div>
              </div>
              <p className="text-gray-200">
                You are logged in as a <strong>{staffMember.role}</strong>. Use the navigation menu to access your staff tools and manage your responsibilities.
              </p>
            </div>
          </div>
        );

      case "profile":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-white">My Profile</h2>
            <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-700">
              <div className="flex items-center space-x-6 mb-6">
                <img
                  src={staffMember.avatar || 'https://i.pravatar.cc/100?img=1'}
                  alt={staffMember.name}
                  className="w-24 h-24 rounded-full border-4 border-blue-500"
                />
                <div>
                  <h3 className="text-2xl font-bold text-white">{staffMember.name}</h3>
                  <p className="text-lg text-gray-300">{staffMember.role}</p>
                  <p className="text-sm text-gray-400">@{staffMember.username}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-white">Account Information</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-200"><span className="font-medium">Username:</span> {staffMember.username}</p>
                    <p className="text-gray-200"><span className="font-medium">Role:</span> {staffMember.role}</p>
                    <p className="text-gray-200"><span className="font-medium">Joined:</span> {staffMember.joined}</p>
                    <p className="text-gray-200"><span className="font-medium">Status:</span> <span className="text-green-400">Active</span></p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-white">Activity Statistics</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-200"><span className="font-medium">Posts:</span> {staffMember.posts}</p>
                    <p className="text-gray-200"><span className="font-medium">Likes Received:</span> {staffMember.likes}</p>
                    <p className="text-gray-200"><span className="font-medium">Points:</span> {staffMember.points}</p>
                    <p className="text-gray-200"><span className="font-medium">Profile Views:</span> {staffMember.hits}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "posts":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-white">Create News Post</h2>
            <p className="text-gray-300 mb-6">
              Create posts that will appear in the news section for all users to see.
            </p>

            {/* Create Post Form */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-white">Write New Post</h3>
              
              {postMessage && (
                <div className={`mb-4 p-3 rounded-lg ${
                  postMessage.includes('✅') ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'
                }`}>
                  {postMessage}
                </div>
              )}

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-200">Post Title</label>
                  <input
                    type="text"
                    value={postForm.title}
                    onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter an engaging title for your post"
                    disabled={submittingPost}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-200">Excerpt (Optional)</label>
                  <input
                    type="text"
                    value={postForm.excerpt}
                    onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Brief description (auto-generated if left empty)"
                    disabled={submittingPost}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-200">Post Image (Optional)</label>
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
                      <span className="text-sm text-gray-300">{postImageFile.name}</span>
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
                    <p className="text-sm text-blue-400 mt-2">Uploading image...</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-200">Post Content</label>
                  <textarea
                    value={postForm.content}
                    onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
              <h4 className="font-semibold text-white mb-2">📝 Posting Guidelines</h4>
              <ul className="text-gray-300 text-sm space-y-1">
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
            <h2 className="text-3xl font-bold mb-6 text-white">Manage My Posts</h2>
            <p className="text-gray-300 mb-6">
              View, edit, and delete your published posts.
            </p>

            {postMessage && (
              <div className={`mb-4 p-3 rounded-lg ${
                postMessage.includes('✅') ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'
              }`}>
                {postMessage}
              </div>
            )}

            {loadingPosts ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-300">Loading your posts...</p>
              </div>
            ) : userPosts.length === 0 ? (
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 text-center border border-gray-700">
                <p className="text-gray-300 text-lg">You haven't created any posts yet.</p>
                <p className="text-gray-400 text-sm mt-2">Go to "Create Posts" to write your first post!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {userPosts.map((post) => (
                  <div key={post.id} className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                    {editingPost === post.id ? (
                      // Edit Mode
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Edit Post</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-200">Title</label>
                            <input
                              type="text"
                              value={editForm.title}
                              onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-200">Excerpt</label>
                            <input
                              type="text"
                              value={editForm.excerpt}
                              onChange={(e) => setEditForm({...editForm, excerpt: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-200">Post Image (Optional)</label>
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
                                <span className="text-sm text-gray-300">{editImageFile.name}</span>
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
                              <p className="text-sm text-blue-400 mt-2">Uploading image...</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-200">Content</label>
                            <textarea
                              value={editForm.content}
                              onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-white mb-2 break-words">{post.title}</h3>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-300 mb-3">
                              <span>Created: {new Date(post.created_at).toLocaleDateString()}</span>
                              <span>👍 {post.likes_count || 0} likes</span>
                              {post.is_trending && (
                                <span className="px-2 py-1 bg-red-800 text-red-200 rounded-full text-xs">
                                  🔥 Trending
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => startEditing(post)}
                              className="px-2 sm:px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm whitespace-nowrap"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="px-2 sm:px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm whitespace-nowrap"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-gray-700 rounded-lg p-4">
                          <p className="text-gray-200 leading-relaxed">
                            {post.content.length > 300 ? post.content.substring(0, 300) + '...' : post.content}
                          </p>
                          {post.content.length > 300 && (
                            <p className="text-blue-400 text-sm mt-2">Click edit to see full content</p>
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
            <h2 className="text-3xl font-bold mb-6 text-white">Staff Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-white">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-gray-200">
                    📢 Send Announcement
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-gray-200">
                    👥 View Online Users
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-gray-200">
                    ⚠️ Report Issue
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-gray-200">
                    📊 View Statistics
                  </button>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-white">Role-Specific Tools</h3>
                <p className="text-gray-300 mb-4">Tools available for: <strong className="text-white">{staffMember.role}</strong></p>
                <div className="space-y-2">
                  {staffMember.role === 'Developer' && (
                    <>
                      <button className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-gray-200">
                        🔧 Development Console
                      </button>
                      <button className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-gray-200">
                        🐛 Bug Tracker
                      </button>
                    </>
                  )}
                  {staffMember.role === 'Moderator' && (
                    <>
                      <button className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-gray-200">
                        🛡️ Moderation Panel
                      </button>
                      <button className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-gray-200">
                        📝 User Reports
                      </button>
                    </>
                  )}
                  {(staffMember.role === 'Administrator' || staffMember.role === 'Leader') && (
                    <>
                      <button className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-gray-200">
                        ⚙️ Server Settings
                      </button>
                      <button className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-gray-200">
                        👥 User Management
                      </button>
                    </>
                  )}
                  {staffMember.role.includes('Balance') && (
                    <button className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-gray-200">
                      ⚖️ Balance Tools
                    </button>
                  )}
                  {staffMember.role === 'Community Manager' && (
                    <>
                      <button className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-gray-200">
                        🎉 Event Manager
                      </button>
                      <button className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-gray-200">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 sm:p-6 shadow-lg relative z-30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
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

          <div className="pl-12">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
              👤 Staff Panel
            </h1>
            <p className="text-purple-100 mt-1 text-sm sm:text-base">
              Welcome, {staffMember.name} ({staffMember.role})
            </p>
          </div>
          <button
            onClick={onLogout}
            className="px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition text-sm sm:text-base"
          >
            Logout
          </button>
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
                    activeSection === "dashboard"
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-700 text-gray-300"
                  }`}
                  onClick={() => {
                    setActiveSection("dashboard");
                    setIsSidebarOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🏠</span>
                    <span>Dashboard</span>
                  </div>
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-3 rounded-lg transition ${
                    activeSection === "profile"
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-700 text-gray-300"
                  }`}
                  onClick={() => {
                    setActiveSection("profile");
                    setIsSidebarOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">👤</span>
                    <span>My Profile</span>
                  </div>
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-3 rounded-lg transition ${
                    activeSection === "posts"
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-700 text-gray-300"
                  }`}
                  onClick={() => {
                    setActiveSection("posts");
                    setIsSidebarOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">📝</span>
                    <span>Create Posts</span>
                  </div>
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-3 rounded-lg transition ${
                    activeSection === "managePosts"
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-700 text-gray-300"
                  }`}
                  onClick={() => {
                    setActiveSection("managePosts");
                    setIsSidebarOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">📋</span>
                    <span>Manage Posts</span>
                  </div>
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-3 rounded-lg transition ${
                    activeSection === "tools"
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-700 text-gray-300"
                  }`}
                  onClick={() => {
                    setActiveSection("tools");
                    setIsSidebarOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🔧</span>
                    <span>Staff Tools</span>
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