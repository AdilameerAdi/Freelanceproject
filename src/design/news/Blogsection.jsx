import React, { useState } from "react";
import { ThumbsUp, MessageCircle, Flame } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "⚔️ New Hero Arrives!",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwZn7lrduCsvNB22D9vqShGouS6Xo2M1Tc2A&s",
    content: "Introducing our new hero with devastating abilities and exclusive skins. Unlock hidden powers and prepare for battle!",
    user: "Admin",
    likes: 42,
  },
  {
    id: 2,
    title: "🛠️ Massive Update Released",
    image: "https://thumbs.dreamstime.com/b/games-14152659.jpg",
    content: "The long-awaited update is here! New maps, ranked mode changes, and bug fixes. Log in now to claim your rewards.",
    user: "Admin",
    likes: 30,
  },
];

export default function CommunityHub() {
  const [activePost, setActivePost] = useState(posts[0]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [postLikes, setPostLikes] = useState(Object.fromEntries(posts.map((p) => [p.id, p.likes])));
  const [commentLikes, setCommentLikes] = useState({});

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

  const togglePostLike = (id) => {
    setPostLikes({ ...postLikes, [id]: postLikes[id] + 1 });
  };

  const toggleCommentLike = (id) => {
    setCommentLikes({ ...commentLikes, [id]: (commentLikes[id] || 0) + 1 });
  };

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 max-w-7xl mx-auto mt-8">

        {/* Main Post Section */}
        <div className="md:col-span-2 flex flex-col bg-[#111a2c] border border-purple-500/40 rounded-2xl shadow-2xl p-6 hover:shadow-purple-500/30 transition relative overflow-hidden">

          {/* Neon Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-3xl"></div>

          <div className="flex justify-between items-center mb-6 relative">
            <h2 className="text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              {activePost.title}
            </h2>
            <button
              onClick={() => togglePostLike(activePost.id)}
              className="flex items-center gap-2 bg-purple-600/20 px-4 py-2 rounded-xl hover:bg-purple-600/40 transition"
            >
              <ThumbsUp size={18} className="text-purple-400" />
              <span>{postLikes[activePost.id]}</span>
            </button>
          </div>

          {/* Post Content */}
          <div className="flex flex-col md:flex-row gap-6 relative">
            <img
              src={activePost.image}
              alt={activePost.title}
              className="w-full md:w-80 h-64 object-cover rounded-xl border border-purple-500/30 shadow-lg"
            />
            <p className="text-gray-300 leading-relaxed text-lg">{activePost.content}</p>
          </div>

          {/* Comments */}
          <div className="mt-6 relative">
            <h3 className="text-lg font-bold text-cyan-400 flex items-center gap-2 mb-3">
              <MessageCircle size={18} /> Community Chat
            </h3>

            <div className="space-y-3 overflow-y-auto max-h-48 pr-2">
              {comments.length === 0 && <p className="text-gray-500 italic">No comments yet. Start the conversation!</p>}
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-3 bg-[#0d1324] border border-gray-700 p-3 rounded-xl">
                  <img src={c.avatar} alt="avatar" className="w-10 h-10 rounded-full border border-cyan-400/40" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-purple-400">{c.user}</p>
                    <p className="text-gray-200">{c.text}</p>
                  </div>
                  <button
                    onClick={() => toggleCommentLike(c.id)}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-cyan-400 transition"
                  >
                    <ThumbsUp size={14} /> {commentLikes[c.id] || 0}
                  </button>
                </div>
              ))}
            </div>

            {/* Comment Box */}
            <div className="flex gap-2 mt-4">
              <input
                type="text"
                placeholder="Type your message..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-[#0b0f1a] border border-gray-700 text-white focus:outline-none focus:border-purple-400"
              />
              <button
                onClick={handleCommentSubmit}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 
                text-white font-bold hover:from-purple-400 hover:to-cyan-400 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="bg-[#111a2c] border border-purple-500/40 rounded-2xl shadow-2xl p-6 flex flex-col gap-4 hover:shadow-purple-500/30 transition">
          <h3 className="font-bold text-xl text-purple-400 flex items-center gap-2">
            <Flame size={18} /> Trending Posts
          </h3>
          {posts.map((post) => (
            <button
              key={post.id}
              onClick={() => setActivePost(post)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition 
                ${activePost.id === post.id ? "bg-purple-600/20 border-purple-400" : "hover:bg-[#1a2336] border-gray-700"}`}
            >
              <img src={post.image} alt={post.title} className="w-14 h-14 rounded-lg border border-purple-500/30" />
              <div className="flex-1 text-left">
                <p className="text-white font-semibold text-sm">{post.title}</p>
                <p className="text-gray-400 text-xs line-clamp-2">{post.content}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
