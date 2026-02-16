
import { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  username: string;
  created_at: string;
}

export interface Contest {
  id: number;
  name: string;
  description: string;
  start_time: string;
  duration_minutes: number;
}

export interface Problem {
  id: number;
  contest_id: number;
  title: string;
  statement: string; // Markdown
  answer: string;
  points: number;
}

export interface Submission {
  id: number;
  problem_id: number;
  user_id: string;
  answer: string;
  is_correct: boolean;
  submitted_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  score: number;
  rank?: number;
  last_submission_time?: string;
}

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}
