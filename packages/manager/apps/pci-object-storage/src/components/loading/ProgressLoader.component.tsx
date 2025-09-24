import { useEffect, useState } from 'react';

export default function ProgressLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        // Increment progress in a non-linear fashion for a more dynamic feel
        const increment = Math.random() * 20;
        const nextProgress = prevProgress + increment;
        if (nextProgress < 95) {
          return nextProgress;
        }
        clearInterval(interval); // Stop incrementing near 100% to mimic NProgress behavior
        return prevProgress;
      });
    }, 500); // Increase progress more frequently

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div
      className="w-full fixed top-0 left-0 z-50"
      data-testid="progressLoaderContainer"
    >
      <div
        data-testid="progressLoaderBar"
        style={{ width: `${progress}%` }}
        className="h-1 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all ease-in-out duration-200"
      ></div>
    </div>
  );
}
