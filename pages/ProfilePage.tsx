import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Profile, Submission } from '../types';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';

// Fix: Removed React.FC as it's largely deprecated.
const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not found");

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profileError) throw profileError;
        setProfile(profileData);

        const { data: submissionsData, error: submissionsError } = await supabase
          .from('submissions')
          .select('*, problems(*, contests(*))')
          .eq('user_id', user.id)
          .order('submitted_at', { ascending: false });
        if (submissionsError) throw submissionsError;
        setSubmissions(submissionsData || []);

      } catch (err: any) {
        setError('Failed to load profile data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) return <div className="flex justify-center mt-10"><Spinner /></div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      {profile && (
        <Card className="mb-6">
          <h2 className="text-xl font-bold">{profile.username}</h2>
          <p className="text-gray-500 dark:text-gray-400">Member since: {new Date(profile.created_at).toLocaleDateString()}</p>
        </Card>
      )}
      
      <h2 className="text-2xl font-bold mb-4">Submission History</h2>
      <Card>
        {submissions.length === 0 ? (
          <p>You have not made any submissions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contest</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Problem</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Result</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {submissions.map((sub) => (
                        <tr key={sub.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{sub.problems?.contests?.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{sub.problems?.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sub.is_correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {sub.is_correct ? 'Correct' : 'Incorrect'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {new Date(sub.submitted_at).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProfilePage;