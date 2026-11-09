import React, { useState, useEffect } from 'react';
import { Trophy, Award, Users, ChevronRight } from 'lucide-react';
import api from '../api/axiosClient';

const Rankings = () => {
  const [allRankings, setAllRankings] = useState(null);
  const [format, setFormat] = useState('test'); // 'test', 'odi', 't20'
  const [category, setCategory] = useState('teams'); // 'teams', 'batting', 'bowling'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const res = await api.get('/rankings');
        if (res.data.success) {
          setAllRankings(res.data.rankings);
        }
      } catch (err) {
        console.error('Failed to load rankings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">Fetching official ICC ranking tables...</p>
      </div>
    );
  }

  const formatData = allRankings?.[format] || {};
  const currentList = formatData[category] || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Title & Format Switcher */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center">
            <Trophy className="w-6 h-6 text-amber-500 mr-2" />
            Official ICC Cricket World Rankings
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Current standings for international teams, batters, and bowlers across formats
          </p>
        </div>

        {/* Format Selector */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'test', label: 'Test Championship' },
            { id: 'odi', label: 'One Day Internationals' },
            { id: 't20', label: 'T20 Internationals' },
          ].map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => setFormat(fmt.id)}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition ${
                format === fmt.id
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>

        {/* Category Selector */}
        <div className="flex space-x-2 pt-1">
          {[
            { id: 'teams', label: 'Team Standings' },
            { id: 'batting', label: 'Batting Rankings' },
            { id: 'bowling', label: 'Bowling Rankings' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                category === cat.id
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rankings Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-xs sm:text-sm">
          <thead className="bg-[#17212b] text-gray-200 text-left">
            <tr>
              <th className="py-3 px-4 sm:px-6 font-semibold w-16 text-center">Rank</th>
              <th className="py-3 px-4 font-semibold">
                {category === 'teams' ? 'Team' : 'Player'}
              </th>
              {category !== 'teams' && (
                <th className="py-3 px-4 font-semibold">Country</th>
              )}
              {category === 'teams' && (
                <th className="py-3 px-4 text-right font-normal text-gray-400">Points</th>
              )}
              <th className="py-3 px-4 sm:px-6 text-right font-bold text-emerald-300">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentList.map((item, idx) => (
              <tr
                key={idx}
                className={`hover:bg-gray-50/80 transition ${
                  item.rank === 1 ? 'bg-amber-50/40 font-bold' : ''
                }`}
              >
                <td className="py-3 px-4 sm:px-6 text-center font-black">
                  {item.rank === 1 ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-black text-xs shadow-sm">
                      1
                    </span>
                  ) : (
                    <span className="text-gray-500 font-bold">{item.rank}</span>
                  )}
                </td>
                <td className="py-3 px-4 font-bold text-gray-900">
                  {item.name}
                </td>
                {category !== 'teams' && (
                  <td className="py-3 px-4 text-gray-600 font-semibold">
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                      {item.team}
                    </span>
                  </td>
                )}
                {category === 'teams' && (
                  <td className="py-3 px-4 text-right text-gray-500">{item.points || '-'}</td>
                )}
                <td className="py-3 px-4 sm:px-6 text-right font-black text-emerald-800">
                  {item.rating}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rankings;
