import React from 'react';

// Fix: Removed React.FC as it's largely deprecated.
const Spinner = () => {
  return (
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
  );
};

export default Spinner;