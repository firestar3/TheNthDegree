
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { ThemeProvider } from './hooks/useTheme';
import { supabase } from './services/supabase';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import ContestPage from './pages/ContestPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import PracticeZonePage from './pages/PracticeZonePage';
import LoginPage from './pages/LoginPage';
import Spinner from './components/ui/Spinner';

// Fix: Removed React.FC type as it's largely deprecated and can cause type inference issues.
const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <Spinner />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <HashRouter>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <Header session={session} />
          <main className="p-4 sm:p-6 md:p-8">
            <Routes>
              <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/" />} />
              <Route path="/" element={session ? <DashboardPage /> : <Navigate to="/login" />} />
              <Route path="/contest/:id" element={session ? <ContestPage /> : <Navigate to="/login" />} />
              <Route path="/leaderboard/:id" element={session ? <LeaderboardPage /> : <Navigate to="/login" />} />
              <Route path="/profile" element={session ? <ProfilePage /> : <Navigate to="/login" />} />
              <Route path="/practice" element={session ? <PracticeZonePage /> : <Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;
