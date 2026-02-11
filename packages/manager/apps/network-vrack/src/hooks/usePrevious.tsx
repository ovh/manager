import { useEffect, useState } from 'react';

export default function usePrevious<T>(state: T): T | undefined {
  const [previousState, setPreviousState] = useState<T>(undefined as T);

  useEffect(() => {
    setPreviousState(state);
  }, [state]);

  return previousState;
}
