
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bqjbnadtujyyyvpfxaac.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxamJuYWR0dWp5eXl2cGZ4YWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMDQ3MzYsImV4cCI6MjA4Njc4MDczNn0.nsPUwKLONYhzjJ6YOsbVIV1BcezFrJ-PnxjpUMFG3fo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
