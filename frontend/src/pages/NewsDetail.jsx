import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Calendar, User, ArrowLeft, Tag, Share2 } from 'lucide-react';
import api from '../api/axiosClient';

const NewsDetail = () => {
  const { slugOrId } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/news/${slugOrId}`);
        if (res.data.success) {
          setArticle(res.data.article);
          setRelatedNews(res.data.relatedNews || []);
        }
      } catch (err) {
        console.error('Failed to load article detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slugOrId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">Opening cricket report...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 font-bold">Article not found.</p>
        <Link to="/news" className="text-emerald-600 font-semibold underline mt-2 inline-block">
          Return to News Listing
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Article Body (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <Link
            to="/news"
            className="inline-flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to News
          </Link>

          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded">
              {article.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-3 leading-tight">
              {article.title}
            </h1>
          </div>

          {/* Meta Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-gray-100 text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-gray-700">By {article.author}</span>
              <span>•</span>
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                {article.readTime}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-xl overflow-hidden aspect-[16/9] bg-gray-100 shadow-sm">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Summary Lead Box */}
          <div className="bg-emerald-50/70 border-l-4 border-emerald-600 p-4 rounded-r-lg text-sm sm:text-base font-semibold text-gray-800 leading-relaxed italic">
            "{article.summary}"
          </div>

          {/* Article Full Content */}
          <div className="prose max-w-none text-gray-800 text-sm sm:text-base leading-relaxed space-y-4">
            {article.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          {article.tags?.length > 0 && (
            <div className="pt-6 border-t border-gray-100">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                <Tag className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Related Tags
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 bg-gray-100 text-gray-700 font-medium rounded-full"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Related Articles */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <h3 className="font-black text-sm text-gray-900 pb-3 mb-4 border-b border-gray-100">
              Related in {article.category}
            </h3>
            {relatedNews.length === 0 ? (
              <p className="text-xs text-gray-400">No other articles in this category.</p>
            ) : (
              <div className="space-y-4">
                {relatedNews.map((rel) => (
                  <Link
                    key={rel._id}
                    to={`/news/${rel.slug || rel._id}`}
                    className="group block space-y-1.5 pb-3 border-b border-gray-50 last:border-0 last:pb-0"
                  >
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition leading-snug line-clamp-2">
                      {rel.title}
                    </h4>
                    <span className="text-[11px] text-gray-400 block">{rel.readTime}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
