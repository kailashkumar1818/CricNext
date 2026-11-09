import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Shield, LogOut, Radio, Calendar, Newspaper, Trophy, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SearchModal from './SearchModal';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Live Scores', path: '/live-score/sl-vs-pak', icon: Radio, highlight: true },
    { name: 'Schedule', path: '/schedule', icon: Calendar },
    { name: 'Archives', path: '/schedule', icon: Calendar },
    { name: 'News', path: '/news', icon: Newspaper },
    { name: 'Series', path: '/schedule', icon: Trophy },
    { name: 'Teams', path: '/teams', icon: Users },
    { name: 'Rankings', path: '/rankings', icon: Trophy },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#009270] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left: Brand Logo & Main Nav */}
            <div className="flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-emerald-800 font-black text-lg shadow-inner group-hover:scale-105 transition transform">
                  🏏
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-xl tracking-tight leading-none text-white drop-shadow-sm">
                    cric<span className="text-emerald-200">buzz</span>
                  </span>
                  <span className="text-[9px] font-semibold tracking-wider text-emerald-100 uppercase opacity-90">
                    Cricket Network
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className={({ isActive }) =>
                        `flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs lg:text-sm font-semibold transition ${
                          isActive
                            ? 'bg-emerald-800 text-white shadow-inner'
                            : 'text-emerald-50 hover:bg-emerald-700/60 hover:text-white'
                        } ${link.highlight ? 'relative font-bold' : ''}`
                      }
                    >
                      <Icon className={`w-3.5 h-3.5 ${link.highlight ? 'text-red-300 animate-pulse' : ''}`} />
                      <span>{link.name}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Right: Search, Admin & Mobile Toggle */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Global Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center space-x-2 bg-emerald-800/80 hover:bg-emerald-900 text-emerald-100 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-medium transition border border-emerald-600/40"
                title="Search (Ctrl + K)"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Search...</span>
                <kbd className="hidden lg:inline-block text-[10px] bg-emerald-950/60 px-1.5 py-0.5 rounded text-emerald-300 border border-emerald-700">
                  Ctrl+K
                </kbd>
              </button>

              {/* Go Premium Button (Exact Cricbuzz Style) */}
              <button
                className="hidden sm:inline-flex items-center px-3 py-1 bg-white text-gray-800 hover:bg-gray-100 font-bold text-xs rounded-full shadow-xs transition"
              >
                Go Premium
              </button>

              {/* Admin Panel Link or Profile */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 text-gray-950 px-2.5 py-1 rounded text-xs font-bold transition shadow-sm"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    title="Log Out"
                    className="p-1.5 bg-emerald-800 hover:bg-emerald-900 text-emerald-100 hover:text-white rounded-md transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/admin/login"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-800/80 hover:bg-emerald-900 text-white transition text-sm"
                  title="Admin Account"
                >
                  👤
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 rounded-md hover:bg-emerald-800 text-white transition"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-emerald-800 border-t border-emerald-700 px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive ? 'bg-emerald-900 text-white font-bold' : 'text-emerald-100 hover:bg-emerald-700/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-emerald-300" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
            <div className="pt-2 border-t border-emerald-700/60">
              <Link
                to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-semibold text-amber-300 hover:bg-emerald-700/60"
              >
                <Shield className="w-4 h-4" />
                <span>{isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
