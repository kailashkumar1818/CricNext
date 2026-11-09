import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Trophy, Award, ChevronRight } from 'lucide-react';
import api from '../api/axiosClient';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await api.get('/teams');
        if (res.data.success) {
          setTeams(res.data.teams || []);
        }
      } catch (err) {
        console.error('Failed to load teams:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">Loading cricket nations & squads...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center">
          <Users className="w-6 h-6 text-emerald-600 mr-2" />
          Cricket Teams & International Squads
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Explore team rosters, trophy cabinets, and player career records
        </p>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((t) => (
          <Link
            key={t._id}
            to={`/teams/${t.code}`}
            className="group bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:border-emerald-300 hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm shadow"
                    style={{ backgroundColor: t.primaryColor || '#0055A5' }}
                  >
                    {t.code}
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-gray-900 group-hover:text-emerald-700 transition">
                      {t.name}
                    </h2>
                    <span className="text-xs text-gray-400">Capt: {t.captain || 'TBA'}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-600 transition" />
              </div>

              {/* ICC Rankings Bar */}
              <div className="grid grid-cols-3 gap-2 my-4 text-center">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Test</span>
                  <span className="text-sm font-black text-gray-800">#{t.ranking?.test || '-'}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">ODI</span>
                  <span className="text-sm font-black text-gray-800">#{t.ranking?.odi || '-'}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">T20I</span>
                  <span className="text-sm font-black text-gray-800">#{t.ranking?.t20 || '-'}</span>
                </div>
              </div>

              {/* Overview */}
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {t.overview}
              </p>
            </div>

            {/* Trophies Footer */}
            {t.trophies?.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs text-gray-600">
                <Trophy className="w-3.5 h-3.5 text-amber-500 mr-1.5 flex-shrink-0" />
                <span className="truncate">
                  {t.trophies.length} Major ICC Titles ({t.trophies[0].tournament})
                </span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Teams;
