import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Contest, Problem, Submission } from '../types';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import Timer from '../components/Timer';
import LeaderboardPreview from '../components/LeaderboardPreview';

// Fix: Removed React.FC as it's largely deprecated.
const ContestPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contest, setContest] = useState<Contest | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [submissions, setSubmissions] = useState<Map<number, Submission>>(new Map());
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<{ [key: number]: string }>({});

  const fetchContestData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch contest details
      const { data: contestData, error: contestError } = await supabase
        .from('contests')
        .select('*')
        .eq('id', id)
        .single();
      if (contestError) throw contestError;
      setContest(contestData);

      // Fetch problems for the contest
      const { data: problemsData, error: problemsError } = await supabase
        .from('problems')
        .select('*')
        .eq('contest_id', id)
        .order('id');
      if (problemsError) throw problemsError;
      setProblems(problemsData);
      setActiveProblem(problemsData?.[0] || null);
      
      // Fetch user's submissions for these problems
      const { data: { user } } = await supabase.auth.getUser();
      if(user) {
        const problemIds = problemsData.map(p => p.id);
        if (problemIds.length > 0) {
            const { data: submissionData, error: submissionError } = await supabase
                .from('submissions')
                .select('*')
                .eq('user_id', user.id)
                .in('problem_id', problemIds);
            if(submissionError) throw submissionError;

            const submissionMap = new Map<number, Submission>();
            submissionData.forEach(sub => submissionMap.set(sub.problem_id, sub));
            setSubmissions(submissionMap);
        }
      }

    } catch (err: any) {
      setError('Failed to load contest data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchContestData();
  }, [fetchContestData]);
  
  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProblem || !answer.trim() || !contest) return;

    const contestEndTime = new Date(new Date(contest.start_time).getTime() + contest.duration_minutes * 60000);
    if (new Date() > contestEndTime) {
        setSubmitStatus(prev => ({ ...prev, [activeProblem.id]: 'Contest has ended.' }));
        return;
    }

    setSubmitStatus(prev => ({ ...prev, [activeProblem.id]: 'submitting' }));

    const isCorrect = answer.trim().toLowerCase() === activeProblem.answer.toLowerCase();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        setSubmitStatus(prev => ({ ...prev, [activeProblem.id]: 'Error: User not found' }));
        return;
    }

    const { data, error } = await supabase.from('submissions').upsert({
      problem_id: activeProblem.id,
      user_id: user.id,
      answer: answer.trim(),
      is_correct: isCorrect,
    }, { onConflict: 'problem_id, user_id' }).select().single();

    if (error) {
        setSubmitStatus(prev => ({ ...prev, [activeProblem.id]: 'Error: ' + error.message }));
    } else {
        setSubmitStatus(prev => ({ ...prev, [activeProblem.id]: isCorrect ? 'Correct!' : 'Incorrect' }));
        if(data) {
            // Fix: Cast the returned data to the Submission type to resolve 'unknown' type error.
            const submission = data as Submission;
            const newSubmissions = new Map(submissions).set(activeProblem.id, submission);
            setSubmissions(newSubmissions);
            
            if (submission.is_correct) {
                const correctSubmissionsCount = Array.from(newSubmissions.values()).filter(s => s.is_correct).length;
                if (problems.length > 0 && correctSubmissionsCount === problems.length) {
                    setTimeout(() => {
                        alert("Congratulations! You've solved all problems. Your contest is now submitted.");
                        navigate(`/leaderboard/${id}`);
                    }, 1000);
                }
            }
        }
    }
    setAnswer('');
  };

  const handleTimeUp = useCallback(() => {
    alert("Time's up! Your contest has been automatically submitted.");
    navigate(`/leaderboard/${id}`);
  }, [navigate, id]);

  if (loading) return <div className="flex justify-center mt-10"><Spinner /></div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!contest) return <div className="text-center mt-10">Contest not found.</div>;

  const contestEndTime = new Date(new Date(contest.start_time).getTime() + contest.duration_minutes * 60000);
  const isContestActive = new Date() < contestEndTime && new Date() > new Date(contest.start_time);

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">{contest.name}</h1>
        {isContestActive && <Timer endTime={contestEndTime} onTimeUp={handleTimeUp} />}
        {!isContestActive && <div className="text-xl font-bold text-red-500">{new Date() > contestEndTime ? 'Contest Finished' : 'Contest Has Not Started'}</div>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <h3 className="font-bold text-lg mb-4">Problems</h3>
            <ul className="mb-6">
              {problems.map((prob) => (
                <li key={prob.id} className="mb-2">
                  <button
                    onClick={() => {
                        setActiveProblem(prob);
                        setAnswer('');
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors flex justify-between items-center ${activeProblem?.id === prob.id ? 'bg-primary-100 dark:bg-primary-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    <span className="truncate">{prob.title}</span>
                    {submissions.has(prob.id) && (
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${submissions.get(prob.id)?.is_correct ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                            {submissions.get(prob.id)?.is_correct ? '✓' : '✗'}
                        </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
            {isContestActive && <LeaderboardPreview contestId={contest.id} autoRefresh={true} />}
          </Card>
        </div>
        <div className="md:col-span-3">
          {activeProblem ? (
            <Card>
              <h2 className="text-2xl font-bold mb-4">{activeProblem.title}</h2>
              <div className="prose dark:prose-invert max-w-none mb-6" dangerouslySetInnerHTML={{ __html: activeProblem.statement }}></div>
              
              {isContestActive && !submissions.get(activeProblem.id)?.is_correct && (
                <form onSubmit={handleAnswerSubmit}>
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Your answer"
                    />
                    <button type="submit" className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors">
                        Submit
                    </button>
                </form>
              )}

              {submitStatus[activeProblem.id] && (
                <p className={`mt-4 font-semibold ${submitStatus[activeProblem.id] === 'Correct!' ? 'text-green-500' : 'text-red-500'}`}>{submitStatus[activeProblem.id]}</p>
              )}
              {submissions.get(activeProblem.id)?.is_correct && (
                <p className="mt-4 font-semibold text-green-500">You have solved this problem correctly!</p>
              )}
               {!isContestActive && (
                 <p className="mt-4 font-semibold text-yellow-500">The contest is not active for submissions.</p>
              )}
            </Card>
          ) : (
            <Card><p>Select a problem to begin.</p></Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestPage;