import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@cricbuzz.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Login failed. Invalid credentials.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-gray-200 shadow-xl space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin Editorial Portal</h1>
          <p className="text-xs text-gray-500 mt-1">
            Sign in to publish, update, and manage cricket news articles
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-xs font-bold text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cricbuzz.com"
                className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg pl-9 pr-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-bold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg pl-9 pr-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-sm transition shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : 'Sign In as Admin'}
          </button>
        </form>

        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600">
          <p className="font-bold text-gray-800 mb-1">Default Seeded Admin:</p>
          <p>Email: <code className="bg-gray-200 px-1 py-0.5 rounded text-emerald-800">admin@cricbuzz.com</code></p>
          <p>Password: <code className="bg-gray-200 px-1 py-0.5 rounded text-emerald-800">admin123</code></p>
        </div>

        <div className="text-center">
          <Link to="/" className="text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return to Cricbuzz Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
