

export default function Home() {
  const latestNews = [
    {
      title: "New Dungeon Released!",
      date: "August 15, 2025",
      description:
        "The Dragon’s Lair is now live. Join forces with your guild and defeat the mighty beast for legendary loot.",
    },
    {
      title: "Server Maintenance",
      date: "August 10, 2025",
      description:
        "Servers will be down for scheduled maintenance on Aug 12 from 2:00 AM to 6:00 AM UTC.",
    },
    {
      title: "Summer Festival Event",
      date: "July 25, 2025",
      description:
        "Celebrate the season with exclusive quests, rewards, and limited-time items in the Summer Festival.",
    },
  ];

  const menuItems = [
    {
      label: "⬇️ Download Game",
      link: "https://nosdionisy.com/",
      external: true,
    },
    { label: "📰 News & Announcements", link: "/blog" },
    { label: "🎉 Events", link: "/events" },
    { label: "🎧 Support", link: "/support" },
    { label: "❓ FAQs", link: "/information" },
    { label: "⭐ Reviews", link: "/reviews" },
  ];

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-center mb-10">Welcome to NosDionisy</h1>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Left Column - Menu */}
        <div className="md:col-span-1 space-y-4">
          {menuItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() =>
                item.external
                  ? window.open(item.link, "_blank")
                  : (window.location.href = item.link)
              }
              className="bg-gray-900 p-4 rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
            >
              <span className="text-lg font-medium">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Right Column - Latest News */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold text-blue-400 mb-4">
            Latest News
          </h2>
          {latestNews.map((news, idx) => (
            <div
              key={idx}
              className="bg-gray-900 p-6 rounded-xl shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">{news.title}</h3>
                <span className="text-sm text-gray-400">{news.date}</span>
              </div>
              <p className="text-gray-300">{news.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
