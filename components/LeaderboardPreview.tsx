import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { LeaderboardEntry } from '../types';
import Spinner from './ui/Spinner';
import GoldMedalIcon from './icons/GoldMedalIcon';
import SilverMedalIcon from './icons/SilverMedalIcon';
import BronzeMedalIcon from './icons/BronzeMedalIcon';

interface LeaderboardPreviewProps {
  contestId: number;
  autoRefresh?: boolean;
}

const LeaderboardPreview = ({ contestId, autoRefresh = false }: LeaderboardPreviewProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    // Only show spinner on initial load, not on auto-refresh
    if (leaderboard.length === 0) setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('get_leaderboard', { p_contest_id: contestId })
        .limit(10);

      if (error) {
        throw new Error("Could not fetch leaderboard. Make sure you've created the 'get_leaderboard' function in your Supabase SQL editor.");
      }
      setLeaderboard(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [contestId, leaderboard.length]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
        setCurrentUserId(user?.id ?? null);
    });
    
    fetchLeaderboard();

    if (autoRefresh) {
      const interval = setInterval(fetchLeaderboard, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [fetchLeaderboard, autoRefresh]);

  if (loading && leaderboard.length === 0) return <div className="flex justify-center py-4"><Spinner /></div>;
  if (error) return <p className="text-xs text-red-500">{error}</p>;
  if (leaderboard.length === 0) return <p className="text-sm text-gray-500 dark:text-gray-400">No ranked submissions yet.</p>;

  return (
    <div className="mt-4">
      <h4 className="font-bold mb-2 text-gray-800 dark:text-gray-200">Top 10 Rankings</h4>
      <ol className="space-y-2 text-sm">
        {leaderboard.map((entry) => {
          const isCurrentUser = entry.user_id === currentUserId;
          let rowClass = 'p-2 rounded-md transition-colors';

          if (entry.rank === 1) {
              rowClass += ' bg-yellow-100 dark:bg-yellow-900/50';
          } else if (entry.rank === 2) {
              rowClass += ' bg-slate-200 dark:bg-slate-700/50';
          } else if (entry.rank === 3) {
              rowClass += ' bg-orange-200 dark:bg-orange-900/50';
          } else if (isCurrentUser) {
              rowClass += ' bg-primary-100 dark:bg-primary-900/50';
          } else {
              rowClass += ' bg-gray-50 dark:bg-gray-700';
          }

          if (isCurrentUser) {
              rowClass += ' ring-2 ring-primary-500 ring-inset';
          }

          return (
            <li key={entry.user_id} className={`flex justify-between items-center ${rowClass}`}>
              <div className="flex items-center">
                <div className="flex justify-center items-center w-8">
                    {entry.rank === 1 && <GoldMedalIcon className="h-6 w-6" />}
                    {entry.rank === 2 && <SilverMedalIcon className="h-6 w-6" />}
                    {entry.rank === 3 && <BronzeMedalIcon className="h-6 w-6" />}
                    {entry.rank > 3 && <span className="font-bold w-6 text-center">{entry.rank}.</span>}
                </div>
                <span className={`ml-2 truncate ${isCurrentUser ? 'font-bold' : ''}`}>{entry.username}</span>
              </div>
              <span className="font-semibold text-primary-600 dark:text-primary-400">{entry.score} pts</span>
            </li>
          );
        })}
      </ol>
      <Link to={`/leaderboard/${contestId}`} className="text-primary-600 hover:underline text-sm mt-4 block text-center">
        View Full Leaderboard
      </Link>
    </div>
  );
};

export default LeaderboardPreview;
