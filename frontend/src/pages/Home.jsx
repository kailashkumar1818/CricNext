import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Flame, AlertCircle, X, Users, Shield, Clock, ChevronRight } from 'lucide-react';
import api from '../api/axiosClient';

const Home = () => {
  const [topNews, setTopNews] = useState([]);
  const [rankings, setRankings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCaution, setShowCaution] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [newsRes, rankRes] = await Promise.allSettled([
          api.get('/news?limit=10'),
          api.get('/rankings?format=test'),
        ]);

        if (newsRes.status === 'fulfilled' && newsRes.value.data?.news) {
          setTopNews(newsRes.value.data.news);
        }
        if (rankRes.status === 'fulfilled' && rankRes.value.data?.rankings) {
          setRankings(rankRes.value.data.rankings);
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#009270] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 font-medium text-xs">Loading live cricket updates...</p>
        </div>
      </div>
    );
  }

  const latestHeadlines = [
    {
      id: 'news-1',
      title: 'IND vs NZ 3rd ODI Preview: Series on the line at Seddon Park in Hamilton decider',
      time: '15m ago'
    },
    {
      id: 'news-2',
      title: 'Rohit Sharma, Kohli gear up for Hamilton clash as India seek series victory',
      time: '45m ago'
    },
    {
      id: 'news-3',
      title: 'Amite Hasan replaces concussed Mominul for second West Indies Test',
      time: '1h ago'
    },
    {
      id: 'news-4',
      title: 'Rickelton, Mulder star in the series that refuses to go quietly',
      time: '2h ago'
    },
    {
      id: 'news-5',
      title: 'Afghanistan U19 crush Sri Lanka U19 by 106 runs in Asia Cup Group clash',
      time: '3h ago'
    },
    {
      id: 'news-6',
      title: 'IPL 2026 Mega Auction: Top All-Rounders Demand Record Bids Across Franchises',
      time: '5h ago'
    }
  ];

  const featuredVideos = [
    {
      id: 'v1',
      title: 'NZ vs IND 4th T20I: Finn Allen 82 off 36 balls Blitzkrieg',
      duration: '8:45',
      thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80',
      views: '240K views'
    },
    {
      id: 'v2',
      title: 'Kagiso Rabada 6/42: Relive the Wanderers 4th Innings Demolition',
      duration: '5:12',
      thumbnail: 'https://images.unsplash.com/photo-1531415074868-83633dd5e457?auto=format&fit=crop&w=600&q=80',
      views: '512K views'
    },
    {
      id: 'v3',
      title: 'Hasaranga Googly Bamboozles Babar: Key Turning Point in Karachi',
      duration: '3:30',
      thumbnail: 'https://images.unsplash.com/photo-1512719355420-e05eaff802d9?auto=format&fit=crop&w=600&q=80',
      views: '185K views'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 space-y-3">
      {/* 1. Real Cricbuzz Auction Tracker Bar */}
      <div className="bg-white rounded-sm border border-gray-200 px-4 py-2 flex items-center space-x-4 text-xs font-semibold">
        <span className="font-extrabold text-gray-900 text-sm tracking-tight">
          Auction Tracker - WPL 2027
        </span>
        <div className="flex items-center space-x-3 text-blue-600 font-medium">
          <span className="hover:underline cursor-pointer">Live</span>
          <span className="text-gray-300">•</span>
          <span className="hover:underline cursor-pointer">Upcoming</span>
          <span className="text-gray-300">•</span>
          <span className="hover:underline cursor-pointer">Completed</span>
          <span className="text-gray-300">•</span>
          <span className="hover:underline cursor-pointer">Teams</span>
        </div>
      </div>

      {/* 2. Real Cricbuzz Quick Access Bar */}
      <div className="bg-white rounded-sm border border-gray-200 px-4 py-2 flex items-center space-x-3 text-xs font-semibold">
        <span className="font-bold text-gray-900 text-sm">Quick Access</span>
        <button className="flex items-center space-x-1.5 hover:text-[#009270] transition bg-gray-50 hover:bg-gray-100 px-2.5 py-1 rounded border border-gray-200 text-gray-700">
          <Users className="w-3.5 h-3.5 text-blue-600" />
          <span>India - Men</span>
        </button>
        <button className="flex items-center space-x-1.5 hover:text-[#009270] transition bg-gray-50 hover:bg-gray-100 px-2.5 py-1 rounded border border-gray-200 text-gray-700">
          <Users className="w-3.5 h-3.5 text-pink-600" />
          <span>India - Women</span>
        </button>
        <button className="flex items-center space-x-1.5 hover:text-[#009270] transition bg-gray-50 hover:bg-gray-100 px-2.5 py-1 rounded border border-gray-200 text-gray-700">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Go ad-free</span>
        </button>
      </div>

      {/* 3. Real Cricbuzz Caution Notice Banner */}
      {showCaution && (
        <div className="bg-[#fff9eb] border border-[#ffe082] rounded-sm p-3 text-xs text-[#5d4037] relative flex items-start justify-between shadow-2xs">
          <div className="flex items-start space-x-2 pr-6">
            <AlertCircle className="w-4 h-4 text-[#f57c00] shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold uppercase tracking-wide text-[#e65100] mr-1">CAUTION</span>
              <span>
                Cricbuzz is not associated with any betting or gambling platforms, including "Cricbuzz Bet" or any similar services. For a safe and authentic experience, use only our official website and mobile apps on the Google Play Store and Apple App Store.
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowCaution(false)}
            className="text-gray-400 hover:text-gray-700 p-0.5 rounded transition"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4. Real Cricbuzz 3-Column Content Layout (Matching Real Cricbuzz Exactly) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">
        {/* Left Column: LATEST NEWS (25%) */}
        <div className="md:col-span-3 bg-white p-4 rounded-sm border border-gray-200 shadow-2xs space-y-3">
          <h2 className="text-xs font-black text-[#009270] uppercase tracking-wider border-b border-gray-100 pb-2">
            LATEST NEWS
          </h2>

          <div className="divide-y divide-gray-100 space-y-2.5">
            {latestHeadlines.map((item) => (
              <div key={item.id} className="pt-2.5 first:pt-0">
                <Link
                  to="/news"
                  className="text-xs font-bold text-gray-900 hover:text-[#009270] transition leading-snug line-clamp-2 block"
                >
                  {item.title}
                </Link>
                <span className="text-[10px] text-gray-400 block mt-1">{item.time}</span>
              </div>
            ))}
          </div>

          <Link
            to="/news"
            className="text-xs font-bold text-[#009270] hover:underline flex items-center pt-2"
          >
            More News <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>

        {/* Center Column: Featured Series Hero (50%) */}
        <div className="md:col-span-6 bg-white p-4 rounded-sm border border-gray-200 shadow-2xs space-y-3">
          <span className="text-[11px] font-extrabold text-[#009270] uppercase tracking-wider block">
            INDIA TOUR OF NEW ZEALAND, 2026
          </span>

          <Link to="/live-score/4cb54768-b317-42c6-bb7d-409dd2a6c862" className="group block space-y-3">
            <div className="relative aspect-[16/9] w-full rounded overflow-hidden bg-gray-900">
              <img
                src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80"
                alt="India vs New Zealand 3rd ODI"
                className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
              />
              <span className="absolute bottom-2 left-2 bg-[#cb202d] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                MATCH PREVIEW • TOMORROW 7:30 AM IST
              </span>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 group-hover:text-[#009270] transition leading-tight">
                India eye series glory at Seddon Park as New Zealand seek Hamilton redemption
              </h1>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                With the 3-match ODI series finely poised at 1-1, India and New Zealand meet tomorrow morning at Seddon Park, Hamilton in the series decider. Virat Kohli and Shubman Gill lead the charge against Tim Southee and Trent Boult on a true batting surface.
              </p>
            </div>
          </Link>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
            <span>By Cricbuzz Match Desk</span>
            <span>Starts Tomorrow 07:30 AM IST</span>
          </div>

          {/* Secondary Lead Story below */}
          <div className="pt-3 border-t border-gray-200">
            <span className="text-[10px] font-bold uppercase text-blue-800 tracking-wider bg-blue-50 px-2 py-0.5 rounded">
              DECIDER PREVIEW
            </span>
            <Link to="/live-score/4cb54768-b317-42c6-bb7d-409dd2a6c862" className="block mt-1.5 text-sm font-bold text-gray-900 hover:text-[#009270]">
              IND vs NZ 3rd ODI: Hamilton Pitch Report, Weather & Predicted XIs
            </Link>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              Everything you need to know ahead of the high-stakes final ODI clash at Seddon Park.
            </p>
          </div>
        </div>

        {/* Right Column: FEATURED VIDEOS (25%) */}
        <div className="md:col-span-3 space-y-4">
          <div className="bg-white p-4 rounded-sm border border-gray-200 shadow-2xs space-y-3">
            <h2 className="text-xs font-black text-[#009270] uppercase tracking-wider border-b border-gray-100 pb-2">
              FEATURED VIDEOS
            </h2>

            <div className="space-y-3">
              {featuredVideos.map((video) => (
                <div key={video.id} className="group cursor-pointer">
                  <div className="relative aspect-[16/9] w-full rounded overflow-hidden bg-gray-900 mb-1.5">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition">
                      <div className="w-8 h-8 rounded-full bg-[#009270]/90 text-white flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 fill-white translate-x-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {video.duration}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#009270] transition leading-snug line-clamp-2">
                    {video.title}
                  </h3>
                  <span className="text-[10px] text-gray-400 block mt-0.5">{video.views}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mini Test Rankings widget */}
          {rankings?.teams && (
            <div className="bg-white p-3.5 rounded-sm border border-gray-200 shadow-2xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                <span className="text-xs font-black text-gray-900 uppercase">ICC Test Rankings</span>
                <Link to="/rankings" className="text-[11px] text-[#009270] font-bold hover:underline">
                  All →
                </Link>
              </div>
              <div className="space-y-1.5 text-xs">
                {rankings.teams.slice(0, 4).map((t) => (
                  <div key={t.code} className="flex justify-between py-0.5 border-b border-gray-50">
                    <span className="font-semibold text-gray-700">{t.rank}. {t.name}</span>
                    <span className="font-bold text-[#009270]">{t.rating}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
