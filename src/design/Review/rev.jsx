import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const initialReviews = [
  { id: 1, name: "Alex", rating: 5, comment: "Amazing game! PvP system is top-notch." },
  { id: 2, name: "Maya", rating: 4, comment: "Good experience but servers sometimes lag." },
  { id: 3, name: "John", rating: 3, comment: "Fun but needs more events and updates." },
  { id: 4, name: "Sophia", rating: 2, comment: "Too pay-to-win for my taste." },
  { id: 5, name: "Ryan", rating: 1, comment: "Couldn't even login properly, disappointed." },
];

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("all");
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });

  // Load reviews from localStorage (or fallback to initialReviews)
  useEffect(() => {
    const storedReviews = localStorage.getItem("reviews");
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    } else {
      setReviews(initialReviews);
      localStorage.setItem("reviews", JSON.stringify(initialReviews));
    }
  }, []);

  // Update localStorage whenever reviews change
  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem("reviews", JSON.stringify(reviews));
    }
  }, [reviews]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    const review = { id: Date.now(), ...newReview, rating: parseInt(newReview.rating) };
    const updatedReviews = [review, ...reviews];

    setReviews(updatedReviews);
    setNewReview({ name: "", rating: 5, comment: "" });
  };

  const filteredReviews =
    filter === "all" ? reviews : reviews.filter((r) => r.rating === parseInt(filter));

  return (
    <div className="p-10 bg-gradient-to-b mt-10 from-gray-950 via-gray-900 to-black min-h-screen text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-14"
      >
        <h1 className="text-5xl font-extrabold text-yellow-400 drop-shadow-lg">
          ⭐ Player Reviews
        </h1>
        <p className="text-gray-400 mt-3 text-lg">
          See what other players think and share your own experience!
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {["all", 5, 4, 3, 2, 1].map((val) => (
          <motion.button
            key={val}
            onClick={() => setFilter(val)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all shadow-md ${
              filter === val
                ? "bg-yellow-400 text-black shadow-yellow-400/50"
                : "bg-gray-800 hover:bg-gray-700 text-gray-300"
            }`}
          >
            {val === "all" ? "All Reviews" : `${val} Star`}
          </motion.button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="grid md:grid-cols-2 gap-7 max-w-6xl mx-auto mb-16">
        <AnimatePresence>
          {filteredReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-800 hover:border-yellow-400/50 hover:shadow-yellow-400/20 transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-white">{review.name}</h3>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < review.rating ? "text-yellow-400" : "text-gray-600"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">{review.comment}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Review Form */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto bg-gray-900/95 backdrop-blur-lg p-10 rounded-3xl shadow-xl border border-gray-800"
      >
        <h2 className="text-3xl font-bold mb-6 text-yellow-400">💬 Add Your Review</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm mb-1 text-gray-400">Your Name</label>
            <input
              type="text"
              name="name"
              value={newReview.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm mb-1 text-gray-400">Rating</label>
            <select
              name="rating"
              value={newReview.rating}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm mb-1 text-gray-400">Your Review</label>
            <textarea
              name="comment"
              value={newReview.comment}
              onChange={handleInputChange}
              placeholder="Write your thoughts..."
              rows="4"
              className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-500 shadow-md transition"
          >
            Submit Review
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
