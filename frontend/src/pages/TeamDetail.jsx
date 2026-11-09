import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy, User, Shield, ChevronRight } from 'lucide-react';
import api from '../api/axiosClient';

const TeamDetail = () => {
  const { idOrCode } = useParams();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/teams/${idOrCode}`);
        if (res.data.success) {
          setTeam(res.data.team);
          setPlayers(res.data.players || []);
        }
      } catch (err) {
        console.error('Failed to load team detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [idOrCode]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">Loading team roster...</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 font-bold">Team not found.</p>
        <Link to="/teams" className="text-emerald-600 font-semibold underline mt-2 inline-block">
          Return to Teams
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Back button */}
      <Link
        to="/teams"
        className="inline-flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-800"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> All Teams
      </Link>

      {/* Hero Banner */}
      <div
        className="rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${team.primaryColor || '#0055A5'} 0%, #0e1621 100%)`,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-2xl sm:text-3xl border border-white/30 shadow-inner">
              {team.code}
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{team.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/80 mt-2">
                <span>Captain: <strong className="text-white">{team.captain || 'TBA'}</strong></span>
                <span>•</span>
                <span>Coach: <strong className="text-white">{team.coach || 'TBA'}</strong></span>
              </div>
            </div>
          </div>

          {/* Ranking Badges */}
          <div className="flex space-x-3 bg-black/30 backdrop-blur-md p-3 rounded-xl border border-white/10 text-center">
            <div className="px-3">
              <span className="text-[10px] uppercase font-bold text-white/70 block">Test</span>
              <span className="text-base font-black text-emerald-400">#{team.ranking?.test || '-'}</span>
            </div>
            <div className="px-3 border-x border-white/10">
              <span className="text-[10px] uppercase font-bold text-white/70 block">ODI</span>
              <span className="text-base font-black text-amber-400">#{team.ranking?.odi || '-'}</span>
            </div>
            <div className="px-3">
              <span className="text-[10px] uppercase font-bold text-white/70 block">T20I</span>
              <span className="text-base font-black text-emerald-400">#{team.ranking?.t20 || '-'}</span>
            </div>
          </div>
        </div>

        {/* Overview */}
        {team.overview && (
          <p className="text-xs sm:text-sm text-white/90 mt-6 max-w-3xl leading-relaxed">
            {team.overview}
          </p>
        )}
      </div>

      {/* Trophies Cabinet */}
      {team.trophies?.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 flex items-center mb-3">
            <Trophy className="w-4 h-4 text-amber-500 mr-2" />
            Trophy Cabinet ({team.trophies.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {team.trophies.map((tr, idx) => (
              <div key={idx} className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/60 text-xs">
                <span className="font-extrabold text-amber-900 block">{tr.year}</span>
                <span className="text-gray-700 font-medium truncate block">{tr.tournament}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Squad Players Roster */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center">
          <User className="w-5 h-5 text-emerald-600 mr-2" />
          Squad Members ({players.length})
        </h2>

        {players.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400 border border-gray-200">
            No player profiles linked to this team yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((p) => (
              <Link
                key={p._id}
                to={`/players/${p._id}`}
                className="group bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition flex items-center justify-between"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={p.avatarUrl}
                    alt={p.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                  />
                  <div className="truncate">
                    <h3 className="font-bold text-sm text-gray-900 group-hover:text-emerald-700 transition truncate">
                      {p.name}
                    </h3>
                    <p className="text-xs text-emerald-700 font-semibold">{p.role}</p>
                    <p className="text-[11px] text-gray-400 truncate">{p.battingStyle}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-600 transition flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamDetail;
