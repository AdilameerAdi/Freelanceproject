import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, PlusCircle } from "lucide-react";
import { supportService } from "../../services/supabase";

export default function Support() {
  const [activeTab, setActiveTab] = useState("submit");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "Technical Issue",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState([]);
  const [solved, setSolved] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate user identifier for session tracking
  const getUserIdentifier = () => {
    let userIdentifier = localStorage.getItem('userIdentifier');
    if (!userIdentifier) {
      userIdentifier = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('userIdentifier', userIdentifier);
    }
    return userIdentifier;
  };

  useEffect(() => {
    loadUserTickets();
  }, []);

  const loadUserTickets = async () => {
    try {
      setLoading(true);
      const userIdentifier = getUserIdentifier();
      const tickets = await supportService.getTicketsByUser(userIdentifier);
      
      const pendingTickets = tickets.filter(ticket => ticket.status === 'pending');
      const resolvedTickets = tickets.filter(ticket => ticket.status === 'resolved');
      
      setPending(pendingTickets);
      setSolved(resolvedTickets);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const userIdentifier = getUserIdentifier();
      
      const ticketData = {
        title: formData.subject,
        description: formData.description,
        category: formData.category,
        user_name: formData.name,
        user_email: formData.email,
        user_identifier: userIdentifier
      };

      await supportService.createTicket(ticketData);

      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "Technical Issue",
        description: "",
      });
      setErrors({});
      
      // Reload tickets to show the new one
      await loadUserTickets();
      setActiveTab("pending");
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to submit ticket. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 min-h-screen text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p>Loading support tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 mt-10 min-h-screen text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black">
    <div className="relative p-4">
  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-center">
    {/* White shadow layer */}
    <span className="absolute inset-0 p-4 text-white drop-shadow-lg">
      🎮 Gaming Support Center
    </span>

    {/* Gradient layer */}
    <span className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
      🎮 Gaming Support Center
    </span>
  </h1>
</div>


      {/* Navigation Tabs */}
      <div className="flex flex-col mt-5 sm:flex-row justify-center gap-3 sm:gap-6 mb-8 sm:mb-10">
        <button
          onClick={() => setActiveTab("submit")}
          className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold tracking-wide transition-all text-sm sm:text-base ${
            activeTab === "submit"
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/40"
              : "bg-gray-800 text-gray-300 hover:from-gray-700 hover:to-gray-600 hover:bg-gradient-to-r"
          }`}
        >
          <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" /> Submit Request
        </button>

        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold tracking-wide transition-all text-sm sm:text-base ${
            activeTab === "pending"
              ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg shadow-yellow-500/40"
              : "bg-gray-800 text-gray-300 hover:from-gray-700 hover:to-gray-600 hover:bg-gradient-to-r"
          }`}
        >
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" /> Pending Problems
        </button>

        <button
          onClick={() => setActiveTab("solved")}
          className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold tracking-wide transition-all text-sm sm:text-base ${
            activeTab === "solved"
              ? "bg-gradient-to-r from-green-400 to-emerald-600 text-black shadow-lg shadow-green-500/40"
              : "bg-gray-800 text-gray-300 hover:from-gray-700 hover:to-gray-600 hover:bg-gradient-to-r"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> Resolved Problems
        </button>
      </div>

      {/* Card Content */}
      <div className="max-w-xl sm:max-w-2xl mx-auto">
        {/* Submit Request */}
        {activeTab === "submit" && (
          <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 border border-blue-500/60 p-4 sm:p-6 rounded-2xl shadow-2xl shadow-blue-500/20">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-300">
              Open a Ticket
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg bg-black/50 text-white border text-sm sm:text-base ${
                    errors.name
                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                      : "border-gray-600 focus:ring-2 focus:ring-blue-500"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg bg-black/50 text-white border text-sm sm:text-base ${
                    errors.email
                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                      : "border-gray-600 focus:ring-2 focus:ring-blue-500"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Subject */}
              <div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject of Issue"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg bg-black/50 text-white border text-sm sm:text-base ${
                    errors.subject
                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                      : "border-gray-600 focus:ring-2 focus:ring-purple-500"
                  }`}
                />
                {errors.subject && (
                  <p className="text-red-400 text-sm mt-1">{errors.subject}</p>
                )}
              </div>

              {/* Category */}
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-black/50 text-white border border-gray-600 focus:ring-2 focus:ring-pink-500 text-sm sm:text-base"
              >
                <option value="Technical Issue">Technical Issue</option>
                <option value="Account Problem">Account Problem</option>
                <option value="Payment Issue">Payment Issue</option>
                <option value="Game Bug">Game Bug</option>
                <option value="Feature Request">Feature Request</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Report Player">Report Player</option>
                <option value="Other">Other</option>
              </select>

              {/* Description */}
              <div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your issue..."
                  className={`w-full p-3 rounded-lg bg-black/50 text-white border text-sm sm:text-base ${
                    errors.description
                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                      : "border-gray-600 focus:ring-2 focus:ring-green-500"
                  }`}
                  rows="4"
                />
                {errors.description && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 transition rounded-lg py-2 font-bold tracking-wide shadow-lg shadow-purple-500/40 text-sm sm:text-base"
              >
                🚀 Submit Ticket
              </button>
            </form>
          </div>
        )}

        {/* Pending Problems */}
        {activeTab === "pending" && (
          <div className="bg-gradient-to-br from-yellow-900 via-orange-900 to-gray-900 border border-yellow-500/60 p-4 sm:p-6 rounded-2xl shadow-2xl shadow-yellow-500/20">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-yellow-300 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" /> Pending Tickets
            </h2>
            {pending.length > 0 ? (
              <ul className="space-y-3">
                {pending.map((item) => (
                  <li
                    key={item.id}
                    className="p-3 sm:p-4 bg-black/50 rounded-lg border-l-4 border-yellow-400 hover:bg-yellow-900/30 transition"
                  >
                    <p className="font-bold text-white">{item.title}</p>
                    <p className="text-xs sm:text-sm text-gray-400">
                      By {item.user_name} | {item.category}
                    </p>
                    <p className="mt-1 text-sm">{item.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Submitted: {new Date(item.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 italic">No pending tickets.</p>
            )}
          </div>
        )}

        {/* Solved Problems */}
        {activeTab === "solved" && (
          <div className="bg-gradient-to-br from-green-900 via-emerald-900 to-gray-900 border border-green-500/60 p-4 sm:p-6 rounded-2xl shadow-2xl shadow-green-500/20">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-green-300 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> Resolved Tickets
            </h2>
            {solved.length > 0 ? (
              <ul className="space-y-3">
                {solved.map((item) => (
                  <li
                    key={item.id}
                    className="p-3 sm:p-4 bg-black/50 rounded-lg border-l-4 border-green-400 hover:bg-green-900/30 transition"
                  >
                    <p className="font-bold text-white">{item.title}</p>
                    <p className="text-xs sm:text-sm text-gray-400">
                      By {item.user_name} | {item.category}
                    </p>
                    <p className="mt-1 text-sm">{item.description}</p>
                    {item.admin_response && (
                      <div className="mt-3 p-2 bg-green-900/20 rounded border-l-2 border-green-400">
                        <p className="text-xs text-green-400 font-semibold">Admin Response:</p>
                        <p className="text-sm text-green-300">{item.admin_response}</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Resolved: {new Date(item.resolved_at || item.updated_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {item.resolved_by && <span> by {item.resolved_by}</span>}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 italic">No resolved tickets yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
