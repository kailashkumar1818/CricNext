import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Users, User, Newspaper, ChevronRight, Loader2 } from 'lucide-react';
import api from '../api/axiosClient';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ teams: [], players: [], news: [] });
  const [counts, setCounts] = useState({ total: 0 });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ teams: [], players: [], news: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ teams: [], players: [], news: [] });
      setCounts({ total: 0 });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query.trim())}`);
        if (res.data.success) {
          setResults(res.data.results);
          setCounts(res.data.counts);
        }
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (url) => {
    onClose();
    navigate(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-gray-100 bg-gray-50/50">
          <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            id="global-search-input"
            name="search"
            aria-label="Search teams, players, and cricket news"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams, players, news stories... (e.g. India, Kohli, IPL)"
            className="w-full bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-base"
          />
          {loading && <Loader2 className="w-4 h-4 text-emerald-600 animate-spin mr-2" />}
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 text-xs font-semibold px-2 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 space-y-6">
          {!query.trim() && (
            <div className="text-center py-10 text-gray-400">
              <Search className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm font-medium">Type a team, player name, or cricket topic</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['India', 'Australia', 'Virat Kohli', 'Jasprit Bumrah', 'T20 World Cup'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-xs px-3 py-1 bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-full transition"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim() && !loading && counts.total === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-base font-semibold">No results found for "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Try checking for spelling or search a different keyword</p>
            </div>
          )}

          {/* Teams Section */}
          {results.teams?.length > 0 && (
            <div>
              <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <Users className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                Teams ({results.teams.length})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {results.teams.map((t) => (
                  <div
                    key={t._id}
                    onClick={() => handleSelect(`/teams/${t.code}`)}
                    className="flex items-center p-2.5 rounded-lg border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 cursor-pointer transition group"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center mr-3 shadow-sm">
                      {t.code}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-800 group-hover:text-emerald-700 truncate">
                        {t.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {t.captain ? `Capt: ${t.captain}` : 'International Side'}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-600 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Players Section */}
          {results.players?.length > 0 && (
            <div>
              <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <User className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                Players ({results.players.length})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {results.players.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => handleSelect(`/players/${p._id}`)}
                    className="flex items-center p-2.5 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition group"
                  >
                    <img
                      src={p.avatarUrl}
                      alt={p.name}
                      className="w-9 h-9 rounded-full object-cover mr-3 border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-800 group-hover:text-blue-700 truncate">
                        {p.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {p.teamCode} • {p.role}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* News Section */}
          {results.news?.length > 0 && (
            <div>
              <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <Newspaper className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                News Articles ({results.news.length})
              </div>
              <div className="space-y-2">
                {results.news.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleSelect(`/news/${item.slug || item._id}`)}
                    className="flex items-center p-2.5 rounded-lg border border-gray-100 hover:border-amber-200 hover:bg-amber-50/40 cursor-pointer transition group"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-14 h-11 rounded object-cover mr-3 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mr-2">
                        {item.category}
                      </span>
                      <div className="text-xs font-semibold text-gray-800 group-hover:text-amber-800 line-clamp-1 mt-0.5">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-gray-400 line-clamp-1">
                        {item.summary}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-amber-600 transition flex-shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-gray-50 px-4 py-2 text-right border-t border-gray-100">
          <span className="text-[11px] text-gray-400">Press ESC or click outside to dismiss</span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
