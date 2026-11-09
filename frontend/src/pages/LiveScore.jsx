import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Radio, RefreshCw, Clock, ArrowRight, Shield, Zap, AlertCircle } from 'lucide-react';
import api from '../api/axiosClient';

const LiveScore = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(id && id !== 'sl-vs-pak' ? id : '');
  const [match, setMatch] = useState(null);
  const [liveMatchesList, setLiveMatchesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  // Sync activeId with URL param (redirect away from fake sl-vs-pak)
  useEffect(() => {
    if (id && id !== 'sl-vs-pak') {
      setActiveId(id);
    }
  }, [id]);

  // Fetch list of all real live matches
  useEffect(() => {
    const fetchLiveList = async () => {
      try {
        const [liveRes, recentRes] = await Promise.allSettled([
          api.get('/matches/live'),
          api.get('/matches/recent')
        ]);

        const live = liveRes.status === 'fulfilled' ? (liveRes.value.data.matches || []) : [];
        const recent = recentRes.status === 'fulfilled' ? (recentRes.value.data.matches || []) : [];
        const combined = [...live, ...recent];

        if (combined.length > 0) {
          setLiveMatchesList(live.length > 0 ? live : combined.slice(0, 5));
          if (!id || id === 'sl-vs-pak') {
            const firstRealId = combined[0].id;
            setActiveId(firstRealId);
            navigate(`/live-score/${firstRealId}`, { replace: true });
          }
        }
      } catch (err) {
        console.error('Error fetching live matches list:', err);
      }
    };
    fetchLiveList();
  }, [id, navigate]);

  const fetchLiveDetails = async (showSpinner = false) => {
    if (!activeId) return;
    if (showSpinner) setIsRefreshing(true);
    setError(null);
    try {
      const res = await api.get(`/matches/${activeId}/live`);
      if (res.data.success && res.data.match) {
        setMatch(res.data.match);
      } else {
        const fallbackMatch = liveMatchesList.find((m) => m.id === activeId) || liveMatchesList[0];
        if (fallbackMatch) {
          setMatch(fallbackMatch);
        } else {
          setError('Live match details not available');
        }
      }
    } catch (err) {
      console.error('Error fetching live score:', err);
      const fallbackMatch = liveMatchesList.find((m) => m.id === activeId) || liveMatchesList[0];
      if (fallbackMatch) {
        setMatch(fallbackMatch);
      } else {
        setError('Unable to fetch live score. Please check connection and retry.');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      setCountdown(10);
    }
  };

  useEffect(() => {
    fetchLiveDetails(false);
  }, [activeId]);

  // 10-second auto refresh interval & countdown
  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchLiveDetails(false);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeId, autoRefreshEnabled]);

  const handleSelectMatch = (matchId) => {
    setActiveId(matchId);
    navigate(`/live-score/${matchId}`);
  };

  if (loading && !match) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">Connecting to live match broadcast...</p>
      </div>
    );
  }

  if (error && !match) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <p className="text-gray-800 font-bold mb-2">{error}</p>
        <div className="flex justify-center space-x-3 mt-4">
          <button
            onClick={() => fetchLiveDetails(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
          >
            Retry Connection
          </button>
          <Link
            to="/"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* 0. Live Match Selector Bar (when multiple live matches exist) */}
      {liveMatchesList.length > 0 && (
        <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-2 flex-shrink-0">
            Live Matches:
          </span>
          {liveMatchesList.map((m) => {
            const isSelected = m.id === (match?.id || activeId);
            return (
              <button
                key={m.id}
                onClick={() => handleSelectMatch(m.id)}
                className={`flex-shrink-0 flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                  isSelected
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>
                  {m.team1?.code || m.team1?.name} vs {m.team2?.code || m.team2?.name}
                </span>
                <span className={`text-[11px] ${isSelected ? 'text-emerald-200' : 'text-gray-400'}`}>
                  • {m.format}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 1. Header Bar: Series, Venue & Auto-Refresh Controls */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span
              className={`flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                match.status === 'Upcoming' ? 'bg-[#e65100]' : 'bg-red-600'
              } text-white`}
            >
              {match.status === 'Upcoming' ? (
                'PREVIEW'
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-white mr-1 live-pulse" />
                  LIVE
                </>
              )}
            </span>
            <h1 className="text-sm font-bold text-gray-800">{match.series}</h1>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {match.matchDesc} • {match.venue}
          </p>
        </div>

        {/* Refresh controls */}
        <div className="flex items-center space-x-3">
          {match.status === 'Live' && (
            <>
              <label htmlFor="auto-refresh-toggle" className="flex items-center cursor-pointer text-xs font-semibold text-gray-600">
                <input
                  id="auto-refresh-toggle"
                  name="autoRefresh"
                  type="checkbox"
                  aria-label="Toggle auto-refresh every 10 seconds"
                  checked={autoRefreshEnabled}
                  onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
                  className="mr-1.5 accent-emerald-600 w-3.5 h-3.5 rounded"
                />
                Auto-refresh (10s)
              </label>

              {autoRefreshEnabled && (
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold border border-emerald-200">
                  {countdown}s
                </span>
              )}
            </>
          )}

          <button
            onClick={() => fetchLiveDetails(true)}
            disabled={isRefreshing}
            className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-semibold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. Main Live Scoreboard Hero */}
      <div className="bg-[#111923] text-white rounded-2xl p-6 border border-[#232e3c] shadow-lg">
        {/* Navigation Sub-Tabs */}
        <div className="flex items-center space-x-4 border-b border-[#232e3c] pb-3 mb-5 text-xs font-bold">
          <span className="text-emerald-400 border-b-2 border-emerald-400 pb-3 -mb-3">
            {match.status === 'Upcoming' ? 'Match Preview' : 'Live Commentary'}
          </span>
          <Link to={`/scorecard/${match.id}`} className="text-gray-400 hover:text-white transition">
            Full Scorecard
          </Link>
          <span className="text-gray-500">•</span>
          <Link to="/schedule" className="text-gray-400 hover:text-white transition">
            Schedule
          </Link>
        </div>

        {/* Scores Overview / Match Preview */}
        {match.status === 'Upcoming' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">{match.team1?.flag}</span>
                  <div>
                    <h2 className="text-xl font-black text-white">{match.team1?.name}</h2>
                    <span className="text-xs text-gray-400 font-semibold">{match.team1?.code}</span>
                  </div>
                  <span className="text-gray-500 font-bold px-2">VS</span>
                  <span className="text-4xl">{match.team2?.flag}</span>
                  <div>
                    <h2 className="text-xl font-black text-white">{match.team2?.name}</h2>
                    <span className="text-xs text-gray-400 font-semibold">{match.team2?.code}</span>
                  </div>
                </div>

                <div className="mt-4 text-xs text-amber-300 font-bold bg-[#182332] p-3 rounded-xl border border-[#26374a]">
                  ⏰ {match.statusNote}
                </div>
              </div>

              <div className="bg-[#182332] p-4 rounded-xl border border-[#26374a] space-y-2 text-xs">
                <div className="text-white font-bold text-sm flex items-center justify-between pb-1 border-b border-[#26374a]">
                  <span>Fixture Info</span>
                  <span className="text-amber-400 font-semibold">{match.format} Decider</span>
                </div>
                <p className="text-gray-300">
                  📍 <strong>Venue:</strong> {match.venue}
                </p>
                <p className="text-gray-300">
                  🗓️ <strong>Timing:</strong> {match.timeString || 'Tomorrow at 7:30 AM IST'}
                </p>
                <p className="text-emerald-300">
                  ⚔️ <strong>Series Status:</strong> {match.preview?.seriesStatus || 'Series level 1-1'}
                </p>
              </div>
            </div>

            {/* Pitch & Weather Preview Box */}
            {match.preview && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#232e3c] text-xs">
                <div className="bg-[#182332] p-3.5 rounded-xl border border-[#26374a]">
                  <h3 className="font-bold text-emerald-400 mb-1">Pitch & Conditions</h3>
                  <p className="text-gray-300 leading-relaxed">{match.preview.pitchReport}</p>
                  <p className="text-gray-400 mt-2 font-medium">⛅ {match.preview.weather}</p>
                </div>

                <div className="bg-[#182332] p-3.5 rounded-xl border border-[#26374a]">
                  <h3 className="font-bold text-blue-400 mb-1">Key Players to Watch</h3>
                  <p className="text-gray-300 leading-relaxed">
                    <strong>India:</strong> Virat Kohli, Rohit Sharma, Jasprit Bumrah
                  </p>
                  <p className="text-gray-300 mt-1 leading-relaxed">
                    <strong>New Zealand:</strong> Tom Latham, Daryl Mitchell, Kyle Jamieson
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Batting Team Primary */}
            <div>
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{match.team1?.flag}</span>
                <div>
                  <h2 className="text-xl font-black text-white">{match.team1?.name}</h2>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                      {match.score?.display1 || `${match.score?.team1?.runs ?? 0}/${match.score?.team1?.wickets ?? 0}`}
                    </span>
                    {!match.score?.display1 && (
                      <span className="text-sm text-gray-400">
                        ({match.score?.team1?.overs} ov)
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {match.team2 && (
                <div className="flex items-center space-x-2 text-sm text-gray-300 mt-2.5 pt-2 border-t border-[#232e3c]">
                  <span className="text-lg">{match.team2.flag}</span>
                  <span className="font-bold text-white">{match.team2.name}:</span>
                  <span className="font-extrabold text-amber-300">
                    {match.score?.display2 || `${match.score?.team2?.runs ?? 0}/${match.score?.team2?.wickets ?? 0}`}
                  </span>
                </div>
              )}
            </div>

            {/* Equation & Rates */}
            <div className="bg-[#182332] p-4 rounded-xl border border-[#26374a] space-y-2 text-xs">
              <div className="text-amber-300 font-bold text-sm">
                {match.statusNote}
              </div>
              <div className="flex justify-between text-gray-300 pt-1 border-t border-[#2a3c50]">
                <span>Current Run Rate (CRR): <strong className="text-white">{match.crr}</strong></span>
                {match.rrr && (
                  <span>Required Run Rate (RRR): <strong className="text-emerald-400">{match.rrr}</strong></span>
                )}
              </div>
              {match.recentBalls && (
                <div className="flex items-center space-x-1.5 pt-1">
                  <span className="text-gray-400 text-[11px] mr-1">Recent:</span>
                  {match.recentBalls.map((b, idx) => (
                    <span
                      key={idx}
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                        b === '4'
                          ? 'bg-blue-600 text-white'
                          : b === '6'
                          ? 'bg-purple-600 text-white'
                          : b === 'W'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Live Batting & Bowling Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-5 border-t border-[#232e3c]">
          {/* Batsmen On Crease */}
          <div className="bg-[#17212b] rounded-xl p-3 border border-[#232e3c]">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Batters On Crease
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 text-left border-b border-[#26374a] pb-1">
                  <th className="pb-1 font-semibold">Batter</th>
                  <th className="pb-1 text-right font-semibold">R</th>
                  <th className="pb-1 text-right font-semibold">B</th>
                  <th className="pb-1 text-right font-semibold">4s</th>
                  <th className="pb-1 text-right font-semibold">6s</th>
                  <th className="pb-1 text-right font-semibold">SR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26374a]/60">
                {match.batsmen?.map((b, idx) => (
                  <tr key={idx} className={idx === 0 ? 'text-emerald-300 font-bold' : 'text-gray-200'}>
                    <td className="py-1.5">
                      {b.name} {idx === 0 && <span className="text-amber-400 font-black">*</span>}
                    </td>
                    <td className="py-1.5 text-right font-bold">{b.runs}</td>
                    <td className="py-1.5 text-right text-gray-400">{b.balls}</td>
                    <td className="py-1.5 text-right text-gray-400">{b.fours}</td>
                    <td className="py-1.5 text-right text-gray-400">{b.sixes}</td>
                    <td className="py-1.5 text-right text-gray-300">{b.strikeRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Current Bowler */}
          {match.bowler && (
            <div className="bg-[#17212b] rounded-xl p-3 border border-[#232e3c]">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Current Bowler
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-400 text-left border-b border-[#26374a] pb-1">
                    <th className="pb-1 font-semibold">Bowler</th>
                    <th className="pb-1 text-right font-semibold">O</th>
                    <th className="pb-1 text-right font-semibold">M</th>
                    <th className="pb-1 text-right font-semibold">R</th>
                    <th className="pb-1 text-right font-semibold">W</th>
                    <th className="pb-1 text-right font-semibold">ECO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-gray-200 font-semibold">
                    <td className="py-1.5">{match.bowler.name}</td>
                    <td className="py-1.5 text-right">{match.bowler.overs}</td>
                    <td className="py-1.5 text-right text-gray-400">{match.bowler.maidens}</td>
                    <td className="py-1.5 text-right">{match.bowler.runs}</td>
                    <td className="py-1.5 text-right font-bold text-red-400">{match.bowler.wickets}</td>
                    <td className="py-1.5 text-right text-gray-300">{match.bowler.economy}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 4. Live Ball-by-Ball Commentary Stream */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
          <h3 className="font-black text-base text-gray-900 flex items-center">
            <Zap className="w-4 h-4 text-emerald-600 mr-2" />
            Ball by Ball Commentary
          </h3>
          <span className="text-xs text-gray-400">Updates live every 10s</span>
        </div>

        <div className="space-y-4">
          {match.commentary?.map((c, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 p-3 rounded-lg border transition ${
                c.isBoundary
                  ? 'bg-emerald-50/60 border-emerald-200'
                  : c.isWicket
                  ? 'bg-red-50 border-red-200'
                  : 'bg-gray-50/50 border-gray-100'
              }`}
            >
              {/* Over Indicator badge */}
              <div className="flex-shrink-0 w-12 text-center">
                <span className="font-extrabold text-xs text-gray-800">{c.over}</span>
                {c.isBoundary && (
                  <span className="block text-[9px] font-black text-emerald-700 bg-emerald-100 rounded px-1 mt-0.5">
                    {c.runs === 6 ? 'SIX' : 'FOUR'}
                  </span>
                )}
                {c.isWicket && (
                  <span className="block text-[9px] font-black text-red-700 bg-red-100 rounded px-1 mt-0.5">
                    WKT
                  </span>
                )}
              </div>

              {/* Text content */}
              <div className="flex-1 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <span className="font-bold text-gray-900 mr-1.5">{c.bowler}:</span>
                {c.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveScore;
