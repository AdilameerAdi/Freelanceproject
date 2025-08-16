import React from "react";

export default function Information() {
  const sections = [
    {
      title: "📖 Getting Started",
      description:
        "New to the game? Learn how to download, install, and create your first character.",
      links: ["Download Guide", "Account Creation", "Beginner’s Tips"],
    },
    {
      title: "⚔️ Gameplay Basics",
      description:
        "Understand the core mechanics of combat, leveling, and progression.",
      links: ["Classes & Roles", "Leveling Guide", "PvE vs PvP"],
    },
    {
      title: "🏰 World & Lore",
      description:
        "Dive into the story of the game world, its factions, and legendary creatures.",
      links: ["Main Storyline", "Regions & Maps", "Bosses & Dungeons"],
    },
    {
      title: "💎 Economy & Items",
      description:
        "Learn about in-game currency, trading, crafting, and rare loot.",
      links: ["Gold & Currency", "Crafting Guide", "Legendary Items"],
    },
    {
      title: "❓ FAQs & Support",
      description:
        "Got questions? Find quick answers or get help with your issues.",
      links: ["Frequently Asked Questions", "Rules & Policies", "Contact Support"],
    },
  ];

  return (
    <div className="p-8 bg-gray-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-10 text-center">Game Information</h1>

      {/* Grid Layout */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {sections.map((sec, idx) => (
          <div
            key={idx}
            className="bg-gray-900 p-6 rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition"
          >
            <h2 className="text-xl font-semibold mb-2 text-blue-400">
              {sec.title}
            </h2>
            <p className="text-gray-300 mb-4">{sec.description}</p>
            <ul className="space-y-1 text-gray-400 text-sm">
              {sec.links.map((link, i) => (
                <li
                  key={i}
                  className="hover:text-blue-300 cursor-pointer transition"
                >
                  ➝ {link}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
