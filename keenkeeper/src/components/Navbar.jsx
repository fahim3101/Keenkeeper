import { NavLink } from 'react-router-dom';
import { Home, Clock, PieChart } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white border-b sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <img src="/assets/logo.png" alt="KeenKeeper" className="h-7" />
      </div>
      <div className="flex items-center gap-1 md:gap-4">
        <NavLink to="/" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${isActive ? 'bg-[#214f3b] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
          <Home size={18} /> <span className="hidden sm:inline">Home</span>
        </NavLink>
        <NavLink to="/timeline" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${isActive ? 'bg-[#214f3b] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
          <Clock size={18} /> <span className="hidden sm:inline">Timeline</span>
        </NavLink>
        <NavLink to="/stats" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${isActive ? 'bg-[#214f3b] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
          <PieChart size={18} /> <span className="hidden sm:inline">Stats</span>
        </NavLink>
      </div>
    </nav>
  );
}