import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { LeaderboardEntry, Contest } from '../types';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import GoldMedalIcon from '../components/icons/GoldMedalIcon';
import SilverMedalIcon from '../components/icons/SilverMedalIcon';
import BronzeMedalIcon from '../components/icons/BronzeMedalIcon';

const LeaderboardPage = () => {
  const { id } = useParams<{ id: string }>();
  const [contest, setContest] = useState<Contest | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchFullLeaderboard = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const contestId = parseInt(id, 10);

      const { data: contestData, error: contestError } = await supabase
        .from('contests')
        .select('name')
        .eq('id', contestId)
        .single();
      if (contestError) throw contestError;
      setContest(contestData);

      const { data, error: rpcError } = await supabase
        .rpc('get_leaderboard', { p_contest_id: contestId });

      if (rpcError) {
        throw new Error("Could not fetch leaderboard. Make sure you've created the 'get_leaderboard' function in your Supabase SQL editor.");
      }
      setLeaderboard(data || []);

    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchFullLeaderboard();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id ?? null);
    });
  }, [fetchFullLeaderboard]);


  if (loading) return <div className="flex justify-center mt-10"><Spinner /></div>;
  
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <Link to="/" className="text-primary-600 hover:underline">&larr; Back to Contests</Link>
        <h1 className="text-3xl font-bold mt-2">
          Full Leaderboard for {contest ? `"${contest.name}"` : `Contest ${id}`}
        </h1>
      </div>
      
      <Card>
      {error ? (
        <div className="text-center text-red-500 p-4 bg-red-100 dark:bg-red-900 rounded-lg">{error}</div>
      ) : leaderboard.length === 0 ? (
        <p>No ranked submissions have been recorded for this contest yet.</p>
      ) : (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rank</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Score</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Correct Submission</th>
                </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {leaderboard.map((entry) => {
                  const isCurrentUser = entry.user_id === currentUserId;
                  let rowClass = 'transition-colors';

                  if (entry.rank === 1) {
                      rowClass += ' bg-yellow-100 dark:bg-yellow-900/50';
                  } else if (entry.rank === 2) {
                      rowClass += ' bg-slate-200 dark:bg-slate-700/50';
                  } else if (entry.rank === 3) {
                      rowClass += ' bg-orange-200 dark:bg-orange-900/50';
                  } else if (isCurrentUser) {
                      rowClass += ' bg-primary-100 dark:bg-primary-900/50';
                  }

                  if (isCurrentUser) {
                      rowClass += ' ring-2 ring-primary-500 ring-inset';
                  }

                  return (
                    <tr key={entry.user_id} className={rowClass}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex justify-start items-center h-full">
                              {entry.rank === 1 && <GoldMedalIcon className="h-8 w-8" />}
                              {entry.rank === 2 && <SilverMedalIcon className="h-8 w-8" />}
                              {entry.rank === 3 && <BronzeMedalIcon className="h-8 w-8" />}
                              {entry.rank > 3 && <span className="font-bold text-lg w-8 text-center">{entry.rank}</span>}
                          </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">{entry.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-600 dark:text-primary-400">{entry.score}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {entry.last_submission_time ? new Date(entry.last_submission_time).toLocaleString() : 'N/A'}
                      </td>
                    </tr>
                  )
                })}
                </tbody>
            </table>
        </div>
      )}
      </Card>
    </div>
  );
};

export default LeaderboardPage;
