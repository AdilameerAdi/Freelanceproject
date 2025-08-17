import React from "react";
import { motion } from "framer-motion";

export default function Information() {
  const sections = [
    {
      title: "Getting Started",
      description: "Start your epic journey! Install the game, set up your hero, and prepare for adventure.",
      links: ["Download Guide", "Account Setup", "Beginner’s Path"],
    },
    {
      title: "Gameplay Basics",
      description: "Master combat, leveling, and survival in a world full of danger.",
      links: ["Classes & Roles", "Leveling Guide", "PvE & PvP"],
    },
    {
      title: "World & Lore",
      description: "Uncover the legends, regions, and ancient creatures of the realm.",
      links: ["Storyline", "Maps & Regions", "Bosses & Dungeons"],
    },
    {
      title: "Economy & Items",
      description: "Earn, trade, craft, and hunt for legendary treasures.",
      links: ["Gold & Currency", "Crafting", "Legendary Loot"],
    },
    {
      title: "Support & FAQ",
      description: "Need help? Find answers or contact our support guild.",
      links: ["FAQs", "Rules & Policies", "Contact Support"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b mt-10 from-gray-950 via-gray-900 to-black text-white p-10">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-14 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
        ⚡ Game Information ⚡
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {sections.map((sec, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gray-900/80 border border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-cyan-500/40 transition relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>

            <div className="mb-4 relative z-10">
              <h2 className="text-2xl font-bold tracking-wide group-hover:text-cyan-400 transition">
                {sec.title}
              </h2>
            </div>

            <p className="text-gray-300 mb-5 relative z-10">{sec.description}</p>

            <ul className="space-y-2 relative z-10">
              {sec.links.map((link, i) => (
                <li
                  key={i}
                  className="text-sm text-gray-400 flex items-center gap-2 cursor-pointer hover:text-cyan-300 transition"
                >
                  <span className="text-cyan-400">➝</span> {link}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
