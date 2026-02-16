import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import SunIcon from '../icons/SunIcon';
import MoonIcon from '../icons/MoonIcon';
import { Theme } from '../../types';

// Fix: Removed React.FC as it's largely deprecated.
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      aria-label="Toggle theme"
    >
      {theme === Theme.Light ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};

export default ThemeToggle;