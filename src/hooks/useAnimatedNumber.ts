import { useState, useEffect } from 'react';

export function useAnimatedNumber(
  targetValue: number,
  duration = 800
): number {
  const [displayValue, setDisplayValue] = useState(targetValue);

  useEffect(() => {
    const startValue = displayValue;
    const startTime = performance.now();
    const difference = targetValue - startValue;

    if (difference === 0) return;

    let animationFrame: number;

    const updateValue = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + difference * easeOutQuart;

      setDisplayValue(Math.round(currentValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateValue);
      }
    };

    animationFrame = requestAnimationFrame(updateValue);

    return () => cancelAnimationFrame(animationFrame);
  }, [targetValue, duration]);

  return displayValue;
}
