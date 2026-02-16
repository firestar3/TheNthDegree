import React, { useState } from 'react';
import { generateMathProblem } from '../services/geminiService';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

// Fix: Removed React.FC as it's largely deprecated.
const PracticeZonePage = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [problem, setProblem] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateProblem = async () => {
    setLoading(true);
    setError(null);
    setProblem(null);
    setCorrectAnswer(null);
    setUserAnswer('');
    setResult(null);

    try {
      const { problem, answer } = await generateMathProblem(difficulty);
      setProblem(problem);
      setCorrectAnswer(answer);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCheckAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctAnswer || !userAnswer.trim()) return;
    
    if (userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
      setResult('correct');
    } else {
      setResult('incorrect');
    }
  };

  return (
    <div className="container mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Practice Zone</h1>
      <Card>
        <div className="flex flex-col items-center">
          <p className="mb-4 text-gray-600 dark:text-gray-300">Select a difficulty and generate a new problem!</p>
          <div className="flex space-x-2 mb-6">
            {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${difficulty === d ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                {d}
              </button>
            ))}
          </div>
          <button
            onClick={handleGenerateProblem}
            disabled={loading}
            className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 w-full md:w-auto"
          >
            {loading ? <Spinner /> : 'Generate New Problem'}
          </button>
        </div>
      </Card>

      {error && <div className="text-center text-red-500 mt-6 p-4 bg-red-100 dark:bg-red-900 rounded-lg">{error}</div>}

      {problem && (
        <Card className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Your Problem:</h2>
          <div className="prose dark:prose-invert max-w-none mb-6" dangerouslySetInnerHTML={{ __html: problem }}></div>
          
          <form onSubmit={handleCheckAnswer}>
            <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your answer"
                disabled={result === 'correct'}
            />
            <button type="submit" className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors disabled:bg-gray-400" disabled={result === 'correct'}>
                Check Answer
            </button>
          </form>

          {result === 'correct' && (
            <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
              <h3 className="font-bold">Correct! Well done.</h3>
            </div>
          )}
          {result === 'incorrect' && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
              <h3 className="font-bold">Not quite. Try again!</h3>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default PracticeZonePage;