import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Award, User, Activity, Calendar, MapPin } from 'lucide-react';
import api from '../api/axiosClient';

const PlayerProfile = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [format, setFormat] = useState('test'); // 'test', 'odi', 't20i'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/teams/players/${id}`);
        if (res.data.success) {
          setPlayer(res.data.player);
        }
      } catch (err) {
        console.error('Failed to load player profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">Loading player statistics...</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 font-bold">Player not found.</p>
        <Link to="/teams" className="text-emerald-600 font-semibold underline mt-2 inline-block">
          Return to Teams & Players
        </Link>
      </div>
    );
  }

  const currentStats = player.stats?.[format] || { batting: {}, bowling: {} };
  const batting = currentStats.batting || {};
  const bowling = currentStats.bowling || {};

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <Link
        to={`/teams/${player.teamCode}`}
        className="inline-flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-800"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to {player.teamName} Squad
      </Link>

      {/* Hero Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <img
          src={player.avatarUrl}
          alt={player.name}
          className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-gray-100 shadow-md flex-shrink-0"
        />

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded">
              {player.teamCode}
            </span>
            <span className="text-xs font-bold text-gray-500">
              {player.role}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {player.name}
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs text-gray-600">
            <div>
              <span className="text-[10px] text-gray-400 font-semibold block uppercase">Batting Style</span>
              <strong className="text-gray-900">{player.battingStyle || '-'}</strong>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-semibold block uppercase">Bowling Style</span>
              <strong className="text-gray-900">{player.bowlingStyle || '-'}</strong>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-semibold block uppercase">Born</span>
              <strong className="text-gray-900">{player.dateOfBirth || '-'}</strong>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-semibold block uppercase">Birthplace</span>
              <strong className="text-gray-900">{player.birthPlace || '-'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Bio section */}
      {player.bio && (
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Player Biography
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            {player.bio}
          </p>
        </div>
      )}

      {/* Career Stats Tables */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Format Selector Tabs */}
        <div className="flex items-center space-x-2 p-4 bg-gray-50 border-b border-gray-200">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2">
            Format:
          </span>
          {['test', 'odi', 't20i'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormat(fmt)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                format === fmt
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        {/* Batting Stats Table */}
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-black text-sm text-gray-900 mb-3 flex items-center">
            <Activity className="w-4 h-4 text-emerald-600 mr-1.5" />
            Batting & Fielding Career Stats ({format.toUpperCase()})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-[#17212b] text-gray-200 text-left">
                <tr>
                  <th className="py-2 px-3 font-semibold">Format</th>
                  <th className="py-2 px-3 text-right font-semibold">Mat</th>
                  <th className="py-2 px-3 text-right font-semibold">Inns</th>
                  <th className="py-2 px-3 text-right font-bold text-emerald-300">Runs</th>
                  <th className="py-2 px-3 text-right font-semibold">HS</th>
                  <th className="py-2 px-3 text-right font-semibold">Avg</th>
                  <th className="py-2 px-3 text-right font-semibold">SR</th>
                  <th className="py-2 px-3 text-right font-semibold">100s</th>
                  <th className="py-2 px-3 text-right font-semibold">50s</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-bold uppercase text-gray-800">{format}</td>
                  <td className="py-2.5 px-3 text-right">{batting.matches || 0}</td>
                  <td className="py-2.5 px-3 text-right">{batting.innings || 0}</td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-emerald-800">
                    {batting.runs || 0}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold">{batting.highestScore || '-'}</td>
                  <td className="py-2.5 px-3 text-right font-semibold">{batting.average || 0}</td>
                  <td className="py-2.5 px-3 text-right">{batting.strikeRate || 0}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-600">{batting.hundreds || 0}</td>
                  <td className="py-2.5 px-3 text-right">{batting.fifties || 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bowling Stats Table */}
        <div className="p-5">
          <h3 className="font-black text-sm text-gray-900 mb-3 flex items-center">
            <Award className="w-4 h-4 text-emerald-600 mr-1.5" />
            Bowling Career Stats ({format.toUpperCase()})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-[#17212b] text-gray-200 text-left">
                <tr>
                  <th className="py-2 px-3 font-semibold">Format</th>
                  <th className="py-2 px-3 text-right font-semibold">Mat</th>
                  <th className="py-2 px-3 text-right font-semibold">Inns</th>
                  <th className="py-2 px-3 text-right font-bold text-red-300">Wkts</th>
                  <th className="py-2 px-3 text-right font-semibold">BBI</th>
                  <th className="py-2 px-3 text-right font-semibold">Avg</th>
                  <th className="py-2 px-3 text-right font-semibold">Econ</th>
                  <th className="py-2 px-3 text-right font-semibold">SR</th>
                  <th className="py-2 px-3 text-right font-semibold">5w</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-bold uppercase text-gray-800">{format}</td>
                  <td className="py-2.5 px-3 text-right">{bowling.matches || 0}</td>
                  <td className="py-2.5 px-3 text-right">{bowling.innings || 0}</td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-red-600">
                    {bowling.wickets || 0}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold">{bowling.bestBowling || '-'}</td>
                  <td className="py-2.5 px-3 text-right font-semibold">{bowling.average || 0}</td>
                  <td className="py-2.5 px-3 text-right">{bowling.economy || 0}</td>
                  <td className="py-2.5 px-3 text-right">{bowling.strikeRate || 0}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-600">{bowling.fiveWickets || 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
