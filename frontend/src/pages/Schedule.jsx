import React, { useState, useEffect } from 'react';
import { Calendar, Filter, MapPin, Clock, Search } from 'lucide-react';
import api from '../api/axiosClient';

const Schedule = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamFilter, setTeamFilter] = useState('all');
  const [seriesFilter, setSeriesFilter] = useState('');

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/matches/schedule?team=${teamFilter}&series=${encodeURIComponent(seriesFilter)}`);
      if (res.data.success) {
        setMatches(res.data.matches || []);
      }
    } catch (err) {
      console.error('Failed to load schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [teamFilter, seriesFilter]);

  const teamOptions = [
    { label: 'All Teams', value: 'all' },
    { label: 'India', value: 'IND' },
    { label: 'Australia', value: 'AUS' },
    { label: 'England', value: 'ENG' },
    { label: 'South Africa', value: 'SA' },
    { label: 'New Zealand', value: 'NZ' },
    { label: 'Pakistan', value: 'PAK' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Title & Filters */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center">
              <Calendar className="w-5 h-5 text-emerald-600 mr-2" />
              International Cricket Schedule & Upcoming Fixtures
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Filter by national team or upcoming bilateral series
            </p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {/* Team Filter */}
          <div>
            <label htmlFor="team-filter" className="block text-xs font-bold text-gray-600 mb-1">
              Select Team
            </label>
            <select
              id="team-filter"
              name="teamFilter"
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-xs rounded-lg px-3 py-2 text-gray-800 font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              {teamOptions.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Series Filter */}
          <div>
            <label htmlFor="series-filter" className="block text-xs font-bold text-gray-600 mb-1">
              Filter By Series
            </label>
            <div className="relative">
              <input
                id="series-filter"
                name="seriesFilter"
                type="text"
                value={seriesFilter}
                onChange={(e) => setSeriesFilter(e.target.value)}
                placeholder="e.g. England, T20 World Cup..."
                className="w-full bg-gray-50 border border-gray-200 text-xs rounded-lg pl-8 pr-3 py-2 text-gray-800 placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Match Cards List */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading upcoming fixtures...</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200 text-gray-500">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="font-semibold text-gray-700">No scheduled fixtures match your criteria.</p>
          <button
            onClick={() => {
              setTeamFilter('all');
              setSeriesFilter('');
            }}
            className="text-xs text-emerald-600 font-bold mt-2 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition"
            >
              <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 pb-3 border-b border-gray-100 gap-2">
                <span className="font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                  {m.format} • {m.matchDesc}
                </span>
                <span className="font-medium text-gray-600">{m.series}</span>
              </div>

              <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Team 1 */}
                <div className="flex items-center space-x-3 w-full sm:w-5/12">
                  <span className="text-3xl">{m.team1.flag}</span>
                  <div>
                    <h3 className="font-bold text-base text-gray-900">{m.team1.name}</h3>
                    <span className="text-xs text-gray-400 font-semibold">{m.team1.code}</span>
                  </div>
                </div>

                <div className="text-center font-black text-gray-400 text-xs px-2 py-1 bg-gray-100 rounded-full">
                  VS
                </div>

                {/* Team 2 */}
                <div className="flex items-center justify-end space-x-3 w-full sm:w-5/12 text-right">
                  <div>
                    <h3 className="font-bold text-base text-gray-900">{m.team2.name}</h3>
                    <span className="text-xs text-gray-400 font-semibold">{m.team2.code}</span>
                  </div>
                  <span className="text-3xl">{m.team2.flag}</span>
                </div>
              </div>

              {/* Match Venue and Time Footer */}
              <div className="flex flex-wrap items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500 gap-2">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{m.venue}</span>
                </div>
                <div className="flex items-center space-x-1.5 font-semibold text-gray-800">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{m.timeString}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Schedule;
