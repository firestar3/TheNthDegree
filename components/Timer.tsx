import React, { useState, useEffect } from 'react';

interface TimerProps {
  endTime: Date;
  onTimeUp?: () => void;
}

// Fix: Removed React.FC as it's largely deprecated.
const Timer = ({ endTime, onTimeUp }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [timeUpFired, setTimeUpFired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime.getTime() - new Date().getTime();
      if (difference <= 0) {
        setTimeLeft('00:00:00');
        if (!timeUpFired && onTimeUp) {
          onTimeUp();
          setTimeUpFired(true);
        }
        return;
      }
      
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [endTime, onTimeUp, timeUpFired]);

  return (
    <div className="font-mono text-2xl font-bold bg-gray-200 dark:bg-gray-700 p-3 rounded-lg shadow-inner">
      {timeLeft}
    </div>
  );
};

export default Timer;