import { useEffect, useRef, useState } from "react";

// Smooth count-up animation for numbers using requestAnimationFrame.
export function useCountUp(target, { duration = 1400, delay = 0 } = {}) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    let raf;
    let timeoutId;
    let startTime;
    const numericTarget = Number(target) || 0;

    function step(now) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic for a natural settle
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(numericTarget * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
    }

    timeoutId = setTimeout(() => {
      startedRef.current = true;
      raf = requestAnimationFrame(step);
    }, delay);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [target, duration, delay]);

  return value;
}
