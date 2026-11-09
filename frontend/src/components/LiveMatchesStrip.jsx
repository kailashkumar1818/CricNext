import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import api from '../api/axiosClient';

const LiveMatchesStrip = () => {
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const fetchMatches = async () => {
    try {
      const [liveRes, recentRes, scheduleRes] = await Promise.allSettled([
        api.get('/matches/live'),
        api.get('/matches/recent'),
        api.get('/matches/schedule')
      ]);

      const live = liveRes.status === 'fulfilled' ? (liveRes.value.data.matches || []) : [];
      const recent = recentRes.status === 'fulfilled' ? (recentRes.value.data.matches || []) : [];
      const schedule = scheduleRes.status === 'fulfilled' ? (scheduleRes.value.data.matches || []) : [];

      // Deduplicate by ID
      const seen = new Set();
      const combined = [];
      for (const m of [...live, ...schedule, ...recent]) {
        if (m && m.id && !seen.has(m.id)) {
          seen.add(m.id);
          combined.push(m);
        }
      }

      setMatches(combined);
      if (combined.length > 0 && !activeTab) {
        setActiveTab(combined[0].id);
      }
    } catch (err) {
      console.error('Failed to load match strip:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 15000);
    return () => clearInterval(interval);
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getFormatBadge = (format) => {
    const f = (format || 'T20').toUpperCase();
    if (f.includes('TEST')) {
      return <span className="bg-[#cb202d] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Test</span>;
    }
    if (f.includes('ODI')) {
      return <span className="bg-[#0284c7] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">ODI</span>;
    }
    return <span className="bg-[#222d38] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">T20I</span>;
  };

  // Build mini-tabs
  const miniTabs = matches.slice(0, 7).map((m) => {
    if (m.miniTabLabel) {
      return {
        id: m.id,
        label: m.miniTabLabel,
        isLive: m.status === 'Live',
        isUpcoming: m.status === 'Upcoming'
      };
    }

    let note = m.statusNote || m.status || '';
    if (note.toLowerCase().includes('tomorrow')) note = 'Preview';
    else if (note.toLowerCase().includes('starts')) note = 'Preview';
    else if (note.toLowerCase().includes('won')) note = 'Won';
    else if (note.toLowerCase().includes('stumps')) note = 'Stumps';
    else if (note.length > 14) note = note.slice(0, 12) + '..';

    return {
      id: m.id,
      label: `${m.team1?.code || 'T1'} vs ${m.team2?.code || 'T2'} - ${note}`,
      isLive: m.status === 'Live',
      isUpcoming: m.status === 'Upcoming'
    };
  });

  return (
    <div className="select-none">
      {/* 1. Real Cricbuzz Charcoal Sub-Navbar */}
      <div className="bg-[#222d38] text-gray-200 border-b border-[#1b242e] text-[11px] sm:text-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto no-scrollbar py-1.5">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-nowrap shrink-0">
            <span className="font-black text-white bg-black/40 px-2 py-1 rounded tracking-wider uppercase text-[10px]">
              MATCHES
            </span>

            {miniTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.isLive || tab.isUpcoming) {
                    navigate(`/live-score/${tab.id}`);
                  } else {
                    navigate(`/scorecard/${tab.id}`);
                  }
                }}
                className={`whitespace-nowrap px-2.5 py-1 rounded transition text-[11px] font-medium ${
                  activeTab === tab.id
                    ? 'bg-[#314050] text-white font-bold'
                    : 'text-gray-300 hover:text-white hover:bg-[#2b3947]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-1 text-gray-300 hover:text-white cursor-pointer shrink-0 ml-4 font-bold text-[11px]">
            <span>ALL</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* 2. Light Gray Real-Cricbuzz Style Match Cards Carousel */}
      <div className="bg-[#e9ecef] border-b border-gray-300 py-2.5 relative">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 relative">
          {/* Scroll Left Button */}
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="absolute -left-1 sm:left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white hover:bg-gray-100 text-gray-800 rounded-full flex items-center justify-center shadow-lg border border-gray-300 hidden sm:flex transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Cards Container */}
          <div
            ref={scrollRef}
            className="flex space-x-3 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1"
          >
            {matches.map((match, idx) => {
              const isLive = match.status === 'Live';
              const isUpcoming = match.status === 'Upcoming';
              const targetRoute = isLive || isUpcoming ? `/live-score/${match.id}` : `/scorecard/${match.id}`;

              return (
                <React.Fragment key={match.id || idx}>
                  <div className="flex-shrink-0 w-[275px] sm:w-[290px] bg-white rounded-md border border-gray-300 shadow-xs flex flex-col justify-between overflow-hidden hover:border-gray-400 transition">
                    <div
                      className="p-3 cursor-pointer"
                      onClick={() => navigate(targetRoute)}
                    >
                      <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1.5 pb-1 border-b border-gray-100">
                        <span className="truncate max-w-[190px] font-medium text-gray-700" title={match.matchDesc || match.series}>
                          {match.matchDesc || match.series}
                        </span>
                        {getFormatBadge(match.format)}
                      </div>

                      {/* Team 1 */}
                      <div className="flex items-center justify-between py-1 text-xs sm:text-sm">
                        <div className="flex items-center space-x-2 font-bold text-gray-900 truncate pr-2">
                          {match.team1?.img ? (
                            <img src={match.team1.img} alt="" className="w-4 h-4 object-contain rounded-full" />
                          ) : (
                            <span className="text-base">{match.team1?.flag || '🏏'}</span>
                          )}
                          <span className="truncate">{match.team1?.code || match.team1?.name}</span>
                        </div>
                        <span className="font-extrabold text-gray-900 shrink-0">
                          {match.score?.display1 || match.team1?.score || '-'}
                        </span>
                      </div>

                      {/* Team 2 */}
                      <div className="flex items-center justify-between py-1 text-xs sm:text-sm">
                        <div className="flex items-center space-x-2 font-bold text-gray-900 truncate pr-2">
                          {match.team2?.img ? (
                            <img src={match.team2.img} alt="" className="w-4 h-4 object-contain rounded-full" />
                          ) : (
                            <span className="text-base">{match.team2?.flag || '🏏'}</span>
                          )}
                          <span className="truncate">{match.team2?.code || match.team2?.name}</span>
                        </div>
                        <span className="font-extrabold text-gray-900 shrink-0">
                          {match.score?.display2 || match.team2?.score || '-'}
                        </span>
                      </div>

                      {/* Status Note */}
                      <div
                        className={`mt-1.5 text-xs font-semibold line-clamp-1 ${
                          isLive
                            ? 'text-[#cb202d]'
                            : isUpcoming
                            ? 'text-[#e65100]'
                            : 'text-[#0284c7]'
                        }`}
                        title={match.statusNote}
                      >
                        {match.statusNote}
                      </div>
                    </div>

                    {/* Card Gray Footer */}
                    <div className="bg-[#f5f6f8] px-3 py-1.5 border-t border-gray-200 flex items-center justify-end space-x-3 text-[10px] font-bold text-gray-600">
                      {isLive ? (
                        <>
                          <Link to={`/live-score/${match.id}`} className="text-[#cb202d] hover:underline flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#cb202d] animate-pulse"></span>
                            <span>LIVE SCORE</span>
                          </Link>
                          <Link to="/schedule" className="hover:text-gray-900">SCHEDULE</Link>
                        </>
                      ) : isUpcoming ? (
                        <>
                          <Link to={`/live-score/${match.id}`} className="text-[#e65100] hover:underline">
                            PREVIEW
                          </Link>
                          <Link to="/schedule" className="hover:text-gray-900">SCHEDULE</Link>
                        </>
                      ) : (
                        <>
                          <Link to={`/scorecard/${match.id}`} className="text-[#009270] hover:underline">
                            SCORECARD
                          </Link>
                          <Link to="/schedule" className="hover:text-gray-900">SCHEDULE</Link>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Insert Cricbuzz Sponsored Promo Card right after 1st match */}
                  {idx === 0 && (
                    <div className="flex-shrink-0 w-[260px] sm:w-[280px] bg-white rounded-md border border-gray-300 shadow-xs p-3 flex flex-col justify-between overflow-hidden">
                      <div className="aspect-[16/9] w-full rounded overflow-hidden bg-gray-900 mb-2">
                        <img
                          src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=400&q=80"
                          alt="Sponsored Promotion"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-xs font-bold text-gray-900 line-clamp-1">
                        1 in 4 trade the Nifty. Open your...
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[11px] text-gray-500 font-semibold">
                        <span>iFOREX</span>
                        <span className="text-blue-600 border border-blue-500 px-2 py-0.5 rounded text-[10px] font-bold">
                          Sign Up
                        </span>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Scroll Right Button (Cricbuzz Green Icon) */}
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="absolute -right-1 sm:right-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-[#009270] hover:bg-[#007a5e] text-white rounded-full flex items-center justify-center shadow-lg transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveMatchesStrip;
