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
    <div className="max-w-4xl mx-auto mt-15 p-6 my-5  bg-gray-900 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
        ❓ Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-md"
          >
            {/* Question */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left px-6 py-4 text-lg font-medium flex justify-between items-center text-white hover:bg-gray-700"
            >
              {faq.question}
              <span className="ml-2 text-yellow-400">
                {activeIndex === index ? "−" : "+"}
              </span>
            </button>

            {/* Answer (animated) */}
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="px-6 pb-4 text-gray-300"
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
