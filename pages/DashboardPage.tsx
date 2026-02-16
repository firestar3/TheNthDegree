import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Contest } from '../types';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import LeaderboardPreview from '../components/LeaderboardPreview';

// Fix: Removed React.FC as it's largely deprecated.
const DashboardPage = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContests = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('contests')
          .select('*')
          .order('start_time', { ascending: false });

        if (error) {
          throw error;
        }
        setContests(data || []);
      } catch (error: any) {
        setError('Failed to fetch contests. Make sure you have created the tables in Supabase.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const getContestStatus = (contest: Contest): { text: string; color: string; active: boolean } => {
    const now = new Date();
    const startTime = new Date(contest.start_time);
    const endTime = new Date(startTime.getTime() + contest.duration_minutes * 60000);

    if (now > endTime) return { text: 'Finished', color: 'text-red-500', active: false };
    if (now >= startTime && now <= endTime) return { text: 'Live', color: 'text-green-500 animate-pulse', active: true };
    return { text: 'Upcoming', color: 'text-yellow-500', active: false };
  };

  const timeUntil = (startTime: string) => {
    const diff = new Date(startTime).getTime() - new Date().getTime();
    if (diff <= 0) return 'Started';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (loading) {
    return <div className="flex justify-center mt-10"><Spinner /></div>;
  }
  
  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Contests</h1>
      {contests.length === 0 ? (
        <Card><p>No contests available at the moment. Please check back later.</p></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => {
            const status = getContestStatus(contest);
            const isFinished = status.text === 'Finished';

            return (
              <Card key={contest.id} className="flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-primary-600 dark:text-primary-400">{contest.name}</h2>
                    <span className={`font-semibold ${status.color}`}>{status.text}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2 mb-4">{contest.description}</p>
                  <div className="text-sm text-gray-500 dark:text-gray-300 space-y-1">
                    <p><strong>Starts:</strong> {new Date(contest.start_time).toLocaleString()}</p>
                    <p><strong>Duration:</strong> {contest.duration_minutes} minutes</p>
                    {status.text === 'Upcoming' && <p><strong>Time until start:</strong> {timeUntil(contest.start_time)}</p>}
                  </div>
                  {isFinished && <LeaderboardPreview contestId={contest.id} />}
                </div>
                <div className="mt-6 flex justify-end">
                    {status.active && (
                      <Link to={`/contest/${contest.id}`} className="px-4 py-2 rounded font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors">
                        Enter Contest
                      </Link>
                    )}
                    {isFinished && (
                      <Link to={`/leaderboard/${contest.id}`} className="px-4 py-2 rounded font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors">
                        View Full Leaderboard
                      </Link>
                    )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;