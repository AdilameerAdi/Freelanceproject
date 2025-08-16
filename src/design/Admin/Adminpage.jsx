

export default function AdminPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-[#001F3F]">
      <div className="bg-[#FFDC00] p-8 rounded-lg w-80">
        <h2 className="text-xl font-bold mb-4 text-[#001F3F]">Admin Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full border border-[#2ECC40] px-3 py-2 mb-3 rounded focus:outline-none focus:border-[#7FDBFF]"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-[#2ECC40] px-3 py-2 mb-4 rounded focus:outline-none focus:border-[#7FDBFF]"
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-[#2ECC40] hover:bg-[#7FDBFF] transition-colors text-[#001F3F]"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-[#FFDC00] text-[#001F3F] hover:bg-[#2ECC40] transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
