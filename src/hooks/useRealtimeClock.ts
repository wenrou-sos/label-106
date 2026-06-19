import { useState, useEffect } from 'react';

export function useRealtimeClock(updateInterval = 60000): Date {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, updateInterval);

    return () => clearInterval(timer);
  }, [updateInterval]);

  return now;
}
