import { useEffect, useState } from 'react';

interface UseUserActivityProps {
  timeout: number;
  onInactive: () => void;
  onActive: () => void;
}
const useUserActivity = ({
  timeout,
  onInactive = () => {},
  onActive = () => {},
}: UseUserActivityProps) => {
  const [isActive, setIsActive] = useState(true);
  let activityTimeout: NodeJS.Timeout;

  const resetActivityTimeout = () => {
    clearTimeout(activityTimeout);
    setIsActive((oldVal) => {
      if (!oldVal) {
        onActive();
      }
      return true;
    });
    activityTimeout = setTimeout(() => {
      setIsActive(false);
      onInactive();
    }, timeout);
  };

  useEffect(() => {
    const handleActivity = () => resetActivityTimeout();

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('click', handleActivity);

    resetActivityTimeout(); // Initialize the timeout

    return () => {
      clearTimeout(activityTimeout);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [timeout]);

  return isActive;
};

export default useUserActivity;
