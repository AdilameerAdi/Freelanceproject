import React, { useState, useEffect } from "react";
import { ThumbsUp, MessageCircle, Flame } from "lucide-react";
import { postService } from "../../services/supabase";

export default function CommunityHub() {
  const [posts, setPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [activePost, setActivePost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLikes, setCommentLikes] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [postsPerPage] = useState(10);

  useEffect(() => {
    loadPosts();
  }, [currentPage]);

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
      
      // Set first post as active if available
      if (paginatedPosts.length > 0 && !activePost) {
        setActivePost(paginatedPosts[0]);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = () => {
    if (commentText.trim() === "") return;
    const newComment = {
      id: comments.length + 1,
      user: "You",
      text: commentText,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${comments.length + 1}`, // gamer avatars
    };
    setComments([...comments, newComment]);
    setCommentText("");
  };

  const togglePostLike = async (postId) => {
    try {
      // Generate a simple user identifier (could be improved with actual user sessions)
      const userIdentifier = localStorage.getItem('userIdentifier') || 
        (() => {
          const id = 'user_' + Math.random().toString(36).substr(2, 9);
          localStorage.setItem('userIdentifier', id);
          return id;
        })();

      const result = await postService.likePost(postId, userIdentifier);
      
      if (result.success) {
        // Update the active post if it's the one being liked
        if (activePost && activePost.id === postId) {
          setActivePost({
            ...activePost,
            likes_count: result.likesCount
          });
        }
        
        // Refresh current page to get updated counts
        await loadPosts();
      } else {
        alert(result.message || 'You have already liked this post');
      }
    } catch (error) {
      console.error('Error liking post:', error);
      alert('Failed to like post. Please try again.');
    }
  };

  const toggleCommentLike = (id) => {
    setCommentLikes({ ...commentLikes, [id]: (commentLikes[id] || 0) + 1 });
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
      // Show first page, current page area, and last page
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

  if (!activePost && posts.length === 0) {
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

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto mt-8">

        {/* All Posts Section */}
        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-[#111a2c] border border-purple-500/40 rounded-2xl shadow-2xl p-6 hover:shadow-purple-500/30 transition relative overflow-hidden">

              {/* Neon Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-3xl"></div>

              <div className="flex justify-between items-start mb-6 relative">
                <h2 className="text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 flex-1 mr-4">
                  {post.title}
                </h2>
                <button
                  onClick={() => togglePostLike(post.id)}
                  className="flex items-center gap-2 bg-purple-600/20 px-4 py-2 rounded-xl hover:bg-purple-600/40 transition"
                >
                  <ThumbsUp size={18} className="text-purple-400" />
                  <span>{post.likes_count || 0}</span>
                </button>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 mb-4 relative">
                <img
                  src={post.author_avatar || 'https://i.pravatar.cc/40?img=1'}
                  alt={post.author_name}
                  className="w-10 h-10 rounded-full border-2 border-purple-400/50"
                />
                <div>
                  <p className="text-purple-400 font-semibold">{post.author_name}</p>
                  <p className="text-gray-400 text-sm">
                    {new Date(post.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                {post.is_trending && (
                  <span className="ml-auto px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full flex items-center gap-1">
                    <Flame size={12} /> Trending
                  </span>
                )}
              </div>

              {/* Post Content */}
              <div className="relative">
                <p className="text-gray-300 leading-relaxed text-lg">{post.content}</p>
              </div>

              {/* Post Stats */}
              <div className="mt-6 flex items-center gap-4 text-sm text-gray-400 relative">
                <span className="flex items-center gap-1">
                  <ThumbsUp size={14} /> {post.likes_count || 0} likes
                </span>
                <span>
                  {new Date(post.created_at).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col items-center space-y-4">
            {/* Page Info */}
            <div className="text-gray-400 text-sm">
              Showing {((currentPage - 1) * postsPerPage) + 1} to {Math.min(currentPage * postsPerPage, totalPosts)} of {totalPosts} posts
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
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

              {/* Page Numbers */}
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

              {/* Next Button */}
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

            {/* Quick Jump */}
            {totalPages > 10 && (
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-400">Jump to page:</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value=""
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= totalPages) {
                      goToPage(page);
                      e.target.value = '';
                    }
                  }}
                  className="w-16 px-2 py-1 bg-[#111a2c] border border-purple-500/40 rounded text-white text-center focus:outline-none focus:border-purple-400"
                  placeholder={currentPage.toString()}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
