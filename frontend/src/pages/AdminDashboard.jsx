import React, { useState, useEffect } from 'react';
import { Newspaper, Plus, Edit, Trash2, X, Check, AlertCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosClient';

const AdminDashboard = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const { user, logout } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'International',
    imageUrl: '',
    tags: '',
    author: 'Cricbuzz Desk',
    readTime: '3 min read',
    isFeatured: false,
  });

  const categories = [
    'International',
    'Match Report',
    'IPL / League',
    'Editorial',
    'Interview',
    'Features',
  ];

  const fetchAdminNews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/news?limit=50');
      if (res.data.success) {
        setNews(res.data.news || []);
      }
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminNews();
  }, []);

  const openCreateModal = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      summary: '',
      content: '',
      category: 'International',
      imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
      tags: 'Cricket, News',
      author: user?.name || 'Cricbuzz Desk',
      readTime: '3 min read',
      isFeatured: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      summary: article.summary,
      content: article.content,
      category: article.category,
      imageUrl: article.imageUrl,
      tags: article.tags?.join(', ') || '',
      author: article.author,
      readTime: article.readTime,
      isFeatured: !!article.isFeatured,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this article?')) return;

    try {
      const res = await api.delete(`/news/${id}`);
      if (res.data.success) {
        setFeedback({ type: 'success', text: 'Article deleted successfully.' });
        setNews(news.filter((n) => n._id !== id));
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to delete article.' });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingArticle) {
        // Update
        const res = await api.put(`/news/${editingArticle._id}`, formData);
        if (res.data.success) {
          setFeedback({ type: 'success', text: 'Article updated successfully!' });
          setModalOpen(false);
          fetchAdminNews();
        }
      } else {
        // Create
        const res = await api.post('/news', formData);
        if (res.data.success) {
          setFeedback({ type: 'success', text: 'Article created & published successfully!' });
          setModalOpen(false);
          fetchAdminNews();
        }
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to save article.' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-2 py-0.5 rounded">
              ADMIN CONTROL
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              News & Editorial Management
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Logged in as <strong className="text-gray-800">{user?.name}</strong> ({user?.email})
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Article</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {feedback.text && (
        <div
          className={`flex items-center justify-between p-3.5 rounded-lg text-xs font-semibold ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            {feedback.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback({ type: '', text: '' })}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* News Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center text-xs font-bold text-gray-700">
          <span>Articles List ({news.length})</span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400 text-xs">
            Loading articles list...
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-xs">
            No articles found. Click "Publish Article" above to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-[#17212b] text-gray-200 text-left">
                <tr>
                  <th className="py-3 px-4 font-semibold">Article</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Author</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {news.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-bold text-gray-900 max-w-sm">
                      <div className="line-clamp-1">{item.title}</div>
                      <div className="text-[11px] text-gray-400 font-normal line-clamp-1">{item.summary}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{item.author}</td>
                    <td className="py-3 px-4 text-gray-400 whitespace-nowrap">
                      {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded mr-1 transition"
                        title="Edit Article"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Article Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-black text-base text-gray-900">
                {editingArticle ? 'Edit Cricket Article' : 'Publish New Cricket Story'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label htmlFor="article-title" className="block font-bold text-gray-700 mb-1">Article Headline / Title *</label>
                <input
                  id="article-title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. India Prepares Tactical Masterclass for Sydney Test"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="article-category" className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    id="article-category"
                    name="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="article-author" className="block font-bold text-gray-700 mb-1">Author Name</label>
                  <input
                    id="article-author"
                    name="author"
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Cricbuzz Desk"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="article-summary" className="block font-bold text-gray-700 mb-1">Summary (1-2 sentences) *</label>
                <textarea
                  id="article-summary"
                  name="summary"
                  required
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Brief synopsis displayed on home card and article lead..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                />
              </div>

              <div>
                <label htmlFor="article-content" className="block font-bold text-gray-700 mb-1">Full Article Content (paragraphs) *</label>
                <textarea
                  id="article-content"
                  name="content"
                  required
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write full article body paragraphs here..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed font-sans"
                />
              </div>

              <div>
                <label htmlFor="article-image" className="block font-bold text-gray-700 mb-1">Image URL</label>
                <input
                  id="article-image"
                  name="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="article-tags" className="block font-bold text-gray-700 mb-1">Tags (comma separated)</label>
                  <input
                    id="article-tags"
                    name="tags"
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="IND vs AUS, Test Cricket, Rohit"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label htmlFor="article-featured" className="flex items-center cursor-pointer font-bold text-gray-800">
                    <input
                      id="article-featured"
                      name="isFeatured"
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 mr-2 accent-emerald-600 rounded"
                    />
                    Feature on Homepage Spotlight
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-md"
                >
                  {editingArticle ? 'Save Changes' : 'Publish Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
