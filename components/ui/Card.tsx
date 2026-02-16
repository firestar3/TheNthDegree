import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

// Fix: Added `children` to CardProps and removed deprecated React.FC to resolve typing errors.
const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
