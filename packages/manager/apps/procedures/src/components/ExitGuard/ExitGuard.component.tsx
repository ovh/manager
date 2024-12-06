import { useEffect } from 'react';

export default function ExitGuard(): null {
  useEffect(() => {
    const confirmExit = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // eslint-disable-next-line no-param-reassign
      event.returnValue = true;
    };
    window.addEventListener('beforeunload', confirmExit);

    return () => window.removeEventListener('beforeunload', confirmExit);
  }, []);

  return null;
}
