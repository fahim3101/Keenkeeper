export default function Footer() {
  return (
    <footer className="bg-[#214f3b] text-white py-16 mt-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        
        {/* Logo */}
        <h2 className="text-4xl font-bold mb-6 tracking-tight text-white">KeenKeeper</h2>
        
        {/* Description */}
        <p className="text-gray-300 max-w-lg mx-auto mb-10 text-base leading-relaxed">
          Your personal shelf of meaningful connections. Browse, tend, and nurture the relationships that matter most.
        </p>

        {/* Social Icons */}
        <div className="flex justify-center gap-8 mb-12">
          <a href="#" className="hover:opacity-80 transition">
            <img src="/assets/twitter.png" alt="Twitter" className="w-6 h-6 invert brightness-0" />
          </a>
          <a href="#" className="hover:opacity-80 transition">
            <img src="/assets/facebook.png" alt="Facebook" className="w-6 h-6 invert brightness-0" />
          </a>
          <a href="#" className="hover:opacity-80 transition">
            <img src="/assets/instagram.png" alt="Instagram" className="w-6 h-6 invert brightness-0" />
          </a>
        </div>

        {/* Divider and Bottom Links */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-center items-center gap-6 text-sm text-gray-400">
          <p>© 2026 KeenKeeper. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}