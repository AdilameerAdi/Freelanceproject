import React, { useState, useEffect } from "react";
import { ThumbsUp, MessageCircle, Flame, X, Send, Heart } from "lucide-react";
import { postService, commentService } from "../../services/supabase";
import { useLocation, useNavigate } from "react-router-dom";

export default function CommunityHub() {
  const location = useLocation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal and Comments state
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [userName, setUserName] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [postsPerPage] = useState(10);

  // User identification
  const getUserIdentifier = () => {
    let userIdentifier = localStorage.getItem('userIdentifier');
    if (!userIdentifier) {
      userIdentifier = 'user_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('userIdentifier', userIdentifier);
    }
    return userIdentifier;
  };

  const getUserName = () => {
    let storedName = localStorage.getItem('userName');
    if (!storedName) {
      storedName = `User${Math.floor(Math.random() * 10000)}`;
      localStorage.setItem('userName', storedName);
    }
    return storedName;
  };

  useEffect(() => {
    loadPosts();
    setUserName(getUserName());
  }, [currentPage]);

  // Handle URL parameter for opening specific post
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const postId = urlParams.get('postId');
    
    if (postId && posts.length > 0) {
      // Find the post by ID and open it
      const foundPost = posts.find(post => post.id === parseInt(postId));
      if (foundPost) {
        openPostModal(foundPost);
        // Clean up URL parameter
        navigate('/blog', { replace: true });
      }
    }
  }, [posts, location.search, navigate]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const [paginatedPosts, trending, totalCount] = await Promise.all([
        postService.getPaginatedPosts(currentPage, postsPerPage),
        postService.getTrendingPosts(3),
        postService.getTotalPostsCount()
      ]);
      
      setPosts(paginatedPosts);
      setTrendingPosts(trending);
      setTotalPosts(totalCount);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const openPostModal = async (post) => {
    setSelectedPost(post);
    setShowModal(true);
    await loadComments(post.id);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPost(null);
    setComments([]);
    setCommentText("");
  };

  const loadComments = async (postId) => {
    try {
      setCommentsLoading(true);
      const postComments = await commentService.getCommentsByPost(postId);
      setComments(postComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (commentText.trim() === "" || !selectedPost) return;
    
    try {
      const userIdentifier = getUserIdentifier();
      const commentData = {
        post_id: selectedPost.id,
        user_name: userName,
        user_identifier: userIdentifier,
        content: commentText.trim()
      };

      await commentService.createComment(commentData);
      setCommentText("");
      await loadComments(selectedPost.id); // Reload comments
    } catch (error) {
      console.error('Error creating comment:', error);
      alert('Failed to post comment. Please try again.');
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      const userIdentifier = getUserIdentifier();
      const result = await commentService.likeComment(commentId, userIdentifier);
      
      if (result.success) {
        await loadComments(selectedPost.id); // Reload comments to update likes
      } else {
        alert(result.message || 'You have already liked this comment');
      }
    } catch (error) {
      console.error('Error liking comment:', error);
      alert('Failed to like comment. Please try again.');
    }
  };

  const togglePostLike = async (postId) => {
    try {
      const userIdentifier = getUserIdentifier();
      const result = await postService.likePost(postId, userIdentifier);
      
      if (result.success) {
        // Update the selected post if it's in the modal
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost({
            ...selectedPost,
            likes_count: result.likesCount
          });
        }
        
        // Refresh posts to get updated counts
        await loadPosts();
      } else {
        alert(result.message || 'You have already liked this post');
      }
    } catch (error) {
      console.error('Error liking post:', error);
      alert('Failed to like post. Please try again.');
    }
  };

  // Pagination functions
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full mt-10 bg-gradient-to-b from-[#0a0f1f] via-[#0b132b] to-black text-white font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen w-full mt-10 bg-gradient-to-b from-[#0a0f1f] via-[#0b132b] to-black text-white font-sans">
        <div className="w-full bg-gradient-to-r from-purple-600/40 to-cyan-600/40 py-12 text-center shadow-lg">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            🎮 Community Hub
          </h1>
          <p className="text-gray-300 mt-2 text-lg">
            Share updates, discuss strategies, and connect with fellow gamers!
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No posts available yet.</p>
          <p className="text-gray-500 text-sm mt-2">Staff members can create posts that will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full mt-10 bg-gradient-to-b from-[#0a0f1f] via-[#0b132b] to-black text-white font-sans">
      {/* Banner / Hero Section */}
      <div className="w-full bg-gradient-to-r from-purple-600/40 to-cyan-600/40 py-12 text-center shadow-lg">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          🎮 Community Hub
        </h1>
        <p className="text-gray-300 mt-2 text-lg">
          Share updates, discuss strategies, and connect with fellow gamers!
        </p>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="p-6 max-w-7xl mx-auto mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Right Column - Trending Sidebar (appears first on mobile) */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-[#111a2c] border border-purple-500/40 rounded-2xl shadow-2xl p-6 lg:sticky lg:mt-14">
              <h2 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2">
                <Flame size={20} /> Trending Posts
              </h2>
              
              {trendingPosts.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">No trending posts yet</p>
              ) : (
                <div className="space-y-4">
                  {trendingPosts.map((post, index) => (
                    <div 
                      key={post.id} 
                      className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-lg p-4 cursor-pointer hover:from-red-900/30 hover:to-orange-900/30 transition"
                      onClick={() => openPostModal(post)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">#{index + 1}</span>
                        <Flame size={14} className="text-red-400" />
                        <span className="text-red-400 text-xs font-semibold">{post.likes_count} likes</span>
                      </div>
                      <h4 className="text-white font-semibold text-sm mb-2 line-clamp-2">{post.title}</h4>
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author_avatar || 'https://i.pravatar.cc/20?img=1'}
                          alt={post.author_name}
                          className="w-6 h-6 rounded-full border border-purple-400/50"
                        />
                        <span className="text-purple-400 text-xs">{post.author_name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Left Column - All Posts (appears second on mobile) */}
          <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
            <h2 className="text-2xl font-bold text-purple-400 mb-6">Latest Posts</h2>
            
            {posts.map((post) => (
              <div 
                key={post.id} 
                className="bg-[#111a2c] border border-purple-500/40 rounded-2xl shadow-2xl p-6 hover:shadow-purple-500/30 transition relative overflow-hidden cursor-pointer"
                onClick={() => openPostModal(post)}
              >
                {/* Neon Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-3xl"></div>

                <div className="relative">
                  {/* Author Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={post.author_avatar || 'https://i.pravatar.cc/40?img=1'}
                      alt={post.author_name}
                      className="w-10 h-10 rounded-full border-2 border-purple-400/50"
                    />
                    <div className="flex-1">
                      <p className="text-purple-400 font-semibold">{post.author_name}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(post.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {post.is_trending && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full flex items-center gap-1">
                        <Flame size={12} /> Trending
                      </span>
                    )}
                  </div>

                  {/* Post Title */}
                  <h3 className="text-xl font-bold text-white mb-3">{post.title}</h3>
                  
                  {/* Post Excerpt */}
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content}
                  </p>

                  {/* Post Actions */}
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePostLike(post.id);
                      }}
                      className="flex items-center gap-1 hover:text-purple-400 transition"
                    >
                      <ThumbsUp size={16} /> {post.likes_count || 0}
                    </button>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={16} /> Comments
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center space-y-4">
                <div className="text-gray-400 text-sm">
                  Showing {((currentPage - 1) * postsPerPage) + 1} to {Math.min(currentPage * postsPerPage, totalPosts)} of {totalPosts} posts
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={goToPrevious}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg border transition ${
                      currentPage === 1
                        ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                        : 'border-purple-500/40 text-purple-400 hover:bg-purple-600/20 hover:border-purple-400'
                    }`}
                  >
                    Previous
                  </button>

                  {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === '...' ? (
                        <span className="px-3 py-2 text-gray-500">...</span>
                      ) : (
                        <button
                          onClick={() => goToPage(page)}
                          className={`px-4 py-2 rounded-lg border transition ${
                            currentPage === page
                              ? 'bg-purple-600 border-purple-400 text-white'
                              : 'border-purple-500/40 text-purple-400 hover:bg-purple-600/20 hover:border-purple-400'
                          }`}
                        >
                          {page}
                        </button>
                      )}
                    </React.Fragment>
                  ))}

                  <button
                    onClick={goToNext}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg border transition ${
                      currentPage === totalPages
                        ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                        : 'border-purple-500/40 text-purple-400 hover:bg-purple-600/20 hover:border-purple-400'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Modal */}
      {showModal && selectedPost && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0f1f] border border-purple-500/40 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex h-full">
              
              {/* Left Side - Post Content */}
              <div className="flex-1 p-6 border-r border-purple-500/40">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedPost.author_avatar || 'https://i.pravatar.cc/40?img=1'}
                      alt={selectedPost.author_name}
                      className="w-12 h-12 rounded-full border-2 border-purple-400/50"
                    />
                    <div>
                      <p className="text-purple-400 font-semibold">{selectedPost.author_name}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(selectedPost.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-white transition p-2"
                  >
                    <X size={24} />
                  </button>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">{selectedPost.title}</h2>
                <div className="text-gray-300 leading-relaxed mb-6 max-h-64 overflow-y-auto">
                  {selectedPost.content}
                </div>

                <div className="flex items-center gap-6 pt-4 border-t border-purple-500/40">
                  <button
                    onClick={() => togglePostLike(selectedPost.id)}
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition"
                  >
                    <ThumbsUp size={20} /> {selectedPost.likes_count || 0} Likes
                  </button>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MessageCircle size={20} /> {comments.length} Comments
                  </div>
                </div>
              </div>

              {/* Right Side - Comments */}
              <div className="w-1/2 flex flex-col">
                <div className="p-6 border-b border-purple-500/40">
                  <h3 className="text-lg font-semibold text-white">Comments</h3>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {commentsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading comments...</p>
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No comments yet. Be the first to comment!</p>
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="bg-[#111a2c] rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <img
                            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${comment.user_name}`}
                            alt={comment.user_name}
                            className="w-8 h-8 rounded-full border border-purple-400/50"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-purple-400 font-semibold text-sm">{comment.user_name}</span>
                              <span className="text-gray-500 text-xs">
                                {new Date(comment.created_at).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm mb-2">{comment.content}</p>
                            <button
                              onClick={() => handleCommentLike(comment.id)}
                              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition"
                            >
                              <Heart size={12} /> {comment.likes_count || 0}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Comment Input */}
                <div className="p-6 border-t border-purple-500/40">
                  <div className="flex gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${userName}`}
                      alt={userName}
                      className="w-8 h-8 rounded-full border border-purple-400/50"
                    />
                    <div className="flex-1">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full bg-[#111a2c] border border-purple-500/40 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm resize-none focus:outline-none focus:border-purple-400"
                        rows="2"
                      />
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">Commenting as {userName}</span>
                        <button
                          onClick={handleCommentSubmit}
                          disabled={!commentText.trim()}
                          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-white text-sm transition"
                        >
                          <Send size={14} /> Post
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
