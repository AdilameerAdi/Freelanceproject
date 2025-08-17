import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postService } from "../../services/supabase";

export default function Home() {
  const navigate = useNavigate();
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLatestNews();
  }, []);

  const loadLatestNews = async () => {
    try {
      setLoading(true);
      // Get the top 3 latest posts
      const posts = await postService.getPaginatedPosts(1, 3);
      setLatestNews(posts);
    } catch (error) {
      console.error('Error loading latest news:', error);
      // Fallback to empty array if database fails
      setLatestNews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsClick = (post) => {
    // Navigate to news page with the specific post ID as a URL parameter
    navigate(`/blog?postId=${post.id}`);
  };

  const menuItems = [
    {
      label: "⬇️ Download Game",
      link: "https://nosdionisy.com/",
      external: true,
    },
    { label: "📰 News & Announcements", link: "/blog" },
    { label: "🎉 Events", link: "/events" },
    { label: "🎧 Support", link: "/support" },
    { label: "❓ FAQs", link: "/faqs" },
    { label: "⭐ Reviews", link: "/reviews" },
  ];

  const handleClick = (item) => {
    if (item.external) {
      window.open(item.link, "_blank");
    } else {
      navigate(item.link);
    }
  };

  return (
    <div className="p-6 min-h-screen text-white bg-gradient-to-br from-gray-950 via-black to-gray-900 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

      {/* Title */}
      <h1 className="text-5xl font-extrabold text-center mb-12 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 drop-shadow-lg">
        ⚔️ Welcome to NosDionisy ⚔️
      </h1>

      <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto relative ">
        {/* Left Column - Menu */}
        <div className="md:col-span-1 space-y-6">
          {menuItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleClick(item)}
              className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-5 rounded-2xl shadow-lg border border-gray-700 cursor-pointer 
              hover:shadow-xl hover:scale-105 hover:from-purple-800 hover:to-blue-900 transition transform duration-300 group"
            >
              <span className="text-lg font-bold tracking-wide bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent group-hover:from-pink-400 group-hover:to-yellow-400">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Right Column - Latest News */}
        <div className="md:col-span-2 space-y-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-lg mb-6">
            📰 Latest News
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading latest news...</p>
            </div>
          ) : latestNews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No news posts available yet.</p>
              <p className="text-gray-500 text-sm mt-2">Staff members can create posts that will appear here.</p>
            </div>
          ) : (
            latestNews.map((news, idx) => (
              <div
                key={news.id}
                onClick={() => handleNewsClick(news)}
                className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-2xl border border-gray-700 shadow-lg hover:shadow-yellow-500/30 hover:-translate-y-1 transition transform duration-300 cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold text-purple-300 group-hover:text-yellow-400 transition-colors">
                    {news.title}
                  </h3>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
