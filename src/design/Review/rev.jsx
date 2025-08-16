import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const initialReviews = [
  { id: 1, name: "Alex", rating: 5, comment: "Amazing game! PvP system is top-notch." },
  { id: 2, name: "Maya", rating: 4, comment: "Good experience but servers sometimes lag." },
  { id: 3, name: "John", rating: 3, comment: "Fun but needs more events and updates." },
  { id: 4, name: "Sophia", rating: 2, comment: "Too pay-to-win for my taste." },
  { id: 5, name: "Ryan", rating: 1, comment: "Couldn't even login properly, disappointed." },
];

export default function Reviews() {
  const [reviews, setReviews] = useState(initialReviews);
  const [filter, setFilter] = useState("all");
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    const review = { id: Date.now(), ...newReview, rating: parseInt(newReview.rating) };
    setReviews([review, ...reviews]);
    setNewReview({ name: "", rating: 5, comment: "" });
  };

  const filteredReviews =
    filter === "all"
      ? reviews
      : reviews.filter((r) => r.rating === parseInt(filter));

  return (
    <div className="p-8 bg-gradient-to-br mt-10 from-gray-950 via-gray-900 to-gray-950 min-h-screen text-white">
      <h1 className="text-4xl font-extrabold text-center text-yellow-400 mb-12 tracking-wide">
        ⭐ Player Reviews
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {["all", 5, 4, 3, 2, 1].map((val) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition transform hover:scale-105 ${
              filter === val
                ? "bg-yellow-400 text-black shadow-lg"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            {val === "all" ? "All Reviews" : `${val} Star`}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-14">
        <AnimatePresence>
          {filteredReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-800 hover:border-yellow-400/40 transition"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">{review.name}</h3>
                <span className="text-yellow-400 text-lg">
                  {"⭐".repeat(review.rating)}
                </span>
              </div>
              <p className="text-gray-300">{review.comment}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Review Form */}
      <div className="max-w-3xl mx-auto bg-gray-900/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-800">
        <h2 className="text-2xl font-semibold mb-6 text-yellow-400">💬 Add Your Review</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={newReview.name}
            onChange={handleInputChange}
            placeholder="Your Name"
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <select
            name="rating"
            value={newReview.rating}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Star
              </option>
            ))}
          </select>
          <textarea
            name="comment"
            value={newReview.comment}
            onChange={handleInputChange}
            placeholder="Write your review..."
            rows="4"
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition"
          >
            Submit Review
          </motion.button>
        </form>
      </div>
    </div>
  );
}
