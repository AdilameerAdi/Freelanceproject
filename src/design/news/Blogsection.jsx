import React, { useState } from "react";

const posts = [
  {
    id: 1,
    title: "We Made a New Character in Game",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwZn7lrduCsvNB22D9vqShGouS6Xo2M1Tc2A&s",
    content:
      "Introducing our new character! Explore its abilities and unlock special features in the game. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    user: "Admin",
  },
  {
    id: 2,
    title: "Game Update Released",
    image: "https://thumbs.dreamstime.com/b/games-14152659.jpg",
    content:
      "Check out the latest update with new maps, missions, and bug fixes. Upgrade now for a better experience! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    user: "Admin",
  },
  // Add more posts here
];

export default function BlogSection() {
  const [activePost, setActivePost] = useState(posts[0]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = () => {
    if (commentText.trim() === "") return;
    setComments([...comments, { user: "You", text: commentText }]);
    setCommentText("");
  };

  return (
    <div className="max-w-7xl mt-10 mx-auto px-4 py-8 h-screen grid grid-cols-1 md:grid-cols-3 gap-8 bg-gradient-to-b from-blue-300 via-blue-100 to-white">
      {/* Left Column - Main Post */}
      <div className="md:col-span-2 bg-[#1B263B] p-4 rounded shadow-lg flex flex-col overflow-y-auto max-h-full">
        <h2 className="text-2xl font-bold text-[#00BFFF] mb-2">{activePost.title}</h2>
        <div className="flex flex-col md:flex-row items-start gap-4 mb-2">
          <img
            src={activePost.image}
            alt={activePost.title}
            className="w-full md:w-64 h-64 object-cover rounded flex-shrink-0"
          />
          <p className="text-gray-300">{activePost.content}</p>
        </div>

        {/* Comments Section */}
        <div className="mt-4 flex flex-col">
          <h3 className="text-[#00BFFF] font-bold mb-2">Comments</h3>
          <div className="space-y-2 overflow-y-auto max-h-48 mb-2">
            {comments.length === 0 && (
              <p className="text-gray-400">No comments yet. Be the first to comment!</p>
            )}
            {comments.map((c, idx) => (
              <div key={idx} className="bg-[#0D1B2A] p-2 rounded text-gray-300">
                <span className="font-bold text-[#00BFFF]">{c.user}:</span> {c.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 px-3 py-2 rounded bg-[#0D1B2A] border border-gray-600 text-white focus:outline-none focus:border-[#00BFFF]"
            />
            <button
              onClick={handleCommentSubmit}
              className="px-4 py-2 rounded bg-[#00BFFF] text-[#0D1B2A] font-medium hover:bg-[#009ACD] transition-colors"
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Right Column - Latest Posts Sidebar */}
      <div className="md:col-span-1 bg-[#1B263B] p-4 rounded shadow-lg flex flex-col overflow-y-auto max-h-full">
        <h3 className="font-bold text-[#00BFFF] text-lg mb-2">Latest News</h3>
        <div className="flex flex-col gap-2">
          {posts.map((post) => (
            <button
              key={post.id}
              onClick={() => setActivePost(post)}
              className="flex items-center gap-2 w-full text-left hover:bg-[#0D1B2A] p-2 rounded transition-colors"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-12 h-12 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1">
                <p className="text-white font-semibold hover:text-[#00BFFF]">{post.title}</p>
                <p className="text-gray-400 text-sm line-clamp-2">{post.content}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
