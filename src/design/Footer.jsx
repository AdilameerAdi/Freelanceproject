export default function Footer() {
  return (
    <footer className="bg-[#0D1B2A] text-white py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About / Logo */}
        <div className="flex flex-col items-center md:items-start">
          <img
            src="https://board.dev.gameforge.com/images/styleLogo-bb5615dabb13a7af5dbd081b8ea5d521f9d1c79b.png"
            alt="Logo"
            className="w-32 h-auto mb-4"
          />
          <p className="text-center md:text-left text-sm">
            Bringing you the best gaming experience with a modern and elegant interface.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold mb-4 text-[#00BFFF]">Quick Links</h3>
          <ul className="space-y-2">
            <li className="hover:text-[#00BFFF] cursor-pointer transition-colors">Staff</li>
            <li className="hover:text-[#00BFFF] cursor-pointer transition-colors">Support</li>
            <li className="hover:text-[#00BFFF] cursor-pointer transition-colors">News</li>
            <li className="hover:text-[#00BFFF] cursor-pointer transition-colors">Updates</li>
            <li className="hover:text-[#00BFFF] cursor-pointer transition-colors">Shop</li>
          </ul>
        </div>

        {/* Contact / Socials */}
        <div>
          <h3 className="font-bold mb-4 text-[#00BFFF]">Connect with us</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: support@example.com</li>
            <li>Phone: +123 456 7890</li>
            <li className="flex space-x-3 mt-2">
              <a href="#" className="hover:text-[#00BFFF] transition-colors">Facebook</a>
              <a href="#" className="hover:text-[#00BFFF] transition-colors">Twitter</a>
              <a href="#" className="hover:text-[#00BFFF] transition-colors">Instagram</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-300">
        &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
      </div>
    </footer>
  );
}
