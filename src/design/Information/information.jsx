import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import logo from "../img/2.png"; // Dionisy logo
import boxes from "../img/boxes.png";
import first from "../img/first.png"
import second from "../img/second.png"
import third from "../img/three.png"
import fourth from "../img/fourth.png"
import fifth from "../img/fifth.png"

export default function Information() {
  const sections = [
     {
      title: "Prestige Legacy",
      points: [
        "Progress through 10 Prestige levels, each with unique multi-step challenges and timed solo boss duels.",
        "Earn customisable stat bonuses—some chosen by you, some unlocked.",
        "Showcase your unique Prestige identity.",
      ],
      image:first,
    },
    {
      title: "Party Quests",
      points: [
        "Instanced 1–3 player challenges, daily and weekly.",
        "EXP scales to your level and performance.",
        "No endless questlines progression is fast and co-operative.",
      ],
      image:
       second,
    },
    {
      title: "Raffle System",
      points: [
        "Join events to earn raffle entries for gold, rare items, gems and surprises.",
        "Each draw features unique rules and rotating rewards.",
      ],
      image:
       third,
    },
  
     {
      title: "Dynamic Gameplay & Events",
      points: [
        "RBB and Icebreaker, now with smarter rules.",
        "Survival PvE/PvP improved private instances, solo/group World Bosses.",
        "Express Raids—quicker, higher rewards.",
        "Chill Instance: gain EXP and reputation just by socialising.",
        "Classic areas and event maps refreshed and improved.",
      ],
      image:
        fourth,
    },
    {
      title: "A Better Way to Play",
      points: [
        "Less waiting, more action.",
        "Every system refined for smoother, faster, and more flexible gameplay.",
        "More freedom to play your way.",
      ],
      image:
        fifth,
    },
  ];

  return (
    <div className="bg-[#3F9421] mt-10 min-h-screen py-10 relative">
      {/* Dionisy Logo */}
      <div className="flex bg-gradient-to-b from-white via-white to-sky-400 justify-center ">
        <img src={logo} alt="Dionisy Logo" className="h-20  md:h-36 drop-shadow-lg" />
      </div>

      {/* Welcome Block */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-[#211610] text-white rounded-2xl p-10 shadow-xl max-w-4xl mx-auto mb-14 relative overflow-hidden border-4 border-green-700"
      >
        <h1 className="text-4xl font-bold text-center mb-6 text-yellow-300 drop-shadow">
          Welcome to Dionisy!
        </h1>
        <p className="text-center text-gray-200 mb-8 max-w-2xl mx-auto">
          A new adventure for NosTale with balanced progression. Discover unique
          challenges, custom systems, and exclusive rewards.
          <br /> <br />
          Everything changed when something came from the sky—are you ready for what
          comes next?
        </p>

        {/* Cartoon Character (replaces wooden buttons) */}
        

        {/* Boxes image from local import */}
        <div>
          <img src={boxes} alt="Boxes" className="w-full object-cover" />
        </div>
      </motion.div>

      {/* 5 Boxes */}
    {sections.map((section, idx) => (
  <motion.div
    key={idx}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: idx * 0.1 }}
    viewport={{ once: true }}
    className="bg-[#211610] rounded-2xl p-10 shadow-xl max-w-4xl mx-auto mb-32 border-4 border-green-700 relative overflow-visible"
  >
    <div className="flex flex-col items-center">
      {/* Title */}
      <h3 className="text-2xl font-bold text-white mb-4">{section.title}</h3>

      {/* Text List */}
      <ul className="text-white space-y-2 text-left max-w-md mb-10">
        {section.points.map((point, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle2 className="text-green-600 w-5 h-5 mt-1" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      {/* Image (half inside/half outside) */}
      <div className="relative w-full flex justify-center">
        <img
          src={section.image}
          alt={section.title}
          className="w-full object-contain relative -mb-20" 
        />
      </div>
    </div>
  </motion.div>
))}

      {/* Footer */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mt-16 text-white drop-shadow">
        Ready for your next adventure? <br /> Welcome to Dionisy.
      </h2>
    </div>
  );
}
