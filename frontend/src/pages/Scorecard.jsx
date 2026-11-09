import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Radio, ArrowLeft, Trophy } from 'lucide-react';
import api from '../api/axiosClient';

const Scorecard = () => {
  const { id = 'rsa-vs-aus' } = useParams();
  const [scorecard, setScorecard] = useState(null);
  const [activeInningsIndex, setActiveInningsIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScorecard = async () => {
      try {
        const res = await api.get(`/matches/${id}/scorecard`);
        if (res.data.success) {
          setScorecard(res.data.scorecard);
          // Default to latest innings if multiple exist
          if (res.data.scorecard.innings?.length > 0) {
            const lastActiveIdx = res.data.scorecard.innings.findIndex(inn => inn.total === 'Yet to bat');
            setActiveInningsIndex(lastActiveIdx > 0 ? lastActiveIdx - 1 : res.data.scorecard.innings.length - 1);
          }
        }
      } catch (err) {
        console.error('Failed to load scorecard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchScorecard();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">Loading official match scorecard...</p>
      </div>
    );
  }

  if (!scorecard || !scorecard.innings) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 font-bold">Scorecard not available yet.</p>
        <Link to="/" className="text-emerald-600 font-semibold underline mt-2 inline-block">
          Return to Home
        </Link>
      </div>
    );
  }

  const currentInnings = scorecard.innings[activeInningsIndex];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700">
            <Link to="/" className="hover:underline flex items-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Matches
            </Link>
            <span>•</span>
            <span>{scorecard.series}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-gray-900 mt-1">
            {scorecard.matchTitle}
          </h1>
        </div>

        <Link
          to={`/live-score/${id}`}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
        >
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Live Commentary</span>
        </Link>
      </div>

      {/* Innings Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {scorecard.innings.map((inn, idx) => (
          <button
            key={idx}
            onClick={() => setActiveInningsIndex(idx)}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeInningsIndex === idx
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {inn.team?.flag} {inn.team?.name} ({inn.total})
          </button>
        ))}
      </div>

      {/* Innings Details Card */}
      {currentInnings && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Innings Header Summary */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Innings #{currentInnings.inningsNumber}
              </span>
              <h2 className="text-lg font-black text-gray-900">
                {currentInnings.team?.name} Innings
              </h2>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-800">{currentInnings.total}</span>
              <span className="text-xs text-gray-500 block">
                {currentInnings.overs} Overs • Run Rate: {currentInnings.runRate}
              </span>
            </div>
          </div>

          {/* Batting Scorecard Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-[#17212b] text-gray-200 text-left">
                <tr>
                  <th className="py-2.5 px-4 sm:px-6 font-semibold">Batter</th>
                  <th className="py-2.5 px-4 font-normal text-gray-400">Dismissal</th>
                  <th className="py-2.5 px-3 text-right font-bold">R</th>
                  <th className="py-2.5 px-3 text-right font-normal text-gray-400">B</th>
                  <th className="py-2.5 px-3 text-right font-normal text-gray-400">4s</th>
                  <th className="py-2.5 px-3 text-right font-normal text-gray-400">6s</th>
                  <th className="py-2.5 px-4 sm:px-6 text-right font-semibold">SR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentInnings.batting?.map((b, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/80 transition">
                    <td className="py-2.5 px-4 sm:px-6 font-bold text-gray-900 whitespace-nowrap">
                      {b.batsman}
                    </td>
                    <td className="py-2.5 px-4 text-xs text-gray-500 whitespace-nowrap">
                      {b.dismissal}
                    </td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-gray-900">{b.runs}</td>
                    <td className="py-2.5 px-3 text-right text-gray-500">{b.balls}</td>
                    <td className="py-2.5 px-3 text-right text-gray-500">{b.fours}</td>
                    <td className="py-2.5 px-3 text-right text-gray-500">{b.sixes}</td>
                    <td className="py-2.5 px-4 sm:px-6 text-right font-medium text-gray-700">{b.sr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Extras & Total Summary */}
          <div className="px-6 py-3 bg-gray-50 border-t border-b border-gray-200 flex justify-between text-xs font-semibold text-gray-700">
            <span>Extras: <strong className="text-gray-900 font-bold">{currentInnings.extras || '10'}</strong></span>
            <span>Total: <strong className="text-emerald-700 font-black">{currentInnings.total} ({currentInnings.overs} Ov)</strong></span>
          </div>

          {/* Bowling Scorecard Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-[#17212b] text-gray-200 text-left">
                <tr>
                  <th className="py-2.5 px-4 sm:px-6 font-semibold">Bowler</th>
                  <th className="py-2.5 px-3 text-right font-semibold">O</th>
                  <th className="py-2.5 px-3 text-right font-normal text-gray-400">M</th>
                  <th className="py-2.5 px-3 text-right font-normal text-gray-400">R</th>
                  <th className="py-2.5 px-3 text-right font-bold text-red-300">W</th>
                  <th className="py-2.5 px-4 sm:px-6 text-right font-semibold">ECO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentInnings.bowling?.map((bw, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/80 transition">
                    <td className="py-2.5 px-4 sm:px-6 font-semibold text-gray-900 whitespace-nowrap">
                      {bw.bowler}
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-gray-800">{bw.overs}</td>
                    <td className="py-2.5 px-3 text-right text-gray-500">{bw.maidens}</td>
                    <td className="py-2.5 px-3 text-right text-gray-600">{bw.runs}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-red-600">{bw.wickets}</td>
                    <td className="py-2.5 px-4 sm:px-6 text-right font-medium text-gray-700">{bw.economy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scorecard;
