import  { useState } from "react";

export default function Support() {
  const [problem, setProblem] = useState("");
  const [pending, setPending] = useState([
    { id: 1, text: "Game not loading properly" },
    { id: 2, text: "Payment issue with shop" },
  ]);
  const [solved, setSolved] = useState([
    { id: 3, text: "Login bug fixed" },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!problem.trim()) return;
    const newProblem = { id: Date.now(), text: problem };
    setPending([...pending, newProblem]);
    setProblem("");
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Support Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Submit Form */}
        <div className="bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">
            Submit a Problem
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Describe your issue..."
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 transition rounded-lg py-2 font-semibold"
            >
              Submit Request
            </button>
          </form>
        </div>

        {/* Right Column - Pending & Solved */}
        <div className="bg-gray-800 p-6 rounded-xl shadow flex flex-col space-y-6">
          {/* Pending */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">
              Pending Problems
            </h2>
            {pending.length > 0 ? (
              <ul className="space-y-3">
                {pending.map((item) => (
                  <li key={item.id} className="p-3 bg-gray-700 rounded-lg">
                    {item.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No pending problems.</p>
            )}
          </div>

          {/* Solved */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">
              Solved Problems
            </h2>
            {solved.length > 0 ? (
              <ul className="space-y-3">
                {solved.map((item) => (
                  <li
                    key={item.id}
                    className="p-3 bg-green-700 rounded-lg line-through"
                  >
                    {item.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No solved problems yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
