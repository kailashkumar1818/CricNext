import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import LiveMatchesStrip from './components/LiveMatchesStrip';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import LiveScore from './pages/LiveScore';
import Scorecard from './pages/Scorecard';
import Schedule from './pages/Schedule';
import NewsList from './pages/NewsList';
import NewsDetail from './pages/NewsDetail';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import PlayerProfile from './pages/PlayerProfile';
import Rankings from './pages/Rankings';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-emerald-500 selection:text-white">
          {/* Cricbuzz Signature Green Header */}
          <Navbar />

          {/* Top Live Matches Horizontal Strip */}
          <LiveMatchesStrip />

          {/* Main Routing Outlet */}
          <main className="flex-grow">
            <Routes>
              {/* Feature 1: Home Page */}
              <Route path="/" element={<Home />} />

              {/* Feature 2: Live Score Page (Auto-refresh 10s) */}
              <Route path="/live-score" element={<LiveScore />} />
              <Route path="/live" element={<LiveScore />} />
              <Route path="/live-score/:id" element={<LiveScore />} />

              {/* Feature 3: Full Scorecard Page */}
              <Route path="/scorecard" element={<Scorecard />} />
              <Route path="/scorecard/:id" element={<Scorecard />} />

              {/* Feature 4: Schedule Page with filters */}
              <Route path="/schedule" element={<Schedule />} />

              {/* Feature 5: News Section */}
              <Route path="/news" element={<NewsList />} />
              <Route path="/news/:slugOrId" element={<NewsDetail />} />

              {/* Feature 6: Teams and Players Profiles */}
              <Route path="/teams" element={<Teams />} />
              <Route path="/teams/:idOrCode" element={<TeamDetail />} />
              <Route path="/players/:id" element={<PlayerProfile />} />

              {/* Feature 7: ICC Rankings */}
              <Route path="/rankings" element={<Rankings />} />

              {/* Feature 9: Admin Authentication & Panel */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
