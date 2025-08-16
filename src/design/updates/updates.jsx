import React from "react";

export default function Updates() {
  const updates = [
    {
      version: "v1.2.0",
      date: "August 15, 2025",
      highlights: "Major content expansion with a new dungeon and guild system.",
      newFeatures: [
        "Added new dungeon: Dragon’s Lair",
        "Introduced Guild System with chat and raids",
      ],
      fixes: [
        "Fixed bug causing login issues",
        "Resolved crash when entering PvP arena",
      ],
      balance: [
        "Mage fireball damage reduced by 10%",
        "Warrior stamina increased by 15%",
      ],
    },
    {
      version: "v1.1.0",
      date: "July 10, 2025",
      highlights: "Summer festival and character balance adjustments.",
      newFeatures: ["New Summer Festival Event", "Added costume skins"],
      fixes: ["Fixed quest tracker not updating properly"],
      balance: ["Archer critical hit chance reduced slightly"],
    },
  ];

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-10 text-center">Game Updates</h1>

      <div className="relative border-l border-gray-700 max-w-3xl mx-auto">
        {updates.map((update, idx) => (
          <div key={idx} className="mb-10 ml-6">
            {/* Timeline Dot */}
            <div className="absolute w-3 h-3 bg-blue-500 rounded-full mt-2.5 -left-1.5 border border-gray-900"></div>

            {/* Update Card */}
            <div className="bg-gray-900 p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-blue-400">
                  {update.version}
                </h2>
                <span className="text-sm text-gray-400">{update.date}</span>
              </div>

              {/* Highlights */}
              <p className="text-gray-300 italic mb-4">{update.highlights}</p>

              {/* Sections */}
              <div className="space-y-3">
                {update.newFeatures?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-green-400">✨ New</h3>
                    <ul className="list-disc list-inside text-gray-300 ml-2">
                      {update.newFeatures.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {update.fixes?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-blue-400">🔧 Fixes</h3>
                    <ul className="list-disc list-inside text-gray-300 ml-2">
                      {update.fixes.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {update.balance?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-yellow-400">⚖️ Balance</h3>
                    <ul className="list-disc list-inside text-gray-300 ml-2">
                      {update.balance.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
