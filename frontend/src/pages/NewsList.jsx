import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Search, ChevronRight, Clock, User } from 'lucide-react';
import api from '../api/axiosClient';

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Match Report',
    'International',
    'IPL / League',
    'Editorial',
    'Features',
  ];

  const fetchNews = async () => {
    setLoading(true);
    try {
      const url = `/news?category=${category}&search=${encodeURIComponent(searchTerm)}`;
      const res = await api.get(url);
      if (res.data.success) {
        setNews(res.data.news || []);
      }
    } catch (err) {
      console.error('Failed to load news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [category, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title & Category Navigation Bar */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center">
              <Newspaper className="w-6 h-6 text-emerald-600 mr-2" />
              Cricket News & Editorial Columns
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Analysis, tournament previews, match reports, and player features
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <input
              id="news-search-input"
              name="newsSearch"
              aria-label="Search news topics"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search news topics..."
              className="w-full bg-gray-50 border border-gray-200 text-xs rounded-lg pl-8 pr-3 py-2 text-gray-800 placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar border-t border-gray-100 pt-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                category === cat
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading articles...</p>
        </div>
      ) : news.length === 0 ? (
        <div className="bg-white rounded-xl p-16 text-center border border-gray-200 text-gray-500">
          <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="font-semibold text-gray-700">No news articles found under this filter.</p>
          <button
            onClick={() => {
              setCategory('All');
              setSearchTerm('');
            }}
            className="text-xs text-emerald-600 font-bold mt-2 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <Link
              key={item._id}
              to={`/news/${item.slug || item._id}`}
              className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                    {item.category}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-2 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400">
                <span className="truncate max-w-[150px]">By {item.author}</span>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {item.readTime}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsList;
