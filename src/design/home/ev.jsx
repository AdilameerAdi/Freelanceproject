import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function TextEventSlider() {
  const events = [
    {
      title: "🔥 Summer PvP Tournament",
      date: "August 25, 2025",
      description: "Join the ultimate PvP showdown and win rare rewards!",
    },
    {
      title: "🎃 Halloween Raid Event",
      date: "October 31, 2025",
      description: "Face spooky bosses and collect exclusive Halloween items!",
    },
    {
      title: "❄️ Winter Festival",
      date: "December 20, 2025",
      description: "Celebrate winter with special quests and costumes!",
    },
  ];

  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % events.length);
    }, 5000); // auto-slide every 5s
    return () => clearInterval(timer);
  }, [events.length]);

  return (
    <div className="w-full bg-gradient-to-r mt-5 from-gray-900 via-gray-800 to-gray-900 py-12 px-6 shadow-lg">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6">
          Upcoming Events
        </h2>

        {/* Event Text Slider */}
        <div className="relative h-36 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <h3 className="text-3xl font-bold">{events[index].title}</h3>
              <p className="text-sm text-gray-400">{events[index].date}</p>
              <p className="mt-2 text-gray-300">{events[index].description}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Animated Buttons */}
        <div className="mt-6 flex justify-center gap-6">
          {/* News button - normal scale effect */}
          <motion.button
            onClick={() => navigate("/blog")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="px-6 py-2 rounded-lg bg-blue-500 text-white font-medium shadow-md hover:shadow-xl"
          >
            Go to News
          </motion.button>

          {/* Events button - jumping animation */}
          <motion.button
            onClick={() => navigate("/events")}
            animate={{
              y: [0, -8, 0], // jump up 8px then back
            }}
            transition={{
              duration: 1,
              repeat: Infinity, // keep jumping
              repeatType: "loop",
              ease: "easeInOut",
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="px-6 py-2 rounded-lg bg-green-500 text-white font-medium shadow-md hover:shadow-xl"
          >
            Go to Events
          </motion.button>
        </div>
      </div>
    </div>
  );
}
