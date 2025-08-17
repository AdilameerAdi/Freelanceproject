import React from "react";
import { motion } from "framer-motion";

export default function Information() {
  const sections = [
    {
      title: "Getting Started",
      description: "Forge your path into the world of Nos Dionisy. Download the client, create your hero, and step into battle.",
      links: ["Download Client", "Create Account", "New Player Guide"],
    },
    {
      title: "Gameplay Basics",
      description: "Learn to master combat, explore dungeons, and rise in power as a true warrior of Dionisy.",
      links: ["Classes & Skills", "Leveling Guide", "PvP & Arena"],
    },
    {
      title: "World & Lore",
      description: "Discover the dark legends, ancient ruins, and monstrous foes that shape this universe.",
      links: ["Main Storyline", "Regions & Maps", "Bosses & Raids"],
    },
    {
      title: "Economy & Items",
      description: "Trade with adventurers, craft powerful artifacts, and uncover legendary loot.",
      links: ["Gold & Trading", "Crafting System", "Rare Treasures"],
    },
    {
      title: "Support & FAQ",
      description: "Need assistance? Our guild masters and support heroes are ready to guide you.",
      links: ["FAQs", "Community Rules", "Contact Support"],
    },
  ];

  return (
    <div
      className="min-h-screen bg-cover mt-10 bg-center text-white p-10"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 "></div>

      <h1 className="relative \text-5xl md:text-6xl font-extrabold text-center mb-16 bg-gradient-to-r from-red-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg tracking-wider">
        ⚔️ Nos Dionisy: Game Codex ⚔️
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto relative ">
        {sections.map((sec, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05, rotate: -1 }}
            className="bg-gray-900/80 backdrop-blur-md border border-purple-600/40 rounded-2xl p-6 shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_40px_rgba(34,211,238,0.7)] transition duration-300"
          >
            <h2 className="text-2xl font-bold mb-4 text-purple-300 drop-shadow">
              {sec.title}
            </h2>

            <p className="text-gray-300 mb-6">{sec.description}</p>

            <div className="flex flex-col gap-3">
              {sec.links.map((link, i) => (
                <button
                  key={i}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg text-sm font-semibold hover:from-cyan-500 hover:to-purple-600 transition"
                >
                  {link}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
