import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

export default function TextEventSlider({ events = [] }) {
  // Filter to only show upcoming and ongoing events in the slider
  const sliderEvents = events.filter(event => 
    event.status === "upcoming" || event.status === "ongoing"
  );

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sliderEvents.length > 0 && !isPaused) {
      const timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % sliderEvents.length);
      }, 4000); // auto-slide every 4s
      return () => clearInterval(timer);
    }
  }, [sliderEvents.length, isPaused]);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % sliderEvents.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + sliderEvents.length) % sliderEvents.length);
  };

  const goToSlide = (slideIndex) => {
    setIndex(slideIndex);
  };

  if (sliderEvents.length === 0) {
    return (
      <div className="w-full bg-gradient-to-r mt-5 from-gray-900 via-gray-800 to-gray-900 py-12 px-6 shadow-lg">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-yellow-400 mb-6">
            Upcoming Events
          </h2>
          <div className="relative h-48 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-400">No Events Available</h3>
              <p className="text-gray-500 mt-2">Check back later for upcoming events!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br mt-5 from-gray-900 via-gray-800 to-black py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 shadow-2xl relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-20"></div>
        <div className="absolute top-32 right-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-25"></div>
        <div className="absolute bottom-32 right-1/3 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-20"></div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative">
        <motion.h2 
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          🎮 Featured Events
        </motion.h2>

        {/* Enhanced Event Slider */}
        <div className="relative">
          {/* Main Slider Container */}
          <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 overflow-hidden shadow-xl">
            
            {/* Navigation Arrows */}
            {sliderEvents.length > 1 && (
              <>
                <motion.button
                  onClick={prevSlide}
                  className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-gray-800/80 hover:bg-gray-700 text-white p-2 sm:p-3 rounded-full transition-all duration-200 shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft size={20} />
                </motion.button>
                
                <motion.button
                  onClick={nextSlide}
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-gray-800/80 hover:bg-gray-700 text-white p-2 sm:p-3 rounded-full transition-all duration-200 shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight size={20} />
                </motion.button>
              </>
            )}

            {/* Play/Pause Button */}
            {sliderEvents.length > 1 && (
              <motion.button
                onClick={() => setIsPaused(!isPaused)}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-gray-800/80 hover:bg-gray-700 text-white p-2 rounded-full transition-all duration-200 shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isPaused ? <Play size={16} /> : <Pause size={16} />}
              </motion.button>
            )}

            {/* Event Content */}
            <div className="flex items-center justify-center h-full px-4 sm:px-8 md:px-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="text-center w-full"
                >
                  {/* Event Icon with glow effect */}
                  <motion.div 
                    className="relative mb-4"
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: sliderEvents[index].status === "ongoing" ? [1, 1.1, 1] : 1
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    <span className="text-4xl sm:text-5xl md:text-6xl drop-shadow-lg relative">
                      {sliderEvents[index].icon}
                    </span>
                    {sliderEvents[index].status === "ongoing" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                    )}
                  </motion.div>

                  {/* Event Title with gradient */}
                  <motion.h3 
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {sliderEvents[index].title}
                  </motion.h3>

                  {/* Event Date with icon */}
                  <motion.p 
                    className="text-yellow-400 font-medium mb-2 sm:mb-3 flex items-center justify-center gap-2 text-sm sm:text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-lg">📅</span>
                    {sliderEvents[index].date}
                  </motion.p>

                  {/* Event Description */}
                  <motion.p 
                    className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto px-2 sm:px-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {sliderEvents[index].description}
                  </motion.p>

                  {/* Status Badge */}
                  {sliderEvents[index].status === "ongoing" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className="mt-4"
                    >
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-bold shadow-lg animate-pulse">
                        <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                        LIVE NOW
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Slide Indicators */}
          {sliderEvents.length > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {sliderEvents.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i === index 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          )}

          {/* Progress Bar */}
          {sliderEvents.length > 1 && !isPaused && (
            <div className="mt-4 w-full bg-gray-700 rounded-full h-1 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                key={index}
              />
            </div>
          )}
        </div>

        {/* Enhanced Action Buttons */}
        <motion.div 
          className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={() => navigate("/blog")}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform text-sm sm:text-base"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            📰 Latest News
          </motion.button>

          <motion.button
            onClick={() => navigate("/events")}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform text-sm sm:text-base"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              y: [0, -2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🎉 View All Events
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}