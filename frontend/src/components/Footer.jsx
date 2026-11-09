import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#111923] text-gray-400 text-xs border-t border-[#1f2d3d] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand Info */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-3">
              <span className="text-xl">🏏</span>
              <span className="font-extrabold text-lg tracking-tight text-white">
                cric<span className="text-emerald-400">buzz</span>
              </span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed mb-3">
              The premier destination for live cricket scores, ball-by-ball commentary, in-depth scorecards, upcoming fixtures, and breaking cricket news worldwide.
            </p>
            <div className="text-[11px] text-gray-500">
              © {new Date().getFullYear()} Cricbuzz Clone. All rights reserved.
            </div>
          </div>

          {/* Col 2: Live & Schedule */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Matches & Scores
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/live-score/live-match-1" className="hover:text-emerald-400 transition">
                  Live Match Center
                </Link>
              </li>
              <li>
                <Link to="/scorecard/live-match-1" className="hover:text-emerald-400 transition">
                  Detailed Scorecards
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="hover:text-emerald-400 transition">
                  Upcoming Match Schedule
                </Link>
              </li>
              <li>
                <Link to="/schedule?series=Border-Gavaskar" className="hover:text-emerald-400 transition">
                  Border-Gavaskar Trophy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Rankings & Teams */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Rankings & Profiles
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/rankings?format=test" className="hover:text-emerald-400 transition">
                  ICC Test Rankings
                </Link>
              </li>
              <li>
                <Link to="/rankings?format=odi" className="hover:text-emerald-400 transition">
                  ICC ODI Rankings
                </Link>
              </li>
              <li>
                <Link to="/rankings?format=t20" className="hover:text-emerald-400 transition">
                  ICC T20I Rankings
                </Link>
              </li>
              <li>
                <Link to="/teams" className="hover:text-emerald-400 transition">
                  International Teams & Squads
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: News & Administration */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">
              News & Editorial
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/news" className="hover:text-emerald-400 transition">
                  Latest Cricket Headlines
                </Link>
              </li>
              <li>
                <Link to="/news?category=Match%20Report" className="hover:text-emerald-400 transition">
                  Match Reports & Analysis
                </Link>
              </li>
              <li>
                <Link to="/news?category=IPL%20/%20League" className="hover:text-emerald-400 transition">
                  IPL & T20 Leagues
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  to="/admin/dashboard"
                  className="inline-flex items-center text-amber-400 hover:text-amber-300 font-semibold"
                >
                  Admin Content Portal →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1f2d3d] pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500">
          <p>Built with MERN Stack (MongoDB, Express, React, Node.js) + Tailwind CSS.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <span>Fast Caching</span>
            <span>•</span>
            <span>REST API</span>
            <span>•</span>
            <span>Auto-Refresh Polling</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
