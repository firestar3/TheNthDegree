
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import ThemeToggle from './ui/ThemeToggle';

interface HeaderProps {
  session: Session | null;
}

// Fix: Removed React.FC as it's largely deprecated.
const Header = ({ session }: HeaderProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              The Nth Degree
            </Link>
            {session && (
              <div className="hidden md:flex md:ml-10 md:space-x-8">
                <Link to="/" className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                <Link to="/practice" className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">Practice Zone</Link>
                <Link to="/profile" className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {session ? (
              <div className="flex items-center space-x-4">
                 <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-300">
                    {session.user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;