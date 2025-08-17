import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Faqs() {
  const faqs = [
    {
      question: "How do I download and install the game?",
      answer:
        "Click the 'Download Game' option from the homepage sidebar. It will redirect you to the official download page where you can install the client.",
    },
    {
      question: "Is the game free to play?",
      answer:
        "Yes! The game is completely free to play. Some premium items may be available in the shop, but gameplay is not restricted.",
    },
    {
      question: "How can I join events?",
      answer:
        "Events are announced in the News and Events section. Just log in during the event period and follow the event instructions.",
    },
    {
      question: "I found a bug, how do I report it?",
      answer:
        "Go to the Support page and submit your problem. Our staff team will review and resolve it as soon as possible.",
    },
    {
      question: "Where can I find patch notes and updates?",
      answer:
        "All updates are posted in the Updates section. You’ll find detailed patch notes and feature changes there.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-5xl mx-auto mt-28 px-6 py-10 bg-gradient-to-br from-gray-900 via-gray-800 mb-5 to-gray-900 rounded-3xl shadow-2xl border border-white/10">
      <h2 className="text-4xl font-extrabold text-center text-yellow-400 mb-10 drop-shadow-md">
        ❓ Frequently Asked Questions
      </h2>

      <div className="space-y-5">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-gray-800/60 backdrop-blur-md rounded-xl border border-gray-700 hover:border-yellow-400/40 transition-all duration-300 shadow-md"
          >
            {/* Question */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center px-6 py-4 text-lg font-semibold text-white hover:text-yellow-400 transition-colors"
            >
              <span>{faq.question}</span>
              <motion.span
                initial={false}
                animate={{ rotate: activeIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="ml-2 text-yellow-400 text-2xl leading-none"
              >
                ▼
              </motion.span>
            </button>

            {/* Answer (animated) */}
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="px-6 pb-5 text-gray-300 leading-relaxed"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
